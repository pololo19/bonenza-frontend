import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_validateToken } from '@/api/auth';
import { api_getInitData } from '@/api/wallet';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo } from '@/base/libs/utils';
import { logoutState, saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { initWalletInfo, logoutWallet, setFiatSymbols, setLocalFiat } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { CurrencyType } from '@/base/types/wallet';

import Loader from '../common/preloader/loader';

type AdminLayoutProps = {
  children: JSX.Element;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation('');
  const { isLogin } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const wrappedError = () => {
    dispatch(logoutState());
    dispatch(logoutWallet());
    CookiesStorage.logout();
    return new Promise((resolve) => {
      if (router.pathname !== ROUTER.Home) {
        router.replace(ROUTER.Home);
      }
      resolve(true);
    });
  };

  const loadInitData = async () => {
    try {
      const res = await api_getInitData();
      const tempFiatSymbols: CurrencyType[] =
        res.data?.fiatSymbols?.map((item: any) => ({
          id: item.id,
          name: item.symbol,
          alias: item.name,
          logo: `/img/fiats/${item.symbol}.png`,
          iso_currency: item.iso_currency,
          iso_decimals: item.iso_decimals,
          availableNetworks: item.availableNetworks,
          price: Number(item.price),
        })) || [];
      dispatch(setFiatSymbols(tempFiatSymbols));
    } catch (error) {
      dispatch(setFiatSymbols([]));
    }
  };

  const connectAccount = async () => {
    try {
      const accessToken = CookiesStorage.getAccessToken();

      if (accessToken) {
        const res = await api_validateToken(accessToken);

        const localFiat: CurrencyType = {
          id: res.data.settingFiatCurrency.id ?? '',
          name: res.data.settingFiatCurrency.symbol ?? '',
          alias: res.data.settingFiatCurrency.name ?? '',
          logo: `/img/fiats/${res.data.settingFiatCurrency.symbol}.png`,
          iso_currency: res.data.settingFiatCurrency.iso_currency,
          iso_decimals: res.data.settingFiatCurrency.iso_decimals,
          availableNetworks: [],
          price: Number(res.data.settingFiatCurrency.price),
          type: 'fiat',
          favorite: res.data.settingFiatCurrency.favorite,
        };
        i18n.changeLanguage(res.data?.settingLanguage ?? 'en');
        dispatch(saveUserInfo({ ...convertUserInfo(res.data) }));
        dispatch(initWalletInfo());
        dispatch(setLocalFiat(localFiat));
      } else {
        await loadInitData();
      }
    } catch (error) {
      wrappedError();
      await loadInitData();
    } finally {
    }
  };

  useEffect(() => {
    if (!isLogin) {
      connectAccount();
    }
  }, [isLogin]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="min-h-screen h-full w-full overflow-hidden font-dayOne bg-[#f8f8f8]">
        <div className="md:pt-0 h-full w-full relative">
          <div className="h-[60px] py-2 px-6 w-full bg-[#24262b]">
            <Link href={ROUTER.AdminFriends} className="flex items-center">
              <Image
                width={158}
                height={31}
                className="w-[158px] md:max-w-[none] md:max-h-[none] h-[31px]"
                src="/img/logo.png"
                alt="logo"
              />
            </Link>
          </div>
          <div className="flex h-[calc(100vh-60px)] w-full max-h-[calc(100vh-60px)]">
            <div className="md:block hidden max-w-[250px] w-full py-1 bg-[#1e2024] h-full text-white overflow-y-auto text-[14px] font-[500] flex flex-col items-start gap-2">
              <Link
                href={ROUTER.AdminFriends}
                className={cn('px-6 py-2 text-[#99a4b0] hover:text-[#dab03a] hover:bg-gray-500/40 w-full block', {
                  'bg-gray-500/40 text-[#dab03a]': ROUTER.AdminFriends.includes(router.pathname),
                })}
              >
                Friends Management
              </Link>
              <Link
                href={ROUTER.AdminCommissions}
                className={cn('px-6 py-2 text-[#99a4b0] hover:text-[#dab03a] hover:bg-gray-500/40 w-full block', {
                  'bg-gray-500/40 text-[#dab03a]': ROUTER.AdminCommissions.includes(router.pathname),
                })}
              >
                Commission Rewards
              </Link>
              <Link
                href={ROUTER.AdminRewards}
                className={cn('px-6 py-2 text-[#99a4b0] hover:text-[#dab03a] hover:bg-gray-500/40 w-full block', {
                  'bg-gray-500/40 text-[#dab03a]': ROUTER.AdminRewards.includes(router.pathname),
                })}
              >
                USDT Rewards
              </Link>
            </div>
            <div className="overflow-y-auto w-full p-6">{children}</div>
            {/*Start footer navigator */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
