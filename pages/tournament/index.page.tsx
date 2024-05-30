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

function TournamentPage() {
  const { t } = useTranslation('');
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  return (
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
            <div className="flex flex-col items-center lg:items-start m-auto w-full lg:w-[42%] 2xl:w-[37%] gap-3 sm:gap-7 lg:gap-2 xl:gap-7">
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
                      'px-16 lg:px-4 2xl:px-16 py-3 rounded-default cursor-pointer uppercase font-semibold text-default sm:text-[16px]',
                      {
                        'bg-gradient-btn-secondary': isRegistered,
                        'bg-gradient-btn-play': !isRegistered,
                      },
                    )}
                  >
                    {isRegistered ? t('tournament:playNow') : t('tournament:registerNow')}
                  </div>
                </div>
              </div>
            </div>
            <Image
              src="/img/tournament/logo.png"
              width={630}
              height={500}
              alt=""
              className="w-[80%] lg:w-auto lg:h-[400px] object-contain"
            />
          </div>
        </div>
      </div>
      <div className="p-6 mt-8 bg-gradient-card-default rounded-default">
        <span className="font-bold">{t('tournament:introduction')}</span>
        <div className="grid grid-cols-1 gap-20 mt-4 lg:grid-cols-3">
          <div className="flex gap-8">
            <div className="text-[40px] text-color-primary font-bold">1</div>
            <div className="flex flex-col">
              <div className="font-bold text-color-primary">{t('tournament:registration')}</div>
              <div className="mt-3 text-default">05/23 10:00~05/24 00:00 (UTC)</div>
            </div>
            <VectorIcon />
          </div>
          <div className="flex gap-8">
            <div className="text-[40px] text-color-primary font-bold">2</div>
            <div className="flex flex-col">
              <div className="font-bold text-color-primary">{t('tournament:competition')}</div>
              <div className="mt-3 text-default">05/24 10:00~05/25 00:00 (UTC)</div>
            </div>
            <VectorIcon />
          </div>
          <div className="flex gap-8">
            <div className="text-[40px] text-color-primary font-bold">3</div>
            <div className="flex flex-col">
              <div className="font-bold text-color-primary">{t('tournament:distribution')}</div>
              <div className="mt-3 text-default">05/25~05/26 00:00 (UTC)</div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn('mt-4 uppercase text-[40px] md:text[48px] xl:text-[64px] w-full text-center', styles.goldText)}
      >
        {t('tournament:prizePool')} 10,000 USDT
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
            {new Array(19).fill(0).map((_, index) => (
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
  );
}

TournamentPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default TournamentPage;
