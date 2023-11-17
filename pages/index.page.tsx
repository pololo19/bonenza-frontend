import React, { ReactElement, useEffect, useState } from 'react';
import Image from 'next/image';
import Slider, { Settings } from 'react-slick';
import cn from 'classnames';
import withAuth from '@/components/hoc/withAuth';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '../config/i18next';
import { AuthenticationModeEnum } from '@/base/types/common';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowDepositModal,
  changeIsShowCryptoOnlineModal,
  changeIsShowVipClubModal,
} from '@/base/redux/reducers/modal.reducer';
import { RootState } from '@/base/types/root-state';
import LoginWalletDashboard from '@/components/loginWalletDashboard/loginWalletDashboard';
import api from '@/api/api';
import { currencyFormat, exchangeByLocaleFiat, handleLocaleSymbol } from '../libs/utils';

import TopRateGameComponent from '@/components/homepage/topRateGame';
import RecentBigWinComponent from '@/components/homepage/recentBigWin';
import RecommendedGamesComponent from '@/components/homepage/recommendedGames';
import BaseLayout from '@/components/layouts/base.layout';
import CardPlay from '@/components/cards/cardPlay';
import LatestBetRace from '@/components/homepage/latestBetRace';
import HomepageSession from '@/components/homepage/homepageSession/homepageSession';
import styles from '@/styles/dashboard/index.module.scss';
import { BANNER_DATA, ROUTER, SETTING_BANNER } from '../constants/common';
import Link from 'next/link';
import { ArrowRight } from 'iconsax-react';
import { useRouter } from 'next/router';
import { GameDetail } from '../types/common';
import GameBannerSlider from '@/components/sliders/gameSliders';
import VipProgressComponent from '@/components/vipProgress/vipProgress';

function IndexPage() {
  const { t } = useTranslation('');

  const { isLogin, userName, localeFiat } = useSelector(
    (state: RootState) => ({
      isLogin: state.auth.isLogin,
      userName: state.auth.userName,
      localeFiat: state.common.localeFiat,
    }),
    shallowEqual,
  );

  const cardPlayData = [
    {
      imgBackGround: '/img/page/casino.jpg',
      title: t('homePage:introduceCardTitle1'),
      description: t('homePage:introduceCardDes1'),
      textButton: t('homePage:introduceCardButton1'),
      href: ROUTER.Casino,
    },
    {
      imgBackGround: '/img/page/sports.jpg',
      title: t('homePage:introduceCardTitle2'),
      description: t('homePage:introduceCardDes2'),
      textButton: t('homePage:introduceCardButton2'),
      href: ROUTER.Sports,
    },
  ];

  const dispatch = useDispatch();

  const [checkDeposit, setCheckDeposit] = useState(false);
  const [listRecommendedGame, setListRecommendedGame] = useState<GameDetail[]>([]);

  const handleCheckDeposit = async () => {
    try {
      const res = await api.get('deposit/get-all-deposit');
      setCheckDeposit(res.data.deposited);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const router = useRouter();

  const handleClickDeposit = () => {
    if (isLogin) {
      router.push(ROUTER.BuyCrypto);
    } else {
      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
      dispatch(changeIsShowAuthenticationModal(true));
    }
  };

  const handleGetListTopRated = async () => {
    try {
      const res = await api.get('game/get-top-rated-list', { params: { limit: 20 } });
      setListRecommendedGame(res.data.data);
    } catch (error) {
      setListRecommendedGame([]);
    } finally {
    }
  };

  useEffect(() => {
    handleGetListTopRated();
  }, []);

  useEffect(() => {
    if (!isLogin) return;
    handleCheckDeposit();
  }, [isLogin]);

  return (
    <>
      <div className="w-full">
        <div className="w-full flex items-start xl:flex-row flex-col pb-[25px] bg-[#f6f7fa] dark:bg-[#25262B]">
          <div className="flex-1 w-full">
            <div className="relative h-auto w-full">
              <div className="object-contain absolute right-0 h-full w-full">
                <Slider
                  slidesToShow={1}
                  className={cn('h-full slide-header sm:mx-[auto] mx-[-12px]')}
                  arrows={false}
                  autoplay={false}
                  autoplaySpeed={3000}
                >
                  <Image
                    width={0}
                    height={0}
                    className="sm:object-cover object-contain absolute right-0 w-full"
                    style={{ width: '100% !important' }}
                    src="/img/homepage-bg-5.png"
                    alt=""
                  />
                </Slider>
              </div>
              <div className="relative h-auto sm:pt-[60px] pt-[40%] sm:pb-[20px] w-full">
                {!isLogin && (
                  <div className="sm:text-start text-center font-semibold">
                    <div>
                      <span className="text-white font-bold text-[14px]">{String(t('homePage:signUpUpper'))} & </span>
                      <span className="text-[#F61B4F] text-[14px] font-bold">{String(t('homePage:getReward'))}</span>
                    </div>
                    <div className={'lg:text-[48px] sm:text-[32px] text-[24px] font-semibold sm:mt-5 mt-0'}>
                      <span className="text-white font-bold">{String(t('homePage:upTo'))} </span>
                      <span className={`${styles.textGradient} bg-primary font-bold`}>
                        {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                        {currencyFormat(
                          exchangeByLocaleFiat('VND', String(localeFiat?.currency || 'USD'), 500000000),
                          0,
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {isLogin && (
                  <div className="sm:text-start text-center">
                    <div className="text-white text-[14px] font-semibold">
                      {String(t('homePage:hello'))} {userName}! {String(t('homePage:welcomeAboard'))}
                    </div>
                    {!checkDeposit && (
                      <div>
                        <div className="sm:text-[28px] text-[20px] text-white font-bold mt-[6px]">
                          {String(t('homePage:firstDepositBonus'))}
                        </div>
                        <div className={`text-white sm:text-[48px] text-[32px] font-bold`}>
                          +180% <span className="font-bold">{String(t('homePage:reward'))}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex sm:flex-row flex-col items-center justify-start gap-[15px] sm:mt-[20px] mt-[10px]">
                  {!isLogin && (
                    <div className="flex flex-col sm:flex-row items-center gap-[10px]">
                      <button
                        type="button"
                        className="truncate text-white rounded-[5px] bg-primary flex items-center justify-center gap-[7px] px-[10px] py-[7px] xl:text-[14px] text-[12px] font-bold"
                        onClick={() => {
                          dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                          dispatch(changeIsShowAuthenticationModal(true));
                        }}
                      >
                        {t('homePage:signUpNow')}
                        <div className="p-[10px] items-center justify-center rounded-[5px] bg-white/20">
                          <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="" />
                        </div>
                      </button>
                      <div className="text-[16px] text-white">{t('homePage:or')}</div>
                    </div>
                  )}
                  {isLogin && (
                    <div>
                      {!checkDeposit && (
                        <div className="flex gap-[10px]">
                          <button
                            className="truncate text-white rounded-[5px] bg-primary flex items-center justify-center gap-[7px] sm:p-[7px] p-[10px] xl:text-[14px] text-[12px] font-bold"
                            onClick={() => dispatch(changeIsShowDepositModal(true))}
                          >
                            {String(t('homePage:depositAndPlay'))}
                            <div className="sm:p-[10px] p-[7px] items-center justify-center rounded-[5px] bg-white/20">
                              <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="" />
                            </div>
                          </button>
                          {/* <button
                            type="button"
                            className="truncate text-white rounded-[5px] bg-primary flex items-center justify-center gap-[7px] sm:p-[7px] p-[10px] xl:text-[14px] text-[12px] font-bold"
                          >
                            {String(t('homePage:freePlay'))}
                            <div className="sm:p-[10px] p-[7px] items-center justify-center rounded-[5px] bg-white/20">
                              <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="" />
                            </div>
                          </button> */}
                        </div>
                      )}
                      {checkDeposit && <VipProgressComponent />}
                    </div>
                  )}
                  {!isLogin && <LoginWalletDashboard onClose={() => {}} />}
                </div>
                <GameBannerSlider />
              </div>
            </div>

            <div className="flex flex-col items-start gap-[50px] bg-[#f6f7fa] dark:bg-[#25262B] bg">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-[16px] mt-[40px] w-full">
                {cardPlayData.map((item, index) => (
                  <CardPlay
                    key={index}
                    imgBackGround={item.imgBackGround}
                    title={item.title}
                    description={item.description}
                    textButton={item.textButton}
                    href={item.href}
                  />
                ))}
              </div>
              <RecentBigWinComponent />
              <TopRateGameComponent listRecommendedGame={listRecommendedGame} />
              <div className="bg-[url('/img/octopus.png')] relative w-full flex flex-col max-[857px]:pt-[20px] min-[858px]:flex-row items-center bg-no-repeat justify-between max-[857px]:bg-[length:100%_45%] bg-[length:100%_100%] rounded-[5px]">
                <div className="flex-1 flex items-center justify-center min-h-[105px]">
                  <Image
                    src={'/img/img-payment.png'}
                    width={382}
                    height={116}
                    className="max-[857px]:w-[60%] max-[857px]:py-[16px] min-[858px]:pr-5"
                    alt=""
                  />
                </div>
                <div className="py-[35px] max-sm:pt-[16px] w-full min-[858px]:pl-[56px] flex-1 min-[858px]:bg-[#1D1E2280] relative z-[1] md:backdrop-blur-[5px]">
                  <div className="min-[858px]:max-w-[362px] relative z-1 flex flex-col gap-[22px] max-[857px]:items-center">
                    <div className="sm:text-[20px] text-[16px] max-[857px]:max-w-[362px] max-[857px]:text-center">
                      {t('homePage:getStarted')} <span className="text-[#F61B4F]">300%</span> {t('bonus:depositBonus')}
                    </div>
                    <div
                      className="bg-[#F61B4F] rounded-[5px] text-center text-white py-[11px] w-[176px] hover:opacity-[0.9] cursor-pointer"
                      onClick={() => {
                        handleClickDeposit();
                      }}
                    >
                      {t('layout:deposit')}
                    </div>
                  </div>
                </div>
                <div className="max-[857px]:block hidden absolute top-[45%] left-0 w-full h-1/2 bg-[#1D1E22]"></div>
              </div>
              <HomepageSession title={String(t('homePage:latestBetRace'))} showIcon={false}>
                <LatestBetRace />
              </HomepageSession>
              <div className="relative w-full">
                <div className="md:hidden block absolute top-0 left-0 h-full w-full z-[1] bg-[#1D1E22]"></div>
                <div className="flex md:flex-row flex-col justify-between relative z-[2] min-[858px]:min-h-[230px] bg-no-repeat bg-[length:100%_50%] max-sm:bg-center sm:bg-[length:100%_100%] relative px-[20px] md:pl-[30px] md:bg-[url('/img/whale.png')]">
                  <div
                    className={`flex-col md:items-start items-center py-[32px] md:py-[40px] pr-5 gap-[24px] md:gap-[30px] ${
                      isLogin ? 'flex' : 'md:flex'
                    }`}
                  >
                    {!isLogin && (
                      <div>
                        <span className="text-[#0DFDE4] text-[18px] font-semibold">
                          {String(t('homePage:registerNow'))}{' '}
                        </span>
                        <span className="text-[18px] font-semibold text-white">
                          {String(t('homePage:toInstantlyRedeemA'))}{' '}
                          <span className="text-[#FD6E0B] text-[18px] font-semibold">300%</span>{' '}
                          {String(t('homePage:depositBonus'))}
                        </span>
                        <div className="text-[14px] text-[#939699] mt-5">{String(t('homePage:depositBonusUpTo'))}</div>
                      </div>
                    )}
                    {isLogin && (
                      <div className="text-[20px] font-semibold text-white">
                        {String(t('homePage:unlockExclusive'))} <span className="text-[#F61B4F]">VIP</span>{' '}
                        {String(t('homePage:rewardsAtBONENZA'))}
                        <div className="text-[14px] text-[#939699] mt-5">{String(t('homePage:onlyVIPClub'))}</div>
                      </div>
                    )}
                    <Image
                      width={100}
                      height={100}
                      className="w-full h-auto md:hidden max-h-[220px]"
                      alt=""
                      src="/img/mermaid-nobg.png"
                    />
                    {/* {!isLogin && (
                      <div className="flex flex-col items-center">
                        <Image
                          width={150}
                          height={160}
                          role="button"
                          src="/img/page/img-join.png"
                          alt=""
                          className="block md:hidden max-w-[150px] object-contain my-[15px]"
                          onClick={() => {
                            dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                            dispatch(changeIsShowAuthenticationModal(true));
                          }}
                        />
                        <div
                          onClick={() => {
                            dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                            dispatch(changeIsShowAuthenticationModal(true));
                          }}
                          className="cursor-pointer bg-[#F61B4F] hover:opacity-[0.9] text-white text-[14px] font-bold text-center h-[44px] w-full sm:max-w-[162px] rounded-[5px] py-[13px] sm:w-[162px]"
                        >
                          {String(t('homePage:signUp'))}
                        </div>
                      </div>
                    )} */}
                    {/* {isLogin && (
                      <div className="flex flex-col items-center">
                        <Image
                          width={344}
                          height={265}
                          role="button"
                          src="/img/page/cloud-money.png"
                          alt=""
                          className="block md:hidden max-w-[300px] object-contain lg:mr-[94px] my-[25px]"
                          onClick={() => {
                            dispatch(changeIsShowVipClubModal(true));
                          }}
                        />
                      </div>
                    )} */}
                    {isLogin && (
                      <div
                        onClick={() => {
                          dispatch(changeIsShowVipClubModal(true));
                        }}
                        className="cursor-pointer bg-[#F61B4F] hover:opacity-[0.9] hover:text-white text-white text-[14px] font-bold text-center h-[44px] w-full sm:max-w-[162px] rounded-[5px] py-[13px] sm:w-[162px]"
                      >
                        {t('referAndEarn:learnMore')}
                      </div>
                    )}
                  </div>
                  {/* {!isLogin && (
                    <Image
                      width={150}
                      height={160}
                      role="button"
                      src="/img/page/img-join.png"
                      alt=""
                      className="hidden md:block max-w-[150px] object-contain mr-[60px] lg:mr-[94px] my-[25px]"
                      onClick={() => {
                        dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                        dispatch(changeIsShowAuthenticationModal(true));
                      }}
                    />
                  )} */}
                  {/* {isLogin && (
                    <Image
                      width={344}
                      height={265}
                      role="button"
                      src="/img/page/cloud-money.png"
                      alt=""
                      className="hidden md:block max-w-[300px] object-contain mr-[60px] lg:mr-[94px] my-[25px]"
                      onClick={() => {
                        dispatch(changeIsShowVipClubModal(true));
                      }}
                    />
                  )} */}
                </div>
              </div>
              <RecommendedGamesComponent listRecommendedGame={listRecommendedGame} />
              <div className="">
                <div className="sm:py-[35px] py-[20px] lg:flex gap-[60px] rounded-[15px]">
                  <div className="lg:w-[50%]">
                    <div className="text-black dark:text-white text-[14px] font-semibold ">
                      {String(t('homePage:cryptoOnlineCasino'))}
                    </div>
                    <div
                      className="text-[#939699] text-[13px] mt-5 text-justify"
                      dangerouslySetInnerHTML={{ __html: t('homePage:casinosOnlineHaveNot') }}
                    ></div>
                    <div
                      className="text-[#939699] text-[13px] mt-5 text-justify"
                      dangerouslySetInnerHTML={{ __html: t('homePage:playersAreAlways') }}
                    ></div>
                    <div
                      className="mt-5 cursor-pointer flex items-center gap-[10px] dark:text-[#0DFDE4] text-amber-600"
                      onClick={() => {
                        dispatch(changeIsShowCryptoOnlineModal(true));
                      }}
                    >
                      <div className="text-13">{String(t('homePage:showMore'))}</div>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                  <div className="mt-[42px] lg:mt-0 lg:w-[50%]">
                    <div className="text-black dark:text-white text-center lg:text-left text-[14px] font-semibold mb-5">
                      {String(t('homePage:helpUsImproveYourExperience'))}
                    </div>
                    <textarea
                      className="rounded-[16px] dark:text-white bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-[#161D26] h-[100px] max-[414px]:placeholder:text-[10px] focus:outline-none w-full text-[#939699] text-[13px] p-[20px] resize-none placeholder:text-[13px] placeholder:text-[#53575C]"
                      placeholder={String(t('homePage:foundBug'))}
                    />
                    <div className="flex flex-col-reverse w-full lg:w-unset lg:flex-row items-center mt-5 gap-5">
                      <div className="hover:opacity-[0.9] bg-[#F61B4F] py-[10px] flex items-center justify-center text-white font-bold text-[14px] w-full lg:w-[162px] rounded-[5px] cursor-pointer">
                        {String(t('homePage:leaveAMessage'))}
                      </div>
                      <div className="text-[#939699] text-[12px]">{String(t('footer:nowGetReward'))}</div>
                    </div>
                    <div className="mt-5 text-center lg:text-left">
                      <span className="text-[13px] text-[#939699] mr-[10px]">{String(t('homePage:orEmail'))}</span>
                      <a
                        href="mailto:feedback@bonenza.com"
                        className="text-[13px] dark:text-[#0DFDE4] text-amber-600 hover:text-[#0DFDE4] cursor-pointer"
                      >
                        feedback@bonenza.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const IndexPageAuth = withAuth(IndexPage);

IndexPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default IndexPageAuth;
