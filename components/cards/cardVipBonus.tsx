import Image from 'next/image';
import { Crown } from 'iconsax-react';
import { useTheme } from 'next-themes';
import { useTranslation } from '@/base/config/i18next';

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
}: CardVipBonusProps) {
  const { t } = useTranslation('');
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <div className="rounded-[5px] relative">
        <Image src={background} width={339} height={192} alt="" className="h-[192px] w-full object-cover" />
        <div className="absolute top-5 left-[17px] right-[18px]">
          <div className="flex items-center gap-[10px]">
            <div className="text-[14px] dark:text-white text-[#141414] font-bold">{name}</div>
            {showHour && (
              <div className="bg-[#0DFDE4]/15 text-[12px] font-bold text-[#0DFDE4] px-[7px]">{t('bonus:hourly')}</div>
            )}
            <Image
              src={theme === 'dark' ? '/img/icon/icon-question.png' : '/img/icon/icon-question-light.png'}
              width={16}
              height={16}
              alt=""
            />
          </div>
          {showDescription && (
            <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px] mt-[5px]">{description}</div>
          )}
          <div className="mt-[10px] flex justify-between max-[400px]:w-[65%] w-[60%] md:w-[65%] lg:w-[60%]">
            <div>
              <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px]">{wagerRequired}</div>
              <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px]">{currentTier}</div>
              <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px]">{rechargeRate}</div>
              <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px]">{readyToClaim}</div>
              <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px]">{lastWeeklyBonus}</div>
            </div>
            <div>
              <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px] text-right truncate">{wagerValue}</div>
              <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px] text-right truncate">{tierValue}</div>
              <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px] text-right truncate">
                {rechargeRateValue}
              </div>
              <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px] text-right truncate">
                {readyToClaimValue}
              </div>
              <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px] text-right truncate">
                {lastWeekBonusValue}
              </div>
            </div>
          </div>
        </div>
        <div
          role="button"
          className="dark:bg-[#2D3035] bg-[#F6F7FA] flex gap-[10px] items-center justify-center rounded-[5px] h-[38px] absolute bottom-[17px] left-[17px] right-[18px]"
        >
          <Crown size={20} className="text-[#939699]" />
          <div className="text-[#939699] text-[12px]">{t('bonus:availableAt')} VIP 22</div>
        </div>
      </div>
    </div>
  );
}
