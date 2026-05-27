import React, { useState, useEffect } from "react";
import DiceRoll, { playDiceSound } from "./DiceRoll.js";
import { Skull, Heart, Activity, ShieldCheck, Zap, RotateCcw, AlertTriangle } from "lucide-react";

export default function CombatSimulator({ stats, onStatsChange, combatInfo, onVictory, onDefeat, onFlee }) {
  const { monsterName, skill: monsterSkill, stamina: monsterStamina, winSection, fleeSection } = combatInfo;

  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState("idle"); // "idle", "shaking_attack", "attack_rolled", "shaking_luck", "ended"
  const [pRoll, setPRoll] = useState([1, 1]);
  const [mRoll, setMRoll] = useState([1, 1]);
  const [pAttack, setPAttack] = useState(0);
  const [mAttack, setMAttack] = useState(0);
  const [roundWinner, setRoundWinner] = useState(null); // "player", "monster", "tie"
  const [logs, setLogs] = useState(["Fegyvert rántasz... megkezdődött a küzdelem!"]);

  // Track stamina locally of both combatants during simulation
  const [mCurrentStamina, setMCurrentStamina] = useState(monsterStamina);
  const [pCurrentStamina, setPCurrentStamina] = useState(stats.stamina);

  // Sync player stamina to local if stats changes (like drinking potion mid-combat)
  useEffect(() => {
    setPCurrentStamina(stats.stamina);
  }, [stats.stamina]);

  const addLog = (message) => {
    setLogs((prev) => [message, ...prev]);
  };

  const handleRollFight = () => {
    playDiceSound();
    setPhase("shaking_attack");

    setTimeout(() => {
      const p1 = Math.floor(Math.random() * 6) + 1;
      const p2 = Math.floor(Math.random() * 6) + 1;
      const m1 = Math.floor(Math.random() * 6) + 1;
      const m2 = Math.floor(Math.random() * 6) + 1;

      setPRoll([p1, p2]);
      setMRoll([m1, m2]);

      const pAtk = p1 + p2 + stats.skill;
      const mAtk = m1 + m2 + monsterSkill;

      setPAttack(pAtk);
      setMAttack(mAtk);

      let winner = "tie";
      if (pAtk > mAtk) {
        winner = "player";
        addLog(`Kör #${round}: Sikeres csapás! (Támadóerőd: ${pAtk} vs ${mAtk})`);
      } else if (mAtk > pAtk) {
        winner = "monster";
        addLog(`Kör #${round}: Sebeztél! A szörnyeteg eltalált (Támadóerőd: ${pAtk} vs ${mAtk})`);
      } else {
        winner = "tie";
        addLog(`Kör #${round}: Döntetlen hárítás! (Támadóerő: ${pAtk} mindkét félnél)`);
      }

      setRoundWinner(winner);
      setPhase("attack_rolled");
    }, 800);
  };

  const applyPlainDamage = () => {
    if (roundWinner === "player") {
      const remainingMonster = Math.max(0, mCurrentStamina - 2);
      setMCurrentStamina(remainingMonster);
      addLog(`Megsebezted a szörnyet (-2 Életerő).`);
      resolveRoundEnd(remainingMonster, pCurrentStamina);
    } else if (roundWinner === "monster") {
      // If player has Moonshield (Holdpajzs) item, let's absorb 1 damage randomly
      const hasShield = stats.items.includes("Holdpajzs");
      const shieldTriggers = hasShield && Math.random() > 0.4;
      const dmg = shieldTriggers ? 1 : 2;

      if (shieldTriggers) {
        addLog(`🛡️ Holdpajzs elnyelt 1 sebzést az ellenség csapásából!`);
      }

      const remainingPlayer = Math.max(0, pCurrentStamina - dmg);
      setPCurrentStamina(remainingPlayer);
      onStatsChange({ stamina: remainingPlayer });
      addLog(`Megsebesültél (-${dmg} Életerő).`);
      resolveRoundEnd(mCurrentStamina, remainingPlayer);
    } else {
      resolveRoundEnd(mCurrentStamina, pCurrentStamina);
    }
  };

  const applyLuckTest = () => {
    if (stats.luck <= 0) return;
    playDiceSound();
    setPhase("shaking_luck");

    setTimeout(() => {
      const l1 = Math.floor(Math.random() * 6) + 1;
      const l2 = Math.floor(Math.random() * 6) + 1;
      const sum = l1 + l2;

      const isLucky = sum <= stats.luck;
      const nextLuck = Math.max(0, stats.luck - 1);
      
      onStatsChange({ luck: nextLuck });

      if (roundWinner === "player") {
        if (isLucky) {
          const remainingMonster = Math.max(0, mCurrentStamina - 4);
          setMCurrentStamina(remainingMonster);
          addLog(`🍀 Szerencse Próba: SIKERES! Megduplázott csapás (-4 Életerő a szörnynek)!`);
          resolveRoundEnd(remainingMonster, pCurrentStamina);
        } else {
          const remainingMonster = Math.max(0, mCurrentStamina - 1);
          setMCurrentStamina(remainingMonster);
          addLog(`💀 Szerencse Próba: SIKERTELEN. Csak könnyű karcolás (-1 Életerő a szörnynek).`);
          resolveRoundEnd(remainingMonster, pCurrentStamina);
        }
      } else if (roundWinner === "monster") {
        if (isLucky) {
          const remainingPlayer = Math.max(0, pCurrentStamina - 1);
          setPCurrentStamina(remainingPlayer);
          onStatsChange({ stamina: remainingPlayer });
          addLog(`🍀 Szerencse Próba: SIKERES! Elnyeltél egy kis sebet, csak (-1 Életerőt) vesztettél.`);
          resolveRoundEnd(mCurrentStamina, remainingPlayer);
        } else {
          const remainingPlayer = Math.max(0, pCurrentStamina - 3);
          setPCurrentStamina(remainingPlayer);
          onStatsChange({ stamina: remainingPlayer });
          addLog(`💀 Szerencse Próba: SIKERTELEN. Súlyosbított és mély seb, (-3 Életerőt) vesztettél!`);
          resolveRoundEnd(mCurrentStamina, remainingPlayer);
        }
      }
    }, 800);
  };

  const resolveRoundEnd = (monsterStam, playerStam) => {
    if (playerStam <= 0) {
      setPhase("ended");
      addLog(`💀 Elesel a diadalmas csatában. Kalandod itt véget ért.`);
    } else if (monsterStam <= 0) {
      setPhase("ended");
      addLog(`🏆 Legyőzted ellenségedet, a(z) ${monsterName} holtan esik össze!`);
    } else {
      setRound((prev) => prev + 1);
      setPhase("idle");
    }
  };

  const handleNextRound = () => {
    setRound((prev) => prev + 1);
    setPhase("idle");
    setRoundWinner(null);
  };

  const handleFlee = () => {
    // Escaping costs 2 stamina
    const remainingPC = Math.max(0, pCurrentStamina - 2);
    setPCurrentStamina(remainingPC);
    onStatsChange({ stamina: remainingPC });
    if (remainingPC <= 0) {
      onDefeat();
    } else {
      onFlee(fleeSection);
    }
  };

  const pStaminaPct = stats.maxStamina > 0 ? (pCurrentStamina / stats.maxStamina) * 100 : 0;
  const mStaminaPct = monsterStamina > 0 ? (mCurrentStamina / monsterStamina) * 100 : 0;

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-[#0d0d0d] border border-[#c5a059]/20 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.9)] text-[#d4cfc7] flex flex-col gap-6 font-sans relative" id="combat-simulator">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.01),transparent)] pointer-events-none rounded-2xl" />

      {/* Target headers */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-3 rounded-xl border border-[#c5a059]/10 z-10">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono uppercase text-[#c5a059] tracking-widest font-bold">Lovag</span>
          <span className="text-sm font-bold font-serif text-[#d4cfc7]">Hős Kalandor</span>
        </div>
        <div className="px-3 py-1 bg-[#8b0000]/10 rounded-full border border-[#8b0000]/30 text-[10px] font-bold text-[#ff3333] uppercase tracking-widest font-mono">
          {round}. Kör
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] font-mono uppercase text-[#c5a059] tracking-widest font-bold">Kreatúra</span>
          <span className="text-sm font-bold font-serif text-[#d4cfc7]">{monsterName}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 z-10">
        {/* Player Stamina Bar */}
        <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-black/40 border border-[#c5a059]/15">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold flex items-center gap-1.5 uppercase font-mono tracking-wider text-[10px] text-[#c5a059]">
              ❤ Te
            </span>
            <span className="font-serif text-[#ff3333] font-bold text-sm">{pCurrentStamina} / {stats.maxStamina}</span>
          </div>
          <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-[#c5a059]/10">
            <div
              className="h-full bg-gradient-to-r from-[#8b0000] to-[#ff3333] transition-all duration-300"
              style={{ width: `${pStaminaPct}%` }}
            />
          </div>
          <span className="text-[9px] text-[#d4cfc7]/50 font-mono uppercase tracking-wider mt-1">
            Fegyverügyesség: {stats.skill}
          </span>
        </div>

        {/* Monster Stamina Bar */}
        <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-black/40 border border-[#c5a059]/15">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#c5a059] flex items-center gap-1.5 uppercase font-mono tracking-wider text-[10px]">
              🌊 {monsterName}
            </span>
            <span className="font-serif text-[#c5a059] font-bold text-sm">{mCurrentStamina} / {monsterStamina}</span>
          </div>
          <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-[#c5a059]/10">
            <div
              className="h-full bg-gradient-to-r from-[#ab8240] to-[#c5a059] transition-all duration-300"
              style={{ width: `${mStaminaPct}%` }}
            />
          </div>
          <span className="text-[9px] text-[#d4cfc7]/50 font-mono uppercase tracking-wider mt-1">
            Fegyverügyesség: {monsterSkill}
          </span>
        </div>
      </div>

      {/* Interactive visual state outputs */}
      <div className="p-5 rounded-2xl bg-black/50 border border-[#c5a059]/15 flex flex-col gap-4 text-center z-10 shadow-inner">
        {phase === "idle" && (
          <div className="py-6 flex flex-col items-center gap-4">
            <span className="text-xs text-[#d4cfc7]/75 font-sans leading-relaxed max-w-xs">
              Mérd össze fegyvered erejét a szörnyeteggel a dobások elindításával!
            </span>
            <button
              onClick={handleRollFight}
              className="px-8 py-3.5 bg-[#8b0000] hover:bg-[#a00000] text-stone-100 font-extrabold uppercase tracking-widest rounded-lg transition-all shadow-lg active:scale-95 cursor-pointer text-xs flex items-center gap-2 font-mono"
            >
              Kockák Elgurítása (Roll ⚔)
            </button>
          </div>
        )}

        {phase === "shaking_attack" && (
          <div className="py-2 flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#ff3333] tracking-widest animate-pulse font-semibold">
              Kard acélja csattan, kockák gurulnak...
            </span>
            <DiceRoll rollValues={[Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]} shaking={true} />
          </div>
        )}

        {phase === "shaking_luck" && (
          <div className="py-2 flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#c5a059] tracking-widest animate-pulse font-semibold">
              Szerencsekockák gurulnak a mélység asztalán...
            </span>
            <DiceRoll rollValues={[Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]} shaking={true} />
          </div>
        )}

        {phase === "attack_rolled" && (
          <div className="flex flex-col items-center gap-4 animate-fade-in py-2">
            <div className="grid grid-cols-2 gap-6 w-full max-w-xs">
              <div className="flex flex-col items-center p-3.5 bg-black rounded-xl border border-[#c5a059]/15">
                <span className="text-[9px] uppercase tracking-widest font-mono text-[#d4cfc7]/50">Dobásod</span>
                <span className="text-2xl font-black font-serif my-1 text-[#d4cfc7]">{pRoll[0]} + {pRoll[1]}</span>
                <span className="text-[9px] text-[#d4cfc7]/40 font-mono uppercase mt-0.5">Ügyesség: +{stats.skill}</span>
                <span className="text-sm font-black text-[#c5a059] font-serif mt-2 uppercase tracking-wide">Támadóerő: {pAttack}</span>
              </div>
              <div className="flex flex-col items-center p-3.5 bg-black rounded-xl border border-[#c5a059]/15">
                <span className="text-[9px] uppercase tracking-widest font-mono text-[#d4cfc7]/50">Szörny dobása</span>
                <span className="text-2xl font-black font-serif my-1 text-[#ff3333]">{mRoll[0]} + {mRoll[1]}</span>
                <span className="text-[9px] text-[#d4cfc7]/40 font-mono uppercase mt-0.5">Ügyesség: +{monsterSkill}</span>
                <span className="text-sm font-black text-[#ff3333] font-serif mt-2 uppercase tracking-wide">Támadóerő: {mAttack}</span>
              </div>
            </div>

            {roundWinner === "tie" ? (
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs text-[#d4cfc7]/85 font-sans italic max-w-sm">
                  Döntetlen! Mindkét fél sikeresen kivédte a csapást, egyikőtök sem sérült.
                </span>
                <button
                  onClick={handleNextRound}
                  className="px-6 py-2 bg-black border border-[#c5a059]/30 text-[#c5a059] hover:bg-[#c5a059] hover:text-black rounded-lg text-[10px] tracking-widest uppercase font-mono transition-colors font-bold cursor-pointer"
                >
                  Következő forduló
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center gap-3.5 border-t border-[#c5a059]/10 pt-4">
                <span className="text-xs font-serif text-[#d4cfc7]/80 leading-relaxed max-w-md">
                  {roundWinner === "player"
                    ? "Sikeres támadást mértél az ellenfélre! Teszel egy Szerencse próbát a sebzés megduplázásához?"
                    : "Az ellenfél áttörte védelmed! Teszel Szerencse próbát a sebzés csökkentésére?"}
                </span>
                <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                  <button
                    onClick={applyPlainDamage}
                    className="py-2.5 bg-[#1a1a1a] hover:bg-[#c5a059] hover:text-black border border-[#c5a059]/20 text-[#d4cfc7] text-[10px] font-extrabold uppercase tracking-widest rounded-lg transition-all cursor-pointer shadow-md"
                  >
                    Sima sebzés (-2 Életerő)
                  </button>
                  <button
                    onClick={applyLuckTest}
                    disabled={stats.luck <= 0}
                    className="py-2.5 bg-[#8b0000] hover:bg-[#a00000] text-stone-100 text-[10px] font-extrabold uppercase tracking-widest rounded-lg transition-all cursor-pointer shadow-md disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    Szerencse Próba!
                  </button>
                </div>
                {stats.luck <= 0 && (
                  <span className="text-[10px] text-[#ff3333] italic">
                    Minden szerencséd elfogyott ebben a sötét járatban.
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {phase === "ended" && (
          <div className="py-4 flex flex-col items-center gap-4 animate-fade-in">
            {pCurrentStamina <= 0 ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-red-950/20 border border-[#8b0000]/65 rounded-full flex items-center justify-center">
                  <Skull className="w-7 h-7 text-[#ff3333]" />
                </div>
                <h3 className="text-xl font-bold font-serif text-[#ff3333] uppercase tracking-wider">Mártírhalál</h3>
                <p className="text-xs text-[#d4cfc7]/60 font-sans max-w-sm leading-relaxed text-center">
                  Az utolsó csepp állóképességed is oda lett. A Tűzhegy elnyeli a testedet.
                </p>
                <button
                  onClick={onDefeat}
                  className="px-8 py-3 bg-[#8b0000] hover:bg-[#a00000] text-stone-100 font-extrabold uppercase tracking-widest rounded-lg shadow-lg mt-2 cursor-pointer text-xs"
                >
                  Új karakter létrehozása
                </button>
              </div>
            ) : (
              <div className="grid gap-3 justify-items-center">
                <div className="w-14 h-14 bg-[#c5a059]/10 border border-[#c5a059] rounded-full flex items-center justify-center text-xl">
                  🏆
                </div>
                <h3 className="text-xl font-bold font-serif text-[#c5a059] uppercase tracking-widest">A Csatát Megnyerted!</h3>
                <p className="text-xs text-[#d4cfc7]/60 font-sans leading-relaxed text-center">
                  Halálos áldozatot szedtél s letiportad a gonoszt. Folytathatod az utadat.
                </p>
                <button
                  onClick={() => onVictory(winSection)}
                  className="px-8 py-3 bg-[#c5a059] hover:bg-[#b08c48] text-black font-extrabold uppercase tracking-widest rounded-lg shadow-lg mt-2 cursor-pointer text-xs"
                >
                  Kaland folytatása
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {fleeSection && phase !== "ended" && (
        <div className="text-center pt-1 z-10">
          <button
            onClick={handleFlee}
            className="px-5 py-2.5 bg-black/80 hover:bg-[#8b0000]/25 text-[#d4cfc7]/60 hover:text-[#ff3333] border border-stone-900 hover:border-[#8b0000]/40 rounded-lg text-xs font-bold transition-all uppercase tracking-widest cursor-pointer"
          >
            Menekülés a csatából (-2 ÉLETERŐ sebzésért)
          </button>
        </div>
      )}

      {/* Fight history logger */}
      <div className="flex flex-col gap-2 max-h-36 overflow-y-auto border-t border-[#c5a059]/10 pt-4 text-xs font-sans text-[#d4cfc7]/60 z-10">
        <span className="text-[10px] font-mono uppercase text-[#c5a059] tracking-widest font-bold">Harc krónikája</span>
        {logs.map((line, idx) => (
          <div key={idx} className="border-b border-black/30 pb-1 text-[#d4cfc7]/75 font-sans leading-relaxed">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
