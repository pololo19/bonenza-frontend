import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { BANNER_DATA } from '@/base/constants/common';
import { useWidth } from '@/base/hooks/useWidth';

const GameBannerSlider = ({ className }: { className?: string }) => {
  const width = useWidth();
  return (
    <div className={cn('block mt-[20px] sm:mt-[70px]', className)}>
      <Swiper
        spaceBetween={10}
        slidesPerView={2}
        slidesPerGroup={2}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={width > 600 ? 1500 : 500}
        loop={true}
        direction={'horizontal'}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
        className="sm:!pb-[30px] !pb-0 banner-slider"
        breakpoints={{
          350: {
            slidesPerView: 1,
            slidesPerGroup: 1,
          },
          870: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
        }}
      >
        {BANNER_DATA.map((banner, id) => {
          return (
            <SwiperSlide key={id}>
              <Link href={banner.url}>
                <Image width={300} height={140} className="object-cover w-full rounded-[5px]" src={banner.img} alt="" />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default GameBannerSlider;
