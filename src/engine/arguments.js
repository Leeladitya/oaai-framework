/**
 * Argument Definitions for the AI Ownership-Accountability Framework
 * 
 * Every argument grounded in published legal, philosophical, or empirical source.
 * Categories: ownership | accountability | bridge
 */

const ARGUMENTS = {
  a1: { id: "a1", label: "Prompt = Authorship", desc: "Human authored the prompt, therefore human owns output", category: "ownership", value: "creator_rights", source: "Li v. Liu (Beijing Internet Court, 2023); Lockean labor theory", jurisdiction: "China" },
  a2: { id: "a2", label: "AI = Autonomous Creator", desc: "AI generated expression autonomously; no human author exists", category: "ownership", value: "legal_integrity", source: "Thaler v. Perlmutter (D.C. Cir. 2025); Feist standard", jurisdiction: "United States" },
  a3: { id: "a3", label: "Prompts = Ideas", desc: "Prompts are unprotectable ideas, not copyrightable expression", category: "ownership", value: "legal_integrity", source: "USCO Zarya of the Dawn (2023); idea/expression dichotomy", jurisdiction: "United States" },
  a4: { id: "a4", label: "Selection = Expression", desc: "Human selection and arrangement of AI output constitutes creative expression", category: "ownership", value: "creator_rights", source: "USCO Zarya (arrangement protected); compilations doctrine", jurisdiction: "United States" },
  a5: { id: "a5", label: "No Incentive Needed", desc: "Copyright incentivizes creation; AI needs no incentive", category: "ownership", value: "legal_integrity", source: "Thaler: 'machines do not respond to economic incentives'; Art. I §8 cl. 8", jurisdiction: "Universal" },
  a6: { id: "a6", label: "Investment Incentive", desc: "Denying copyright disincentivizes human investment in AI tools", category: "ownership", value: "innovation", source: "Utilitarian counter-argument; investment theory", jurisdiction: "Universal" },
  a7: { id: "a7", label: "Public Domain", desc: "AI output should enter the public domain to maximize societal benefit", category: "ownership", value: "public_access", source: "'Algorithmic Muse' (ScienceDirect 2025); public domain theory", jurisdiction: "Universal" },

  b1: { id: "b1", label: "User Accountability", desc: "Users bear full accountability for all AI output they direct", category: "accountability", value: "personal_responsibility", source: "Respondeat superior; Lior (2020) AI agent analogy", jurisdiction: "Universal" },
  b2: { id: "b2", label: "Developer Accountability", desc: "Developers bear primary accountability as system creators", category: "accountability", value: "public_safety", source: "Product liability; EU PLD 2024/2853", jurisdiction: "EU" },
  b3: { id: "b3", label: "Proportional Distribution", desc: "Accountability distributes proportionally along value chain", category: "accountability", value: "fairness", source: "EU AI Act provider/deployer framework", jurisdiction: "EU" },
  b4: { id: "b4", label: "Traceability Required", desc: "Without traceability, no party can be held meaningfully accountable", category: "accountability", value: "rule_of_law", source: "C2PA content provenance standards", jurisdiction: "Universal" },
  b5: { id: "b5", label: "Foreseeability Limit", desc: "Users cannot be accountable for unforeseeable AI behavior", category: "accountability", value: "fairness", source: "Reasonable foreseeability test; CACI No. 1245", jurisdiction: "United States" },
  b6: { id: "b6", label: "Non-Waivable Liability", desc: "ToS cannot disclaim liability for foreseeable harm to third parties", category: "accountability", value: "public_safety", source: "EU PLD 2024/2853; strict liability doctrine", jurisdiction: "EU / Universal" },

  c1: { id: "c1", label: "Consistent Attribution", desc: "Claiming ownership necessitates accepting accountability", category: "bridge", value: "coherence", source: "Qui sentit commodum; Hohfeld's jural correlatives (1913)", jurisdiction: "Universal" },
  c2: { id: "c2", label: "Unified Threshold", desc: "Control threshold for ownership = threshold for accountability", category: "bridge", value: "coherence", source: "Meaningful human control (Santoni de Sio 2018)", jurisdiction: "Universal" },
  c3: { id: "c3", label: "Separability", desc: "Ownership and accountability are separable; can own without bearing harm liability", category: "bridge", value: "property_rights", source: "Property rights absolutism; libertarian IP theory", jurisdiction: "Theoretical" },
};

export const VALUES = {
  creator_rights: { label: "Creator Rights", color: "#4A90D9" },
  legal_integrity: { label: "Legal Integrity", color: "#7B68EE" },
  innovation: { label: "Innovation", color: "#2ECC71" },
  public_access: { label: "Public Access", color: "#E67E22" },
  personal_responsibility: { label: "Personal Responsibility", color: "#E74C3C" },
  public_safety: { label: "Public Safety", color: "#C0392B" },
  fairness: { label: "Fairness", color: "#1ABC9C" },
  rule_of_law: { label: "Rule of Law", color: "#8E44AD" },
  coherence: { label: "Coherence", color: "#2C3E50" },
  property_rights: { label: "Property Rights", color: "#D4AC0D" },
};

export const CATEGORIES = {
  ownership:       { label: "Ownership Arguments",       icon: "📜", bg: "#EBF5FB", border: "#2E86C1", text: "#1B4F72" },
  accountability:  { label: "Accountability Arguments",  icon: "⚖️", bg: "#FDEDEC", border: "#E74C3C", text: "#78281F" },
  bridge:          { label: "Bridge Arguments",          icon: "🔗", bg: "#F4ECF7", border: "#8E44AD", text: "#4A235A" },
};

export default ARGUMENTS;
