import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './index.module.scss';

type CardPlayProps = {
  imgBackGround: string;
  title: string;
  description: string;
  textButton: string;
  href: string;
  isClick?: boolean;
  action: string;
};

export default function CardPlay({
  imgBackGround,
  title,
  description,
  textButton,
  href,
  isClick = false,
  action,
}: CardPlayProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        if (isClick) {
          window.open(href);
        } else {
          router.push(href);
        }
      }}
      className={cn(styles.cardBox, 'relative overflow-hidden rounded-large cursor-pointer')}
    >
      <Image
        height={25}
        width={25}
        className={cn(styles.cardImage, 'w-full h-full object-cover')}
        src={imgBackGround}
        alt="card-play"
      />
      <div
        className={cn(
          styles.cardContent,
          'flex flex-col gap-[20px] pt-4 px-4 pb-4 items-center',
          'dark:!backdrop-blur-[15px] dark:bg-black/[30%]',
        )}
      >
        <div className="dark:text-white text-color-text-secondary text-[12px] min-[1300px]:text-[14px] font-light text-left h-[60px]">
          {description}
        </div>
        {!isClick && (
          <Link
            href={href}
            type="button"
            className={cn(
              styles[action],
              'w-[100%] rounded-large font-medium text-[16px] text-white py-[8px] text-center',
            )}
          >
            {textButton}
          </Link>
        )}
        {isClick && (
          <div
            role="button"
            className={cn(
              styles[action],
              'w-[100%] rounded-large font-medium text-[16px] text-white py-[8px] text-center',
            )}
            onClick={() => window.open(href)}
          >
            {textButton}
          </div>
        )}
      </div>
    </div>
  );
}
