import React from "react";
import {
  Flame,
  Coffee,
  Sparkles,
  ShieldCheck,
  Compass,
  Users,
  Eye,
  Skull
} from "lucide-react";

export default function AdventureIllustration({ id, monsterName = "", isFight = false }) {
  if (isFight) {
    return (
      <div className="w-full h-44 bg-gradient-to-br from-red-950/20 to-neutral-950 border border-[#8b0000]/30 rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden my-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.08),transparent)] animate-pulse" />
        <Skull className="w-14 h-14 text-red-600 mb-2 relative z-10 animate-bounce" />
        <span className="text-[10px] uppercase tracking-widest text-[#ff3333] relative z-10 font-mono">Ellenséges Támadás!</span>
        <span className="text-lg font-bold font-serif text-[#d4cfc7] relative z-10 mt-0.5">{monsterName || "Ismeretlen Szörnyeteg"}</span>
      </div>
    );
  }

  switch (id) {
    case "1":
      return (
        <div className="w-full h-44 bg-gradient-to-br from-[#c5a059]/5 to-neutral-950 border border-[#c5a059]/20 rounded-2xl flex flex-col items-center justify-center p-4 my-4 relative">
          <Flame className="w-14 h-14 text-[#c5a059] mb-2 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a059]">Üdvözöl a Sötét Útvesztő!</span>
          <span className="text-xs font-serif text-[#d4cfc7]/75 mt-1 italic">Vágj bele az interaktív játékkönyvbe</span>
        </div>
      );
    case "15":
      return (
        <div className="w-full h-44 bg-gradient-to-br from-emerald-950/10 to-neutral-950 border border-[#c5a059]/15 rounded-2xl flex flex-col items-center justify-center p-4 my-4">
          <Coffee className="w-12 h-12 text-emerald-500 mb-2" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Biztonságos pihenőhely</span>
          <span className="text-xs font-serif text-[#d4cfc7]/65 mt-1 italic">Fújd ki magad s gyógyítsd meg a sebeit</span>
        </div>
      );
    case "115":
    case "145":
      return (
        <div className="w-full h-44 bg-gradient-to-br from-[#c5a059]/5 to-neutral-950 border border-[#c5a059]/20 rounded-2xl flex flex-col items-center justify-center p-4 my-4">
          <Sparkles className="w-12 h-12 text-[#c5a059] mb-2 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a059]">Értékes Találmány és kincs</span>
          <span className="text-xs font-serif text-[#d4cfc7]/65 mt-1 italic">Fontos kulcs, ékkő vagy szent amulett</span>
        </div>
      );
    case "155":
      return (
        <div className="w-full h-44 bg-gradient-to-br from-[#c5a059]/5 to-neutral-950 border border-[#c5a059]/20 rounded-2xl flex flex-col items-center justify-center p-4 my-4">
          <ShieldCheck className="w-12 h-12 text-[#c5a059] mb-2" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a059]">Legendás Holdpajzs megtalálása</span>
          <span className="text-xs font-serif text-[#d4cfc7]/70 mt-0.5">Elnyelheti az ellenség csapásait!</span>
        </div>
      );
    case "301":
    case "363":
    case "42":
      return (
        <div className="w-full h-44 bg-gradient-to-br from-stone-900/10 to-neutral-950 border border-[#c5a059]/15 rounded-2xl flex flex-col items-center justify-center p-4 my-4">
          <Compass className="w-12 h-12 text-[#c5a059]/80 mb-2 animate-spin" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a059]/80">Válaszút a kazamatában</span>
          <span className="text-xs font-serif text-[#d4cfc7]/65 mt-1 italic">Mindig óvatosan válaszd meg az utat</span>
        </div>
      );
    case "186":
      return (
        <div className="w-full h-44 bg-gradient-to-br from-[#c5a059]/20 to-neutral-950 border border-[#c5a059] rounded-2xl flex flex-col items-center justify-center p-4 my-4 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.1),transparent)] animate-pulse" />
          <Users className="w-14 h-14 text-[#c5a059] mb-2 relative z-10" />
          <span className="text-sm font-black uppercase tracking-widest text-[#c5a059] relative z-10 font-serif">Kincskeresésed Diadalmasan véget ért!</span>
          <span className="text-xs text-[#d4cfc7] mt-1 relative z-10 italic">Te vagy a Tűzhegy Új Uralkodója!</span>
        </div>
      );
    default:
      return (
        <div className="w-full h-44 bg-gradient-to-br from-[#c5a059]/5 to-neutral-950 border border-[#c5a059]/15 rounded-2xl flex flex-col items-center justify-center p-4 my-4">
          <Eye className="w-10 h-10 text-[#c5a059]/50 mb-2" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a059]/50">Labirintus mélysége</span>
          <span className="text-xs font-serif text-[#d4cfc7]/60 mt-1 italic">Kutass a varázsló kincse után</span>
        </div>
      );
  }
}
