"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_center,_#1a1a2e,_#0f0f1a,_#000)] font-sans text-white overflow-hidden">
      
      <main className="relative flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-24 px-8 border-4 border-yellow-400 bg-[#111827]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_rgba(255,255,0,0.25)]">
        
        {/* Decorative glow layer */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-yellow-300 opacity-20 animate-pulse"></div>

        {/* Logo */}
        <Image
          className="rounded-2xl animate-float transition-all duration-300 hover:scale-110 hover:rotate-2 shadow-[0_0_25px_rgba(255,255,0,0.6)]"
          src="/apple.jpg"
          alt="Game logo"
          width={420}
          height={420}
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          
          {/* Title */}
          <h1 className="max-w-xs text-5xl font-extrabold leading-tight tracking-tight text-yellow-300 drop-shadow-[3px_3px_0px_#000]">
            BANANA <span className="text-pink-400">Rush</span>
          </h1>

          {/* Game Button */}
          <Link
            href="/login"
            className="relative flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-b from-yellow-400 to-yellow-600 text-black font-extrabold uppercase tracking-wider shadow-[0_6px_0_#b45309] transition-all active:translate-y-[4px] active:shadow-[0_2px_0_#b45309] hover:scale-105 md:w-56"
          >
            🎮 Start Game
          </Link>

          {/* Subtitle */}
          <p className="text-yellow-200 font-semibold text-sm tracking-widest uppercase opacity-80">
            Master the numbers
          </p>
        </div>
      </main>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}