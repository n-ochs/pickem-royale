import SignInForm from '@components/auth/signin.component';

import type { NextPage } from 'next';

const SignIn: NextPage = () => {
	return (
		<div className='flex h-screen items-center justify-center'>
			<SignInForm />
		</div>
	);
};

export default SignIn;
