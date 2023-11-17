import { useTranslation } from '@/base/config/i18next';
import Image from 'next/image';
import Link from 'next/link';

export default function ComingSoon() {
  const { t } = useTranslation('');
  return (
    <div className="md:px-10 pb-8 flex flex-col items-center gap-[20px] mt-[30px]">
      <div className="text-[24px] lg:text-[36px] font-[600] font-inter text-[#6E757C] text-center">
        {t('comingSoon')}
      </div>
      <Image src={'/img/coming-soon.png'} alt={''} width={200} height={200} className="mt-[-20px]" />
      <div className="flex sm:flex-row flex-col gap-[20px] justify-between items-center">
        <div className="flex justify-end items-center gap-[24px]">
          <Link target="blank" href="" className="block text-[#777E90] text-[16px] leading-[32px]">
            <Image src={'/img/facebook.png'} height={25} width={25} alt="logo" />
          </Link>
          <Link target="blank" href="" className="block text-[#777E90] text-[16px] leading-[32px]">
            <Image src={'/img/icon/twitter.png'} height={25} width={25} alt="logo" />
          </Link>
          <Link target="blank" href="" className="block text-[#777E90] text-[16px] leading-[32px]">
            <Image src={'/img/ig.png'} height={25} width={25} alt="logo" />
          </Link>
          <Link target="blank" href="" className="block text-[#777E90] text-[16px] leading-[32px]">
            <Image src={'/img/ss.png'} height={25} width={25} alt="logo" />
          </Link>
        </div>
      </div>
    </div>
  );
}
