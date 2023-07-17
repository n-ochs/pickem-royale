import { NextPage } from 'next';
import React from 'react';

import Protected from '@components/layout/protected.layout';
import SomeComponent from '@components/leagues/testing.component';

const Leagues: NextPage = () => {
	return (
		<Protected>
			<SomeComponent />
		</Protected>
	);
};

export default Leagues;
