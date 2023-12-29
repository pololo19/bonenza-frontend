import React, { ReactElement, useEffect, useState } from 'react';
import Head from 'next/head';

import { useTranslation } from '@/base/config/i18next';
import api from '@/api/api';
import { GameDetail, GameProviderDetail } from '@/base/types/common';
import { ROUTER } from '@/base/constants/common';

import BaseLayout from '@/components/layouts/base.layout';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import { NoDataComponent } from '@/components/noData/noData';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { titleCase } from '@/base/libs/utils';

function ProviderPage() {
  const { t } = useTranslation('');
  const { query } = useRouter();
  const { id } = query;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listGame, setListGame] = useState<GameDetail[]>([]);
  const [providerDetail, setProviderDetail] = useState<GameProviderDetail | any>();

  const handleGetProviderDetail = async () => {
    try {
      setIsLoading(true);
      // const res = await api.get('game/get-provider-detail', { params: { provider: id } });
      // setProviderDetail(res.data.data);
    } catch (error) {
      setProviderDetail({});
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListGame = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-all-games', { params: { provider: id } });
      setListGame(res.data.data);
    } catch (error) {
      setListGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetProviderDetail();
    handleGetListGame();
  }, [id]);

  return (
    <div className="py-[24px]">
      <Head>
        <title>Provider - Bonenza</title>
      </Head>
      {isLoading && <Loader />}
      <Breadcrumbs
        data={[{ title: 'Casino', href: ROUTER.Casino }]}
        endpoint={{ title: String(providerDetail?.name), href: ROUTER.Provider(String(id)) }}
      />
      đ
      <div className="flex items-center justify-start gap-[20px] mt-[24px]">
        <div className="h-[130px] w-[130px] rounded-full bg-[#1c1e22] border border-solid border-gray-500 flex items-center justify-center">
          <Image
            height={0}
            width={0}
            // src={`https://cdn.softswiss.net/logos/providers_small/color/${id}.svg`}
            src={`/img/providers/${id}.png`}
            alt=""
            className="object-cover w-auto rounded-[5px]"
          />
        </div>
        <div className="h-full">
          <div className="sm:text-[24px] text-[16px] mb-[10px]">{titleCase(String(providerDetail?.name || ''))}</div>
          <div className="text-[14px] text-gray-400 mb-[10px]">Official website {providerDetail?.name}</div>
          <div className="flex items-center text-[14px] text-gray-400 gap-[10px]">
            <div className="text-center">
              <div>{listGame.length}</div>
              <div>{t('provider:games')}</div>
            </div>
            <div className="text-center">
              <div>2012</div>
              <div>{t('provider:founded')}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:text-[24px] text-[16px] mt-[24px]">
        {titleCase(String(providerDetail?.name || ''))}
        {t('layout:games')}
      </div>
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
