import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ElementType, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CommonModal from '../commonModal/commonModal';
import { format } from 'date-fns';
import Image from 'next/image';
import cn from 'classnames';

type ModalQuest = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type QuestItemProps = {
  header: ReactNode;
  description: string;
  extra: ReactNode;
  earn: number;
};

const QuestItem = ({ header, description, extra, earn }: QuestItemProps) => {
  return (
    <>
      <div className="flex p-[15px] justify-between bg-color-active-primary rounded-default">
        <div className="flex flex-col gap-[5px]">
          {header}
          <p className="dark:text-color-text-primary text-color-light-text-primary text-[12px]">{description}</p>
          <div className="flex gap-[5px] items-center">
            <Image width={50} height={50} className="w-[16px] h-[16px]" src="/img/fiats/USDT.png" alt="" />
            <p className="text-color-secondary font-bold text-[16px] italic">{`Earn ${earn} USDT`}</p>
          </div>
        </div>
        {extra}
      </div>
    </>
  );
};

export default function ModalQuest({ show, onClose }: ModalQuest) {
  const { t } = useTranslation();

  const [selectedType, setSelectedType] = useState('daily');
  const [mockDatas, setMockDatas] = useState<{ title: string; description: string; earn: number }[]>([
    { title: 'Just Wager On', description: t('quest:justWager', { amount: 600 }), earn: 0.2 },
    {
      title: 'Wheel Master',
      description: 'Winning streak of 3 rounds in Wheel with bets greater than $ 0.4.',
      earn: 0.1,
    },
    {
      title: 'Video Poker Master',
      description: 'Winning streak of 3 rounds in Video Pocker with bets greater than $ 0.4',
      earn: 0.1,
    },
  ]);

  const [mockWeeklyDatas, setMockWeeklyDatas] = useState<{ title: string; description: string; earn: number }[]>([
    { title: 'Wager Week', description: 'Daily wager reaches $100', earn: 0.7 },
  ]);

  return (
    <>
      <CommonModal
        show={show}
        panelClass="sm:rounded max-w-full sm:max-w-[600px] sm:!h-[80vh]"
        onClose={onClose}
        header={
          <>
            <div className="flex flex-col items-start dark:bg-color-header-primary bg-color-light-bg-primary px-[20px] py-[20px] gap-[20px]">
              <div className="text-black dark:text-white md:text-[18px] text-[16px] sm:mb-0 mb-[10px] font-bold">
                {t('quest:questHub')}
              </div>
            </div>
          </>
        }
      >
        <div className="flex flex-col px-5 pt-1 items-center gap-[10px]">
          <div className="flex dark:text-color-text-primary justify-start w-full">{format(new Date(), 'eeee')}</div>
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-[10px] text-white">
              <span className="text-default">{t('quest:accumulateRewards')}</span>
              <div className="flex gap-[10px] items-center">
                <Image width={50} height={50} className="w-[25px] h-[25px]" src={'/img/fiats/USDT.png'} alt="" />
                <span className="text-[20px] font-bold">{`${0} USDT`}</span>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-2 w-full">
            <div
              className={cn(
                'flex-1 flex items-center hover:opacity-[0.9] justify-center border-b-2 border-solid pb-[10px]',
                { 'bg-gradient-to-t from-color-primary/20 border-color-primary': selectedType === 'daily' },
                { 'dark:border-[#272C33] border-[#ccc]': selectedType !== 'daily' },
              )}
              onClick={() => setSelectedType('daily')}
              role="button"
            >
              {t('quest:dailyQuest')}
            </div>
            <div
              className={cn(
                'flex-1 flex items-center hover:opacity-[0.9] justify-center border-b-2 border-solid pb-[10px]',
                { 'bg-gradient-to-t from-color-primary/20 border-color-primary': selectedType === 'weekly' },
                { 'dark:border-[#272C33] border-[#ccc]': selectedType !== 'weekly' },
              )}
              onClick={() => setSelectedType('weekly')}
              role="button"
            >
              {t('quest:weeklyQuest')}
            </div>
          </div>

          <div className="flex flex-col w-full gap-[10px]">
            {selectedType === 'daily' && (
              <>
                <div className="gap-[10px] text-color-text-primary">{t('quest:expiredIn')}</div>
                {mockDatas.map((item) => (
                  <QuestItem
                    header={<div className="flex text-[16px] font-bold">{item.title}</div>}
                    description={item.description}
                    extra={
                      <div className="flex items-center">
                        <button className="min-w-[80px] bg-gradient-btn-play h-fit py-[8px] rounded-default">
                          {t('quest:go')}
                        </button>
                      </div>
                    }
                    earn={item.earn}
                  />
                ))}
              </>
            )}

            {selectedType === 'weekly' && (
              <>
                <div className="gap-[10px] text-color-text-primary">{t('quest:expiredIn')}</div>
                {mockWeeklyDatas.map((item, index) => (
                  <QuestItem
                    key={index}
                    header={<div className="flex text-[16px] font-bold">{item.title}</div>}
                    description={item.description}
                    extra={
                      <div className="flex items-center">
                        <button className="min-w-[80px] bg-gradient-btn-play h-fit py-[8px] rounded-default">
                          {t('quest:go')}
                        </button>
                      </div>
                    }
                    earn={item.earn}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </CommonModal>
    </>
  );
}
