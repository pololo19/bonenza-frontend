import cn from 'classnames';
import { ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ElementType, useState } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { setCasinoTab } from '@/base/redux/reducers/common.reducer';
import { useAppDispatch } from '@/base/redux/store';

const casinoPaths = [
  ROUTER.Casino,
  ROUTER.PicksForYou,
  ROUTER.Favorite,
  ROUTER.Recent,
  ROUTER.Tagname('slots'),
  ROUTER.Tagname('Live Casino'),
  ROUTER.Tagname('Hot Games'),
  ROUTER.Tagname('New Releases'),
  ROUTER.Tagname('Feature Buy-in'),
  ROUTER.Tagname('Blackjack'),
  ROUTER.Tagname('Table Games'),
];

export type OptionSidebarDataType = {
  title: string;
  href: string;
  icon: ElementType;
  isMobile?: boolean;
  image?: string;
};

export type IconOptionProps = {
  title?: string;
  icon: ElementType;
  imageURL?: string;
  imageClass?: string;
  textClass?: string;
  count?: number;
  href: string;
  classNames?: string;
  activeClassNames?: string;
  onClick?: () => void;
  isDropDown?: boolean;
  isShowDropDown?: boolean;
  fontWeight?: number;
  isFontMedium?: boolean;
  isDisabled?: boolean;
  data?: OptionSidebarDataType[];
};

const IconOption = ({
  title,
  href,
  classNames,
  activeClassNames,
  icon,
  isDropDown,
  fontWeight = 400,
  isFontMedium = false,
  data,
  imageURL,
  count = 0,
  imageClass,
  textClass,
  isDisabled = false,
  onClick,
}: IconOptionProps) => {
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { pathname } = router;
  const IconElement = icon;
  const [showDropDownCasino, setShowDropDownCasino] = useState(
    // casinoPaths.some((path) => pathname !== '/' && path.includes(pathname)),
    true,
  );

  // useEffect(() => {
  //   setShowDropDownCasino(casinoPaths.some((path) => pathname !== '/' && path.includes(pathname)));
  // }, [pathname]);
  return (
    <>
      {!isDropDown &&
        (href.length > 0 ? (
          <Link
            className={cn(
              'relative capitalize sm:text-default text-m_default ',
              'hover:bg-color-menu-hover',
              'dark:text-color-text-primary hover:text-[#000] dark:hover:text-white',
              'flex items-center gap-[16px] flex-1 pl-[24px] pr-[10px] py-[8px]',
              'rounded-large hover:rounded-large',
              router.route.includes(href) ? activeClassNames : classNames,
            )}
            href={href}
            onClick={() => {
              // disable hide menus
              // setShowDropDownCasino(!showDropDownCasino);
              onClick?.();
            }}
          >
            {imageURL ? (
              <Image src={imageURL} width={20} height={20} className={imageClass} alt="" />
            ) : (
              <IconElement
                size={18}
                className={cn('dark:text-white', {
                  'font-[700] dark:text-white text-black': router.route.includes(href),
                })}
              />
            )}
            <div
              className={cn(`flex-1 text-start font-[${fontWeight}]`, textClass, {
                'dark:text-color-primary text-color-light-text-primary': router.route.includes(href),
                'text-base': isFontMedium,
              })}
            >
              {title}
            </div>
          </Link>
        ) : (
          <div
            className={cn(
              'relative capitalize sm:text-default text-m_default cursor-pointer',
              'hover:bg-color-menu-hover',
              'dark:text-color-text-primary hover:text-[#000] dark:hover:!text-white',
              'flex items-center gap-[16px] flex-1 pl-[24px] pr-[10px] py-[8px]',
              'rounded-large hover:rounded-large',
              classNames,
            )}
            onClick={() => {
              // disable hide menus
              // setShowDropDownCasino(!showDropDownCasino);
              onClick?.();
            }}
          >
            {imageURL ? (
              <Image src={imageURL} width={20} height={20} className={imageClass} alt="" />
            ) : (
              <IconElement
                size={18}
                className={cn('dark:text-white', {
                  'font-[700] dark:text-white text-black': router.route.includes(href),
                })}
              />
            )}
            {count > 0 && (
              <div className="bg-color-primary text-white font-extrabold w-6 h-6 text-m_default p-1 flex items-center justify-center text-center absolute -right-2 -top-2 rounded-full">
                {count}
              </div>
            )}
            <div
              className={cn(`flex-1 text-start font-[${fontWeight}] dark:hover:text-white`, textClass, {
                'dark:text-color-text-primary text-color-light-text-primary': router.route.includes(href),
                'text-base': isFontMedium,
              })}
            >
              {title}
            </div>
          </div>
        ))}
      {isDropDown && (
        <div
          className={cn(
            'capitalize block dark:bg-transparent dark:text-color-text-primary text-default cursor-pointer transition-[height] ease-in-out duration-300',
            classNames,
            `font-[${fontWeight}]`,
            {
              'dark:bg-color-bg-primary': showDropDownCasino,
            },
          )}
        >
          <div
            className={cn(
              'flex items-center gap-[16px] flex-1 pl-[24px] pr-[10px] px-[10px] py-[8px]',
              'dark:hover:!text-white hover:!text-gray-800 dark:text-gray-400 text-gray-800 rounded-large',
              'hover:bg-color-menu-hover',
              {
                'dark:bg-color-hover-default/60': showDropDownCasino,
              },
            )}
            onClick={() => {
              // disable hide menus
              // setShowDropDownCasino(!showDropDownCasino);
              onClick?.();
            }}
          >
            <IconElement
              size={18}
              className={cn('dark:text-white', {
                'font-[700]': router.route.includes(href),
                'dark:text-white text-black': showDropDownCasino,
              })}
            />
            <div
              className={cn('flex-1 text-start dark:hover:text-white', `font-[${fontWeight}]`, {
                'dark:text-color-text-primary text-color-light-text-primary': showDropDownCasino,
                'text-base': isFontMedium,
              })}
            >
              {title}
            </div>
            {/* <ArrowRight2
              className={`w-3 h-3 mr-1 transition-all duration-150 ${showDropDownCasino ? 'rotate-90' : 'rotate-0'}`}
            /> */}
          </div>
          <div
            className={cn('transition-all overflow-hidden duration-[200] flex flex-col gap-[10px] mt-10px', {
              'max-h-0': !showDropDownCasino,
              'max-h-[800px]': showDropDownCasino,
            })}
            onClick={() => {
              dispatch(setCasinoTab(false));
              localStorage.removeItem('tab');
            }}
          >
            {data?.map((item, index) => {
              const SubIconElement = item.icon;
              if (item.href)
                return (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-[16px] py-[8px]',
                      'pl-9 dark:hover:!text-white dark:text-color-text-primary text-gray-800 hover:!text-gray-800 rounded-large',
                      'hover:bg-color-menu-hover',
                      {
                        'dark:bg-color-menu-hover !text-color-primary': router.asPath
                          .toLowerCase()
                          .replace('%20', ' ')
                          .includes(item.href.toLowerCase()),
                        'text-base': isFontMedium,
                      },
                    )}
                    key={index}
                  >
                    <SubIconElement size={18} />
                    <div className={cn('flex-1 text-start font-semibold')}>{t(item.title)}</div>
                  </Link>
                );
              else
                return (
                  <div
                    className="flex items-center gap-[16px] py-[10px] dark:hover:bg-color-hover-default focus:bg-color-light-bg-primary pl-5 hover:bg-gray-200 dark:hover:!text-white dark:text-gray-400 text-gray-800 hover:!text-gray-800"
                    key={index}
                  >
                    <SubIconElement size={18} />
                    <div className={cn('flex-1 text-start font-semibold', { 'text-base': isFontMedium })}>
                      {item.title}
                    </div>
                  </div>
                );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default IconOption;
