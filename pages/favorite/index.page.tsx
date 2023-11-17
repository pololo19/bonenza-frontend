import Head from 'next/head';
import { ReactElement, useEffect, useState } from 'react';

import api from '@/api/api';
import { ROUTER } from '@/base/constants/common';
import { GameDetail } from '@/base/types/common';

import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import withAuth from '@/components/hoc/withAuth';
import BaseLayout from '@/components/layouts/base.layout';
import { NoDataComponent } from '@/components/noData/noData';
import { useTranslation } from '@/base/config/i18next';

function FavoritePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listGame, setListGame] = useState<GameDetail[]>([]);
  const { t } = useTranslation('');

  const handleGetListGame = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-favorite-list', { params: { limit: 40 } });
      setListGame(res.data.data);
    } catch (error) {
      setListGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetListGame();
  }, []);

  return (
    <div className="py-[24px]">
      <Head>
        <title>Favorite Games - Bonenza</title>
      </Head>
      {isLoading && <Loader />}
      <Breadcrumbs
        data={[{ title: 'Casino', href: ROUTER.Casino }]}
        endpoint={{ title: String(t('casino:favorite')), href: ROUTER.Favorite }}
      />
      {!!listGame.length && (
        <div className="game-grid-parent mt-[20px]">
          {listGame.map((game, index) => {
            return (
              <div key={index} className="max-w-[185px]">
                <GameCard gameDetail={game} />
              </div>
            );
          })}
        </div>
      )}
      {!listGame.length && (
        <div className="py-[100px]">
          <NoDataComponent />
        </div>
      )}
    </div>
  );
}

const FavoritePageAuth = withAuth(FavoritePage);

FavoritePageAuth.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default FavoritePageAuth;
