import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ROUTER } from '@/base/constants/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import Loader from '@/components/common/preloader/loader';
import BaseLayout from '@/components/layouts/base.layout';
import { api_getProviders, api_getThemes } from '@/api/game';
import { snakeCaseToString } from '@/base/libs/utils';

type ProviderDetailType = {
  id: string;
  name: string;
  identifier: string;
};

function ThemePage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listTheme, setListTheme] = useState<string[]>([]);

  const getThemes = async () => {
    try {
      setIsLoading(true);
      const res = await api_getThemes();
      const themes = [...res.data];
      setListTheme(themes);
    } catch (error) {
      setListTheme([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getThemes();
  }, []);

  return (
    <>
      <div className="py-[24px]">
        {isLoading && <Loader />}
        <Breadcrumbs
          data={[{ title: 'Casino', href: ROUTER.Casino }]}
          endpoint={{ title: String(t('casino:themes')), href: ROUTER.Themes }}
        />

        <>
          <div className="game-grid-parent mt-[20px]">
            {listTheme.map((theme, index) => (
              <Link
                key={index}
                href={ROUTER.Theme(String(theme))}
                role="button"
                className="flex items-center sm:h-[64px] h-[50px] justify-center xl:text-[14px] text-[14px] min-w-fit p-[10px] bg-[#fff] dark:bg-color-card-bg-default hover:opacity-70
               gap-[10px] flex-shrink-0 rounded text-black dark:text-white dark:hover:text-white/50 hover:text-black/80 text-center"
              >
                {snakeCaseToString(theme)}
              </Link>
            ))}
          </div>
        </>
      </div>
    </>
  );
}

ThemePage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default ThemePage;
