import cn from 'classnames';
import { Add, Global, MoneyRecive, Notification, SearchNormal } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
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

import CasinoBoldIcon from '../icons/CasinoBoldIcon';
import ChatSignOutIcon from '../icons/ChatSignOutIcon';
import RacingBoldIcon from '../icons/RacingBoldIcon';
import SportBoldIcon from '../icons/SportBoldIcon';
import { MultiLanguageTabEnum } from '../modal/multiLanguage/MultiLanguage';
import ProfileDropdown from '../profileDropdown/profileDropdown';
import RewardDropdown from '../rewardDropdown/rewardDropdown';
import FiatHeader from './header/fiatHeader';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('');

  const { isLogin, isToggleSidebar, showChatType, viewInFiat, isShowCasinoSearch, localFiat, isAccountPannel } =
    useSelector(
      (state: AppState) => ({
        isLogin: state.auth.isLogin,
        isToggleSidebar: state.modal.isToggleSidebar,
        isShowCasinoSearch: state.modal.isShowCasinoSearch,
        showChatType: state.modal.showChatType,
        viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
        localFiat: state.wallet.localFiat,
        isAccountPannel: state.modal.isShowAccountPannel,
      }),
      shallowEqual,
    );

  return (
    <>
      {/* Navbar */}
      <div
        className={cn(
          'w-full my-auto dark:bg-color-header-secondary bg-white top-0 left-0 fixed z-10 h-[67px] shadow-bs-default',
          {
            'sm:ml-[62px] sm:max-w-[calc(100%-62px)]': !isToggleSidebar && !showChatType,
            'md:ml-[260px] md:max-w-[calc(100%-260px)]': isToggleSidebar && !showChatType,
            'xl:ml-[260px] xl:max-w-[calc(100%-610px)]': showChatType && isToggleSidebar,
            'sm:ml-[62px] xl:max-w-[calc(100%-422px)]': showChatType && !isToggleSidebar,
          },
        )}
        onClick={() => {
          if (isShowCasinoSearch) dispatch(changeIsShowCasinoSearch(false));
        }}
      >
        <div
          className={cn(
            'flex py-[10px] flex-1 h-full lg:justify-end 2xl:justify-between sm:max-md:justify-center md:justify-end justify-between m-auto w-full sm:px-[40px] px-[12px] sm:max-w-[1430px] ',
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
          <div className={cn('gap-[8px] 2xl:flex hidden')}>
            <Link
              href={ROUTER.Casino}
              className={cn(
                'rounded-[3px] px-[12px] group flex items-center gap-[5px] dark:text-color-text-primary text-color-light-text-primary hover:text-color-primary hover:bg-color-light-bg-primary dark:hover:bg-color-hover-primary',
                `${
                  router.route.includes(ROUTER.Casino)
                    ? 'dark:text-white dark:bg-[#2D3035] bg-color-light-bg-primary font-semibold'
                    : ''
                }`,
              )}
            >
              <CasinoBoldIcon className="w-[18px] h-[18px]" />
              <div className={`text-default dark:hover:text-white hover:text-color-light-text-primary`}>
                {t('layout:casino')}
              </div>
            </Link>
            <Link
              href={ROUTER.Sports}
              className={cn(
                'rounded-[5px] px-[12px] py-[12px] group flex items-center gap-[5px] dark:text-color-text-primary text-color-light-text-primary hover:bg-color-light-bg-primary dark:hover:bg-color-hover-primary',
                `${
                  router.asPath.includes(ROUTER.Sports)
                    ? 'dark:text-white dark:bg-[#2D3035] bg-color-light-bg-primary font-semibold'
                    : ''
                }`,
              )}
            >
              <SportBoldIcon className="w-[18px] h-[18px]" />
              <div className={`text-default hover:text-color-light-text-primary dark:hover:text-white `}>
                {t('layout:sports')}
              </div>
            </Link>
            <div
              onClick={() => window.open('https://cmd23.com/room/games.php')}
              className={cn(
                'cursor-pointer rounded-[5px] px-[12px] dark:text-color-text-primary py-[12px] group flex items-center gap-[5px] text-color-light-text-primary hover:bg-color-light-bg-primary dark:hover:bg-color-hover-primary',
              )}
            >
              <Image
                width={20}
                height={20}
                className="max-w-[60px] sm:max-w-[107px] md:max-w-[none] md:max-h-[none] max-h-[40px] text-color-primary"
                src="/icon/liveholdem.png"
                alt="logo"
              />
              <div className={`text-default hover:text-color-light-text-primary dark:hover:text-white text-nowrap`}>
                {t('layout:liveHoldem')}
              </div>
            </div>
            <Link
              href={ROUTER.Racing}
              className={cn(
                'rounded-[5px] px-[12px] dark:text-color-text-primary py-[12px] group flex items-center gap-[5px] text-color-light-text-primary hover:bg-color-light-bg-primary dark:hover:bg-color-hover-primary',
                `${
                  router.asPath.includes(ROUTER.Racing)
                    ? 'dark:text-white dark:bg-[#2D3035] bg-color-light-bg-primary font-semibold'
                    : ''
                }`,
              )}
            >
              <RacingBoldIcon className="" />
              <div className={`text-default hover:text-color-light-text-primary dark:hover:text-white`}>
                {t('layout:racing')}
              </div>
            </Link>
          </div>

          <div className="flex items-center justify-between sm:gap-x-[8px] gap-x-2 w-auto">
            {/* Button */}
            <button
              type="button"
              className="truncate sm:flex hidden text-color-text-primary items-center justify-center gap-[7px] sm:p-[10px] p-[3px] text-default font-semibold"
              onClick={() => dispatch(changeIsShowCasinoSearch(!isShowCasinoSearch))}
            >
              <div className="">
                <SearchNormal className="w-[18px] h-[18px]" />
              </div>
            </button>
            {!isLogin && (
              <div
                className={cn('sm:flex items-center text-white font-bold w-full gap-[15px]', {
                  hidden: isAccountPannel,
                  flex: !isAccountPannel,
                })}
              >
                <button
                  type="button"
                  className="truncate dark:text-color-text-primary rounded-default py-[9px] px-5 text-default font-bold text-color-light-text-primary  dark:hover:bg-color-hover-primary"
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
                  className="truncate text-white rounded-default py-[9px] bg-gradient-btn-default px-5 text-default font-bold"
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
                className="truncate text-white rounded-default bg-gradient-btn-default flex items-center justify-center gap-[7px] sm:p-[10px] p-[3px] text-default font-semibold"
                onClick={() => dispatch(changeIsShowDepositModal(true))}
              >
                <div className="sm:block hidden">
                  <MoneyRecive />
                </div>
                <div className="sm:hidden block">
                  <Add />
                </div>
                <span className="sm:block hidden">{t('layout:deposit')}</span>
              </button>
            )}
            {isLogin && (
              <button
                type="button"
                className="sm:block hidden rounded-default relative dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary text-gray-400 dark:hover:text-white hover:text-black items-center justify-center gap-[7px] h-full px-[12px]"
              >
                <Notification className="w-[20px] h-[20px]" variant="Bold" />
              </button>
            )}
            {/* Message */}
            {!isLogin && (
              <button
                type="button"
                className={`sm:block hidden relative rounded-default dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary text-gray-400 dark:hover:text-white hover:text-black items-center justify-center gap-[7px] h-full px-[12px]`}
              >
                <ChatSignOutIcon className="w-[20px] h-[20px] text-color-text-primary" />
              </button>
            )}
            {isLogin && (
              <button
                type="button"
                className={`sm:block hidden relative rounded-default  dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary text-gray-400 dark:hover:text-white hover:text-black items-center justify-center gap-[7px] h-full px-[12px]`}
                onClick={() => {
                  dispatch(changeShowChatType(!showChatType));
                }}
              >
                <ChatSignOutIcon className="w-[20px] h-[20px] text-color-text-primary" />
                <span className="absolute top-[5px] right-[5px] p-[5px] rounded-full bg-color-primary text-white text-[10px]"></span>
              </button>
            )}

            {/* Bonus  */}
            {isLogin && <RewardDropdown />}
            {/* Avatar */}
            {isLogin && <ProfileDropdown />}
            {/* Multi Language */}
            <button
              type="button"
              className={`${
                isLogin ? 'hidden sm:flex' : 'flex'
              } rounded-default  dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary text-color-text-primary dark:hover:text-white hover:text-black items-center justify-center gap-[7px] p-[10px]`}
              onClick={() => {
                dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.LANGUAGE));
                dispatch(changeIsShowMultiLanguageModal(true));
              }}
            >
              <Global className="w-[20px] h-[20px]" />
            </button>
            {viewInFiat && localFiat && <div className="w-px h-5 bg-slate-400 sm:block hidden"></div>}
            {viewInFiat && localFiat && (
              <button
                type="button"
                className="sm:block hidden rounded-default  dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary dark:hover:text-white hover:text-black dark:text-color-text-primary text-color-light-text-primary p-[10px]"
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
      </div>
      {/* End Navbar */}
    </>
  );
}
