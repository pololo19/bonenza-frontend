import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { BANNER_DATA } from '@/base/constants/common';
import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const GameBannerSlider = ({ className }: { className?: string }) => {
  return (
    <div className={cn('sm:block hidden mt-[70px]', className)}>
      <Swiper
        spaceBetween={10}
        slidesPerView={2}
        slidesPerGroup={2}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
        }}
        speed={5000}
        loop={true}
        direction={'horizontal'}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
        className="!pb-[30px] banner-slider"
        breakpoints={{
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
                <Image width={300} height={140} className="object-cover w-full" src={banner.img} alt="" />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default GameBannerSlider;
