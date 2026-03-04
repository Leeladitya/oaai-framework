/**
 * VAF Solver — Bench-Capon's Value-Based Argumentation Frameworks (2003)
 * 
 * Extends Dung's AAF by mapping arguments to values they promote,
 * computing extensions relative to value orderings (audiences).
 * An attack succeeds only if the attacker's value ≥ target's value for the audience.
 * 
 * Reference: Bench-Capon, T.J.M. (2003) "Persuasion in Practical Argument
 * Using Value-based Argumentation Frameworks." J. Logic and Computation, 13(3).
 * 
 * @module engine/vaf-solver
 */

import { computeGroundedExtension, computePreferredExtensions } from './aaf-solver';

export function filterAttacksByValues(attacks, argValues, valueOrdering) {
  return attacks.filter(([attacker, target]) => {
    const aVal = argValues[attacker];
    const tVal = argValues[target];
    if (!aVal || !tVal) return true;
    const aRank = valueOrdering.indexOf(aVal);
    const tRank = valueOrdering.indexOf(tVal);
    if (aRank === -1 || tRank === -1) return true;
    return aRank <= tRank; // lower index = higher preference
  });
}

export function computeAudienceExtensions(vaf, valueOrdering) {
  const effectiveAttacks = filterAttacksByValues(vaf.attacks, vaf.argValues, valueOrdering);
  return {
    grounded: computeGroundedExtension(vaf.args, effectiveAttacks),
    preferred: computePreferredExtensions(vaf.args, effectiveAttacks),
    effectiveAttacks,
    valueOrdering,
  };
}

export function isObjectivelyAcceptable(argId, vaf) {
  const orderings = generateAllOrderings(vaf.values);
  return orderings.every(ordering => {
    const result = computeAudienceExtensions(vaf, ordering);
    return result.preferred.some(ext => ext.includes(argId));
  });
}

export function isSubjectivelyAcceptable(argId, vaf) {
  const orderings = generateAllOrderings(vaf.values);
  return orderings.some(ordering => {
    const result = computeAudienceExtensions(vaf, ordering);
    return result.preferred.some(ext => ext.includes(argId));
  });
}

export function generateAllOrderings(values) {
  if (values.length <= 1) return [values];
  const result = [];
  for (let i = 0; i < values.length; i++) {
    const rest = [...values.slice(0, i), ...values.slice(i + 1)];
    for (const perm of generateAllOrderings(rest)) {
      result.push([values[i], ...perm]);
    }
  }
  return result;
}

export const AUDIENCE_PROFILES = {
  creator_advocate: {
    label: "Creator Advocate",
    desc: "Prioritizes creator rights and innovation incentives",
    ordering: ["creator_rights","innovation","property_rights","personal_responsibility","coherence","fairness","legal_integrity","public_access","public_safety","rule_of_law"],
  },
  public_interest: {
    label: "Public Interest Advocate",
    desc: "Prioritizes public access, safety, and rule of law",
    ordering: ["public_safety","public_access","rule_of_law","fairness","legal_integrity","coherence","personal_responsibility","innovation","creator_rights","property_rights"],
  },
  legal_purist: {
    label: "Legal Scholar",
    desc: "Prioritizes legal integrity and coherence above policy outcomes",
    ordering: ["legal_integrity","coherence","rule_of_law","fairness","public_safety","public_access","personal_responsibility","creator_rights","innovation","property_rights"],
  },
  industry: {
    label: "Industry Representative",
    desc: "Prioritizes innovation, property rights, and investment incentives",
    ordering: ["innovation","property_rights","creator_rights","personal_responsibility","fairness","coherence","legal_integrity","rule_of_law","public_access","public_safety"],
  },
  regulator: {
    label: "Government Regulator",
    desc: "Prioritizes public safety, accountability, and traceability",
    ordering: ["public_safety","rule_of_law","fairness","coherence","legal_integrity","personal_responsibility","public_access","innovation","creator_rights","property_rights"],
  },
};

export function analyzeAllAudiences(vaf) {
  const results = {};
  for (const [key, profile] of Object.entries(AUDIENCE_PROFILES)) {
    results[key] = { ...profile, ...computeAudienceExtensions(vaf, profile.ordering) };
  }
  return results;
}
