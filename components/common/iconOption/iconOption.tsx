import React, { ElementType, ReactNode, useState } from 'react';
import { ArrowRight2 } from 'iconsax-react';
import cn from 'classnames';
import { useTranslation } from '@/base/config/i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';

export type OptionSidebarDataType = {
  title?: string;
  href?: string;
  icon?: ReactNode;
};

type IconOptionProps = {
  title?: string;
  icon: ElementType;
  href: string;
  classNames?: string;
  activeClassNames?: string;
  onClick?: () => void;
  isDropDown?: boolean;
  isShowDropDown?: boolean;
  data?: OptionSidebarDataType[];
};

const IconOption = ({
  title,
  href,
  classNames,
  activeClassNames,
  icon,
  isDropDown,
  data,
  onClick,
}: IconOptionProps) => {
  const { t } = useTranslation('');
  const router = useRouter();
  const IconElement = icon;

  const [showDropDownCasino, setShowDropDownCasino] = useState(false);

  return (
    <>
      {!isDropDown && (
        <Link
          className={cn(
            'capitalize dark:hover:bg-[#292C33] dark:focus:bg-[#292C33] block dark:bg-[#2D3035] dark:text-[#98A7B5] hover:bg-[#eaecf3] focus:bg-[#eaecf3] hover:text-[#000] dark:hover:text-white text-[14px] flex items-center gap-[16px] flex-1 pl-[15px] px-[5px] py-[10px]',
            classNames,
            router.route.includes(href) && activeClassNames,
          )}
          href={href}
          onClick={() => {
            setShowDropDownCasino(!showDropDownCasino);
            onClick?.();
          }}
        >
          <IconElement
            size={18}
            className={cn('', {
              'font-[700] dark:text-white text-black': router.route.includes(href),
            })}
          />
          <div
            className={cn('flex-1 text-start', {
              'dark:text-white text-black': router.route.includes(href),
            })}
          >
            {title}
          </div>
        </Link>
      )}
      {isDropDown && (
        <div
          className={cn(
            'capitalize block dark:bg-[#2D3035] dark:text-[#98A7B5] text-[14px] cursor-pointer transition-[height] ease-in-out duration-300',
            classNames,
            {
              // 'translate-y-0': showDropDownCasino,
              // 'translate-y-full': !showDropDownCasino
            },
          )}
        >
          <div
            className={cn(
              'flex items-center gap-[16px] flex-1 pl-[15px] px-[5px] py-[10px] hover:bg-gray-200 dark:hover:!text-white dark:text-gray-400 text-gray-800 hover:!text-gray-800 rounded',
              { 'dark:hover:bg-[#292C33]': showDropDownCasino, 'dark:hover:bg-[#292C33] asd': !showDropDownCasino },
            )}
            onClick={() => {
              setShowDropDownCasino(!showDropDownCasino);
              onClick?.();
            }}
          >
            <IconElement
              size={18}
              className={cn('', {
                'font-[700]': router.route.includes(href),
                'dark:text-white text-black': showDropDownCasino,
              })}
            />
            <div
              className={cn('flex-1 text-start', {
                'dark:text-white text-black': showDropDownCasino,
              })}
            >
              {title}
            </div>
            <ArrowRight2 className={`w-[15px] h-[15px] ${showDropDownCasino ? 'rotate-90' : ''}`} />
          </div>
          {showDropDownCasino && (
            <div className={cn('')}>
              {data?.map((item, index) => {
                if (item.href)
                  return (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-[16px] py-[10px] dark:hover:bg-[#292C33] dark:focus:bg-[#292C33] focus:bg-[#f6f7fa] pl-5 hover:bg-gray-200 dark:hover:!text-white dark:text-gray-400 text-gray-800 hover:!text-gray-800',
                        {
                          'font-[700] dark:text-white dark:bg-[#24262B] text-black bg-[#eaecf3]': router.route.includes(
                            item.href,
                          ),
                        },
                      )}
                      key={index}
                    >
                      {item.icon}
                      <div className={cn('flex-1 text-start')}>{item.title}</div>
                    </Link>
                  );
                else
                  return (
                    <div
                      className="flex items-center gap-[16px] py-[10px] dark:hover:bg-[#292C33] dark:focus:bg-[#292C33] focus:bg-[#f6f7fa] pl-5 hover:bg-gray-200 dark:hover:!text-white dark:text-gray-400 text-gray-800 hover:!text-gray-800"
                      key={index}
                    >
                      {item.icon}
                      <div className={cn('flex-1 text-start')}>{item.title}</div>
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
