import Head from 'next/head';
import { ReactElement, useEffect, useState } from 'react';

import api from '@/api/api';
import { ROUTER } from '@/base/constants/common';
import { GameDetail } from '@/base/types/common';

import { snakeCaseToString } from '@/base/libs/utils';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import BaseLayout from '@/components/layouts/base.layout';
import { NoDataComponent } from '@/components/noData/noData';
import { useRouter } from 'next/router';

function ProviderPage() {
  const { query } = useRouter();
  const { id } = query;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listGame, setListGame] = useState<GameDetail[]>([]);

  const handleGetListGame = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-all-games', { params: { limit: '0', category: id } });
      setListGame(res.data.data);
    } catch (error) {
      setListGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetListGame();
  }, [id]);

  return (
    <div className="py-[24px]">
      <Head>
        <title>Category - Bonenza</title>
      </Head>
      {isLoading && <Loader />}
      <Breadcrumbs
        data={[{ title: 'Casino', href: ROUTER.Casino }]}
        endpoint={{ title: snakeCaseToString(String(id)), href: ROUTER.Category(String(id)) }}
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

ProviderPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default ProviderPage;
