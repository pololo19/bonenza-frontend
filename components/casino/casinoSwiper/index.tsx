import React, { ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

type CasinoSwiperProps<T> = {
  icon?: JSX.Element;
  title?: string;
  data: T[];
  renderItem: (game: T) => ReactNode;
  onClickItem?: (game: T) => void;
};

const CasinoSwiper = <T,>({ title, icon, data, renderItem, onClickItem }: CasinoSwiperProps<T>): JSX.Element => {
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
              slidesPerView={'auto'}
              autoplay={{
                delay: 500,
                disableOnInteraction: false,
              }}
              speed={1000}
              spaceBetween={10}
              loop={true}
              direction={'horizontal'}
              modules={[Autoplay]}
            >
              {data?.map((game: T, key) => {
                return (
                  <SwiperSlide key={key} className="!w-[150px]" onClick={() => onClickItem?.(game)}>
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
