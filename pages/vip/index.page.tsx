import { useTranslation } from '@/base/config/i18next';
import BaseLayout from '@/components/layouts/base.layout';
import Image from 'next/image';
import { ReactElement } from 'react';
import cn from 'classnames';
import { StarIcon } from '@heroicons/react/24/solid';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

import styles from './index.module.scss';
import { changeIsShowVipClubModal } from '@/base/redux/reducers/modal.reducer';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
function VipPage() {
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const router = useRouter();
  const cardList = [
    {
      id: 1,
      img: '/img/vip-withdraw.png',
      title: t('vipClub:noFeeWithdrawal'),
      description: t('vipClub:noFeeWithdrawalDescription'),
      key: 'cardWithdraw',
    },
    {
      id: 2,
      img: '/img/vip-reward.png',
      title: t('vipClub:rewardlucky'),
      description: t('vipClub:rewardluckyDescription'),
      key: 'cardReward',
    },
    {
      id: 3,
      img: '/img/vip-host.png',
      title: t('vipClub:dedicatedVipHost'),
      description: t('vipClub:dedicatedVipHostContent'),
      key: 'cardVipHost',
    },
    {
      id: 1,
      img: '/img/vip-bonus.png',
      title: t('vipClub:LEVELUPBONUS'),
      description: t('vipClub:bonusContent'),
      key: 'cardBonus',
    },
    {
      id: 1,
      img: '/img/vip-tips.png',
      title: t('vipClub:TIPSRAINING'),
      description: t('vipClub:tipRainingContent'),
      key: 'cardTips',
    },
  ];

  const dataMedal = [
    { img: '/img/bronze-medal.png', name: 'Bronze' },
    { img: '/img/silver-medal.png', name: 'Silver' },
    { img: '/img/gold-medal.png', name: 'Gold' },
    { img: '/img/platinum-medal.png', name: 'Platinum I' },
    { img: '/img/platinum-medal.png', name: 'Platinum II' },
    { img: '/img/diamond-medal.png', name: 'Diamond I' },
    { img: '/img/diamond-medal.png', name: 'Diamond II' },
    { img: '/img/diamond-medal.png', name: 'Diamond III' },
  ];

  const dataReward = [
    { name: t('vipClub:levelUpBonus'), bronze: true, silver: true, gold: true, platinum: true, diamond: true },
    { name: t('vipClub:raining'), bronze: true, silver: true, gold: true, platinum: true, diamond: true },
    { name: t('vipClub:coinDrops'), bronze: true, silver: true, gold: true, platinum: true, diamond: true },
    { name: t('vipClub:tips'), silver: true, gold: true, platinum: true, diamond: true },
    { name: t('vipClub:recharge'), gold: true, platinum: true, diamond: true },
    { name: t('vipClub:weeklyCashback'), gold: true, platinum: true, diamond: true },
    { name: t('vipClub:monthlyCashback'), gold: true, platinum: true, diamond: true },
    { name: t('vipClub:sportsWeeklyBonus'), gold: true, platinum: true, diamond: true },
    { name: t('vipClub:vipHost'), platinum: true, diamond: true },
    { name: t('vipClub:noFeeWithdrawal'), platinum: true, diamond: true },
    { name: t('vipClub:exclusiveSVIP'), diamond: true },
    { name: t('vipClub:luxuryGiveaway'), diamond: true },
  ];

  const onOpenModalVipClub = () => {
    dispatch(changeIsShowVipClubModal(true));
  };

  return (
    <>
      <div className="w-full mt-4 sm:mt-8">
        <div className="bg-[url('/img/vip-banner.png')] bg-cover relative w-full h-[700px] flex items-center justify-center sm:h-[260px] px-[30px] flex justify-between">
          <div className="md:max-w-[600px] max-sm:h-[650px] pl-4 flex sm:block flex-col items-center justify-between absolute left-0 max-sm:px-5 sm:left-[30px] top-[28px] sm:top-[42px] z-1">
            <div>
              <h2 className="text-[42px] leading-[1.2] max-sm:text-center sm:text-[32px] lg:text-[44px] mb-2 font-bold">
                {t('vipClub:exclusiveBenefits')}
              </h2>
              <p className="text-[16px] max-sm:text-center sm:text-[12px] lg:text-[14px]">
                {t('vipClub:exclusiveBenefitsContent')}
              </p>
            </div>
            <Image
              width={100}
              height={100}
              alt=""
              src="/img/vip-benefit.png"
              className="h-full block sm:hidden w-full max-h-[295px] right-[42px] top-0"
            />
            <div className="flex items-center gap-6 mt-4">
              <button
                onClick={() => router.push('/casino')}
                className="bg-[#F61B4F] py-[10px] px-[20px] hover:opacity-90 rounded-[5px] text-[14px] sm:text-[12px] lg:text-[14px] font-bold"
              >
                {t('vipClub:startPlaying')}
              </button>
              <button
                onClick={onOpenModalVipClub}
                className="py-[10px] px-[20px] border border-solid border-[#fff] hover:bg-[#ffffff59] rounded-[5px] text-[14px] sm:text-[12px] ld:text-[14px] font-bold"
              >
                {t('vipClub:viewBenefits')}
              </button>
            </div>
          </div>
          <Image
            width={100}
            height={100}
            alt=""
            src="/img/vip-benefit.png"
            className="absolute h-full hidden sm:block w-full max-w-[40%] max-h-[295px] right-[42px] top-0"
          />
        </div>
        <div className="grid grid-cols-3 max-[1144px]:grid-cols-2 max-[864px]:grid-cols-1 gap-[24px] mt-6">
          {cardList.map((item) => (
            <div
              key={item.id}
              className={cn(
                styles[item.key],
                'px-[10px] h-[300px] rounded-[4px] sm:h-[264px] pt-4 pb-[18px] flex flex-col',
              )}
            >
              <div className="flex-1 flex item-center justify-center">
                <Image width={198} height={98} alt="" className="w-[198px] h-[124px]" src={item.img} />
              </div>
              <div>
                <div className="text-[22px] sm:text-[16px] font-semibold mb-[6px] uppercase">{item.title}</div>
                <p className="text-[16px] sm:text-[12px] text-[#98A7B5]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <div className="text-[18px] mb-[18px] font-semibold">{t('vipClub:rewardBreakdown')}</div>
          <div className="p-2 pb-0 rounded-[5px] bg-[#2D3035] overflow-x-hidden">
            <div className="overflow-x-auto scrollbar pb-2">
              <div className="flex max-w-full">
                <div className="bg-[#25272C] min-w-160px border-l-0 border-solid border-[#37393D]"></div>
                {dataMedal.map((item) => (
                  <div
                    key={item.name}
                    className="px-5 py-4 min-w-[120px] flex-1 bg-[#25272C] border border-solid border-[#37393D] border-l-0 border-b-0 flex items-center justify-center gap-[5px]"
                  >
                    <Image width={18} height={18} alt="" src={item.img} />
                    <p className="text-[12px] font-semibold min-w-fit break-keep">{item.name}</p>
                  </div>
                ))}
              </div>
              {dataReward.map((item) => (
                <div key={item.name} className="flex">
                  <div className="min-w-[160px] flex items-center px-1 text-[14px] h-[50px] border border-l-0 border-solid border-[#37393D]">
                    <p className="truncate">{item.name}</p>
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px] border border-solid border-[#37393D] border-l-0">
                    {item.bronze ? <StarIcon color="#E09A6A" width={16} height={16} /> : '-'}
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px border border-solid border-[#37393D] border-l-0]">
                    {item.silver ? <StarIcon color="#E1E1E1" width={16} height={16} /> : '-'}
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px] border border-solid border-[#37393D] border-l-0">
                    {item.gold ? <StarIcon color="#FFC329" width={16} height={16} /> : '-'}
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px] border border-solid border-[#37393D] border-l-0">
                    {item.platinum ? <StarIcon color="#0DFDE4" width={16} height={16} /> : '-'}
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px] border border-solid border-[#37393D] border-l-0">
                    {item.platinum ? <StarIcon color="#0DFDE4" width={16} height={16} /> : '-'}
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px] border border-solid border-[#37393D] border-l-0">
                    <StarIcon color="#F61B4F" width={16} height={16} />
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px] border border-solid border-[#37393D] border-l-0">
                    <StarIcon color="#F61B4F" width={16} height={16} />
                  </div>
                  <div className="min-w-[120px] flex-1 flex items-center justify-center h-[50px] border border-solid border-[#37393D] border-l-0 border-r-0">
                    <StarIcon color="#F61B4F" width={16} height={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="text-[18px] mb-[18px] font-semibold">{t('vipClub:frequentlyQuestions')}</div>
          <div className="p-2 rounded-[5px] bg-[#2D3035] flex flex-col gap-2">
            <Disclosure>
              {({ open }) => (
                <div className="w-full dark:bg-[#25272C] bg-[#f5f6fa]">
                  <Disclosure.Button className="py-3 w-full flex h-[48px] justify-between">
                    <div className="font-semibold text-[14px] flex gap-2 items-center pl-[10px]">
                      {t('vipClub:whatLevelBonus')}
                    </div>
                    <div className="pr-3">
                      <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
                    </div>
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100 w-full"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100 w-full"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className={'flex flex-col gap-[20px] w-full'}>
                      <div className="bg-[#17191B] py-[13px] px-[10px] text-[14px]">
                        {t('vipClub:whatLevelBonusContent')}
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
            <Disclosure>
              {({ open }) => (
                <div className="w-full dark:bg-[#25272C] bg-[#f5f6fa]">
                  <Disclosure.Button className="py-3 w-full flex h-[48px] justify-between">
                    <div className="font-semibold text-[14px] flex gap-2 items-center pl-[10px]">
                      {t('vipClub:whatRaining')}
                    </div>
                    <div className="pr-3">
                      <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
                    </div>
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100 w-full"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100 w-full"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className={'flex flex-col gap-[20px] w-full'}>
                      <div className="bg-[#17191B] py-[13px] px-[10px] text-[14px]">
                        {t('vipClub:whatRainingContent1')}
                        <br />
                        {t('vipClub:rules')}
                        <br />
                        {t('vipClub:whatRainingContent2')}
                        <br />
                        {t('vipClub:whatRainingContent3')}
                        <br />
                        {t('vipClub:whatRainingContent4')}
                        <br />
                        {t('vipClub:whatRainingContent5')}
                        <br />
                        {t('vipClub:whatRainingContent6')} <br />
                        {t('vipClub:whatRainingContent7')}
                        <br />
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
            <Disclosure>
              {({ open }) => (
                <div className="w-full dark:bg-[#25272C] bg-[#f5f6fa]">
                  <Disclosure.Button className="py-3 w-full flex h-[48px] justify-between">
                    <div className="font-semibold text-[14px] flex gap-2 items-center pl-[10px]">
                      {t('vipClub:whatCoinDrop')}
                    </div>
                    <div className="pr-3">
                      <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
                    </div>
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100 w-full"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100 w-full"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className={'flex flex-col gap-[20px] w-full'}>
                      <div className="bg-[#17191B] py-[13px] px-[10px] text-[14px]">
                        {t('vipClub:whatCoinDropContent1')}
                        <br />
                        {t('vipClub:whatCoinDropContent2')}
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
            <Disclosure>
              {({ open }) => (
                <div className="w-full dark:bg-[#25272C] bg-[#f5f6fa]">
                  <Disclosure.Button className="py-3 w-full flex h-[48px] justify-between">
                    <div className="font-semibold text-[14px] flex gap-2 items-center pl-[10px]">
                      {t('vipClub:whatTips')}
                    </div>
                    <div className="pr-3">
                      <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
                    </div>
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100 w-full"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100 w-full"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className={'flex flex-col gap-[20px] w-full'}>
                      <div className="bg-[#17191B] py-[13px] px-[10px] text-[14px]">{t('vipClub:whatTipsContent')}</div>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
            <Disclosure>
              {({ open }) => (
                <div className="w-full dark:bg-[#25272C] bg-[#f5f6fa]">
                  <Disclosure.Button className="py-3 w-full flex h-[48px] justify-between">
                    <div className="font-semibold text-[14px] flex gap-2 items-center pl-[10px]">
                      {t('vipClub:whatRecharge')}
                    </div>
                    <div className="pr-3">
                      <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
                    </div>
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100 w-full"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100 w-full"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className={'flex flex-col gap-[20px] w-full'}>
                      <div className="bg-[#17191B] py-[13px] px-[10px] text-[14px]">
                        {t('vipClub:whatRechargeContent1')}
                        <br />
                        {t('vipClub:whatRechargeContent2')} <br />
                        {t('vipClub:whatRechargeContent3')}
                        <br />
                        {t('vipClub:whatRechargeContent4')}:
                        <br />
                        {t('vipClub:whatRechargeContent5')}
                        <br />
                        {t('vipClub:whatRechargeContent6')}
                        <br />
                        {t('vipClub:whatRechargeContent7')}
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
            <Disclosure>
              {({ open }) => (
                <div className="w-full dark:bg-[#25272C] bg-[#f5f6fa]">
                  <Disclosure.Button className="py-3 w-full flex h-[48px] justify-between">
                    <div className="font-semibold text-[14px] flex gap-2 items-center pl-[10px]">
                      {t('vipClub:whatWeeklyCashback')}
                    </div>
                    <div className="pr-3">
                      <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
                    </div>
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100 w-full"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100 w-full"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className={'flex flex-col gap-[20px] w-full'}>
                      <div className="bg-[#17191B] py-[13px] px-[10px] text-[14px]">
                        {t('vipClub:whatWeeklyCashbackContent')}
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
            <Disclosure>
              {({ open }) => (
                <div className="w-full dark:bg-[#25272C] bg-[#f5f6fa]">
                  <Disclosure.Button className="py-3 w-full flex h-[48px] justify-between">
                    <div className="font-semibold text-[14px] flex gap-2 items-center pl-[10px]">
                      {t('vipClub:WhatWeeklyBonus')}
                    </div>
                    <div className="pr-3">
                      <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
                    </div>
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100 w-full"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100 w-full"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className={'flex flex-col gap-[20px] w-full'}>
                      <div className="bg-[#17191B] py-[13px] px-[10px] text-[14px]">
                        {t('vipClub:WhatWeeklyBonus1')}
                        <br />
                        {t('vipClub:WhatWeeklyBonus2')}
                        <br />
                        {t('vipClub:WhatWeeklyBonus3')}
                        <br />
                        {t('vipClub:WhatWeeklyBonus4')}
                        <br />
                        {t('vipClub:WhatWeeklyBonus5')}
                        <br />
                        {t('vipClub:WhatWeeklyBonus6')}
                        <br />
                        {t('vipClub:WhatWeeklyBonus7')}
                        <br />
                        {t('vipClub:WhatWeeklyBonus8')}
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
          </div>
        </div>
      </div>
    </>
  );
}

VipPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default VipPage;
