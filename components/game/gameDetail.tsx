import cn from 'classnames';
import { ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { GameListType, GameProviderDetail } from '@/base/types/common';

import CasinoSS from '../casino/casinoSS';
import GameCard from '../gameCard/gameCard';
import AllBetsTableComponent from '../gameTable/allBetsTable';
import HighRollerTableComponent from '../gameTable/highRollerTable';
import MyBetsTableComponent from '../gameTable/myBetsTable';
import WagerContestComponent from '../gameTable/wagerContest';
import styles from './index.module.scss';

const GameDetailComponent = ({
  gameDetail,
  gameProvider,
}: {
  gameDetail?: GameListType;
  gameProvider?: GameProviderDetail;
}) => {
  const [openTab, setOpenTab] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listRelatedGame, setListRelatedGame] = useState<GameListType[]>([]);

  const { t } = useTranslation('');

  const handleGetListGame = async () => {
    try {
      setIsLoading(true);
      // const res = await api.get('game/get-related-list', {
      //   params: { limit: '0', game_id: gameDetail?.id },
      // });
      // setListRelatedGame(res.data.data);
    } catch (error) {
      setListRelatedGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetListGame();
  }, []);

  return (
    <div>
      <div className="mb-[10px] dark:text-white text-[#000] sm:text-[16px] text-[14px]">
        {t('homePage:latestBetRace')}
      </div>
      <div className="w-full h-full rounded-[5px] dark:bg-color-header-primary bg-white relative">
        <div className="grid grid-cols-4 justify-center w-full rounded-full md:text-[13px] text-[11px] font-semibold p-[8px]  md:pt-[16px] md:pl-[30px]">
          <div
            role="button"
            onClick={() => setOpenTab(1)}
            className={cn(
              'inline-block md:text-[14px] sm:text-[12px] text-[10px] md:px-6 sm:px-4 px-2 py-3 dark:hover:bg-color-card-header-primary dark:hover:text-white bg-transparent dark:text-[rgba(255,255,255,0.5)] bg-color-light-bg-primary text-[#31373D] hover:text-[#000] text-center',
              {
                'dark:text-white dark:!bg-color-card-header-active !bg-color-light-active-primary text-black font-semibold':
                  openTab === 1,
              },
            )}
          >
            {t('gameTable:allBets')}
          </div>
          <div
            role="button"
            onClick={() => setOpenTab(2)}
            className={cn(
              'inline-block md:text-[14px] sm:text-[12px] text-[10px] md:px-6 sm:px-4 px-2 py-3 dark:hover:bg-color-card-header-primary dark:hover:text-white bg-transparent dark:text-[rgba(255,255,255,0.5)] text-[#31373D] hover:text-[#000] text-center',
              {
                'dark:text-white dark:!bg-color-card-header-active !bg-color-light-active-primary text-black font-semibold':
                  openTab === 2,
              },
            )}
          >
            {t('gameTable:myBets')}
          </div>
          <div
            role="button"
            onClick={() => setOpenTab(3)}
            className={cn(
              'inline-block md:text-[14px] sm:text-[12px] text-[10px] md:px-6 sm:px-4 px-2 py-3 dark:hover:bg-color-card-header-primary dark:hover:text-white bg-transparent dark:text-[rgba(255,255,255,0.5)] text-[#31373D] hover:text-[#000] text-center',
              {
                'dark:text-white dark:!bg-color-card-header-active !bg-color-light-active-primary text-black font-semibold':
                  openTab === 3,
              },
            )}
          >
            {t('gameTable:highRoller')}
          </div>
          <div
            role="button"
            onClick={() => setOpenTab(4)}
            className={cn(
              'inline-block md:text-[14px] sm:text-[12px] text-[10px] md:px-6 sm:px-4 px-2 py-3 dark:hover:bg-color-card-header-primary dark:hover:text-white bg-transparent dark:text-[rgba(255,255,255,0.5)] text-[#31373D] hover:text-[#000] text-center',
              {
                'dark:text-white dark:!bg-color-card-header-active !bg-color-light-active-primary text-black font-semibold':
                  openTab === 4,
              },
            )}
          >
            {t('gameTable:wagerContest')}
          </div>
        </div>
        <div className="px-[8px] md:px-[30px] pt-[-4px] md:pt-[3px] z-[2] w-full">
          <div className="md:text-[13px] text-[12px] max-[430px]:text-[10px] text-[#939699]">
            {openTab === 1 && <AllBetsTableComponent gameDetail={gameDetail} />}
            {openTab === 2 && <MyBetsTableComponent gameDetail={gameDetail} />}
            {openTab === 3 && <HighRollerTableComponent />}
            {openTab === 4 && <WagerContestComponent />}
          </div>
        </div>
      </div>
      <div className="mt-[36px]">
        {/* <CasinoSS
          title={String(t('gameDetail:relatedGames'))}
          data={listRelatedGame}
          renderItem={(item) => <GameCard gameDetail={item} />}
          viewAllUrl={ROUTER.PicksForYou}
        /> */}
      </div>

      <div className="mt-[36px]">
        <div className="text-[18px] font-semibold dark:text-[#FFFFFF] text-[#31373D]">
          {t('gameDetail:aboutTheProvider')}
        </div>
        <div>
          <div className="dark:bg-color-card-body-secondary bg-white p-[15px] rounded-[5px] mt-[10px] mb-[30px]">
            <div className="mb-[15px] ml-[15px]">
              <Image
                height={0}
                width={0}
                src={`https://cdn.softswiss.net/logos/providers/color/${gameDetail?.provider}.svg`}
                alt="game logo"
                className="object-cover max-h-[50px] w-auto rounded-[5px]"
              />
            </div>
            <div
              className={cn('whitespace-pre-line mb-[15px] text-gray-400 text-[12px]', styles.providerSortIntroduction)}
            >
              {gameProvider?.introduction}
            </div>
            <div className="flex items-center gap-[10px]">
              <Link
                href={ROUTER.Provider(String(gameDetail?.identifier))}
                className="flex dark:bg-color-card-header-active dark:hover:bg-color-card-body-hover text-black dark:text-white items-center p-[10px] justify-between rounded-[5px] gap-[5px] border dark:border-0 border-solid border-[#DADDE6]"
                role="button"
              >
                <div className="text-[12px] dark:text-[#FFFFFF] text-[#31373D] hover:text-[#000] font-bold">
                  {gameDetail?.gameCnt} {t('provider:games')}
                </div>
                <ArrowRight2 size={12} />
              </Link>
              <Link
                href={ROUTER.Provider(String(gameDetail?.identifier))}
                role="button"
                className="text-[12px] dark:text-[#FFFFFF] font-bold p-[10px] dark:dark:bg-color-card-header-active dark:hover:bg-color-card-body-hover text-[#31373D] hover:text-[#000] bg-white border dark:border-0 border-solid border-[#DADDE6] dark:hover:text-white rounded-[5px] text-center"
              >
                {t('gameDetail:moreInfo')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailComponent;
