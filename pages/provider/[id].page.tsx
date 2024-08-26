import type {
    GetStaticPaths,
    InferGetStaticPropsType,
} from 'next'
import Link from 'next/link';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import { api_getGamesByProvider, api_getPickGames, apiSSR_getPickGames, apiSSR_getProviders, SortType } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { titleCase } from '@/base/libs/utils';
import { GameListType } from '@/base/types/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import { NoDataComponent } from '@/components/noData/noData';
import BaseLayout from '@/components/layouts/base.layout';
import CasinoSS from '@/components/casino/casinoSS';
import GameCard from '@/components/gameCard/gameCard';
import Loader from '@/components/common/preloader/loader';
import SortBy from '@/components/sortBy/sortBy';

export const getStaticPaths = (async () => {
    const response = await apiSSR_getProviders();
    const providers = response.data;
    return {
        paths: providers.map((provider: any) => ({ params: { id: provider.name } })),
        fallback: true, // false or "blocking"
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async ({ params }: any) => {
    const response = await apiSSR_getPickGames(1, 20);
    const games: GameListType[] = response.data.games?.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item.payout || 0),
        multiplier: Number(item.profitMultiplier || 0),
        providerName: item?.producerName ?? '',
        releasedAt: '',
    }))
    return { props: { games, params } }
})


function ProviderPage({ games, params }: InferGetStaticPropsType<typeof getStaticProps>) {
    const { t } = useTranslation('');

    const sortBy = [
        { id: 2, label: String(t('casino:Popular')), orderValue: 'popular', orderBy: 'total_favorite' },
        { id: 3, label: 'A-Z', orderValue: 'asc', orderBy: 'title' },
        { id: 4, label: 'Z-A', orderValue: 'desc', orderBy: 'title' },
        { id: 5, label: String(t('casino:new')), orderValue: 'desc', orderBy: 'released_at' },
    ];

    const { id } = params;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listGame, setListGame] = useState<GameListType[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalGames, setTotalGames] = useState<number>(0);
    const [isShowMore, setIsShowMore] = useState<boolean>(true);

    const [selectedSortBy, setSelectedSortBy] = useState(sortBy[0]);

    const getListGames = useCallback(
        async (page: number = currentPage) => {
            try {
                setIsLoading(true);
                const _res = await api_getGamesByProvider(String(id), selectedSortBy.orderValue as SortType, page || 1, 40);
                const totalCount = _res?.data?.totalCount ?? 0;
                const games = _res?.data?.data ?? [];
                const tempGameListData: GameListType[] = games?.map((item: any) => ({
                    id: item?.id ?? '',
                    title: item?.title ?? '',
                    description: item?.description ?? '',
                    identifier: item?.identifier ?? '',
                    payout: Number(item?.payout ?? 0),
                    multiplier: Number(item?.profitMultiplier ?? 0),
                    releasedAt: item?.releasedAt ?? '',
                    providerName: item?.producerName ?? '',
                }));
                if (totalCount <= 40 || games.length < 40) {
                    setIsShowMore(false);
                }
                setListGame((current) => [...current, ...tempGameListData]);
                setTotalGames(totalCount);
            } catch (error) {
                setListGame([]);
            } finally {
                setIsLoading(false);
            }
        },
        [currentPage, id, selectedSortBy],
    );

    const percent = useMemo(() => {
        return Number((listGame.length / totalGames) * 100).toFixed(0);
    }, [listGame, totalGames]);

    useEffect(() => {
        if (id !== '' && id != undefined && id !== 'undefined') {
            setCurrentPage(1);
            setIsShowMore(true);

            setListGame([]);
            getListGames(1);
        }
    }, [id, selectedSortBy]);

    useEffect(() => {
        if (currentPage > 1) getListGames();
    }, [currentPage]);


    return (
        <div className="py-[24px]">
            {isLoading && <Loader />}
            <Breadcrumbs
                data={[{ title: 'Casino', href: ROUTER.Casino }]}
                endpoint={{ title: String(id), href: ROUTER.Provider(String(id)) }}
            />
            <div className="sm:flex grid grid-cols-2 sm:justify-between mt-[10px] items-center justify-start gap-[30px]">
                <p className="text-color-primary cursor-pointer sm:text-[16px] text-[14px]">
                    <Link href={ROUTER.Providers}>{`${t('gameDetail:viewAll')} ${t('layout:providers')}`}</Link>
                </p>
                <SortBy
                    sortBy={sortBy}
                    selectSortBy={(sort) => setSelectedSortBy(sort)}
                    selectedSortBy={selectedSortBy}
                    label={false}
                />
            </div>
            <>
                <div className="sm:text-[24px] text-[16px] mt-[24px] dark:text-white text-black">
                    {titleCase(String(id))} {t('layout:games')}
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
                                    className="flex items-center dark:bg-color-card-bg-primary bg-white py-[8px] px-[12px] rounded-[5px]"
                                    role="button"
                                    onClick={() => {
                                        setCurrentPage(currentPage + 1);
                                    }}
                                >
                                    <div className="text-[11px] sm:text-default text-[#FFFFFF] font-semibold">{t('casino:loadMore')}</div>
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
                        data={games}
                        renderItem={(item) => <GameCard gameDetail={item} />}
                        viewAllUrl={ROUTER.Tagname('live-casino')}
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