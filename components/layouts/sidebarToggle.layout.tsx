import cn from 'classnames';
import {
  ArrowSwapVertical,
  Command,
  Cup,
  Diamonds,
  Gift,
  HambergerMenu,
  Headphone,
  Notepad2,
  Profile2User,
  SecurityCard,
} from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { api_getSpinAvailableCount } from '@/api/spin';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { casinoCategories, casinoGames } from '@/base/constants/config-menus';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowCasinoSearch,
  changeIsShowQuest,
  changeIsShowReferAndEarn,
  changeIsShowSpin,
  changeIsShowVipClubModal,
  changeToggleSidebar,
} from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

import IconOption from '../common/iconOption/iconOption';
import CsrWrapper from '../CsrWrapper';

export default function SidebarToggle() {
  const { t, i18n } = useTranslation('');
  const dispatch = useDispatch();
  const router = useRouter();
  const [showDropDownCasino, setShowDropDownCasino] = useState(false);
  const [spinCount, setSpinCount] = useState<number>(0);

  const { isToggleSidebar, isShowVipClubModal, isLogin, user, isShowSpin } = useSelector(
    (state: AppState) => ({
      isToggleSidebar: state.modal.isToggleSidebar,
      isShowVipClubModal: state.modal.isShowVipClubModal,
      isLogin: state.auth.isLogin,
      isShowSpin: state.modal.isShowSpin,
      user: state.auth.user,
    }),
    shallowEqual,
  );

  const getSpinAvailableCount = async () => {
    if (!user.userId) return;

    const res = await api_getSpinAvailableCount();
    const tempAvailableCount = res.data?.availableSpinCount || 0;
    setSpinCount(tempAvailableCount);
  };
  useEffect(() => {
    if (isLogin) {
      getSpinAvailableCount();
    }
  }, [isLogin, isShowSpin]);

  const panel_1_datas = useMemo(
    () => [
      {
        title: String(t('sidebar:casino')),
        key: 'casino',
        href: '/casino',
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
        isShowDropDown: false,
        isDropDown: true,
        data: [...casinoCategories, ...casinoGames],
      },

    ],
    [i18n.language, router.route, showDropDownCasino],
  );

  const panel_2_datas = useMemo(
    () => [

      {
        title: "UP & DOWN",
        href: 'https://bitup.game/trade',
        icon: ArrowSwapVertical,
        smallIcon: (
          <ArrowSwapVertical
            size={22}
            className={cn('m-auto', {
              'dark:text-white text-black': router.route.includes(ROUTER.Tagname('racing')),
            })}
          />
        ),
        isShowDropDown: false,
        isDropDown: false,
      },
      {
        title: String(t('sidebar:vipClub')),
        href: '',
        key: 'vipClub',
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
        title: String(t('sidebar:affiliate')),
        href: ROUTER.Affiliate,
        key: 'affiliate',
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
    ],
    [isShowVipClubModal, i18n.language, router.route, isLogin],
  );

  return (
    <>
      {/* Main Sidebar */}
      <div
        className={cn('transition-transform h-full flex flex-col w-[244px]', {
          'translate-x-0': isToggleSidebar,
          '-translate-x-full absolute': !isToggleSidebar,
        })}
        onClick={() => dispatch(changeIsShowCasinoSearch(false))}
      >
        <div className="flex items-center h-[67px] px-[8px] py-[10px] gap-[10px] dark:bg-color-header-secondary">
          <button
            className={cn(
              'sm:block hidden rounded-md dark:bg-color-header-secondary bg-color-light-bg-primary dark:hover:bg-gray-800 text-gray-400 hover:text-[#000] dark:text-white flex items-center justify-center gap-[7px] px-[14px] py-[14px]',
            )}
            onClick={() => {
              dispatch(changeToggleSidebar(!isToggleSidebar));
            }}
          >
            <HambergerMenu size={18} className={cn('m-auto')} />
          </button>
          <Link href={'/'} className="items-center hidden sm:flex">
            <Image
              width={158}
              height={31}
              className="w-[158px] md:max-w-[none] md:max-h-[none] h-[31px]"
              src="/img/logo.png"
              alt="logo"
            />
          </Link>
        </div>
        <div className=" flex-1 md:w-full flex flex-col h-full pt-[20px] pb-[80px] px-[12px] overflow-auto">
          <div className="flex-1 w-full gap-[5px] flex flex-col">
            <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center gap-[10px]">
              <CsrWrapper key={'bonus'}>
                <IconOption
                  imageURL="/img/sidebar/bonus.png"
                  imageClass="absolute left-[16px] -top-[18px] w-[69px] h-[61px]"
                  textClass="!text-white ml-[64px] !text-[15px] !font-[400] !font-bold"
                  title={String(t('sidebar:bonus'))}
                  href={ROUTER.Bonus}
                  icon={Gift}
                  isFontMedium
                  fontWeight={600}
                  activeClassNames="!h-[45px] !py-[10px] !text-white bg-gradient-to-t from-[#005B52] to-[#0DFDE4] hover:opacity-90 rounded-[100px] px-[10px]"
                  classNames="!h-[45px] !py-[10px] bg-gradient-to-t from-[#005B52] to-[#0DFDE4] hover:opacity-90 rounded-[100px] px-[10px]"
                />
              </CsrWrapper>

              <div className="flex items-center gap-[5px] mt-[10px]">
                <CsrWrapper key="quest">
                  <IconOption
                    imageURL="/img/sidebar/quest.png"
                    imageClass="absolute -left-[5px] -top-[13px] w-[43px] h-[43px]"
                    textClass="text-white ml-auto !text-[13px] !text-center font-semibold pl-[8px] dark:!text-white"
                    title={String(t('sidebar:quest'))}
                    href={''}
                    icon={Gift}
                    isFontMedium
                    fontWeight={700}
                    onClick={() => {
                      if (!isLogin) {
                        dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                        dispatch(changeIsShowAuthenticationModal(true));
                      } else {
                        dispatch(changeIsShowQuest(true));
                      }
                    }}
                    classNames="h-[40px] bg-gradient-to-tl from-indigo-950 to-violet-700 hover:opacity-90 px-[10px] pr-[4px]"
                  />
                </CsrWrapper>
                <CsrWrapper key="spin">
                  <IconOption
                    imageURL="/img/sidebar/spin.png"
                    count={isLogin ? spinCount : 0}
                    imageClass="absolute -left-[5px] -top-[13px] w-[41px] h-[41px]"
                    textClass="text-white ml-auto !text-[13px] !text-center font-semibold pl-[15px] dark:!text-white"
                    title={String(t('sidebar:spin'))}
                    href={''}
                    icon={Gift}
                    isFontMedium
                    fontWeight={600}
                    onClick={() => dispatch(changeIsShowSpin(true))}
                    classNames="h-[40px] !text-white bg-gradient-to-tl from-indigo-950 to-violet-700 hover:opacity-90 px-[10px] pr-[4px]"
                  />
                </CsrWrapper>
              </div>
              <CsrWrapper key="master">
                <Link href={ROUTER.Master}>
                  <Image
                    width={480}
                    height={121}
                    src="/img/tournament/sidebar.png"
                    alt="tournament"
                    className="object-contain rounded-md"
                  />
                </Link>
              </CsrWrapper>
              {isLogin &&
                <CsrWrapper key="refer">
                  <Image
                    width={480}
                    height={121}
                    src="/img/refer.png"
                    alt="refer"
                    priority
                    className="object-contain rounded-md cursor-pointer"
                    onClick={() => dispatch(changeIsShowReferAndEarn(true))}
                  />
                </CsrWrapper>
              }
              {panel_1_datas.map((item, index) => (
                <CsrWrapper key={index}>
                  <IconOption
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                    classNames={
                      'dark:hover:text-white dark:text-color-text-primary text-color-light-text-primary bg-color-light-bg-primary hover:text-[#000]'
                    }
                    onClick={item.onClick}
                    isShowDropDown={item.isShowDropDown}
                    isDropDown={item.isDropDown}
                    isFontMedium
                    fontWeight={400}
                    data={item.data}
                  />
                </CsrWrapper>
              ))}
            </ul>
            <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center gap-[10px]">
              {panel_2_datas.map((item, index) => (
                <CsrWrapper key={index}>
                  <IconOption
                    key={index}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                    classNames={
                      'dark:hover:text-white dark:text-color-text-primary text-color-light-text-primary hover:text-[#000]'
                    }
                    isFontMedium
                    fontWeight={400}
                    onClick={item.onClick}
                  />
                </CsrWrapper>
              ))}
            </ul>

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
              'sm:block hidden rounded-md  dark:bg-color-hover-primary dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white text-color-text-primary bg-color-light-bg-primary hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[10px]',
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
            key={`bonus-small`}
            href={ROUTER.Bonus}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-color-hover-primary text-color-text-primary bg-color-light-bg-primary hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
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
          <Tooltip id={'bonus-tooltip'} place="right" positionStrategy="fixed" key={`bonus_tooltip-small`}>
            <div>
              <p className="text-white">Bonus</p>
            </div>
          </Tooltip>

          <div className="w-full" key="quest-small">
            <div
              role="button"
              key={'quest-small'}
              className="sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-color-hover-primary text-color-text-primary bg-color-light-bg-primary hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]"
              data-tooltip-id={'quest-tooltip'}
              onClick={() => dispatch(changeIsShowQuest(true))}
            >
              <Image className="m-auto" height={30} width={30} src={'img/sidebar/quest.png'} alt=""></Image>
            </div>
            <Tooltip id={'quest-tooltip'} place="right" positionStrategy="absolute">
              <div>
                <p className="text-white">Quest</p>
              </div>
            </Tooltip>
          </div>
          <div className="w-full" key="spin-small">
            <div
              role="button"
              id="spin-small"
              className="sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-color-hover-primary text-color-text-primary bg-color-light-bg-primary hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]"
              data-tooltip-id={'spin-tooltip'}
              onClick={() => dispatch(changeIsShowSpin(true))}
            >
              <Image className="m-auto" height={30} width={30} src={'img/sidebar/spin.png'} alt=""></Image>
            </div>
            <Tooltip id={'spin-tooltip'} place="right" positionStrategy="absolute">
              <div>
                <p className="text-white">Spin</p>
              </div>
            </Tooltip>
          </div>
          <Link
            key={`masters-small`}
            href={ROUTER.Master}
            type="button"
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-color-hover-primary text-color-text-primary bg-color-light-bg-primary hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
            data-tooltip-id={'masters-tooltip'}
          >
            <Cup
              size={22}
              className={cn('m-auto', {
                'dark:text-white text-black': router.route.includes(ROUTER.Master),
              })}
              variant="Bulk"
            />
          </Link>
          <Tooltip id={'masters-tooltip'} place="right" positionStrategy="fixed" key={`masters-tooltip-small`}>
            <div>
              <p className="text-white">{t('sidebar:master')}</p>
            </div>
          </Tooltip>
          <div
            key={`refer-small`}
            className={cn(
              'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-color-hover-primary text-color-text-primary bg-color-light-bg-primary hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
            )}
            data-tooltip-id={'refer-tooltip'}
            onClick={() => dispatch(changeIsShowReferAndEarn(true))}
          >
            <Profile2User
              size={22}
              className={cn('m-auto', {
                'dark:text-white text-black': router.route.includes(ROUTER.Master),
              })}
              variant="Bulk"
            />
          </div>
          <Tooltip id={'refer-tooltip'} place="right" positionStrategy="fixed" key={`refer-tooltip-small`}>
            <div>
              <p className="text-white">{t('layout:referAndEarn')}</p>
            </div>
          </Tooltip>
          {panel_1_datas.map((item, index) => (
            <div className="w-full" key={`${index}-${item.title}`}>
              <Link
                href={item.href}
                type="button"
                className={cn(
                  'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-color-hover-primary text-color-text-primary bg-color-light-bg-primary hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
                )}
                onClick={item?.onClick && item?.onClick}
                data-tooltip-id={`${item.title}-tooltip`}
              >
                {item.smallIcon}
              </Link>
              <Tooltip id={`${item.title}-tooltip`} place="right" positionStrategy="fixed">
                <div>
                  <p className="text-white">{item.title}</p>
                </div>
              </Tooltip>
            </div>
          ))}
          {[...casinoCategories, ...casinoGames].map((item, index) => {
            const IconElement = item.icon;
            return (
              <div className="w-full" key={`${index}-${item.title}`}>
                <Link
                  href={item.href}
                  type="button"
                  className={cn(
                    'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-color-hover-primary text-color-text-primary bg-color-light-bg-primary hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
                  )}
                  data-tooltip-id={`${item.title}-tooltip`}
                >
                  <IconElement
                    size={22}
                    className={cn('m-auto', {
                      'dark:text-white text-black': router.route.includes(ROUTER.Casino),
                    })}
                  />
                </Link>
                <Tooltip id={`${item.title}-tooltip`} place="right" positionStrategy="fixed">
                  <div>
                    <p className="text-white">{String(t(item.title))}</p>
                  </div>
                </Tooltip>
              </div>
            );
          })}
          {panel_2_datas.map((item, index) => (
            <div className="w-full" key={`${index}-${item.title}`}>
              {item.href === '' && (
                <div
                  role="button"
                  className={cn(
                    'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-color-hover-primary text-color-text-primary bg-color-light-bg-primary hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
                  )}
                  onClick={item?.onClick && item?.onClick}
                  data-tooltip-id={`${item.title}-tooltip`}
                >
                  {item.smallIcon}
                </div>
              )}
              {item.href && (
                <Link
                  href={item.href}
                  type="button"
                  className={cn(
                    'sm:block hidden rounded dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:bg-color-hover-primary text-color-text-primary bg-color-light-bg-primary hover:bg-[#eaecf3] hover:text-[#000] flex items-center justify-center gap-[7px] px-[10px] py-[15px]',
                  )}
                  onClick={item?.onClick && item?.onClick}
                  data-tooltip-id={`${item.title}-tooltip`}
                >
                  {item.smallIcon}
                </Link>
              )}
              <Tooltip id={`${item.title}-tooltip`} place="right" positionStrategy="fixed">
                <div>
                  <p className="text-white">{item.title}</p>
                </div>
              </Tooltip>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
