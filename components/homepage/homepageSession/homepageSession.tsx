import Image from 'next/image';
import React from 'react';

import { useTranslation } from '@/base/config/i18next';

type HomepageSessionProps = {
  title?: string;
  iconUrl?: string;
  children?: React.ReactNode;
  showIcon: boolean;
};

const HomepageSession = ({
  title,
  iconUrl = '/img/icon/live-stream.png',
  children,
  showIcon,
}: HomepageSessionProps) => {
  const { t } = useTranslation('');

  return (
    <div className="w-full relative">
      <div className="flex items-center gap-[10px]">
        <Image className={`${showIcon ? 'block' : 'hidden'}`} height={24} width={24} src={iconUrl} alt="" />
        <div className="font-[600] dark:text-white text-[#000] sm:text-[18px] text-[16px]">{title}</div>
      </div>
      <div className={`mt-[15px] lg:max-w-[calc(100vw)]`}>{children}</div>
    </div>
  );
};

export default HomepageSession;
