import cn from 'classnames';
import { SearchNormal } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import Slider, { Settings } from 'react-slick';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { BANNER_DATA, ROUTER, SETTING_BANNER } from '@/base/constants/common';
import { snakeCaseToString } from '@/base/libs/utils';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import { GameDetail, GameProviderDetail, GameThemeDetail } from '@/base/types/common';
import RecentBigWinComponent from '@/components/homepage/recentBigWin';

import CasinoSS from '@/components/casino/casinoSS';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import HotGameBoldIcon from '@/components/icons/HotGameBoldIcon';
import LiveCasinoBoldIcon from '@/components/icons/LiveCasinoBoldIcon';
import LobbyBoldIcon from '@/components/icons/LobbyBoldIcon';
import OriginalBoldIcon from '@/components/icons/OriginalBoldIcon';
import ReleaseBoldIcon from '@/components/icons/ReleaseBoldIcon';
import SlotBoldIcon from '@/components/icons/SlotBoldIcon';
import TableGameBoldIcon from '@/components/icons/TableGameBoldIcon';
import BaseLayout from '@/components/layouts/base.layout';
import { NoDataComponent } from '@/components/noData/noData';
import GameBannerSlider from '@/components/sliders/gameSliders';
import TabGames from '@/components/tabGames/tabGames';

function CasinoPage() {
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listGame, setListGame] = useState<GameDetail[]>([]);
  const [listSlotsGame, setListSlotsGame] = useState<GameDetail[]>([]);
  const [listProvider, setListProvider] = useState<GameProviderDetail[]>([]);
  const [listTheme, setListTheme] = useState<GameThemeDetail[]>([]);
  const [listHotGame, setListHotGame] = useState<GameThemeDetail[]>([]);
  const [listLiveCasino, setListLiveCasino] = useState<GameThemeDetail[]>([]);
  const [listNewReleases, setListNewReleases] = useState<GameThemeDetail[]>([]);
  const [listBlackjack, setListBlackjack] = useState<GameThemeDetail[]>([]);
  const [listTableGame, setListTableGame] = useState<GameThemeDetail[]>([]);
  const [listMegaways, setListMegaways] = useState<GameThemeDetail[]>([]);
  const [listExclusives, setListExclusives] = useState<GameThemeDetail[]>([]);
  const [tab, setTab] = useState(1);

  const settings: Settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    swipeToSlide: true,
    autoplay: true,
    arrows: false,
    className: 'banner-container',
    responsive: [
      {
        breakpoint: 540,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const filterOptions = [
    {
      icon: <LobbyBoldIcon />,
      title: 'Lobby',
      link: ROUTER.Casino,
      id: 1,
    },
    {
      icon: <OriginalBoldIcon />,
      title: '  Top Picks',
      link: ROUTER.Tagname('Top Picks'),
      id: 2,
    },
    {
      icon: <SlotBoldIcon />,
      title: '  Slots',
      link: ROUTER.Tagname('slots'),
      id: 3,
    },
    {
      icon: <HotGameBoldIcon />,
      title: '  Hot Game',
      link: ROUTER.Tagname('Hot Games'),
      id: 4,
    },
    {
      icon: <LiveCasinoBoldIcon />,
      title: '  Live Casino',
      link: ROUTER.Tagname('Live Casino'),
      id: 5,
    },
    {
      icon: <TableGameBoldIcon />,
      title: '  Table Game',
      link: ROUTER.Tagname('Table Games'),
      id: 6,
    },
    {
      icon: <ReleaseBoldIcon />,
      title: '  New Releases',
      link: ROUTER.Tagname('New Releases'),
      id: 7,
    },
  ];

  const handleGetListGame = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-bonenza-mini-games', { params: { limit: 20 } });
      setListGame(res.data.data);
    } catch (error) {
      setListGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListSlotsGame = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-all-games', { params: { limit: 20, category: 'slots' } });
      setListSlotsGame(res.data.data);
    } catch (error) {
      setListSlotsGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListHotGame = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-hot-list', { params: { limit: 20, tag: 'Hot Games' } });
      setListHotGame(res.data.data);
    } catch (error) {
      setListHotGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListLiveCasino = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-live-casino-list', { params: { limit: 20 } });
      setListLiveCasino(res.data.data);
    } catch (error) {
      setListLiveCasino([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListNewReleases = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-all-games', { params: { limit: 20, releasedAt: 'string desc' } });
      setListNewReleases(res.data.data);
    } catch (error) {
      setListNewReleases([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListBlackjack = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-all-games', { params: { limit: 20, search: 'Blackjack' } });
      setListBlackjack(res.data.data);
    } catch (error) {
      setListBlackjack([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListExclusives = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-all-games', { params: { limit: 20, tag: 'Max Bet' } });
      setListExclusives(res.data.data);
    } catch (error) {
      setListExclusives([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListTableGames = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-all-games', { params: { limit: 20, tag: 'Table Games' } });
      setListTableGame(res.data.data);
    } catch (error) {
      setListTableGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListMegaways = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-all-games', { params: { limit: 20, search: 'Megaways' } });
      setListMegaways(res.data.data);
    } catch (error) {
      setListMegaways([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListProvider = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-provider-list');
      setListProvider(res.data.data);
    } catch (error) {
      setListProvider([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListTheme = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-theme-list');
      setListTheme(res.data.data);
    } catch (error) {
      setListTheme([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetListGame();
    handleGetListTheme();
    handleGetListProvider();
    handleGetListSlotsGame();
    handleGetListHotGame();
    handleGetListLiveCasino();
    handleGetListNewReleases();
    handleGetListBlackjack();
    handleGetListExclusives();
    handleGetListTableGames();
    handleGetListMegaways();
    localStorage.removeItem('tab');
  }, []);

  // const listFilterGame: GameDetail[] = useMemo(() => {
  //   if (tab === 2) return listTopPick;
  //   if (tab === 3) return listSlotsGame;
  //   if (tab === 4) return listHotGame;
  //   if (tab === 5) return listLiveCasino;
  //   if (tab === 6) return listTableGame;
  //   if (tab === 7) return listNewReleases;
  //   else return [];
  // }, [tab, listTopPick, listSlotsGame, listHotGame, listLiveCasino, listTableGame, listNewReleases]);

  return (
    <div className="py-[24px] bg-[#f6f7fa] dark:bg-[#25262B]">
      <Head>
        <title>Casino - Bonenza</title>
      </Head>
      {isLoading && <Loader />}

      <GameBannerSlider className="!mt-0" />
      {/* Search */}
      <div
        className="relative mt-[20px] h-[40px] bg-white dark:bg-[#161D26] rounded-[5px] flex items-center justify-start px-[10px] gap-[20px]"
        onClick={() => dispatch(changeIsShowCasinoSearch(true))}
        role="button"
      >
        <SearchNormal width={24} height={24} className="text-gray-500" />
        <div className={cn('w-full text-[14px] text-gray-500 outline-none')}>{t('casino:gameNameAndProvider')}</div>
      </div>
      {/* Filter Horizontal */}
      <TabGames />
      {/* <div className="relative my-[20px] overflow-x-auto flex gap-[8px]">
        {filterOptions.map((option, key) => {
          return (
            <Link href={option?.link} key={key} className="min-w-fit">
              <div
                role="button"
                className={cn(
                  'flex items-center px-[20px] py-[10px] bg-[#f0f1f5] dark:bg-[#1D1E22] hover:bg-gray-700 gap-[10px] flex-shrink-0 rounded text-black/50 dark:text-white/50 dark:hover:text-white hover:text-black hover:bg-white/90',
                  {
                    'bg-white text-black dark:bg-[#2D3035] dark:text-white': tab === option.id,
                  },
                )}
                onClick={() => {
                  // setTab(option.id);
                  localStorage.setItem('tab', String(option.id));
                }}
              >
                <div
                  className={cn(
                    `${tab === option.id && styles.activeTab}, ${tab === option.id && 'dark:text-white text-black'}`,
                  )}
                >
                  {option.icon}
                </div>
                <span className={`text-[14px] ${tab === option.id && 'dark:text-white text-black'}`}>
                  {option.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div> */}
      {/* Game Options */}
      {tab === 1 && (
        <div className="flex flex-col gap-[30px]">
          <CasinoSS
            title={String(t('casino:bonenzaOriginals'))}
            data={listGame}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Category('Bonenza Mini Games')}
          />
          <RecentBigWinComponent />
          <CasinoSS
            title={String(t('casino:slot'))}
            data={listSlotsGame}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('slots')}
          />
          <CasinoSS
            title={String(t('casino:hotGame'))}
            data={listHotGame}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('Hot Games')}
          />
          <CasinoSS
            title={String(t('casino:liveCasino'))}
            data={listLiveCasino}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('Live Casino')}
          />
          <CasinoSS
            title={String(t('casino:gameProvider'))}
            data={listProvider}
            renderItem={(item: GameProviderDetail) => (
              <Link
                href={ROUTER.Provider(String(item.id))}
                role="button"
                className="p-[8px] max-h-[70px] h-full bg-[#fff] dark:bg-[#31343a] hover:opacity-70 gap-[10px] flex-shrink-0 rounded flex items-center justify-center"
              >
                <Image
                  height={0}
                  width={0}
                  src={`/img/providers/${item?.image}.png`}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.src = `/img/providers/${item?.image}.svg`;
                  }}
                  className="object-cover max-w-[150px] max-h-full w-auto rounded-[5px]"
                />
              </Link>
            )}
          />
          <CasinoSS
            title={String(t('casino:newReleases'))}
            data={listNewReleases}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('New Releases')}
          />
          <CasinoSS
            title={String(t('casino:blackjack'))}
            data={listBlackjack}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('Blackjack')}
          />
          <CasinoSS
            title={String(t('casino:themes'))}
            data={listTheme}
            renderItem={(item: GameThemeDetail) => (
              <Link
                href={ROUTER.Theme(String(item.theme))}
                role="button"
                className="flex items-center h-[64px] justify-center xl:text-[14px] text-[14px] min-w-fit p-[10px] bg-[#fff] dark:bg-[#31343a] hover:opacity-70
                 gap-[10px] flex-shrink-0 rounded text-black dark:text-white dark:hover:text-white/50 hover:text-black/80"
              >
                {snakeCaseToString(item.theme)}
              </Link>
            )}
          />
          <CasinoSS
            title={String(t('casino:bonenzaExclusives'))}
            data={listExclusives}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('Bonenza Exclusives')}
          />
          <CasinoSS
            title={String(t('casino:tableGames'))}
            data={listTableGame}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('Table Games')}
          />
          <CasinoSS
            title={String(t('casino:megaways'))}
            data={listMegaways}
            renderItem={(item) => <GameCard gameDetail={item} />}
            viewAllUrl={ROUTER.Tagname('Megaways')}
          />
        </div>
      )}

      {/* {tab !== 1 && (
        <>
          {!!listFilterGame.length && (
            <>
              <div className="game-grid-parent mt-[20px]">
                {listFilterGame.map((game, index) => {
                  return (
                    <div key={index} className="max-w-[185px]">
                      <GameCard gameDetail={game} />
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {!listFilterGame.length && (
            <div className="py-[100px]">
              <NoDataComponent />
            </div>
          )}
        </>
      )} */}
    </div>
  );
}

CasinoPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default CasinoPage;
