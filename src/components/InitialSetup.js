import React, { useState } from "react";
import DiceRoll, { playDiceSound } from "./DiceRoll.js";
import { Sparkles, Compass, ShieldAlert, Sparkle } from "lucide-react";

export default function InitialSetup({ onSetupComplete }) {
  const [step, setStep] = useState("intro"); // "intro", "rolling", "potion"
  const [isRolling, setIsRolling] = useState(false);
  const [stats, setStats] = useState({ skill: 0, stamina: 0, luck: 0 });
  const [chosenPotion, setChosenPotion] = useState("stamina");

  const startRolling = () => {
    setIsRolling(true);
    playDiceSound();
    let counter = 0;
    
    const interval = setInterval(() => {
      setStats({
        skill: Math.floor(Math.random() * 6) + 1 + 6,
        stamina: Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + 12,
        luck: Math.floor(Math.random() * 6) + 1 + 6
      });
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        const finalSkill = Math.floor(Math.random() * 6) + 1 + 6;
        const finalStamina = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + 12;
        const finalLuck = Math.floor(Math.random() * 6) + 1 + 6;
        
        setStats({
          skill: finalSkill,
          stamina: finalStamina,
          luck: finalLuck
        });
        setIsRolling(false);
        setStep("potion");
      }
    }, 70);
  };

  const handleFinish = () => {
    onSetupComplete({
      skill: stats.skill,
      maxSkill: stats.skill,
      stamina: stats.stamina,
      maxStamina: stats.stamina,
      luck: stats.luck,
      maxLuck: stats.luck,
      gold: 0,
      food: 10,
      potions: {
        type: chosenPotion,
        doses: 2
      },
      keys: [],
      items: [],
      gems: 0,
      spellLearned: false
    });
  };

  if (step === "intro") {
    return (
      <div className="w-full max-w-xl mx-auto rounded-3xl bg-[#0d0d0d] border border-[#c5a059]/35 p-8 shadow-[0_15px_60px_rgba(0,0,0,0.95)] text-center relative z-20" id="intro-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.03),transparent)] pointer-events-none rounded-3xl" />
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#c5a059]/10 border border-[#c5a059]/40 rounded-full flex items-center justify-center text-3xl">
            ⚔️
          </div>
        </div>
        <h1 className="font-serif text-2xl lg:text-3xl font-black text-[#c5a059] tracking-widest uppercase mb-2">
          A Tűzhegy Varázslója
        </h1>
        <p className="text-[10px] font-mono uppercase tracking-widest text-[#d4cfc7]/50 mb-6">
          Steve Jackson & Ian Livingstone klasszikus játékkönyve
        </p>

        <div className="text-sm text-[#d4cfc7]/85 font-sans leading-relaxed text-justify space-y-4 max-w-md mx-auto my-6 p-4 rounded-xl bg-black/30 border border-stone-900 shadow-inner">
          <p>
            Útra kelsz a legendás <strong>Tűzhegy</strong> sötét és veszélyes mélyére, 
            hogy megküzdj a gonosz varázslóval és elragadd tőle a rejtett kincseket. 
            A barlang tele van rettenetes szörnyekkel, rejtvényekkel és elágazásokkal, 
            ahol minden apró döntésed életről vagy halálról dönthet.
          </p>
          <p className="text-[#c5a059] font-serif italic text-center text-xs">
            "Merész kalandor! Készítsd fel a fegyveredet, mert a kapuk mögött csak a legbátrabbak maradhatnak életben."
          </p>
        </div>

        <button
          onClick={() => setStep("rolling")}
          className="mt-4 px-8 py-3.5 bg-[#c5a059] hover:bg-[#b08c48] text-black font-extrabold tracking-widest uppercase rounded-lg transition-all shadow-lg active:scale-95 cursor-pointer text-xs"
        >
          Készítsd fel a karaktered!
        </button>
      </div>
    );
  }

  if (step === "rolling") {
    return (
      <div className="w-full max-w-xl mx-auto rounded-3xl bg-[#0d0d0d] border border-[#c5a059]/35 p-8 shadow-[0_15px_60px_rgba(0,0,0,0.95)] text-center relative z-20" id="rolling-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(c5a059,0.02),transparent)] pointer-events-none rounded-3xl" />
        
        <h2 className="font-serif text-[#c5a059] text-xl font-bold tracking-widest uppercase mb-1">
          Karakter Statisztikák Gurítása
        </h2>
        <p className="text-[10px] font-mono uppercase text-stone-500 tracking-wider mb-6">
          A kocka dönt a sorsod és értékeid felett!
        </p>

        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
          <div className="bg-black/40 border border-[#c5a059]/10 p-4 rounded-xl shadow">
            <span className="text-[9px] uppercase font-mono text-[#c5a059] tracking-wider block mb-1">Ügyesség</span>
            <span className="text-3xl font-black text-stone-100 font-serif">
              {stats.skill || "?"}
            </span>
            <span className="text-[8px] text-stone-600 block mt-1 font-mono">1d6 + 6</span>
          </div>

          <div className="bg-black/40 border border-[#8b0000]/25 p-4 rounded-xl shadow">
            <span className="text-[9px] uppercase font-mono text-[#ff3333] tracking-wider block mb-1">Életerő</span>
            <span className="text-3xl font-black text-stone-100 font-serif">
              {stats.stamina || "?"}
            </span>
            <span className="text-[8px] text-stone-600 block mt-1 font-mono">2d6 + 12</span>
          </div>

          <div className="bg-black/40 border border-[#c5a059]/10 p-4 rounded-xl shadow">
            <span className="text-[9px] uppercase font-mono text-[#c5a059] tracking-wider block mb-1">Szerencse</span>
            <span className="text-3xl font-black text-stone-100 font-serif">
              {stats.luck || "?"}
            </span>
            <span className="text-[8px] text-stone-600 block mt-1 font-mono">1d6 + 6</span>
          </div>
        </div>

        {stats.skill > 0 && (
          <div className="p-3.5 bg-black/25 rounded-xl border border-stone-900 text-xs text-[#d4cfc7]/70 font-sans leading-relaxed max-w-sm mx-auto mb-6 animate-fade-in-up">
            Szép dobások! Az <strong>Ügyesség</strong> határozza meg a harci sikereidet, az <strong>Életerő</strong> bírja majd a sebzéseket, a <strong>Szerencse</strong> pedig megvédhet a végzetes csapásoktól.
          </div>
        )}

        <div className="flex justify-center flex-col items-center gap-4">
          {isRolling ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs italic text-amber-500 animate-pulse font-mono uppercase">Zörögnek a csontok...</span>
              <DiceRoll rollValues={[Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]} shaking={true} />
            </div>
          ) : (
            <button
              onClick={startRolling}
              className="px-8 py-3.5 bg-[#8b0000] hover:bg-[#a00000] text-stone-100 font-extrabold uppercase tracking-widest rounded-lg transition-all shadow-lg active:scale-95 cursor-pointer text-xs"
            >
              {stats.skill > 0 ? "Újragurítás kezdeményezése" : "Gurítás a sors kockájával!"}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (step === "potion") {
    return (
      <div className="w-full max-w-xl mx-auto rounded-3xl bg-[#0d0d0d] border border-[#c5a059]/35 p-8 shadow-[0_15px_60px_rgba(0,0,0,0.95)] text-center relative z-20" id="potion-screen">
        <h2 className="font-serif text-[#c5a059] text-xl font-bold tracking-widest uppercase mb-1">
          Hátizsák és Varázsital
        </h2>
        <p className="text-[10px] font-mono uppercase text-stone-500 tracking-wider mb-6">
          Válassz útitársul egy titokzatos elixírt a hátizsákodba! (2 adagot tartalmaz)
        </p>

        <div className="flex flex-col gap-3 max-w-md mx-auto mb-8">
          {/* Option: Skill */}
          <button
            onClick={() => setChosenPotion("skill")}
            className={`p-4 text-left border rounded-xl transition-all cursor-pointer flex justify-between items-center ${
              chosenPotion === "skill"
                ? "border-[#c5a059] bg-[#c5a059]/5 text-[#c5a059]"
                : "border-stone-900 bg-stone-950/25 text-[#d4cfc7]/65 hover:border-stone-800"
            }`}
          >
            <div className="flex flex-col pr-4">
              <strong className="text-xs uppercase font-serif tracking-wider">Ügyesség Itala</strong>
              <span className="text-[10px] text-[#d4cfc7]/60 font-sans mt-0.5 leading-relaxed">
                Visszaállítja az ÜGYESSÉGEDET a teljes kezdő maximumára akármikor, amikor csak megiszod a sötétségben.
              </span>
            </div>
            <span className="text-xl shrink-0">💧</span>
          </button>

          {/* Option: Stamina */}
          <button
            onClick={() => setChosenPotion("stamina")}
            className={`p-4 text-left border rounded-xl transition-all cursor-pointer flex justify-between items-center ${
              chosenPotion === "stamina"
                ? "border-[#c5a059] bg-[#c5a059]/5 text-[#c5a059]"
                : "border-stone-900 bg-stone-950/25 text-[#d4cfc7]/65 hover:border-stone-800"
            }`}
          >
            <div className="flex flex-col pr-4">
              <strong className="text-xs uppercase font-serif tracking-wider">Erőnlét és Életerő Itala</strong>
              <span className="text-[10px] text-[#d4cfc7]/60 font-sans mt-0.5 leading-relaxed">
                Teljesen feltölti az ÉLETERŐ (Stamina) pontjaidat a kezdeti értékre még a legdrámaibb sérülések után is.
              </span>
            </div>
            <span className="text-xl shrink-0">❤️</span>
          </button>

          {/* Option: Luck */}
          <button
            onClick={() => setChosenPotion("luck")}
            className={`p-4 text-left border rounded-xl transition-all cursor-pointer flex justify-between items-center ${
              chosenPotion === "luck"
                ? "border-[#c5a059] bg-[#c5a059]/5 text-[#c5a059]"
                : "border-stone-900 bg-stone-950/25 text-[#d4cfc7]/65 hover:border-stone-800"
            }`}
          >
            <div className="flex flex-col pr-4">
              <strong className="text-xs uppercase font-serif tracking-wider">Szerencse Itala</strong>
              <span className="text-[10px] text-[#d4cfc7]/60 font-sans mt-0.5 leading-relaxed">
                Feltölti a SZERENCSE pontjaidat s megnöveli azok kezdeti maximumát +1 ponttal. Igazi segítség holtponton!
              </span>
            </div>
            <span className="text-xl shrink-0">🍀</span>
          </button>
        </div>

        <button
          onClick={handleFinish}
          className="px-8 py-3.5 bg-[#c5a059] hover:bg-[#b08c48] text-black font-extrabold tracking-widest uppercase rounded-lg transition-all shadow-lg active:scale-95 cursor-pointer text-xs"
        >
          Kezdjük meg a Kalandot!
        </button>
      </div>
    );
  }

  return null;
}
