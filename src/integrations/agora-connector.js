/**
 * Agora Connector — Interface to Devudaaa's Agora Decision Arena
 * 
 * Agora is the governance engine that uses Dung's AAF for structured
 * policy deliberation. This connector provides:
 * - Argument submission API
 * - Extension query interface
 * - Decision Arena session management
 * 
 * @module integrations/agora-connector
 */

import { analyzeFramework } from '../engine/aaf-solver';
import { analyzeAllAudiences, AUDIENCE_PROFILES } from '../engine/vaf-solver';
import ARGUMENTS, { VALUES } from '../engine/arguments';
import { getAttackPairs } from '../engine/attacks';

/**
 * Agora Decision Arena session
 * Manages a live argumentation session with stakeholder participation
 */
export class AgoraSession {
  constructor(config = {}) {
    this.id = config.id || `agora_${Date.now()}`;
    this.title = config.title || 'OAAI Policy Deliberation';
    this.arguments = { ...ARGUMENTS };
    this.attacks = getAttackPairs();
    this.customArgs = {};
    this.customAttacks = [];
    this.participants = [];
    this.history = [];
    this.createdAt = new Date().toISOString();
  }

  /**
   * Add a participant (stakeholder) to the session
   * @param {Object} participant - { id, name, role, valueOrdering }
   */
  addParticipant(participant) {
    this.participants.push({
      ...participant,
      joinedAt: new Date().toISOString(),
    });
    this.log('participant_joined', participant);
  }

  /**
   * Submit a new argument to the arena
   * @param {Object} arg - { id, label, desc, category, value, source }
   * @param {string} submittedBy - Participant ID
   * @returns {Object} Updated analysis
   */
  submitArgument(arg, submittedBy) {
    this.customArgs[arg.id] = { ...arg, submittedBy, submittedAt: new Date().toISOString() };
    this.log('argument_submitted', { arg, submittedBy });
    return this.analyze();
  }

  /**
   * Submit an attack relation
   * @param {string} attacker - Attacking argument ID
   * @param {string} target - Target argument ID
   * @param {string} reasoning - Justification for the attack
   * @param {string} submittedBy - Participant ID
   */
  submitAttack(attacker, target, reasoning, submittedBy) {
    this.customAttacks.push([attacker, target]);
    this.log('attack_submitted', { attacker, target, reasoning, submittedBy });
    return this.analyze();
  }

  /**
   * Run full analysis on current state
   * @returns {Object} Complete analysis results
   */
  analyze() {
    const allArgs = { ...this.arguments, ...this.customArgs };
    const argIds = Object.keys(allArgs);
    const allAttacks = [...this.attacks, ...this.customAttacks]
      .filter(([a, t]) => argIds.includes(a) && argIds.includes(t));

    // Standard AAF analysis
    const aafResult = analyzeFramework({ args: argIds, attacks: allAttacks });

    // VAF analysis per audience profile
    const argValues = {};
    for (const [id, arg] of Object.entries(allArgs)) {
      argValues[id] = arg.value;
    }
    const vaf = { args: argIds, attacks: allAttacks, argValues, values: Object.keys(VALUES) };
    const audienceResults = analyzeAllAudiences(vaf);

    // Per-participant analysis
    const participantResults = {};
    for (const p of this.participants) {
      if (p.valueOrdering) {
        const { computeAudienceExtensions } = require('../engine/vaf-solver');
        participantResults[p.id] = computeAudienceExtensions(vaf, p.valueOrdering);
      }
    }

    const result = {
      sessionId: this.id,
      timestamp: new Date().toISOString(),
      aaf: aafResult,
      audiences: audienceResults,
      participants: participantResults,
      summary: {
        consensus: aafResult.grounded,
        numPositions: aafResult.preferred.length,
        totalArguments: argIds.length,
        totalAttacks: allAttacks.length,
      },
    };

    this.log('analysis_computed', result.summary);
    return result;
  }

  /**
   * Export session for audit trail
   * @returns {Object} Full session data
   */
  export() {
    return {
      id: this.id,
      title: this.title,
      createdAt: this.createdAt,
      arguments: { ...this.arguments, ...this.customArgs },
      attacks: [...this.attacks, ...this.customAttacks],
      participants: this.participants,
      history: this.history,
      finalAnalysis: this.analyze(),
    };
  }

  log(event, data) {
    this.history.push({ event, data, timestamp: new Date().toISOString() });
  }
}

/**
 * Quick analysis — run the OAAI framework without session management
 * @returns {Object} Full analysis results
 */
export function quickAnalysis() {
  const argIds = Object.keys(ARGUMENTS);
  const attacks = getAttackPairs();
  return analyzeFramework({ args: argIds, attacks });
}
