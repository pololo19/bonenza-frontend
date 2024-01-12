import Image from 'next/image';
import { useTheme } from 'next-themes';

import { useTranslation } from '@/base/config/i18next';

type NoDataComponentProps = {
  noDataText?: string;
};

export const NoDataComponent = ({ noDataText }: NoDataComponentProps) => {
  const { t } = useTranslation('');
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center gap-[15px] text-[#53575C]">
      <Image
        className="sm:w-[150px] sm:h-[150px] w-[80px] h-[80px]"
        src={theme === 'dark' ? '/img/no-data.png' : '/img/no-data-light-mode.png'}
        alt="noData"
        width={150}
        height={150}
      />
      {noDataText || t('table:noData')}
    </div>
  );
};
