import {
  ArrowSwapVertical,
  Award,
  Command,
  Diamonds,
  Element3,
  Gift,
  HambergerMenu,
  Headphone,
  Judge,
  Medal,
  Moon,
  Notepad2,
  SecurityCard,
  Sun1,
  Ticket,
  TrendUp,
} from 'iconsax-react';
import Image from 'next/image';

import { IconOptionProps, OptionSidebarDataType } from '@/components/common/iconOption/iconOption';
import BlackjackIcon from '@/components/icons/BlackjackIcon';
import BuyInIcon from '@/components/icons/BuyInIcon';
import CasinoBoldIcon from '@/components/icons/CasinoBoldIcon';
import FavoriteIcon from '@/components/icons/FavoriteIcon';
import HomeIcon from '@/components/icons/HomeIcon';
import HotGameIcon from '@/components/icons/HotGameIcon';
import LiveCasinoIcon from '@/components/icons/LiveCasinoIcon';
import RecentIcon from '@/components/icons/RecentIcon';
import ReleaseIcon from '@/components/icons/ReleaseIcon';
import SlotIcon from '@/components/icons/SlotIcon';

import { ROUTER } from './common';

export const headerMenus: OptionSidebarDataType[] = [
  {
    title: 'layout:home',
    href: '/',
    // icon: <HomeIcon className="text-color-light-text-primary dark:text-white" />,
    icon: HomeIcon,
    image: '',
    isMobile: true,
  },
  {
    title: 'layout:casino',
    href: ROUTER.Casino,
    // icon: <CasinoBoldIcon className="text-color-primary w-[18px] h-[18px]" />,
    icon: CasinoBoldIcon,
    image: 'casino.png',
    isMobile: false,
  },
  {
    title: 'layout:slot',
    href: ROUTER.Slots,
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
  // {
  //   title: 'layout:sports',
  //   href: ROUTER.Sports,
  //   icon: <SportBoldIcon className="text-[#FE073A] w-[18px] h-[18px]" />,
  // },
  // {
  //   title: 'layout:liveHoldem',
  //   href: 'https://cmd23.com/room/games.php',
  //   icon: (
  //     <Image
  //       width={18}
  //       height={18}
  //       className="max-w-[60px] sm:max-w-[107px] md:max-w-[none] md:max-h-[none] max-h-[40px] text-color-primary"
  //       src="/icon/liveholdem.png"
  //       alt="logo"
  //     />
  //   ),
  // },
  {
    title: 'layout:updown',
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
  { title: 'casino:slot', href: ROUTER.Tagname('slots'), icon: SlotIcon },
  { title: 'casino:liveCasino', href: ROUTER.Tagname('Live Casino'), icon: LiveCasinoIcon },
  { title: 'casino:hotGame', href: ROUTER.Tagname('Hot Games'), icon: HotGameIcon },
  { title: 'casino:newReleases', href: ROUTER.Tagname('New Releases'), icon: ReleaseIcon },
  { title: 'casino:featureBuyIn', href: ROUTER.Tagname('Feature Buy-in'), icon: BuyInIcon },
  { title: 'casino:blackjack', href: ROUTER.Tagname('Blackjack'), icon: BlackjackIcon },
  { title: 'casino:tableGames', href: ROUTER.Tagname('Table Games'), icon: LiveCasinoIcon },
];
