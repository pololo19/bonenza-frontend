import { Menu, Switch, Transition } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import { ArrowDown2, Moon, Sun1 } from 'iconsax-react';
import { useTheme } from 'next-themes';
import React, { Fragment, ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import * as yup from 'yup';

import { useTranslation } from '@/base/config/i18next';
import { CookieKey, LANGUAGE_DATA } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { updateSetting } from '@/base/redux/reducers/auth.reducer';
import { changeLocaleFiat, changeViewInFiat } from '@/base/redux/reducers/common.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { FiatType, UserSettingGeneralType } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import SettingLayout from '@/components/layouts/setting.layout';
import SelectFiat from '@/components/selectFiat/SelectFiat';

import styles from '../../balance/index.module.scss';

type DepositFiatForm = {
  amount: number;
  currency: FiatType;
};

const GeneralPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mode, setMode] = useState(0);
  const { setTheme } = useTheme();

  const { viewInFiat, settings, walletSocket } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.common.viewInFiat,
      settings: state.auth.user.generalSetting,
      user: state.auth.user,
      walletSocket: state.socket.walletSocket,
    }),
    shallowEqual,
  );

  useEffect(() => {
    const theme = localStorage.getItem('theme') === 'light' ? 1 : 0;
    setMode(theme);
  }, []);

  useEffect(() => {
    if (walletSocket?.connected) {
      walletSocket.on('all', (arg: any) => {
        console.log(arg);
        walletSocket.emit('message', 'pong');
        walletSocket.on('message', (item: any) => {
          console.log(item);
        });
      });
    }
  }, [walletSocket]);

  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const schema = yup.object().shape({
    currency: yup
      .object()
      .required(String(t('deposit:currencyRequired')))
      .nullable(String(t('deposit:currencyRequired'))),
    amount: yup.number().required(String(t('deposit:amountRequired'))),
  });

  const {
    control,
    formState: { errors },
  } = useForm<DepositFiatForm>({
    resolver: yupResolver(schema),
  });

  const { i18n } = useTranslation('');

  const handleChangeLang = (item: any) => {
    i18n.changeLanguage(item.key);
    CookiesStorage.setCookieData(CookieKey.lang, item.key);
  };

  const handleChangeLocaleFiat = (item: FiatType) => {
    try {
      dispatch(changeLocaleFiat(item));
      CookiesStorage.setCookieData(CookieKey.localeFiat, String(item?.currency));
    } catch (error) {}
  };

  const handleUpdateSetting = async (setting: UserSettingGeneralType) => {
    dispatch(updateSetting(setting));
  };

  return (
    <div className={`${styles.cardContent}`}>
      {isLoading && <Loader />}
      <div className="w-full h-1/3 px-[12px] py-[24px] sm:p-0 sm:mt-5 md:mt-0 dark:text-white text-black">
        <div className="flex justify-between border-b border-solid border-[#3D4049] pb-[8px]">
          <div
            className="dark:text-[#C2C2C2] text-[#31373d] text-[12px] sm:text-[14px] flex-1 text-start"
            role="button"
          >
            {t('setting:showFullNameOfCurrencyInCryptoList')}
          </div>
          <Switch
            checked={settings.settingShowFullNameCrypto}
            onChange={(value) => handleUpdateSetting({ ...settings, settingShowFullNameCrypto: value })}
            className={`${
              settings.settingShowFullNameCrypto
                ? 'dark:bg-[#0DFDE4]/30 bg-[#3bc11733]'
                : 'dark:bg-[#272C33] bg-[#5f697566]'
            } relative inline-flex h-[24px] w-[44px] items-center rounded-full`}
          >
            <span
              className={`${
                settings.settingShowFullNameCrypto
                  ? 'translate-x-5 bg-[#0DFDE4]'
                  : 'translate-x-1 dark:bg-[#31343D] bg-white'
              } inline-block h-[20px] w-[20px] transform rounded-full transition`}
            />
          </Switch>
        </div>
        <div className="flex justify-between border-b border-solid border-[#3D4049] py-[8px]">
          <div
            className="dark:text-[#C2C2C2] text-[#31373d] text-[12px] sm:text-[14px] flex-1 text-start"
            role="button"
          >
            {t('setting:receiveMarketingPromotions')}
          </div>
          <Switch
            checked={settings.settingReceiveMarketPromotion}
            onChange={(value) => handleUpdateSetting({ ...settings, settingReceiveMarketPromotion: value })}
            className={`${
              settings.settingReceiveMarketPromotion
                ? 'dark:bg-[#0DFDE4]/30 bg-[#3bc11733]'
                : 'dark:bg-[#272C33] bg-[#5f697566]'
            } relative inline-flex h-[24px] w-[44px] items-center rounded-full`}
          >
            <span
              className={`${
                settings.settingReceiveMarketPromotion
                  ? 'translate-x-5 bg-[#0DFDE4]'
                  : 'translate-x-1 dark:bg-[#31343D] bg-white'
              } inline-block h-[20px] w-[20px] transform rounded-full transition`}
            />
          </Switch>
        </div>
        <div className="flex justify-between items-center border-b border-solid border-[#3D4049] py-[8px]">
          <div>
            <div className="dark:text-[#C2C2C2] text-[#31373d] text-[12px] sm:text-[14px] flex-1 text-start">
              {t('setting:currencySetting')}
            </div>
            <div className="mt-[10px]">
              <SelectFiat onChangeMoonpayFiat={handleChangeLocaleFiat} />
            </div>
          </div>
          <Switch
            checked={viewInFiat}
            onChange={(value) => dispatch(changeViewInFiat(value))}
            className={`${
              viewInFiat ? 'dark:bg-[#0DFDE4]/30 bg-[#3bc11733]' : 'dark:bg-[#272C33] bg-[#5f697566]'
            } relative inline-flex h-[24px] w-[44px] items-center rounded-full`}
          >
            <span
              className={`${
                viewInFiat ? 'translate-x-5 bg-[#0DFDE4]' : 'translate-x-1 dark:bg-[#31343D] bg-white'
              } inline-block h-[20px] w-[20px] transform rounded-full transition`}
            />
          </Switch>
        </div>
        <div className="border-b border-solid border-[#3D4049] py-[8px]">
          <div className="dark:text-[#C2C2C2] text-[#31373d] text-[12px] sm:text-[14px] flex-1 text-start text-left">
            {t('setting:displayMode')}
          </div>
          <div className="mt-[10px] dark:bg-[#2D3035] bg-white rounded-[5px] flex p-[3px] max-w-[70px]">
            <div
              role="button"
              className={`w-[32px] h-[32px] p-[8px] rounded-[5px] ${
                mode === 0 ? 'dark:bg-[#24262B] bg-[#f5f6f7]' : ''
              }`}
              onClick={() => {
                setMode(0);
                setTheme('dark');
              }}
            >
              <Moon className="dark:white text-[#9FA5AC]" size={16} />
            </div>
            <div
              role="button"
              className={`w-[32px] h-[32px] p-[8px] rounded-[5px] ${
                mode === 1 ? 'dark:bg-[#24262B] bg-[#f5f6f7]' : ''
              }`}
              onClick={() => {
                setMode(1);
                setTheme('light');
              }}
            >
              <Sun1 className="dark:white text-[#9FA5AC]" size={16} />
            </div>
          </div>
        </div>
        <div className="pt-[13px]">
          <div className="dark:text-[#C2C2C2] text-[#31373d] text-[12px] sm:text-[14px] flex-1 text-start text-left mb-[10px]">
            {t('setting:language')}
          </div>
          <Menu as="div" className="relative w-auto text-left rounded-[7px] flex text-white">
            <Menu.Button>
              <div
                role="button"
                className="flex items-center justify-between dark:bg-[#282931] bg-[#f5f6fa] gap-2 py-2 px-2 rounded w-[146px]"
              >
                <div className="dark:text-white text-black text-[14px] font-semibold">
                  {LANGUAGE_DATA.find((item) => item.key == settings.settingLanguage)?.language}
                </div>
                <div className="dark:text-white text-black truncate text-right min-w-[15px]">
                  <ArrowDown2 className="dark:text-white textx-black" size={15} />
                </div>
              </div>
            </Menu.Button>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="relative sm:hidden block inset-0 bg-black/80 transition-opacity z-[-1]" />
            </Transition.Child>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute z-10 mt-10 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none w-[146px]">
                <div className="py-1 sm:relative rounded-md dark:bg-[#25262B] bg-[#f5f6fa] shadow-gray-700 shadow w-full">
                  <div className="py-1 h-[250px] overflow-y-auto p-2">
                    {LANGUAGE_DATA.map((item, key) => {
                      return (
                        <Menu.Item key={key}>
                          {({ active }) => (
                            <div
                              className={cn(
                                active
                                  ? 'dark:bg-[#212b36] dark:text-white bg-[#f5f6fa] text-black'
                                  : 'dark:text-gray-400 text-[#31373d]',
                                'px-2 py-2 text-sm cursor-pointer flex rounded-md items-center gap-[10px]',
                              )}
                              onClick={() => {
                                handleUpdateSetting({ ...settings, settingLanguage: item.key });
                                handleChangeLang(item);
                                // setLanguageName(item.language);
                              }}
                            >
                              {item.language}
                            </div>
                          )}
                        </Menu.Item>
                      );
                    })}
                  </div>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

const GeneralPageAuth = withAuth(GeneralPage);

GeneralPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <SettingLayout>{page}</SettingLayout>;
};

export default GeneralPageAuth;
