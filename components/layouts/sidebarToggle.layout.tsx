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
import { useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowCasinoSearch,
  changeIsShowVipClubModal,
  changeToggleSidebar,
} from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

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
import styles from './sidebar.module.scss';

export default function SidebarToggle() {
  const { setTheme, theme } = useTheme();
  const { t, i18n } = useTranslation('');
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

  const { isToggleSidebar, isShowVipClubModal, isLogin } = useSelector(
    (state: AppState) => ({
      isToggleSidebar: state.modal.isToggleSidebar,
      isShowVipClubModal: state.modal.isShowVipClubModal,
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const panel_1_datas = useMemo(
    () => [
      {
        title: String(t('sidebar:casino')),
        href: '',
        icon: Notepad2,
        smallIcon: (
          <Notepad2
            size={22}
            className={cn('m-auto', {
              'dark:text-white text-black': router.route.includes(ROUTER.Casino),
            })}
          />
        ),
        onClick: () => {
          setShowDropDownCasino(!showDropDownCasino);
          if (!(router.pathname === ROUTER.Casino)) router.push(ROUTER.Casino);
        },
        isShowDropDown: showDropDownCasino ? true : false,
        isDropDown: true,
        data: dataDropDownCasino,
      },
      {
        title: String(t('sidebar:sports')),
        href: ROUTER.Sports,
        icon: TrendUp,
        isDisabled: true,
        smallIcon: (
          <TrendUp
            size={22}
            className={cn('m-auto', {
              'dark:text-white text-black': router.route.includes(ROUTER.Sports),
            })}
          />
        ),
      },
      {
        title: String(t('sidebar:lottery')),
        href: ROUTER.History,
        icon: Ticket,

        isDisabled: true,
        smallIcon: (
          <Ticket
            size={22}
            className={cn('m-auto', {
              'dark:text-white text-black': router.route.includes(ROUTER.Lottery),
            })}
          />
        ),
      },
      {
        title: String(t('sidebar:bingo')),
        href: ROUTER.Bingo,
        icon: Award,

        isDisabled: true,
        smallIcon: (
          <Award
            size={22}
            className={cn('m-auto', {
              'dark:text-white text-black': router.route.includes(ROUTER.Bingo),
            })}
          />
        ),
      },
    ],
    [i18n.language, router.route, showDropDownCasino],
  );

  const panel_2_datas = useMemo(
    () => [
      {
        title: String(t('sidebar:vipClub')),
        href: '',
        icon: Diamonds,
        smallIcon: (
          <Diamonds
            size={22}
            className={cn('m-auto', {
              'dark:text-white text-black': isShowVipClubModal,
            })}
          />
        ),
        onClick: () => {
          if (!isLogin) {
            dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
            dispatch(changeIsShowAuthenticationModal(true));
          } else {
            dispatch(changeIsShowVipClubModal(true));
          }
        },
      },
      {
        title: String(t('sidebar:exclusive')),
        href: ROUTER.Exclusive,
        icon: Medal,

        isDisabled: true,
        smallIcon: (
          <Medal
            size={22}
            className={cn('m-auto', {
              'dark:text-white text-black': router.route.includes(ROUTER.Exclusive),
            })}
          />
        ),
      },
      {
        title: String(t('sidebar:affiliate')),
        href: ROUTER.Affiliate,
        icon: Command,
        smallIcon: (
          <Command
            size={22}
            className={cn('m-auto', {
              'dark:text-white text-black': router.route.includes(ROUTER.Affiliate),
            })}
          />
        ),
      },
      {
        title: String(t('sidebar:provablyFair')),
        href: ROUTER.ProvablyFair,
        icon: Judge,

        isDisabled: true,
        smallIcon: (
          <Judge
            size={22}
            className={cn('m-auto', {
              'dark:text-white text-black': router.route.includes(ROUTER.ProvablyFair),
            })}
          />
        ),
      },
    ],
    [isShowVipClubModal, i18n.language, router.route, isLogin],
  );

  const panel_3_datas = useMemo(
    () => [
      {
        title: String(t('sidebar:sponsorships')),
        href: ROUTER.Sponsorships,
        icon: SecurityCard,

        isDisabled: true,
        smallIcon: (
          <SecurityCard
            size={22}
            className={cn('m-auto', {
              'dark:text-white text-black': router.route.includes(ROUTER.Sponsorships),
            })}
          />
        ),
        onClick: () => {},
      },
      {
        title: String(t('sidebar:liveSupport')),
        href: ROUTER.LiveSupport,
        icon: Headphone,

        isDisabled: true,
        smallIcon: (
          <Headphone
            size={22}
            className={cn('m-auto', {
              'dark:text-white text-black': router.route.includes(ROUTER.LiveSupport),
            })}
          />
        ),
      },
    ],
    [i18n.language, router.route],
  );

  return (
    <>
      {/* Main Sidebar */}
      <div
        className={cn('transition-transform h-full flex flex-col w-[260px]', {
          'translate-x-0': isToggleSidebar,
          '-translate-x-full absolute': !isToggleSidebar,
        })}
        onClick={() => dispatch(changeIsShowCasinoSearch(false))}
      >
        <div className="flex items-center h-[67px] px-[8px] py-[10px] gap-[30px] dark:bg-[#1D1E22]">
          <button
            className={cn(
              'sm:block hidden rounded-md dark:bg-[#16161B] bg-color-light-bg-primary dark:hover:bg-gray-800 text-gray-400 hover:text-[#000] dark:text-white flex items-center justify-center gap-[7px] px-[14px] py-[14px]',
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
        <div className=" flex-1 md:w-full flex flex-col h-full pt-[20px] pb-[80px] px-[10px] overflow-auto">
          <div className="flex-1 w-full gap-[5px] flex flex-col">
            <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center gap-[5px]">
              <IconOption
                title={String(t('sidebar:bonus'))}
                href={ROUTER.Bonus}
                icon={Gift}
                isFontMedium
                fontWeight={600}
                classNames="dark:hover:text-white dark:text-color-text-primary text-color-light-text-primary hover:text-[#000] bg-color-light-bg-primary hover:bg-[#eaecf3] rounded px-[10px]"
              />
              <div className="flex items-center gap-[10px]">
                <IconOption
                  title={String(t('sidebar:quest'))}
                  href={'/#'}
                  icon={() => <Image height={30} width={30} src={'img/quest.png'} alt=""></Image>}
                  fontWeight={700}
                  classNames={cn(
                    'gap-[5px] hover:opacity-[0.9] hover:text-white rounded pl-[10px] py-[5px] text-10-i flex-1 dark:!text-color-text-primary !text-color-light-text-primary font-semibold',
                    styles.quest_btn,
                  )}
                />
                <IconOption
                  title={String(t('sidebar:spin'))}
                  href={'/#'}
                  icon={() => <Image height={30} width={30} src={'img/spin.png'} alt=""></Image>}
                  fontWeight={700}
                  classNames={cn(
                    'gap-[5px] hover:opacity-[0.9] hover:text-white rounded pl-[10px] py-[5px] text-10-i flex-1 dark:!text-color-text-primary !text-color-light-text-primary',
                    styles.spin_btn,
                  )}
                />
              </div>
              {panel_1_datas.map((item, index) => (
                <IconOption
                  key={index}
                  title={item.title}
                  href={item.href}
                  icon={item.icon}
                  classNames={
                    !!item.isDisabled
                      ? 'dark:text-color-text-primary text-color-light-text-primary bg-color-light-bg-primary cursor-not-allowed dark:hover:!bg-color-bg-primary dark:hover:!text-color-text-primary hover:!bg-color-light-bg-primary hover:!text-color-light-text-primary'
                      : 'dark:hover:text-white dark:text-color-text-primary text-color-light-text-primary bg-color-light-bg-primary hover:text-[#000]'
                  }
                  onClick={item.onClick}
                  isShowDropDown={item.isShowDropDown}
                  isDropDown={item.isDropDown}
                  isFontMedium
                  fontWeight={600}
                  data={item.data}
                />
              ))}
            </ul>
            <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center">
              {panel_2_datas.map((item, index) => (
                <IconOption
                  key={index}
                  title={item.title}
                  href={item.href}
                  icon={item.icon}
                  classNames={
                    !!item.isDisabled
                      ? 'dark:text-color-text-primary text-color-light-text-primary bg-color-light-bg-primary cursor-not-allowed dark:hover:!bg-color-bg-primary dark:hover:!text-color-text-primary hover:!bg-color-light-bg-primary hover:!text-color-light-text-primary'
                      : 'dark:hover:text-white dark:text-color-text-primary text-color-light-text-primary bg-color-light-bg-primary hover:text-[#000]'
                  }
                  isFontMedium
                  fontWeight={600}
                  onClick={item.onClick}
                />
              ))}
            </ul>
            <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center gap-[5px]">
              {panel_3_datas.map((item, index) => (
                <IconOption
                  key={index}
                  title={item.title}
                  href={item.href}
                  icon={item.icon}
                  isFontMedium
                  fontWeight={600}
                  classNames={
                    !!item.isDisabled
                      ? 'dark:text-color-text-primary text-color-light-text-primary bg-color-light-bg-primary cursor-not-allowed dark:hover:!bg-color-bg-primary dark:hover:!text-color-text-primary hover:!bg-color-light-bg-primary hover:!text-color-light-text-primary'
                      : 'dark:hover:text-white dark:text-color-text-primary text-color-light-text-primary bg-color-light-bg-primary hover:text-[#000]'
                  }
                />
              ))}
            </ul>
            <div className="mt-[16px] text-color-text-primary rounded flex items-center justify-center gap-[5px]">
              <div
                className={cn(
                  `flex justify-center items-center flex-1 px-[15px] py-[10px] gap-[10px] rounded cursor-pointer text-base`,
                  `dark:bg-[#2D3035] dark:text-white`,
                  `text-color-light-text-primary bg-color-light-bg-primary`,
                  `hover:bg-gray-300`,
                )}
                onClick={() => {
                  setTheme('dark');
                }}
              >
                <Moon size={16} />
                <div className="text-base font-bold">{t('layout:dark')}</div>
              </div>
              <div
                className={cn(
                  `flex justify-center items-center flex-1 px-[15px] py-[10px] gap-[10px] rounded cursor-pointer text-base font-bold`,
                  `bg-gray-300 text-color-light-text-primary`,
                  `dark:text-white dark:bg-transparent`,
                  `dark:hover:bg-[#2D3035]`,
                )}
                onClick={() => {
                  setTheme('light');
                }}
              >
                <Sun1 size={16} />
                <div className="text-base font-bold">{t('layout:light')}</div>
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
              'sm:block hidden rounded-md  dark:bg-[#25262B] dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white text-color-text-primary bg-color-light-bg-primary hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[10px]',
            )}
            onClick={() => {
              dispatch(changeToggleSidebar(!isToggleSidebar));
            }}
          >
            <HambergerMenu size={18} className={cn('m-auto')} />
          </button>
        </div>
        <div className="flex-1 flex flex-col h-full pt-2 gap-[5px]">
          <Link
            href={ROUTER.Bonus}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-color-text-primary bg-color-light-bg-primary hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
            data-tooltip-id={'bonus-tooltip'}
          >
            <Gift
              size={22}
              className={cn('m-auto', {
                'dark:text-white text-black': router.route.includes(ROUTER.Bonus),
              })}
            />
          </Link>
          <Tooltip id={'bonus-tooltip'} place="right" positionStrategy="fixed">
            <div>
              <p className="text-white">Bonus</p>
            </div>
          </Tooltip>
          <Link
            href={ROUTER.Bonus}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-color-text-primary bg-color-light-bg-primary hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
            data-tooltip-id={'quest-tooltip'}
          >
            <Image className="m-auto" height={30} width={30} src={'img/quest.png'} alt=""></Image>
          </Link>
          <Tooltip id={'quest-tooltip'} place="right" positionStrategy="fixed">
            <div>
              <p className="text-white">Quest</p>
            </div>
          </Tooltip>
          <Link
            href={ROUTER.Bonus}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-color-text-primary bg-color-light-bg-primary hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
            data-tooltip-id={'spin-tooltip'}
          >
            <Image className="m-auto" height={30} width={30} src={'img/spin.png'} alt=""></Image>
          </Link>
          <Tooltip id={'spin-tooltip'} place="right" positionStrategy="fixed">
            <div>
              <p className="text-white">Spin</p>
            </div>
          </Tooltip>

          {[...panel_1_datas, ...panel_2_datas, ...panel_3_datas].map((item, index) => (
            <>
              <Link
                key={index}
                href={item.href}
                type="button"
                className={cn(
                  'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-[#1D1E22] text-color-text-primary bg-color-light-bg-primary hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
                )}
                onClick={item?.onClick && item?.onClick}
                data-tooltip-id={`${item.title}-tooltip`}
              >
                {item.smallIcon}
              </Link>
              <Tooltip id={`${item.title}-tooltip`} place="right" positionStrategy="fixed" key={index}>
                <div>
                  <p className="text-white">{item.title}</p>
                </div>
              </Tooltip>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
