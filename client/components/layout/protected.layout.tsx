import { NextRouter, useRouter } from 'next/router';
import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { userDetails } from '@util/api';
import { QueryKey } from '@util/constants';

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const router: NextRouter = useRouter();
	const { data, error, isLoading, fetchStatus } = useQuery({
		queryKey: [QueryKey.USER_DETAILS],
		queryFn: userDetails,
		retry: false,
		cacheTime: 0
	});

	if (isLoading || fetchStatus === 'fetching') {
		return <p>loading...</p>;
	}

	if (data) {
		return <>{children}</>;
	}

	if (error) {
		return void router.replace(`/signin?from=${router.pathname.replace('/', '')}`);
	}
};

export default Protected;
