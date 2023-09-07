/* eslint-disable @typescript-eslint/no-misused-promises */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { v4 as uuid } from 'uuid';

const APIService: AxiosInstance = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_BASEURL}/api`,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
});

APIService.interceptors.request.use((config) => {
	// eslint-disable-next-line camelcase
	config.headers.request_id = uuid();
	return config;
});

// https://stackoverflow.com/questions/60749813/how-to-avoid-multiple-token-refresh-requests-when-making-simultaneous-api-reques
let refreshTokenPromise: Promise<AxiosResponse<any, any>>;

APIService.interceptors.response.use(
	(response) => {
		response = response?.data?.data;
		return response;
	},
	async (error) => {
		if (error.response?.config?.url === '/auth/refresh' && error?.response?.status === 401) {
			window.location.replace('/');
			return Promise.reject(error);
		}

		if (error?.response?.status === 401) {
			if (!refreshTokenPromise) {
				refreshTokenPromise = APIService.post('/auth/refresh').then(() => (refreshTokenPromise = null));
			}

			return refreshTokenPromise.then(() => {
				return APIService(error?.config);
			});
		}
		return Promise.reject(error);
	}
);

export { APIService };
