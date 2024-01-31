import { Menu, Switch, Transition } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import { ArrowDown2, Moon, Sun1 } from 'iconsax-react';
import { useTheme } from 'next-themes';
import React, { Fragment, ReactElement, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import * as yup from 'yup';

import { useTranslation } from '@/base/config/i18next';
import { CookieKey, LANGUAGE_DATA } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { updateSetting } from '@/base/redux/reducers/auth.reducer';
import { changeViewInFiat } from '@/base/redux/reducers/common.reducer';
import { setLocalFiat } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { FiatType, UserSettingGeneralType } from '@/base/types/common';
import { CurrencyType } from '@/base/types/wallet';
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
  const { setTheme, theme } = useTheme();

  const { viewInFiat, settings, defaultCurrencyId, fiatSymbols } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.common.viewInFiat,
      settings: state.auth.user.generalSetting,
      fiatSymbols: state.wallet.fiatSymbols,
      defaultCurrencyId: state.auth.user.generalSetting.settingCurrency,
    }),
    shallowEqual,
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') ?? 'dark';
    // setMode(savedTheme);
    setTheme(savedTheme);
  }, []);

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

  const defaultCurrency = useMemo(() => {
    const currency = [...fiatSymbols].find((item) => item.id === defaultCurrencyId);
    return currency ?? null;
  }, [fiatSymbols, defaultCurrencyId]);

  const { i18n } = useTranslation('');

  const handleChangeLang = (item: any) => {
    i18n.changeLanguage(item.key);
    CookiesStorage.setCookieData(CookieKey.lang, item.key);
  };

  const handleChangeLocaleFiat = (item: CurrencyType) => {
    try {
      dispatch(setLocalFiat(item));

      dispatch(updateSetting({ ...settings, settingCurrency: item.id }));
      // CookiesStorage.setCookieData(CookieKey.localeFiat, String(item?.currency));
    } catch (error) {}
  };

  const handleUpdateSetting = async (setting: UserSettingGeneralType) => {
    dispatch(updateSetting(setting));
  };

  return (
    <div className={`${styles.cardContent}`}>
      {isLoading && <Loader />}
      <div className="w-full h-1/3 px-[12px] py-[24px] sm:p-0 sm:mt-5 md:mt-0 dark:text-white text-black">
        <div className="flex justify-between border-b border-solid dark:border-color-border-primary border-color-light-border-primary pb-[8px]">
          <div
            className="dark:text-color-text-primary text-color-light-text-primary text-[12px] sm:text-[14px] flex-1 text-start"
            role="button"
          >
            {t('setting:showFullNameOfCurrencyInCryptoList')}
          </div>
          <Switch
            checked={settings.settingShowFullNameCrypto}
            onChange={(value) => handleUpdateSetting({ ...settings, settingShowFullNameCrypto: value })}
            className={`${
              settings.settingShowFullNameCrypto ? 'bg-[#3bc11733]' : 'dark:bg-color-toggle-primary bg-gray-200'
            } relative inline-flex h-[24px] w-[44px] items-center rounded-full`}
          >
            <span
              className={`${
                settings.settingShowFullNameCrypto ? 'translate-x-[20px] bg-color-primary' : 'translate-x-1 bg-gray-400'
              } inline-block h-[20px] w-[20px] transform rounded-full transition`}
            />
          </Switch>
        </div>
        <div className="flex justify-between border-b border-solid dark:border-color-border-primary border-color-light-border-primary py-[8px]">
          <div
            className="dark:text-color-text-primary text-color-light-text-primary text-[12px] sm:text-[14px] flex-1 text-start"
            role="button"
          >
            {t('setting:receiveMarketingPromotions')}
          </div>
          <Switch
            checked={settings.settingReceiveMarketPromotion}
            onChange={(value) => handleUpdateSetting({ ...settings, settingReceiveMarketPromotion: value })}
            className={`${
              settings.settingReceiveMarketPromotion ? 'bg-[#3bc11733]' : 'dark:bg-color-toggle-primary bg-gray-200'
            } relative inline-flex h-[24px] w-[44px] items-center rounded-full`}
          >
            <span
              className={`${
                settings.settingReceiveMarketPromotion
                  ? 'translate-x-[20px] bg-color-primary'
                  : 'translate-x-1 bg-gray-400'
              } inline-block h-[20px] w-[20px] transform rounded-full transition`}
            />
          </Switch>
        </div>
        <div className="flex justify-between items-center border-b border-solid dark:border-color-border-primary border-color-light-border-primary py-[8px]">
          <div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-[12px] sm:text-[14px] flex-1 text-start">
              {t('setting:currencySetting')}
            </div>
            <div className="mt-[10px]">
              <SelectFiat onChangeMoonpayFiat={handleChangeLocaleFiat} />
            </div>
          </div>
          <Switch
            checked={viewInFiat}
            onChange={(value) => {
              dispatch(setLocalFiat(defaultCurrency));
              dispatch(changeViewInFiat(value));
            }}
            className={`${
              viewInFiat ? 'bg-[#3bc11733]' : 'dark:bg-color-toggle-primary bg-gray-200'
            } relative inline-flex h-[24px] w-[44px] items-center rounded-full`}
          >
            <span
              className={`${
                viewInFiat ? 'translate-x-[20px] bg-color-primary' : 'translate-x-1 bg-gray-400'
              } inline-block h-[20px] w-[20px] transform rounded-full transition`}
            />
          </Switch>
        </div>
        <div className="border-b border-solid dark:border-color-border-primary border-color-light-border-primary py-[8px]">
          <div className="dark:text-color-text-primary text-color-light-text-primary text-[12px] sm:text-[14px] flex-1 text-start">
            {t('setting:displayMode')}
          </div>
          <div className="mt-[10px] dark:bg-[#2D3035] bg-color-light-bg-primary rounded-[5px] flex p-[3px] max-w-[70px]">
            <div
              role="button"
              className={`w-[32px] h-[32px] p-[8px] rounded-[5px] ${
                theme === 'dark' ? 'dark:bg-color-bg-primary bg-white' : ''
              }`}
              onClick={() => {
                setTheme('dark');
              }}
            >
              <Moon className="dark:text-white text-color-light-text-primary" size={16} />
            </div>
            <div
              role="button"
              className={`w-[32px] h-[32px] p-[8px] rounded-[5px] ${
                theme === 'light' ? 'dark:bg-color-bg-primary bg-white' : ''
              }`}
              onClick={() => {
                setTheme('light');
              }}
            >
              <Sun1 className="dark:text-white text-color-light-text-primary" size={16} />
            </div>
          </div>
        </div>
        <div className="pt-[13px]">
          <div className="dark:text-color-text-primary text-color-light-text-primary text-[12px] sm:text-[14px] flex-1 text-start mb-[10px]">
            {t('setting:language')}
          </div>
          <Menu as="div" className="relative w-auto text-left rounded-[7px] flex text-white">
            <Menu.Button>
              <div
                role="button"
                className="flex items-center justify-between dark:bg-[#282931] bg-color-light-bg-primary gap-2 py-2 px-2 rounded w-[146px]"
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
                                  : 'dark:text-gray-400 text-color-light-text-primary',
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
