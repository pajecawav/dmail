import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>dmail</title>
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
