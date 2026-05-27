import React, { useState, useEffect } from "react";
import adventureData from "./data/adventure.json";
import DiceRoll, { playDiceSound } from "./components/DiceRoll.js";
import AdventureIllustration from "./components/AdventureIllustration.js";
import CharacterSheet from "./components/CharacterSheet.js";
import InitialSetup from "./components/InitialSetup.js";
import CombatSimulator from "./components/CombatSimulator.js";
import { BookOpen, Sparkles, AlertTriangle } from "lucide-react";

export default function App() {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("firetop_stats");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  });

  const [currentSectionId, setCurrentSectionId] = useState(() => {
    return localStorage.getItem("firetop_section") || "1";
  });

  // Non-combat Luck checks
  const [luckStatus, setLuckStatus] = useState("not_tested"); // "not_tested", "shaking", "lucky", "unlucky"
  const [luckRollVal, setLuckRollVal] = useState(0);
  const [pLuckRoll, setPLuckRoll] = useState([1, 1]);

  // Sync to local storage whenever stats or section changes
  useEffect(() => {
    if (stats) {
      localStorage.setItem("firetop_stats", JSON.stringify(stats));
    } else {
      localStorage.removeItem("firetop_stats");
    }
  }, [stats]);

  useEffect(() => {
    localStorage.setItem("firetop_section", currentSectionId);
  }, [currentSectionId]);

  // Handle character sheet utilities
  const handleEatFood = () => {
    if (!stats || stats.food <= 0 || stats.stamina >= stats.maxStamina) return;
    setStats((prev) => ({
      ...prev,
      food: prev.food - 1,
      stamina: Math.min(prev.maxStamina, prev.stamina + 4)
    }));
  };

  const handleDrinkPotion = (type) => {
    if (!stats || stats.potions.doses <= 0) return;
    setStats((prev) => {
      const nextDoses = prev.potions.doses - 1;
      let skill = prev.skill;
      let stamina = prev.stamina;
      let luck = prev.luck;
      let maxLuck = prev.maxLuck;

      if (type === "skill") {
        skill = prev.maxSkill;
      } else if (type === "stamina") {
        stamina = prev.maxStamina;
      } else if (type === "luck") {
        maxLuck = prev.maxLuck + 1;
        luck = maxLuck;
      }

      return {
        ...prev,
        potions: { ...prev.potions, doses: nextDoses },
        skill,
        stamina,
        luck,
        maxLuck
      };
    });
  };

  const handleResetGame = () => {
    if (window.confirm("Biztosan elölről szeretnéd kezdeni a kalandot? Minden jelenlegi állásod és tárgyad elveszik.")) {
      setStats(null);
      setCurrentSectionId("1");
      setLuckStatus("not_tested");
      localStorage.removeItem("firetop_stats");
      localStorage.removeItem("firetop_section");
    }
  };

  // Option select with stat changes and inventory updates
  const handleSelectOption = (nextId) => {
    const nextSection = adventureData[nextId];
    if (!nextSection || !stats) return;

    setStats((prev) => {
      let gold = prev.gold;
      let stamina = prev.stamina;
      let skill = prev.skill;
      let luck = prev.luck;
      let items = [...prev.items];
      let keys = [...prev.keys];
      let spellLearned = prev.spellLearned;

      // Apply statChanges
      if (nextSection.statChange) {
        if (nextSection.statChange.gold) {
          gold = Math.max(0, gold + nextSection.statChange.gold);
        }
        if (nextSection.statChange.stamina) {
          stamina = Math.min(
            prev.maxStamina,
            Math.max(0, stamina + nextSection.statChange.stamina)
          );
        }
        if (nextSection.statChange.skill) {
          skill = Math.min(
            prev.maxSkill,
            Math.max(0, skill + nextSection.statChange.skill)
          );
        }
        if (nextSection.statChange.luck) {
          luck = Math.min(
            prev.maxLuck,
            Math.max(0, luck + nextSection.statChange.luck)
          );
        }
      }

      // Add item Gain
      if (nextSection.itemGain) {
        nextSection.itemGain.forEach((item) => {
          if (!items.includes(item)) {
            items.push(item);
          }
        });
      }

      // Add key Gain
      if (nextSection.keyGain) {
        const k = parseInt(nextSection.keyGain);
        if (!isNaN(k) && !keys.includes(k)) {
          keys.push(k);
        }
      }

      // Add magic spell learned
      if (nextSection.spellTaught) {
        spellLearned = true;
      }

      return {
        ...prev,
        gold,
        stamina,
        skill,
        luck,
        items,
        keys,
        spellLearned
      };
    });

    setCurrentSectionId(nextId);
    setLuckStatus("not_tested");
  };

  // Story luck testing logic
  const triggerLuckCheck = () => {
    if (!stats) return;
    setLuckStatus("shaking");
    playDiceSound();

    setTimeout(() => {
      const l1 = Math.floor(Math.random() * 6) + 1;
      const l2 = Math.floor(Math.random() * 6) + 1;
      const sum = l1 + l2;

      setPLuckRoll([l1, l2]);
      setLuckRollVal(sum);

      const isLucky = sum <= stats.luck;
      const nextLuck = Math.max(0, stats.luck - 1);

      setStats((prev) => ({
        ...prev,
        luck: nextLuck
      }));

      if (isLucky) {
        setLuckStatus("lucky");
      } else {
        setLuckStatus("unlucky");
      }
    }, 700);
  };

  const handleApplyLuckOutcome = (luckCheckData) => {
    const nextId = luckStatus === "lucky"
      ? luckCheckData.luckySection
      : luckCheckData.unluckySection;
    handleSelectOption(nextId);
  };

  // Magic chest calculation
  const handleChestCheck = () => {
    if (!stats) return;
    const keysSum = stats.keys.reduce((a, b) => a + b, 0);
    const hasThreeKeys = stats.keys.includes(9) && stats.keys.includes(66) && stats.keys.includes(111);

    if (hasThreeKeys && keysSum === 186) {
      handleSelectOption("186");
    } else {
      alert("Helytelen kulcs-kombináció! A lakat mögül apró dárdacsapdák találnak el, s a kalandod sikertelenül véget ér.");
      setStats(null);
      setCurrentSectionId("1");
      setLuckStatus("not_tested");
      localStorage.removeItem("firetop_stats");
      localStorage.removeItem("firetop_section");
    }
  };

  // Character creation screen setup
  if (!stats) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.03),transparent)] pointer-events-none" />
        <InitialSetup onSetupComplete={(rolledStats) => setStats(rolledStats)} />
      </div>
    );
  }

  // Loaded Story block
  const currentSection = adventureData[currentSectionId];
  const isCombat = currentSection && currentSection.combat;

  let mainContent = null;

  if (isCombat) {
    mainContent = (
      <CombatSimulator
        stats={stats}
        onStatsChange={(newStats) => setStats((prev) => ({ ...prev, ...newStats }))}
        combatInfo={currentSection.combat}
        onVictory={(winSec) => handleSelectOption(winSec)}
        onDefeat={() => {
          setStats(null);
          setCurrentSectionId("1");
          setLuckStatus("not_tested");
        }}
        onFlee={(fleeSec) => handleSelectOption(fleeSec)}
      />
    );
  } else if (currentSection) {
    let choicesPanel = null;

    if (currentSection.luckCheck) {
      choicesPanel = (
        <div className="bg-black/35 border border-[#c5a059]/20 rounded-2xl p-5 flex flex-col gap-4 my-2 relative z-10 shadow-lg" id="luck-checking-block">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#c5a059] font-bold block">
            Próbáld meg a szerencsédet!
          </span>
          <p className="text-xs text-[#d4cfc7]/80 leading-relaxed font-sans">
            {currentSection.luckCheck.text}
          </p>

          {luckStatus === "not_tested" && (
            <button
              onClick={triggerLuckCheck}
              className="w-full py-3 bg-[#c5a059] hover:bg-[#b08c48] text-black font-extrabold tracking-widest uppercase rounded-lg transition-all text-xs cursor-pointer shadow-lg active:scale-[0.98]"
            >
              Tedd próbára a Szerencsédet!
            </button>
          )}

          {luckStatus === "shaking" && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] mb-2 animate-pulse text-[#d4cfc7]/65 uppercase tracking-widest">Kockagurítás...</span>
              <DiceRoll rollValues={[1, 1]} shaking={true} />
            </div>
          )}

          {(luckStatus === "lucky" || luckStatus === "unlucky") && (
            <div className="flex flex-col gap-4 text-center items-center">
              <div className="flex justify-center gap-2 items-center text-sm font-bold font-serif bg-[#1a1a1a] p-3 rounded-lg border border-[#c5a059]/10 w-full">
                <span>Dice A: <strong>{pLuckRoll[0]}</strong></span>
                <span>Dice B: <strong>{pLuckRoll[1]}</strong></span>
                <span className="text-stone-500 font-normal">| Sum: <strong>{luckRollVal}</strong></span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#d4cfc7]/50">Eredmény:</span>
                <strong className={`text-xl font-serif tracking-widest uppercase mt-0.5 ${luckStatus === "lucky" ? "text-emerald-400" : "text-[#8b0000]"}`}>
                  {luckStatus === "lucky" ? "🍀 Szerencsés voltál!" : "💀 Balszerencse ért!"}
                </strong>
                <span className="text-[10px] text-[#d4cfc7]/50 mt-1 uppercase font-mono">
                  (Dobásod: {luckRollVal} s levontál 1 Szerencse pontot)
                </span>
              </div>
              <button
                onClick={() => handleApplyLuckOutcome(currentSection.luckCheck)}
                className="w-full mt-1 py-3 bg-[#1a1a1a] hover:bg-[#c5a059] hover:text-black border border-[#c5a059]/20 text-[#c5a059] font-bold text-xs uppercase tracking-widest rounded-lg transition-all cursor-pointer shadow-md"
              >
                Kaland folytatása az eredmény alapján
              </button>
            </div>
          )}
        </div>
      );
    } else if (currentSection.isFinalChestCheck) {
      choicesPanel = (
        <div className="bg-black/35 border border-[#c5a059]/20 rounded-2xl p-5 flex flex-col gap-4 my-2 text-center relative z-10 shadow-lg" id="chest-calculator-block">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#c5a059] font-bold block">
            A Varázsló Ládája
          </span>
          <p className="text-xs text-[#d4cfc7]/80 font-sans leading-relaxed max-w-md mx-auto">
            Három megszámozott kulcsot gyűjthettél össze utad során. A tekercs szerint add össze az azokon talált számokat, s próbáld meg kinyitni a zárat!
          </p>

          <div className="flex justify-center gap-2.5 my-1">
            {stats.keys.length === 0 ? (
              <span className="text-xs italic text-[#ff3333]">Egyetlen kulcs sincs a táskádban.</span>
            ) : (
              stats.keys.map((k) => (
                <span key={k} className="px-3.5 py-1.5 bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/30 font-bold font-serif text-sm rounded shadow-sm">
                  KULCS #{k}
                </span>
              ))
            )}
          </div>

          <button
            onClick={handleChestCheck}
            className="w-full py-3 bg-[#c5a059] hover:bg-[#b08c48] text-black font-extrabold tracking-widest uppercase rounded-lg transition-all text-xs cursor-pointer shadow-lg active:scale-[0.98]"
          >
            Kulcsok behelyezése és fordítása
          </button>
        </div>
      );
    } else if (currentSection.options) {
      choicesPanel = (
        <div className="flex flex-col gap-3 mt-4 relative z-10 animate-fade-in" id="options-block">
          <span className="text-[10px] font-mono uppercase text-[#c5a059] tracking-widest font-bold">
            Mit döntesz?
          </span>

          {currentSection.options.map((opt, i) => {
            const hasItemRequired = !opt.requiresItem || stats.items.includes(opt.requiresItem);
            const hasKeyRequired = !opt.requiresKey || stats.keys.includes(opt.requiresKey);
            const isSelectable = hasItemRequired && hasKeyRequired;

            return (
              <button
                key={i}
                onClick={() => handleSelectOption(opt.next)}
                disabled={!isSelectable}
                className={`w-full text-left p-4 border transition-all duration-300 group flex items-center justify-between uppercase tracking-wider text-xs font-bold cursor-pointer ${
                  isSelectable
                    ? "border-[#c5a059]/15 bg-[#1a1a1a] text-[#d4cfc7] hover:bg-[#c5a059] hover:text-black hover:border-transparent font-sans shadow-sm"
                    : "border-stone-900 bg-stone-950/20 text-stone-600 cursor-not-allowed opacity-40"
                }`}
              >
                <span className="pr-4 leading-relaxed">{opt.text}</span>
                <span className="flex items-center gap-2 shrink-0">
                  {opt.requiresItem && (
                    <span className="text-[9px] bg-[#121212] text-[#c5a059] px-2 py-0.5 rounded border border-[#c5a059]/30 tracking-widest uppercase font-mono font-normal">
                      Kell: {opt.requiresItem}
                    </span>
                  )}
                  {opt.requiresKey && (
                    <span className="text-[9px] bg-[#121212] text-[#c5a059] px-2 py-0.5 rounded border border-[#c5a059]/30 tracking-widest uppercase font-mono font-normal">
                      Kulcs #{opt.requiresKey}
                    </span>
                  )}
                  {isSelectable && <span className="text-xs group-hover:translate-x-1 transition-transform">➔</span>}
                </span>
              </button>
            );
          })}

          {currentSection.options.length === 0 && (
            <div className="text-center pt-6">
              <button
                onClick={() => {
                  setStats(null);
                  setCurrentSectionId("1");
                  setLuckStatus("not_tested");
                }}
                className="px-8 py-3 bg-[#8b0000] hover:bg-[#a00000] text-stone-200 uppercase font-extrabold text-xs tracking-widest rounded-lg cursor-pointer shadow-lg transition-all duration-300 transform active:scale-95"
              >
                Új Kaland Kezdése
              </button>
            </div>
          )}
        </div>
      );
    }

    mainContent = (
      <div className="flex flex-col gap-6 bg-[#0d0d0d] p-8 md:p-10 rounded-2xl border border-[#c5a059]/15 shadow-2xl relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.02),transparent)] pointer-events-none rounded-2xl" />
        <div className="text-[#d4cfc7] leading-relaxed font-sans text-lg whitespace-pre-line text-justify first-letter:text-5xl first-letter:text-[#c5a059] first-letter:mr-3 first-letter:float-left first-letter:font-serif first-letter:font-bold z-10">
          {currentSection.text}
        </div>
        {choicesPanel}
      </div>
    );
  } else {
    mainContent = (
      <div className="p-8 bg-black/40 text-center rounded-2xl border border-[#c5a059]/10">
        <p className="text-stone-400">Ismeretlen szekció az útvesztőben...</p>
        <button
          onClick={() => {
            setStats(null);
            setCurrentSectionId("1");
            setLuckStatus("not_tested");
          }}
          className="mt-4 px-6 py-2 bg-[#c5a059] text-black font-bold uppercase rounded text-xs cursor-pointer"
        >
          Reset kaland
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4cfc7] flex flex-col md:flex-row relative">
      {/* Sidebar Character Sheet */}
      <aside className="w-full md:w-80 md:min-h-screen bg-[#0f0f0f] border-b md:border-b-0 md:border-r border-[#c5a059]/10 p-4 md:p-6 shrink-0 overflow-y-auto">
        <CharacterSheet
          stats={stats}
          onEatFood={handleEatFood}
          onDrinkPotion={handleDrinkPotion}
          onResetGame={handleResetGame}
        />
      </aside>

      {/* Main Adventure Section */}
      <main className="flex-1 p-4 md:p-12 flex flex-col max-w-2xl mx-auto justify-center gap-6 relative">
        <header className="flex justify-between items-center border-b border-[#c5a059]/20 pb-4 mb-2">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#c5a059] animate-pulse" />
            <span className="font-serif text-lg lg:text-xl tracking-widest text-[#c5a059] uppercase">
              A Sötét Útvesztő
            </span>
          </div>
          <span className="text-[10px] tracking-widest uppercase font-mono text-[#d4cfc7]/60 bg-black/40 border border-[#c5a059]/20 px-3 py-1 rounded-full">
            Bekezdés: #{currentSectionId}
          </span>
        </header>

        {/* Dynamic Illustrator Banner */}
        <AdventureIllustration
          id={currentSectionId}
          monsterName={currentSection?.combat?.monsterName}
          isFight={!!isCombat}
        />

        {/* Middle interactive arena */}
        <div id="active-story-block">
          {mainContent}
        </div>

        {/* Vintage watermark stamp background */}
        <div className="absolute bottom-4 right-12 pointer-events-none opacity-[0.03] text-[120px] font-serif font-black select-none z-0 tracking-tighter">
          {currentSectionId.toString().padStart(3, "0")}
        </div>
      </main>
    </div>
  );
}
