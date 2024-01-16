import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { setCasinoTab } from '@/base/redux/reducers/common.reducer';
import { useAppDispatch } from '@/base/redux/store';
import HotGameBoldIcon from '@/components/icons/HotGameBoldIcon';
import LiveCasinoBoldIcon from '@/components/icons/LiveCasinoBoldIcon';
import LobbyBoldIcon from '@/components/icons/LobbyBoldIcon';
import OriginalBoldIcon from '@/components/icons/OriginalBoldIcon';
import ReleaseBoldIcon from '@/components/icons/ReleaseBoldIcon';
import SlotBoldIcon from '@/components/icons/SlotBoldIcon';
import TableGameBoldIcon from '@/components/icons/TableGameBoldIcon';
import styles from '@/styles/dashboard/index.module.scss';
type tabGamesProps = {
  setCurrentPage?: (page: number) => void;
  ishome?: boolean;
};

const TabGames = (props: tabGamesProps) => {
  const { setCurrentPage, ishome = false } = props;
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();
  const { route } = useRouter();
  const [tab, setTab] = useState<number>(1);

  useEffect(() => {
    const tabStorage = localStorage.getItem('tab');
    setTab(Number(tabStorage));
  }, []);

  const filterOptions = [
    {
      icon: <LobbyBoldIcon />,
      title: t('casino:lobby'),
      link: ROUTER.Casino,
      homeLink: '/',
      id: 1,
    },
    {
      icon: <OriginalBoldIcon />,
      title: t('casino:topPicks'),
      link: ROUTER.Tagname('Top Picks'),
      homeLink: `/?key=Top Picks`,
      id: 2,
    },
    {
      icon: <SlotBoldIcon />,
      title: t('casino:slot'),
      link: ROUTER.Tagname('slots'),
      homeLink: `/?key=slots`,
      id: 3,
    },
    {
      icon: <HotGameBoldIcon />,
      title: t('casino:hotGame'),
      link: ROUTER.Tagname('Hot Games'),
      homeLink: `/?key=Hot Games`,
      id: 4,
    },
    {
      icon: <LiveCasinoBoldIcon />,
      title: t('casino:liveCasino'),
      link: ROUTER.Tagname('Live Casino'),
      homeLink: `/?key=Live Casino`,
      id: 5,
    },
    {
      icon: <TableGameBoldIcon />,
      title: t('casino:tableGames'),
      link: ROUTER.Tagname('Table Games'),
      homeLink: `/?key=Table Games`,
      id: 6,
    },
    {
      icon: <ReleaseBoldIcon />,
      title: t('casino:newReleases'),
      link: ROUTER.Tagname('New Releases'),
      homeLink: `/?key=New Releases`,
      id: 7,
    },
  ];

  return (
    <div className="relative sm:my-[20px] mt-[10px] max-w-full overflow-x-auto snap-x snap-mandatory flex sm:flex-wrap flex-nowrap gap-[8px]">
      {filterOptions.map((option, key) => {
        return (
          <Link href={ishome ? option?.homeLink : option?.link} key={key} className="min-w-fit">
            <div
              role="button"
              className={cn(
                'flex items-center px-[20px] py-[10px] bg-[#f0f1f5] dark:bg-[#1D1E22] hover:bg-gray-700 gap-[10px] flex-shrink-0 rounded text-black/50 dark:text-white/50 dark:hover:text-white hover:text-black hover:bg-white/90',
                {
                  'bg-white text-black dark:bg-[#2D3035] dark:text-white': route === option.link,
                },
              )}
              onClick={() => {
                setTab(option.id);
                setCurrentPage?.(1);
                dispatch(setCasinoTab(true));
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
              <span className={`text-[14px] ${tab === option.id && 'dark:text-white text-black'}`}>{option.title}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default TabGames;
