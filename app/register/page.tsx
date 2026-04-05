"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react'

export default function RegisterPage() {
  const router = useRouter();

  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const handleSubmit = async(e:any) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert('Please enter name, email, and password.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }

    const res = await fetch('/api/auth/register',{
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await res.json();

    if(res.ok){
      alert("Registration Successfully!");
      router.push("/login");
    }else{
      alert(data.message);
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-[radial-gradient(circle_at_center,#1a1a2e,#0f0f1a,#000)]'>
      
      <form 
        onSubmit={handleSubmit}
        className='relative bg-[#111827]/90 backdrop-blur-xl p-10 w-96 border-4 border-yellow-400 rounded-2xl shadow-[0_0_60px_rgba(255,255,0,0.25)] text-yellow-100'
      >
        
        {/* Glow border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-yellow-300 opacity-20 animate-pulse pointer-events-none"></div>

        <h1 className='text-2xl mb-6 text-center font-extrabold text-yellow-300 drop-shadow-[2px_2px_0px_#000]'>
          🧩 Register Here!
        </h1>

        <label className='text-sm uppercase tracking-widest'>Name</label>
        <input
          type='text'
          placeholder='Enter Name'
          className='border-2 border-yellow-400 bg-black/40 p-2 w-full mb-4 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-300'
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <label className='text-sm uppercase tracking-widest'>Email</label>
        <input
          type='text'
          placeholder='Enter Email'
          className='border-2 border-yellow-400 bg-black/40 p-2 w-full mb-4 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-300'
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <label className='text-sm uppercase tracking-widest'>Password</label>
        <input
          type='password'
          placeholder='Enter Password'
          className='border-2 border-yellow-400 bg-black/40 p-2 w-full mb-4 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-300'
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        {/* Register Button */}
        <button className='w-full h-11 rounded-xl bg-linear-to-b from-yellow-400 to-yellow-600 text-black font-extrabold uppercase tracking-wider shadow-[0_6px_0_#b45309] transition-all active:translate-y-[4px] active:shadow-[0_2px_0_#b45309] hover:scale-105'>
          🏁 Register!
        </button>

        {/* Google Button */}
        <button
          type='button'
          onClick={() => window.location.href = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || '/api/auth/google'}
          className='mt-3 w-full h-11 rounded-xl bg-linear-to-b from-red-500 to-red-700 text-white font-bold tracking-wide shadow-[0_6px_0_#7f1d1d] transition-all active:translate-y-[4px] active:shadow-[0_2px_0_#7f1d1d] hover:scale-105'
        >
          Continue with Google
        </button>

        <p className='text-sm text-center mt-4 text-yellow-200'>
          Already Registered?{" "}
          <Link href='/login' className='text-pink-400 hover:underline'>
            Log here!
          </Link>
        </p>

      </form>
    </div>
  )
}