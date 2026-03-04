/**
 * Engine Module — exports all AAF computation tools
 * @module engine
 */

export {
  getAttackers,
  getTargets,
  isConflictFree,
  defends,
  isAdmissible,
  computeGroundedExtension,
  computePreferredExtensions,
  computeCompleteExtensions,
  computeStableExtensions,
  computeIdealExtension,
  analyzeFramework,
} from './aaf-solver';

export {
  filterAttacksByValues,
  computeAudienceExtensions,
  isObjectivelyAcceptable,
  isSubjectivelyAcceptable,
  AUDIENCE_PROFILES,
  analyzeAllAudiences,
} from './vaf-solver';

export {
  encodeAsASP,
  generateFullEncoding,
  encodeAsICCMA,
} from './asp-encoder';

export { default as ARGUMENTS, VALUES, CATEGORIES } from './arguments';
export { default as ATTACKS, getAttackPairs, getAttackDetails } from './attacks';
