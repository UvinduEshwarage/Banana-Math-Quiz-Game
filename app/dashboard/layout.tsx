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
    <div className='flex justify-center min-h-screen bg-gray-300 items-center'>
      <div className='bg-white p-10 w-200 shadow-md'>
        <div className='bg-gray-300 p-10 flex flex-col'>
          
          <LogoutButton />

          <p className='text-black font-irish text-5xl mt-4'>
            Welcome, {user?.name}!
          </p>

          <nav className="flex gap-4 mt-6">
            <Link href="/dashboard" className="bg-white px-6 py-1 rounded shadow-md text-black border border-black">
              Home
            </Link>
            <Link href="/dashboard/leaderboard" className="bg-white px-6 py-1 rounded shadow-md text-black border border-black">
              Leader Board
            </Link>
          </nav>


          {/* This is where the specific page content (Home or Leaderboard) will render */}
          <main className="mt-8">
            {children}
          </main>
          
        </div>
      </div>
    </div>
  );
}