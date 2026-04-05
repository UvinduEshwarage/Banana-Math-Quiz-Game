"use client";
import { useState, useEffect, useRef } from "react";

export default function GamePage() {
  const [gameData, setGameData] = useState<any>(null);
  const [question, setQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const maxLives = 5;

  const getAllowedTime = (level: number) => {
    if (level === 1) return 30;
    if (level === 2) return 25;
    if (level === 3) return 20;
    return 15;
  };

  useEffect(() => {
    if (gameData && question) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameData, question]);

  const startGame = async () => {
    setLoading(true);
    const res = await fetch("/api/game/start", { method: "POST" });
    const data = await res.json();
    setGameData(data);
    fetchQuestion(data.level);
  };

  const fetchQuestion = async (currentLevel: number) => {
    const res = await fetch("/api/game/question");
    const data = await res.json();
    
    setQuestion(data.question);
    setGameData((prev: any) => ({ ...prev, ...data }));
    
    setTimeLeft(getAllowedTime(currentLevel || 1));
    setLoading(false);
  };

  const endGame = async (finalScore: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    await fetch("/api/game/end", {
      method: "POST",
      body: JSON.stringify({ gameId: gameData.gameId }),
    });

    alert(`Game Over! Final Score: ${finalScore}`);
    window.location.reload(); 
  };

  const handleTimeOut = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    alert("Time's up! You lost a life.");
    const newWrongCount = wrongAnswers + 1;
    setWrongAnswers(newWrongCount);

    if (newWrongCount >= maxLives) {
      await endGame(gameData.score);
    } else {
      fetchQuestion(gameData.level);
    }
  };

  const handleSubmit = async () => {
    if (!answer || !gameData) return;
    
    if (timerRef.current) clearInterval(timerRef.current);

    const res = await fetch("/api/game/submit", {
      method: "POST",
      body: JSON.stringify({ gameId: gameData.gameId, answer: parseInt(answer) }),
    });
    const result = await res.json();

    if (!result.correct) {
      const newWrongCount = wrongAnswers + 1;
      setWrongAnswers(newWrongCount);
      if (newWrongCount >= maxLives) {
        await endGame(result.score);
        return;
      }
    }

    setGameData((prev: any) => ({ ...prev, ...result }));
    setAnswer("");
    fetchQuestion(result.level);
  };

  const renderStars = () => {
    const livesRemaining = Math.max(0, maxLives - wrongAnswers);
    return (
      <div className="flex text-3xl">
        <span className="text-yellow-400 drop-shadow-[0_0_6px_rgba(255,255,0,0.7)]">
          {"★".repeat(livesRemaining)}
        </span>
        <span className="text-gray-600">
          {"☆".repeat(wrongAnswers)}
        </span>
      </div>
    );
  };

  if (!gameData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(circle_at_center,#1a1a2e,#0f0f1a,#000)]">
        <button 
          onClick={startGame}
          className="rounded-xl bg-linear-to-b from-yellow-400 to-yellow-600 text-black font-extrabold px-10 py-3 text-2xl shadow-[0_6px_0_#b45309] transition-all active:translate-y-[4px] active:shadow-[0_2px_0_#b45309] hover:scale-105"
        >
          {loading ? "Loading..." : "🎮 Start"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-6 bg-[radial-gradient(circle_at_center,#1a1a2e,#0f0f1a,#000)] text-yellow-100">

      {/* HUD Top */}
      <div className="flex justify-between items-center mb-6 border-b-2 border-yellow-400 pb-3">
        <span className="text-2xl font-extrabold text-yellow-300 drop-shadow-[2px_2px_0px_#000]">
          Level : {gameData.level}
        </span>
        {renderStars()}
      </div>

      {/* Question Display */}
      <div className="flex-1 flex items-center justify-center bg-black/40 border-4 border-yellow-400 rounded-2xl shadow-inner relative">
        {question ? (
          <img src={question.question} alt="Quiz" className="max-h-full object-contain p-4" />
        ) : (
          <div className="animate-pulse text-yellow-300">Loading Question...</div>
        )}
      </div>

      {/* Bottom Panel */}
      <div className="flex justify-between items-end mt-6">

        {/* Answer Section */}
        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-widest">Your Answer:</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-24 p-2 border-2 border-yellow-400 bg-black/40 text-white rounded outline-none focus:ring-2 focus:ring-yellow-300"
              placeholder="?"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button 
              onClick={handleSubmit}
              className="rounded-lg bg-linear-to-b from-yellow-400 to-yellow-600 text-black font-bold px-4 shadow-[0_4px_0_#b45309] active:translate-y-[3px] active:shadow-[0_1px_0_#b45309]"
            >
              OK
            </button>
          </div>
        </div>

        {/* Score + Timer */}
        <div className="flex flex-col items-end">
          <span className="text-xl font-bold text-yellow-300">
            Score: {gameData.score}
          </span>
          <span className={`text-2xl font-extrabold ${
            timeLeft <= 5 
              ? 'text-red-500 animate-bounce' 
              : 'text-yellow-200'
          }`}>
            ⏱ {timeLeft}s
          </span>
        </div>

      </div>
    </div>
  );
}