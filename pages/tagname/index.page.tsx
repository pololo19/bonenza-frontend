import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { SearchNormal } from 'iconsax-react';
import Head from 'next/head';
import cn from 'classnames';
import { usePathname } from 'next/navigation';

import { useTranslation } from '@/base/config/i18next';
import api from '@/api/api';
import { GameDetail, GameProviderDetail } from '@/base/types/common';
import { ROUTER } from '@/base/constants/common';
import BaseLayout from '@/components/layouts/base.layout';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import { NoDataComponent } from '@/components/noData/noData';
import { snakeCaseToString } from '@/base/libs/utils';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import SortBy from '@/components/sortBy/sortBy';
import ProviderFilter from '@/components/providerFilter/providerFilter';
import TabGames from '@/components/tabGames/tabGames';

function CasinoTagnamePage() {
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const { query } = useRouter();
  const { key } = query;
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShowMore, setIsShowMore] = useState<boolean>(true);
  const [listGame, setListGame] = useState<GameDetail[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [listProvider, setListProvider] = useState<GameProviderDetail[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string[]>([]);
  const [isClearAll, setIsClearAll] = useState<boolean>(false);
  const [isSort, setIsSort] = useState<boolean>(false);
  const [showTab, setShowTab] = useState<boolean>(false);

  const handleGetListProvider = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-provider-list');
      const providers = res.data.data.map((provider: GameProviderDetail) => ({
        ...provider,
        isSelect: false,
      }));
      setListProvider(providers);
    } catch (error) {
      setListProvider([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListGame = async (fieldQuery: any) => {
    const params = {
      limit: 40,
      page: currentPage || 1,
      ...fieldQuery,
    };
    try {
      setIsLoading(true);
      const res = await api.get('game/get-all-games', { params: params });
      setListGame((current) => [...current, ...res.data.data]);
      setTotalGames(res.data.totalGames);
      if (res.data.data.length < 40 || res.data.data.length === res.data.totalGames) {
        setIsShowMore(false);
      }
    } catch (error) {
      setListGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListHotGame = async (fieldQuery: any) => {
    const params = {
      limit: 40,
      page: currentPage || 1,
      ...fieldQuery,
    };
    try {
      setIsLoading(true);
      const res = await api.get('game/get-hot-list', { params: params });
      setListGame((current) => [...current, ...res.data.data]);
      setTotalGames(res.data.totalGames);
      if (res.data.data.length < 40 || res.data.data.length === res.data.totalGames) {
        setIsShowMore(false);
      }
    } catch (error) {
      setListGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListLiveCasino = async (fieldQuery: any) => {
    const params = {
      limit: 40,
      page: currentPage || 1,
      ...fieldQuery,
    };
    try {
      setIsLoading(true);
      const res = await api.get('game/get-live-casino-list', { params: params });
      setListGame((current) => [...current, ...res.data.data]);
      setTotalGames(res.data.totalGames);
      if (res.data.data.length < 40 || res.data.data.length === res.data.totalGames) {
        setIsShowMore(false);
      }
    } catch (error) {
      setListGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListTopPick = async () => {
    const params = {
      limit: 40,
      page: currentPage || 1,
    };
    try {
      setIsLoading(true);
      const res = await api.get('game/get-top-pick-list', { params: params });
      setListGame((current) => [...current, ...res.data.data]);
      setTotalGames(res.data.totalGames);
      if (res.data.data.length < 40 || res.data.data.length === res.data.totalGames) {
        setIsShowMore(false);
      }
    } catch (error) {
      setListGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getGames = () => {
    setIsShowMore(true);
    let params =
      key === 'slots' || key === 'Live Casino'
        ? { orderBy: selectedSortBy.orderBy, orderValue: selectedSortBy.orderValue }
        : {};
    switch (key) {
      case 'New Releases':
        handleGetListGame({ releasedAt: 'string desc', providers: selectedProvider });
        break;
      case 'Blackjack':
        handleGetListGame({ search: 'Blackjack', providers: selectedProvider });
        break;
      case 'Megaways':
        handleGetListGame({ search: 'Megaways', providers: selectedProvider });
        break;
      case 'Table Games':
        handleGetListGame({ tag: 'Table Games', providers: selectedProvider });
        break;
      case 'Live Casino':
        handleGetListLiveCasino({ providers: selectedProvider, ...params });
        break;
      case 'Hot Games':
        handleGetListHotGame({ providers: selectedProvider, tag: key });
        break;
      case 'Bonenza Exclusives':
        handleGetListGame({ tag: 'Max Bet', providers: selectedProvider });
        break;
      case 'Top Picks':
        handleGetListTopPick();
        break;
      default:
        handleGetListGame({ category: key, providers: selectedProvider, ...params });
        break;
    }
  };

  const selectProvider = useCallback(
    (providerId?: string | undefined) => {
      if (selectedProvider.length > 0) {
        setIsClearAll(true);
      }
      if (providerId) {
        const newListProvider = listProvider.map((provider) =>
          provider.id === providerId ? { ...provider, isSelect: !provider.isSelect } : provider,
        );
        const listProviderSelect = newListProvider.filter((provider) => provider.isSelect === true);
        const listProviderSelectId = listProviderSelect.map((provider) => provider.id);
        setSelectedProvider(listProviderSelectId);
        setListProvider(newListProvider);
      } else {
        setSelectedProvider([]);
        const newListProvider = listProvider.map((provider) => ({ ...provider, isSelect: false }));
        setListProvider(newListProvider);
      }
    },
    [listProvider],
  );

  const selectSortBy = useCallback((sort: any) => {
    setSelectedSortBy(sort);
    setIsSort(true);
  }, []);

  const percent = useMemo(() => {
    return Number((listGame.length / totalGames) * 100).toFixed(0);
  }, [listGame, totalGames]);

  useEffect(() => {
    if (key) {
      setListGame([]);
      getGames();
    }
  }, [key]);

  useEffect(() => {
    if (selectedProvider.length > 0 || isClearAll) {
      setListGame([]);
      setIsClearAll(false);
      getGames();
    }
  }, [selectedProvider]);

  useEffect(() => {
    const tabStorage = localStorage.getItem('tab');
    const tabShow = Number(tabStorage) === 1 || !tabStorage ? false : true;
    setShowTab(tabShow);
    handleGetListProvider();
    return () => {
      if (!pathname?.includes('/tagname')) localStorage.removeItem('tab');
    };
  }, []);

  useEffect(() => {
    if (currentPage > 1) getGames();
  }, [currentPage]);

  const sortBy = [
    { id: 1, label: 'You may like', orderValue: '', orderBy: '' },
    { id: 2, label: 'Popular', orderValue: 'desc', orderBy: 'total_favorite' },
    { id: 3, label: 'A-Z', orderValue: 'asc', orderBy: 'title' },
    { id: 4, label: 'Z-A', orderValue: 'desc', orderBy: 'title' },
    { id: 5, label: 'New', orderValue: 'desc', orderBy: 'released_at' },
  ];
  const [selectedSortBy, setSelectedSortBy] = useState(sortBy[0]);

  useEffect(() => {
    if (isSort) {
      setListGame([]);
      setIsSort(false);
      getGames();
    }
  }, [selectedSortBy]);

  return (
    <div className="py-[24px]">
      <Head>
        <title>Casino - Bonenza</title>
      </Head>
      {isLoading && <Loader />}
      <div
        className="relative mb-[20px] h-[40px] dark:bg-[#161D26] bg-white rounded-[5px] flex items-center justify-start px-[10px] gap-[20px]"
        onClick={() => dispatch(changeIsShowCasinoSearch(true))}
        role="button"
      >
        <SearchNormal width={24} height={24} className="text-gray-500" />
        <div className={cn('w-full text-[14px] text-gray-500 outline-none')}>{t('casino:gameNameAndProvider')}</div>
      </div>

      {showTab ? (
        <TabGames setCurrentPage={setCurrentPage} />
      ) : (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative gap-x-[32px] gap-y-[16px] flex-wrap">
          <Breadcrumbs
            data={[{ title: 'Casino', href: ROUTER.Casino }]}
            endpoint={{ title: snakeCaseToString(String(key) ?? ''), href: ROUTER.Tagname(String(key) ?? '') }}
          />
          <div className="flex items-center text-[14px] text-[#98a7b5] gap-[12px] md:gap-[48px] max-sm:w-full">
            {(key === 'slots' || key === 'Live Casino') && (
              <SortBy sortBy={sortBy} selectSortBy={selectSortBy} selectedSortBy={selectedSortBy} />
            )}
            <ProviderFilter
              listProvider={listProvider}
              selectedProvider={selectedProvider}
              selectProvider={selectProvider}
            />
          </div>
        </div>
      )}
      <div className="min-h-[380px]">
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
        {!isLoading && !listGame.length && (
          <div className="py-[100px]">
            <NoDataComponent />
          </div>
        )}
      </div>
    </div>
  );
}

CasinoTagnamePage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default CasinoTagnamePage;
