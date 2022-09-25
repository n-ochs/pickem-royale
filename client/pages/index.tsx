import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
	return (
		<div className='space-x-4'>
			<Link href='/signin'>
				<a>Sign In</a>
			</Link>
			<Link href='/signup'>
				<a>Sign Up</a>
			</Link>
		</div>
	);
};

export default Home;
