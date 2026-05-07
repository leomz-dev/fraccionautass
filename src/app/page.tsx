"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/store/useGameStore";
import Image from "next/image";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();
  const setPlayerName = useGameStore((state) => state.setPlayerName);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const robotRef = useRef<HTMLImageElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Animate background elements
    gsap.to(".bg-star", {
      y: "random(-20, 20)",
      x: "random(-20, 20)",
      rotation: "random(-15, 15)",
      duration: "random(2, 4)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.1
    });

    // Intro animation
    tl.from(logoRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "elastic.out(1, 0.5)"
    })
    .from(robotRef.current, {
      scale: 0,
      rotation: 180,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.5")
    .from(formRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.3");

    // Floating robot animation
    gsap.to(robotRef.current, {
      y: 15,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.5
    });
  }, { scope: containerRef });

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setPlayerName(name.trim());
    
    // Exit animation
    gsap.to(containerRef.current, {
      scale: 1.5,
      opacity: 0,
      duration: 0.8,
      ease: "power2.in",
      onComplete: () => {
        router.push("/game");
      }
    });
  };

  return (
    <main 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-[-1]">
        <Image 
          src="/assets/bg_space.png"
          alt="Space Background"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply" />
      </div>

      <div className="z-10 flex flex-col items-center text-center p-6 glass-panel max-w-lg w-full mx-4">
        <h1 
          ref={logoRef}
          className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-8 drop-shadow-lg filter"
        >
          FraccioNautas
        </h1>

        <div className="relative w-48 h-48 mb-8">
          <Image
            ref={robotRef}
            src="/assets/mascot_robot.png"
            alt="Fracc el Robot"
            fill
            className="object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            priority
          />
        </div>

        <form 
          ref={formRef}
          onSubmit={handleStart} 
          className="w-full flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="playerName" className="text-xl text-purple-200 font-semibold">
              ¿Cómo te llamas, astronauta?
            </label>
            <input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-center text-2xl py-4 px-6 rounded-2xl bg-white/10 border-2 border-purple-400/50 text-white placeholder-purple-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
              placeholder="Tu nombre aquí..."
              autoComplete="off"
            />
          </div>

          <Button 
            type="submit" 
            disabled={!name.trim()}
            className="w-full text-2xl py-5 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ¡Iniciar Aventura!
          </Button>
        </form>
      </div>
    </main>
  );
}
