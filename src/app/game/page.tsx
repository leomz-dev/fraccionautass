"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

// Import all games
import PizzaGame from "@/components/games/PizzaGame";
import MemoryGame from "@/components/games/MemoryGame";
import SelectGame from "@/components/games/SelectGame";
import CompareGame from "@/components/games/CompareGame";
import ChallengeGame from "@/components/games/ChallengeGame";

import questionsData from "@/data/questionBank.json";
import { shuffleArray } from "@/utils/randomizer";

const GAME_STAGES = ["pizza", "memory", "select", "compare", "challenge"];

export default function GameBoard() {
  const router = useRouter();
  const { playerName, score, streak, correctAnswers, recordAnswer } = useGameStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (!playerName) {
      router.push("/");
    }
  }, [playerName, router]);

  // Load questions for the current stage
  useEffect(() => {
    if (currentStageIndex < GAME_STAGES.length) {
      const stageType = GAME_STAGES[currentStageIndex];
      const stageQuestions = (questionsData as any)[stageType];
      if (stageQuestions) {
        setQuestions(shuffleArray(stageQuestions));
        setCurrentQuestionIndex(0);
      }
    } else {
      setIsGameOver(true);
    }
  }, [currentStageIndex]);

  useGSAP(() => {
    gsap.from(hudRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.5)"
    });
  }, { scope: containerRef });

  if (!playerName) return null;

  const handleGameComplete = (isCorrect: boolean) => {
    recordAnswer(isCorrect);
    
    if (isCorrect) {
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          setCurrentStageIndex(prev => prev + 1);
        }
      }, 1000);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentStageType = GAME_STAGES[currentStageIndex];

  const renderGame = () => {
    if (!currentQuestion) return null;

    switch (currentStageType) {
      case "pizza":
        return <PizzaGame key={currentQuestion.id} questionData={currentQuestion} onComplete={handleGameComplete} />;
      case "memory":
        return <MemoryGame key={currentQuestion.id} questionData={currentQuestion} onComplete={handleGameComplete} />;
      case "select":
        return <SelectGame key={currentQuestion.id} questionData={currentQuestion} onComplete={handleGameComplete} />;
      case "compare":
        return <CompareGame key={currentQuestion.id} questionData={currentQuestion} onComplete={handleGameComplete} />;
      case "challenge":
        return <ChallengeGame key={currentQuestion.id} questionData={currentQuestion} onComplete={handleGameComplete} />;
      default:
        return null;
    }
  };

  return (
    <main 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center p-4 overflow-hidden"
    >
      <div className="absolute inset-0 z-[-1]">
        <Image 
          src="/assets/bg_space.png"
          alt="Space Background"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
      </div>

      <div ref={hudRef} className="w-full max-w-4xl flex justify-between items-center glass-panel px-6 py-4 mt-2 z-10">
        <div className="flex flex-col">
          <span className="text-purple-300 font-bold text-sm uppercase tracking-wider">Astronauta</span>
          <span className="text-2xl font-black text-cyan-400">{playerName}</span>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <span className="text-purple-300 font-bold text-sm uppercase tracking-wider">Puntos</span>
            <span className="text-2xl font-black text-white">{score}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-purple-300 font-bold text-sm uppercase tracking-wider">Racha</span>
            <span className="text-2xl font-black text-pink-400">🔥 x{streak}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center mt-4 z-10">
        {!isGameOver ? (
          renderGame()
        ) : (
          <div className="glass-panel p-8 w-full flex flex-col items-center gap-6 text-center">
            <h2 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 font-black mb-4">
              ¡Todas las Misiones Completadas!
            </h2>
            <div className="relative w-48 h-48 mb-4">
              <Image
                src="/assets/mascot_robot.png"
                alt="Fracc el Robot"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-2xl text-white font-bold">
              Puntuación Final: <span className="text-cyan-400">{score}</span>
            </p>
            <p className="text-xl text-purple-200">
              Respuestas Correctas: <span className="text-green-400">{correctAnswers}</span>
            </p>
            
            <Button 
              variant="primary"
              onClick={() => {
                const store = useGameStore.getState();
                store.resetGame();
                router.push("/");
              }}
              className="mt-8 text-xl"
            >
              Volver a Jugar
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
