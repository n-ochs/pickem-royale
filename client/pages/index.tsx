import axios from 'axios';
import Link from 'next/link';

import type { NextPage } from 'next';
const Home: NextPage = () => {
	const test: () => Promise<void> = async () => {
		try {
			await axios.get('http://localhost:8080/api/app', { headers: { 'Content-Type': 'application/json' }, withCredentials: true });
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
		</div>
	);
};

export default Home;
