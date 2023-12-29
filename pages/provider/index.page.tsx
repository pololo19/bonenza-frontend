import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import cn from 'classnames';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTranslation } from '@/base/config/i18next';
import api from '@/api/api';
import { GameDetail, GameProviderDetail } from '@/base/types/common';
import { ROUTER } from '@/base/constants/common';
import BaseLayout from '@/components/layouts/base.layout';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import { NoDataComponent } from '@/components/noData/noData';
import styles from './index.module.scss';
import { titleCase } from '@/base/libs/utils';
import CasinoSS from '@/components/casino/casinoSS';

function ProviderPage() {
  const { t } = useTranslation('');
  const { query } = useRouter();
  const { id } = query;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listGame, setListGame] = useState<GameDetail[]>([]);
  const [listRelated, setListRelated] = useState<GameDetail[]>([]);
  const [providerDetail, setProviderDetail] = useState<GameProviderDetail | any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [isShowMore, setIsShowMore] = useState<boolean>(true);
  const [isShowMoreProvider, setIsShowMoreProvider] = useState<boolean>(false);

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
      const res = await api.get('game/get-all-games', { params: { limit: 40, page: currentPage || 1, provider: id } });
      setListGame((current) => [...current, ...res.data.data]);
      setTotalGames(res.data.totalGames);
      if (res.data.data.length < 40 || listGame.length + res.data.data.length === totalGames) {
        setIsShowMore(false);
      }
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
      handleGetListGame();
      handleGetProviderDetail();
      handleGetListRelatedGame();
    }
  }, [id]);

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
        endpoint={{ title: String(providerDetail?.name), href: ROUTER.Provider(String(id)) }}
      />

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
          <div className="sm:text-[24px] text-[16px] mb-[10px] dark:text-white text-black">
            {' '}
            {titleCase(String(providerDetail?.name || ''))}
          </div>
          <div className="text-[14px] text-gray-400 mb-[10px]">
            {t('casino:officialWebsite')} {providerDetail?.name}
          </div>
          <div className="flex items-center text-[14px] text-gray-400 gap-[10px]">
            <div className="text-center">
              <div>{totalGames}</div>
              <div>{t('casino:games')}</div>
            </div>
            <div className="text-center">
              <div>2012</div>
              <div>{t('casino:founded')}</div>
            </div>
          </div>
        </div>
      </div>

      {providerDetail?.introduction && (
        <div className="mt-[30px]">
          <div>
            {t('casino:aboutUs')} {providerDetail?.name}
          </div>
          <div
            className={cn('w-full relative mt-[10px]', !isShowMoreProvider && styles.providerSortIntroduction, {
              'h-[150px] overflow-hidden': !isShowMoreProvider,
            })}
          >
            <div className={cn('whitespace-pre-line mb-[15px] text-gray-400 text-[14px]')}>
              {providerDetail?.introduction}
            </div>
          </div>
          <div
            role="button"
            className="text-[12px] text-amber-500 px-[20px] py-[10px] border border-solid border-gray-700 rounded w-fit"
            onClick={() => setIsShowMoreProvider((prev) => !prev)}
          >
            {!isShowMore ? t('homePage:showMore') : t('homePage:showLess')}
          </div>
        </div>
      )}

      <>
        <div className="sm:text-[24px] text-[16px] mt-[24px] dark:text-white text-black">
          {titleCase(String(providerDetail?.name || ''))} {t('layout:games')}
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
