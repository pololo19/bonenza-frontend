import cn from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';

import api from '@/api/api';
import { api_getGamesByProvider, SortType } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { titleCase } from '@/base/libs/utils';
import { GameDetail, GameListType, GameProviderDetail } from '@/base/types/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import CasinoSS from '@/components/casino/casinoSS';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import BaseLayout from '@/components/layouts/base.layout';
import { NoDataComponent } from '@/components/noData/noData';
import SortBy from '@/components/sortBy/sortBy';

import styles from './index.module.scss';

const sortBy = [
  { id: 2, label: 'Popular', orderValue: 'popular', orderBy: 'total_favorite' },
  { id: 3, label: 'A-Z', orderValue: 'asc', orderBy: 'title' },
  { id: 4, label: 'Z-A', orderValue: 'desc', orderBy: 'title' },
  { id: 5, label: 'New', orderValue: 'desc', orderBy: 'released_at' },
];

function ProviderPage() {
  const { t } = useTranslation('');
  const { query } = useRouter();
  const { id } = query;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listGame, setListGame] = useState<GameListType[]>([]);
  const [listRelated, setListRelated] = useState<GameDetail[]>([]);
  const [providerDetail, setProviderDetail] = useState<GameProviderDetail | any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [isShowMore, setIsShowMore] = useState<boolean>(true);
  const [isShowMoreProvider, setIsShowMoreProvider] = useState<boolean>(false);

  const [selectedSortBy, setSelectedSortBy] = useState(sortBy[0]);

  const handleGetListGame = async () => {
    try {
      setIsLoading(true);
      const res = await api_getGamesByProvider(String(id), selectedSortBy.orderValue as SortType, currentPage || 1, 40);
      const totalCount = res?.data?.totalCount ?? 0;
      const games = res?.data?.data ?? [];
      const tempGameListData: GameListType[] = games?.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item?.payout ?? 0),
        multiplier: Number(item?.profitMultiplier ?? 0),
        releasedAt: item?.releasedAt ?? '',
      }));
      if (games.length < 40 || listGame.length + games.length === totalGames) {
        setIsShowMore(false);
      }
      setListGame((current) => [...current, ...tempGameListData]);
      setTotalGames(totalCount);
    } catch (error) {
      setListGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListRelatedGame = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-total-favorite-game', { params: { limit: 20 } });
      setListRelated(res.data.data);
    } catch (error) {
      setListRelated([]);
    } finally {
      setIsLoading(false);
    }
  };

  const percent = useMemo(() => {
    return Number((listGame.length / totalGames) * 100).toFixed(0);
  }, [listGame, totalGames]);

  useEffect(() => {
    if (id) {
      setListGame([]);
      handleGetListGame();
      handleGetListRelatedGame();
    }
  }, [id, selectedSortBy]);

  useEffect(() => {
    if (currentPage > 1) handleGetListGame();
  }, [currentPage]);

  return (
    <div className="py-[24px]">
      <Head>
        <title>Provider - Bonenza</title>
      </Head>
      {isLoading && <Loader />}
      <Breadcrumbs
        data={[{ title: 'Casino', href: ROUTER.Casino }]}
        endpoint={{ title: String(id), href: ROUTER.Provider(String(id)) }}
      />
      <div className="sm:flex grid grid-cols-2 sm:justify-between mt-[10px] items-center justify-start gap-[30px]">
        <p className="text-color-primary cursor-pointer sm:text-[16px] text-[14px]">
          <Link href={ROUTER.Providers}>{`${t('gameDetail:viewAll')} ${t('layout:providers')}`}</Link>
        </p>
        <SortBy
          sortBy={sortBy}
          selectSortBy={(sort) => setSelectedSortBy(sort)}
          selectedSortBy={selectedSortBy}
          label={false}
        />
      </div>
      <>
        <div className="sm:text-[24px] text-[16px] mt-[24px] dark:text-white text-black">
          {titleCase(String(id))} {t('layout:games')}
        </div>
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
                  <div
                    className="h-full max-w-[80px] bg-amber-500 rounded-[5px]"
                    style={{ width: `${percent}%` }}
                  ></div>
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
        <div className="mt-10">
          <CasinoSS
            title={String(t('casino:alsoLike'))}
            data={listRelated}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('Live Casino')}
          />
        </div>
      </>
    </div>
  );
}

ProviderPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default ProviderPage;
