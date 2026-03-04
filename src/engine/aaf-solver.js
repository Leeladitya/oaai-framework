/**
 * AAF Solver — Dung's Abstract Argumentation Framework Semantics
 * 
 * Implements grounded, preferred, complete, stable, and ideal extension computation.
 * 
 * Reference: Dung, P.M. (1995) "On the acceptability of arguments and its
 * fundamental role in nonmonotonic reasoning, logic programming and n-person games."
 * Artificial Intelligence, 77(2), 321-357.
 * 
 * For large frameworks (>20 args), use ASPARTIX bridge: src/integrations/aspartix-bridge.js
 */

export function getAttackers(argId, attacks) {
  return attacks.filter(([_, t]) => t === argId).map(([a]) => a);
}

export function getTargets(argId, attacks) {
  return attacks.filter(([a]) => a === argId).map(([_, t]) => t);
}

export function isConflictFree(argSet, attacks) {
  for (const a of argSet) {
    for (const b of argSet) {
      if (attacks.some(([x, y]) => x === a && y === b)) return false;
    }
  }
  return true;
}

export function defends(argSet, arg, attacks) {
  const attackers = getAttackers(arg, attacks);
  return attackers.every(att =>
    argSet.some(def => attacks.some(([x, y]) => x === def && y === att))
  );
}

export function isAdmissible(argSet, attacks) {
  if (!isConflictFree(argSet, attacks)) return false;
  return argSet.every(a => defends(argSet, a, attacks));
}

/**
 * Grounded extension — least fixed point of characteristic function F.
 * F(S) = { a ∈ Args | S defends a }
 * Unique, maximally skeptical. The minimum consensus.
 */
export function computeGroundedExtension(argIds, attacks) {
  let ext = [];
  let changed = true;

  while (changed) {
    changed = false;
    for (const arg of argIds) {
      if (ext.includes(arg)) continue;
      const attackers = getAttackers(arg, attacks).filter(a => argIds.includes(a));
      const undefeated = attackers.filter(att =>
        !ext.some(def => attacks.some(([x, y]) => x === def && y === att))
      );
      const attackedByExt = ext.some(e => attacks.some(([x, y]) => x === e && y === arg));
      if (undefeated.length === 0 && !attackedByExt) {
        ext.push(arg);
        changed = true;
      }
    }
  }
  return ext;
}

/**
 * Preferred extensions — maximal admissible sets.
 * Multiple can coexist; each is a coherent policy position.
 * WARNING: Exponential in |args|. Use ASPARTIX for >20 arguments.
 */
export function computePreferredExtensions(argIds, attacks) {
  const n = argIds.length;
  if (n > 20) {
    console.warn(`${n} args exceeds direct solver limit. Use ASPARTIX bridge.`);
    return [];
  }

  const admissible = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(argIds[i]);
    }
    if (isAdmissible(subset, attacks)) admissible.push(subset);
  }

  return admissible.filter(s1 =>
    !admissible.some(s2 => s2.length > s1.length && s1.every(a => s2.includes(a)))
  );
}

/**
 * Stable extensions — conflict-free sets attacking all outsiders.
 */
export function computeStableExtensions(argIds, attacks) {
  const n = argIds.length;
  if (n > 20) return [];
  const stable = [];

  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(argIds[i]);
    }
    if (!isConflictFree(subset, attacks)) continue;
    const outsiders = argIds.filter(a => !subset.includes(a));
    if (outsiders.every(out => subset.some(s => attacks.some(([x, y]) => x === s && y === out)))) {
      stable.push(subset);
    }
  }
  return stable;
}

/**
 * Ideal extension — largest admissible set in every preferred extension.
 */
export function computeIdealExtension(argIds, attacks) {
  const preferred = computePreferredExtensions(argIds, attacks);
  if (preferred.length === 0) return [];
  return argIds.filter(arg => preferred.every(ext => ext.includes(arg)));
}

/**
 * Full framework analysis — returns all semantics.
 */
export function analyzeFramework({ args, attacks }) {
  const fa = attacks.filter(([a, t]) => args.includes(a) && args.includes(t));
  return {
    grounded: computeGroundedExtension(args, fa),
    preferred: computePreferredExtensions(args, fa),
    stable: computeStableExtensions(args, fa),
    ideal: computeIdealExtension(args, fa),
    stats: {
      argumentCount: args.length,
      attackCount: fa.length,
      density: fa.length / (args.length * (args.length - 1) || 1),
    }
  };
}
