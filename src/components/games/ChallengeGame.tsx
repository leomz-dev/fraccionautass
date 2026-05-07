"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/Button";
import { FractionCard } from "@/components/ui/FractionCard";
import { shuffleArray } from "@/utils/randomizer";

interface Props {
  questionData: any;
  onComplete: (isCorrect: boolean) => void;
}

export default function ChallengeGame({ questionData, onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<any[]>([]);
  
  useEffect(() => {
    if (questionData?.fractions) {
      setItems(shuffleArray([...questionData.fractions]));
    }
  }, [questionData]);

  useGSAP(() => {
    gsap.from(".challenge-item", {
      scale: 0,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "back.out(1.5)"
    });
  }, { scope: containerRef, dependencies: [questionData.id] });

  const moveLeft = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    setItems(newItems);
  };

  const moveRight = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setItems(newItems);
  };

  const handleCheck = () => {
    // Comprobar si están ordenados de menor a mayor
    let isSorted = true;
    for (let i = 0; i < items.length - 1; i++) {
      if (items[i].value > items[i + 1].value) {
        isSorted = false;
        break;
      }
    }

    if (isSorted) {
      gsap.to(".challenge-item", {
        y: -20,
        stagger: 0.1,
        yoyo: true,
        repeat: 1,
        duration: 0.2,
        onComplete: () => onComplete(true)
      });
    } else {
      gsap.to(containerRef.current, {
        x: "random(-10, 10)",
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        onComplete: () => {
          gsap.set(containerRef.current, { x: 0 });
          onComplete(false);
        }
      });
    }
  };

  return (
    <div ref={containerRef} className="glass-panel p-8 w-full flex flex-col items-center gap-8">
      <h2 className="text-2xl md:text-3xl text-center text-white font-bold">
        {questionData.question}
      </h2>

      <div className="flex justify-center items-center gap-4 w-full bg-slate-900/50 p-6 rounded-2xl border border-white/10">
        {items.map((frac, idx) => (
          <div key={frac.id} className="challenge-item flex flex-col items-center gap-2">
            <div className="w-24 h-32 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/20">
              <FractionCard numerator={frac.numerator} denominator={frac.denominator} className="text-white" />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => moveLeft(idx)}
                disabled={idx === 0}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-30 p-2 rounded-lg text-white"
              >
                ◀
              </button>
              <button 
                onClick={() => moveRight(idx)}
                disabled={idx === items.length - 1}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-30 p-2 rounded-lg text-white"
              >
                ▶
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="primary" onClick={handleCheck} className="mt-4 w-48">
        ¡Verificar Orden!
      </Button>
    </div>
  );
}
