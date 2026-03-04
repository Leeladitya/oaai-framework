import React, { useState, useMemo } from 'react';
import ARGUMENTS, { VALUES, CATEGORIES } from './engine/arguments';
import { getAttackPairs } from './engine/attacks';
import {
  computeGroundedExtension,
  computePreferredExtensions,
  getAttackers,
  getTargets,
  isAdmissible,
  isConflictFree,
} from './engine/aaf-solver';
import SCENARIOS from './experiment/scenarios';
import { computeOAAI } from './experiment/oaai-calculator';
import CASES from './stress-test/cases';

// ===== STYLES =====
const CAT = {
  ownership: { bg: "#EBF5FB", border: "#2E86C1", text: "#1B4F72" },
  accountability: { bg: "#FDEDEC", border: "#E74C3C", text: "#78281F" },
  bridge: { bg: "#F4ECF7", border: "#8E44AD", text: "#4A235A" },
};

const tab = (active, current) => ({
  padding: "10px 20px", cursor: "pointer", fontWeight: active === current ? 700 : 400,
  color: active === current ? "#1B3A5C" : "#666", background: "none", border: "none",
  borderBottom: `3px solid ${active === current ? "#2E75B6" : "transparent"}`, fontSize: 14,
});

export default function App() {
  const [activeTab, setActiveTab] = useState("aaf");
  const [activeArgs, setActiveArgs] = useState(Object.keys(ARGUMENTS));
  const [selectedArg, setSelectedArg] = useState(null);
  const [expPhase, setExpPhase] = useState("intro");
  const [curScenario, setCurScenario] = useState(0);
  const [responses, setResponses] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [stressIdx, setStressIdx] = useState(0);
  const [showPred, setShowPred] = useState(false);

  const attacks = getAttackPairs();
  const filteredAttacks = attacks.filter(([a,t]) => activeArgs.includes(a) && activeArgs.includes(t));

  const grounded = useMemo(() => computeGroundedExtension(activeArgs, filteredAttacks), [activeArgs, filteredAttacks]);
  const preferred = useMemo(() => activeArgs.length <= 20 ? computePreferredExtensions(activeArgs, filteredAttacks) : [], [activeArgs, filteredAttacks]);

  const oaaiResult = useMemo(() => computeOAAI(responses, SCENARIOS), [responses]);
  const toggleArg = id => setActiveArgs(p => p.includes(id) ? p.filter(a => a !== id) : [...p, id]);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 960, margin: "0 auto", padding: 20, color: "#333" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "2px solid #2E75B6" }}>
        <div style={{ fontSize: 11, color: "#2E75B6", fontWeight: 600, letterSpacing: 2, marginBottom: 4 }}>DEVUDAAA RESEARCH LAB</div>
        <h1 style={{ margin: "4px 0", fontSize: 22, color: "#1B3A5C" }}>Ownership-Accountability Framework Validation Pipeline</h1>
        <p style={{ color: "#666", fontSize: 13, margin: 0 }}>AAF Computation Engine · Behavioral Experiment · Policy Stress-Test</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #ddd", marginBottom: 20 }}>
        {[["aaf","⚙️ AAF Engine"],["experiment","🧪 Experiment"],["stress","📋 Stress-Test"],["pipeline","🔗 Pipeline"]].map(([k,l]) => (
          <button key={k} style={tab(activeTab, k)} onClick={() => setActiveTab(k)}>{l}</button>
        ))}
      </div>

      {/* ===== AAF ENGINE ===== */}
      {activeTab === "aaf" && (
        <div>
          <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 8, marginBottom: 20, border: "1px solid #e0e0e0" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 15, color: "#1B3A5C" }}>Dung's Abstract Argumentation Framework Solver</h3>
            <p style={{ margin: 0, fontSize: 13, color: "#555" }}>Toggle arguments on/off to see how extensions change in real-time.</p>
          </div>

          {["ownership","accountability","bridge"].map(cat => (
            <div key={cat} style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, color: CAT[cat].text, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 1 }}>
                {CATEGORIES[cat].icon} {CATEGORIES[cat].label}
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {Object.values(ARGUMENTS).filter(a => a.category === cat).map(arg => {
                  const isActive = activeArgs.includes(arg.id);
                  const inGE = grounded.includes(arg.id);
                  return (
                    <div key={arg.id} onClick={() => setSelectedArg(selectedArg === arg.id ? null : arg.id)}
                      style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer", minWidth: 140, transition: "all 0.2s",
                        border: `2px solid ${inGE ? "#C45824" : isActive ? CAT[cat].border : "#ccc"}`,
                        background: selectedArg === arg.id ? CAT[cat].bg : "#fff", opacity: isActive ? 1 : 0.4 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 700, fontSize: 12, color: CAT[cat].text }}>{arg.id}</span>
                        <button onClick={e => { e.stopPropagation(); toggleArg(arg.id); }}
                          style={{ width: 20, height: 20, borderRadius: 3, border: "1px solid #ccc",
                            background: isActive ? "#2E75B6" : "#fff", color: "#fff", cursor: "pointer", fontSize: 11,
                            display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {isActive ? "✓" : ""}
                        </button>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{arg.label}</div>
                      {inGE && <div style={{ fontSize: 10, color: "#C45824", fontWeight: 700, marginTop: 4 }}>● IN GROUNDED EXTENSION</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {selectedArg && ARGUMENTS[selectedArg] && (
            <div style={{ background: CAT[ARGUMENTS[selectedArg].category].bg, padding: 16, borderRadius: 8, marginBottom: 16,
              border: `1px solid ${CAT[ARGUMENTS[selectedArg].category].border}` }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 14 }}>{selectedArg}: {ARGUMENTS[selectedArg].label}</h4>
              <p style={{ margin: "0 0 6px", fontSize: 13 }}>{ARGUMENTS[selectedArg].desc}</p>
              <p style={{ margin: "0 0 6px", fontSize: 12, color: "#555" }}><strong>Source:</strong> {ARGUMENTS[selectedArg].source}</p>
              <p style={{ margin: "0 0 6px", fontSize: 12, color: "#555" }}><strong>Value:</strong> {VALUES[ARGUMENTS[selectedArg].value]?.label}</p>
              <p style={{ margin: "0 0 4px", fontSize: 12, color: "#555" }}><strong>Attacks:</strong> {getTargets(selectedArg, filteredAttacks).join(", ") || "none"}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#555" }}><strong>Attacked by:</strong> {getAttackers(selectedArg, filteredAttacks).join(", ") || "none"}</p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            <div style={{ background: "#FFF3E0", padding: 16, borderRadius: 8, border: "2px solid #C45824" }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 14, color: "#C45824" }}>Grounded Extension (Consensus)</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {grounded.map(a => <span key={a} style={{ background: "#C45824", color: "#fff", padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{a}</span>)}
              </div>
              {grounded.length === 0 && <p style={{ fontSize: 12, color: "#999" }}>Empty — no uncontested arguments</p>}
            </div>
            <div style={{ background: "#EBF5FB", padding: 16, borderRadius: 8, border: "2px solid #2E86C1" }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 14, color: "#1B4F72" }}>Preferred Extensions ({preferred.length} positions)</h4>
              {preferred.slice(0, 5).map((ext, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#2E86C1" }}>E{i+1}:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {ext.map(a => <span key={a} style={{ background: grounded.includes(a) ? "#C45824" : "#2E86C1", color: "#fff", padding: "2px 6px", borderRadius: 3, fontSize: 10 }}>{a}</span>)}
                  </div>
                </div>
              ))}
              {preferred.length > 5 && <p style={{ fontSize: 11, color: "#999" }}>+ {preferred.length - 5} more</p>}
            </div>
          </div>
        </div>
      )}

      {/* ===== EXPERIMENT ===== */}
      {activeTab === "experiment" && (
        <div>
          {expPhase === "intro" && (
            <div>
              <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 8, marginBottom: 20, border: "1px solid #e0e0e0" }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 15, color: "#1B3A5C" }}>OAAI — Ownership-Attribution Asymmetry Index</h3>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#555" }}>Measures whether people claim ownership of beneficial AI output more strongly than they accept accountability for harmful AI output.</p>
                <p style={{ margin: 0, fontSize: 13, color: "#555" }}><strong>Design:</strong> Within-subjects, 4 scenarios × 2 conditions. OAAI = mean(ownership − accountability). OAAI &gt; 0 = asymmetry exists.</p>
              </div>
              <button onClick={() => { setExpPhase("running"); setCurScenario(0); setResponses({}); setShowResults(false); }}
                style={{ padding: "12px 24px", background: "#2E75B6", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                Start Experiment →
              </button>
            </div>
          )}

          {expPhase === "running" && !showResults && (
            <div>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, color: "#1B3A5C" }}>Scenario {curScenario+1}/{SCENARIOS.length}: {SCENARIOS[curScenario].title}</h3>
              <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 8, marginBottom: 16, border: "1px solid #e0e0e0" }}>
                <div style={{ fontSize: 11, color: "#2E75B6", fontWeight: 600, marginBottom: 4 }}>SITUATION</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{SCENARIOS[curScenario].setup}</p>
              </div>

              {[["positive", "#E8F5E9", "#4CAF50", "#2E7D32"], ["negative", "#FFEBEE", "#E74C3C", "#C0392B"]].map(([type, bg, col, labelCol]) => {
                const s = SCENARIOS[curScenario];
                const data = type === "positive" ? s.positive : s.negative;
                const key = `${s.id}_${type === "positive" ? "pos" : "neg"}`;
                return (
                  <div key={type} style={{ background: bg, padding: 16, borderRadius: 8, marginBottom: 12, border: `1px solid ${col}` }}>
                    <div style={{ fontSize: 11, color: labelCol, fontWeight: 600, marginBottom: 4 }}>{type.toUpperCase()} OUTCOME</div>
                    <p style={{ margin: "0 0 12px", fontSize: 13 }}>{data.outcome}</p>
                    <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600 }}>{data.question}</p>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "#666" }}>Strongly disagree</span>
                      {[1,2,3,4,5,6,7].map(v => (
                        <button key={v} onClick={() => setResponses(r => ({...r, [key]: v}))}
                          style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${col}`,
                            background: responses[key] === v ? col : "#fff",
                            color: responses[key] === v ? "#fff" : "#333",
                            cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{v}</button>
                      ))}
                      <span style={{ fontSize: 11, color: "#666" }}>Strongly agree</span>
                    </div>
                  </div>
                );
              })}

              <div style={{ display: "flex", gap: 8 }}>
                {curScenario > 0 && <button onClick={() => setCurScenario(c => c-1)}
                  style={{ padding: "10px 20px", background: "#f5f5f5", border: "1px solid #ddd", borderRadius: 6, cursor: "pointer" }}>← Previous</button>}
                {curScenario < SCENARIOS.length - 1
                  ? <button onClick={() => setCurScenario(c => c+1)} style={{ padding: "10px 20px", background: "#2E75B6", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Next →</button>
                  : <button onClick={() => setShowResults(true)} style={{ padding: "10px 20px", background: "#C45824", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Compute OAAI →</button>
                }
              </div>
            </div>
          )}

          {showResults && (
            <div>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, color: "#1B3A5C" }}>Results: OAAI</h3>
              {SCENARIOS.map(s => {
                const pos = responses[`${s.id}_pos`], neg = responses[`${s.id}_neg`];
                const gap = pos != null && neg != null ? pos - neg : null;
                return (
                  <div key={s.id} style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr 100px", gap: 8, padding: "10px 12px", background: "#f8f9fa", borderRadius: 6, marginBottom: 6, alignItems: "center", border: "1px solid #e0e0e0" }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.title}</div>
                    <div style={{ fontSize: 12 }}><span style={{ color: "#4CAF50", fontWeight: 600 }}>Own: {pos || "—"}</span></div>
                    <div style={{ fontSize: 12 }}><span style={{ color: "#E74C3C", fontWeight: 600 }}>Acc: {neg || "—"}</span></div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: gap > 0 ? "#C45824" : gap < 0 ? "#2E7D32" : "#333" }}>Gap: {gap != null ? (gap > 0 ? "+" : "") + gap : "—"}</div>
                  </div>
                );
              })}
              <div style={{ background: oaaiResult.oaai > 0 ? "#FFF3E0" : "#E8F5E9", padding: 20, borderRadius: 8, marginTop: 16, textAlign: "center",
                border: `2px solid ${oaaiResult.oaai > 0 ? "#C45824" : "#4CAF50"}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#666" }}>OAAI</div>
                <div style={{ fontSize: 42, fontWeight: 700, color: oaaiResult.oaai > 0 ? "#C45824" : "#2E7D32" }}>
                  {oaaiResult.oaai != null ? (oaaiResult.oaai > 0 ? "+" : "") + oaaiResult.oaai : "—"}
                </div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 8 }}>{oaaiResult.interpretation}</div>
              </div>
              <button onClick={() => { setExpPhase("intro"); setShowResults(false); }}
                style={{ marginTop: 16, padding: "10px 20px", background: "#2E75B6", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Reset</button>
            </div>
          )}
        </div>
      )}

      {/* ===== STRESS-TEST ===== */}
      {activeTab === "stress" && (
        <div>
          <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 8, marginBottom: 20, border: "1px solid #e0e0e0" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 15, color: "#1B3A5C" }}>Policy Stress-Test: Framework vs. Real Cases</h3>
            <p style={{ margin: 0, fontSize: 13, color: "#555" }}>Tests framework predictions against actual legal outcomes.</p>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            {CASES.map((c, i) => (
              <button key={c.id} onClick={() => { setStressIdx(i); setShowPred(false); }}
                style={{ padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12,
                  background: stressIdx === i ? "#1B3A5C" : "#f5f5f5",
                  color: stressIdx === i ? "#fff" : "#333",
                  border: stressIdx === i ? "none" : "1px solid #ddd",
                  fontWeight: stressIdx === i ? 600 : 400 }}>
                {c.title.split("(")[0].trim()}
              </button>
            ))}
          </div>
          {(() => {
            const c = CASES[stressIdx];
            return (
              <div>
                <h4 style={{ margin: "0 0 12px", fontSize: 16, color: "#1B3A5C" }}>{c.title}</h4>
                <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 8, marginBottom: 12, border: "1px solid #e0e0e0" }}>
                  <div style={{ fontSize: 11, color: "#2E75B6", fontWeight: 600, marginBottom: 4 }}>FACTS</div>
                  <p style={{ margin: 0, fontSize: 14 }}>{c.facts}</p>
                </div>
                <div style={{ background: "#EBF5FB", padding: 16, borderRadius: 8, marginBottom: 12, border: "1px solid #2E86C1" }}>
                  <div style={{ fontSize: 11, color: "#1B4F72", fontWeight: 600, marginBottom: 4 }}>FRAMEWORK INPUT</div>
                  <p style={{ margin: "0 0 6px", fontSize: 13 }}><strong>Arguments:</strong> {c.frameworkInput.activeArgs.map(a =>
                    <span key={a} style={{ background: "#2E86C1", color: "#fff", padding: "2px 6px", borderRadius: 3, fontSize: 11, marginRight: 4, display: "inline-block" }}>{a}</span>
                  )}</p>
                  <p style={{ margin: 0, fontSize: 13 }}><strong>Human control:</strong> {(c.frameworkInput.humanControl*100).toFixed(0)}%</p>
                </div>
                {!showPred
                  ? <button onClick={() => setShowPred(true)} style={{ padding: "12px 24px", background: "#C45824", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Run Analysis →</button>
                  : <>
                      <div style={{ background: "#FFF3E0", padding: 16, borderRadius: 8, marginBottom: 12, border: "1px solid #C45824" }}>
                        <div style={{ fontSize: 11, color: "#C45824", fontWeight: 600, marginBottom: 4 }}>PREDICTION</div>
                        <p style={{ margin: 0, fontSize: 14 }}>{c.prediction}</p>
                      </div>
                      <div style={{ background: "#E8F5E9", padding: 16, borderRadius: 8, marginBottom: 12, border: "1px solid #4CAF50" }}>
                        <div style={{ fontSize: 11, color: "#2E7D32", fontWeight: 600, marginBottom: 4 }}>ACTUAL OUTCOME</div>
                        <p style={{ margin: 0, fontSize: 14 }}>{c.actualOutcome}</p>
                      </div>
                      <div style={{ background: c.match ? "#E8F5E9" : "#FFEBEE", padding: 12, borderRadius: 8, border: `2px solid ${c.match ? "#4CAF50" : "#E74C3C"}`, display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 28 }}>{c.match ? "✅" : "❌"}</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: c.match ? "#2E7D32" : "#C0392B" }}>{c.match ? "VALIDATED" : "DIVERGENCE"}</div>
                          <div style={{ fontSize: 12, color: "#555" }}>Prediction {c.match ? "aligns with" : "diverges from"} actual outcome.</div>
                        </div>
                      </div>
                    </>
                }
              </div>
            );
          })()}
          <div style={{ marginTop: 20, padding: 16, background: "#f8f9fa", borderRadius: 8, border: "1px solid #e0e0e0", textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#666" }}>ACCURACY</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "#2E7D32" }}>{CASES.filter(c=>c.match).length}/{CASES.length}</div>
          </div>
        </div>
      )}

      {/* ===== PIPELINE ===== */}
      {activeTab === "pipeline" && (
        <div>
          <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 8, marginBottom: 20, border: "1px solid #e0e0e0" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 15, color: "#1B3A5C" }}>Integrated Validation Pipeline</h3>
            <p style={{ margin: 0, fontSize: 13, color: "#555" }}>Three components form a closed validation loop: Behavioral data grounds the framework. The AAF engine computes policy positions. The stress-test validates predictions.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr 40px 1fr", gap: 0, alignItems: "center", marginBottom: 24 }}>
            {[
              { emoji: "🧪", label: "Behavioral Experiment", sub: "Measures OAAI", col: "#4CAF50", bg: "#E8F5E9" },
              null,
              { emoji: "⚙️", label: "AAF Engine (Agora)", sub: "Computes extensions", col: "#C45824", bg: "#FFF3E0" },
              null,
              { emoji: "📋", label: "Policy Stress-Test", sub: "Validates predictions", col: "#2E86C1", bg: "#EBF5FB" },
            ].map((item, i) => item
              ? <div key={i} style={{ background: item.bg, padding: 16, borderRadius: 8, border: `2px solid ${item.col}`, textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{item.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: item.col }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{item.sub}</div>
                </div>
              : <div key={i} style={{ textAlign: "center", fontSize: 20, color: "#999" }}>→</div>
            )}
          </div>
          <div style={{ textAlign: "center", padding: 12, background: "#F4ECF7", borderRadius: 8, border: "1px dashed #8E44AD", marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: "#8E44AD", fontWeight: 600 }}>← FEEDBACK: Stress-test failures refine argument set → re-run AAF → update experiment →</div>
          </div>

          <h3 style={{ fontSize: 15, color: "#1B3A5C", margin: "0 0 12px" }}>Integration Points</h3>
          {[
            { name: "Agora Connector", file: "src/integrations/agora-connector.js", desc: "Decision Arena sessions, argument submission, extension queries, stakeholder analysis", col: "#C45824" },
            { name: "Claw Adapter", file: "src/integrations/claw-adapter.js", desc: "Pre-decision argumentation, attack relation generation, decision justification chains", col: "#8E44AD" },
            { name: "ASPARTIX Bridge", file: "src/integrations/aspartix-bridge.js", desc: "ASP encoding generation, clingo solver execution, ICCMA format export", col: "#2E86C1" },
          ].map(int => (
            <div key={int.name} style={{ marginBottom: 12, padding: 16, borderRadius: 8, borderLeft: `4px solid ${int.col}`, background: "#f8f9fa" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: int.col }}>{int.name}</div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{int.file}</div>
              <div style={{ fontSize: 13, color: "#444", marginTop: 4 }}>{int.desc}</div>
            </div>
          ))}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 20 }}>
            {[
              { label: "OAAI", target: "> 0", icon: "🧪" },
              { label: "Extension Stability", target: "> 80%", icon: "⚙️" },
              { label: "Prediction Accuracy", target: "> 75%", icon: "📋" },
            ].map(m => (
              <div key={m.label} style={{ padding: 16, borderRadius: 8, background: "#f8f9fa", border: "1px solid #e0e0e0", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{m.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1B3A5C" }}>{m.label}</div>
                <div style={{ fontSize: 11, color: "#C45824", fontWeight: 600 }}>Target: {m.target}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
