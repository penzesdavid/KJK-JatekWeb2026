import React from "react";
import {
  Shield,
  Heart,
  Activity,
  Coins,
  Apple,
  FlaskConical,
  Key,
  Star,
  RefreshCw,
  Sparkles
} from "lucide-react";

export default function CharacterSheet({ stats, onEatFood, onDrinkPotion, onResetGame }) {
  if (!stats) return null;

  const isStaminaMax = stats.stamina >= stats.maxStamina;
  const noFood = stats.food <= 0;
  const noPotion = stats.potions.doses <= 0;

  let potionHungarianName = "Kalandorok Itala";
  if (stats.potions.type === "skill") potionHungarianName = "Ügyesség Itala";
  if (stats.potions.type === "stamina") potionHungarianName = "Erőnlét Itala";
  if (stats.potions.type === "luck") potionHungarianName = "Szerencse Itala";

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Title */}
      <div className="flex flex-col border-b border-[#c5a059]/30 pb-4">
        <h2 className="font-serif text-[#c5a059] text-xl font-black tracking-widest uppercase">
          Kalandorlap
        </h2>
        <span className="text-[9px] uppercase font-mono tracking-widest text-stone-500">
          Tűzhegy felfedezője
        </span>
      </div>

      {/* Primary Stats Panel */}
      <div className="flex flex-col gap-3">
        {/* ÜGYESSÉG */}
        <div className="bg-black/40 border border-[#c5a059]/10 p-3.5 rounded-xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-[#c5a059]" />
            <div className="flex flex-col">
              <span className="text-sm font-bold font-serif text-[#d4cfc7] uppercase tracking-wide">Ügyesség</span>
              <span className="text-[9px] text-stone-500 font-mono uppercase">Módosító harcban</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-serif text-[#c5a059]">{stats.skill}</span>
            <span className="text-xs text-stone-600 font-mono ml-1">/{stats.maxSkill}</span>
          </div>
        </div>

        {/* ÉLETERŐ */}
        <div className="bg-black/40 border border-[#8b0000]/20 p-3.5 rounded-xl flex flex-col gap-2 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-[#ff3333] fill-[#ff3333]/15" />
              <div className="flex flex-col">
                <span className="text-sm font-bold font-serif text-[#d4cfc7] uppercase tracking-wide">Életerő</span>
                <span className="text-[9px] text-stone-500 font-mono uppercase">Sebződés és túlélés</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-serif text-[#ff3333]">{stats.stamina}</span>
              <span className="text-xs text-stone-600 font-mono ml-1">/{stats.maxStamina}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-[#8b0000]/10">
            <div
              className="h-full bg-gradient-to-r from-[#8b0000] to-[#ff3333] transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, (stats.stamina / stats.maxStamina) * 100))}%` }}
            />
          </div>
        </div>

        {/* SZERENCSE */}
        <div className="bg-black/40 border border-[#c5a059]/10 p-3.5 rounded-xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#c5a059]" />
            <div className="flex flex-col">
              <span className="text-sm font-bold font-serif text-[#d4cfc7] uppercase tracking-wide">Szerencse</span>
              <span className="text-[9px] text-stone-500 font-mono uppercase">Kritikus helyzetben</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-serif text-[#c5a059]">{stats.luck}</span>
            <span className="text-xs text-stone-600 font-mono ml-1">/{stats.maxLuck}</span>
          </div>
        </div>
      </div>

      {/* Inventory & Actions */}
      <div className="flex flex-col gap-5 border-t border-[#c5a059]/10 pt-5">
        
        {/* Útravaló Élelem */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center bg-black/35 p-3 rounded-lg border border-stone-900">
            <div className="flex items-center gap-2.5">
              <Apple className="w-4 h-4 text-emerald-500" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#d4cfc7] uppercase tracking-wide">Útravaló Élelem</span>
                <span className="text-[10px] text-stone-500 font-mono">{stats.food} adag maradt</span>
              </div>
            </div>
            <button
              onClick={onEatFood}
              disabled={isStaminaMax || noFood}
              className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isStaminaMax || noFood
                  ? "bg-transparent text-stone-600 border border-stone-900 cursor-not-allowed"
                  : "bg-emerald-950/40 text-emerald-400 hover:bg-emerald-800 hover:text-white border border-emerald-500/30"
              }`}
            >
              Elfogyasztás
            </button>
          </div>
          {!isStaminaMax && !noFood && (
            <span className="text-[9px] text-emerald-500/70 italic text-center font-mono">
              +4 Állóképesség pont visszatöltése
            </span>
          )}
        </div>

        {/* Varázsital */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center bg-black/35 p-3 rounded-lg border border-stone-900">
            <div className="flex items-center gap-2.5">
              <FlaskConical className="w-4 h-4 text-amber-500 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#d4cfc7] uppercase tracking-wide">{potionHungarianName}</span>
                <span className="text-[10px] text-stone-500 font-mono">{stats.potions.doses} korty maradt</span>
              </div>
            </div>
            <button
              onClick={() => onDrinkPotion(stats.potions.type)}
              disabled={noPotion}
              className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                noPotion
                  ? "bg-transparent text-stone-600 border border-stone-900 cursor-not-allowed"
                  : "bg-amber-950/40 text-amber-400 hover:bg-amber-800 hover:text-white border border-amber-500/30"
              }`}
            >
              Meghörpintés
            </button>
          </div>
          {!noPotion && (
            <span className="text-[9px] text-amber-500/70 italic text-center font-mono">
              {stats.potions.type === "skill" && "Visszaállítja az ÜGYESSÉGET a maximumra"}
              {stats.potions.type === "stamina" && "Visszaállítja az ÉLETERŐT a maximumra"}
              {stats.potions.type === "luck" && "Szerencse maxot ad +1-gyel s telegyógyítja"}
            </span>
          )}
        </div>

        {/* Gold & Gems */}
        <div className="grid grid-cols-2 gap-2">
          {/* Gold */}
          <div className="bg-black/25 border border-stone-900 p-3 rounded-lg flex items-center gap-2.5">
            <Coins className="w-4 h-4 text-[#c5a059]" />
            <div className="flex flex-col">
              <span className="text-[9px] text-stone-500 font-mono uppercase">Aranypénz</span>
              <strong className="text-sm font-serif text-[#c5a059]">{stats.gold} db</strong>
            </div>
          </div>
          {/* Spell */}
          <div className="bg-black/25 border border-stone-900 p-3 rounded-lg flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            <div className="flex flex-col">
              <span className="text-[9px] text-stone-500 font-mono uppercase">Varázsige</span>
              <strong className="text-xs font-bold text-[#d4cfc7]">
                {stats.spellLearned ? "🍀 Ismert" : "💀 Nincs"}
              </strong>
            </div>
          </div>
        </div>

        {/* Loot & Equipment */}
        <div className="flex flex-col gap-2.5 bg-black/45 border border-stone-900/60 p-4 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-[#c5a059] tracking-widest font-bold">
            Talált Felszerelések
          </span>
          <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
            {stats.items.length === 0 ? (
              <span className="text-xs italic text-stone-600">Hátizsákod üres...</span>
            ) : (
              stats.items.map((item, id) => (
                <div key={id} className="text-xs flex items-center gap-2 text-[#d4cfc7]/85 border-b border-stone-900 pb-1">
                  <Star className="w-2.5 h-2.5 text-[#c5a059] shrink-0" />
                  <span>{item}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Found Keys */}
        <div className="flex flex-col gap-2.5 bg-black/45 border border-stone-900/60 p-4 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-[#c5a059] tracking-widest font-bold flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-[#c5a059]" /> Megszerzett Kulcsok
          </span>
          <div className="flex flex-wrap gap-1.5">
            {stats.keys.length === 0 ? (
              <span className="text-xs italic text-stone-600">Nincsenek kulcsaid...</span>
            ) : (
              stats.keys.map((k, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-stone-950 border border-[#c5a059]/30 text-[#c5a059] font-bold text-xs rounded-md shadow-sm"
                >
                  #{k}-os Kulcs
                </span>
              ))
            )}
          </div>
        </div>

        {/* Reset Game Button */}
        <button
          onClick={onResetGame}
          className="mt-2 w-full py-2 border border-[#8b0000]/30 hover:border-[#ff3333]/50 hover:bg-[#8b0000]/10 text-stone-500 hover:text-[#ff3333] transition-all text-[10px] tracking-widest uppercase font-mono rounded duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" /> Újrakezdés gomb
        </button>
      </div>
    </div>
  );
}
