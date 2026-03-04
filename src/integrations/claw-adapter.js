/**
 * Claw Adapter — Integration with Devudaaa's Claw AI Governance Pipeline
 * 
 * Claw argues before making decisions. This adapter enables Claw to:
 * 1. Construct argumentation frameworks for governance decisions
 * 2. Compute extensions to identify defensible positions
 * 3. Generate decision justifications traceable to argument structure
 * 
 * Claw integration point: Before any AI governance decision, Claw
 * invokes this adapter to build and evaluate the relevant framework.
 * 
 * @module integrations/claw-adapter
 */

import { analyzeFramework } from '../engine/aaf-solver';
import ARGUMENTS from '../engine/arguments';
import { getAttackPairs } from '../engine/attacks';

/**
 * Claw decision request format
 * @typedef {Object} ClawDecisionRequest
 * @property {string} context - Description of the governance decision
 * @property {string[]} relevantArgs - Argument IDs relevant to this decision
 * @property {Object} [customArgs] - Additional arguments specific to this case
 * @property {Array} [customAttacks] - Additional attack relations
 */

/**
 * Claw decision response format
 * @typedef {Object} ClawDecisionResponse
 * @property {string[]} groundedPosition - Arguments in grounded extension (minimum consensus)
 * @property {string[][]} defensiblePositions - Preferred extensions (coherent options)
 * @property {string} recommendation - Decision recommendation with justification
 * @property {Object} justificationChain - Full audit trail
 */

/**
 * Process a governance decision through the Claw argumentation pipeline
 * 
 * @param {ClawDecisionRequest} request
 * @returns {ClawDecisionResponse}
 */
export function processDecision(request) {
  const { context, relevantArgs, customArgs = {}, customAttacks = [] } = request;

  // Build framework from base + custom arguments
  const allArgs = { ...ARGUMENTS, ...customArgs };
  const argIds = relevantArgs.filter(id => allArgs[id]);
  const baseAttacks = getAttackPairs().filter(
    ([a, t]) => argIds.includes(a) && argIds.includes(t)
  );
  const attacks = [...baseAttacks, ...customAttacks];

  // Compute extensions
  const analysis = analyzeFramework({ args: argIds, attacks });

  // Generate recommendation based on grounded extension
  const groundedArgs = analysis.grounded.map(id => allArgs[id]);
  const recommendation = generateRecommendation(context, groundedArgs, analysis);

  return {
    context,
    groundedPosition: analysis.grounded,
    defensiblePositions: analysis.preferred,
    stablePositions: analysis.stable,
    recommendation,
    justificationChain: {
      inputArguments: argIds.map(id => ({ id, ...allArgs[id] })),
      attackRelations: attacks.map(([a, t]) => ({ attacker: a, target: t })),
      groundedExtension: analysis.grounded,
      preferredExtensions: analysis.preferred,
      timestamp: new Date().toISOString(),
      frameworkVersion: "0.1.0",
    },
  };
}

/**
 * Generate natural language recommendation from extension analysis
 */
function generateRecommendation(context, groundedArgs, analysis) {
  const principles = groundedArgs.map(a => a.label || a.id).join('; ');
  const numPositions = analysis.preferred.length;

  return {
    consensus: `The grounded extension identifies ${analysis.grounded.length} arguments that survive all challenges: ${principles}.`,
    contested: `There are ${numPositions} coherent but distinct policy positions (preferred extensions) that resolve contested arguments differently.`,
    action: analysis.grounded.length > 0
      ? `Any decision must respect the grounded principles. Choice between preferred extensions depends on the value ordering of the decision-maker.`
      : `No uncontested consensus exists. The decision-maker must choose between ${numPositions} internally consistent positions.`,
  };
}

/**
 * Claw pre-decision hook — call before any governance action
 * 
 * Usage in Claw pipeline:
 *   const decision = clawAdapter.preDecisionCheck(governanceAction);
 *   if (decision.groundedPosition.includes('c1')) {
 *     // Consistent attribution required — enforce ownership-accountability link
 *   }
 * 
 * @param {Object} governanceAction - The pending governance action
 * @returns {ClawDecisionResponse}
 */
export function preDecisionCheck(governanceAction) {
  // Map governance action type to relevant arguments
  const argMapping = {
    ownership_claim: ['a1', 'a2', 'a3', 'a4', 'a5', 'c1', 'c2', 'c3'],
    liability_assessment: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'c1', 'c2'],
    content_moderation: ['b1', 'b2', 'b3', 'b4', 'b6'],
    deepfake_response: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'c1'],
    full_assessment: Object.keys(ARGUMENTS),
  };

  const relevantArgs = argMapping[governanceAction.type] || argMapping.full_assessment;

  return processDecision({
    context: governanceAction.description || governanceAction.type,
    relevantArgs,
  });
}
