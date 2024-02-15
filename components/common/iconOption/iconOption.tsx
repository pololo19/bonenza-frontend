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
  icon: JSX.Element;
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
  data?: OptionSidebarDataType[];
};

const IconOption = ({
  title,
  href,
  classNames,
  activeClassNames,
  icon,
  isDropDown,
  fontWeight = 600,
  isFontMedium = false,
  data,
  onClick,
}: IconOptionProps) => {
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { pathname } = router;
  const IconElement = icon;
  const [showDropDownCasino, setShowDropDownCasino] = useState(
    casinoPaths.some((path) => pathname !== '/' && path.includes(pathname)),
  );

  useEffect(() => {
    setShowDropDownCasino(casinoPaths.some((path) => pathname !== '/' && path.includes(pathname)));
  }, [pathname]);
  return (
    <>
      {!isDropDown && (
        <Link
          className={cn(
            'capitalize dark:hover:bg-color-hover-secondary dark:bg-color-bg-primary dark:text-color-text-primary hover:bg-color-light-hover-primary hover:text-[#000] dark:hover:text-white sm:text-[14px] text-[15px] flex items-center gap-[16px] flex-1 pl-[24px] pr-[10px] py-[13px]',

            router.route.includes(href) ? activeClassNames : classNames,
          )}
          href={href}
          onClick={() => {
            setShowDropDownCasino(!showDropDownCasino);
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
              'dark:text-white text-black': router.route.includes(href),
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
            'capitalize block dark:bg-color-bg-primary dark:text-color-text-primary text-[14px] cursor-pointer transition-[height] ease-in-out duration-300',
            classNames,
            `font-[${fontWeight}]`,
            {
              'dark:bg-color-menu-secondary': showDropDownCasino,
              // 'translate-y-0': showDropDownCasino,
              // 'translate-y-full': !showDropDownCasino
            },
          )}
        >
          <div
            className={cn(
              'flex items-center gap-[16px] flex-1 pl-[24px] pr-[10px] px-[10px] py-[13px] dark:hover:!text-white dark:text-gray-400 text-gray-800 hover:!text-gray-800',
              { 
                'dark:hover:bg-[#292C33]': showDropDownCasino,
                'hover:rounded' : showDropDownCasino,
              },
            )}
            onClick={() => {
              setShowDropDownCasino(!showDropDownCasino);
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
              className={cn(
                'flex-1 text-start', 
                `font-[${fontWeight}]`,
                {
                  'dark:text-white text-black': showDropDownCasino,
                  'text-base': isFontMedium,
                })
              }
            >
              {title}
            </div>
            <ArrowRight2 className={`w-[15px] h-[15px] ${showDropDownCasino ? 'rotate-90' : ''}`} />
          </div>
          {showDropDownCasino && (
            <div
              className={cn('')}
              onClick={() => {
                dispatch(setCasinoTab(false));
                localStorage.removeItem('tab');
              }}
            >
              {data?.map((item, index) => {
                if (item.href)
                  return (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-[16px] py-[13px] dark:hover:bg-[#292C33] dark:focus:bg-[#292C33] focus:bg-[#f6f7fa] px-5 hover:bg-gray-200 dark:hover:!text-white dark:text-gray-400 text-gray-800 hover:!text-gray-800 hover:rounded',
                        {
                          'dark:text-white dark:bg-[#24262B] text-black bg-[#eaecf3]': router.route.includes(
                            item.href,
                          ),
                          'text-base': isFontMedium,
                        },
                      )}
                      key={index}
                    >
                      {item.icon}
                      <div className={cn('flex-1 text-start font-semibold')}>{item.title}</div>
                    </Link>
                  );
                else
                  return (
                    <div
                      className="flex items-center gap-[16px] py-[10px] dark:hover:bg-[#292C33] dark:focus:bg-[#292C33] focus:bg-[#f6f7fa] pl-5 hover:bg-gray-200 dark:hover:!text-white dark:text-gray-400 text-gray-800 hover:!text-gray-800"
                      key={index}
                    >
                      {item.icon}
                      <div className={cn('flex-1 text-start font-semibold',{'text-base': isFontMedium})}>{item.title}</div>
                    </div>
                  );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default IconOption;
