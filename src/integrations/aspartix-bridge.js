/**
 * ASPARTIX Bridge — Interface to external ASP solvers
 * 
 * For frameworks exceeding 20 arguments, the JavaScript solver
 * is insufficient. This bridge delegates computation to:
 * - ASPARTIX-V19 (Egly, Gaggl, Woltran 2008)
 * - clingo (Potassco suite)
 * 
 * In browser context: generates downloadable .lp files
 * In Node.js context: spawns solver process directly
 * 
 * @module integrations/aspartix-bridge
 */

import { encodeAsASP, generateFullEncoding, encodeAsICCMA } from '../engine/asp-encoder';

/**
 * Check if we're running in Node.js (can execute solver)
 * or browser (can only generate files)
 */
const IS_NODE = typeof process !== 'undefined' && process.versions?.node;

/**
 * Generate solver-ready encoding and return as string
 * 
 * @param {string[]} args - Argument identifiers
 * @param {Array<[string, string]>} attacks - Attack relations
 * @param {'grounded'|'preferred'|'stable'} semantics
 * @returns {string} ASP encoding ready for solver
 */
export function generateEncoding(args, attacks, semantics = 'grounded') {
  return generateFullEncoding(args, attacks, semantics);
}

/**
 * Generate ICCMA-compatible .apx file content
 * @param {string[]} args
 * @param {Array<[string, string]>} attacks
 * @returns {string}
 */
export function generateICCMAFile(args, attacks) {
  return encodeAsICCMA(args, attacks);
}

/**
 * Execute solver via Node.js child_process (server-side only)
 * 
 * Requires clingo installed: https://potassco.org/clingo/
 * Install: conda install -c potassco clingo
 * 
 * @param {string} encoding - ASP encoding string
 * @param {Object} options - Solver options
 * @returns {Promise<Object>} Solver results
 */
export async function executeSolver(encoding, options = {}) {
  if (!IS_NODE) {
    throw new Error(
      'ASPARTIX bridge: solver execution requires Node.js environment. ' +
      'In browser, use generateEncoding() to produce .lp files for manual execution.'
    );
  }

  const { execSync } = require('child_process');
  const fs = require('fs');
  const path = require('path');
  const os = require('os');

  const {
    solver = 'clingo',
    numModels = 0, // 0 = all models
    timeout = 30,  // seconds
  } = options;

  // Write encoding to temp file
  const tmpFile = path.join(os.tmpdir(), `oaai_${Date.now()}.lp`);
  fs.writeFileSync(tmpFile, encoding);

  try {
    const cmd = `${solver} ${tmpFile} ${numModels} --time-limit=${timeout}`;
    const result = execSync(cmd, { encoding: 'utf-8', timeout: timeout * 1000 });
    
    // Parse clingo output
    const extensions = parseCligoOutput(result);
    
    return {
      success: true,
      extensions,
      rawOutput: result,
      solver,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      solver,
    };
  } finally {
    try { fs.unlinkSync(tmpFile); } catch (e) { /* ignore */ }
  }
}

/**
 * Parse clingo output into extension sets
 * @param {string} output - Raw clingo output
 * @returns {string[][]} Array of extensions
 */
function parseCligoOutput(output) {
  const extensions = [];
  const lines = output.split('\n');
  
  for (const line of lines) {
    const matches = line.match(/in\((\w+)\)/g);
    if (matches) {
      const ext = matches.map(m => m.match(/in\((\w+)\)/)[1]);
      extensions.push(ext);
    }
  }
  
  return extensions;
}

/**
 * Create a downloadable .lp file (browser context)
 * @param {string} encoding
 * @param {string} filename
 * @returns {string} Data URL for download
 */
export function createDownloadableFile(encoding, filename = 'oaai-framework.lp') {
  if (IS_NODE) {
    const fs = require('fs');
    fs.writeFileSync(filename, encoding);
    return filename;
  }
  
  // Browser: return blob URL
  const blob = new Blob([encoding], { type: 'text/plain' });
  return URL.createObjectURL(blob);
}
