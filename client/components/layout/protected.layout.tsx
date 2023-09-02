import { NextRouter, useRouter } from 'next/router';
import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { userDetails } from '@util/api';
import { QueryKey } from '@util/constants';

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const router: NextRouter = useRouter();

	const { isError, isLoading } = useQuery({
		queryKey: [QueryKey.USER_DETAILS],
		queryFn: userDetails,
		retry: false,
		cacheTime: 1000 * 60 * 15
	});

	if (isLoading) {
		return <span>Loading...</span>;
	}

	if (isError) {
		return void router.replace(`/signin?from=${encodeURIComponent(router.pathname)}`);
	}

	return <>{children}</>;
};

export default Protected;
