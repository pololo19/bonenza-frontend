import { ArrowRight, Clock } from 'iconsax-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { useTranslation } from '@/base/config/i18next';
import { changeIsShowDepositModal } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';

import ModalDepositBonusRules from '../modal/depositBonusRules/depositBonusRules';

type CardGeneralBonusProps = {
  background: string;
  name: string;
  description: string;
  title: string;
  total: string;
  titleValue: string;
  totalValue: string;
  nameButton: string;
  showDeposit: boolean;
  tooltip: string;
  onClick: () => void;
};

export default function CardGeneralBonus({
  background,
  name,
  description,
  title,
  total,
  titleValue,
  totalValue,
  nameButton,
  showDeposit,
  tooltip,
  onClick,
}: CardGeneralBonusProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const [openModalDepositRule, setOpenModalDepositRule] = useState<boolean>(false);

  const { currentDepositTime } = useSelector(
    (state: AppState) => ({
      currentDepositTime: state.wallet.depositTime,
    }),
    shallowEqual,
  );

  return (
    <div className="relative h-full">
      {!showDeposit && (
        <div className="rounded-[5px] relative dark:bg-color-card-body-default bg-white h-full min-h-[250px]">
          <Image src={background} width={339} height={192} alt="" className="h-full w-full object-cover" />
          <div className="absolute top-5 bottom-5 left-[18px] right-[18px] flex flex-col justify-between">
            <div className="flex items-center gap-[10px] p-0">
              <div className="text-[16px] dark:text-white text-color-light-text-primary font-bold">{name}</div>
              <Image
                src={theme === 'dark' ? '/img/icon/icon-question.png' : '/img/icon/icon-question-light.png'}
                width={16}
                height={16}
                alt=""
              />
            </div>
            <div>
              <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px] mt-[5px]">
                {description}
              </div>
              <div className="mt-[10px] flex justify-between w-[60%]">
                <div>
                  <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px]">{title}</div>
                  <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px]">{total}</div>
                </div>
                <div>
                  <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px] text-right">
                    {titleValue}
                  </div>
                  <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px] text-right">
                    {totalValue}
                  </div>
                </div>
              </div>
            </div>
            {(nameButton == t('bonus:questButton') ||
              nameButton == t('bonus:spinButton') ||
              nameButton == t('bonus:unlockRakeBack')) && (
              <div
                role="button"
                className={`dark:bg-color-btn-primary hover:dark:bg-color-hover-primary hover:bg-color-light-hover-primary bg-color-light-bg-primary rounded-[5px] w-full text-[14px] font-medium text-center py-[11px] ${
                  nameButton == t('bonus:questButton') ? 'text-color-secondary' : 'text-color-primary'
                }`}
                onClick={onClick}
              >
                {nameButton}
              </div>
            )}
            {name == t('bonus:rollCompetition') && (
              <div
                role="button"
                className={`dark:bg-color-btn-primary bg-color-light-bg-primary hover:dark:bg-color-hover-primary hover:bg-color-light-hover-primary rounded-[5px] w-full text-[12px] font-bold text-center py-[11px] flex items-center justify-center gap-[10px]`}
              >
                <Clock size={16} className="text-color-text-primary" />
                <div className="text-color-text-primary text-[12px]">{t('bonus:readyIn')}</div>
                <div className="text-[12px] dark:text-white text-color-light-text-primary font-bold">18h:56m:26s</div>
              </div>
            )}
          </div>
        </div>
      )}
      {showDeposit && (
        <div className="dark:bg-color-card-body-default bg-white rounded-[5px] py-5 px-[18px] h-full flex flex-col justify-between min-h-[250px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <div className="text-[16px] dark:text-white text-color-light-text-primary font-bold">{name}</div>
              <Image
                src={'/img/icon/icon-question.png'}
                width={16}
                height={16}
                alt=""
                data-tooltip-id={'deposit-bonus-tooltip'}
              />
              <Tooltip
                id={'deposit-bonus-tooltip'}
                place="bottom"
                className="dark:bg-black/0 bg-white z-[30]"
                opacity={100}
              >
                <div className="max-w-[300px] bg-color-card-header-primary p-4 rounded-large">{tooltip}</div>
              </Tooltip>
            </div>
            <div className="flex items-center gap-[7px]">
              <div
                className="text-color-primary text-[14px] hover:underline cursor-pointer"
                onClick={() => setOpenModalDepositRule(true)}
              >
                {t('bonus:viewDetails')}
              </div>
              <ArrowRight size={10} className="text-color-primary" />
            </div>
          </div>
          <div className="mt-[14px] flex flex-col gap-[5px] text-[14px]">
            <div className="flex justify-between">
              <div className="text-color-text-primary">1st Bonus</div>
              <div className="text-color-text-primary py-[2px] px-[10px]">180%</div>
            </div>
            <div className="flex justify-between">
              <div className="text-color-text-primary">2nd Bonus</div>
              <div className="text-color-text-primary py-[2px] px-[10px]">240%</div>
            </div>
            <div className="flex justify-between">
              <div className="text-color-text-primary">3rd Bonus</div>
              <div className="text-color-text-primary py-[2px] px-[10px]">300%</div>
            </div>
            <div className="flex justify-between">
              <div className="text-color-text-primary">4th Bonus</div>
              <div className="text-color-text-primary py-[2px] px-[10px]">360%</div>
            </div>
          </div>
          <div
            role="button"
            onClick={() => dispatch(changeIsShowDepositModal(true))}
            className="w-full dark:bg-color-btn-primary bg-color-light-bg-primary hover:dark:bg-color-hover-primary hover:bg-color-light-hover-primary text-color-primary rounded-[5px] text-[14px] font-medium text-center py-[11px] mt-[10px]"
          >
            {currentDepositTime == 0 && t('bonus:firstDesposit')}
            {currentDepositTime == 1 && t('promotion:secondDeposit')}
            {currentDepositTime == 2 && t('promotion:thirdDeposit')}
            {currentDepositTime > 2 && t('promotion:depositNow')}
          </div>
        </div>
      )}
      {openModalDepositRule && (
        <ModalDepositBonusRules show={openModalDepositRule} onClose={() => setOpenModalDepositRule(false)} />
      )}
    </div>
  );
}
