import { useTranslation } from '@/base/config/i18next';
import cn from 'classnames';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { ROUTER } from '@/base/constants/common';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '../common/preloader/loader';

type AdminLayoutProps = {
  children: JSX.Element;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { t } = useTranslation('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      {isLoading && <Loader />}
      <div className="min-h-screen h-full w-full overflow-hidden font-dayOne bg-[#f8f8f8]">
        <div className="md:pt-0 h-full w-full relative">
          <div className="h-[60px] py-2 px-6 w-full bg-[#24262b]">
            <Link href={ROUTER.AdminReferral} className="flex items-center">
              <Image
                width={165}
                height={57}
                className="max-w-[60px] max-h-[40px]"
                src="/img/logo-mobile.png"
                alt="logo"
              />
            </Link>
          </div>
          <div className="flex h-[calc(100vh-60px)] w-full max-h-[calc(100vh-60px)]">
            <div className="md:block hidden max-w-[250px] w-full py-1 bg-[#1e2024] h-full text-white overflow-y-auto text-[14px] font-[500] flex flex-col items-start gap-2">
              <Link
                href={ROUTER.AdminReferral}
                className={cn('px-6 py-2 text-[#99a4b0] hover:text-[#dab03a] hover:bg-gray-500/40 w-full block', {
                  'bg-gray-500/40 text-[#dab03a]': ROUTER.AdminReferral.includes(router.pathname),
                })}
              >
                Referral Codes
              </Link>
              <Link
                href={ROUTER.AdminFriends}
                className={cn('px-6 py-2 text-[#99a4b0] hover:text-[#dab03a] hover:bg-gray-500/40 w-full block', {
                  'bg-gray-500/40 text-[#dab03a]': ROUTER.AdminFriends.includes(router.pathname),
                })}
              >
                Friends Management
              </Link>
              <Link
                href={ROUTER.AdminCommissions}
                className={cn('px-6 py-2 text-[#99a4b0] hover:text-[#dab03a] hover:bg-gray-500/40 w-full block', {
                  'bg-gray-500/40 text-[#dab03a]': ROUTER.AdminCommissions.includes(router.pathname),
                })}
              >
                Commission Rewards
              </Link>
              <Link
                href={ROUTER.AdminRewards}
                className={cn('px-6 py-2 text-[#99a4b0] hover:text-[#dab03a] hover:bg-gray-500/40 w-full block', {
                  'bg-gray-500/40 text-[#dab03a]': ROUTER.AdminRewards.includes(router.pathname),
                })}
              >
                USD Rewards
              </Link>
            </div>
            <div className="overflow-y-auto w-full p-6">{children}</div>
            {/*Start footer navigator */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
