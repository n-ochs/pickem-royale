import Navigation from '@components/index/navigation.component';

import type { NextPage } from 'next';

const Home: NextPage = () => {
	return (
		<div className='index-bg h-[974px] space-y-10 px-16 py-14 md:px-28'>
			<Navigation />
		</div>
	);
};

export default Home;
