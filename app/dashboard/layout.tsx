import { getAuthUser } from '@/lib/auth';
import LogoutButton from '../components/LogoutButton/page';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  return (
    <div className='flex justify-center items-center min-h-screen bg-[radial-gradient(circle_at_center,#1a1a2e,#0f0f1a,#000)]'>
      
      <div className='relative w-200 bg-[#111827]/90 backdrop-blur-xl border-4 border-yellow-400 rounded-3xl shadow-[0_0_60px_rgba(255,255,0,0.25)] p-10'>
        
        {/* Glow border */}
        <div className="absolute inset-0 rounded-3xl border-2 border-yellow-300 opacity-20 animate-pulse pointer-events-none"></div>
        <div className="w-full flex justify-end mb-4">
          <LogoutButton />
        </div>
        <div className='flex flex-col'>


          <p className='text-yellow-300 font-extrabold text-4xl mt-4 drop-shadow-[2px_2px_0px_#000]'>
            Welcome, {user?.name}!
          </p>

          {/* Navigation */}
          <nav className="flex gap-4 mt-6">
            
            <Link 
              href="/dashboard" 
              className="px-6 py-2 rounded-xl bg-linear-to-b from-yellow-400 to-yellow-600 text-black font-bold shadow-[0_4px_0_#b45309] transition-all active:translate-y-[3px] active:shadow-[0_1px_0_#b45309] hover:scale-105"
            >
              🏠 Home
            </Link>

            <Link 
              href="/dashboard/leaderboard" 
              className="px-6 py-2 rounded-xl bg-linear-to-b from-pink-400 to-pink-600 text-white font-bold shadow-[0_4px_0_#831843] transition-all active:translate-y-[3px] active:shadow-[0_1px_0_#831843] hover:scale-105"
            >
              🏆 Leader Board
            </Link>

          </nav>

          {/* Page Content */}
          <main className="mt-8 bg-black/40 border-2 border-yellow-400 rounded-xl p-6 shadow-inner text-yellow-100">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}