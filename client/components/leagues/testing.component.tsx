import dayjs from 'dayjs';
import React from 'react';

import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { QueryKey } from '@util/constants';
import { UserDetails } from '@util/types';

const SomeComponent: React.FC = () => {
	const queryClient: QueryClient = useQueryClient();
	const data: UserDetails = queryClient.getQueryData([QueryKey.USER_DETAILS]);

	return (
		<div>
			<h1>User Details!</h1>
			<p>{data.id}</p>
			<p>{data.email}</p>
			<p>{dayjs(data.createdAt).toISOString()}</p>
			<p>{dayjs(data.updatedAt).toISOString()}</p>
		</div>
	);
};

export default SomeComponent;
