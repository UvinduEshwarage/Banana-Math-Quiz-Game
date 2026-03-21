"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 font-sans text-white">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black border-x border-gray-200 dark:border-zinc-800 sm:items-start shadow-[0_0_100px_rgba(0,0,0,0.2)]">
        
        {/* Logo with grayscale glow and float animation */}
        <Image
          className="rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-float transition-all duration-500 hover:scale-105 hover:grayscale-0 grayscale-[0.2]"
          src="/apple.jpg"
          alt="Game logo"
          width={500}
          height={500}
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          {/* High contrast Black & Ash typography */}
          <h1 className="max-w-xs text-5xl font-black leading-tight tracking-tighter text-black dark:text-white font-irish">
            BANANA <span className="text-gray-400">Rush</span> 
          </h1>

          {/* 3D Button in Ash/Black theme */}
          <Link 
            href="/login" 
            className="flex h-14 w-full items-center justify-center rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest shadow-[0_6px_0_0_#4b5563] dark:shadow-[0_6px_0_0_#9ca3af] transition-all hover:translate-y-1 hover:shadow-none md:w-56"
          >
            Start now
          </Link>
          
          {/* Subtitle in Ash for depth */}
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm tracking-widest uppercase">
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
      `}</style>
    </div>
  );
}