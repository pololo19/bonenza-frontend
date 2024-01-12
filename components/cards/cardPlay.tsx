import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { CSSProperties, useMemo } from 'react';
import { useRouter } from 'next/router';

import styles from './index.module.scss';

type CardPlayProps = {
  imgBackGround: string;
  title: string;
  description: string;
  textButton: string;
  icon: JSX.Element;
  href: string;
  isClick?: boolean;
};

export default function CardPlay({
  imgBackGround,
  title,
  description,
  textButton,
  href,
  icon,
  isClick = false,
}: CardPlayProps) {
  const router = useRouter();

  return (
    <div className="gap-[5px] flex flex-col lg:h-[390px]">
      <div className="sm:hidden flex gap-[10px] items-center sm:items-end mb-[10px]">
        <Image height={25} width={25} className="h-[25px] rounded-[5px]" src="/img/three-cards.png" alt="" />
        <div className="dark:text-white text-black text-[16px] font-bold uppercase">{title}</div>
      </div>
      <div
        onClick={() => {
          if (isClick) {
            window.open(href);
          } else {
            router.push(href);
          }
        }}
        className={cn(
          styles.cardBox,
          'flex-1 bg-cover cursor-pointer overflow-hidden relative md:aspect-[190/145] lg:aspect-[275/145] aspect-[220/145] flex flex-col justify-end rounded-[5px]',
        )}
      >
        <Image height={25} width={25} className={cn(styles.cardImage)} src={imgBackGround} alt="" />
        <div
          className={cn(
            styles.cardContent,
            'px-[12px] py-[20px] backdrop-blur-[2px] dark:bg-none bg-gradient-to-t from-[#fff]  to-[#fff]/0',
          )}
        >
          <div>
            <div className="sm:flex hidden gap-[10px]">
              <div className="mt-[5px]">{icon}</div>

              <div>
                <div className="text-white text-[24px] font-bold uppercase mb-3">{title}</div>
                <div className="sm:hidden block dark:text-white text-[#31373d] text-[14px] lg:text-[16px] mb-3">
                  {description}
                </div>
              </div>
            </div>
            <div className="dark:text-white text-black sm:text-[#31373d] text-[14px] lg:text-[16px] mt-[4px] mb-5">
              {description}
            </div>
            {!isClick && (
              <Link
                href={href}
                type="button"
                className="bg-color-primary w-full rounded-[5px] font-bold xl:text-[14px] text-[12px] text-white flex items-center justify-center gap-[7px] ld:p-[10px] px-[5px] py-[10px] hover:text-white"
              >
                <div />
                {textButton}
              </Link>
            )}
            {isClick && (
              <div
                role="button"
                className="bg-color-primary w-full rounded-[5px] font-bold xl:text-[14px] text-[12px] text-white flex items-center justify-center gap-[7px] ld:p-[10px] px-[5px] py-[10px] hover:text-white"
                onClick={() => window.open(href)}
              >
                {textButton}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
