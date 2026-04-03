"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function LoginPage() {
      const router = useRouter();
    
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e:any)=> {
        
        e.preventDefault();

        const res =await fetch('/api/auth/login',{
            method:"POST",
            headers:{"Content-Type":"application/json"
            },
            credentials:"include",
            body:JSON.stringify({
                email,
                password,
            })
        });

        const data = await res.json();

        console.log("Response:", res.status, data);

        if (res.ok){
            // alert("Login Successfully");
            router.push("/dashboard");
            router.refresh();
            // window.location.href = "/dashboard";
        }else{
            setErrorMessage(data.message);
        }
    }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-300'>
      <form onSubmit={handleSubmit}
      className='bg-white p-10 w-96 shadow-md text-gray-700'>
      <h1 className='text-xl mb-6 text-center font-irish'>Login here!</h1>
      {errorMessage && (
        <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
          {errorMessage}
        </div>
      )}
      
      <label>Email</label>
      <input
      type='email'
      placeholder='Enter Your Email here!'
      className='border p-2 w-full mb-6'
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      />
      <label>Password</label>
      <input
      type='password'
      placeholder='Enter Password here!'
      className='border p-2 w-full mb-6'
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      />

      <button
      className='bg-gray-600 text-white px-4 py-1 w-full rounded hover:bg-gray-700'>
        Login
      </button>
      <button
        type='button'
        onClick={() => window.location.href = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || '/api/auth/google'}
        className='mt-3 bg-red-600 text-white px-4 py-1 w-full rounded hover:bg-red-700'
      >
        Continue with Google
      </button>
      <p className='text-sm text-center mt-4'>Don't have an account?
        <Link href='/register' className='text-sm text-blue-500'>register here!</Link>
      </p>
      </form>
    </div>
  )
}


