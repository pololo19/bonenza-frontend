import cn from 'classnames';
import { Gift, Global, Message, MoneyRecive, Notification } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { handleLocaleSymbol } from '@/base/libs/utils';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowCasinoSearch,
  changeIsShowDepositModal,
  changeIsShowMultiLanguageModal,
  changeMultiLanguageTab,
  changeShowChatType,
} from '@/base/redux/reducers/modal.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

import LoaderFull from '../common/loaderFull/loaderFull';
import CasinoBoldIcon from '../icons/CasinoBoldIcon';
import RacingBoldIcon from '../icons/RacingBoldIcon';
import SportBoldIcon from '../icons/SportBoldIcon';
import ModalCasinoSearch from '../modal/casinoSearch/casinoSearch';
import { MultiLanguageTabEnum } from '../modal/multiLanguage/MultiLanguage';
import ProfileDropdown from '../profileDropdown/profileDropdown';
import FiatHeader from './header/fiatHeader';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('');
  const [isLoadingFull, setIsLoadingFull] = useState<boolean>(false);

  const { isLogin, isToggleSidebar, showChatType, viewInFiat, isShowCasinoSearch, localFiat } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
      isToggleSidebar: state.modal.isToggleSidebar,
      isShowCasinoSearch: state.modal.isShowCasinoSearch,
      showChatType: state.modal.showChatType,
      viewInFiat: state.common.viewInFiat,
      localFiat: state.wallet.localFiat,
    }),
    shallowEqual,
  );

  return (
    <>
      {/* Navbar */}
      {isLoadingFull && <LoaderFull />}
      <div
        className={cn(
          'w-full my-auto py-2 dark:bg-color-header bg-white top-0 left-0 fixed z-10 ] h-[67px] shadow-bs-default',
          {
            'sm:ml-[62px] sm:max-w-[calc(100%-62px)]': !isToggleSidebar && !showChatType,
            'md:ml-[205px] md:max-w-[calc(100%-205px)]': isToggleSidebar && !showChatType,
            'xl:ml-[205px] xl:max-w-[calc(100%-565px)]': showChatType && isToggleSidebar,
            'sm:ml-[62px] xl:max-w-[calc(100%-422px)]': showChatType && !isToggleSidebar,
          },
        )}
      >
        <div
          className={cn(
            'flex flex-1 h-full lg:justify-between sm:max-md:justify-center md:justify-end justify-between m-auto w-full sm:px-[40px] px-[12px] sm:max-w-[1430px]',
            {
              // 'sm:pl-[62px]': !isToggleSidebar && !showChatType,
              // 'md:pl-[205px]': isToggleSidebar && !showChatType,
            },
          )}
        >
          <Link href={'/'} className="flex items-center sm:hidden">
            <Image
              width={165}
              height={57}
              className="max-w-[60px] sm:max-w-[107px] md:max-w-[none] md:max-h-[none] max-h-[40px]"
              src="/img/logo-mobile.png"
              alt="logo"
            />
          </Link>
          <div className={cn('gap-[8px] lg:flex hidden')}>
            <Link
              href={ROUTER.Casino}
              className={cn(
                'rounded-[5px] px-5 hover:text-[#31373d] py-[12px] group flex items-center gap-[5px] dark:text-[#98A7B5] text-[#31373D] hover:bg-[#F6F7FA] dark:hover:text-white dark:hover:bg-gray-600',
                `${
                  router.route.includes(ROUTER.Casino)
                    ? 'dark:text-white dark:bg-[#2D3035] bg-[#F6F7FA] font-semibold'
                    : ''
                }`,
              )}
            >
              <CasinoBoldIcon className="w-[18px] h-[18px]" />
              <div className={`text-[14px]`}>{t('layout:casino')}</div>
            </Link>
            <Link
              href={ROUTER.Sports}
              className={cn(
                'rounded-[5px] px-5 hover:text-[#31373d]  py-[12px] group flex items-center gap-[5px] dark:text-[#98A7B5] text-[#31373D] hover:bg-[#F6F7FA] dark:hover:text-white dark:hover:bg-gray-600',
                `${
                  router.asPath.includes(ROUTER.Sports)
                    ? 'dark:text-white dark:bg-[#2D3035] bg-[#F6F7FA] font-semibold'
                    : ''
                }`,
              )}
            >
              <SportBoldIcon className="w-[18px] h-[18px]" />
              <div className={`text-[14px]`}>{t('layout:sports')}</div>
            </Link>
            <Link
              href={ROUTER.Racing}
              className={cn(
                'rounded-[5px] px-5 hover:text-[#31373d] dark:text-[#98a7b5] py-[12px] group flex items-center gap-[5px] text-[#31373D] hover:bg-[#F6F7FA] dark:hover:text-white dark:hover:bg-gray-600',
                `${
                  router.asPath.includes(ROUTER.Racing)
                    ? 'dark:text-white dark:bg-[#2D3035] bg-[#F6F7FA] font-semibold'
                    : ''
                }`,
              )}
            >
              <RacingBoldIcon className="" />
              <div className={`text-[14px]`}>{t('layout:racing')}</div>
            </Link>
          </div>

          <div className="flex items-center justify-between sm:gap-x-[8px] gap-x-2 w-auto">
            {/* Button */}
            {!isLogin && (
              <div className="flex items-center text-white font-bold w-full gap-2">
                <button
                  type="button"
                  className="truncate dark:text-white rounded-[5px] font-semibold py-[9px] px-5 text-[14px] font-bold text-[#31373d] dark:hover:bg-gray-600"
                  onClick={() => {
                    dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                    dispatch(changeIsShowAuthenticationModal(true));
                  }}
                >
                  {t('layout:signIn')}
                </button>

                {/* Button */}
                <button
                  type="button"
                  className="truncate text-white rounded-[5px] font-semibold py-[9px] bg-color-primary px-5 text-[14px] font-bold"
                  onClick={() => {
                    dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                    dispatch(changeIsShowAuthenticationModal(true));
                  }}
                >
                  {t('layout:signUp')}
                </button>
              </div>
            )}
            {isLogin && <FiatHeader />}
            {isLogin && (
              <button
                type="button"
                className="truncate text-white rounded-[5px] bg-color-primary flex items-center justify-center gap-[7px] sm:p-[10px] p-[7px] md:text-[14px] text-[12px] font-semibold"
                onClick={() => dispatch(changeIsShowDepositModal(true))}
              >
                <div className="sm:block hidden">
                  <MoneyRecive />
                </div>
                {t('layout:deposit')}
              </button>
            )}
            {isLogin && (
              <button
                type="button"
                className="sm:block hidden rounded-md dark:hover:bg-gray-600 hover:bg-[#f6f7fa] text-gray-400 dark:hover:text-white hover:text-black flex items-center justify-center gap-[7px] p-[10px]"
              >
                <Notification width={18} height={18} variant="Bold" />
              </button>
            )}
            {/* Message */}
            {isLogin && (
              <button
                type="button"
                className={`sm:block hidden rounded-md dark:hover:bg-gray-600 hover:bg-[#f6f7fa] text-gray-400 dark:hover:text-white hover:text-black flex items-center justify-center gap-[7px] p-[10px] ${
                  showChatType ? 'bg-gray-300 dark:bg-gray-800 text-black dark:text-white' : ''
                }`}
                onClick={() => {
                  dispatch(changeShowChatType(!showChatType));
                }}
              >
                <Message width={18} height={18} variant="Bold" />
              </button>
            )}

            {isLogin && (
              <Link
                className="block sm:hidden dark:hover:bg-gray-600 hover:bg-[#f6f7fa] text-gray-400 dark:hover:text-white hover:text-black p-[10px] max-[400px]:px-0 rounded-md"
                href={ROUTER.Bonus}
              >
                <Gift width={18} height={18} />
              </Link>
            )}
            {/* Avatar */}
            {isLogin && <ProfileDropdown />}
            {/* Multi Language */}
            <button
              type="button"
              className={`${
                isLogin ? 'hidden sm:flex' : 'flex'
              } rounded-md dark:hover:bg-gray-600 hover:bg-[#f6f7fa] text-gray-400 dark:hover:text-white hover:text-black items-center justify-center gap-[7px] p-[10px]`}
              onClick={() => {
                dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.LANGUAGE));
                dispatch(changeIsShowMultiLanguageModal(true));
              }}
            >
              <Global width={18} height={18} />
            </button>
            {viewInFiat && localFiat && <div className="w-px h-5 bg-slate-400 sm:block hidden"></div>}
            {viewInFiat && localFiat && (
              <button
                type="button"
                className="sm:block hidden rounded-md dark:hover:bg-gray-600 hover:bg-[#f6f7fa] text-gray-400 dark:hover:text-white hover:text-black text-[#31373D] p-[10px]"
                onClick={() => {
                  dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.FIAT));
                  dispatch(changeIsShowMultiLanguageModal(true));
                }}
              >
                <div className="p-1 text-sm w-max">
                  {handleLocaleSymbol(String(localFiat.name))} <span>{localFiat.name}</span>
                </div>
              </button>
            )}
          </div>
        </div>
        {isShowCasinoSearch && (
          <ModalCasinoSearch
            show={isShowCasinoSearch}
            onClose={() => {
              dispatch(changeIsShowCasinoSearch(false));
            }}
          />
        )}
      </div>
      {/* End Navbar */}
    </>
  );
}
