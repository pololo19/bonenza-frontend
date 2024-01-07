import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowReferAndEarn,
  changeIsShowVipClubModal,
} from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

import ModalBusinessContacts from '../modal/businessContacts/businessContacts';
import ModalVerifyRepresentative from '../modal/verifyRepresentative/verifyRepresentative';

export default function Footer({ isDetailPage }: { isDetailPage?: boolean }) {
  const { t } = useTranslation('');
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

  return (
    <>
      <footer
        className={cn('pt-20 h-fit bg-white dark:bg-[#1B1C20]  ', {
          block: !isDetailPage,
          'sm:block hidden': isDetailPage,
        })}
      >
        <div className="container mx-auto px-4">
          <div
            className={cn('grid 2xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4', {
              'xl:grid-cols-3': showChatType,
              'xl:grid-cols-6': !showChatType,
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
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:casinoHome'))}
                </Link>
                <Link
                  href={ROUTER.Tagname('slots')}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:slots'))}
                </Link>
                <Link
                  href={ROUTER.Tagname('Live Casino')}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:liveCasino'))}
                </Link>
                <Link
                  href={ROUTER.Tagname('New Releases')}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:newReleases'))}
                </Link>
                <Link
                  href={ROUTER.HomeRecommend}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:recommended'))}
                </Link>
                <Link
                  href={ROUTER.Tagname('Table Games')}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:tableGame'))}
                </Link>
                <Link
                  href={ROUTER.Tagname('Blackjack')}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:blackJack'))}
                </Link>
                <Link
                  href={ROUTER.Tagname('Megaways')}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('casino:megaways'))}
                </Link>
              </div>
            </div>
            <div className="flex flex-col md:items-start items-center">
              <div className="flex gap-[10px] items-center mb-[10px]">
                <div className="w-[2px] h-[12px] bg-[#F61B4F]"></div>
                <div className="text-sm text-black dark:text-white font-semibold">{String(t('footer:sports'))}</div>
              </div>
              <div className="flex md:flex-col flex-row flex-wrap gap-[15px] items-start justify-center">
                <Link
                  href={ROUTER.Sports}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:sportsHome'))}
                </Link>
                <Link
                  href={ROUTER.LiveSupport}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:live'))}
                </Link>
                <Link
                  href={ROUTER.HelperTermsOfSports}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:rules'))}
                </Link>
              </div>
            </div>
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
                  className="text-[13px] cursor-pointer text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:vipClub'))}
                </div>
                <Link
                  href={ROUTER.Affiliate}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:affiliate'))}
                </Link>
                <Link
                  href={ROUTER.Promotion}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:promotions'))}
                </Link>
                <Link
                  href={ROUTER.Lottery}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:lottery'))}
                </Link>
                <div
                  onClick={() => {
                    isLogin ? dispatch(changeIsShowReferAndEarn(true)) : openModalLogin();
                  }}
                  className="text-[13px] cursor-pointer text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
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
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:helpCenter'))}
                </Link> */}
                <Link
                  href={ROUTER.HelperGambleAware}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:gambleAware'))}
                </Link>
                {/* <Link
                  href={ROUTER.Helper}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:fairness'))}
                </Link> */}
                {/* <Link
                  href={ROUTER.HelperFAQ}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:faq'))}
                </Link> */}
                <Link
                  href={ROUTER.HelperPrivacy}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:privacyPolicy'))}
                </Link>
                <Link
                  href={ROUTER.HelperTermsOfService}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:termsOfService'))}
                </Link>
                <Link
                  href={ROUTER.HelperSelfExclusion}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:selfExclusion'))}
                </Link>
                <Link
                  href={ROUTER.HelperAML}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:aml'))}
                </Link>
                {/* <Link
                  href={ROUTER.Home}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:app'))}
                </Link> */}
                <Link
                  href={ROUTER.LiveSupport}
                  className="text-[13px] text-[#31373d] dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:liveSupport'))}
                </Link>
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
                  className="text-[13px] text-[#31373d] cursor-pointer dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:businessContacts'))}
                </div>
                <div
                  onClick={() => setShowModalVerify(true)}
                  className="text-[13px] text-[#31373d] cursor-pointer dark:text-[#939699] hover:text-black dark:hover:text-white"
                >
                  {String(t('footer:verifyRepresentative'))}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:items-start items-center">
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
            <div className="mt-[30px] pt-[30px] flex flex-col items-center border-t border-solid border-[#25272C]">
              <div className="">
                <div className="font-semibold text-black dark:text-white sm:text-lg max-md:text-left text-[14px]">
                  {String(t('footer:acceptedNetworks'))}
                </div>
              </div>
              <div className="flex justify-center items-center max-md:gap-[16px] gap-[20px] mt-5 w-full">
                {/* <div className="max-w-[50px] max-h-[50px]">
                  <Image
                    alt=""
                    src="/img/icon/bitcoin-icon.png"
                    width={50}
                    height={50}
                    className="max-w-[50px] max-h-[50px] cursor-pointer"
                  />
                </div> */}
                <div className="max-w-[50px] max-h-[50px]">
                  <Image
                    alt=""
                    src="/img/icon/eth-icon.png"
                    width={50}
                    height={50}
                    className="max-w-[50px] max-h-[50px] cursor-pointer"
                  />
                </div>
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
                <div className="max-w-[50px] max-h-[50px]">
                  <Image
                    alt=""
                    src="/img/icon/trx-icon.png"
                    width={50}
                    height={50}
                    className="max-w-[50px] max-h-[50px] cursor-pointer"
                  />
                </div>
                <div className="max-w-[50px] max-h-[50px]">
                  <Image
                    alt=""
                    src="/img/icon/binance-icon.png"
                    width={50}
                    height={50}
                    className="max-w-[50px] max-h-[50px] cursor-pointer"
                  />
                </div>
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
            <div className="mt-[30px] pt-[30px] flex flex-col items-center border-t border-solid border-[#25272C]">
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
          <div className="mb-[60px] sm:mb-0 flex xl:flex-row flex-col justify-between sm:pt-[40px] pt-[20px] pb-[40px] md:mx-0 mx-[-1rem] gap-[70px] border-t border-solid border-[#25272C]">
            <div className="xl:w-full flex flex-col xl:items-start items-center justify-between">
              <Link href={'/'}>
                <Image height={54} width={170} src="/img/logo.png" alt="" className="object-cover" />
              </Link>
              <div className="dark:text-[#939699] text-[#31373d] text-[13px] mt-5 leading-[24px] xl:text-start text-center">
                {String(t('footer:aMultiAwardWinningCryptoCasino'))}
              </div>
            </div>
            {/* <div className="xl:w-[50%] flex flex-col xl:items-start items-center justify-end">
              <div
                className="dark:text-[#939699] text-[#31373d] text-[13px] mt-5 leading-[24px] xl:text-start text-center"
                dangerouslySetInnerHTML={{ __html: t('footer:BCGAMEAllRightsReserved') }}
              ></div>
            </div> */}
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
