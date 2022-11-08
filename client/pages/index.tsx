// import Link from 'next/link';
// import toast from 'react-hot-toast';

import Navigation from '@components/index/navigation.component';

// import APIService from '@util/api_service';

import type { NextPage } from 'next';
const Home: NextPage = () => {
	// const signOut: () => Promise<void> = async () => {
	// 	try {
	// 		await APIService.post('/auth/signout', null, { withCredentials: true });
	// 		toast.success('Successfully signed out.');
	// 	} catch (error) {}
	// };

	return (
		<div className='index-bg h-[974px] space-y-10 py-12 px-28'>
			{/* <Link href='/signin'>
				<a>Sign In</a>
			</Link>
			<Link href='/signup'>
				<a>Sign Up</a>
			</Link>
			<button onClick={signOut}>signout</button> */}
			<Navigation />
		</div>
	);
};

export default Home;
