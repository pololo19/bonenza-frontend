'use client';

import '@/styles/main/main.scss';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import 'react-phone-number-input/style.css';
import 'react-tooltip/dist/react-tooltip.css';

import { Web3Provider } from '@ethersproject/providers';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Web3ReactProvider } from '@web3-react/core';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import NextNProgress from 'nextjs-progressbar';
import { ReactElement, ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import ErrorProvider from '@/components/context/errorContext';
import { wrapper } from '@/redux/store';

import { useTranslation } from '../config/i18next';
import { AUTH_KEY, CookieKey, TOAST_ENUM } from '../constants/common';
import { CookiesStorage } from '../libs/storage/cookie';
import resources from '../public/locales';

// eslint-disable-next-line
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const getLibrary = (provider: any) => {
  return new Web3Provider(provider);
};

declare global {
  interface Window {
    sg: any;
  }
}

function MyApp({ Component, ...rest }: AppPropsWithLayout) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const getLayout = Component.getLayout ?? ((page) => page);
  const { i18n } = useTranslation('');
  const router = useRouter();

  const handleLang = () => {
    const lang = CookiesStorage.getCookieData(CookieKey.lang) ?? 'en';
    if (resources.hasOwnProperty(lang)) {
      i18n.changeLanguage(lang);
    } else {
      i18n.changeLanguage('en');
    }
  };

  const handleAuthenticationWeb = () => {
    const auth = CookiesStorage.getCookieData(CookieKey.auth);
    if (!auth || auth !== AUTH_KEY) {
      router.push('/auth');
    }
  };

  useEffect(() => {
    handleAuthenticationWeb();
    handleLang();
  }, []);

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ErrorProvider>
        <GoogleOAuthProvider clientId={String(process.env.GOOGLE_CLIENT_ID || '')}>
          <Provider store={store}>
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
              <meta name="language" content="English" />
              <meta name="author" content="contact@bonenza.com" />
              <meta name="url" content="https://www.bonenza.com" />

              <meta property="twitter:image" content="https://bonenza.com/img/logo.png" />
              <script src="https://cdn.launcher.a8r.games/connector.js" defer></script>
              <noscript>Your browser does not support JavaScript!</noscript>
            </Head>
            {/* <Script src="https://js.stripe.com/v3/"></Script>
            <Script src="https://js.stripe.com/v3/"></Script> */}
            <Script async src="https://telegram.org/js/telegram-widget.js?22"></Script>
            <Script src="https://casino.cur.a8r.games/public/sg.js"></Script>

            <ToastContainer
              autoClose={5000}
              className="z-index-toast !text-[12px]"
              position="bottom-left"
              theme="dark"
              hideProgressBar={true}
              icon={() => null}
              closeButton={() => null}
              toastClassName={'min-h-[40px]'}
              bodyClassName={'!p-0 text-gray-200'}
              enableMultiContainer
              containerId={TOAST_ENUM.COMMON}
            />
            <NextNProgress />
            <ThemeProvider defaultTheme="dark" attribute="class">
              {getLayout(<Component {...props.pageProps} />)}
            </ThemeProvider>
          </Provider>
        </GoogleOAuthProvider>
      </ErrorProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
