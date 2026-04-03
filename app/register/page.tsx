"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import  { useState } from 'react'

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
    <div className='flex justify-center items-center min-h-screen bg-gray-300'>
        <form onSubmit={handleSubmit}
        className='bg-white p-10 w-96 shadow-md text-gray-700'>
            <h1 className='text-xl mb-6 text-center font-irish'>Register Here!</h1>
            <label>Name</label>
            <input
                type='text'
                placeholder='Enter Name'
                className='border p-2 w-full mb-4'
                value={name}
                onChange={(e)=>setName(e.target.value)}
            />
            <label>Email</label>

            <input
            type='text'
            placeholder='Enter Email'
            className='border p-2 w-full mb-4'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <label>Password</label>

            <input
            type='password'
            placeholder='Enter Password'
            className='border p-2 w-full mb-4'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />

            <button className='bg-gray-600 text-white px-4 py-1 w-full rounded hover:bg-gray-700  '>Register!</button>
            <button
              type='button'
              onClick={() => window.location.href = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || '/api/auth/google'}
              className='mt-3 bg-red-600 text-white px-4 py-1 w-full rounded hover:bg-red-700'
            >
              Continue with Google
            </button>
            <p className='text-sm text-center mt-4'>Already Registered?
            <Link href='/login' className='text-sm text-blue-500'>Log here!</Link>
        </p>
        </form>
    </div>
  )
}


