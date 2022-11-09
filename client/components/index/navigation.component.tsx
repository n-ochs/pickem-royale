import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import React from 'react';
import toast from 'react-hot-toast';

import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAuthenticated, signOut } from '@util/api/auth.service';

const Navigation: React.FC = () => {
	const router: NextRouter = useRouter();
	const queryClient: QueryClient = useQueryClient();
	const { isLoading, isSuccess } = useQuery({ queryKey: ['isAuthenticated'], queryFn: isAuthenticated, retry: false });

	const handleSignOut: () => Promise<void> = async () => {
		try {
			await signOut();
			router.push('/');
			toast.success('Successfully signed out.');
		} catch (error) {
			toast.error('Something went wrong. Please try again.', { duration: 7000 });
		} finally {
			queryClient.invalidateQueries({ queryKey: ['isAuthenticated'] });
		}
	};

	return (
		<nav className='flex items-center justify-between'>
			<ul className='flex flex-1 space-x-8 text-lg'>
				<Link href='/'>
					<li className={`navbar-item ${router.pathname === '/' && 'border-white'}`}>Home</li>
				</Link>
				<Link href='/leagues'>
					<li className={`navbar-item ${router.pathname === '/leagues' && 'border-white'}`}>Leagues</li>
				</Link>
				<Link href='/contact'>
					<li className={`navbar-item ${router.pathname === '/contact' && 'border-white'}`}>Contact Us</li>
				</Link>
			</ul>

			<h1 className='flex-[2] text-center text-4xl'>Pickem Royale</h1>

			<ul className='flex flex-1 justify-end space-x-8 text-lg'>
				{!isLoading && (
					<>
						{isSuccess ? (
							<button onClick={handleSignOut}>
								<li className='navbar-item'>Sign Out</li>
							</button>
						) : (
							<Link href='/signin'>
								<li className='navbar-item'>Sign In</li>
							</Link>
						)}
						{!isSuccess && (
							<Link href='/signup'>
								<li className='navbar-item'>Sign Up</li>
							</Link>
						)}
					</>
				)}
			</ul>
		</nav>
	);
};

export default Navigation;
