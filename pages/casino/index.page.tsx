import cn from 'classnames';
import { SearchNormal } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Settings } from 'react-slick';

import { api_getCasinoWithKey, api_getProviders, api_getThemes, CasinoRequest } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { snakeCaseToString } from '@/base/libs/utils';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import { GameListType, GameProviderDetail, GameThemeDetail } from '@/base/types/common';
import CasinoSS from '@/components/casino/casinoSS';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
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
  megaways: GameListType[];
  exclusives: GameListType[];
};

function CasinoPage() {
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    megaways: [],
    exclusives: [],
  });
  const [tab, setTab] = useState(1);

  const handleGetGames = async () => {
    const initGameDatas: ListGamesType = {
      games: [],
      slots: [],
      hotGames: [],
      liveCasinos: [],
      newReleases: [],
      blackjacks: [],
      tableGames: [],
      megaways: [],
      exclusives: [],
    };
    try {
      setIsLoading(true);
      const keys = ['slots', 'hot-games', 'live-casino', 'new-releases', 'blackjack', 'table-games'];
      const params: CasinoRequest = { page: 1, pageSize: 20, providers: '[]', sort: 'like' };
      const res = await Promise.all(keys.map((key) => api_getCasinoWithKey(key, params)));
      let tempGameLists: ListGamesType = { ...initGameDatas };
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        const totalCount = element?.data?.totalCount ?? 0;
        const games = element?.data?.games ?? [];
        const tempGameListData = games?.map((item: any) => ({
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
        setListGames(tempGameLists);
      }
    } catch (error) {
      setListGames({ ...initGameDatas });
    } finally {
      setIsLoading(false);
    }
  };

  const getListProvidersAndThemes = async () => {
    try {
      setIsLoading(true);
      const [resProviders, resThemes] = await Promise.all([api_getProviders(), api_getThemes()]);
      const providers = resProviders.data.map((provider: any) => ({
        id: provider.id,
        name: provider.name,
        image: provider.identifier,
        isSelect: false,
        totalGames: provider.gameCount,
      }));

      const themes = [...resThemes.data];
      setListProvider(providers);
      setListTheme(themes);
    } catch (error) {
      setListProvider([]);
      setListTheme([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetGames();
    getListProvidersAndThemes();
    localStorage.removeItem('tab');
  }, []);

  return (
    <div className="py-[24px]">
      <Head>
        <title>Casino - Bonenza</title>
      </Head>
      {isLoading && <Loader />}

      <GameBannerSlider className="!mt-0" />
      {/* Search */}
      <div
        className="relative mt-[20px] h-[40px] border border-solid border-white/10 rounded-[5px] flex items-center justify-start px-[10px] gap-[20px]"
        onClick={() => dispatch(changeIsShowCasinoSearch(true))}
        role="button"
      >
        <SearchNormal width={24} height={24} className="text-gray-500" />
        <div className={cn('w-full text-[14px] text-gray-500 outline-none')}>{t('casino:gameNameAndProvider')}</div>
      </div>
      {/* Filter Horizontal */}
      <TabGames />

      {/* Game Options */}
      {tab === 1 && (
        <div className="flex flex-col gap-[30px]">
          <CasinoSS
            title={String(t('casino:bonenzaOriginals'))}
            data={listGames.games}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Category('Bonenza Mini Games')}
          />
          <div className="relative sm:block hidden">
            <RecentBigWinComponent />
          </div>

          <CasinoSS
            title={String(t('casino:slot'))}
            data={listGames.slots}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('slots')}
          />
          <CasinoSS
            title={String(t('casino:hotGame'))}
            data={listGames.hotGames}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('Hot Games')}
          />
          <CasinoSS
            title={String(t('casino:liveCasino'))}
            data={listGames.liveCasinos}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('Live Casino')}
          />
          <CasinoSS
            title={String(t('casino:gameProvider'))}
            data={listProvider}
            viewAllUrl={ROUTER.Providers}
            renderItem={(item: GameProviderDetail) => (
              <Link
                href={ROUTER.Provider(String(item.name))}
                role="button"
                className="p-[8px] sm:max-h-[70px] h-full max-h-[50px] bg-[#fff] dark:bg-color-card-bg-default hover:opacity-70 gap-[10px] flex-shrink-0 rounded flex items-center justify-center"
              >
                <Image
                  height={0}
                  width={0}
                  src={`https://cdn.softswiss.net/logos/providers_small/color/${item?.image}.svg`}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.src = `/img/providers/softswiss.png`;
                  }}
                  className="object-cover max-w-[150px] sm:max-h-[50px] max-h-[30px] w-auto rounded-[5px]"
                />
              </Link>
            )}
          />
          <CasinoSS
            title={String(t('casino:newReleases'))}
            data={listGames.newReleases}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('New Releases')}
          />
          <CasinoSS
            title={String(t('casino:blackjack'))}
            data={listGames.blackjacks}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('Blackjack')}
          />
          <CasinoSS
            title={String(t('casino:themes'))}
            data={listTheme}
            viewAllUrl={ROUTER.Themes}
            renderItem={(item: string) => (
              <Link
                href={ROUTER.Theme(String(item))}
                role="button"
                className="flex items-center sm:h-[64px] h-[50px] justify-center xl:text-[14px] text-[14px] min-w-fit p-[10px] bg-[#fff] dark:bg-color-card-bg-default hover:opacity-70
                 gap-[10px] flex-shrink-0 rounded text-black dark:text-white dark:hover:text-white/50 hover:text-black/80 text-center"
              >
                {snakeCaseToString(item)}
              </Link>
            )}
          />
          <CasinoSS
            title={String(t('casino:bonenzaExclusives'))}
            data={listGames.exclusives}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('Bonenza Exclusives')}
          />
          <CasinoSS
            title={String(t('casino:tableGames'))}
            data={listGames.tableGames}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('Table Games')}
          />
          <CasinoSS
            title={String(t('casino:megaways'))}
            data={listGames.megaways}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('Megaways')}
          />
        </div>
      )}

      <div className="w-full relative mt-4">
        <HomepageSession title={String(t('homePage:latestBetRace'))} showIcon={false}>
          <LatestBetRace />
        </HomepageSession>
      </div>
    </div>
  );
}

CasinoPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default CasinoPage;
