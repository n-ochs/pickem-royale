import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import React from 'react';
import toast from 'react-hot-toast';

import { useQuery } from '@tanstack/react-query';
import { isAuthenticated, signOut } from '@util/api/auth.service';

const Navigation: React.FC = () => {
	const router: NextRouter = useRouter();
	const { isSuccess } = useQuery({ queryKey: ['isAuthenticated'], queryFn: isAuthenticated });

	const handleSignOut: () => Promise<void> = async () => {
		try {
			await signOut();
			if (router.pathname === '/') {
				router.reload();
			} else router.push('/');
			toast.success('Successfully signed out.');
		} catch (error) {
			toast.error('Something went wrong. Please try again.', { duration: 7000 });
		}
	};

	return (
		<nav className='flex items-center justify-between'>
			<ul className='flex flex-1 space-x-8 text-lg'>
				<li className={`navbar-item ${router.pathname === '/' && 'border-white'}`}>Home</li>
				<li className='navbar-item'>Leagues</li>
				<li className='navbar-item'>Contact Us</li>
			</ul>

			<h1 className='flex-[2] text-center text-4xl'>Pickem Royale</h1>

			<ul className='flex flex-1 justify-end space-x-8 text-lg'>
				<li className='navbar-item'>{isSuccess ? <button onClick={handleSignOut}>Sign Out</button> : <Link href='/signin'>Sign In</Link>}</li>
				<li className='navbar-item'>
					<Link href='/signup'>Sign Up</Link>
				</li>
			</ul>
		</nav>
	);
};

export default Navigation;
