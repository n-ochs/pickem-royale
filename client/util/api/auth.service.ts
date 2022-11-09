import APIService from '@util/api/axios_api.service';

export const isAuthenticated: () => Promise<void> = async () => {
	return APIService.get('/auth');
};

export const signIn: (email: string, password: string) => Promise<void> = async (email: string, password: string) => {
	return APIService.post('/auth/signin', { email, password }, { headers: { 'Content-Type': 'application/json' } });
};

export const signUp: (email: string, password: string) => Promise<void> = async (email: string, password: string) => {
	return APIService.post('/auth/signup', { email, password }, { headers: { 'Content-Type': 'application/json' } });
};

export const signOut: () => Promise<void> = async () => {
	return APIService.post('/auth/signout', null);
};
