import React from "react";

const dotMap = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8]
};

export default function DiceRoll({ rollValues = [2, 5], shaking = false }) {
  const values = rollValues || [2, 5];
  
  return (
    <div id="dice-roll-container" className="flex items-center justify-center gap-6 my-4 py-2 bg-stone-900/40 rounded-xl border border-amber-900/30 w-full">
      <div className="flex gap-4">
        {values.map((val, idx) => {
          const dots = dotMap[val] || [4];
          return (
            <div
              key={idx}
              className={`relative w-14 h-14 bg-stone-100 rounded-lg shadow-lg border-2 border-stone-300 flex items-center justify-center p-2.5 transition-all duration-100 ${
                shaking ? "animate-bounce scale-110" : ""
              }`}
            >
              <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full">
                {Array.from({ length: 9 }).map((_, pipIdx) => {
                  const hasDot = dots.includes(pipIdx);
                  return (
                    <div key={pipIdx} className="flex items-center justify-center w-2 h-2">
                      {hasDot && <div className="w-2 h-2 rounded-full bg-red-600 shadow-sm" />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-xs font-mono tracking-wider text-amber-500 uppercase">Kockadobás</span>
        <span className="text-2xl font-bold font-serif text-stone-100" id="dice-sum-value">
          Összeg: {values.reduce((a, b) => a + (b || 0), 0)}
        </span>
      </div>
    </div>
  );
}

export function playDiceSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    for (let i = 0; i < 3; i++) {
      const time = ctx.currentTime + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180 - i * 30, time);
      osc.frequency.exponentialRampToValueAtTime(60, time + 0.05);
      gain.gain.setValueAtTime(0.1, time);
      gain.gain.linearRampToValueAtTime(0.01, time + 0.05);
      osc.start(time);
      osc.stop(time + 0.05);
    }
  } catch (e) {
    // Ignore audio context flags block
  }
}
