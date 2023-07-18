import { NextRouter, useRouter } from 'next/router';
import React from 'react';

import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { userDetails } from '@util/api';
import { QueryKey } from '@util/constants';

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const router: NextRouter = useRouter();
	const queryClient: QueryClient = useQueryClient();

	const { data, error, fetchStatus, isLoading } = useQuery({
		queryKey: [QueryKey.USER_DETAILS],
		queryFn: userDetails,
		retry: false,
		cacheTime: 0
	});

	if (isLoading || fetchStatus === 'fetching') {
		return <p>loading...</p>;
	}

	if (error) {
		queryClient.removeQueries([QueryKey.USER_DETAILS]);
		return void router.replace(`/signin?from=${router.pathname.replace('/', '')}`);
	}

	if (data && !error) {
		return <>{children}</>;
	}
};

export default Protected;
