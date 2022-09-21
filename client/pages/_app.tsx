import '../styles/globals.css';
import type { AppProps } from 'next/app';

const App: (props: AppProps) => JSX.Element = ({ Component, pageProps }) => {
	return <Component {...pageProps} />;
};

export default App;
