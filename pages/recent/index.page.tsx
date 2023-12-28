import Head from 'next/head';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';

import api from '@/api/api';
import { api_getRecentGames } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { GameDetail, GameListType } from '@/base/types/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import withAuth from '@/components/hoc/withAuth';
import BaseLayout from '@/components/layouts/base.layout';
import { NoDataComponent } from '@/components/noData/noData';

function RecentPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listGame, setListGame] = useState<GameListType[]>([]);
  const [isShowMore, setIsShowMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalGames, setTotalGames] = useState<number>(0);

  const { t } = useTranslation('');

  const handleGetListGame = async () => {
    try {
      setIsLoading(true);
      const res = await api_getRecentGames(currentPage, 40);
      const tempGameLists = res.data.games.map((item: any) => ({
        id: item.id,
        title: item.title,
        identifier: item.identifier,
        payout: Number(item.payout),
        multiplier: Number(item.profitMultiplier),
      }));
      setListGame((current) => [...current, ...tempGameLists]);
      setTotalGames(res.data.totalCount ?? 0);
      if (res.data.games.length < 40) {
        setIsShowMore(false);
      }
    } catch (error) {
      setListGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const percent = useMemo(() => {
    return Number((listGame.length / totalGames) * 100).toFixed(0);
  }, [listGame, totalGames]);

  useEffect(() => {
    handleGetListGame();
  }, [currentPage]);

  return (
    <div className="py-[24px]">
      <Head>
        <title>Recent Games - Bonenza</title>
      </Head>
      {isLoading && <Loader />}
      <Breadcrumbs
        data={[{ title: 'Casino', href: ROUTER.Casino }]}
        endpoint={{ title: 'Recent', href: ROUTER.Recent }}
      />
      {!!listGame.length && (
        <>
          <div className="game-grid-parent mt-[20px]">
            {listGame.map((game, index) => {
              return (
                <div key={index} className="max-w-[185px]">
                  <GameCard gameDetail={game} />
                </div>
              );
            })}
          </div>
          {!!totalGames && (
            <div className="text-[12px] text-gray-400 flex items-center justify-center gap-[10px] mt-[20px]">
              <div>
                {listGame.length}/{totalGames}
              </div>
              <div className="max-w-[80px] w-full rounded-[5px] h-[5px] bg-gray-500">
                <div className="h-full max-w-[80px] bg-amber-500 rounded-[5px]" style={{ width: `${percent}%` }}></div>
              </div>
              <div>{percent}%</div>
            </div>
          )}
          {isShowMore && (
            <div className="flex justify-center mt-[20px] pb-[8px] md:pb-[23px]">
              <div
                className="flex items-center dark:bg-[#2D3035] bg-white py-[9px] px-[10px] rounded-[5px]"
                role="button"
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
              >
                <div className="text-[10px] text-[#FFFFFF] font-bold">{t('casino:loadMore')}</div>
              </div>
            </div>
          )}
        </>
      )}
      {!listGame.length && (
        <div className="py-[100px]">
          <NoDataComponent />
        </div>
      )}
    </div>
  );
}

const RecentPageAuth = withAuth(RecentPage);

RecentPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default RecentPageAuth;
