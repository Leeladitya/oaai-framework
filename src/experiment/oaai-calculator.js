/**
 * OAAI Calculator — Ownership-Attribution Asymmetry Index
 * 
 * The OAAI measures the gap between ownership claims (positive outcomes)
 * and accountability acceptance (negative outcomes) across scenarios.
 * 
 * OAAI = mean(ownership_score - accountability_score) across all scenarios
 * 
 * Interpretation:
 *   OAAI > 0  → Asymmetry exists (ownership > accountability)
 *   OAAI = 0  → Consistent attribution
 *   OAAI < 0  → Reverse asymmetry (accountability > ownership)
 * 
 * @module experiment/oaai-calculator
 */

/**
 * Compute OAAI from participant responses
 * @param {Object} responses - Map of scenario_id + "_pos"/"_neg" to Likert score (1-7)
 * @param {Array} scenarios - Scenario definitions
 * @returns {Object} OAAI results
 */
export function computeOAAI(responses, scenarios) {
  const gaps = [];
  const scenarioResults = [];

  for (const scenario of scenarios) {
    const posKey = `${scenario.id}_pos`;
    const negKey = `${scenario.id}_neg`;
    const pos = responses[posKey];
    const neg = responses[negKey];

    if (pos !== undefined && neg !== undefined) {
      const gap = pos - neg;
      gaps.push(gap);
      scenarioResults.push({
        id: scenario.id,
        title: scenario.title,
        domain: scenario.domain,
        ownershipClaim: pos,
        accountabilityAcceptance: neg,
        gap,
      });
    }
  }

  if (gaps.length === 0) {
    return { oaai: null, completedScenarios: 0, scenarioResults: [] };
  }

  const oaai = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const variance = gaps.reduce((sum, g) => sum + Math.pow(g - oaai, 2), 0) / gaps.length;
  const stdDev = Math.sqrt(variance);

  // Cohen's d (effect size) — treating pos and neg as paired samples
  const posMean = scenarioResults.reduce((s, r) => s + r.ownershipClaim, 0) / scenarioResults.length;
  const negMean = scenarioResults.reduce((s, r) => s + r.accountabilityAcceptance, 0) / scenarioResults.length;
  const pooledSD = Math.sqrt(
    (scenarioResults.reduce((s, r) => s + Math.pow(r.ownershipClaim - posMean, 2), 0) +
     scenarioResults.reduce((s, r) => s + Math.pow(r.accountabilityAcceptance - negMean, 2), 0)) /
    (2 * scenarioResults.length - 2)
  );
  const cohensD = pooledSD > 0 ? (posMean - negMean) / pooledSD : 0;

  return {
    oaai: Math.round(oaai * 100) / 100,
    variance: Math.round(variance * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
    cohensD: Math.round(cohensD * 100) / 100,
    completedScenarios: gaps.length,
    totalScenarios: scenarios.length,
    scenarioResults,
    interpretation: oaai > 0.5
      ? "Strong asymmetry: ownership claims significantly exceed accountability acceptance"
      : oaai > 0
      ? "Moderate asymmetry detected"
      : oaai === 0
      ? "No asymmetry: consistent attribution"
      : "Reverse asymmetry: accountability exceeds ownership claims",
  };
}

/**
 * Aggregate OAAI across multiple participants
 * @param {Array<Object>} participantResults - Array of computeOAAI results
 * @returns {Object} Aggregate statistics
 */
export function aggregateOAAI(participantResults) {
  const validResults = participantResults.filter(r => r.oaai !== null);
  if (validResults.length === 0) return null;

  const oaaiValues = validResults.map(r => r.oaai);
  const mean = oaaiValues.reduce((a, b) => a + b, 0) / oaaiValues.length;
  const variance = oaaiValues.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / oaaiValues.length;
  const se = Math.sqrt(variance / oaaiValues.length); // standard error
  const tStat = se > 0 ? mean / se : 0; // one-sample t-test against H0: OAAI = 0

  return {
    n: validResults.length,
    meanOAAI: Math.round(mean * 100) / 100,
    variance: Math.round(variance * 100) / 100,
    standardError: Math.round(se * 100) / 100,
    tStatistic: Math.round(tStat * 100) / 100,
    significant: Math.abs(tStat) > 1.96, // p < 0.05 approximation
    meanCohensD: Math.round(
      validResults.reduce((s, r) => s + r.cohensD, 0) / validResults.length * 100
    ) / 100,
  };
}
