import classNames from 'classnames';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import Link from 'next/link';
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { AppState } from '@/base/redux/store';

type CasinoSSProps<T> = {
  icon?: JSX.Element;
  title?: string;
  data: T[];
  renderItem: (game: T) => ReactNode;
  onClickItem?: (game: T) => void;
  viewAllUrl?: string;
  isShowArrow?: boolean;
};

const CasinoSS = <T,>({
  title,
  icon,
  data,
  renderItem,
  viewAllUrl,
  isShowArrow = true,
  onClickItem,
}: CasinoSSProps<T>): JSX.Element => {
  const { t } = useTranslation('');
  const [slide, setSlide] = useState<number>(8);
  const [disablePrev, setDisablePrev] = useState<boolean>();
  const [disableNext, setDisableNext] = useState<boolean>();

  const { showChatType, isToggleSidebar } = useSelector(
    (state: AppState) => ({
      showChatType: state.modal.showChatType,
      isToggleSidebar: state.modal.isToggleSidebar,
    }),
    shallowEqual,
  );

  const handleSlideToShow = useCallback(
    (num: number) => {
      let newNum = num;
      if (showChatType) newNum -= 2;
      if (isToggleSidebar) newNum--;
      return newNum;
    },
    [showChatType, isToggleSidebar],
  );

  useEffect(() => {
    handleNumberSlide(window.innerWidth);
    window.addEventListener('resize', (e: UIEvent) => handleNumberSlide((e.target as Window).innerWidth));
  }, [handleSlideToShow]);

  const handleNumberSlide = (width: number) => {
    if (width > 1890) {
      setSlide(7);
    } else if (width > 1335) {
      setSlide(handleSlideToShow(7));
    } else if (width > 1200) {
      setSlide(handleSlideToShow(6));
    } else if (width > 1163) {
      setSlide(6);
    } else if (width > 991) {
      setSlide(5);
    } else if (width > 860) {
      setSlide(4);
    } else if (width > 693) {
      setSlide(3);
    } else {
      setSlide(3);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    const scrollContainer = containerRef.current;
    const firstChild = scrollContainer?.firstChild as Element;
    if (scrollContainer && firstChild) {
      scrollContainer.scrollBy(slide * firstChild?.clientWidth, 0);
    }
  }, [slide]);

  const prevSlide = useCallback(() => {
    const scrollContainer = containerRef.current;
    const firstChild = scrollContainer?.firstChild as Element;
    if (scrollContainer && firstChild) {
      scrollContainer.scrollBy(-1 * slide * firstChild?.clientWidth, 0);
    }
  }, [slide]);

  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (scrollContainer) {
      const maxScrollLeft = scrollContainer?.scrollWidth - scrollContainer?.clientWidth;
      setDisableNext(scrollContainer?.scrollLeft >= maxScrollLeft);
      setDisablePrev(scrollContainer?.scrollLeft === 0);
      scrollContainer?.addEventListener('scroll', (e: Event) => {
        const newMaxScrollLeft = scrollContainer?.scrollWidth - scrollContainer?.clientWidth;
        setDisablePrev(scrollContainer?.scrollLeft === 0);
        setDisableNext(Math.abs(scrollContainer?.scrollLeft - newMaxScrollLeft) < 5);
      });
      window.addEventListener('resize', (e: UIEvent) => {
        const newMaxScrollLeft = scrollContainer?.scrollWidth - scrollContainer?.clientWidth;
        setDisablePrev(scrollContainer?.scrollLeft === 0);
        setDisableNext(Math.abs(scrollContainer?.scrollLeft - newMaxScrollLeft) < 5);
      });
    }
  }, [slide, data]);

  return (
    <>
      {!!data?.length && (
        <div className="w-full relative">
          <div className="flex items-center gap-[10px] justify-between">
            <div className="flex items-center gap-[10px]">
              {icon}
              <div className="font-[600] dark:text-white text-[#000] sm:text-[18px] text-[16px]">{title}</div>
            </div>
            {isShowArrow && (
              <div className="flex gap-[5px] justify-end text-white">
                {viewAllUrl && (
                  <Link
                    href={viewAllUrl}
                    role="button"
                    className="dark:bg-[#1D1E22] bg-white rounded-[5px] font-bold text-[10px] dark:text-color-primary text-[#000] px-[10px] py-[8px] hover:bg-[#6b7180] hover:text-white"
                  >
                    {t('gameDetail:viewAll')}
                  </Link>
                )}
                {title !== String(t('casino:gameProvider')) && (
                  <>
                    <div
                      role="button"
                      className={classNames(
                        'dark:bg-[#1D1E22] bg-white text-gray-400 rounded-[5px] p-[10px] hover:bg-[#6b7180]',
                        {
                          'bg-[#1D1E22]/40 hover:bg-[#1D1E22]/40 text-gray-400 pointer-events-none': disablePrev,
                        },
                      )}
                      onClick={() => {
                        prevSlide();
                      }}
                    >
                      <ArrowLeft2 size={10} />
                    </div>
                    <div
                      role="button"
                      className={classNames(
                        'dark:bg-[#1D1E22] text-gray-400 bg-white rounded-[5px] p-[10px] hover:bg-[#6b7180]',
                        {
                          'bg-[#1D1E22]/40 hover:bg-[#1D1E22]/40 text-gray-400 pointer-events-none': disableNext,
                        },
                      )}
                      onClick={() => {
                        nextSlide();
                      }}
                    >
                      <ArrowRight2 size={10} />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div className={`mt-[15px]`}>
            <div
              className={classNames(
                'grid grid-flow-col snap-x-[mandatory] scroll-smooth overflow-x-auto overflow-y-hidden gap-[10px] sm:grid-rows-1',
                {
                  'grid-rows-1': title !== String(t('casino:gameProvider')),
                  'grid-rows-2': title === String(t('casino:gameProvider')),
                },
              )}
              style={{
                gridAutoColumns: `calc(100% / ${slide} - (${slide} - 1) * 10px / ${slide})`,
                scrollSnapType: 'x mandatory',
              }}
              ref={containerRef}
            >
              {data?.map((game, key) => {
                return (
                  <div key={key} className="cursor-pointer snap-start section" onClick={() => onClickItem?.(game)}>
                    {renderItem(game)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CasinoSS;
