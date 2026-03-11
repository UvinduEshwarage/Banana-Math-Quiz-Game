"use client";
import { useState, useEffect, useRef } from "react";

export default function GamePage() {
  const [gameData, setGameData] = useState<any>(null);
  const [question, setQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const maxLives = 5;

  /**
   * LOGIC: Dynamic Time Calculation
   * Level 1: 30s | Level 2: 25s | Level 3: 20s | Level 4: 15s | Level 5+: 15s
   */
  const getAllowedTime = (level: number) => {
    if (level === 1) return 30;
    if (level === 2) return 25;
    if (level === 3) return 20;
    return 15; // Cap at 15 seconds for Level 4 and above
  };

  // Effect to handle the countdown interval
  useEffect(() => {
    // Only start timer if we have gameData and a question
    if (gameData && question) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeOut(); // Trigger life loss on 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup: Clear timer when component unmounts or question changes
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
    
    // Reset timer based on current level
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

  /**
   * LOGIC: Handle Timeout
   * This is called when the timer hits 0. It treats it like a wrong answer.
   */
  const handleTimeOut = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    alert("Time's up! You lost a life.");
    const newWrongCount = wrongAnswers + 1;
    setWrongAnswers(newWrongCount);

    if (newWrongCount >= maxLives) {
      await endGame(gameData.score);
    } else {
      // Fetch next question even if they timed out
      fetchQuestion(gameData.level);
    }
  };

  const handleSubmit = async () => {
    if (!answer || !gameData) return;
    
    // Stop timer immediately upon submission to prevent timeout triggering while fetching
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
    // Fetch next question and pass the new level from result to reset timer correctly
    fetchQuestion(result.level);
  };

  const renderStars = () => {
    const livesRemaining = Math.max(0, maxLives - wrongAnswers);
    return (
      <div className="flex text-3xl text-black">
        {"★".repeat(livesRemaining)}
        <span className="text-gray-400">{"☆".repeat(wrongAnswers)}</span>
      </div>
    );
  };

  if (!gameData) {
    return (
      <div className="bg-gray-100 h-80 w-full flex items-center justify-center rounded-sm">
        <button 
          onClick={startGame}
          className="bg-gray-300 border-2 text-black hover:bg-gray-200 border-black px-8 py-2 text-2xl font-irish shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
        >
          {loading ? "Loading..." : "Start.."}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-irish text-black">Level : {gameData.level}</span>
        {renderStars()}
      </div>

      <div className="bg-gray-400 aspect-video w-full flex items-center justify-center overflow-hidden rounded-sm border-2 border-gray-500 shadow-inner relative">
        {question ? (
          <img src={question.question} alt="Quiz" className="max-h-full object-contain p-2" />
        ) : (
          <div className="animate-pulse text-white">Loading Question...</div>
        )}
      </div>

      <div className="flex justify-between text-black items-end mt-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold">Your Answer:</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-24 p-2 border-2 border-black text-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none"
              placeholder="?"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button 
              onClick={handleSubmit}
              className="bg-white border-2 border-black text-black hover:bg-gray-200 px-4 py-1 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
            >
              OK
            </button>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xl font-irish italic">Score: {gameData.score}</span>
          <span className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-600 animate-bounce' : 'text-black'}`}>
            Time : {timeLeft} s
          </span>
        </div>
      </div>
    </div>
  );
}