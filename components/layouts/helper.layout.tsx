import { Menu, Transition } from '@headlessui/react';
import cn from 'classnames';
import { ArrowDown2, MessageText } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useMemo } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';

import CommonSession from '../common/baseSession/baseSession';
import IconOption from '../common/iconOption/iconOption';
import BaseLayout from './base.layout';
import styles from './deposit.module.scss';

type HelperLayoutProps = {
  children: JSX.Element;
  mainCustomClass?: string;
};

const HelperLayout: React.FC<HelperLayoutProps> = ({ children }) => {
  const fixRouter = (link: string) => {
    return link.split('helper-center/')[1];
  };

  const LIST_SIDEBAR_DEPOSIT = [
    {
      name: 'Privacy Policy',
      href: fixRouter(ROUTER.HelperPrivacy),
    },
    {
      name: 'Terms Of Service',
      href: fixRouter(ROUTER.HelperTermsOfService),
    },
    {
      name: 'Terms Of Sports',
      href: fixRouter(ROUTER.HelperTermsOfSports),
    },
    {
      name: 'Deposit Bonus Terms',
      href: fixRouter(ROUTER.HelperDepositBonusTerms),
    },
    {
      name: 'Coin Accuracy Limit',
      href: fixRouter(ROUTER.HelperCoinAccuracyLimit),
    },
    {
      name: 'Support',
      href: fixRouter(ROUTER.HelperSupport),
    },
    {
      name: 'Fee',
      href: fixRouter(ROUTER.HelperFee),
    },
    {
      name: 'Google Authenticator',
      href: fixRouter(ROUTER.HelperGoogleAuthenticator),
    },
    {
      name: 'FAQ',
      href: fixRouter(ROUTER.HelperFAQ),
    },
    {
      name: 'Currency',
      href: fixRouter(ROUTER.HelperCurrency),
    },
    {
      name: 'Registration and Login',
      href: fixRouter(ROUTER.HelperRegistrationAndLogin),
    },
    {
      name: 'Gamble Aware',
      href: fixRouter(ROUTER.HelperGambleAware),
    },
    {
      name: 'Protecting Minors',
      href: fixRouter(ROUTER.HelperProtectingMinors),
    },
    {
      name: 'Providers',
      href: fixRouter(ROUTER.HelperProviders),
    },
    {
      name: 'AML',
      href: fixRouter(ROUTER.HelperAML),
    },
    {
      name: 'Self-exclusion',
      href: fixRouter(ROUTER.HelperSelfExclusion),
    },
    {
      name: 'Responsible Gambling',
      href: fixRouter(ROUTER.HelperResponsibleGambling),
    },
  ];

  const { t } = useTranslation('');
  const router = useRouter();

  const activeRouter = useMemo(() => {
    const activeSidebar = LIST_SIDEBAR_DEPOSIT.find((item) => router.route.includes(item.href));
    return activeSidebar?.name;
  }, [router]);

  return (
    <>
      <BaseLayout contentClass="sm:mx-auto px-0">
        <>
          <div className="flex flex-wrap gap-7 w-full text-center xl:py-[50px] sm:py-[20px] py-[12px] xl:px-[20px] sm:px-0 px-[20px] sm:mb-0 mb-14">
            <CommonSession icon={MessageText} iconClass="text-[#0DFDE4]" title="Help Center">
              <div className="flex flex-row gap-5 w-full text-center mt-0 mb-[50px]">
                <div
                  className={cn(
                    styles.cardMenu,
                    'bg-white dark:bg-[#31343D] text-black dark:text-white rounded-[15px] xl:min-w-[300px] min-w-[none] md:max-h-[940px] md:!flex !hidden',
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
                          classNames="text-gray-400 dark:hover:text-white hover:text-black text rounded bg-transparent pr-[15px]"
                          activeClassNames="dark:!bg-[#292C33] !bg-[#f5f6fa] font-semibold"
                        />
                      ))}
                    </ul>
                  </div>
                </div>
                <div
                  className={cn(
                    'flex-1 bg-white dark:bg-[#31343D] rounded-[15px] text-white px-2 sm:px-3 pt-3 pb-5 md:p-5',
                  )}
                >
                  <Menu as="div" className="relative w-auto text-left sm:mb-5 rounded-[7px] flex text-white md:hidden">
                    <Menu.Button>
                      <div
                        role="button"
                        className="flex items-center gap-2 py-2 px-2 w-full rounded bg-[#2B2E35] min-w-[200px]"
                      >
                        <div className="flex-1 text-start">{activeRouter}</div>
                        <div className="text-white truncate text-right min-w-[15px]">
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
                      <Menu.Items className="absolute bg-[#161D26] w-full origin-top-right right-0 top-[45px] z-[5] cursor-pointer rounded p-2">
                        {LIST_SIDEBAR_DEPOSIT.map((item, index) => (
                          <Menu.Item key={index}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={cn('flex items-center justify-start p-[10px] w-full rounded text-[14px]', {
                                  'border-[0.5px] border-solid border-amber-500 font-semibold text-white':
                                    router.route.includes(item.href),
                                  'hover:bg-gray-500 hover:text-white text-gray-500': !router.route.includes(item.href),
                                })}
                                role="button"
                              >
                                <div
                                  className={cn('flex-1 flex items-center justify-start gap-[10px]', {
                                    ' after:w-[8px] after:h-[8px] after:bg-[#3BC117] after:rounded-full after:shadow-[0_0_0_0.3125rem_#3bc11726]':
                                      router.route.includes(item.href),
                                  })}
                                >
                                  <div className="flex-1 text-start text-[14px]">{String(t(item.name))}</div>
                                </div>
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
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

export default HelperLayout;
