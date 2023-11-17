import { XMarkIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import {
  Award,
  Command,
  Diamonds,
  DollarCircle,
  Element3,
  Gift,
  Global,
  Headphone,
  Home,
  Judge,
  Medal,
  Moon,
  Notepad2,
  SecurityCard,
  Sun1,
  Ticket,
  TrendUp,
} from 'iconsax-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { LANGUAGE_DATA, ROUTER } from '@/base/constants/common';

import {
  changeIsShowMultiLanguageModal,
  changeIsShowVipClubModal,
  changeMultiLanguageTab,
} from '@/base/redux/reducers/modal.reducer';
import { RootState } from '@/base/types/root-state';
import IconOption, { OptionSidebarDataType } from '../common/iconOption/iconOption';
import { MultiLanguageTabEnum } from '../modal/multiLanguage/MultiLanguage';
import BlackjackIcon from '../icons/BlackjackIcon';
import BuyInIcon from '../icons/BuyInIcon';
import FavoriteIcon from '../icons/FavoriteIcon';
import HotGameIcon from '../icons/HotGameIcon';
import LiveCasinoIcon from '../icons/LiveCasinoIcon';
import OriginalIcon from '../icons/OriginalIcon';
import RecentIcon from '../icons/RecentIcon';
import ReleaseIcon from '../icons/ReleaseIcon';
import SlotIcon from '../icons/SlotIcon';

type SidebarMobileLayoutProps = {
  isShowSidebar: boolean;
  setIsShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarMobileLayout: React.FC<SidebarMobileLayoutProps> = ({ isShowSidebar, setIsShowSidebar }) => {
  const { t, i18n } = useTranslation('');
  const dispatch = useDispatch();

  const [mode, setMode] = useState(0);
  const { setTheme } = useTheme();
  const [showDropDownCasino, setShowDropDownCasino] = useState(false);

  const handleGetNameLocale = () => {
    const curLocale = LANGUAGE_DATA.find((e) => e.key === i18n.language);
    return curLocale?.language;
  };

  const { localeFiat } = useSelector(
    (state: RootState) => ({
      localeFiat: state.common.localeFiat,
    }),
    shallowEqual,
  );

  const dataDropDownCasino: OptionSidebarDataType[] = [
    { title: String(t('casino:pickForYou')), href: ROUTER.PicksForYou, icon: <Element3 size={18} /> },
    { title: String(t('casino:favorite')), href: ROUTER.Favorite, icon: <FavoriteIcon size={18} /> },
    { title: String(t('casino:recent')), href: ROUTER.Recent, icon: <RecentIcon size={18} /> },
    {
      title: String(t('casino:bonenzaOriginals')),
      href: ROUTER.Category(String(t('casino:bonenzaOriginals'))),
      icon: <OriginalIcon size={18} />,
    },
    { title: String(t('casino:slot')), href: ROUTER.Category('slots'), icon: <SlotIcon size={18} /> },
    { title: String(t('casino:liveCasino')), href: ROUTER.Tagname('Live Casino'), icon: <LiveCasinoIcon size={18} /> },
    { title: String(t('casino:hotGame')), href: ROUTER.Tagname('Hot Games'), icon: <HotGameIcon size={18} /> },
    { title: String(t('casino:newReleases')), href: ROUTER.Tagname('New Releases'), icon: <ReleaseIcon size={18} /> },
    { title: String(t('casino:featureBuyIn')), icon: <BuyInIcon size={18} /> },
    { title: String(t('casino:blackjack')), href: ROUTER.Tagname('Blackjack'), icon: <BlackjackIcon size={18} /> },
    { title: String(t('casino:tableGames')), href: ROUTER.Tagname('Table Games'), icon: <LiveCasinoIcon size={18} /> },
  ];

  return (
    <div
      className={cn(
        'fixed w-screen transition-transform origin-right duration-500 max-h-[calc(100vh)] mt-[-67px] z-[2000] dark:bg-[#12181F] bg-white shadow h-full',
        {
          'translate-x-0': isShowSidebar,
          '-translate-x-full': !isShowSidebar,
        },
      )}
    >
      <div className="flex items-center justify-between p-3 h-[67px] gap-2">
        <Link href={'/'} className="flex items-center">
          <Image
            width={165}
            height={57}
            className="max-w-[107px] md:max-w-[none] md:max-h-[none] max-h-[30px]"
            src="/img/logo.png"
            alt="logo"
          />
        </Link>
        <div className="flex items-center gap-[10px]">
          <Link href={ROUTER.Home} type="button">
            <button
              type="button"
              className="truncate dark:text-white text-[#31373d] text-[14px] rounded dark:hover:bg-gray-600 dark:bg-[#2D3035] bg-[#f5f6fa] flex items-center justify-center gap-[7px] px-[10px] py-[10px]"
            >
              <div>
                <Home className="dark:text-white text-[#31373d]" size={20} />
              </div>
              {t('layout:home')}
            </button>
          </Link>
          <div className="rounded-md p-1" role="button" onClick={() => setIsShowSidebar(false)}>
            <XMarkIcon width={20} className="dark:text-gray-500 text-black" />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100%-67px)] flex flex-col gap-[5px] px-[20px] pb-[20px]">
        <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center gap-[5px]">
          <IconOption
            title={String(t('sidebar:bonus'))}
            href={ROUTER.Bonus}
            icon={Gift}
            classNames="dark:hover:text-white text-[#31373d] bg-[#f5f6fa] hover:bg-[#e3ecf3] rounded pl-[10px]"
          />
          <div className="flex items-center gap-[5px]">
            <IconOption
              title={String(t('sidebar:quest'))}
              href={ROUTER.Bonus}
              icon={() => <Image height={20} width={20} src={'img/quest.png'} alt=""></Image>}
              classNames="bg-gradient-to-r from-[#F6841B] to-[#FF053B] !text-white rounded pl-[10px] text-10-i font-bold"
            />
            <IconOption
              title={String(t('sidebar:spin'))}
              href={ROUTER.Bonus}
              icon={() => <Image height={20} width={20} src={'img/spin.png'} alt=""></Image>}
              classNames="bg-gradient-to-r from-[#0DFDE4] to-[#F39717] !text-white rounded pl-[10px] text-10-i font-bold"
            />
          </div>
          <IconOption
            title={String(t('sidebar:casino'))}
            href={''}
            icon={Notepad2}
            classNames="dark:hover:text-white dark:text-[#98A7B5] dark:hover:bg-[#292C33] dark:focus:bg-[#292C33] dark:bg-[#2D3035] text-[#31373D] bg-[#F6F7FA] hover:text-[#000] rounded"
            isDropDown={true}
            data={dataDropDownCasino}
          />
          <IconOption
            title={String(t('sidebar:sports'))}
            href={ROUTER.Sports}
            icon={TrendUp}
            classNames="dark:hover:text-white text-[#31373d] bg-[#f5f6fa] hover:bg-[#e3ecf3] rounded pl-[10px]"
          />
          <IconOption
            title={String(t('sidebar:lottery'))}
            href={ROUTER.History}
            icon={Ticket}
            classNames="dark:hover:text-white text-[#31373d] bg-[#f5f6fa] hover:bg-[#e3ecf3] rounded pl-[10px]"
          />
          <IconOption
            title={String(t('sidebar:bingo'))}
            href={ROUTER.Bingo}
            icon={Award}
            classNames="dark:hover:text-white text-[#31373d] bg-[#f5f6fa] hover:bg-[#e3ecf3] rounded pl-[10px]"
          />
        </ul>
        <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center">
          <IconOption
            title={String(t('sidebar:vipClub'))}
            href={''}
            icon={Diamonds}
            classNames="dark:hover:text-white text-[#31373d] bg-[#f5f6fa] hover:bg-[#e3ecf3] rounded-t pl-[10px]"
            onClick={() => {
              dispatch(changeIsShowVipClubModal(true));
            }}
          />
          <IconOption
            title={String(t('sidebar:exclusive'))}
            href={ROUTER.Exclusive}
            icon={Medal}
            classNames="dark:hover:text-white bg-[#f5f6fa] hover:bg-[#e3ecf3] text-[#31373d] rounded-none pl-[10px]"
          />
          <IconOption
            title={String(t('sidebar:affiliate'))}
            href={ROUTER.Affiliate}
            icon={Command}
            classNames="dark:hover:text-white bg-[#f5f6fa] hover:bg-[#e3ecf3] text-[#31373d] rounded-none pl-[10px]"
          />
          <IconOption
            title={String(t('sidebar:provablyFair'))}
            href={ROUTER.ProvablyFair}
            icon={Judge}
            classNames="dark:hover:text-white bg-[#f5f6fa] hover:bg-[#e3ecf3] text-[#31373d] rounded-b pl-[10px]"
          />
        </ul>
        <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center gap-[5px]">
          <IconOption
            title={String(t('sidebar:sponsorships'))}
            href={ROUTER.Sponsorships}
            icon={SecurityCard}
            classNames="dark:hover:text-white bg-[#f5f6fa] hover:bg-[#e3ecf3] text-[#31373d] rounded pl-[10px]"
          />
          <IconOption
            title={String(t('sidebar:liveSupport'))}
            href={ROUTER.LiveSupport}
            icon={Headphone}
            classNames="dark:hover:text-white text-[#31373d] bg-[#f5f6fa] hover:bg-[#e3ecf3] rounded pl-[10px]"
          />
        </ul>
        <div className="dark:text-[#98A7B5] text-[#31373d] rounded dark:bg-[#25262B] bg-[#f5f6fa] flex items-center justify-center gap-[5px]">
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
        </ul>
      </div>
    </div>
  );
};

export default SidebarMobileLayout;
