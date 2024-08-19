import cn from 'classnames';
import classNames from 'classnames';
import { InfoCircle } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { convertToUrlCase } from '@/base/libs/utils/convert';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import { GameListType } from '@/base/types/common';

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
    <div
      className="pointer-events-auto max-w-[150px] sm:max-w-game-card"
      onClick={() => dispatch(changeIsShowCasinoSearch(false))}
    >
      <div
        className={classNames('bg-[#31373D77] sm:block rounded-large overflow-hidden p-2', {
          flex: listView,
          block: !listView,
        })}
      >
        <Link href={ROUTER.GameDetail(convertToUrlCase(gameDetail.identifier || ''))} className="rounded-default">
          <Image
            height={160}
            width={160}
            src={`https://cdn.softswiss.net/i/s4/${(gameDetail.identifier || '').replace(':', '/')}.png`}
            alt="game logo"
            onError={(err) => {
              err.currentTarget.src = '/img/recommended-game-3.png';
            }}
            className="max-w-[150px] sm:max-w-game-card w-full object-cover max-h-auto rounded-default"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(convertImage(160, 160))}`}
          />
        </Link>
        <div className="flex flex-col gap-5 py-2">
          <div className="flex justify-center items-center gap-[5px]">
            <Link
              href={ROUTER.Provider(String(gameDetail.providerName))}
              className="dark:text-white text-black font-light text-default sm:text-[16px] truncate capitalize hover:!underline hover:!underline-offset-4"
            >
              {gameDetail.providerName.toLowerCase()}
            </Link>
            <InfoCircle
              data-tooltip-id={`${gameDetail.identifier} ${uuid}`}
              size={20}
              className="text-[#8E8E90] min-w-[16px] focus:!outline-none"
              role="button"
            />
          </div>
        </div>
        {footer?.()}
      </div>
      <Tooltip
        className="max-w-[50vw] z-[50] !text-[14px] min-w-[270px] !p-3 !bg-color-light-bg-primary dark:!bg-[#161D3D]"
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
          <span className="font-bold dark:text-gray-300 text-gray-700">{`${gameDetail?.multiplier.toFixed(2) || '0'
            } x`}</span>
        </div>
      </Tooltip>
    </div>
  );
}

export default GameCard;
