import { APIService } from '@util/api';
import { ICredentials } from '@util/types/auth.type';

export const isAuthenticated: () => Promise<void> = async () => {
	return APIService.get('/auth');
};

export const signIn: (credentials: ICredentials) => Promise<void> = async (credentials: ICredentials) => {
	const { email, password } = credentials;
	return APIService.post('/auth/signin', { email, password }, { headers: { 'Content-Type': 'application/json' } });
};

export const signUp: (credentials: ICredentials) => Promise<void> = async (credentials: ICredentials) => {
	const { email, password } = credentials;
	return APIService.post('/auth/signup', { email, password }, { headers: { 'Content-Type': 'application/json' } });
};

export const signOut: () => Promise<void> = async () => {
	return APIService.post('/auth/signout', null);
};
