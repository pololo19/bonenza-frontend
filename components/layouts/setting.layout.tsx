import { Menu, Transition } from '@headlessui/react';
import cn from 'classnames';
import { ArrowDown2, Setting } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useMemo } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';

import CommonSession from '../common/baseSession/baseSession';
import IconOption from '../common/iconOption/iconOption';
import BaseLayout from './base.layout';
import styles from './deposit.module.scss';

type SettingLayoutProps = {
  children: JSX.Element;
  mainCustomClass?: string;
};

const SettingLayout: React.FC<SettingLayoutProps> = ({ children }) => {
  const { t } = useTranslation('');
  const router = useRouter();

  const LIST_SIDEBAR_DEPOSIT = [
    {
      name: t('layout:general'),
      href: ROUTER.SettingGeneral,
    },
    {
      name: t('layout:privacy'),
      href: ROUTER.SettingPrivacy,
    },
    {
      name: t('layout:email'),
      href: ROUTER.SettingEmail,
    },
    {
      name: t('layout:security'),
      href: ROUTER.SettingSecurity,
    },
    {
      name: t('layout:session'),
      href: ROUTER.SettingSession,
    },
    {
      name: t('layout:verify'),
      href: ROUTER.SettingVerify,
    },
  ];

  const activeRouter = useMemo(() => {
    const activeSidebar = LIST_SIDEBAR_DEPOSIT.find((item) => router.route.includes(item.href));
    return activeSidebar?.name;
  }, [router]);

  return (
    <>
      <BaseLayout contentClass="sm:mx-auto px-0">
        <>
          <div className="flex flex-wrap gap-7 w-full text-center xl:py-[50px] sm:py-[20px] py-[12px] sm:px-0 sm:mb-0 mb-14">
            <CommonSession icon={Setting} title="Setting">
              <Menu
                as="div"
                className="relative w-auto text-left rounded-[7px] flex dark:text-white text-black md:hidden"
              >
                <Menu.Button>
                  <div
                    role="button"
                    className="flex items-center gap-2 py-2 px-6 w-full rounded dark:bg-color-modal-bg-secondary bg-[#fff]  min-w-[200px]"
                  >
                    <div className="flex-1 text-start">{activeRouter}</div>
                    <div className="dark:text-white text-black truncate text-right min-w-[15px]">
                      <ArrowDown2 size={15} />
                    </div>
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute dark:bg-color-modal-bg-secondary bg-[#fff] w-full origin-top-right right-0 top-[60px] z-[5] cursor-pointer rounded p-2">
                    {LIST_SIDEBAR_DEPOSIT.map((item, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <Link
                            href={item.href}
                            className={cn('flex items-center justify-start p-[10px] w-full rounded text-[14px]', {
                              'border-[0.5px] border-solid border-color-primary font-semibold dark:text-white text-black':
                                router.route.includes(item.href),
                              'dark:hover:bg-gray-500 dark:hover:text-white hover:text-black hover:bg-white dark:text-gray-500 text-[#3137ed]':
                                !router.route.includes(item.href),
                            })}
                            role="button"
                          >
                            <div
                              className={cn('flex-1 flex items-center justify-start gap-[10px]', {
                                ' after:w-[8px] after:h-[8px] after:bg-[#3BC117] after:rounded-full after:shadow-[0_0_0_0.3125rem_#3bc11726]':
                                  router.route.includes(item.href),
                              })}
                            >
                              <div className="flex-1 text-start dark:text-white text-[#31373d] text-[14px]">
                                {String(t(item.name))}
                              </div>
                            </div>
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
              <div className="flex flex-row gap-5 w-full text-center mt-0 mb-[50px]">
                <div
                  className={cn(
                    styles.cardMenu,
                    'dark:!bg-color-modal-bg-secondary bg-[#fff] rounded-[3px] md:max-h-[310px] min-w-[175px] md:!flex !hidden',
                  )}
                >
                  <div className="xl:p-2 p-1 w-full">
                    <ul className="flex flex-col justify-center gap-2 w-full rounded-xl">
                      {LIST_SIDEBAR_DEPOSIT.map((item, index) => (
                        <IconOption
                          title={String(t(item.name))}
                          href={item.href}
                          icon={() => null}
                          key={index}
                          classNames="dark:hover:text-white text-[#31373d] rounded !bg-transparent pr-[15px]"
                          activeClassNames="dark:!bg-color-active-primary !bg-[#eaecf3] dark:text-white text-black"
                        />
                      ))}
                    </ul>
                  </div>
                </div>
                <div
                  className={cn(
                    'flex-1 rounded-[3px] dark:bg-transparent sm:dark:bg-color-modal-bg-secondary bg-white dark:text-white text-black md:px-3 md:pt-3 md:pb-5 md:p-5 mt-[20px] md:mt-0 relative w-full',
                  )}
                >
                  {children}
                </div>
              </div>
            </CommonSession>
          </div>
        </>
      </BaseLayout>
    </>
  );
};

export default SettingLayout;
