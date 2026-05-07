"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface PizzaQuestion {
  id: string;
  type: string;
  question: string;
  targetNumerator: number;
  targetDenominator: number;
}

interface Props {
  questionData: PizzaQuestion;
  onComplete: (isCorrect: boolean) => void;
}

// Funciones para calcular los puntos del borde del círculo y crear el slice SVG
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

function getPieSlicePath(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, radius, startAngle - 90);
  const end = polarToCartesian(cx, cy, radius, endAngle - 90);
  
  // Caso especial: 360 grados (círculo completo)
  if (endAngle - startAngle === 360) {
    return `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy + radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy - radius} Z`;
  }
  
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", cx, cy,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y,
    "Z"
  ].join(" ");
}

export default function PizzaGame({ questionData, onComplete }: Props) {
  const [selectedSlices, setSelectedSlices] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Reiniciar estado cuando la pregunta cambia
  useEffect(() => {
    setSelectedSlices([]);
  }, [questionData]);

  useGSAP(() => {
    gsap.from(titleRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    });
  }, { scope: containerRef, dependencies: [questionData.id] });

  const toggleSlice = (index: number) => {
    setSelectedSlices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  };

  const handleCheck = () => {
    const isCorrect = selectedSlices.length === questionData.targetNumerator;
    
    if (isCorrect) {
      // Animación de éxito
      gsap.to(".pizza-slice-group", {
        scale: 1.1,
        rotation: "random(-10, 10)",
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        onComplete: () => onComplete(true)
      });
    } else {
      // Animación de error (temblor)
      gsap.to(containerRef.current, {
        x: "random(-10, 10)",
        y: "random(-10, 10)",
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        onComplete: () => {
          gsap.set(containerRef.current, { x: 0, y: 0 });
          setSelectedSlices([]); // Reiniciar selección si falla
          onComplete(false);
        }
      });
    }
  };

  return (
    <div ref={containerRef} className="glass-panel p-8 w-full flex flex-col items-center gap-8">
      <h2 ref={titleRef} className="text-2xl md:text-3xl text-center text-white font-bold max-w-lg">
        {questionData.question}
      </h2>

      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Base de la pizza fantasmal */}
        <Image
          src="/assets/alien_pizza.png"
          alt="Alien Pizza Base"
          fill
          className="object-contain opacity-30 pointer-events-none"
          priority
        />
        
        {/* Capa de cortes SVG (Soluciona el problema de clics redondos y colindantes) */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-10 overflow-visible">
          <defs>
            <pattern id="pizza-img" patternUnits="userSpaceOnUse" width="100" height="100">
              <image href="/assets/alien_pizza.png" width="100" height="100" preserveAspectRatio="xMidYMid meet" />
            </pattern>
          </defs>
          
          {Array.from({ length: questionData.targetDenominator }).map((_, i) => {
            const isSelected = selectedSlices.includes(i);
            const sliceAngle = 360 / questionData.targetDenominator;
            const startAngle = i * sliceAngle;
            const endAngle = (i + 1) * sliceAngle;
            const pathData = getPieSlicePath(50, 50, 50, startAngle, endAngle);
            
            return (
              <g 
                key={i} 
                className="pizza-slice-group cursor-pointer transition-all duration-200"
                style={{
                  transformOrigin: '50px 50px',
                  transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                }}
                onClick={() => toggleSlice(i)}
              >
                {/* Fondo invisible para capturar bien los clics incluso si no está seleccionado */}
                <path d={pathData} fill="transparent" />
                
                {/* Relleno con la imagen real de la pizza */}
                <path 
                  d={pathData} 
                  fill="url(#pizza-img)" 
                  stroke="rgba(255, 255, 255, 0.9)"
                  strokeWidth="1"
                  strokeLinejoin="round"
                  className={`transition-all duration-200 ${isSelected ? 'opacity-100 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'opacity-0 hover:opacity-50'}`}
                />
              </g>
            );
          })}
        </svg>

        {/* Rejilla circular que muestra las divisiones claramente */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
          <circle cx="50" cy="50" r="49" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2,2" />
          {Array.from({ length: questionData.targetDenominator }).map((_, i) => (
            <line 
              key={i}
              x1="50" y1="50" 
              x2="50" y2="1" 
              stroke="white" 
              strokeWidth="0.8"
              transform={`rotate(${(360 / questionData.targetDenominator) * i} 50 50)`}
            />
          ))}
        </svg>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-xl text-purple-200 font-semibold">
          Has seleccionado: <span className="text-cyan-400 font-black">{selectedSlices.length}</span> de <span className="text-cyan-400 font-black">{questionData.targetDenominator}</span>
        </p>

        <Button 
          variant="primary"
          onClick={handleCheck}
          className="mt-2 w-48"
        >
          ¡Comprobar!
        </Button>
      </div>
    </div>
  );
}
