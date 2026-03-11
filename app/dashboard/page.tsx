import { getAuthUser } from '@/lib/auth'
import React from 'react'
import LogoutButton from '../components/LogoutButton/page';

export default async function UserDashboard() {
  const user = await getAuthUser();
  
  return (
    <div className='flex justify-center min-h-screen bg-gray-300 items-center'>
      <div className='bg-white p-10 w-200 shadow-md'>
        <div className='bg-gray-300 p-10 w-180 flex flex-col'>
          
          {/* <button className='text-sm bg-white rounded shadow-md font-sans self-end px-4 py-1 text-black' onClick={handlelogout}>
            Logout
          </button> */}
          <LogoutButton/>
          
          <p className='text-black font-irish text-5xl mt-4'>
            Welcome, {user?.name}
          </p>
          
          <nav></nav>
        </div>
      </div>
    </div>
  )
}