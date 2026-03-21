"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 font-sans text-white">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-8 bg-gradient-to-t from-gray-900 via-gray-800 to-gray-950 border-x border-gray-700 sm:items-start shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-3xl">
        
        {/* Logo with neon glow and float animation */}
        <Image
          className="rounded-3xl shadow-neon animate-float transition-all duration-500 hover:scale-110 hover:shadow-[0_0_30px_rgba(0,255,255,0.7)]"
          src="/apple.jpg"
          alt="Game logo"
          width={500}
          height={500}
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          {/* Neon/Glow typography */}
          <h1 className="max-w-xs text-5xl font-black leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-irish">
            BANANA <span className="text-pink-500">Rush</span>
          </h1>

          {/* Glowing 3D Button */}
          <Link 
            href="/login" 
            className="flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 text-white font-bold uppercase tracking-widest shadow-neon hover:shadow-[0_0_30px_rgba(255,0,255,0.7)] transition-all hover:scale-105 md:w-56"
          >
            Start now
          </Link>
          
          {/* Subtitle with subtle glow */}
          <p className="text-gray-400 font-medium text-sm tracking-widest uppercase drop-shadow-[0_0_4px_rgba(0,255,255,0.7)]">
            Master the numbers
          </p>
        </div>
      </main>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .shadow-neon {
          box-shadow: 0 0 20px rgba(0,255,255,0.5), 0 0 40px rgba(0,255,255,0.3);
        }
      `}</style>
    </div>
  );
}