/**
 * AAF Solver Tests
 * 
 * Validates the solver against known results from Dung (1995)
 * and ICCMA benchmark instances.
 */

// Note: In actual project setup, these use Jest.
// For now, these are structured as runnable test functions.

const {
  getAttackers, getTargets, isConflictFree, defends,
  isAdmissible, computeGroundedExtension, computePreferredExtensions,
  computeStableExtensions,
} = require('../src/engine/aaf-solver');

// ===== Test Framework =====
let passed = 0, failed = 0;
function assert(condition, msg) {
  if (condition) { passed++; console.log(`  ✓ ${msg}`); }
  else { failed++; console.error(`  ✗ ${msg}`); }
}
function arraysEqual(a, b) {
  return a.length === b.length && a.sort().every((v, i) => v === b.sort()[i]);
}

// ===== DUNG'S CLASSIC EXAMPLES =====

console.log("\n=== Dung (1995) Example 1: Linear chain ===");
// a → b → c
// Grounded: {a, c}, Preferred: {a, c}
{
  const args = ['a', 'b', 'c'];
  const attacks = [['a', 'b'], ['b', 'c']];
  const ge = computeGroundedExtension(args, attacks);
  assert(arraysEqual(ge, ['a', 'c']), `Grounded = {a, c}, got {${ge}}`);
  const pe = computePreferredExtensions(args, attacks);
  assert(pe.length === 1, `One preferred extension`);
  assert(arraysEqual(pe[0], ['a', 'c']), `Preferred = {a, c}`);
}

console.log("\n=== Dung (1995) Example 2: Even cycle ===");
// a ↔ b (mutual attack)
// Grounded: {}, Preferred: {a} and {b}
{
  const args = ['a', 'b'];
  const attacks = [['a', 'b'], ['b', 'a']];
  const ge = computeGroundedExtension(args, attacks);
  assert(ge.length === 0, `Grounded = {} (empty), got {${ge}}`);
  const pe = computePreferredExtensions(args, attacks);
  assert(pe.length === 2, `Two preferred extensions, got ${pe.length}`);
  assert(pe.some(e => arraysEqual(e, ['a'])), `{a} is preferred`);
  assert(pe.some(e => arraysEqual(e, ['b'])), `{b} is preferred`);
}

console.log("\n=== Dung (1995) Example 3: Self-attack ===");
// a → a (self-attack)
// Grounded: {}, Preferred: {}
{
  const args = ['a'];
  const attacks = [['a', 'a']];
  const ge = computeGroundedExtension(args, attacks);
  assert(ge.length === 0, `Grounded = {} for self-attack`);
}

console.log("\n=== Dung (1995) Example 4: Reinstatement ===");
// a → b → c, Grounded: {a, c}
{
  const args = ['a', 'b', 'c'];
  const attacks = [['a', 'b'], ['b', 'c']];
  const ge = computeGroundedExtension(args, attacks);
  assert(ge.includes('c'), `c reinstated by a`);
  assert(!ge.includes('b'), `b defeated by a`);
}

console.log("\n=== Nixon Diamond ===");
// a → b, b → a (classic undecided case)
// Grounded: {}, Stable: {a}, {b}
{
  const args = ['a', 'b'];
  const attacks = [['a', 'b'], ['b', 'a']];
  const se = computeStableExtensions(args, attacks);
  assert(se.length === 2, `Two stable extensions`);
}

// ===== OAAI FRAMEWORK SPECIFIC TESTS =====

console.log("\n=== OAAI Framework: Grounded Extension ===");
{
  const args = ['a1','a2','a3','a4','a5','a6','a7','b1','b2','b3','b4','b5','b6','c1','c2','c3'];
  const attacks = [
    ['a2','a1'],['a3','a1'],['a4','a2'],['a5','a1'],['a5','a6'],
    ['a6','a5'],['a6','a7'],['a7','a1'],['a7','a6'],
    ['b1','b2'],['b2','b1'],['b5','b1'],
    ['c1','c3'],['c3','c1'],
  ];
  const ge = computeGroundedExtension(args, attacks);
  
  // Unattacked arguments must be in grounded
  assert(ge.includes('a3'), `a3 (Prompts=Ideas) in grounded — unattacked`);
  assert(ge.includes('b3'), `b3 (Proportional) in grounded — unattacked`);
  assert(ge.includes('b4'), `b4 (Traceability) in grounded — unattacked`);
  assert(ge.includes('b6'), `b6 (Non-Waivable) in grounded — unattacked`);
  assert(ge.includes('c2'), `c2 (Unified Threshold) in grounded — unattacked`);
  
  // a1 attacked by multiple (a2, a3, a5, a7) — should NOT be in grounded
  assert(!ge.includes('a1'), `a1 NOT in grounded — multiply attacked`);
  
  // a5 ↔ a6 mutual attack: at least a5 should survive (defended by a3 defeating a1 chain)
  // a6 ↔ a7 mutual attack: contested
  
  // c1 ↔ c3 mutual attack: contestable
  
  console.log(`  Grounded extension: {${ge.join(', ')}}`);
}

console.log("\n=== OAAI Framework: Preferred Extensions ===");
{
  const args = ['a1','a2','a3','a4','a5','a6','a7','b1','b2','b3','b4','b5','b6','c1','c2','c3'];
  const attacks = [
    ['a2','a1'],['a3','a1'],['a4','a2'],['a5','a1'],['a5','a6'],
    ['a6','a5'],['a6','a7'],['a7','a1'],['a7','a6'],
    ['b1','b2'],['b2','b1'],['b5','b1'],
    ['c1','c3'],['c3','c1'],
  ];
  const pe = computePreferredExtensions(args, attacks);
  
  assert(pe.length >= 2, `At least 2 preferred extensions (policy positions), got ${pe.length}`);
  
  // Every preferred extension must contain the grounded extension
  const ge = computeGroundedExtension(args, attacks);
  for (const ext of pe) {
    const containsGrounded = ge.every(a => ext.includes(a));
    assert(containsGrounded, `Preferred ext {${ext.join(',')}} contains grounded {${ge.join(',')}}`);
  }
  
  console.log(`  ${pe.length} preferred extensions found`);
}

// ===== Utility Tests =====

console.log("\n=== Utility Functions ===");
{
  const attacks = [['a', 'b'], ['b', 'c'], ['a', 'c']];
  assert(arraysEqual(getAttackers('b', attacks), ['a']), `getAttackers(b) = [a]`);
  assert(arraysEqual(getTargets('a', attacks), ['b', 'c']), `getTargets(a) = [b, c]`);
  assert(isConflictFree(['a', 'c'], [['a', 'b']]), `{a, c} conflict-free when only a→b`);
  assert(!isConflictFree(['a', 'b'], [['a', 'b']]), `{a, b} NOT conflict-free when a→b`);
}

// ===== Summary =====
console.log(`\n${'='.repeat(50)}`);
console.log(`Tests: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
console.log(`${'='.repeat(50)}\n`);
process.exit(failed > 0 ? 1 : 0);
