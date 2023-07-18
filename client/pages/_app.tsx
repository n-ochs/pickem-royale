import '@styles/globals.css';

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import type { AppProps } from 'next/app';

const App: (props: AppProps) => JSX.Element = ({ Component, pageProps }) => {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<Component {...pageProps} />
			<Toaster />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default App;
