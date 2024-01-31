import { Menu, Transition } from '@headlessui/react';
import { ArrowDown2, ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import { Fragment, useMemo } from 'react';

import { useTranslation } from '@/base/config/i18next';

interface IProps {
  onPageChange?: (action: string) => void;
  setItemPerPage?: (itemPerPage: number) => void;
  currentPage: number;
  itemPerPage: number;
  totalItem: number;
  hiddenPerPage?: boolean;
}

const Paging: React.FC<IProps> = ({
  currentPage,
  onPageChange,
  itemPerPage,
  totalItem,
  setItemPerPage,
  hiddenPerPage = false,
}) => {
  const disableNext = useMemo(() => {
    return Math.ceil(totalItem / itemPerPage) <= currentPage;
  }, [currentPage, totalItem, itemPerPage]);

  const disablePrev = useMemo(() => {
    return currentPage === 1;
  }, [currentPage]);

  const LIST_ITEM_PER_PAGE = [5, 10, 20];

  const { t } = useTranslation('');

  return (
    <div className="flex items-center justify-end p-[10px] gap-6 select-none">
      {hiddenPerPage && (
        <Menu
          as="div"
          className="relative h-[38px] flex items-center justify-center text-[14px] min-w-[60px] select-none bg-color-light-bg-primary dark:bg-transparent"
        >
          <Menu.Button className="flex-1 ">
            <div className="flex items-center justify-center w-full gap-2 dark:text-white text-black" role="button">
              {itemPerPage}
              <ArrowDown2 className="h-[16px] w-[16px]" />
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
            <Menu.Items className="absolute dark:bg-color-pagination-primary bg-color-light-bg-primary w-full origin-top-right right-0 top-[40px] z-[10] cursor-pointer">
              <div className="py-0">
                {LIST_ITEM_PER_PAGE.map((item, index) => (
                  <Menu.Item key={index}>
                    {() => (
                      <div
                        className="flex items-center justify-start py-[10px] px-[20px] w-full dark:hover:bg-[#212b36] hover:bg-[#f5f6fa]"
                        role="button"
                        onClick={() => setItemPerPage?.(item)}
                      >
                        <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                          <div className="flex-1 text-start dark:text-white text-black">{item}</div>
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
      <div className="flex items-center gap-6">
        <p className="dark:text-[#98A7B5] text-[#31373d] text-[12px]">
          {t('paging:total')}: {totalItem}
        </p>
        <div className="dark:text-white text-black font-bold p-1 px-4 text-[12px]">{currentPage}</div>
        <div className="flex">
          <button
            className={`p-2 ${
              disablePrev
                ? 'opacity-20 cursor-not-allowed'
                : 'dark:hover:bg-[#24262b80] dark:text-white text-black hover:bg-[#f5f6fa] dark:bg-transparent bg-color-light-bg-primary'
            }`}
            onClick={() => onPageChange?.('Prev')}
            disabled={disablePrev}
          >
            <ArrowLeft2 className="h-[16px] w-[16px] flex justify-center items-center" />
          </button>
          <button
            className={`p-2 ${
              disableNext
                ? 'opacity-20 cursor-not-allowed'
                : 'dark:hover:bg-[#24262b80] dark:text-white text-black hover:bg-[#f5f6fa] dark:bg-transparent bg-color-light-bg-primary'
            }`}
            onClick={() => onPageChange?.('Next')}
            disabled={disableNext}
          >
            <ArrowRight2 className="h-[16px] w-[16px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Paging;
