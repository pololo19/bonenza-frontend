import { StarIcon } from '@heroicons/react/24/solid';
import cn from 'classnames';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import StarsRating from 'react-star-rate';
import { toast } from 'react-toastify';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { formatDate } from '@/base/libs/utils';
import { GameDetail, GameListType, GameProviderDetail, Rating } from '@/base/types/common';

const RateStarComponent = ({
  rate,
  total = 5,
  fillColor = true,
}: {
  rate: number;
  total?: number;
  fillColor?: boolean;
}) => {
  return (
    <div className="flex items-center">
      {[...Array(total)].map((e, i) => {
        return <StarIcon width={18} key={i} className={cn({ 'text-amber-600': i < rate && fillColor })} />;
      })}
    </div>
  );
};

const GameReviewComponent = ({
  gameDetail,
  gameProvider,
}: {
  gameDetail?: GameListType;
  gameProvider?: GameProviderDetail;
}) => {
  const dataFake = [
    {
      img: 'https://gtjai.com.vn/wp-content/uploads/2021/07/avt.png',
    },
    {
      img: 'https://gtjai.com.vn/wp-content/uploads/2021/07/avt.png',
    },
    {
      img: 'https://gtjai.com.vn/wp-content/uploads/2021/07/avt.png',
    },
    {
      img: 'https://gtjai.com.vn/wp-content/uploads/2021/07/avt.png',
    },
    {
      img: 'https://gtjai.com.vn/wp-content/uploads/2021/07/avt.png',
    },
    {
      img: 'https://gtjai.com.vn/wp-content/uploads/2021/07/avt.png',
    },
    {
      img: 'https://gtjai.com.vn/wp-content/uploads/2021/07/avt.png',
    },
  ];

  const [ratingData, setRatingData] = useState<Rating>({});

  const handleChangeRate = async (value?: number) => {
    if (!value) return;
    try {
      const res = await api.post('/rating', {
        gameId: gameDetail?.id,
        rating: value,
      });
      toast.error('Rating Successfully', { containerId: TOAST_ENUM.COMMON });
    } catch (error) {
      toast.error('Rating Failed', { containerId: TOAST_ENUM.COMMON });
    }
  };

  const handleGetRate = async () => {
    try {
      // const res = await api.get('game/get-rating', { params: { game_id: gameDetail?.id } });
      // setRatingData(res.data.data);
    } catch (error) {
      setRatingData({});
    } finally {
    }
  };

  useEffect(() => {
    handleGetRate();
  }, []);

  const { t } = useTranslation('');

  return (
    <div>
      <div className="dark:bg-[#1A1C20] bg-white w-full h-[152px] p-[15px] rounded-md text-[11px] text-[#939699] font-normal mb-7">
        <div className="flex gap-5">
          <Image
            height={90}
            width={90}
            src={`https://cdn.softswiss.net/i/s4/${gameDetail?.identifier.replace(':', '/')}.png`}
            alt=""
            className="max-w-[90px] object-cover max-h-auto rounded-[5px]"
          />
          <div>
            <h2 className="sm:text-[18px] text-[16px] font-semibold dark:text-white text-black mb-3">
              {gameDetail?.title}
            </h2>
            <p>
              {t('gameDetail:by')} <span className="dark:text-white text-black">{gameDetail?.provider}</span>
            </p>
            {gameDetail?.releasedAt && (
              <p className="mt-2 dark:text-white text-[#31373d]">
                {t('gameDetail:release')}: {formatDate(gameDetail?.releasedAt)}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="font-bold dark:text-[#0DFDE4] text-[#f59e0b]">{t('gameDetail:showMore')}</span>
          <i className="fi fi-rs-angle-small-down dark:text-white text-[#f59e0b] w-[10px] h-[10px]"></i>
        </div>
      </div>
      <div className="mb-10 text-[#939699] text-[#000]">
        <h2 className="text-lg font-semibold mb-1 dark:text-white text-black">{t('gameDetail:ratings')} </h2>
        <div className="dark:bg-[#1A1C20] bg-white w-full">
          <div className="flex sm:p-4 p-2 md:gap-[30px] gap-[10px]">
            <div className="flex md:flex-row flex-col gap-[10px] items-center">
              <span className="text-4xl dark:text-[#0DFDE4] text-[#f59e0b] font-normal">
                {ratingData?.avgRating?.toFixed(1)}{' '}
                <span className="text-[11px] dark:text-[#939699] text-[#31373d] md:hidden -ml-3">/5</span>
              </span>
              <div className="w-[max-content]">
                <StarsRating
                  allowHalf={false}
                  classNamePrefix="!text-[14px] rate-star"
                  disabled
                  value={ratingData?.avgRating}
                />
                <p className="hidden md:block text-[11px]">{t('gameDetail:outOf')} 5</p>
              </div>
            </div>
            <div className="w-full">
              <div className="flex items-center">
                <div className="min-w-[150px]">
                  <StarsRating allowHalf={false} classNamePrefix="!text-[14px] rate-star" disabled />
                </div>
                <div className="w-full h-[5px] bg-gray-300 rounded">
                  <div className="h-full w-[5%] bg-amber-500 rounded"></div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="min-w-[150px]">
                  <StarsRating allowHalf={false} classNamePrefix="!text-[14px] rate-star" disabled count={4} />
                </div>
                <div className="w-full h-[5px] bg-gray-300 rounded">
                  <div className="h-full w-[5%] bg-amber-500 rounded"></div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="min-w-[150px]">
                  <StarsRating allowHalf={false} classNamePrefix="!text-[14px] rate-star" disabled count={3} />
                </div>
                <div className="w-full h-[5px] bg-gray-300 rounded">
                  <div className="h-full w-[5%] bg-amber-500 rounded"></div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="min-w-[150px]">
                  <StarsRating allowHalf={false} classNamePrefix="!text-[14px] rate-star" disabled count={2} />
                </div>
                <div className="w-full h-[5px] bg-gray-300 rounded">
                  <div className="h-full w-[5%] bg-amber-500 rounded"></div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="min-w-[150px]">
                  <StarsRating allowHalf={false} classNamePrefix="!text-[14px] rate-star" disabled count={1} />
                </div>
                <div className="w-full h-[5px] bg-gray-300 rounded">
                  <div className="h-full w-[5%] bg-amber-500 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#3D4049]"></div>
          <div className="flex justify-between px-4 text-[11px]">
            <div className="w-full flex flex-col md:flex-row md:justify-between justify-center pr-5 items-center">
              <span>{t('gameDetail:rateThisGame')}</span>
              <StarsRating
                allowHalf={false}
                value={ratingData.userRating}
                classNamePrefix="!text-[18px] rate-star"
                onChange={handleChangeRate}
              />
            </div>
            <div className="w-[1px] md:h-12 h-[86px] bg-[#3D4049]"></div>
            <div className="w-full flex flex-col md:flex-row items-center pl-4 justify-center md:justify-start">
              <div className="flex pr-2">
                {dataFake.map((items, key) => (
                  <div key={key}>
                    <Image src={items.img} alt="" width={36} height={36} className="w-4 h-4" />
                  </div>
                ))}
              </div>
              <span>
                {ratingData.countRating} {t('gameDetail:ratings')}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-[50px]">
        <div className="flex justify-between text-lg font-semibold items-center">
          <h2 className="text-black dark:text-white">{t('gameDetail:comments')}</h2>
          <i className="fi fi-sr-menu-burger w-4 h-4 text-[#929395]"></i>
        </div>
        <div className="flex gap-[13px] h-11 items-center relative mt-[9px]">
          <Image
            src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/7912642/avatar-icon-md.png"
            alt=""
            width={36}
            height={36}
            className="w-9 h-9"
          />
          <input
            className="w-full h-full dark:bg-[#1C1E22] bg-[#eaecf3] dark:text-[#53575C] text-[#5f6975] placeholder-[#53575C] text-sm border-none px-7 focus:outline-none"
            type="text"
            placeholder="Leave your comment"
          />
          <i className="fi fi-rr-smile-beam absolute right-3 text-[#929395] w-[15px] h-[15px]"></i>
        </div>
        <div className="text-xs text-[#98A7B5]">
          <div className="flex justify-between items-center h-[120px] md:h-[93px] mt-4 dark:bg-[#1C1E22] bg-white">
            <div className="ml-[17px]">
              <div className="flex items-center gap-2">
                <Image
                  src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/7912642/avatar-icon-md.png"
                  alt=""
                  width={36}
                  height={36}
                  className="w-7 h-7"
                />
                <span>
                  Andre0008 <span className="text-[#53575C]">38d</span>
                </span>
              </div>
              <p className="mt-[13px] ml-[23px]">{t('gameDetail:threeTimeFreeGame')}</p>
            </div>
            <div className="-mt-8 flex gap-6 mr-3 text-sm">
              <i className="fi fi-rr-social-network"></i>
              <i className="fi fi-rs-beacon"></i>
              <i className="fi fi-rr-menu-dots-vertical"></i>
            </div>
          </div>
        </div>
        <div className="text-xs text-[#98A7B5]">
          <div className="flex justify-between items-center h-[120px] md:h-[93px] mt-1 dark:bg-[#1C1E22] bg-white">
            <div className="ml-[17px]">
              <div className="flex items-center gap-2">
                <Image
                  src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/7912642/avatar-icon-md.png"
                  alt=""
                  width={36}
                  height={36}
                  className="w-7 h-7"
                />
                <span>
                  Andre0008 <span className="text-[#53575C]">38d</span>
                </span>
              </div>
              <p className="mt-[13px] ml-[23px]">{t('gameDetail:threeTimeFreeGame')}</p>
            </div>
            <div className="-mt-8 flex gap-6 mr-3 text-sm">
              <i className="fi fi-rr-social-network"></i>
              <i className="fi fi-rs-beacon"></i>
              <i className="fi fi-rr-menu-dots-vertical"></i>
            </div>
          </div>
        </div>
        <div className="text-xs text-[#98A7B5]">
          <div className="flex justify-between items-center h-[120px] md:h-[93px] mt-1 dark:bg-[#1C1E22] bg-white">
            <div className="ml-[17px]">
              <div className="flex items-center gap-2">
                <Image
                  src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/7912642/avatar-icon-md.png"
                  alt=""
                  width={36}
                  height={36}
                  className="w-7 h-7"
                />
                <span>
                  Andre0008 <span className="text-[#53575C]">38d</span>
                </span>
              </div>
              <p className="mt-[13px] ml-[23px]">{t('gameDetail:threeTimeFreeGame')}</p>
            </div>
            <div className="-mt-8 flex gap-6 mr-3 text-sm">
              <i className="fi fi-rr-social-network"></i>
              <i className="fi fi-rs-beacon"></i>
              <i className="fi fi-rr-menu-dots-vertical"></i>
            </div>
          </div>
        </div>
        <div className="text-xs text-[#98A7B5]">
          <div className="flex justify-between items-center h-[180px] md:h-[130px] mt-1 dark:bg-[#1C1E22] bg-white">
            <div className="ml-[17px]">
              <div className="flex items-center gap-2">
                <Image
                  src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/7912642/avatar-icon-md.png"
                  alt=""
                  width={36}
                  height={36}
                  className="w-7 h-7"
                />
                <span>
                  Andre0008 <span className="text-[#53575C]">38d</span>
                </span>
              </div>
              <p className="mt-[13px] ml-[23px]">{t('gameDetail:reallyGoodGame')}</p>
              <div className="mt-4 flex items-center gap-2 ml-[23px]">
                <span className="font-bold dark:text-[#0DFDE4] text-[#f59e0b]">{t('gameDetail:showReplies')}</span>
                <i className="fi fi-rs-angle-small-down text-white w-[10px] h-[10px]"></i>
              </div>
            </div>
            <div className="-mt-8 flex gap-6 mr-3 text-sm">
              <i className="fi fi-rr-social-network"></i>
              <i className="fi fi-rs-beacon"></i>
              <i className="fi fi-rr-menu-dots-vertical"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GameReviewComponent;
