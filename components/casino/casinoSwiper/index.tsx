import 'swiper/css';

import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useWidth } from '@/base/hooks/useWidth';
import { AppState } from '@/base/redux/store';

type CasinoSwiperProps<T> = {
  icon?: JSX.Element;
  title?: string;
  data: T[];
  maxCount?: number;
  renderItem: (game: T) => ReactNode;
  onClickItem?: (game: T) => void;
  delay?: number;
};

const CasinoSwiper = <T,>({
  title,
  icon,
  data,
  renderItem,
  onClickItem,
  maxCount = 7,
  delay = 1000,
}: CasinoSwiperProps<T>): JSX.Element => {
  const width = useWidth();

  const [slide, setSlide] = useState<number>(maxCount);

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
      setSlide(14);
    } else if (width > 1335) {
      setSlide(handleSlideToShow(12));
    } else if (width > 1200) {
      setSlide(handleSlideToShow(10));
    } else if (width > 1163) {
      setSlide(9);
    } else if (width > 991) {
      setSlide(8);
    } else if (width > 860) {
      setSlide(7);
    } else if (width > 693) {
      setSlide(6);
    } else {
      setSlide(5);
    }
  };

  return (
    <>
      {!!data.length && (
        <div className="w-full relative">
          <div className="w-full">
            <div className="flex items-center gap-[10px] justify-between mb-[15px]">
              <div className="flex items-center gap-[10px]">
                {icon}
                <div className="font-[600] dark:text-white text-black text-m_title">{title}</div>
              </div>
            </div>
            <Swiper
              slidesPerView={width > 600 ? 'auto' : 3}
              freeMode={true}
              autoplay={{
                delay: delay,
                disableOnInteraction: false,
              }}
              speed={500}
              spaceBetween={width > 600 ? 15 : 0}
              className="sm:!h-auto !h-[120px]"
              direction={width > 600 ? 'horizontal' : 'vertical'}
              modules={[Autoplay, A11y]}
            >
              {data?.map((game: T, key) => {
                return (
                  <SwiperSlide
                    key={key}
                    className={`w-full !mb-0 !p-[0px] sm:!p-0 max-w-full sm:max-w-[96px]`}
                    onClick={() => onClickItem?.(game)}
                  >
                    {renderItem(game)}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
};

export default CasinoSwiper;
