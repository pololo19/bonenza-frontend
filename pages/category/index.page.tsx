import cn from 'classnames';
import { SearchNormal } from 'iconsax-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { snakeCaseToString } from '@/base/libs/utils';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import { GameDetail } from '@/base/types/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import BaseLayout from '@/components/layouts/base.layout';
import { NoDataComponent } from '@/components/noData/noData';

function CasinoTagnamePage() {
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const { query } = useRouter();
  const { key } = query;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowMore, setIsShowMore] = useState<boolean>(true);
  const [listGame, setListGame] = useState<GameDetail[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalGames, setTotalGames] = useState<number>(0);

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
      if (res.data.data.length < 40) {
        setIsShowMore(false);
      }
    } catch (error) {
      setListGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListBonenzaMiniGame = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-bonenza-mini-games', { params: { limit: 40, page: currentPage || 1 } });
      setListGame((current) => [...current, ...res.data.data]);
      setTotalGames(res.data.totalGames);
      if (res.data.data.length < 40) {
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

  const getGames = () => {
    switch (key) {
      case 'Bonenza Mini Games':
        handleGetListBonenzaMiniGame();
        break;
      case 'New Releases':
        handleGetListGame({ releasedAt: 'string desc' });
        break;
      case 'BlackJack':
        handleGetListGame({ search: 'Blackjack' });
        break;
      case 'Megaways':
        handleGetListGame({ search: 'Megaways' });
        break;
      case 'Table Games':
        handleGetListGame({ provider: 'Table Games' });
        break;
      default:
        handleGetListGame({ category: key });
        break;
    }
  };

  useEffect(() => {
    if (key) {
      setListGame([]);
      getGames();
    }
  }, [key]);

  useEffect(() => {
    if (currentPage > 1) getGames();
  }, [currentPage]);

  return (
    <div className="py-[24px]">
      <Head>
        <title>Casino - Bonenza</title>
      </Head>
      {isLoading && <Loader />}

      <Breadcrumbs
        data={[{ title: 'Casino', href: ROUTER.Casino }]}
        endpoint={{ title: snakeCaseToString(String(key) ?? ''), href: ROUTER.Category(String(key) ?? '') }}
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

CasinoTagnamePage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default CasinoTagnamePage;
