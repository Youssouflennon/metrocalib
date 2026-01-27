import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "src/hooks/useTranslation";

// Composant React + Tailwind + Framer Motion
// Fichier: AcideConcentreProcess.tsx
// Usage: coller dans un projet React + Tailwind + framer-motion

type Step = {
  id: string;
  title: string;
  content: string[]; // paragraphes ou points
};



export default function AcideConcentreProcess() {

  const { t } = useTranslation();

  const SECTIONS: {
  id: string;
  title: string;
  summary?: string;
  steps?: Step[];
}[] = [
  {
    id: "Application",
    title: t("sc.oe"),
    summary:
     t("pro.cde"),
  },
  {
    id: "references",
    title: t("re.fe"),
    summary:
      t("nor.ma"),
  },
  {
    id: "matiere",
    title: t("mat.te"),
    summary:
      t("con.te"),  
  },
  {
    id: "equipements",
    title: t("equ.ment"),
    summary:
      t("me.la"),
  },
  {
    id: "procedure",
    title: t("me.thod"),
    steps: [
      {
        id: "prelim",
        title: t("eta.pe"),
        content: [
          t("port.des")
          
        ],
      },
      {
        id: "rinage",
        title: t("to.rin"),
        content: [
         t("rep.ci"),
        ],
      },
      {
        id: "prepa",
        title: t("th.fi"),
        content: [
         t("pre.ci"),
        ],
      },
      {
        id: "remplissage",
        title: t("tn.trol"),
        content: [
          t("tre.ci"),
        ],
      },
    ],
  },
  {
    id: "controle",
    title: t("de.pro"),
    summary:
     t("con.tro"),
  },
  {
    id: "controle_final",
    title: t("ter.fic"),
    summary:
      t("po.pel"),
  },
  {
    id: "stockage",
    title: t("cot.tr"),
    summary:
      t("tri.ca"),
  },
  {
    id: "hygiene",
    title: t("hy.gi:"),
    summary:
      t("hy.gie"),
  },
  {
    id: "config",
    title: t("ro.om"),
    summary:
      t("pl.nd")  ,
  },
];

  const [activeSection, setActiveSection] = useState(SECTIONS[0].id); // default to procedure
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [showChecklist, setShowChecklist] = useState(true);
  

  function toggleStep(id: string) {
    setExpandedStep((s) => (s === id ? null : id));
  }

  const section = SECTIONS.find((s) => s.id === activeSection)!;
                    //const { t } = useTranslation();
  return (
    <div className="min-h-screen  to-white p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: navigation */}
        <aside className="lg:col-span-1 bg-[#1aafc9e2]/5 border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
             {t("pro.tu")}
            </h3>
            <span className="text-xs text-[#1aafc9e2]/80">v1.0</span>
          </div>

          <div className="space-y-2">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-150 flex items-center justify-between ${
                  s.id === activeSection
                    ? "bg-[#1aafc9e2]/10 border border-[#1aafc9e2]/20 text-[#1aafc9e2]"
                    : "hover:bg-gray-100 bg-white"
                }`}
              >
                <div>
                  <div className="font-medium text-sm">{s.title}</div>
                  {s.summary && (
                    <div className="text-xs text-[#1aafc9e2]/80 truncate max-w-[180px]">
                      {s.summary}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-300">›</div>
              </button>
            ))}
          </div>

          <div className="mt-6 border-t pt-4">
            <h4 className="text-xs text-[#1aafc9e2] uppercase mb-2">Actions</h4>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 px-3 py-2 bg-[#599E0E]/10 text-[#599E0E] rounded-md text-sm"
              >
                Imprimer
              </button>
              <button
                onClick={() =>
                  navigator.clipboard?.writeText(window.location.href)
                }
                className="px-3 py-2 bg-[#599E0E]/5 rounded-md text-sm"
              >
                Copier lien
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-3">
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="bg-[#1aafc9e2]/5fc9e2]/10 backdrop-blur-xl border rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                {section.summary && (
                  <p className="text-sm text-[#1aafc9e2] mt-2">
                    {section.summary}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-[#1aafc9e2]/80">{t("li.t")}</div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showChecklist}
                    onChange={() => setShowChecklist((s) => !s)}
                    className="form-checkbox h-4 w-4 text-[#1aafc9e2]"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6">
              {section.steps ? (
                <div className="space-y-3">
                  {section.steps.map((st) => (
                    <div
                      key={st.id}
                      className="border rounded-md overflow-hidden"
                    >
                      <motion.button
                        onClick={() => toggleStep(st.id)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left bg-[#599E0E]/5"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.995 }}
                      >
                        <div>
                          <div className="font-medium">{st.title}</div>
                          <div className="text-xs text-[#1aafc9e2]/80">
                            {st.content.length} points
                          </div>
                        </div>
                        <div className="text-[#1aafc9e2]/80">
                          {expandedStep === st.id ? "–" : "+"}
                        </div>
                      </motion.button>

                      <AnimatePresence>
                        {expandedStep === st.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-4 py-3 bg-[#1aafc9e2]/5 text-sm"
                          >
                            <ul className="list-disc pl-5 space-y-2">
                              {st.content.map((c, i) => (
                                <li key={i} className="text-[#599E0E]">
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="prose max-w-none text-sm">
                  <p>{section.summary}</p>
                </div>
              )}
            </div>

            {/* Safety checklist */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {showChecklist && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border rounded-md p-4 bg-[#599E0E]/10"
                >
                  <h4 className="text-sm font-semibold">{t("ch.eck")}</h4>
                  <ul className="mt-2 text-sm text-[#599E0E] space-y-2">
                    <li>
                     {t("li.ut")}
                    </li>
                    <li>{t("ve.ri")} </li>
                    <li>{t("sa.ge")}</li>
                    <li>{t("av.ant")}</li>
                  </ul>
                </motion.div>
              )}

              <div className="border rounded-md p-4 bg-[#599E0E]/5">
                <h4 className="text-sm font-semibold">{t("don.ne")}</h4>
                <div className="mt-3 text-sm text-[#599E0E] space-y-1">
                  <div>
                    <span className="text-xs text-[#1aafc9e2]">
                      {t("ca.pa")}
                    </span>
                    <div className="font-medium">200 L</div>
                  </div>
                  <div>
                    <span className="text-xs text-[#1aafc9e2]">
                      Temperature
                    </span>
                    <div className="font-medium">5 °C — 35 °C</div>
                  </div>
                  <div>
                    <span className="text-xs text-[#1aafc9e2]">pH cible</span>
                    <div className="font-medium">2.0 — 3.0</div>
                  </div>
                  <div>
                    <span className="text-xs text-[#1aafc9e2]">
                      Concentration
                    </span>
                    <div className="font-medium">1.44 mol/L ±5%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes & footer */}
            <div className="mt-6 text-xs text-[#1aafc9e2]/80">
              <div>
                {t("rem.ark" )}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
