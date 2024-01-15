import cn from 'classnames';
import { ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { GameDetail, GameListType, GameProviderDetail } from '@/base/types/common';

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
      <div className="w-full h-full rounded-[15px] dark:bg-[#1D1E22] bg-white relative">
        <ul className="flex justify-center gap-[8px] w-fit rounded-full md:text-[13px] text-[11px] font-semibold p-[8px]  md:pt-[16px] md:pl-[30px]">
          <div
            role="button"
            onClick={() => setOpenTab(1)}
            className={`${
              openTab === 1 && 'dark:text-white dark:bg-[#2D3035] bg-white text-black font-semibold'
            } inline-block md:text-[14px] sm:text-[12px] text-[10px] md:px-6 sm:px-4 px-2 py-3 rounded-[5px] dark:hover:bg-gray-600 dark:hover:text-white dark:bg-[#24262B] dark:text-[rgba(255,255,255,0.5)] bg-[#f6f7fa] text-[#31373D] hover:text-[#000]`}
          >
            {t('gameTable:allBets')}
          </div>
          <div
            role="button"
            onClick={() => setOpenTab(2)}
            className={`${
              openTab === 2 && 'dark:text-white dark:bg-[#2D3035] bg-white text-black font-semibold'
            } inline-block md:text-[14px] sm:text-[12px] text-[10px] md:px-6 sm:px-4 px-2 py-3 rounded-[5px] dark:hover:bg-gray-600 dark:hover:text-white dark:bg-[#24262B] dark:text-[rgba(255,255,255,0.5)] bg-[#f6f7fa] text-[#31373D] hover:text-[#000]`}
          >
            {t('gameTable:myBets')}
          </div>
          <div
            role="button"
            onClick={() => setOpenTab(3)}
            className={`${
              openTab === 3 && 'dark:text-white dark:bg-[#2D3035] bg-white text-black font-semibold'
            } inline-block md:text-[14px] sm:text-[12px] text-[10px] md:px-6 sm:px-4 px-2 py-3 rounded-[5px] dark:hover:bg-gray-600 dark:hover:text-white dark:bg-[#24262B] dark:text-[rgba(255,255,255,0.5)] bg-[#f6f7fa] text-[#31373D] hover:text-[#000]`}
          >
            {t('gameTable:highRoller')}
          </div>
          <div
            role="button"
            onClick={() => setOpenTab(4)}
            className={`${
              openTab === 4 && 'dark:text-white dark:bg-[#2D3035] bg-white text-black font-semibold'
            } inline-block md:text-[14px] sm:text-[12px] text-[10px] md:px-6 sm:px-4 px-2 py-3 rounded-[5px] dark:hover:bg-gray-600 dark:hover:text-white dark:bg-[#24262B] dark:text-[rgba(255,255,255,0.5)] bg-[#f6f7fa] text-[#31373D] hover:text-[#000]`}
          >
            {t('gameTable:wagerContest')}
          </div>
        </ul>
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
        <CasinoSS
          title={String(t('gameDetail:relatedGames'))}
          data={listRelatedGame}
          renderItem={(item) => <GameCard gameDetail={item} />}
          viewAllUrl={ROUTER.PicksForYou}
        />
      </div>

      <div className="mt-[36px]">
        <div className="text-[18px] font-semibold dark:text-[#FFFFFF] text-[#31373D]">
          {t('gameDetail:aboutTheProvider')}
        </div>
        <div>
          <div className="dark:bg-[#2C2F36] bg-white p-[15px] rounded-[5px] mt-[10px] mb-[30px]">
            <div className="mb-[15px] ml-[15px]">
              <Image
                height={0}
                width={0}
                src={`https://cdn.softswiss.net/logos/providers_small/color/${gameDetail?.provider}.svg`}
                alt=""
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
                href={ROUTER.Provider(String(gameDetail?.providerName))}
                className="flex dark:bg-color-btn-primary dark:hover:bg-gray-600 text-[#000] hover:text-[#000] items-center p-[10px] justify-between rounded-[5px] gap-[5px] border dark:border-0 border-solid border-[#DADDE6]"
                role="button"
              >
                <div className="text-[12px] dark:text-[#FFFFFF] text-[#31373D] hover:text-[#000] font-bold">
                  {gameDetail?.gameCnt} {t('provider:games')}
                </div>
                <ArrowRight2 size={12} />
              </Link>
              <Link
                href={ROUTER.Provider(String(gameDetail?.providerName))}
                role="button"
                className="text-[12px] dark:text-[#FFFFFF] font-bold p-[10px] dark:bg-color-btn-primary text-[#31373D] hover:text-[#000] bg-white border dark:border-0 border-solid border-[#DADDE6] dark:hover:text-white dark:hover:bg-gray-600 rounded-[5px] text-center"
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
