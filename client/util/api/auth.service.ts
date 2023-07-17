import { APIService } from '@util/api';
import { UserDetails } from '@util/types';
import { ICredentials } from '@util/types/auth.type';

const baseRoute: string = '/auth';

export const userDetails: () => Promise<UserDetails> = async () => {
	return APIService.get(`${baseRoute}/user`);
};

export const signIn: (credentials: ICredentials) => Promise<UserDetails> = async (credentials: ICredentials) => {
	return APIService.post(`${baseRoute}/signin`, credentials);
};

export const signUp: (credentials: ICredentials) => Promise<void> = async (credentials: ICredentials) => {
	return APIService.post(`${baseRoute}/signup`, credentials);
};

export const signOut: () => Promise<void> = async () => {
	return APIService.post(`${baseRoute}/signout`);
};
