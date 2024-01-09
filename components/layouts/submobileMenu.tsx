import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { OptionSidebarDataType } from '../common/iconOption/iconOption';
type SubMobileMenuProps = {
  datas: OptionSidebarDataType[];
  isShow: boolean;
};
const SubMobileMenu: React.FC<SubMobileMenuProps> = ({ datas, isShow }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <div
        className={cn(
          `gap-[8px] relative grid sm:hidden mt-[10px] font-semibold px-[12px] transition-transform duration-500`,
          {
            hidden: !isShow,
            '-translate-y-full': !isShow,
            'translate-y-0': isShow,
            'grid-cols-1': datas.length === 1,
            'grid-cols-2': datas.length === 2,
            'grid-cols-3': datas.length === 3,
            'grid-cols-4': datas.length === 4,
          },
        )}
      >
        {datas.map(({ title, href, icon }) => (
          <Link
            href={href}
            className={cn(
              'rounded-[5px] px-[10px] hover:text-[#31373d] py-[12px] group flex items-center gap-[5px] dark:text-white text-[#31373D] hover:bg-[#F6F7FA]  dark:hover:bg-color-hover-primary',
              `${
                (href === '/' ? router.route === href : router.route.includes(href))
                  ? 'dark:text-white dark:bg-[#2D3035] bg-[#F6F7FA] font-semibold'
                  : ''
              }`,
            )}
          >
            {icon}
            <div className={`text-[14px]`}>{t(title)}</div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default SubMobileMenu;
