import type {
    GetStaticPaths,
    InferGetStaticPropsType,
} from 'next'
import React, { ReactElement, useCallback, useEffect, useState } from 'react';

import { api_getCasinoWithKey, apiSSR_getProviders, SortType } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER, Tags, TagType } from '@/base/constants/common';
import { convert2Url } from '@/base/libs/utils/convert';
import { CategoryType, GameProviderDetail } from '@/base/types/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import GameCategory from '@/components/gameCategory/gameCategory';
import BaseLayout from '@/components/layouts/base.layout';
import ProviderFilter from '@/components/providerFilter/providerFilter';
import SortBy from '@/components/sortBy/sortBy';

export const getStaticPaths = (async () => {
    const tags = [...Tags]
    return {
        paths: tags.map((tag: any) => ({ params: { tag } })),
        fallback: false, // false or "blocking"
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async ({ params }: any) => {
    const tag = params?.tag;
    if (!tag) {
        return { notFound: true }
    } else {
        let category: CategoryType = 'all';
        switch (tag) {
            case 'slots':
                category = 'slots';
                break;
            case 'live-casino':
                category = 'live_casino';
                break;
            case 'hot-games':
                category = 'hot_games';
                break;
            case 'new-releases':
                category = 'new_releases';
                break;
            case 'blackjack':
                category = 'blackjack';
                break;
            case 'feature-buy-in':
                category = 'feature_Buy_In';
                break;
            case 'table-games':
                category = 'table_games';
                break;
            case 'racing':
                category = 'racing';
                break;
            default:
                category = 'all';
                break;
        }
        const _res = await apiSSR_getProviders(category);
        const providers: GameProviderDetail[] = _res.data.map((provider: any) => ({
            id: provider.id,
            name: provider.name,
            isSelect: false,
            totalGames: provider.gameCount,
        }));
        return { props: { params, providers } }
    }

})

function CasinoTagnamePage({ params, providers }: InferGetStaticPropsType<typeof getStaticProps>) {
    const { tag } = params;
    const { t } = useTranslation('');

    const sortBy: Array<{ id: number, label: string, orderValue: SortType, orderBy: string }> = [
        { id: 1, label: String(t('casino:mayLike')), orderValue: 'like', orderBy: '' },
        { id: 2, label: String(t('casino:popular')), orderValue: 'popular', orderBy: 'total_favorite' },
        { id: 3, label: 'A-Z', orderValue: 'asc', orderBy: 'title' },
        { id: 4, label: 'Z-A', orderValue: 'desc', orderBy: 'title' },
        { id: 5, label: String(t('casino:new')), orderValue: 'new', orderBy: 'released_at' },
    ];

    const [listProvider, setListProvider] = useState<GameProviderDetail[]>(providers);
    const [selectedProvider, setSelectedProvider] = useState<string[]>([]);

    const [selectedSortBy, setSelectedSortBy] = useState(sortBy[0]);

    const selectSortBy = useCallback((sort: any) => {
        setSelectedSortBy(sort);
    }, []);

    const getGames = useCallback(async (page: number, pageSize: number) => {
        const query = tag === 'slots' || tag === 'live-casino' || tag === 'racing' ? { sort: selectedSortBy.orderValue } : {};
        let params: any = {
            page,
            pageSize,
            ...query,
            providers: JSON.stringify(selectedProvider)
        };
        const _res = await api_getCasinoWithKey(convert2Url(String(tag)), params);
        return {
            data: _res.data?.games,
            page: _res.data?.page,
            pageSize: _res.data?.pageSize,
            totalPage: _res.data?.totalPage,
            totalCount: _res.data?.totalCount
        }
    }, [selectedProvider, selectedSortBy, tag])

    const convertTag2Label = (tag: string) => {
        let label = '';
        switch (tag) {
            case 'slots':
                label = 'Slots';
                break;
            case 'live-casino':
                label = 'Live Casino';
                break;
            case 'hot-games':
                label = 'Hot Games';
                break;
            case 'new-releases':
                label = 'New Releases';
                break;
            case 'blackjack':
                label = 'Blackjack';
                break;
            case 'feature-buy-in':
                label = 'Feature Buy In';
                break;
            case 'table-games':
                label = 'Table Games';
                break;
            case 'racing':
                label = 'Racing';
                break;
            default:
                label = 'Slots';
                break;
        }
        return label;
    }

    const handleSelectedProvider = useCallback(
        (providerId?: string | undefined) => {
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

    useEffect(() => {
        setSelectedProvider([]);
        setListProvider(providers)
    }, [tag]);


    return (
        <div className="py-[24px]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative gap-x-[32px] gap-y-[16px] flex-wrap">
                <Breadcrumbs
                    data={[{ title: 'Casino', href: ROUTER.Casino }]}
                    endpoint={{ title: convertTag2Label(String(tag) || ''), href: ROUTER.Tagname((String(tag) ?? '') as TagType) }}
                />
                <div className="flex items-center text-[14px] text-[#98a7b5] gap-[12px] md:gap-[48px] max-sm:w-full">
                    {(tag === 'slots' || tag === 'live-casino') && (
                        <SortBy sortBy={sortBy} selectSortBy={selectSortBy} selectedSortBy={selectedSortBy} />
                    )}
                    <ProviderFilter
                        listProvider={listProvider}
                        selectedProvider={selectedProvider}
                        selectProvider={handleSelectedProvider}
                    />
                </div>
            </div>
            <div className="min-h-[380px]">
                <GameCategory getData={getGames} />
            </div>
        </div>
    );
}

CasinoTagnamePage.getLayout = function getLayout(page: ReactElement) {
    return <BaseLayout>{page}</BaseLayout>;
};

export default CasinoTagnamePage;
