import cn from 'classnames';
import { SearchNormal } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { api_getCasinoGameData, api_getCasinoWithKey, CasinoRequest } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { isEmpty, snakeCaseToString } from '@/base/libs/utils';
import { convert2Url } from '@/base/libs/utils/convert';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import { BetDetailType, GameListType, GameProviderDetail } from '@/base/types/common';
import CasinoSS from '@/components/casino/casinoSS';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import GameCategory from '@/components/gameCategory/gameCategory';
import HomepageSession from '@/components/homepage/homepageSession/homepageSession';
import LatestBetRace from '@/components/homepage/latestBetRace';
import RecentBigWinComponent from '@/components/homepage/recentBigWin';
import BaseLayout from '@/components/layouts/base.layout';
import GameBannerSlider from '@/components/sliders/gameSliders';
import TabGames from '@/components/tabGames/tabGames';

type ListGamesType = {
  games: GameListType[];
  slots: GameListType[];
  hotGames: GameListType[];
  liveCasinos: GameListType[];
  newReleases: GameListType[];
  blackjacks: GameListType[];
  tableGames: GameListType[];
};

function CasinoPage() {
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const { query } = useRouter();
  const { key } = query;
  const _key = String(key);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [listBigWinGame, setListBigWinGame] = useState<BetDetailType[]>([]);
  const [listProvider, setListProvider] = useState<GameProviderDetail[]>([]);
  const [listTheme, setListTheme] = useState<string[]>([]);

  const [listGames, setListGames] = useState<ListGamesType>({
    games: [],
    slots: [],
    hotGames: [],
    liveCasinos: [],
    newReleases: [],
    blackjacks: [],
    tableGames: [],
  });

  const getInitialData = async () => {
    const initGameDatas: ListGamesType = {
      games: [],
      slots: [],
      hotGames: [],
      liveCasinos: [],
      newReleases: [],
      blackjacks: [],
      tableGames: [],
    };
    try {
      setIsLoading(true);
      const _resCasino = await api_getCasinoGameData();
      const keys = ['slots', 'hotGames', 'liveCasino', 'newReleases', 'blackjacks', 'tableGames'];
      let i = 0;
      let tempGameLists: ListGamesType = { ...initGameDatas };
      for (i = 0; i < keys.length; i++) {
        const key = keys[i];
        const tempGameListData = _resCasino.data[key]?.map((item: any) => ({
          id: item?.id ?? '',
          title: item?.title ?? '',
          description: item?.description ?? '',
          identifier: item?.identifier ?? '',
          payout: Number(item?.payout ?? 0),
          multiplier: Number(item?.profitMultiplier ?? 0),
          providerName: item?.producerName ?? '',
          releasedAt: item?.releasedAt ?? '',
        }));
        if (i === 0) tempGameLists['slots'] = [...tempGameListData];
        if (i === 1) tempGameLists['hotGames'] = [...tempGameListData];
        if (i === 2) tempGameLists['liveCasinos'] = [...tempGameListData];
        if (i === 3) tempGameLists['newReleases'] = [...tempGameListData];
        if (i === 4) tempGameLists['blackjacks'] = [...tempGameListData];
        if (i === 5) tempGameLists['tableGames'] = [...tempGameListData];
      }
      const tempRecentBigWins: BetDetailType[] = _resCasino.data.recentBigWins?.map((item: any) => ({
        id: item?.id ?? '',
        game: item?.title ?? '',
        identifier: item?.identifier ?? '',
        amount: Number(item.betAmount || 0),
        amountUsd: Number(item.betAmountUsd || 0),
        currency: item?.currency ?? 'USD',
        currencyType: 'crypto',
        multiplier: Number(item?.multiplier || 0),
        profit: Number(item?.profitAmount || 0),
        profitUsd: Number(item?.profitAmountUsd || 0),

        userId: item?.userId ?? '',
        userName: item?.userName ?? '',
        userAvatar: item?.userAvatar ?? '',
        providerName: item?.providerName ?? '',
      }));
      tempRecentBigWins.push(...tempRecentBigWins.slice(0));
      const tempProviders = _resCasino.data.gameProviders?.map((provider: any) => ({
        id: provider.id,
        name: provider.name,
        image: provider.identifier,
        isSelect: false,
        totalGames: provider.gameCount,
      }));
      const tempThemes = [..._resCasino.data.themes];
      setListGames(tempGameLists);
      setListBigWinGame(tempRecentBigWins);
      setListProvider(tempProviders);
      setListTheme(tempThemes);
    }
    catch (err) {
      console.error(err);
      setListGames({ ...initGameDatas });
      setListBigWinGame([]);
      setListProvider([]);
      setListTheme([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getInitialData();
    localStorage.removeItem('tab');
  }, []);

  const getGames = useCallback(async (page: number, pageSize: number) => {
    let params: CasinoRequest = {
      page,
      pageSize,
      providers: JSON.stringify([]),
      sort: 'like'
    }
    const _res = await api_getCasinoWithKey(convert2Url(_key), params);
    return {
      data: _res.data?.games,
      page: _res.data?.page,
      pageSize: _res.data?.pageSize,
      totalPage: _res.data?.totalPage,
      totalCount: _res.data?.totalCount
    }
  }, [_key])

  return (
    <div className="py-[24px]">
      {isLoading && <Loader />}

      <GameBannerSlider className="!mt-0" />
      {/* Search */}
      <div
        className="relative mt-[20px] h-[40px] border border-solid dark:bg-transparent bg-white dark:border-white/10 rounded-[5px] flex items-center justify-start px-[10px] gap-[20px]"
        onClick={() => dispatch(changeIsShowCasinoSearch(true))}
        role="button"
      >
        <SearchNormal width={24} height={24} className="text-gray-500" />
        <div className={cn('w-full text-default text-gray-500 outline-none')}>{t('casino:gameNameAndProvider')}</div>
      </div>
      {/* Filter Horizontal */}
      <TabGames ishome />

      {/* Game Options */}
      {
        isEmpty(_key) && <>
          <div className="flex flex-col gap-[30px] sm:pt-0 pt-[10px]">
            <div className="w-full sm:block hidden">
              {listBigWinGame.length > 0 && <RecentBigWinComponent listBigWinGame={listBigWinGame} />}
            </div>

            <CasinoSS
              title={String(t('casino:liveCasino'))}
              data={listGames.liveCasinos}
              renderItem={(item) => <GameCard gameDetail={item} />}
              viewAllUrl={ROUTER.Tagname('live-casino')}
            />
            <CasinoSS
              title={String(t('casino:hotGame'))}
              data={listGames.hotGames}
              renderItem={(item) => <GameCard gameDetail={item} />}
              viewAllUrl={ROUTER.Tagname('hot-games')}
            />
            <CasinoSS
              title={String(t('casino:slot'))}
              data={listGames.slots}
              renderItem={(item) => <GameCard gameDetail={item} />}
              viewAllUrl={ROUTER.Tagname('slots')}
            />
            <CasinoSS
              title={String(t('casino:gameProvider'))}
              data={listProvider}
              viewAllUrl={ROUTER.Providers}
              renderItem={(item: GameProviderDetail) => (
                <Link
                  href={ROUTER.Provider(String(item.image))}
                  role="button"
                  className="p-[8px] sm:max-h-[70px] h-full max-h-[50px] bg-white dark:bg-gradient-card-provider hover:opacity-70 gap-[10px] flex-shrink-0 rounded-large flex items-center justify-center"
                >
                  <Image
                    height={0}
                    width={0}
                    src={
                      item?.image
                        ? `https://cdn.softswiss.net/logos/providers/color/${item?.image}.svg`
                        : `/img/providers/softswiss.png`
                    }
                    alt="provider logo"
                    onError={(e) => {
                      e.currentTarget.src = `/img/providers/softswiss.png`;
                    }}
                    className="object-cover max-w-[150px] sm:max-h-[50px] max-h-[30px] w-auto rounded-default"
                  />
                </Link>
              )}
            />
            <CasinoSS
              title={String(t('casino:newReleases'))}
              data={listGames.newReleases}
              renderItem={(item) => <GameCard gameDetail={item} />}
              viewAllUrl={ROUTER.Tagname('new-releases')}
            />
            <CasinoSS
              title={String(t('casino:blackjack'))}
              data={listGames.blackjacks}
              renderItem={(item) => <GameCard gameDetail={item} />}
              viewAllUrl={ROUTER.Tagname('blackjack')}
            />
            <CasinoSS
              title={String(t('casino:themes'))}
              data={listTheme}
              viewAllUrl={ROUTER.Themes}
              renderItem={(item: string) => (
                <Link
                  href={ROUTER.Theme(String(item))}
                  role="button"
                  className="flex items-center sm:h-[64px] h-[50px] justify-center xl:text-default text-default min-w-fit p-[10px] bg-white dark:bg-color-card-bg-secondary hover:opacity-70
                 gap-[10px] flex-shrink-0 rounded text-black dark:text-white dark:hover:text-white/50 hover:text-black/80 text-center"
                >
                  {snakeCaseToString(item)}
                </Link>
              )}
            />
            <CasinoSS
              title={String(t('casino:tableGames'))}
              data={listGames.tableGames}
              renderItem={(item) => <GameCard gameDetail={item} />}
              viewAllUrl={ROUTER.Tagname('table-games')}
            />
          </div>

          <div className="w-full relative mt-4">
            <HomepageSession title={String(t('homePage:latestBetRace'))} showIcon={false}>
              <LatestBetRace />
            </HomepageSession>
          </div>
        </>
      }
      {
        !isEmpty(_key) && <GameCategory getData={getGames} />
      }

    </div>
  );
}

CasinoPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default CasinoPage;
