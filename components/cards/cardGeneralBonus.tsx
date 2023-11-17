import Image from 'next/image';
import { ArrowRight, Clock } from 'iconsax-react';
import { useTheme } from 'next-themes';
import { useDispatch } from 'react-redux';
import { useTranslation } from '@/base/config/i18next';
import { changeIsShowDepositModal } from '@/base/redux/reducers/modal.reducer';
import { useState } from 'react';
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
}: CardGeneralBonusProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const [openModalDepositRule, setOpenModalDepositRule] = useState<boolean>(false);

  return (
    <div>
      {!showDeposit && (
        <div className="rounded-[5px] relative">
          <Image src={background} width={339} height={192} alt="" className="h-[192px] w-full object-cover" />
          <div className="absolute top-5 left-[17px] right-[18px]">
            <div className="flex items-center gap-[10px]">
              <div className="text-[14px] dark:text-white text-[#141414] font-bold">{name}</div>
              <Image
                src={theme === 'dark' ? '/img/icon/icon-question.png' : '/img/icon/icon-question-light.png'}
                width={16}
                height={16}
                alt=""
              />
            </div>
            <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px] mt-[5px]">{description}</div>
            <div className="mt-[10px] flex justify-between w-[60%]">
              <div>
                <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px]">{title}</div>
                <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px]">{total}</div>
              </div>
              <div>
                <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px] text-right">{titleValue}</div>
                <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px] text-right">{totalValue}</div>
              </div>
            </div>
            {(nameButton == t('bonus:questButton') || nameButton == t('bonus:spinButton')) && (
              <div
                role="button"
                className={`dark:bg-[#2D3035] bg-[#F6F7FA] rounded-[5px] w-full text-[12px] font-bold text-center py-[11px] mt-[40px] ${
                  nameButton == t('bonus:questButton') ? 'text-[#FD6E0B]' : 'text-[#0DFDE4]'
                }`}
              >
                {nameButton}
              </div>
            )}
            {name == t('bonus:rollCompetition') && (
              <div
                role="button"
                className={`dark:bg-[#2D3035] bg-[#F6F7FA] rounded-[5px] w-full text-[12px] font-bold text-center py-[11px] mt-[40px] flex items-center justify-center gap-[10px]`}
              >
                <Clock size={16} className="text-[#939699]" />
                <div className="text-[#939699] text-[12px]">{t('bonus:readyIn')}</div>
                <div className="text-[12px] dark:text-white text-[#141414] font-bold">18h:56m:26s</div>
              </div>
            )}
          </div>
        </div>
      )}
      {showDeposit && (
        <div className="dark:bg-[#1C1E22] bg-white rounded-[5px] py-5 px-[18px] h-[192px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <div className="text-[14px] dark:text-white text-[#141414] font-bold">{name}</div>
              <Image src={'/img/icon/icon-question.png'} width={16} height={16} alt="" />
            </div>
            <div className="flex items-center gap-[7px]">
              <div
                className="text-[#0DFDE4] text-[12px] hover:underline cursor-pointer"
                onClick={() => setOpenModalDepositRule(true)}
              >
                {t('bonus:viewDetails')}
              </div>
              <ArrowRight size={10} className="text-[#0DFDE4]" />
            </div>
          </div>
          <div className="mt-[14px] flex justify-between">
            <div>
              <div className="flex items-center gap-[10px]">
                <div className="text-[#939699] text-[12px]">1st</div>
                <div className="dark:bg-[#24262B] bg-[#EAECF3] text-[12px] text-[#939699] py-[2px] px-[10px]">
                  180% {t('bonus:Bonus')}
                </div>
              </div>
              <div className="text-[#939699] text-[12px]">-</div>
              <div className="flex items-center gap-[10px] mt-[7px]">
                <div className="text-[#939699] text-[12px]">3rd</div>
                <div className="dark:bg-[#24262B] bg-[#EAECF3] text-[12px] text-[#939699] py-[2px] px-[10px]">
                  300% {t('bonus:Bonus')}
                </div>
              </div>
              <div className="text-[#939699] text-[12px]">-</div>
            </div>
            <div>
              <div className="flex items-center gap-[10px]">
                <div className="text-[#939699] text-[12px]">2nd</div>
                <div className="dark:bg-[#24262B] bg-[#EAECF3] text-[12px] text-[#939699] py-[2px] px-[10px]">
                  240% {t('bonus:Bonus')}
                </div>
              </div>
              <div className="text-[#939699] text-[12px]">-</div>
              <div className="flex items-center gap-[10px] mt-[7px]">
                <div className="text-[#939699] text-[12px]">4th</div>
                <div className="dark:bg-[#24262B] bg-[#EAECF3] text-[12px] text-[#939699] py-[2px] px-[10px]">
                  360% {t('bonus:Bonus')}
                </div>
              </div>
              <div className="text-[#939699] text-[12px]">-</div>
            </div>
          </div>
          <div
            role="button"
            onClick={() => dispatch(changeIsShowDepositModal(true))}
            className="w-full dark:bg-[#2D3035] bg-[#F6F7FA] text-[#0DFDE4] rounded-[5px] text-[12px] font-bold text-center py-[11px] mt-[10px]"
          >
            {t('bonus:firstDesposit')}
          </div>
        </div>
      )}
      {openModalDepositRule && (
        <ModalDepositBonusRules show={openModalDepositRule} onClose={() => setOpenModalDepositRule(false)} />
      )}
    </div>
  );
}
