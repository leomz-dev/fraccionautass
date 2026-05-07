"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { FractionCard } from "@/components/ui/FractionCard";

interface Props {
  questionData: any;
  onComplete: (isCorrect: boolean) => void;
}

export default function CompareGame({ questionData, onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Meteoritos cayendo
    gsap.from(".meteorite", {
      y: -200,
      opacity: 0,
      stagger: 0.2,
      duration: 1.5,
      ease: "power2.out"
    });

    // Movimiento flotante
    gsap.to(".meteorite", {
      y: "+=20",
      rotation: "random(-5, 5)",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef, dependencies: [questionData.id] });

  const handleSelect = (idx: number, event: React.MouseEvent<HTMLDivElement>) => {
    const isCorrect = idx === questionData.correctIndex;
    const target = event.currentTarget;

    if (isCorrect) {
      // Explosión del meteorito
      gsap.to(target, {
        scale: 1.5,
        opacity: 0,
        duration: 0.3,
        onComplete: () => onComplete(true)
      });
      // El otro meteorito desaparece
      gsap.to(".meteorite", {
        opacity: 0,
        duration: 0.3
      });
    } else {
      // Rebote de error
      gsap.to(target, {
        x: "random(-20, 20)",
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        onComplete: () => {
          gsap.set(target, { x: 0 });
          onComplete(false);
        }
      });
    }
  };

  if (!questionData?.fractions) return null;

  return (
    <div ref={containerRef} className="glass-panel p-8 w-full flex flex-col items-center gap-12">
      <h2 className="text-2xl md:text-3xl text-center text-white font-bold">
        {questionData.question}
      </h2>

      <div className="flex justify-center items-center gap-8 md:gap-16 w-full">
        {questionData.fractions.map((frac: any, idx: number) => (
          <div
            key={idx}
            className="meteorite relative w-32 h-48 md:w-48 md:h-64 cursor-pointer hover:scale-105 transition-transform"
            onClick={(e) => handleSelect(idx, e)}
          >
            <Image
              src="/assets/meteorite.png"
              alt="Meteorite"
              fill
              className="object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center pb-8">
              <div className="bg-slate-900/80 p-2 rounded-xl backdrop-blur-sm">
                <FractionCard numerator={frac.numerator} denominator={frac.denominator} className="text-orange-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
