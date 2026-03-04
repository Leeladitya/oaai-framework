/**
 * Prediction Engine — Maps case facts through the framework
 * to generate predictions, then compares against actual outcomes.
 * @module stress-test/predictor
 */

import { computeGroundedExtension, computePreferredExtensions } from '../engine/aaf-solver';
import ARGUMENTS from '../engine/arguments';
import { getAttackPairs } from '../engine/attacks';

/**
 * Run a case through the framework
 * @param {Object} caseData - Case from cases.js
 * @returns {Object} Prediction result
 */
export function predictCase(caseData) {
  const { activeArgs, humanControl } = caseData.frameworkInput;
  const allArgs = Object.keys(ARGUMENTS);
  const attacks = getAttackPairs();

  const grounded = computeGroundedExtension(allArgs, attacks);
  const preferred = computePreferredExtensions(allArgs, attacks);

  // Determine which arguments from the case are in grounded vs preferred
  const inGrounded = activeArgs.filter(a => grounded.includes(a));
  const inPreferred = preferred.map(ext => activeArgs.filter(a => ext.includes(a)));

  // Determine ownership/accountability based on human control level
  let ownershipPrediction, accountabilityPrediction;

  if (humanControl < 0.2) {
    ownershipPrediction = "no_copyright";
    accountabilityPrediction = "developer_primary";
  } else if (humanControl < 0.5) {
    ownershipPrediction = "partial_copyright";
    accountabilityPrediction = "shared";
  } else if (humanControl < 0.8) {
    ownershipPrediction = "value_dependent";
    accountabilityPrediction = "user_primary_shared";
  } else {
    ownershipPrediction = "full_copyright_likely";
    accountabilityPrediction = "user_full";
  }

  return {
    caseId: caseData.id,
    inGrounded,
    inPreferred,
    humanControl,
    ownershipPrediction,
    accountabilityPrediction,
    groundedExtension: grounded,
  };
}

/**
 * Run all cases and compute accuracy
 * @param {Array} cases
 * @returns {Object} Aggregate results
 */
export function runAllCases(cases) {
  const results = cases.map(c => ({
    ...predictCase(c),
    match: c.match,
    actualOutcome: c.actualOutcome,
  }));

  return {
    results,
    total: results.length,
    matches: results.filter(r => r.match).length,
    accuracy: results.filter(r => r.match).length / results.length,
  };
}
