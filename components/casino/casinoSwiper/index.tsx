import 'swiper/css';

import React, { ReactNode } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useWidth } from '@/base/hooks/useWidth';

type CasinoSwiperProps<T> = {
  icon?: JSX.Element;
  title?: string;
  data: T[];
  renderItem: (game: T) => ReactNode;
  onClickItem?: (game: T) => void;
};

const CasinoSwiper = <T,>({ title, icon, data, renderItem, onClickItem }: CasinoSwiperProps<T>): JSX.Element => {
  const width = useWidth();

  return (
    <>
      {!!data.length && (
        <div className="w-full relative">
          <div className="w-full">
            <div className="flex items-center gap-[10px] justify-between mb-[15px]">
              <div className="flex items-center gap-[10px]">
                {icon}
                <div className="font-[600] dark:text-white text-[#000] sm:text-[18px] text-[16px]">{title}</div>
              </div>
            </div>
            <Swiper
              slidesPerView={width > 600 ? 'auto' : 3}
              autoplay={{
                delay: 500,
                disableOnInteraction: false,
              }}
              speed={1000}
              spaceBetween={width > 600 ? 10 : 0}
              loop={true}
              className="sm:!h-auto !h-[160px]"
              direction={width > 600 ? 'horizontal' : 'vertical'}
              modules={[Autoplay]}
            >
              {data?.map((game: T, key) => {
                return (
                  <SwiperSlide
                    key={key}
                    className="sm:!w-[150px] w-full !mb-0 !p-[10px] sm:!p-0 dark:!bg-[#2E3035] !bg-white sm:!bg-auto"
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
