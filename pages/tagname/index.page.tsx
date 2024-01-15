import cn from 'classnames';
import { SearchNormal } from 'iconsax-react';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import { api_getCasinoWithKey, api_getHotGames, api_getLiveCasinos, api_getProviders, api_getSlots } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { snakeCaseToString } from '@/base/libs/utils';
import { camelToSnake, convert2Url, convertToUrlCase } from '@/base/libs/utils/convert';
import { setCasinoTab } from '@/base/redux/reducers/common.reducer';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { GameListType, GameProviderDetail } from '@/base/types/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import BaseLayout from '@/components/layouts/base.layout';
import { NoDataComponent } from '@/components/noData/noData';
import ProviderFilter from '@/components/providerFilter/providerFilter';
import GameBannerSlider from '@/components/sliders/gameSliders';
import SortBy from '@/components/sortBy/sortBy';
import TabGames from '@/components/tabGames/tabGames';

const sortBy = [
  { id: 1, label: 'You may like', orderValue: 'like', orderBy: '' },
  { id: 2, label: 'Popular', orderValue: 'popular', orderBy: 'total_favorite' },
  { id: 3, label: 'A-Z', orderValue: 'asc', orderBy: 'title' },
  { id: 4, label: 'Z-A', orderValue: 'desc', orderBy: 'title' },
  { id: 5, label: 'New', orderValue: 'desc', orderBy: 'released_at' },
];

const pageSize = 40;

function CasinoTagnamePage() {
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const { query } = useRouter();
  const { key } = query;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShowMore, setIsShowMore] = useState<boolean>(true);
  const [listGame, setListGame] = useState<GameListType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [listProvider, setListProvider] = useState<GameProviderDetail[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string[]>([]);
  const [isClearAll, setIsClearAll] = useState<boolean>(false);
  const [isSort, setIsSort] = useState<boolean>(false);

  const { showTab } = useSelector(
    (state: AppState) => ({
      showTab: state.common.casinoTab,
    }),
    shallowEqual,
  );

  const selectSortBy = useCallback((sort: any) => {
    setSelectedSortBy(sort);
    setIsSort(true);
  }, []);

  const getGameList = async () => {
    const query = key === 'slots' || key === 'Live Casino' ? { sort: selectedSortBy.orderValue } : {};
    let tempGameListData: GameListType[] = [];
    let params: any = {
      pageSize,
      page: currentPage || 1,
    };
    try {
      setIsLoading(true);
      params = {
        ...params,
        ...query,
        providers: JSON.stringify(selectedProvider),
      };
      const res = await api_getCasinoWithKey(convert2Url(String(key)), params);

      const totalCount = res?.data?.totalCount ?? 0;
      const games = res?.data?.games ?? [];
      tempGameListData = games?.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item?.payout ?? 0),
        multiplier: Number(item?.profitMultiplier ?? 0),
        providerName: item?.producerName ?? '',
        releasedAt: item?.releasedAt ?? '',
      }));
      setListGame((current) => [...current, ...tempGameListData]);
      setTotalGames(totalCount);
      if (games.length < pageSize || games.length === totalCount) {
        setIsShowMore(false);
      }
    } catch (error) {
      setListGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getListProviders = async () => {
    try {
      setIsLoading(true);
      const res = await api_getProviders();
      const providers = res.data.map((provider: any) => ({
        id: provider.id,
        name: provider.name,
        isSelect: false,
        totalGames: provider.gameCount,
      }));
      setListProvider(providers);
    } catch (error) {
      setListProvider([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectedProvider = useCallback(
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

  const percent = useMemo(() => {
    return Number((listGame.length / totalGames) * 100).toFixed(0);
  }, [listGame, totalGames]);

  useEffect(() => {
    const tabStorage = localStorage.getItem('tab');
    const tabShow = Number(tabStorage) === 1 || !tabStorage ? false : true;
    dispatch(setCasinoTab(tabShow));
  }, []);

  useEffect(() => {
    if (key) {
      setListGame([]);
      getGameList();
    }
  }, [key]);

  useEffect(() => {
    if (selectedProvider.length > 0 || isClearAll) {
      setListGame([]);
      setIsClearAll(false);
      getGameList();
    }
  }, [selectedProvider]);

  useEffect(() => {
    getListProviders();
  }, []);

  useEffect(() => {
    if (currentPage > 1) getGameList();
  }, [currentPage]);

  const [selectedSortBy, setSelectedSortBy] = useState(sortBy[0]);

  useEffect(() => {
    if (isSort) {
      setListGame([]);
      setIsSort(false);
      getGameList();
    }
  }, [selectedSortBy]);

  return (
    <div className="py-[24px]">
      <Head>
        <title>Casino - Bonenza</title>
      </Head>
      {isLoading && <Loader />}
      <div className="sm:hidden block">
        <GameBannerSlider className="!mt-0" />
        <div
          className="relative mt-[20px] h-[40px] bg-white border border-solid border-white/10 dark:bg-color-input-primary rounded-[5px] flex items-center justify-start px-[10px] gap-[20px]"
          onClick={() => dispatch(changeIsShowCasinoSearch(true))}
          role="button"
        >
          <SearchNormal width={24} height={24} className="text-gray-500" />
          <div className={cn('w-full text-[14px] text-gray-500 outline-none')}>{t('casino:gameNameAndProvider')}</div>
        </div>
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
              selectProvider={handleSelectedProvider}
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
