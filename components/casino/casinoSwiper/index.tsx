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
  renderItem: (game: T) => ReactNode;
  onClickItem?: (game: T) => void;
};

const CasinoSwiper = <T,>({ title, icon, data, renderItem, onClickItem }: CasinoSwiperProps<T>): JSX.Element => {
  const width = useWidth();

  const [slide, setSlide] = useState<number>(8);

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
  console.log(slide);
  return (
    <>
      {!!data.length && (
        <div className="w-full relative">
          <div className="w-full">
            <div className="flex items-center gap-[10px] justify-between mb-[15px]">
              <div className="flex items-center gap-[10px]">
                {icon}
                <div className="font-[600] dark:text-white text-black sm:text-title text-m_title">{title}</div>
              </div>
            </div>
            <Swiper
              slidesPerView={width > 600 ? 'auto' : 3}
              freeMode={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              speed={1000}
              spaceBetween={width > 600 ? 10 : 0}
              loop={true}
              className="sm:!h-auto !h-[160px]"
              direction={width > 600 ? 'horizontal' : 'vertical'}
              modules={[Autoplay, A11y]}
            >
              {data?.map((game: T, key) => {
                return (
                  <SwiperSlide
                    key={key}
                    className={`sm:!w-[150px] w-full !mb-0 !p-[10px] sm:!p-0 dark:!bg-[#2E3035] !bg-white sm:!bg-auto`}
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
