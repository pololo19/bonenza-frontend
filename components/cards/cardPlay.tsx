import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CSSProperties, useMemo } from 'react';

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
    <div className="gap-[5px] flex flex-col  aspect-square">
      <div className="sm:hidden flex gap-[10px] items-center sm:items-end mb-[10px]">
        <Image height={25} width={25} className="h-[25px]" src="/img/three-cards.png" alt="" />
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
          'flex-1 bg-cover cursor-pointer overflow-hidden relative md:aspect-[190/145] lg:aspect-[275/145] aspect-[220/145] flex flex-col justify-end ',
        )}
      >
        <Image height={25} width={25} className={cn(styles.cardImage)} src={imgBackGround} alt="" />
        <div
          className={cn(
            styles.cardContent,
            'p-[10px] dark:!backdrop-blur-[15px] dark:bg-none bg-gradient-to-t dark:from-[#fff]  dark:to-[#fff]/0 from-white via-white via-70%',
          )}
        >
          <div>
            <div className="sm:flex hidden gap-[10px]">
              <div className="mt-[3px]">{icon}</div>

              <div>
                <div className="dark:text-white text-color-light-text-primary sm:text-[24px] lg:text-[14px] xl:text-[16px] 2xl:text-[20px] font-bold uppercase">
                  {title}
                </div>
                <div className="sm:hidden block dark:text-white text-color-text-primary md:text-[14px] 2xl:text-[16px]">
                  {description}
                </div>
              </div>
            </div>
            <div className="dark:text-white text-color-text-primary text-[10px] sm:text-[20px] mt-1 tracking-tight lg:text-[10px] xl:text-[12px] 2xl:text-[15px] mb-1 sm:min-h-[120px] lg:min-h-[65px] xl:min-h-[72px]">
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
