# The Ownership-Accountability Paradox

**When AI creates something valuable, you say "I made that." When AI creates something harmful, you say "The AI did that." Same person. Same tool. Different claim.**

This is a research toolkit that formalizes that contradiction using argumentation theory — the mathematics of rational disagreement — and builds the infrastructure to measure whether humans actually behave this way.

We call the gap between what people claim to own and what people accept accountability for the **OAAI — Ownership-Accountability Asymmetry Index**.

> **Try it live:** [leeladitya.github.io/oaai-framework](https://leeladitya.github.io/oaai-framework) — take the experiment, explore the framework, see the math.

---

## The problem, explained like you're sixteen

Imagine you ask an AI to design a logo for your school club. It comes out amazing. Everyone loves it. Your teacher asks who made it. You say: *"I designed it."*

Now imagine the same AI, same instructions, but this time the logo accidentally looks exactly like another school's trademarked mascot. The other school's principal sends an angry email. Your teacher asks who's responsible. You say: *"The AI made it, not me."*

Notice what just happened? You claimed credit when it went well. You deflected blame when it went badly. Your level of involvement was identical both times — you typed the same kind of prompt, reviewed the same kind of output, made the same kind of decisions. The only thing that changed was the outcome.

This isn't a character flaw. It's a pattern. And it's happening everywhere — in copyright offices, patent agencies, courtrooms, and corporate boardrooms across the world. We wanted to know: is this just a feeling, or can we prove it mathematically?

## What we built

### 1. An argumentation engine

In 1995, a computer scientist named Phan Minh Dung published a paper that changed how machines reason about disagreement. His framework — called an **Abstract Argumentation Framework (AAF)** — treats arguments as nodes in a graph and attacks as directed edges between them. Then it computes which sets of arguments can coexist without contradicting each other.

We took the entire AI ownership-accountability debate and encoded it this way. Not metaphorically. Literally.

**16 arguments** drawn from real court decisions, legal scholarship, and philosophy:

| ID | What it says | Where it comes from |
|---|---|---|
| `a1` | "I wrote the prompt, so I own the output" | *Li v. Liu* (Beijing, 2023); Locke's labor theory |
| `a2` | "The AI created this autonomously — no human author" | *Thaler v. Perlmutter* (D.C. Circuit, 2025) |
| `a3` | "Prompts are ideas, not protectable expression" | *Zarya of the Dawn* (Copyright Office, 2023) |
| `a4` | "Selecting and arranging AI output is creative expression" | Compilations doctrine; *Zarya* arrangement ruling |
| `a5` | "Copyright incentivizes creation — AI doesn't need incentives" | Constitutional purpose of copyright (Art. I §8) |
| `a6` | "Denying copyright discourages human investment in AI tools" | Investment incentive theory |
| `a7` | "AI output should be public domain for maximum societal benefit" | Public domain theory |
| `b1` | "Users are fully accountable for what they direct AI to do" | Respondeat superior; agent liability |
| `b2` | "Developers are primarily accountable — they built the system" | Product liability; EU Product Liability Directive |
| `b3` | "Accountability should be distributed proportionally" | EU AI Act provider/deployer framework |
| `b4` | "Without traceability, nobody can be held accountable" | C2PA content provenance standards |
| `b5` | "Users can't be blamed for unforeseeable AI behavior" | Reasonable foreseeability test |
| `b6` | "Terms of service can't disclaim liability for foreseeable harm" | Strict liability; EU PLD 2024/2853 |
| `c1` | "If you claim ownership, you must accept accountability" | Hohfeld's jural correlatives (1913) |
| `c2` | "The control threshold for owning and for being responsible must be the same" | Meaningful human control (Santoni de Sio, 2018) |
| `c3` | "Ownership and accountability are separable — you can own without being liable" | Property rights absolutism |

**14 attack relations** — each one a specific logical conflict between two arguments. When `a2` attacks `a1`, it means: "If the AI generated expression autonomously, then the human didn't author it via prompt." These aren't opinions. They're logical entailments.

The engine computes **four types of extensions** (sets of arguments that survive all attacks):

- **Grounded** — the minimum consensus that every rational person must accept
- **Preferred** — the maximal coherent positions that different stakeholders can hold
- **Stable** — conflict-free sets that defeat every argument outside them
- **Ideal** — arguments present in every preferred extension

### 2. A behavioral experiment

The formal math tells us what's logically true. It doesn't tell us what humans actually do. So we designed a within-subjects experiment with four scenarios:

- **Marketing campaign** — You prompt AI to make an image. It goes viral (positive) or infringes copyright (negative).
- **Financial report** — You have AI draft analysis. Board loves it (positive) or it contains a critical error (negative).
- **Video content** — You direct an AI video. It wins an award (positive) or your technique enables a deepfake (negative).
- **Software** — You build an app with AI assistance. It succeeds (positive) or gets hacked through AI-generated vulnerabilities (negative).

In every scenario, your level of AI involvement is identical. Only the outcome changes. We measure your ownership claim (positive condition) and your accountability acceptance (negative condition) on 7-point scales.

**OAAI = mean(ownership score − accountability score)**

If OAAI > 0, people systematically claim more ownership than accountability. If OAAI = 0, people are perfectly consistent. If OAAI < 0... well, that would mean people accept more blame than credit, and wouldn't that be something.

### 3. A policy stress-test

Five real cases. The framework's prediction engine maps each case's facts to argument activation, computes the resulting extension, and predicts the outcome. Then we compare against what actually happened.

| Case | What happened | Framework predicted |
|---|---|---|
| **Thaler v. Perlmutter** (US) | AI can't be an author. Copyright denied. | ✅ Correct — grounded extension activated a2, a3, a5 |
| **Zarya of the Dawn** (US) | Text + arrangement copyrighted. Individual AI images not. | ✅ Correct — a3 blocks image copyright, a4 defends arrangement |
| **Li v. Liu** (China) | 150 prompts = sufficient for copyright | ✅ Correct — value-dependent; aligned with E1 (creator rights) extension |
| **Taylor Swift deepfakes** | Led to TAKE IT DOWN Act | ✅ Correct — b1 + b6 + c1 predicted legislative response |
| **Biden robocall** | Creator fined $6M. Telco fined $1M. | ✅ Correct — multi-party accountability chain via b3 |

### 4. A Value-Based extension (Bench-Capon)

Different people care about different things. A creator cares about their rights. A regulator cares about public safety. A legal scholar cares about precedent. Bench-Capon's Value-Based Argumentation Framework extends Dung's model by letting attacks succeed or fail based on which values an audience prioritizes.

We built five audience profiles: Creator Advocate, Public Interest Advocate, Legal Scholar, Industry Representative, Government Regulator. Each produces different extensions from the same arguments — making the structure of political disagreement visible and computable.

---

## What the math found

Seven arguments survive in the grounded extension. Five principles emerge that no rational argument can defeat:

1. **Consistent Attribution** — You can't claim ownership of AI output when it goes well and disclaim accountability when it goes wrong. They're logically bound. (`c1`)

2. **Unified Control Threshold** — The threshold for "I directed this enough to own it" and "I directed this enough to be responsible" must be the same number. (`c2`)

3. **Proportional Accountability** — Responsibility scales with direction and foreseeability. Not all-or-nothing. (`b3`)

4. **Traceability** — If you can't trace AI output to human decisions, you can neither own it nor escape accountability for it. (`b4`)

5. **Non-Waivable Accountability** — Terms of service can't shift foreseeable harm to people who never agreed to them. (`b6`)

The separability argument (`c3`) — the idea that you can own AI output without bearing any accountability — does not survive. `c1` defeats it, and nothing in the framework rescues it.

---

## How to use this

### Try it online first

Go to [leeladitya.github.io/oaai-framework](https://leeladitya.github.io/oaai-framework). No installation. Take the experiment. See the argumentation graph. Get your OAAI score.

### Run it locally

You need [Node.js](https://nodejs.org) (version 16 or newer).

```bash
# Clone the repository
git clone https://github.com/leeladitya/oaai-framework.git
cd oaai-framework

# Install dependencies
npm install

# Start the interactive dashboard
npm start
```

This opens the full dashboard at `http://localhost:3000` with three tabs: the AAF engine (toggle arguments, watch extensions recompute in real time), the behavioral experiment, and the policy stress-test.

### Run the AAF solver directly

If you just want to compute extensions from code:

```javascript
import { computeGroundedExtension, computePreferredExtensions } from './src/engine/aaf-solver';
import { getAttackPairs } from './src/engine/attacks';
import ARGUMENTS from './src/engine/arguments';

const args = Object.keys(ARGUMENTS);   // all 16 argument IDs
const attacks = getAttackPairs();        // all 14 attack pairs

const grounded = computeGroundedExtension(args, attacks);
console.log('Grounded extension:', grounded);
// → ["a4", "a7", "b3", "b4", "b5", "b6", "c1", "c2"]

const preferred = computePreferredExtensions(args, attacks);
console.log('Preferred extensions:', preferred.length);
// → 3 extensions (the three coherent policy positions)
```

### Run the ASP solver (for larger frameworks)

The JavaScript solver handles up to 20 arguments. For larger frameworks, use [clingo](https://potassco.org/clingo/):

```bash
# Install clingo (pick one)
conda install -c potassco clingo    # via conda
brew install clingo                  # via Homebrew (macOS)
apt install gringo clasp             # via apt (Ubuntu)

# Run the pre-built encoding
npm run solve:asp                    # computes grounded extension
npm run solve:asp:preferred          # computes all preferred extensions
```

Or generate your own encoding:

```javascript
import { generateFullEncoding } from './src/engine/asp-encoder';

const encoding = generateFullEncoding(args, attacks, 'preferred');
// Write to file and feed to clingo
```

### Run the stress-test

```bash
npm run validate:cases
```

This runs all five cases through the prediction engine and reports accuracy.

### Add your own arguments

Edit `src/engine/arguments.js` to add arguments:

```javascript
d1: {
  id: "d1",
  label: "Your Argument Label",
  desc: "What this argument claims",
  category: "ownership",        // or "accountability" or "bridge"
  value: "creator_rights",      // which value it promotes
  source: "Where this comes from",
  jurisdiction: "Which legal system"
}
```

Edit `src/engine/attacks.js` to add attack relations:

```javascript
["d1", "a3", "Why d1 defeats a3"],
["a2", "d1", "Why a2 defeats d1"],
```

Re-run the solver. The extensions will recompute with your new arguments included.

### Compute OAAI from experiment data

```javascript
import { computeOAAI, aggregateOAAI } from './src/experiment/oaai-calculator';
import SCENARIOS from './src/experiment/scenarios';

// Single participant
const responses = {
  marketing_pos: 6,  marketing_neg: 3,
  report_pos: 5,     report_neg: 4,
  deepfake_pos: 6,   deepfake_neg: 2,
  code_pos: 5,       code_neg: 3,
};

const result = computeOAAI(responses, SCENARIOS);
console.log(result.oaai);           // e.g., 2.5 (strong asymmetry)
console.log(result.cohensD);        // effect size
console.log(result.interpretation); // plain-language explanation

// Multiple participants
const allResults = [result1, result2, result3, ...];
const aggregate = aggregateOAAI(allResults);
console.log(aggregate.meanOAAI);
console.log(aggregate.significant); // true if p < 0.05
```

---

## Project structure

```
oaai-framework/
├── docs/                          # GitHub Pages interactive site
│   └── index.html                 # ← Take the experiment here
├── src/
│   ├── engine/
│   │   ├── aaf-solver.js          # Dung's AAF semantics (grounded, preferred, stable, ideal)
│   │   ├── vaf-solver.js          # Bench-Capon's Value-Based extensions
│   │   ├── arguments.js           # The 16 arguments (sourced, categorized)
│   │   ├── attacks.js             # The 14 attack relations (with reasoning)
│   │   ├── asp-encoder.js         # ASP/ICCMA format encoder for clingo/ASPARTIX
│   │   └── index.js               # Engine exports
│   ├── experiment/
│   │   ├── scenarios.js           # 4 behavioral experiment scenarios
│   │   └── oaai-calculator.js     # OAAI computation + aggregation + Cohen's d
│   ├── stress-test/
│   │   ├── cases.js               # 5 landmark cases with predictions
│   │   └── predictor.js           # Maps cases through the framework
│   ├── integrations/
│   │   ├── aspartix-bridge.js     # External ASP solver interface
│   │   ├── agora-connector.js     # Agora deliberation platform integration
│   │   └── claw-adapter.js        # CLAW governance pipeline connector
│   ├── pipeline/
│   │   └── validator.js           # Full validation pipeline orchestrator
│   ├── App.jsx                    # React dashboard (AAF + experiment + stress-test)
│   └── index.js                   # Entry point
├── asp/
│   ├── ownership-accountability.lp # Pre-built ASP encoding
│   ├── extensions.lp               # Extension computation rules
│   └── run-solver.sh               # Shell script for clingo execution
├── tests/
│   └── aaf-solver.test.js          # Unit tests for the solver
└── package.json
```

---

## Why this matters

Right now, AI governance is broken. Not in an abstract, theoretical way. In a practical, measurable way.

A court in Beijing says prompting AI 150 times is enough creative effort to earn copyright. A US copyright examiner says prompting AI 624 times isn't. The EU AI Act regulates who's responsible when AI causes harm but defers to existing IP law for who owns the good stuff. Patent offices have reversed their guidance twice in two years. Congress has introduced 150+ AI bills and passed zero comprehensive laws.

Every one of these institutions is treating ownership and accountability as separate problems. The formal analysis in this toolkit proves they can't be separated — the threshold must be the same. That means every current framework has a structural contradiction at its foundation.

This isn't an opinion. It's a computed result from an argumentation framework with 16 sourced arguments and 14 explicit attack relations. If you disagree, add an argument and re-compute. That's how argumentation works.

---

## Contributing

We need three things:

1. **Experiment participants** — Take the experiment at [leeladitya.github.io/oaai-framework](https://leeladitya.github.io/oaai-framework). Your anonymized data helps us measure whether the asymmetry exists in human behavior, not just in logic.

2. **New arguments** — The framework currently has 16. The real debate has hundreds. If you can articulate a sourced argument and its attack relations, submit a PR.

3. **Adversarial testing** — Try to break the solver. Find edge cases. Produce a counterexample to the five principles. If you can construct an argument that defeats `c1` (consistent attribution) and survives in the grounded extension, that's a publishable finding.

Contact: [research@leed.guru](mailto:research@leed.guru)

---

## References

- Dung, P.M. (1995). "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games." *Artificial Intelligence*, 77(2), 321-357.
- Bench-Capon, T.J.M. (2003). "Persuasion in practical argument using value-based argumentation frameworks." *Journal of Logic and Computation*, 13(3), 429-448.
- Hohfeld, W.N. (1913). "Some fundamental legal conceptions as applied in judicial reasoning." *Yale Law Journal*, 23(1), 16-59.
- Santoni de Sio, F. & van den Hoven, J. (2018). "Meaningful human control over autonomous systems." *Frontiers in Robotics and AI*, 5, 15.
- *Thaler v. Perlmutter*, D.C. Circuit (2025). AI cannot be a copyright author.
- *Zarya of the Dawn*, USCO (2023). Partial copyright for human-arranged AI output.
- *Li v. Liu*, Beijing Internet Court (2023). Copyright granted for extensively prompted AI art.
- EU AI Act, Regulation 2024/1689. Risk-based AI governance framework.

---

## License

MIT — Use it, extend it, challenge it. If you find something we got wrong, that's not a bug. That's the scientific method.

---

*Built by [Devudaaa Research Lab](https://devudaaaa.xyz) — studying what happens when humans invoke faith at strategic decision points. The ownership-accountability paradox is one piece of a larger question: what do people do when the algorithm says one thing and their gut says another?*
