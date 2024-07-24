import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { api_getProviders } from '@/api/game';
import { ROUTER } from '@/base/constants/common';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import Loader from '@/components/common/preloader/loader';
import BaseLayout from '@/components/layouts/base.layout';

type ProviderDetailType = {
  id: string;
  name: string;
  identifier: string;
};

function ProvidersPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [providers, setProviders] = useState<ProviderDetailType[]>([]);

  const getProviders = async () => {
    try {
      setIsLoading(true);
      const _res = await api_getProviders();
      const tempProviders: ProviderDetailType[] = _res.data.map((provider: any) => ({
        id: provider.id,
        name: provider.name,
        identifier: provider.identifier,
      }));
      setProviders(tempProviders);
    } catch (error) {
      setProviders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProviders();
  }, []);

  return (
    <>
      <div className="py-[24px]">
        {isLoading && <Loader />}
        <Breadcrumbs
          data={[{ title: 'Casino', href: ROUTER.Casino }]}
          endpoint={{ title: String(t('casino:gameProvider')), href: ROUTER.Providers }}
        />

        <>
          <div className="game-grid-parent mt-[20px]">
            {providers.map((provider, index) => (
              <div>
                <Link
                  href={ROUTER.Provider(String(provider.name))}
                  role="button"
                  className="p-[8px] max-h-[70px] h-full bg-[#fff] dark:bg-gradient-card-provider hover:opacity-70 gap-[10px] flex-shrink-0 rounded-default flex items-center justify-center"
                >
                  <Image
                    height={54}
                    width={150}
                    src={
                      provider.identifier
                        ? `https://cdn.softswiss.net/logos/providers/color/${provider.identifier}.svg`
                        : `/img/providers/softswiss.png`
                    }
                    alt="provider logo"
                    onError={(e) => {
                      e.currentTarget.src = `/img/providers/softswiss.png`;
                    }}
                    className="!object-contain max-h-[54px] rounded-[5px]"
                  />
                </Link>
                <div className="text-default text-center pt-1">{provider.name}</div>
              </div>
            ))}
          </div>
        </>
      </div>
    </>
  );
}

ProvidersPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default ProvidersPage;
