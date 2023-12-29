import cn from 'classnames';
import { SearchNormal } from 'iconsax-react';
import Head from 'next/head';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { api_getPickGames } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import { GameDetail, GameListType } from '@/base/types/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import BaseLayout from '@/components/layouts/base.layout';
import { NoDataComponent } from '@/components/noData/noData';

function PickForYouPage() {
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowMore, setIsShowMore] = useState<boolean>(true);
  const [listGame, setListGame] = useState<GameListType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalGames, setTotalGames] = useState<number>(0);

  const handleGetListGame = async () => {
    try {
      setIsLoading(true);
      const res = await api_getPickGames(currentPage, 40);
      const tempGameLists = res.data.games.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item?.payout ?? 0),
        multiplier: Number(item?.profitMultiplier ?? 0),
        releasedAt: item?.releasedAt ?? '',
      }));
      setListGame((current) => [...current, ...tempGameLists]);
      setTotalGames(res.data.totalCount);
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
        <title>Pick For You - Bonenza</title>
      </Head>
      {isLoading && <Loader />}

      <div
        className="relative mb-[20px] h-[40px] bg-white dark:bg-[#161D26] rounded-[5px] flex items-center justify-start px-[10px] gap-[20px]"
        onClick={() => dispatch(changeIsShowCasinoSearch(true))}
        role="button"
      >
        <SearchNormal width={24} height={24} className="text-[#4D545C]" />
        <div className={cn('w-full text-[14px] text-[#4D545C] outline-none')}>{t('gameDetail:gameNameProvider')}</div>
      </div>

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
                <div className="text-[10px] dark:text-[#FFFFFF] text-black font-bold mr-[6px]">
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
