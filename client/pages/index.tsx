import axios from 'axios';
import Link from 'next/link';

import type { NextPage } from 'next';
const Home: NextPage = () => {
	const test: () => Promise<void> = async () => {
		try {
			await axios.get('http://localhost:8080/api/app', { withCredentials: true });
		} catch (error) {}
	};

	const signOut: () => Promise<void> = async () => {
		try {
			await axios.post('http://localhost:8080/api/auth/signout', null, { withCredentials: true });
		} catch (error) {}
	};

	const refreshToken: () => Promise<void> = async () => {
		try {
			await axios.post('http://localhost:8080/api/auth/refresh', null, { withCredentials: true });
		} catch (error) {}
	};
	return (
		<div className='space-x-4'>
			<Link href='/signin'>
				<a>Sign In</a>
			</Link>
			<Link href='/signup'>
				<a>Sign Up</a>
			</Link>
			<button onClick={test}>test</button>
			<button onClick={signOut}>signout</button>
			<button onClick={refreshToken}>refresh</button>
		</div>
	);
};

export default Home;
