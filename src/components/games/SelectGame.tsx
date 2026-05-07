"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { VisualFraction } from "@/components/ui/FractionCard";

interface Props {
  questionData: any;
  onComplete: (isCorrect: boolean) => void;
}

export default function SelectGame({ questionData, onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".select-option", {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "back.out(1.5)"
    });
  }, { scope: containerRef, dependencies: [questionData.id] });

  const handleSelect = (isCorrect: boolean, event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.currentTarget;
    
    if (isCorrect) {
      gsap.to(target, {
        scale: 1.1,
        backgroundColor: "#10b981", // Emerald 500
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        onComplete: () => onComplete(true)
      });
    } else {
      gsap.to(target, {
        x: "random(-10, 10)",
        backgroundColor: "#ef4444", // Red 500
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        onComplete: () => {
          gsap.to(target, { backgroundColor: "rgba(255,255,255,0.1)", duration: 0.3 });
          onComplete(false);
        }
      });
    }
  };

  if (!questionData?.options) return null;

  return (
    <div ref={containerRef} className="glass-panel p-8 w-full flex flex-col items-center gap-8">
      <h2 className="text-2xl md:text-3xl text-center text-white font-bold">
        {questionData.question}
      </h2>

      <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/10 shadow-inner">
        <VisualFraction 
          numerator={questionData.visualNumerator} 
          denominator={questionData.visualDenominator} 
          className="w-40 h-40 md:w-56 md:h-56 p-2 rounded-xl"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full">
        {questionData.options.map((opt: any, idx: number) => (
          <button
            key={idx}
            className="select-option text-3xl font-bold py-4 px-8 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-cyan-400 text-white transition-colors"
            onClick={(e) => handleSelect(opt.correct, e)}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
