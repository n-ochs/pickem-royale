import { NextRouter, useRouter } from 'next/router';

import SignInForm from '@components/auth/signin.component';

import type { NextPage } from 'next';

const SignIn: NextPage = () => {
	const router: NextRouter = useRouter();
	const from: string = (router.query?.from as string) || null;

	return (
		<div className='flex h-screen items-center justify-center'>
			<SignInForm from={from} />
		</div>
	);
};

export default SignIn;
