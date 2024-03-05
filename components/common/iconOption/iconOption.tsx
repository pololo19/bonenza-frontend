import cn from 'classnames';
import { ArrowRight2 } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ElementType, ReactNode, useEffect, useState } from 'react';

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
      {!isDropDown && (
        <Link
          className={cn(
            'capitalize sm:text-default text-m_default ',
            'dark:hover:bg-color-hover-default hover:bg-color-light-hover-primary',
            'dark:bg-color-bg-primary dark:text-color-text-primary  hover:text-[#000] dark:hover:text-white',
            'flex items-center gap-[16px] flex-1 pl-[24px] pr-[10px] py-[13px]',
            'rounded hover:rounded',
            router.route.includes(href) ? activeClassNames : classNames,
          )}
          href={href}
          onClick={() => {
            // disable hide menus
            // setShowDropDownCasino(!showDropDownCasino);
            onClick?.();
          }}
        >
          <IconElement
            size={18}
            className={cn('dark:text-white', {
              'font-[700] dark:text-white text-black': router.route.includes(href),
            })}
          />
          <div
            className={cn(`flex-1 text-start font-[${fontWeight}]`, {
              'dark:text-white text-color-light-text-primary': router.route.includes(href),
              'text-base': isFontMedium,
            })}
          >
            {title}
          </div>
        </Link>
      )}
      {isDropDown && (
        <div
          className={cn(
            'capitalize block dark:bg-color-bg-primary dark:text-color-text-primary text-default cursor-pointer transition-[height] ease-in-out duration-300',
            classNames,
            `font-[${fontWeight}]`,
            {
              'dark:bg-color-bg-primary': showDropDownCasino,
            },
          )}
        >
          <div
            className={cn(
              'flex items-center gap-[16px] flex-1 pl-[24px] pr-[10px] px-[10px] py-[13px]',
              'dark:hover:!text-white hover:!text-gray-800 dark:text-gray-400 text-gray-800 bg-color-bg-primary',
              {
                'dark:hover:bg-color-hover-default hover:rounded': showDropDownCasino,
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
              className={cn('flex-1 text-start', `font-[${fontWeight}]`, {
                'dark:text-white text-color-light-text-primary': showDropDownCasino,
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
            className={cn('transition-all overflow-hidden duration-[200]', {
              'max-h-0': !showDropDownCasino,
              'max-h-[574px]': showDropDownCasino,
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
                      'flex items-center gap-[16px] py-[13px]',
                      'dark:hover:bg-color-hover-default dark:focus:bg-color-hover-default focus:bg-color-light-bg-primary px-7 hover:bg-gray-200 dark:hover:!text-white dark:text-gray-400 text-gray-800 hover:!text-gray-800 rounded',
                      {
                        'dark:text-color-text-primary text-color-light-text-primary dark:bg-[#24262B] bg-[#eaecf3]':
                          router.route.includes(item.href),
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
