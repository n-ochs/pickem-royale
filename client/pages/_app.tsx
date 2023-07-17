import '@styles/globals.css';

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

import AuthCtxProvider from '@components/context/auth.context';
// import AuthCtxProvider from '@components/context/auth.context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import type { AppProps } from 'next/app';

const App: (props: AppProps) => JSX.Element = ({ Component, pageProps }) => {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<AuthCtxProvider>
				<Component {...pageProps} />
				<Toaster />
			</AuthCtxProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default App;
