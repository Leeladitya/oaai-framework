/**
 * Policy Stress-Test Case Database
 * Real-world cases for framework validation.
 * @module stress-test/cases
 */

const CASES = [
  {
    id: "thaler",
    title: "Thaler v. Perlmutter (US, 2023-2025)",
    jurisdiction: "United States",
    domain: "ownership",
    facts: "Stephen Thaler sought copyright for an image generated entirely by his AI system DABUS with no human creative input beyond activating the system.",
    frameworkInput: { activeArgs: ["a2", "a3", "a5"], humanControl: 0.05 },
    prediction: "No copyright. Falls in grounded extension: a2 (AI autonomous), a3 (no human expression), a5 (no incentive needed). Human control below any reasonable threshold.",
    actualOutcome: "Copyright denied. D.C. Circuit affirmed: human authorship required.",
    match: true,
  },
  {
    id: "zarya",
    title: "Zarya of the Dawn (USCO, 2023)",
    jurisdiction: "United States",
    domain: "ownership",
    facts: "Kris Kashtanova wrote text, selected and arranged AI-generated images, and designed overall narrative structure for a graphic novel using Midjourney.",
    frameworkInput: { activeArgs: ["a3", "a4", "a5"], humanControl: 0.55 },
    prediction: "Partial copyright. a3 applies (individual AI images not protectable), but a4 defends (selection/arrangement is creative expression). Human arrangement crosses the meaningful control threshold.",
    actualOutcome: "Text and arrangement copyrighted; individual AI images not copyrighted.",
    match: true,
  },
  {
    id: "li_liu",
    title: "Li v. Liu (Beijing Internet Court, 2023)",
    jurisdiction: "China",
    domain: "ownership",
    facts: "Plaintiff used 150+ prompts and multiple parameter adjustments in Stable Diffusion to generate an image, demonstrating deliberate design choices.",
    frameworkInput: { activeArgs: ["a1", "a4"], humanControl: 0.65 },
    prediction: "Under preferred extension E1 (human-centric), copyright granted based on intellectual investment. Under E2 (public domain), denied. Framework correctly identifies this as value-dependent.",
    actualOutcome: "Copyright granted — aligning with E1 extension.",
    match: true,
  },
  {
    id: "taylor_swift",
    title: "Taylor Swift AI Deepfakes (2024)",
    jurisdiction: "United States",
    domain: "accountability",
    facts: "Non-consensual AI-generated intimate images of Taylor Swift spread virally on social media platform X, viewed millions of times before removal.",
    frameworkInput: { activeArgs: ["b1", "b2", "b3", "b6", "c1"], humanControl: 0.9 },
    prediction: "Full user accountability (b1) — intentional harmful use with high control. Developer accountability (b2) for insufficient safeguards. Non-waivable liability (b6). Consistent attribution (c1).",
    actualOutcome: "Led to TAKE IT DOWN Act; X implemented new policies. Framework correctly predicted need for legislative response.",
    match: true,
  },
  {
    id: "biden_robocall",
    title: "Biden Robocall Deepfake (New Hampshire, 2024)",
    jurisdiction: "United States",
    domain: "accountability",
    facts: "AI-generated voice clone of President Biden used in robocalls to discourage Democratic primary voters, created by political consultant Steve Kramer.",
    frameworkInput: { activeArgs: ["b1", "b3", "b4", "c1"], humanControl: 0.95 },
    prediction: "Maximum user accountability — intentional, directed, foreseeable harm. b4 (traceability) enabled identification. Proportional accountability (b3): telco also liable.",
    actualOutcome: "Kramer fined $6M by FCC; criminal charges filed; telco fined $1M. Framework accurately maps the multi-party accountability chain.",
    match: true,
  },
];

export default CASES;
