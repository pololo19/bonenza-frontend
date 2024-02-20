import Head from 'next/head';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { api_getPickGames } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { GameListType } from '@/base/types/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import BaseLayout from '@/components/layouts/base.layout';
import { NoDataComponent } from '@/components/noData/noData';

function PickForYouPage() {
  const { t } = useTranslation('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowMore, setIsShowMore] = useState<boolean>(true);
  const [listGame, setListGame] = useState<GameListType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalGames, setTotalGames] = useState<number>(0);

  const getListGames = async () => {
    try {
      setIsLoading(true);
      const _res = await api_getPickGames(currentPage, 40);
      const tempGameLists = _res.data.games.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item?.payout ?? 0),
        multiplier: Number(item?.profitMultiplier ?? 0),
        providerName: item?.producerName ?? '',
        releasedAt: item?.releasedAt ?? '',
      }));
      setListGame((current) => [...current, ...tempGameLists]);
      setTotalGames(_res.data.totalCount);
      if (_res.data.games.length < 40) {
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
    getListGames();
  }, [currentPage]);

  return (
    <div className="py-[24px]">
      <Head>
        <title>Pick For You - Bonenza</title>
      </Head>
      {isLoading && <Loader />}

      <Breadcrumbs
        data={[{ title: 'Casino', href: ROUTER.Casino }]}
        endpoint={{ title: String(t('casino:pickForYou')), href: ROUTER.PicksForYou }}
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
              <div className="max-w-[80px] w-full rounded-default h-[5px] bg-gray-500">
                <div
                  className="h-full max-w-[80px] bg-color-secondary rounded-default"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <div>{percent}%</div>
            </div>
          )}
          {isShowMore && (
            <div className="flex justify-center mt-[20px] pb-[8px] md:pb-[23px]">
              <div
                className="flex items-center dark:bg-[#2D3035] bg-white py-[9px] px-[10px] rounded-default"
                role="button"
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
              >
                <div className="text-des dark:text-[#FFFFFF] text-center text-black font-bold">
                  {t('gameDetail:loadMore')}
                </div>
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

PickForYouPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default PickForYouPage;
