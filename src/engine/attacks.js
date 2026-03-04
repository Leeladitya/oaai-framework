/**
 * Attack Relations for the AI Ownership-Accountability Framework
 * 
 * Each attack is grounded in a specific logical conflict between arguments.
 * Format: [attacker, target, reasoning]
 * 
 * @module engine/attacks
 */

const ATTACKS = [
  ["a2", "a1", "If AI generates expression autonomously, then human did not author it via prompt"],
  ["a3", "a1", "If prompts are ideas not expression, then prompting cannot constitute authorship"],
  ["a4", "a2", "If selection/arrangement is creative, then human contribution exists beyond autonomous AI generation"],
  ["a5", "a1", "If AI needs no incentive, then granting copyright via prompts serves no constitutional purpose"],
  ["a5", "a6", "If AI needs no incentive, then investment incentive argument for copyright is undermined"],
  ["a6", "a5", "If denying copyright disincentivizes human investment, then some protection may be warranted"],
  ["a6", "a7", "If investment incentive matters, then public domain maximization is too absolute"],
  ["a7", "a1", "Public domain maximizes access; opposes exclusive ownership claims via prompting"],
  ["a7", "a6", "If public domain is optimal, then investment incentive argument is outweighed"],
  ["b1", "b2", "If users bear full accountability, then developer accountability is reduced"],
  ["b2", "b1", "If developers created the capable system, then full user accountability is incomplete"],
  ["b5", "b1", "Unforeseeable AI behavior limits the scope of user accountability"],
  ["c1", "c3", "If ownership necessitates accountability, then the separability thesis fails"],
  ["c3", "c1", "If ownership and accountability are separable, then consistent attribution is unnecessary"],
];

export function getAttackPairs() {
  return ATTACKS.map(([a, t]) => [a, t]);
}

export function getAttackDetails() {
  return ATTACKS.map(([attacker, target, reasoning]) => ({ attacker, target, reasoning }));
}

export default ATTACKS;
