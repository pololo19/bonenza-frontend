'use client';

import '@/styles/main/main.scss';
import 'react-phone-number-input/style.css';
import 'react-tooltip/dist/react-tooltip.css';
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { GoogleOAuthProvider } from '@react-oauth/google';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import NextNProgress from 'nextjs-progressbar';
import { ReactElement, ReactNode, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, base, mainnet, optimism, polygon, zora } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import { api_validateAuthToken } from '@/api/auth';
import ErrorProvider from '@/components/context/errorContext';
import { wrapper } from '@/redux/store';

import { useTranslation } from '../config/i18next';
import { AUTH_KEY, CookieKey, PROJECT_ID, PROJECT_NAME, TOAST_ENUM } from '../constants/common';
import { CookiesStorage } from '../libs/storage/cookie';
import resources from '../public/locales';

// eslint-disable-next-line
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
declare global {
  interface Window {
    sg: any;
  }
}

function MyApp({ Component, ...rest }: AppPropsWithLayout) {
  const router = useRouter();
  const { props } = wrapper.useWrappedStore(rest);
  const getLayout = Component.getLayout ?? ((page) => page);
  const { i18n } = useTranslation('');

  const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, base, zora],
    [publicProvider()],
  );

  const { connectors } = getDefaultWallets({
    appName: String(PROJECT_NAME),
    projectId: String(PROJECT_ID),
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: false,
    connectors,
    publicClient,
  });

  const handleLang = () => {
    const lang = CookiesStorage.getCookieData(CookieKey.lang) ?? 'en';
    if (resources.hasOwnProperty(lang)) {
      i18n.changeLanguage(lang);
    } else {
      i18n.changeLanguage('en');
    }
  };

  const handleAuthenticationWeb = async () => {
    const auth = CookiesStorage.getCookieData(CookieKey.auth) || '';
    try {
      if (!auth) {
        router.push('/auth');
        return;
      }
      const _res = await api_validateAuthToken(auth);
      if (!_res.data) {
        router.push('/auth');
      }
    } catch (error) {
      router.push('/auth');
    }
  };

  useEffect(() => {
    handleAuthenticationWeb();
    handleLang();
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ErrorProvider>
          <GoogleOAuthProvider clientId={String(process.env.GOOGLE_CLIENT_ID || '')}>
            {/* <Provider store={store}> */}
            <Head>
              <link rel="shortcut icon" type="image/x-icon" href="/favicon/favicon.ico" />
              <base href="/"></base>
              <meta charSet="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="google-site-verification" content="8Pg6SQ4ANq-BBmT7jN0wRovBqUpW0JNxU5kuiVO4aLc" />

              <title>Bonenza</title>
              <meta name="title" content="Bonenza" />
              <meta
                name="description"
                content="Bonenza develops platforms of various genres. It aims to achieve a new experience by identifying the needs of the market and launching an interesting platform to secure a variety of users and apply AI technology to add fun."
              />
              <meta
                name="keywords"
                content="NFT, play to earn, P2E, NFT games, GOD, metaverse, meta, metaverseNFT, NFTgaming, coin, DRON"
              />
              <meta name="theme-color" content="#24262b"></meta>
              <meta name="language" content="English" />
              <meta name="author" content="contact@bonenza.com" />
              <meta name="url" content="https://www.bonenza.com" />

              <meta property="twitter:image" content="https://bonenza.com/img/logo-mobile.png" />
              <meta property="og:image" content="https://bonenza.com/img/logo-mobile.png" />
              {/* <script src="https://cdn.launcher.a8r.games/connector.js" defer></script> */}
              {/* <script src="https://casino.int.a8r.games/public/sg.js"></script> */}
              <noscript>Your browser does not support JavaScript!</noscript>
            </Head>
            <Script async src="/game.js"></Script>
            <Script async src="https://telegram.org/js/telegram-widget.js?22"></Script>

            <NextNProgress />
            <ThemeProvider defaultTheme="dark" attribute="class">
              <>
                <ToastContainer
                  autoClose={5000}
                  className="z-index-toast !text-[12px]"
                  position="bottom-left"
                  theme={'dark'}
                  hideProgressBar={true}
                  icon={() => null}
                  closeButton={() => null}
                  toastClassName={'min-h-[40px]'}
                  bodyClassName={'!p-0 text-gray-200'}
                  enableMultiContainer
                  containerId={TOAST_ENUM.COMMON}
                />
                {getLayout(<Component {...props.pageProps} />)}
              </>
            </ThemeProvider>
            {/* </Provider> */}
          </GoogleOAuthProvider>
        </ErrorProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default wrapper.withRedux(MyApp);
