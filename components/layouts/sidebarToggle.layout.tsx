import cn from 'classnames';
import {
  Award,
  Command,
  Diamonds,
  Element3,
  Gift,
  HambergerMenu,
  Headphone,
  Judge,
  Medal,
  Moon,
  Notepad2,
  SecurityCard,
  Sun1,
  Ticket,
  TrendUp,
} from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import {
  changeIsShowCasinoSearch,
  changeIsShowVipClubModal,
  changeToggleSidebar,
} from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';

import IconOption, { OptionSidebarDataType } from '../common/iconOption/iconOption';
import BlackjackIcon from '../icons/BlackjackIcon';
import BuyInIcon from '../icons/BuyInIcon';
import FavoriteIcon from '../icons/FavoriteIcon';
import HotGameIcon from '../icons/HotGameIcon';
import LiveCasinoIcon from '../icons/LiveCasinoIcon';
import OriginalIcon from '../icons/OriginalIcon';
import RecentIcon from '../icons/RecentIcon';
import ReleaseIcon from '../icons/ReleaseIcon';
import SlotIcon from '../icons/SlotIcon';

export default function SidebarToggle() {
  const { setTheme } = useTheme();
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const router = useRouter();
  const [showDropDownCasino, setShowDropDownCasino] = useState(false);
  const dataDropDownCasino: OptionSidebarDataType[] = [
    { title: String(t('casino:pickForYou')), href: ROUTER.PicksForYou, icon: <Element3 size={18} /> },
    { title: String(t('casino:favorite')), href: ROUTER.Favorite, icon: <FavoriteIcon size={18} /> },
    { title: String(t('casino:recent')), href: ROUTER.Recent, icon: <RecentIcon size={18} /> },
    {
      title: String(t('casino:bonenzaOriginals')),
      href: ROUTER.Category(String(t('casino:bonenzaOriginals'))),
      icon: <OriginalIcon size={18} />,
    },
    { title: String(t('casino:slot')), href: ROUTER.Tagname('slots'), icon: <SlotIcon size={18} /> },
    { title: String(t('casino:liveCasino')), href: ROUTER.Tagname('Live Casino'), icon: <LiveCasinoIcon size={18} /> },
    { title: String(t('casino:hotGame')), href: ROUTER.Tagname('Hot Games'), icon: <HotGameIcon size={18} /> },
    { title: String(t('casino:newReleases')), href: ROUTER.Tagname('New Releases'), icon: <ReleaseIcon size={18} /> },
    { title: String(t('casino:featureBuyIn')), href: ROUTER.Tagname('Feature Buy-in'), icon: <BuyInIcon size={18} /> },
    { title: String(t('casino:blackjack')), href: ROUTER.Tagname('Blackjack'), icon: <BlackjackIcon size={18} /> },
    { title: String(t('casino:tableGames')), href: ROUTER.Tagname('Table Games'), icon: <LiveCasinoIcon size={18} /> },
  ];

  const [mode, setMode] = useState(0);

  useEffect(() => {
    const theme = localStorage.getItem('theme') === 'light' ? 1 : 0;
    setMode(theme);
  }, []);

  const { isToggleSidebar, isShowVipClubModal } = useSelector(
    (state: AppState) => ({
      isToggleSidebar: state.modal.isToggleSidebar,
      isShowVipClubModal: state.modal.isShowVipClubModal,
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  return (
    <>
      {/* Main Sidebar */}
      <div
        className={cn('transition-transform h-full flex flex-col w-[205px]', {
          'translate-x-0': isToggleSidebar,
          '-translate-x-full absolute': !isToggleSidebar,
        })}
        onClick={() => dispatch(changeIsShowCasinoSearch(false))}
      >
        <div className="flex items-center h-[67px] px-[8px] py-[10px] gap-[30px] dark:bg-[#1D1E22]">
          <button
            className={cn(
              'sm:block hidden rounded-md dark:bg-[#16161B] bg-[#f6f7fa] dark:hover:bg-gray-800 text-gray-400 hover:text-[#000] dark:text-white flex items-center justify-center gap-[7px] px-[10px] py-[10px]',
            )}
            onClick={() => {
              dispatch(changeToggleSidebar(!isToggleSidebar));
            }}
          >
            <HambergerMenu size={18} className={cn('m-auto')} />
          </button>
          <Link href={'/'} className="hidden sm:flex items-center">
            <Image
              width={96}
              height={27}
              className="max-w-[96px] md:max-w-[none] md:max-h-[none] max-h-[27px]"
              src="/img/logo.png"
              alt="logo"
            />
          </Link>
        </div>
        <div className=" flex-1 md:w-full flex flex-col h-full py-5 px-[8px] overflow-auto">
          <div className="flex-1 w-full gap-[5px] flex flex-col">
            <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center gap-[5px]">
              <IconOption
                title={String(t('sidebar:bonus'))}
                href={ROUTER.Bonus}
                icon={Gift}
                classNames="dark:hover:text-white dark:text-color-text-primary text-[#31373D] hover:text-[#000] bg-[#F6F7FA] hover:bg-[#eaecf3] rounded px-[10px]"
              />
              <div className="flex items-center gap-[10px]">
                <IconOption
                  title={String(t('sidebar:quest'))}
                  href={ROUTER.Bonus}
                  icon={() => <Image height={30} width={30} src={'img/quest.png'} alt=""></Image>}
                  classNames="!bg-[#F6841B] gap-[5px] hover:opacity-[0.9] hover:text-white !text-white rounded pl-[10px] text-10-i font-bold flex-1"
                />
                <IconOption
                  title={String(t('sidebar:spin'))}
                  href={ROUTER.Bonus}
                  icon={() => <Image height={30} width={30} src={'img/spin.png'} alt=""></Image>}
                  classNames="!bg-color-primary gap-[5px] hover:opacity-[0.9] hover:text-white !text-white rounded pl-[10px] text-10-i font-bold flex-1"
                />
              </div>
              <IconOption
                title={String(t('sidebar:casino'))}
                href={''}
                icon={Notepad2}
                classNames="dark:hover:text-white dark:text-color-text-primary dark:focus:bg-[#292C33] text-[#31373D] bg-[#F6F7FA] hover:text-[#000] rounded"
                onClick={() => {
                  setShowDropDownCasino(!showDropDownCasino);
                  if (!(router.pathname === ROUTER.Casino)) router.push(ROUTER.Casino);
                }}
                isShowDropDown={showDropDownCasino ? true : false}
                isDropDown={true}
                data={dataDropDownCasino}
              />
              <IconOption
                title={String(t('sidebar:sports'))}
                href={ROUTER.Sports}
                icon={TrendUp}
                classNames="dark:hover:text-white dark:text-color-text-primary text-[#31373D] bg-[#F6F7FA] hover:bg-[#eaecf3]  hover:text-[#000] rounded pl-[10px]"
              />
              <IconOption
                title={String(t('sidebar:lottery'))}
                href={ROUTER.History}
                icon={Ticket}
                classNames="dark:hover:text-white dark:text-color-text-primary text-[#31373D] bg-[#F6F7FA] hover:bg-[#eaecf3]  hover:text-[#000] rounded pl-[10px]"
              />
              <IconOption
                title={String(t('sidebar:bingo'))}
                href={ROUTER.Bingo}
                icon={Award}
                classNames="dark:hover:text-white dark:text-color-text-primary text-[#31373D] bg-[#F6F7FA] hover:bg-[#eaecf3]  hover:text-[#000] rounded pl-[10px]"
              />
            </ul>
            <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center">
              <IconOption
                title={String(t('sidebar:vipClub'))}
                href={'#'}
                icon={Diamonds}
                classNames="dark:hover:text-white dark:text-color-text-primary text-[#31373D] bg-[#F6F7FA] hover:bg-[#eaecf3]  hover:text-[#000] rounded-t pl-[10px]"
                onClick={() => {
                  dispatch(changeIsShowVipClubModal(true));
                }}
              />
              <IconOption
                title={String(t('sidebar:exclusive'))}
                href={ROUTER.Exclusive}
                icon={Medal}
                classNames="dark:hover:text-white dark:text-color-text-primary text-[#31373D] bg-[#F6F7FA] hover:bg-[#eaecf3]  hover:text-[#000] rounded-none pl-[10px]"
              />
              <IconOption
                title={String(t('sidebar:affiliate'))}
                href={ROUTER.Affiliate}
                icon={Command}
                classNames="dark:hover:text-white dark:text-color-text-primary text-[#31373D] bg-[#F6F7FA] hover:bg-[#eaecf3]  hover:text-[#000] rounded-none pl-[10px]"
              />
              <IconOption
                title={String(t('sidebar:provablyFair'))}
                href={ROUTER.ProvablyFair}
                icon={Judge}
                classNames="dark:hover:text-white dark:text-color-text-primary text-[#31373D] bg-[#F6F7FA] hover:bg-[#eaecf3]  hover:text-[#000] rounded-b pl-[10px]"
              />
            </ul>
            <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center gap-[5px]">
              <IconOption
                title={String(t('sidebar:sponsorships'))}
                href={ROUTER.Sponsorships}
                icon={SecurityCard}
                classNames="dark:hover:text-white dark:text-color-text-primary text-[#31373D] bg-[#F6F7FA] hover:bg-[#eaecf3]  hover:text-[#000] rounded pl-[10px]"
              />
              <IconOption
                title={String(t('sidebar:liveSupport'))}
                href={ROUTER.LiveSupport}
                icon={Headphone}
                classNames="dark:hover:text-white dark:text-color-text-primary text-[#31373D] bg-[#F6F7FA] hover:bg-[#eaecf3]  hover:text-[#000] rounded pl-[10px]"
              />
            </ul>
            <div className="mt-[16px] text-color-text-primary rounded flex items-center justify-center gap-[5px]">
              <div
                className={cn(
                  `flex justify-center items-center flex-1 px-[15px] py-[10px] gap-[10px] rounded cursor-pointer`,
                  {
                    'bg-[#2D3035] text-white': mode === 0,
                    'text-[#31373D] bg-[#F6F7FA]': mode === 1,
                  },
                )}
                onClick={() => {
                  setMode(0);
                  setTheme('dark');
                }}
              >
                <Moon size={16} />
                <div className="text-sm">{t('layout:dark')}</div>
              </div>
              <div
                className={cn(
                  `flex justify-center items-center flex-1 px-[15px] py-[10px] gap-[10px] rounded cursor-pointer`,
                  {
                    'text-[#000]  bg-[#eaecf3]': mode === 1,
                    'hover:bg-gray-600': mode === 0,
                  },
                )}
                onClick={() => {
                  setMode(1);
                  setTheme('light');
                }}
              >
                <Sun1 size={16} />
                <div className="text-sm">{t('layout:light')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Small Sidebar */}
      <div
        className={cn('transition-transform h-full flex flex-col w-[62px]', {
          'translate-x-0': !isToggleSidebar,
          '-translate-x-full absolute': isToggleSidebar,
        })}
        onClick={() => dispatch(changeIsShowCasinoSearch(false))}
      >
        <div className="flex justify-center items-center min-h-[67px] px-[8px] py-[10px]">
          <button
            className={cn(
              'sm:block hidden rounded-md  dark:bg-[#25262B] dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white text-[#9FA5AC] bg-[#F6F7FA] hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[10px]',
            )}
            onClick={() => {
              dispatch(changeToggleSidebar(!isToggleSidebar));
            }}
          >
            <HambergerMenu size={18} className={cn('m-auto')} />
          </button>
        </div>
        <div className="flex-1 flex flex-col h-full pt-2 gap-[5px] overflow-y-auto">
          <Link
            href={ROUTER.Bonus}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-[#9FA5AC] bg-[#F6F7FA] hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
          >
            <Gift
              size={22}
              className={cn('m-auto', {
                'dark:text-white text-black': router.route.includes(ROUTER.Bonus),
              })}
            />
          </Link>
          <Link
            href={ROUTER.Bonus}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-[#9FA5AC] bg-[#F6F7FA] hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
          >
            <Image className="m-auto" height={30} width={30} src={'img/quest.png'} alt=""></Image>
          </Link>
          <Link
            href={ROUTER.Bonus}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-[#9FA5AC] bg-[#F6F7FA] hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
          >
            <Image className="m-auto" height={30} width={30} src={'img/spin.png'} alt=""></Image>
          </Link>
          <Link
            href={ROUTER.Casino}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-[#9FA5AC] bg-[#F6F7FA] hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
          >
            <Notepad2
              size={22}
              className={cn('m-auto', {
                'dark:text-white text-black': router.route.includes(ROUTER.Casino),
              })}
            />
          </Link>
          <Link
            href={ROUTER.Sports}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-[#9FA5AC] bg-[#F6F7FA] hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
          >
            <TrendUp
              size={22}
              className={cn('m-auto', {
                'dark:text-white text-black': router.route.includes(ROUTER.Sports),
              })}
            />
          </Link>
          <Link
            href={ROUTER.History}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-[#9FA5AC] bg-[#F6F7FA] hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
          >
            <Ticket
              size={22}
              className={cn('m-auto', {
                'dark:text-white text-black': router.route.includes(ROUTER.Lottery),
              })}
            />
          </Link>
          <Link
            href={ROUTER.Bingo}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-[#9FA5AC] bg-[#F6F7FA] hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
          >
            <Award
              size={22}
              className={cn('m-auto', {
                'dark:text-white text-black': router.route.includes(ROUTER.Bingo),
              })}
            />
          </Link>
          <button
            onClick={() => {
              dispatch(changeIsShowVipClubModal(true));
            }}
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-[#9FA5AC] bg-[#F6F7FA] hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
          >
            <Diamonds
              size={22}
              className={cn('m-auto', {
                'dark:text-white text-black': isShowVipClubModal,
              })}
            />
          </button>
          <Link
            href={ROUTER.Exclusive}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-[#9FA5AC] bg-[#F6F7FA] hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
          >
            <Medal
              size={22}
              className={cn('m-auto', {
                'dark:text-white text-black': router.route.includes(ROUTER.Exclusive),
              })}
            />
          </Link>
          <Link
            href={ROUTER.Affiliate}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-[#9FA5AC] bg-[#F6F7FA] hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
          >
            <Command
              size={22}
              className={cn('m-auto', {
                'dark:text-white text-black': router.route.includes(ROUTER.Affiliate),
              })}
            />
          </Link>
          <Link
            href={ROUTER.ProvablyFair}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-[#9FA5AC] bg-[#F6F7FA] hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
          >
            <Judge
              size={22}
              className={cn('m-auto', {
                'dark:text-white text-black': router.route.includes(ROUTER.ProvablyFair),
              })}
            />
          </Link>
          <Link
            href={ROUTER.Sponsorships}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-[#9FA5AC] bg-[#F6F7FA] hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
          >
            <SecurityCard
              size={22}
              className={cn('m-auto', {
                'dark:text-white text-black': router.route.includes(ROUTER.Sponsorships),
              })}
            />
          </Link>
          <Link
            href={ROUTER.LiveSupport}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-[#9FA5AC] bg-[#F6F7FA] hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
          >
            <Headphone
              size={22}
              className={cn('m-auto', {
                'dark:text-white text-black': router.route.includes(ROUTER.LiveSupport),
              })}
            />
          </Link>
        </div>
      </div>
    </>
  );
}
