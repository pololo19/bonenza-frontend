import { useTranslation } from '@/base/config/i18next';
import { useTheme } from 'next-themes';
import Image from 'next/image';

type NoDataComponentProps = {
  noDataText?: string;
};

export const NoDataComponent = ({ noDataText }: NoDataComponentProps) => {
  const { t } = useTranslation('');
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center gap-[15px] text-[#53575C]">
      <Image
        src={theme === 'dark' ? '/img/no-data.png' : '/img/no-data-light-mode.png'}
        alt="noData"
        width={150}
        height={150}
      />
      {noDataText || t('table:noData')}
    </div>
  );
};
