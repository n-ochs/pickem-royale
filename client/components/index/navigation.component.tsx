import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAuthenticated, signOut } from '@util/api';

const Navigation: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const router: NextRouter = useRouter();
	const queryClient: QueryClient = useQueryClient();

	const { isLoading, isSuccess } = useQuery({ queryKey: ['isAuthenticated'], queryFn: isAuthenticated, retry: false, refetchOnWindowFocus: false });

	const { mutate: handleSignOut } = useMutation({
		mutationFn: signOut,
		onSuccess: async () => {
			await router.push('/');
			toast.success('Successfully signed out.');
			await queryClient.invalidateQueries({ queryKey: ['isAuthenticated'] });
		},
		onError: async () => {
			toast.error('Something went wrong. Please try again.', { duration: 7000 });
		}
	});

	const getClassName: (route: string) => string = (route: string) => {
		let className: string[] = ['navbar-item'];
		if (router.pathname === route) {
			className.push('border-white');
		}
		return className.join(' ');
	};

	return (
		<nav className='flex items-center justify-between'>
			<button
				id='menu-btn'
				onClick={() => setIsMenuOpen(!isMenuOpen)}
				className={isMenuOpen ? 'open hamburger z-30 mt-2 block focus:outline-none md:hidden' : 'hamburger mt-2 block focus:outline-none md:hidden'}
			>
				<span className='hamburger-top'></span>
				<span className='hamburger-middle'></span>
				<span className='hamburger-bottom'></span>
			</button>
			<ul className='hidden flex-1 space-x-8 text-lg lg:flex'>
				<Link href='/'>
					<li className={getClassName('/')}>Home</li>
				</Link>
				<Link href='/leagues'>
					<li className={getClassName('/leagues')}>Leagues</li>
				</Link>
				<Link href='/contact'>
					<li className={getClassName('/contact')}>Contact</li>
				</Link>
			</ul>

			<h1 className='slogan hidden flex-[2] text-center text-4xl uppercase text-white lg:block'>Pickem Royale</h1>

			<ul className='flex flex-1 justify-end space-x-8 text-lg'>
				{!isLoading && (
					<>
						{isSuccess ? (
							<button onClick={() => handleSignOut()}>
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
			<div className='lg:hidden'>
				<div
					id='menu'
					className={isMenuOpen ? 'fixed inset-0 z-20 flex h-screen w-screen flex-col bg-black text-white opacity-90' : 'hidden'}
					onClick={() => setIsMenuOpen(false)}
				/>
				{isMenuOpen && (
					<div className='absolute inset-x-0 inset-y-36 z-30 flex w-full flex-col'>
						{/* {menuItems.map((item, index) => {
							return (
								<Link href={item.route} key={`mobile_menu_item_${index}`}>
									<a className='flex h-12 items-center justify-center font-medium text-white'>{item.label}</a>
								</Link>
							);
						})} */}
						{isMenuOpen && (
							<Link href='/'>
								<p className='flex h-12 items-center justify-center font-medium text-white'>Book Us Today!</p>
							</Link>
						)}
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navigation;
