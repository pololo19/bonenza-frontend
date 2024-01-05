import { InfoCircle } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import LazyLoad from 'react-lazy-load';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import { GameDetail, GameListType } from '@/base/types/common';
import { convertToUrlCase } from '@/base/libs/utils/convert';

type GameCardProps = {
  gameDetail: GameListType | GameDetail;
  footer?: () => React.ReactNode;
};

const convertImage = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#333" offset="20%" />
        <stop stop-color="#222" offset="50%" />
        <stop stop-color="#333" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#333" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

function GameCard({ gameDetail, footer }: GameCardProps) {
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const uuid = Math.random();

  return (
    <div className="" onClick={() => dispatch(changeIsShowCasinoSearch(false))}>
      <div className="rounded-[5px] dark:bg-[#12181F] bg-white">
        <Link href={ROUTER.GameDetail(convertToUrlCase(gameDetail.identifier || ''))} className="rounded-[5px]">
          <LazyLoad className="min-h-[100px]">
            <Image
              height={160}
              width={160}
              src={`https://cdn.softswiss.net/i/s4/${(gameDetail.identifier || '').replace(':', '/')}.png`}
              alt=""
              className="w-full object-cover max-h-auto rounded-[5px]"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(convertImage(160, 160))}`}
            />
          </LazyLoad>
        </Link>
        <div className="p-[10px]">
          <div className="flex justify-between items-center gap-[5px]">
            <div className="dark:text-white text-[#000] font-medium text-[12px] truncate">
              {String(gameDetail.title)?.charAt(0).toUpperCase() + String(gameDetail?.title)?.slice(1)}
            </div>
            <InfoCircle
              data-tooltip-id={`${gameDetail.identifier} ${uuid}`}
              size={16}
              className="text-[#8E8E90] min-w-[16px]"
              role="button"
            />
          </div>
          {footer?.()}
        </div>
      </div>
      <Tooltip
        className="max-w-[50vw] z-[50] !text-[12px] min-w-[250px] !bg-black"
        id={`${gameDetail?.identifier} ${uuid}`}
        place="bottom"
        // content={String(gameDetail?.description)}
      >
        <div className="rounded p-2 bg-gray-800 flex items-center justify-between">
          <span>RPT:</span>
          <span className="text-amber-600">{gameDetail.payout ?? 0}%</span>
        </div>
        <div className="rounded p-2 bg-gray-800 flex items-center justify-between mt-2">
          <span>Recent biggest win:</span>
          <span className="text-amber-600">{gameDetail.multiplier ?? 0}X</span>
        </div>
        <div className="flex items-center justify-end mt-2">
          <span className="text-gray-500">
            {/* {String(gameDetail?.producer)?.charAt(0).toUpperCase() + String(gameDetail?.producer)?.slice(1)} */}
          </span>
        </div>
      </Tooltip>
    </div>
  );
}

export default GameCard;
