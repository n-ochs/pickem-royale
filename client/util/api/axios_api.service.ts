import axios, { AxiosInstance } from 'axios';

const APIService: AxiosInstance = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_BASEURL}/api`,
	withCredentials: true
});

APIService.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		if (error.response?.config?.url === '/auth/refresh' && error?.response?.status === 401) {
			return Promise.reject(error);
		}

		if (error?.response?.status === 401) {
			await APIService.post('/auth/refresh', null);
			return APIService(error?.config);
		}
		return Promise.reject(error);
	}
);

export default APIService;
