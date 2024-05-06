import cn from 'classnames';
import { Command, Diamonds, SearchNormal } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { casinoCategories, casinoGames } from '@/base/constants/config-menus';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowCasinoSearch,
  changeIsShowMenuPannel,
  changeIsShowVipClubModal,
} from '@/base/redux/reducers/modal.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

import IconOption, { IconOptionProps } from '../common/iconOption/iconOption';
import CsrWrapper from '../CsrWrapper';

const SidebarMobileLayout: React.FC = () => {
  const { t, i18n } = useTranslation('');
  const dispatch = useAppDispatch();

  const { isShowSidebar, isLogin } = useSelector(
    (state: AppState) => ({
      isShowSidebar: state.modal.isShowMenuPannel,
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const router = useRouter();

  const initDatas: IconOptionProps[] = useMemo(
    () => [
      {
        title: String(t('sidebar:vipClub')),
        href: '#',
        icon: Diamonds,
        onClick: () => {
          if (!isLogin) {
            dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
            dispatch(changeIsShowAuthenticationModal(true));
          } else {
            dispatch(changeIsShowVipClubModal(true));
          }
        },
      },
      // {
      //   title: String(t('sidebar:exclusive')),
      //   href: ROUTER.Exclusive,
      //   icon: Medal,
      // },
      {
        title: String(t('sidebar:affiliate')),
        href: ROUTER.Affiliate,
        icon: Command,
      },
      // {
      //   title: String(t('sidebar:provablyFair')),
      //   href: ROUTER.ProvablyFair,
      //   icon: Judge,
      // },
      // {
      //   title: String(t('sidebar:sponsorships')),
      //   href: ROUTER.Sponsorships,
      //   icon: SecurityCard,
      // },
    ],
    [i18n.language, isLogin],
  );

  return (
    <div
      className={cn(
        'fixed w-screen max-h-[calc(100vh_-_150px)] transition-transform duration-800 origin-bottom overflow-y-auto top-[130px] bottom-[60px] dark:bg-color-bg-primary bg-color-light-bg-primary shadow sm:hidden',
        {
          'translate-y-full': !isShowSidebar,
          'translate-y-0': isShowSidebar,
        },
      )}
    >
      <div className="flex flex-col gap-[10px] px-[12px] pb-[20px]">
        <div className="relative">
          <div
            className="relative h-[40px] dark:bg-color-input-secondary dark:text-color-text-primary bg-white rounded-default flex items-center justify-start px-[10px] gap-[20px]"
            onClick={() => {
              dispatch(changeIsShowMenuPannel(!isShowSidebar));
              dispatch(changeIsShowCasinoSearch(true));
            }}
            role="button"
          >
            <SearchNormal width={24} height={24} className="text-color-text-primary" />
            <div className={cn('w-full text-[14px] text-color-text-primary outline-none')}>
              {t('casino:gameNameAndProvider')}
            </div>
          </div>
        </div>
        <div className="relative grid grid-cols-3 gap-[8px]">
          {casinoCategories.map((item, index) => {
            const IconElement = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => dispatch(changeIsShowMenuPannel(false))}
                className="flex flex-col gap-[5px] px-[10px] py-[16px] items-center justify-center dark:bg-color-hover-primary bg-white rounded-default dark:text-color-text-primary text-color-light-text-primary"
              >
                {
                  <IconElement
                    size={18}
                    className={cn('', {
                      'font-[700] dark:text-white text-black': router.route.includes(item.href),
                    })}
                  />
                }
                <span className={cn('text-[13px]', { 'dark:text-white text-black': router.route.includes(item.href) })}>
                  {t(item.title)}
                </span>
              </Link>
            );
          })}
        </div>
        <ul className="flex flex-col content-center list-none bg-white md:flex-col md:min-w-full dark:bg-color-hover-primary rounded-default">
          <span className="dark:text-color-text-primary text-color-light-text-primary px-[12px] py-[5px] text-[12px] border-solid border-b-[1px] dark:border-color-border-primary border-color-light-border-primary">
            {t('layout:games')}
          </span>
          {casinoGames.map((game, index) => (
            <CsrWrapper key={index}>
              <IconOption
                title={String(t(game.title))}
                href={game.href}
                icon={game.icon}
                classNames="dark:hover:text-white dark:!text-white text-color-light-text-primary !bg-transparent hover:bg-[#e3ecf3] rounded pl-[10px] !py-[14px]"
                onClick={() => dispatch(changeIsShowMenuPannel(false))}
              />
            </CsrWrapper>
          ))}
        </ul>

        <ul className="flex flex-col content-center list-none bg-white md:flex-col md:min-w-full dark:bg-color-hover-primary rounded-default">
          {initDatas.map((item, index) => (
            <CsrWrapper key={index}>
              <IconOption
                title={item.title}
                href={item.href}
                icon={item.icon}
                onClick={item.onClick}
                classNames="dark:hover:text-white dark:!text-white text-color-light-text-primary !bg-transparent hover:bg-[#e3ecf3] rounded pl-[10px] !py-[14px]"
              />
            </CsrWrapper>
          ))}
        </ul>
        {/* <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center gap-[5px] dark:bg-color-hover-primary bg-white rounded-[3px]">
          <IconOption
            title={String(t('sidebar:liveSupport'))}
            href={ROUTER.LiveSupport}
            icon={Headphone}
            classNames="dark:hover:text-white dark:!text-white text-color-light-text-primary !bg-transparent hover:bg-[#e3ecf3] rounded pl-[10px] !py-[14px]"
          />
        </ul> */}
        {/* <div className="dark:text-[#98A7B5] text-[#31373d] rounded dark:bg-[#25262B] bg-[#f5f6fa] flex items-center justify-center gap-[5px]">
          <div
            className={`flex justify-center items-center flex-1 px-[15px] py-[10px] gap-[10px] rounded cursor-pointer ${
              mode === 0
                ? 'dark:bg-[#2D3035] dark:text-white bg-[#eaecf3] text-[#31373d]'
                : 'dark:hover:bg-gray-600 hover:bg-[#eaecf3]'
            }`}
            onClick={() => {
              setMode(0);
              setTheme('dark');
            }}
          >
            <Moon size={16} />
            <div className="text-sm">{t('layout:dark')}</div>
          </div>
          <div
            className={`flex justify-center items-center flex-1 px-[15px] py-[10px] gap-[10px] rounded cursor-pointer ${
              mode === 1
                ? 'dark:bg-[#2D3035] dark:text-white bg-[#eaecf3] text-[#31373d]'
                : 'dark:hover:bg-gray-600 hover:bg-[#eaecf3]'
            }`}
            onClick={() => {
              setMode(1);
              setTheme('light');
            }}
          >
            <Sun1 size={16} />
            <div className="text-sm">{t('layout:light')}</div>
          </div>
        </div>
        <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center gap-[5px]">
          <div
            role="button"
            className={cn(
              `capitalize dark:hover:bg-gray-600 block dark:bg-[#2D3035] bg-[#f5f6fa] hover:bg-[#e3ecf3] dark:text-[#98A7B5] text-[#31373d] text-[14px] flex items-center gap-[16px] flex-1 pl-[15px] px-[5px] py-[10px]`,
            )}
            onClick={() => {
              dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.LANGUAGE));
              dispatch(changeIsShowMultiLanguageModal(true));
              setIsShowSidebar(false);
            }}
          >
            <Global size={18} className="dark:text-white text-[#31373d]" />
            <div className={cn('flex-1 text-start text-[14px]')}>{handleGetNameLocale()}</div>
          </div>
          <div
            role="button"
            className={cn(
              `capitalize dark:hover:bg-gray-600 block dark:bg-[#2D3035] dark:text-[#98A7B5] bg-[#f5f6fa] hover:bg-[#e3ecf3] text-[#31373d] text-[14px] flex items-center gap-[16px] flex-1 pl-[15px] px-[5px] py-[10px]`,
            )}
            onClick={() => {
              dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.FIAT));
              dispatch(changeIsShowMultiLanguageModal(true));
              setIsShowSidebar(false);
            }}
          >
            <DollarCircle size={18} className="dark:text-white text-[#31373d]" />
            <div className={cn('flex-1 text-start text-[14px]')}>{localeFiat?.currency}</div>
          </div>
        </ul> */}
      </div>
    </div>
  );
};

export default SidebarMobileLayout;
