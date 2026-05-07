"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { shuffleArray } from "@/utils/randomizer";
import { FractionCard, VisualFraction } from "@/components/ui/FractionCard";

interface Props {
  questionData: any;
  onComplete: (isCorrect: boolean) => void;
}

export default function MemoryGame({ questionData, onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!questionData || !questionData.pairs) return;
    
    // Generar cartas: por cada par, creamos una de texto y una visual
    const generatedCards = questionData.pairs.flatMap((pair: any, index: number) => [
      { id: `${pair.id}_text`, pairId: pair.id, type: 'text', content: pair.text },
      { id: `${pair.id}_visual`, pairId: pair.id, type: 'visual', num: pair.visualNumerator, den: pair.visualDenominator }
    ]);
    setCards(shuffleArray(generatedCards));
    setFlipped([]);
    setMatched([]);
    setIsLocked(false);
  }, [questionData]);

  useGSAP(() => {
    gsap.from(".memory-card", {
      scale: 0,
      rotationY: 90,
      stagger: 0.1,
      duration: 0.5,
      ease: "back.out(1.5)"
    });
  }, { scope: containerRef, dependencies: [cards.length] });

  const handleCardClick = (index: number) => {
    if (isLocked || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    gsap.to(`#card-${index} .card-inner`, { rotationY: 180, duration: 0.4 });

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.pairId === secondCard.pairId) {
        // Match!
        setTimeout(() => {
          gsap.to([`#card-${firstIndex}`, `#card-${secondIndex}`], {
            scale: 1.1,
            yoyo: true,
            repeat: 1,
            duration: 0.2
          });
          setMatched([...matched, firstIndex, secondIndex]);
          setFlipped([]);
          setIsLocked(false);

          // Verificar si ganó
          if (matched.length + 2 === cards.length) {
            setTimeout(() => onComplete(true), 1000);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          gsap.to([`#card-${firstIndex} .card-inner`, `#card-${secondIndex} .card-inner`], {
            rotationY: 0,
            duration: 0.4
          });
          setFlipped([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  return (
    <div ref={containerRef} className="glass-panel p-8 w-full flex flex-col items-center gap-8">
      <h2 className="text-2xl md:text-3xl text-center text-white font-bold">
        {questionData.question}
      </h2>

      <div className="grid grid-cols-3 gap-4 md:gap-6 w-full max-w-lg perspective-1000">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx);
          return (
            <div 
              key={idx}
              id={`card-${idx}`}
              className="memory-card relative w-full aspect-square cursor-pointer"
              onClick={() => handleCardClick(idx)}
              style={{ perspective: "1000px" }}
            >
              <div 
                className="card-inner w-full h-full relative transition-transform duration-500"
                style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                {/* Frente (oculto) */}
                <div 
                  className="absolute inset-0 bg-purple-700 rounded-xl border-2 border-purple-400 flex items-center justify-center backface-hidden shadow-lg"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="text-4xl">🌌</span>
                </div>
                
                {/* Reverso (descubierto) */}
                <div 
                  className="absolute inset-0 bg-slate-800 rounded-xl border-2 border-cyan-400 flex items-center justify-center backface-hidden shadow-lg"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  {card.type === 'text' ? (
                    <span className="text-4xl font-bold text-white">{card.content}</span>
                  ) : (
                    <VisualFraction numerator={card.num} denominator={card.den} className="w-16 h-16 md:w-20 md:h-20" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
