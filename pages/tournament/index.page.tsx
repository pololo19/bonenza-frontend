import { useTranslation } from '@/base/config/i18next';
import BaseLayout from '@/components/layouts/base.layout';
import Head from 'next/head';
import { ReactElement, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import CsrWrapper from '@/components/CsrWrapper';
import Countdown from 'react-countdown';
import styles from './index.module.scss';
import VectorIcon from '@/components/icons/VectorIcon';
import CommonModal from '@/components/modal/commonModal/commonModal';
import Link from 'next/link';
import { shallowEqual, useSelector } from 'react-redux';
import { AppState } from '@/base/redux/store';
import { ArrowRight2 } from 'iconsax-react';
import RocketIcon from '@/components/icons/RocketIcon';
import { currencyFormat1 } from '@/base/libs/utils';
import { Tooltip } from 'react-tooltip';

const prizes = [
  { img: '/img/tournament/prize-1.png', percent: 50 },
  { img: '/img/tournament/prize-2.png', percent: 15 },
  { img: '/img/tournament/prize-3.png', percent: 10 },
  { img: '/img/tournament/prize-4.png', percent: 7 },
  { img: '/img/tournament/prize-5.png', percent: 6 },
  { img: '/img/tournament/prize-6.png', percent: 4 },
  { img: '/img/tournament/prize-7.png', percent: 3 },
  { img: '/img/tournament/prize-8.png', percent: 2 },
  { img: '/img/tournament/prize-9.png', percent: 1.5 },
  { img: '/img/tournament/prize-10.png', percent: 1 },
  { img: '/img/tournament/prize-11.png', percent: 0.5 },
];

const prizeDetail = [
  { rank: 1, participants: 1000, prize: 18000 },
  { rank: 2 },
  { rank: 3 },
  { rank: 4 },
  { rank: 5 },
  { rank: 6 },
  { rank: 7 },
  { rank: 8 },
  { rank: 9 },
  { rank: 10 },
  { rank: 11 },
];

function TournamentPage() {
  const { t } = useTranslation('');
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isShowComing, setIsShowComing] = useState<boolean>(false);
  const { showChatType } = useSelector(
    (state: AppState) => ({
      showChatType: state.modal.showChatType,
    }),
    shallowEqual,
  );

  return (
    <>
      <div className="py-[24px]">
        <Head>
          <title>Tournament - Bonenza</title>
        </Head>
        <div className="relative">
          <Image
            src="/img/tournament/logo-back.png"
            width={1340}
            height={500}
            alt=""
            className="w-full object-contain rounded-default hidden lg:block"
          />
          <Image
            src="/img/tournament/logo-back-mobile.png"
            width={1340}
            height={500}
            alt=""
            className="w-[full] object-contain rounded-default block lg:hidden"
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 p-4 lg:p-0">
            <div className="flex justify-between flex-col-reverse lg:flex-row items-center h-full w-full">
              <div
                className={cn(
                  'flex flex-col items-center lg:items-start m-auto w-full lg:w-[42%] gap-3 sm:gap-7 lg:gap-2 xl:gap-7',
                  {
                    '2xl:w-[37%] 2xl:gap-7': !showChatType,
                    '2xl:w-[50%] 2xl:gap-2 min-[1720px]:gap-6': showChatType,
                  },
                )}
              >
                <div className="flex gap-2 border-solid border border-white rounded-full">
                  <span
                    className={cn('font-semibold px-5 py-2 rounded-full', {
                      'bg-white text-black': isRegistered,
                      'bg-transparent text-white': !isRegistered,
                    })}
                  >
                    {t('tournament:registered')}
                  </span>
                  <span
                    className={cn('font-semibold px-5 py-2 rounded-full', {
                      'bg-white text-black': !isRegistered,
                      'bg-transparent text-white': isRegistered,
                    })}
                  >
                    {t('tournament:nonRegistered')}
                  </span>
                </div>
                <div className="font-bold text-[20px] sm:text-[24px] text-white">{t('tournament:tournamentTitle')}</div>
                <div className="font-light text-[13px] 2xl:text-[16px] text-white">
                  {t('tournament:tournamentDescription')}
                </div>
                <div className="flex flex-col gap-2 w-full text-center lg:text-start">
                  <div className="font-normal text-default sm:text-[16px]">{t('tournament:tournamentEndsIn')}:</div>
                  <div className="flex flex-col lg:flex-row justify-start items-center gap-4">
                    <CsrWrapper>
                      <Countdown
                        date={isRegistered ? new Date() : new Date(2024, 6, 3)}
                        renderer={({ hours, minutes, seconds }) => (
                          <div className="flex items-start gap-2">
                            <div className="min-w-[50px]">
                              <div className="text-center text-white text-[32px] font-bold leading-8">
                                {hours < 10 ? '0' : ''}
                                {hours}
                              </div>
                              <div className="text-center text-gray-400 text-[10px] font-light">
                                {t('tournament:hours')}
                              </div>
                            </div>
                            <div className="text-center text-white text-[32px] font-normal leading-8">:</div>
                            <div className="min-w-[50px]">
                              <div className="text-center text-white text-[32px] font-bold leading-8">
                                {minutes < 10 ? '0' : ''}
                                {minutes}
                              </div>
                              <div className="text-center text-gray-400 text-[10px] font-light">
                                {t('tournament:minutes')}
                              </div>
                            </div>
                            <div className="text-center text-white text-[32px] font-normal leading-8">:</div>
                            <div className="min-w-[50px]">
                              <div className="text-center text-white text-[32px] font-bold leading-8">
                                {seconds < 10 ? '0' : ''}
                                {seconds}
                              </div>
                              <div className="text-center text-gray-400 text-[10px] font-light">
                                {t('tournament:seconds')}
                              </div>
                            </div>
                          </div>
                        )}
                      />
                    </CsrWrapper>
                    <div
                      className={cn(
                        'px-16 lg:px-3 2xl:px-10 py-3 rounded-default cursor-pointer uppercase font-semibold text-default sm:text-[16px]',
                        {
                          'bg-gradient-btn-secondary': isRegistered,
                          'bg-gradient-btn-play': !isRegistered,
                        },
                      )}
                      onClick={() => {
                        if (isRegistered === false) setIsShowComing(true);
                      }}
                    >
                      {isRegistered ? t('tournament:playNow') : t('tournament:registerNow')}
                    </div>
                  </div>
                </div>
              </div>
              <Image
                src="/img/tournament/logo.webp"
                width={650}
                height={600}
                alt=""
                className={cn('w-[80%] lg:w-auto lg:h-[360px] object-contain', {
                  'xl:h-[400px] 2xl:h-[540px] mr-[6%]': !showChatType,
                  '2xl:h-[360px] min-[1800px]:h-[450px]': showChatType,
                })}
              />
            </div>
          </div>
        </div>
        <div className="p-6 mt-8 bg-gradient-card-default rounded-default">
          <div className="text-center sm:text-left text-[20px] sm:text-[22px] font-bold w-full">
            {t('tournament:introduction')}
          </div>
          <div className=" mt-2 pb-2 grid grid-cols-11 gap-0 sm:gap-4 lg:gap-2">
            <div className="col-span-11 lg:col-span-3 flex gap-3 justify-center items-center">
              <div className="text-[48px] text-color-primary font-bold mr-6">1</div>
              <div className="flex flex-col">
                <div className="font-bold text-color-primary text-[16px] sm:text-[18px]">
                  {t('tournament:registration')}
                </div>
                <div className="mt-3 text-default">05/23 10:00~05/24 00:00 (UTC)</div>
              </div>
            </div>
            <div className="col-span-11 lg:col-span-1 flex justify-center items-center rotate-90 lg:rotate-0 text-color-primary">
              <ArrowRight2 className="w-10 h-10 font-extrabold" />
            </div>
            <div className="col-span-11 lg:col-span-3 flex gap-3 justify-center items-center">
              <div className="text-[48px] text-color-primary font-bold mr-6">2</div>
              <div className="flex flex-col">
                <div className="font-bold text-color-primary text-[16px] sm:text-[18px]">
                  {t('tournament:competition')}
                </div>
                <div className="mt-3 text-default">05/24 10:00~05/25 00:00 (UTC)</div>
              </div>
            </div>
            <div className="col-span-11 lg:col-span-1 flex justify-center items-center rotate-90 lg:rotate-0 text-color-primary">
              <ArrowRight2 className="w-10 h-10 font-extrabold" />
            </div>
            <div className="col-span-11 lg:col-span-3 flex gap-3 justify-center items-center">
              <div className="text-[48px] text-color-primary font-bold mr-6">3</div>
              <div className="flex flex-col">
                <div className="font-bold text-color-primary text-[16px] sm:text-[18px]">
                  {t('tournament:distribution')}
                </div>
                <div className="mt-3 text-default">05/25 00:00~05/26 00:00 (UTC)</div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn('mt-10 uppercase text-[40px] md:text[48px] xl:text-[64px] w-full text-center', styles.goldText)}
        >
          {t('tournament:prizePool')} 10,000 USDT
        </div>
        <div className="flex flex-col mt-8 gap-6">
          <div className="flex flex-col md:flex-row justify-evenly items-center uppercase gap-4">
            <div>
              <div className="text-title font-semibold">Current Eligible Participants</div>
              <div className="text-m_title font-extrabold text-[#FBFF4B] text-center">12890</div>
            </div>
            <div>
              <div className="text-title font-semibold">Current Prize Pool</div>
              <div className="text-m_title font-extrabold text-[#FBFF4B] text-center">
                {currencyFormat1(313000.0, 2)}
              </div>
            </div>
          </div>
          <div
            className={cn(
              'grid grid-cols-11 gap-[2px] sm:gap-2 w-[100%] sm:w-[80%] lg:w-[45%] m-auto',
              styles.barChart,
            )}
          >
            {prizeDetail.map((prize) => (
              <div key={`chart-${prize.rank}`} className="h-full relative">
                {prize.rank === 5 && (
                  <div className="flex justify-center absolute -top-8">
                    <RocketIcon />
                  </div>
                )}
                <div
                  className={cn('relative !min-h-full', styles['bar'], styles['normalBar'])}
                  data-tooltip-id={`bar-${prize.rank}`}
                >
                  <div
                    className={cn(
                      'absolute !bottom-0 !right-0 !left-0 !max-h-full',
                      styles['bar'],
                      prize.rank <= 5 ? styles['goldBar'] : '',
                      { 'top-0': prize.rank !== 5, 'top-[65%]': prize.rank === 5 },
                    )}
                  ></div>
                </div>
                <Tooltip
                  id={`bar-${prize.rank}`}
                  place="top"
                  className="dark:bg-black/0 bg-white z-[10]"
                  opacity={100}
                  offset={2}
                >
                  <div className={cn('max-w-[300px] p-4 rounded-large', styles['tooltip'])}>{prize.rank}</div>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 2xl:w-[70%] flex flex-wrap justify-center m-auto">
          {prizes.map((prize) => (
            <div key={prize.img} className="flex flex-col items-center font-bold text-m_title">
              <Image
                src={prize.img}
                width={150}
                height={150}
                alt=""
                className="w-[120px] h-[120px] lg:w-[150px] lg:h-[150px] object-contain"
              />
              {`${prize.percent}%`}
            </div>
          ))}
        </div>
        <div className="bg-gradient-card-violet mt-8 rounded-default p-5 lg:py-10 lg:px-16 shadow-inner shadow-white">
          <div className="text-m_title font-bold text-white">{t('tournament:eventRules')}</div>
          <div className="mt-4 text-default font-normal">
            <div className="text-[16px] font-semibold text-color-primary">{t('tournament:eligibility')}</div>
            <div className="mt-4 pl-4 flex flex-col gap-2">
              <div>1. {t('tournament:eligibilityDescription1')}</div>
              <div>2. {t('tournament:eligibilityDescription2')}</div>
            </div>
          </div>
          <div className="mt-4 text-default font-normal">
            <div className="text-[16px] font-semibold text-color-primary">{t('tournament:termsAndConditions')}</div>
            <div className="mt-4 pl-4 flex flex-col gap-2">
              {new Array(16).fill(0).map((_, index) => (
                <div key={`terms-conditions-${index}`} className="mb-2">
                  <span className="font-semibold text-[#FFC700]">{`${index + 1}. ${t(
                    'tournament:terms' + (index + 1).toString(),
                  )}: `}</span>
                  <span className="font-light">{`${t('tournament:conditions' + (index + 1).toString())}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CommonModal
        show={isShowComing}
        onClose={() => setIsShowComing(false)}
        panelClass="rounded-default sm:!max-w-[420px] !max-w-[300px] !mx-[10px] !h-[auto]"
        position="flex-col justify-center items-center"
        isCongrat
      >
        <div className="bg-gradient-card-modal relative flex flex-col items-center justify-center p-8 md:p-10 overflow-y-auto">
          <div className="text-[24px] md:text-[32px] text-white font-extrabold mb-4">{t('tournament:welcome')}</div>
          <Image width={80} height={41} className="w-[80px] object-contain" src="/img/logo-mobile.png" alt="logo" />
          <div className="mt-6 text-[16px] md:text-[18px] text-white text-center font-extralight">
            {t('tournament:announce')}
          </div>
          <Link
            className="mt-6 text-[16px] md:text-[18px] text-color-text-mailto text-center font-semibold"
            href={`mailto:support@bonenza.com`}
          >
            Bonenza Team
          </Link>
        </div>
      </CommonModal>
    </>
  );
}

TournamentPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default TournamentPage;
