import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { ArrowDown, ArrowDown2, Calculator } from 'iconsax-react';
import { Menu } from '@headlessui/react';
import { useState } from 'react';

const friendVipData = [
  {
    logo: '/img/bronze-medal.png',
    level: 'VIP 04',
    wagerAmount: '1000',
    unlockAmount: '+ 0.50 $',
  },
  {
    logo: '/img/bronze-medal.png',
    level: 'VIP 08',
    wagerAmount: '5000',
    unlockAmount: '+ 2.50 $',
  },
  {
    logo: '/img/bronze-medal.png',
    level: 'VIP 14',
    wagerAmount: '17000',
    unlockAmount: '+ 5.00 $',
  },
  {
    logo: '/img/bronze-medal.png',
    level: 'VIP 22',
    wagerAmount: '49000',
    unlockAmount: '+ 12.00 $',
  },
  {
    logo: '/img/bronze-medal.png',
    level: 'VIP 30',
    wagerAmount: '129000',
    unlockAmount: '+ 25.00 $',
  },
  {
    logo: '/img/platinum1-medal.png',
    level: 'VIP 38',
    wagerAmount: '321000',
    unlockAmount: '+ 50.00 $',
  },
  {
    logo: '/img/platinum1-medal.png',
    level: 'VIP 46',
    wagerAmount: '769000',
    unlockAmount: '+ 80.00 $',
  },
  {
    logo: '/img/platinum1-medal.png',
    level: 'VIP 54',
    wagerAmount: '1793000',
    unlockAmount: '+ 120.00 $',
  },
  {
    logo: '/img/platinum1-medal.png',
    level: 'VIP 62',
    wagerAmount: '4097000',
    unlockAmount: '+ 205.00 $',
  },
  {
    logo: '/img/platinum1-medal.png',
    level: 'VIP 70',
    wagerAmount: '9217000',
    unlockAmount: '+ 500.00 $',
  },
];

function RateAndRulesComponent() {
  const { t, i18n } = useTranslation('');
  const [wagerAmount, setWagerAmount] = useState<number>(1000);
  const [commissionRate, setCommissionRate] = useState<number>(7);

  const [currentCommission, setCurrentCommission] = useState<'live' | 'slot'>('live');

  return (
    <div className="w-full mt-5">
      <div className="w-full flex flex-col lg:flex-row gap-4">
        <div className="w-full flex flex-col gap-4">
          <div className="relative">
            <Image
              src="/img/affiliate/casino-rule-1.png"
              width={20}
              height={20}
              className="w-full object-cover rounded-large"
              alt=""
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 py-6 px-10 flex flex-col gap-4 justify-center">
              <div className="text-default lg:text-title">Live Casino</div>
              <div className="text-m_default lg:text-default pl-4">
                Wager * 1% *{' '}
                <span className="text-color-text-green font-bold">{t('mycasino:commissionRate')} (7%)</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/img/affiliate/casino-rule-2.png"
              width={20}
              height={20}
              className="w-full object-cover rounded-large"
              alt=""
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 py-6 px-10 flex flex-col gap-4 justify-center">
              <div className="text-default lg:text-title">Slot Game</div>
              <div className="text-m_default lg:text-default pl-4">
                Wager * 1% *{' '}
                <span className="text-color-text-green font-bold">{t('mycasino:commissionRate')} (15%)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 bg-gradient-card-default rounded-default min-w-[300px] p-6">
          <div className="flex justify-start items-center gap-1">
            <Calculator className="w-5 h-5" />
            {t('affiliate:commissionCalculator')}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-start items-end gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-m_default">Wager (USDT)</div>
                <input
                  className="text-[#9AA6BC] px-4 py-3 rounded-default w-full"
                  value={wagerAmount}
                  onChange={(event) => setWagerAmount(parseFloat(event.target.value))}
                />
              </div>
              <div className="min-w-[50px] text-center py-3">* 1% *</div>
            </div>
            <div className="flex justify-start items-end gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-m_default">{t('mycasino:commissionRate')}</div>
                <input className="text-[#9AA6BC] px-4 py-3 rounded-default w-full" value={commissionRate} />
              </div>
              <div className="min-w-[20px] text-center py-3">%</div>
            </div>
          </div>
          <Menu as="div" className="relative w-auto text-left sm:mb-5 rounded-[7px] flex text-white">
            <Menu.Button className="w-full">
              <div
                role="button"
                className="flex items-center justify-between font-bold gap-2 py-2 px-2 w-full rounded bg-color-input-secondary min-w-[200px]"
              >
                {currentCommission === 'live' ? 'Live Casino (7%)' : 'Slot Game (15%)'}
                <ArrowDown2 stroke="3" />
              </div>
            </Menu.Button>
            <Menu.Items className="absolute origin-top left-0 right-0 top-[40px] z-[5] cursor-pointer rounded p-2">
              <Menu.Item>
                {({ active }) => (
                  <div
                    className="bg-color-input-secondary w-full px-4 py-2 text-m_default"
                    onClick={() => {
                      setCurrentCommission('live');
                      setCommissionRate(7);
                    }}
                  >
                    Live Casino (7%)
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className="bg-color-input-secondary w-full px-4 py-2 text-m_default"
                    onClick={() => {
                      setCurrentCommission('slot');
                      setCommissionRate(15);
                    }}
                  >
                    Slot Game (15%)
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
          <div className="text-color-text-green font-extrabold text-m_title">
            {`= ${(wagerAmount * 0.01 * commissionRate) / 100} USDT`}
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-4">
        <div className="font-semibold">{t('footer:rules')}</div>
        <div className="flex flex-col gap-4 text-default">
          <div>{t('affiliate:commissionRule1')}</div>
          <div>{t('affiliate:commissionRule2')}</div>
        </div>
      </div>
      <div className="bg-gradient-card-default mt-4 rounded-default p-6">
        {t('affiliate:howToGetReferralReward')}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 mt-4">
          <div className="flex gap-8">
            <div className="text-[40px] text-color-primary font-bold">1</div>
            <div className="flex flex-col">
              <div className="text-color-primary">{t('affiliate:shareFriends1')}</div>
              <div className="mt-3 text-m_default">{t('affiliate:shareFriends2')}</div>
            </div>
            <Image
              className="object-cover h-[80px] w-[80px] opacity-30"
              height={50}
              width={50}
              src="/img/affiliate/friends.png"
              alt=""
            />
          </div>
          <div className="flex gap-8">
            <div className="text-[40px] text-color-primary font-bold">2</div>
            <div className="flex flex-col">
              <div className="text-color-primary">{t('affiliate:getDollar1')}</div>
              <div className="mt-3 text-m_default">{t('affiliate:getDollar2')}</div>
            </div>
            <Image
              className="object-cover h-[80px] w-[80px] opacity-30"
              height={50}
              width={50}
              src="/img/fiats/USDT.png"
              alt=""
            />
          </div>
          <div className="flex gap-8">
            <div className="text-[40px] text-color-primary font-bold">3</div>
            <div className="flex flex-col">
              <div className="text-color-primary">{t('affiliate:levelUpAndReceive1')}</div>
              <div className="mt-3 text-m_default">{t('affiliate:levelUpAndReceive2')}</div>
            </div>
            <Image
              className="object-cover h-[80px] w-[80px] opacity-30"
              height={50}
              width={50}
              src="/img/affiliate/rewards.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="bg-color-card-bg-primary mt-4 py-6 px-4 rounded-default">
        <div className="grid grid-cols-3 text-default">
          <div className="text-center font-bold">{t('affiliate:friendsLevel')}</div>
          <div className="text-center font-bold">{t('affiliate:totalWager')}</div>
          <div className="text-center font-bold">{t('affiliate:unlockAmount')}</div>
        </div>
        <div className="mt-5">
          {friendVipData.map((friend, index) => (
            <div
              key={`affiliate-rate-${friend.level}`}
              className={`grid grid-cols-3 text-default py-2 rounded-default mb-1 ${
                index % 2 === 0 ? ' bg-[#FFF1]' : 'bg-[#FFF2]'
              }`}
            >
              <div className="flex justify-center items-center gap-4 text-center font-bold">
                <Image src={friend.logo} width={32} height={32} className="h-8 object-cover" alt="logo" />
                {friend.level}
              </div>
              <div className="flex justify-center items-center text-center font-bold">{friend.wagerAmount}</div>
              <div className="flex justify-center items-center text-center font-bold text-[#FFF27C]">
                {friend.unlockAmount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RateAndRulesComponent;
