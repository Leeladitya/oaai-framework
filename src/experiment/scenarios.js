/**
 * Behavioral Experiment Scenarios
 * 
 * Each scenario holds AI interaction level constant while varying
 * outcome valence (positive vs. negative). This isolates the
 * attribution asymmetry from confounding variables.
 * 
 * Design: Within-subjects, counterbalanced presentation order.
 * DV: 7-point Likert scale (ownership claim / accountability acceptance)
 * IV: Outcome valence (positive / negative)
 * 
 * @module experiment/scenarios
 */

const SCENARIOS = [
  {
    id: "marketing",
    title: "Marketing Campaign",
    domain: "creative",
    aiInteractionLevel: "high",
    setup: "You used an AI tool to generate a marketing image for your company's new product launch. You provided a detailed prompt describing the style, colors, composition, and brand elements.",
    positive: {
      outcome: "The image goes viral on social media, generating 500K impressions and driving a 40% increase in sales. Your CEO asks who created it.",
      question: "How much do you agree: 'I created this image'?",
    },
    negative: {
      outcome: "The image closely resembles a copyrighted work by a well-known artist. The artist's lawyer sends a cease-and-desist letter claiming infringement.",
      question: "How much do you agree: 'I am responsible for this infringement'?",
    },
  },
  {
    id: "report",
    title: "Financial Report",
    domain: "analytical",
    aiInteractionLevel: "high",
    setup: "You used an AI assistant to draft a quarterly financial analysis report. You provided the data, key metrics, and asked it to generate insights and recommendations.",
    positive: {
      outcome: "The report impresses the board with its clarity and novel insights. The company makes a strategic pivot based on the recommendations, leading to record quarterly profits.",
      question: "How much do you agree: 'I authored this report'?",
    },
    negative: {
      outcome: "The report contains a critical calculation error that the AI introduced. The company makes a bad investment based on the flawed analysis, losing $2M.",
      question: "How much do you agree: 'I am responsible for this error'?",
    },
  },
  {
    id: "deepfake",
    title: "Video Content",
    domain: "media",
    aiInteractionLevel: "high",
    setup: "You used an AI video tool to create a presentation video. You provided the script, selected the AI-generated avatar, chose the background, and directed the tone.",
    positive: {
      outcome: "The video wins a 'Best Corporate Communication' award at an industry conference. You are invited to speak about your creative process.",
      question: "How much do you agree: 'I created this video'?",
    },
    negative: {
      outcome: "Someone takes the same AI tool and your techniques (which you shared publicly) to create a deepfake video impersonating a political figure, which goes viral before an election.",
      question: "How much do you agree: 'I bear some responsibility for enabling this misuse'?",
    },
  },
  {
    id: "code",
    title: "Software Development",
    domain: "technical",
    aiInteractionLevel: "high",
    setup: "You used an AI coding assistant to build a web application. You described the requirements, reviewed the generated code, made modifications, and tested the final product.",
    positive: {
      outcome: "The application becomes widely adopted, generating significant revenue. A tech magazine profiles you as the developer.",
      question: "How much do you agree: 'I built this application'?",
    },
    negative: {
      outcome: "The AI-generated code contained a security vulnerability that you didn't catch during review. Hackers exploit it, compromising 100,000 user accounts.",
      question: "How much do you agree: 'I am responsible for this security breach'?",
    },
  },
];

export default SCENARIOS;
