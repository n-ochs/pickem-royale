import { AxiosError } from 'axios';
import { NextRouter, useRouter } from 'next/router';
import React, { FormEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { useMutation } from '@tanstack/react-query';
import { signIn } from '@util/api';

const SignInForm: React.FC = () => {
	const router: NextRouter = useRouter();
	const emailInputRef: React.MutableRefObject<HTMLInputElement> = useRef(null);
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const { mutate } = useMutation({
		mutationFn: signIn,
		onSuccess: async () => {
			toast.dismiss();
			await router.push('/');
			toast.success('Welcome back!');
		},
		onError: async (error: AxiosError) => {
			toast.dismiss();
			toast.error(error.response?.status === 403 ? 'Incorrect username or password. Please try again.' : 'Error: Please contact support.');
			setEmail('');
			setPassword('');
			emailInputRef.current.focus();
		}
	});

	const handleSignIn: (e: FormEvent) => void = (e: FormEvent) => {
		e.preventDefault();
		toast.loading('Signing in...');
		mutate({ email, password });
	};

	return (
		<form className='w-80 space-y-8 rounded-xl border-1 border-solid border-gray-300 bg-white px-10 pb-8 pt-4 shadow-lg' onSubmit={handleSignIn}>
			<h2 className='text-2xl font-semibold text-gray-900'>Sign In</h2>
			<div className='relative'>
				<input
					id='email'
					name='email'
					type='text'
					className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-primaryBlue focus:outline-none'
					placeholder='Email address'
					value={email}
					ref={emailInputRef}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<label htmlFor='email' className='auth-input'>
					Email address
				</label>
			</div>
			<div className='relative'>
				<input
					id='password'
					type='password'
					name='password'
					className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-primaryBlue focus:outline-none'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<label htmlFor='password' className='auth-input'>
					Password
				</label>
			</div>

			<button className='btn-primary w-full text-center normal-case' type='submit' disabled={email === '' || password === ''}>
				Sign In
			</button>
		</form>
	);
};

export default SignInForm;
