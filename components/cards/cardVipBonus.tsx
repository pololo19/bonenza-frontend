import { Crown } from 'iconsax-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { useTranslation } from '@/base/config/i18next';
import { Tooltip } from 'react-tooltip';

type CardVipBonusProps = {
  background: string;
  name: string;
  description: string;
  wagerRequired: string;
  currentTier: string;
  rechargeRate: string;
  readyToClaim: string;
  lastWeeklyBonus: string;
  wagerValue: string;
  tierValue: string;
  rechargeRateValue: string;
  readyToClaimValue: string;
  lastWeekBonusValue: string;
  showHour: boolean;
  showDescription: boolean;
  tooltip: string[];
};

export default function CardVipBonus({
  background,
  name,
  description,
  wagerRequired,
  currentTier,
  rechargeRate,
  readyToClaim,
  lastWeeklyBonus,
  wagerValue,
  tierValue,
  rechargeRateValue,
  readyToClaimValue,
  lastWeekBonusValue,
  showHour,
  showDescription,
  tooltip,
}: CardVipBonusProps) {
  const { t } = useTranslation('');
  const { theme, setTheme } = useTheme();

  return (
    <div className="rounded-[5px] relative min-h-[250px] dark:bg-[#1C1E22] bg-white">
      {/* <Image src={background} width={339} height={192} alt="" className="h-full w-full object-cover" /> */}
      <div className="absolute top-5 bottom-5 left-[18px] right-[18px] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-[10px]">
            <div className="text-[16px] dark:text-white text-[#141414] font-bold">{name}</div>
            {showHour && (
              <div className="bg-color-primary/15 text-[12px] font-bold text-color-primary px-[7px]">
                {t('bonus:hourly')}
              </div>
            )}
            <Image
              src={theme === 'dark' ? '/img/icon/icon-question.png' : '/img/icon/icon-question-light.png'}
              width={16}
              height={16}
              alt=""
              data-tooltip-id={`${name}-bonus-tooltip`}
            />
            <Tooltip
              id={`${name}-bonus-tooltip`}
              place="bottom"
              className="dark:bg-black/0 bg-white z-[30]"
              opacity={100}
            >
              <div className="max-w-[300px] bg-color-card-header-primary p-4 rounded-large">
                {tooltip.map((item, index) => (
                  <div key={index} className="w-full flex gap-2">
                    <div className="min-w-[6px] h-[6px] mt-2 rounded-full bg-color-text-primary"></div>
                    <div>{item}</div>
                  </div>
                ))}
              </div>
            </Tooltip>
          </div>
          {showDescription && (
            <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px] mt-[5px]">
              {description}
            </div>
          )}
        </div>
        <div className="mt-[10px] flex justify-between">
          <div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px]">
              {wagerRequired}
            </div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px]">{currentTier}</div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px]">{rechargeRate}</div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px]">{readyToClaim}</div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px]">
              {lastWeeklyBonus}
            </div>
          </div>
          <div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px] text-right truncate">
              {wagerValue}
            </div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px] text-right truncate">
              {tierValue}
            </div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px] text-right truncate">
              {rechargeRateValue}
            </div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px] text-right truncate">
              {readyToClaimValue}
            </div>
            <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px] text-right truncate">
              {lastWeekBonusValue}
            </div>
          </div>
        </div>
        <div
          role="button"
          className="dark:bg-[#2D3035] bg-color-light-bg-primary flex gap-[10px] items-center justify-center rounded-[5px] h-[38px]"
        >
          <Crown size={20} className="text-[#939699]" />
          <div className="text-[#939699] text-[14px]">{t('bonus:availableAt')} VIP 22</div>
        </div>
      </div>
    </div>
  );
}
