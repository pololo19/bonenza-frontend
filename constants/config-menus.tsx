import { ArrowSwapVertical, Element3 } from 'iconsax-react';

import { OptionSidebarDataType } from '@/components/common/iconOption/iconOption';
import BlackjackIcon from '@/components/icons/BlackjackIcon';
import BuyInIcon from '@/components/icons/BuyInIcon';
import CasinoBoldIcon from '@/components/icons/CasinoBoldIcon';
import CupIcon from '@/components/icons/CupIcon';
import FavoriteIcon from '@/components/icons/FavoriteIcon';
import HotGameIcon from '@/components/icons/HotGameIcon';
import LiveCasinoIcon from '@/components/icons/LiveCasinoIcon';
import RacingBoldIcon from '@/components/icons/RacingBoldIcon';
import RecentIcon from '@/components/icons/RecentIcon';
import ReleaseIcon from '@/components/icons/ReleaseIcon';
import SlotIcon from '@/components/icons/SlotIcon';

import { ROUTER } from './common';

export const headerMenus: OptionSidebarDataType[] = [
  {
    title: '', //'layout:home',
    href: ROUTER.Master,
    // icon: <HomeIcon className="text-color-light-text-primary dark:text-white" />,
    icon: CupIcon,
    image: '',
    isMobile: true,
  },
  {
    title: 'sidebar:casino',
    href: ROUTER.Casino,
    // icon: <CasinoBoldIcon className="text-color-primary w-[18px] h-[18px]" />,
    icon: CasinoBoldIcon,
    image: 'casino.png',
    isMobile: false,
  },
  {
    title: 'casino:slots',
    href: ROUTER.Tagname('slots'),
    // icon: (
    //   <Image
    //     width={18}
    //     height={18}
    //     className="text-color-primary w-[18px] h-[18px]"
    //     src="/icon/updownIcon.png"
    //     alt="logo"
    //   />
    // ),
    image: 'slots.png',
    icon: SlotIcon,
    isMobile: false,
  },
  {
    title: 'layout:racing',
    href: ROUTER.Tagname('racing'),
    // icon: (
    //   <Image
    //     width={18}
    //     height={18}
    //     className="text-color-primary w-[18px] h-[18px]"
    //     src="/icon/updownIcon.png"
    //     alt="logo"
    //   />
    // ),
    image: 'racing.png',
    icon: RacingBoldIcon,
    isMobile: false,
  },
  {
    title: 'BitUp Game',
    href: 'https://bitup.game/trade',
    // icon: (
    //   <Image
    //     width={18}
    //     height={18}
    //     className="text-color-primary w-[18px] h-[18px]"
    //     src="/icon/updownIcon.png"
    //     alt="logo"
    //   />
    // ),
    image: 'bitup.png',
    icon: ArrowSwapVertical,
    isMobile: false,
  },
  // { title: 'layout:racing', href: ROUTER.Racing, icon: <RacingBoldIcon className="text-[#F48D19]" /> },
];

export const casinoCategories: OptionSidebarDataType[] = [
  { title: 'casino:pickForYou', href: ROUTER.PicksForYou, icon: Element3 },
  { title: 'casino:favorite', href: ROUTER.Favorite, icon: FavoriteIcon },
  { title: 'casino:recent', href: ROUTER.Recent, icon: RecentIcon },
];

export const casinoGames: OptionSidebarDataType[] = [
  // {
  //   title: String(t('casino:bonenzaOriginals')),
  //   href: ROUTER.Category(String(t('casino:bonenzaOriginals'))),
  //   icon: <OriginalIcon size={18} />,
  // },
  // { title: 'casino:slot', href: ROUTER.Tagname('slots'), icon: SlotIcon },
  // { title: 'layout:racing', href: ROUTER.Tagname('Racing'), icon: RacingBoldIcon },
  { title: 'casino:liveCasino', href: ROUTER.Tagname('live-casino'), icon: LiveCasinoIcon },
  { title: 'casino:hotGame', href: ROUTER.Tagname('hot-games'), icon: HotGameIcon },
  { title: 'casino:newReleases', href: ROUTER.Tagname('new-releases'), icon: ReleaseIcon },
  { title: 'casino:featureBuyIn', href: ROUTER.Tagname('feature-buy-in'), icon: BuyInIcon },
  { title: 'casino:blackjack', href: ROUTER.Tagname('blackjack'), icon: BlackjackIcon },
  { title: 'casino:tableGames', href: ROUTER.Tagname('table-games'), icon: LiveCasinoIcon },
];
