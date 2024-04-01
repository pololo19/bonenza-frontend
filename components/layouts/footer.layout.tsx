import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowDepositModal,
  changeIsShowReferAndEarn,
  changeIsShowVipClubModal,
} from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

import ModalBusinessContacts from '../modal/businessContacts/businessContacts';
import ModalVerifyRepresentative from '../modal/verifyRepresentative/verifyRepresentative';

export default function Footer({ isDetailPage }: { isDetailPage?: boolean }) {
  const { t } = useTranslation('');
  const router = useRouter();
  const [showModalContacts, setShowModalContacts] = useState<boolean>(false);
  const [showModalVerify, setShowModalVerify] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { showChatType, isLogin } = useSelector(
    (state: AppState) => ({
      showChatType: state.modal.showChatType,
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const openModalLogin = () => {
    dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
    dispatch(changeIsShowAuthenticationModal(true));
  };
  const acceptedNetworks = [
    {
      icon: '/img/icon/eth-icon.png',
      network: 'ETH',
      token: 'ETH',
    },
    // {
    //   icon: '/img/icon/trx-icon.png',
    //   network: 'TRON',
    //   token: 'TRX',
    // },
    {
      icon: '/img/icon/binance-icon.png',
      network: 'BSC',
      token: 'BNB',
    },
    {
      icon: '/img/icon/polygon-icon.png',
      network: 'Polygon',
      token: 'MATIC',
    },
    {
      icon: '/img/icon/LTC.png',
      networkIcon: 'img/fiats/BNB.png',
      network: 'BSC',
      token: 'LTC',
    },
    {
      icon: '/img/icon/WBTC.png',
      networkIcon: 'img/fiats/BNB.png',
      network: 'BSC',
      token: 'WBTC',
    },
    {
      icon: '/img/icon/USDT-logo.svg',
      networkIcon: 'img/fiats/black_eth.png',
      network: 'ETH',
      token: 'USDT',
    },
    {
      icon: '/img/icon/USDC.png',
      networkIcon: 'img/fiats/BNB.png',
      network: 'BSC',
      token: 'USDC',
    },
    {
      icon: '/img/icon/DOGE.png',
      networkIcon: 'img/fiats/BNB.png',
      network: 'BSC',
      token: 'DOGE',
    },
    {
      icon: '/img/icon/SHIB.png',
      networkIcon: 'img/fiats/BNB.png',
      network: 'BSC',
      token: 'SHIB',
    },
    {
      icon: '/img/icon/XRP.png',
      networkIcon: 'img/fiats/BNB.png',
      network: 'BSC',
      token: 'XRP',
    },
    {
      icon: '/img/icon/DAI.png',
      networkIcon: 'img/fiats/BNB.png',
      network: 'BSC',
      token: 'DAI',
    },
  ];
  return (
    <>
      <footer
        className={cn('pt-20 h-fit bg-transparent', {
          block: !isDetailPage,
          'sm:block hidden': isDetailPage,
        })}
      >
        <div className="container mx-auto px-4">
          <div
            className={cn('grid 2xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4', {
              'xl:grid-cols-3': showChatType,
              'xl:grid-cols-4': !showChatType,
            })}
          >
            <div className="flex flex-col md:items-start items-center">
              <div className="flex gap-[10px] items-center mb-[10px]">
                <div className="w-[2px] h-[12px] bg-[#0DFDE4]"></div>
                <div className="text-sm text-black dark:text-white font-semibold ">{String(t('footer:casino'))}</div>
              </div>
              <div className="flex md:flex-col flex-row flex-wrap gap-[15px] items-start justify-center">
                <Link
                  href={ROUTER.Casino}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:casinoHome'))}
                </Link>
                <Link
                  href={ROUTER.Tagname('slots')}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:slots'))}
                </Link>
                <Link
                  href={ROUTER.Tagname('Racing')}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('layout:racing'))}
                </Link>
                <Link
                  href={ROUTER.Tagname('Live Casino')}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:liveCasino'))}
                </Link>
                <Link
                  href={ROUTER.Tagname('New Releases')}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:newReleases'))}
                </Link>
                <Link
                  href={ROUTER.HomeRecommend}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:recommended'))}
                </Link>
                <Link
                  href={ROUTER.Tagname('Table Games')}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:tableGame'))}
                </Link>
                <Link
                  href={ROUTER.Tagname('Blackjack')}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:blackJack'))}
                </Link>
                <Link
                  href={ROUTER.Tagname('Megaways')}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('casino:megaways'))}
                </Link>
              </div>
            </div>
            {/* Hiding Sports */}
            {/* <div className="flex flex-col md:items-start items-center">
              <div className="flex gap-[10px] items-center mb-[10px]">
                <div className="w-[2px] h-[12px] bg-[#F61B4F]"></div>
                <div className="text-sm text-black dark:text-white font-semibold">{String(t('footer:sports'))}</div>
              </div>
              <div className="flex md:flex-col flex-row flex-wrap gap-[15px] items-start justify-center">
                <Link
                  href={ROUTER.Sports}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:sportsHome'))}
                </Link>
                <Link
                  href={ROUTER.LiveSupport}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:live'))}
                </Link>
                <Link
                  href={ROUTER.HelperTermsOfSports}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:rules'))}
                </Link>
              </div>
            </div> */}
            <div className="flex flex-col md:items-start items-center">
              <div className="flex gap-[10px] items-center mb-[10px]">
                <div className="w-[2px] h-[12px] bg-[#F39717]"></div>
                <div className="text-sm text-black dark:text-white font-semibold">{String(t('footer:promo'))}</div>
              </div>
              <div className="flex md:flex-col flex-row flex-wrap gap-[15px] items-start justify-center">
                <div
                  onClick={() => {
                    isLogin ? dispatch(changeIsShowVipClubModal(true)) : openModalLogin();
                  }}
                  className="text-default cursor-pointer text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:vipClub'))}
                </div>
                <Link
                  href={ROUTER.Affiliate}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:affiliate'))}
                </Link>
                {/* <Link
                  href={ROUTER.Promotion}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:promotions'))}
                </Link> */}
                {/* <Link
                  href={ROUTER.Lottery}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:lottery'))}
                </Link> */}
                <div
                  onClick={() => {
                    isLogin ? dispatch(changeIsShowReferAndEarn(true)) : openModalLogin();
                  }}
                  className="text-default cursor-pointer text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:referAFriend'))}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:items-start items-center">
              <div className="flex gap-[10px] items-center mb-[10px]">
                <div className="w-[2px] h-[12px] bg-[#FD6E0B]"></div>
                <div className="text-sm text-black dark:text-white font-semibold">
                  {String(t('footer:supportLegal'))}
                </div>
              </div>
              <div className="flex md:flex-col flex-row flex-wrap gap-[15px] items-start justify-center">
                {/* <Link
                  href={ROUTER.HelperPrivacy}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:helpCenter'))}
                </Link> */}
                <Link
                  href={ROUTER.HelperGambleAware}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:gambleAware'))}
                </Link>
                {/* <Link
                  href={ROUTER.Helper}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:fairness'))}
                </Link> */}
                {/* <Link
                  href={ROUTER.HelperFAQ}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:faq'))}
                </Link> */}
                <Link
                  href={ROUTER.HelperPrivacy}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:privacyPolicy'))}
                </Link>
                <Link
                  href={ROUTER.HelperTermsOfService}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:termsOfService'))}
                </Link>
                <Link
                  href={ROUTER.HelperSelfExclusion}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:selfExclusion'))}
                </Link>
                <Link
                  href={ROUTER.HelperAML}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:aml'))}
                </Link>
                {/* <Link
                  href={ROUTER.Home}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:app'))}
                </Link> */}
                {/* <Link
                  href={ROUTER.LiveSupport}
                  className="text-default text-color-light-text-primary dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:liveSupport'))}
                </Link> */}
              </div>
            </div>
            <div className="flex flex-col md:items-start items-center">
              <div className="flex gap-[10px] items-center mb-[10px]">
                <div className="w-[2px] h-[12px] bg-[#20D4EB]"></div>
                <div className="text-sm text-black dark:text-white font-semibold">{String(t('footer:aboutUs'))}</div>
              </div>
              <div className="flex md:flex-col flex-row flex-wrap gap-[15px] items-start justify-center">
                <div
                  onClick={() => setShowModalContacts(true)}
                  className="text-default text-color-light-text-primary cursor-pointer dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:businessContacts'))}
                </div>
                <div
                  onClick={() => setShowModalVerify(true)}
                  className="text-default text-color-light-text-primary cursor-pointer dark:text-color-text-primary hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:verifyRepresentative'))}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:items-start items-center hidden">
              <div className="flex gap-[10px] items-center">
                <div className="w-[2px] h-[12px] bg-white"></div>
                <div className="text-sm text-black dark:text-white font-semibold">
                  {String(t('footer:joinOurCommunity'))}
                </div>
              </div>
              <div className="flex grid-cols-6 md:grid-cols-3 gap-4 mt-[15px]">
                {/* <div>
                  <Image
                    alt=""
                    src="/img/icon/telegram.png"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] cursor-pointer"
                  />
                </div> */}
                {/* <div>
                  <Image
                    alt=""
                    src="/img/icon/github.png"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] cursor-pointer"
                  />
                </div> */}
                <div>
                  <Image
                    alt=""
                    src="/img/icon/twitter.png"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] cursor-pointer"
                  />
                </div>
                {/* <div>
                  <Image
                    alt=""
                    src="/img/icon/facebook.png"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] cursor-pointer"
                  />
                </div> */}
                <div>
                  <Image
                    alt=""
                    src="/img/icon/discord.png"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] cursor-pointer"
                  />
                </div>
                {/* <div>
                  <Image
                    alt=""
                    src="/img/icon/bitcoin.png"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] cursor-pointer"
                  />
                </div> */}
              </div>
            </div>
          </div>
          {/* footer 2 */}
          {!isDetailPage && (
            <div className="mt-[30px] pt-[30px] flex flex-col items-center border-t border-solid dark:border-color-border-primary border-color-light-border-primary">
              <div className="">
                <div className="font-semibold text-black dark:text-white sm:text-lg max-md:text-left text-[14px]">
                  {String(t('footer:acceptedNetworks'))}
                </div>
              </div>
              <div className="w-full flex-wrap flex justify-center items-center max-md:gap-[16px] gap-[20px] mt-5">
                {acceptedNetworks.map((item, index) => (
                  <div className="max-w-[50px] max-h-[50px]" key={index}>
                    <div className="relative">
                      <Image
                        alt=""
                        src={item.icon}
                        width={50}
                        height={50}
                        className="max-w-[50px] max-h-[50px] cursor-pointer"
                        data-tooltip-id={`accepted-currency-${index}-tooltip`}
                      />
                      {item.networkIcon && (
                        <Image
                          alt=""
                          src={item.networkIcon}
                          width={50}
                          height={50}
                          className="bg-white rounded-full border-solid border-2 border-white absolute right-[0px] bottom-[0px] max-w-[20px] max-h-[20px]"
                        />
                      )}
                    </div>
                    <Tooltip
                      id={`accepted-currency-${index}-tooltip`}
                      place="bottom"
                      className="dark:bg-color-card-header-primary bg-white !rounded-large z-[10]"
                      opacity={100}
                      delayHide={0}
                      clickable
                    >
                      <div className="flex justify-center items-center w-[200px] gap-8 pt-3">
                        <Image
                          alt=""
                          src={item.icon}
                          width={50}
                          height={50}
                          className="max-w-[50px] max-h-[50px] cursor-pointer"
                        />
                        <div>
                          <div>{item.network}</div>
                          <div>{item.token}</div>
                        </div>
                      </div>
                      <Link
                        href={`?coin=${item.token}`}
                        className="mb-3 w-full mt-6 truncate text-white rounded-large bg-gradient-btn-play flex items-center justify-center gap-[7px] py-2 sm:p-[10px] p-[3px] text-default font-semibold"
                        onClick={(event: any) => {
                          if (isLogin) {
                            event.preventDefault();
                            dispatch(changeIsShowDepositModal(true));
                          } else {
                            dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                            dispatch(changeIsShowAuthenticationModal(true));
                          }
                        }}
                      >
                        {t('layout:deposit')}
                      </Link>
                      {/* <button type="button"></button> */}
                    </Tooltip>
                  </div>
                ))}

                {/* <div className="max-w-[50px] max-h-[50px]">
                  <Image
                    alt=""
                    src="/img/icon/xrp-icon.png"
                    width={50}
                    height={50}
                    className="max-w-[50px] max-h-[50px] cursor-pointer"
                  />
                </div>
                <div className="max-w-[50px] max-h-[50px]">
                  <Image
                    alt=""
                    src="/img/icon/ada-icon.png"
                    width={50}
                    height={50}
                    className="max-w-[50px] max-h-[50px] cursor-pointer"
                  />
                </div>
                <div className="max-w-[50px] max-h-[50px]">
                  <Image
                    alt=""
                    src="/img/icon/dot-icon.png"
                    width={50}
                    height={50}
                    className="max-w-[50px] max-h-[50px] cursor-pointer"
                  />
                </div> */}
                {/* <div className="max-w-[50px] max-h-[50px]">
                  <Image
                    alt=""
                    src="/img/icon/avax-icon.png"
                    width={50}
                    height={50}
                    className="max-w-[50px] max-h-[50px] cursor-pointer"
                  />
                </div>
                <div className="max-w-[50px] max-h-[50px]">
                  <Image
                    alt=""
                    src="/img/icon/sol-icon.png"
                    width={50}
                    height={50}
                    className="max-w-[50px] max-h-[50px] cursor-pointer"
                  />
                </div>
                <div className="max-w-[50px] max-h-[50px]">
                  <Image
                    alt=""
                    src="/img/icon/matic-icon.png"
                    width={50}
                    height={50}
                    className="max-w-[50px] max-h-[50px] cursor-pointer"
                  />
                </div>
                <div className="max-w-[50px] max-h-[50px]">
                  <Image
                    alt=""
                    src="/img/icon/bitcoin-icon.png"
                    width={50}
                    height={50}
                    className="max-w-[50px] max-h-[50px] cursor-pointer"
                  />
                </div>
                <div className="max-w-[50px] max-h-[50px]">
                  <Image
                    alt=""
                    src="/img/icon/eth-icon.png"
                    width={50}
                    height={50}
                    className="max-w-[50px] max-h-[50px] cursor-pointer"
                  />
                </div> */}
              </div>
            </div>
          )}
          {/* footer 3 */}
          {!isDetailPage && (
            <div className="mt-[30px] py-[30px] flex flex-col items-center border-t border-solid dark:border-color-border-primary border-color-light-border-primary">
              <div className="">
                <div className="font-semibold text-black dark:text-white max-md:text-center sm:text-lg text-[14px]">
                  {String(t('footer:sponsorshipAndGamingResponsibilities'))}
                </div>
              </div>
              <div
                className={cn('flex justify-center items-center grid-cols-3 gap-[20px] mt-5 w-full', {
                  'xl:grid-cols-3': showChatType,
                  'xl:grid-cols-6': !showChatType,
                })}
              >
                <div className="rounded-[15px] md:py-[36px] md:px-[40px] py-[15px] px-[20px] flex justify-center items-center bg-color-bg-primary">
                  <Link href="https://sigmaawards.org/" target="_blank">
                    <Image
                      alt=""
                      src="/img/sigma-logo.png"
                      width={50}
                      height={50}
                      className="object-contain w-auto h-[4rem] lg:h-[4.5rem]"
                    />
                  </Link>
                </div>
                {/* <div className="rounded-[15px] md:py-[36px] md:px-[40px] py-[15px] px-[20px] flex justify-center items-center">
                  <Link href="https://cloud9.gg/" target="_blank">
                    <Image
                      alt=""
                      src="/img/cloud9-logo.png"
                      width={73}
                      height={80}
                      className="object-contain w-[73px] h-[80px]"
                    />
                  </Link>
                </div>
                <div className="rounded-[15px] md:py-[36px] md:px-[40px] py-[15px] px-[20px] flex justify-center items-center">
                  <Link href="https://www.afa.com.ar/es/" target="_blank">
                    <Image
                      alt=""
                      src="/img/afa-logo.png"
                      width={53}
                      height={80}
                      className="object-contain w-[53px] h-[80px]"
                    />
                  </Link>
                </div>
                <div className="rounded-[15px] md:py-[36px] md:px-[40px] py-[15px] px-[20px] flex justify-center items-center">
                  <Link href="https://cryptogambling.org/" target="_blank">
                    <Image
                      alt=""
                      src="/img/crypto-logo.png"
                      width={100}
                      height={71}
                      className="object-contain w-[100px] h-[71px]"
                    />
                  </Link>
                </div>
                <div className="rounded-[15px] md:py-[36px] md:px-[40px] py-[15px] px-[20px] flex justify-center items-center">
                  <Link
                    href="http://www.itechlabs.com/certificates/BCGame/RNG_Certificate_UK_BCGame_ITL2002455_12Oct20.pdf"
                    target="_blank"
                  >
                    <Image
                      alt=""
                      src="/img/itech-labs-logo.png"
                      width={87}
                      height={100}
                      className="object-contain w-[87px] h-[100px]"
                    />
                  </Link>
                </div> */}
                <div className="rounded-[15px] md:py-[36px] md:px-[40px] py-[15px] px-[20px] flex justify-center items-center">
                  <Link href="https://www.responsiblegambling.org/" target="_blank">
                    <Image
                      alt=""
                      src="/img/responsible-gambling-logo.png"
                      width={120}
                      height={60}
                      className="object-contain w-[120px] h-[60px]"
                    />
                  </Link>
                </div>
              </div>
            </div>
          )}
          {/* footer 4 */}
          <div className={cn('flex flex-col gap-5 pb-[60px] sm:pb-4', { 'mt-[40px]': isDetailPage })}>
            <Image
              alt=""
              src="/img/logo-light.png"
              width={220}
              height={27}
              className="w-[220px] h-[44px] cursor-pointer"
            />
            <div className="text-default font-light">{String(t('footer:bonenzaDescription1'))}</div>
            <div className="flex flex-col gap-[10px] text-default font-light">
              <div className="flex gap-[5px]">
                {String(t('footer:business'))}
                <Link className="text-color-text-mailto" href={`mailto:${t('footer:businessMail')}`}>
                  {String(t('footer:businessMail'))}
                </Link>
              </div>
              <div className="flex gap-[5px]">
                {String(t('footer:help'))}
                <Link className="text-color-text-mailto" href={`mailto:${t('footer:helpMail')}`}>
                  {String(t('footer:helpMail'))}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {showModalContacts && (
        <ModalBusinessContacts
          show={showModalContacts}
          onClose={() => {
            setShowModalContacts(false);
          }}
        />
      )}
      {showModalVerify && (
        <ModalVerifyRepresentative
          show={showModalVerify}
          onClose={() => {
            setShowModalVerify(false);
          }}
        />
      )}
    </>
  );
}
