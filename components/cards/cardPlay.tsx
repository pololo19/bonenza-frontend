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
};

export default function CardPlay({
  imgBackGround,
  title,
  description,
  textButton,
  href,
  isClick = false,
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
      className={cn(
        styles.cardBox,
        'relative overflow-hidden rounded-[50px] cursor-pointer',
      )}
    >
      <Image
        height={25}
        width={25}
        className={
          cn
          (
            styles.cardImage,
            'w-full h-full object-cover'
          )
        }
        src={imgBackGround}
        alt=""
      />
      <div
        className={cn(
          styles.cardContent,
          'flex flex-col gap-[20px] pt-5 px-8 pb-5 bg-black opacity-80 items-center',
        )}
      >
        <div className="dark:text-white text-color-text-primary text-[14px] md:text-[16px] min-[1600px]:text-[20px] font-light text-center">
          {description}
        </div>
        {!isClick && (
          <Link
            href={href}
            type="button"
            className="bg-color-primary w-[80%] rounded-[100px] font-medium text-[20px] text-white py-0 md:py-1 min-[1600px]:py-[12px] text-center"
          >
            {textButton}
          </Link>
        )}
        {isClick && (
          <div
            role="button"
            className="bg-color-primary w-[80%] rounded-[100px] font-medium text-[20px] text-white py-0 md:py-1 min-[1600px]:py-[12px] text-center"
            onClick={() => window.open(href)}
          >
            {textButton}
          </div>
        )}
      </div>
    </div>
  );
}
