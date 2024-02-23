import cn from 'classnames';
import { InfoCircle } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import LazyLoad from 'react-lazy-load';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { convertToUrlCase } from '@/base/libs/utils/convert';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import { GameListType } from '@/base/types/common';
import classNames from 'classnames';

type GameCardProps = {
  gameDetail: GameListType;
  listView?: boolean;
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

function GameCard(props: GameCardProps) {
  const { gameDetail, footer, listView = false } = props;
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const uuid = Math.random();

  return (
    <div className="pointer-events-auto" onClick={() => dispatch(changeIsShowCasinoSearch(false))}>
      <div
        className={classNames('sm:block rounded-default dark:bg-color-card-bg-primary bg-white', {
          flex: listView,
          block: !listView,
        })}
      >
        <Link href={ROUTER.GameDetail(convertToUrlCase(gameDetail.identifier || ''))} className="rounded-default">
          <LazyLoad className="min-h-[100px]">
            <Image
              height={160}
              width={160}
              src={`https://cdn.softswiss.net/i/s4/${(gameDetail.identifier || '').replace(':', '/')}.png`}
              alt=""
              className="w-full object-cover max-h-auto rounded-default"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(convertImage(160, 160))}`}
            />
          </LazyLoad>
        </Link>
        <div className="p-[10px]">
          <div className="flex justify-between items-center gap-[5px]">
            <div className="dark:text-white text-black font-medium text-default truncate">
              {String(gameDetail.providerName)?.charAt(0).toUpperCase() + String(gameDetail.providerName)?.slice(1)}
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
        className="max-w-[50vw] z-[50] !text-[14px] min-w-[270px] !p-3 !bg-color-light-bg-primary dark:!bg-color-bg-secondary"
        opacity={100}
        id={`${gameDetail?.identifier} ${uuid}`}
        place="bottom"
        // content={String(gameDetail?.description)}
      >
        <div className="rounded p-2 dark:bg-color-bg-primary bg-gray-200 flex items-center justify-between px-3">
          <span className="font-bold dark:text-gray-300 text-gray-700">RPT:</span>
          <span
            className={cn('font-bold', {
              'text-[#0C0]': gameDetail.payout > 90,
              'dark:text-gray-300 text-gray-700': gameDetail.payout < 90,
            })}
          >
            {gameDetail.payout ?? 0}%
          </span>
        </div>
        <div className="rounded p-2 dark:bg-color-bg-primary bg-gray-200 flex items-center justify-between px-3 mt-3">
          <span className="font-bold dark:text-gray-300 text-gray-700">Recent biggest win:</span>
          <span className="font-bold dark:text-gray-300 text-gray-700">{`${gameDetail?.multiplier.toFixed(2) || "0"} x`}</span>
        </div>
      </Tooltip>
    </div>
  );
}

export default GameCard;
