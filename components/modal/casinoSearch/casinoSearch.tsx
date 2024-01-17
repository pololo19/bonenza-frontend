import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { SearchNormal } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { api_getGamesByNameAndProvider, api_getPickGames } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { useWidth } from '@/base/hooks/useWidth';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { GameListType } from '@/base/types/common';
import CasinoSS from '@/components/casino/casinoSS';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import { NoDataComponent } from '@/components/noData/noData';

type ModalCasinoSearchProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalCasinoSearch({ show, onClose }: ModalCasinoSearchProps) {
  const width = useWidth();
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const casinoSearchRef = useRef<HTMLDivElement>(null);
  const casinoSearchBodyRef = useRef<HTMLDivElement>(null);

  const { isToggleSidebar, showChatType, listRecommendGame } = useSelector(
    (state: AppState) => ({
      isToggleSidebar: state.modal.isToggleSidebar,
      showChatType: state.modal.showChatType,
      listRecommendGame: state.game.recommandGames,
    }),
    shallowEqual,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState('');
  const [listSearchGame, setListSearchGame] = useState<GameListType[]>([]);

  const handleGetSearchGame = async () => {
    try {
      setIsLoading(true);
      const res = await api_getGamesByNameAndProvider(searchValue);
      const tempGameLists = res.data.data.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item?.payout ?? 0),
        multiplier: Number(item?.profitMultiplier ?? 0),
        providerName: item?.producerName ?? '',
        releasedAt: item?.releasedAt ?? '',
      }));
      setListSearchGame(tempGameLists);
    } catch (error) {
      setListSearchGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchValue.length >= 3) handleGetSearchGame();
  }, [searchValue]);

  const wheelHandler = (event: any) => {
    const layout = document.getElementById('base-layout');
    const currentPosition = layout?.scrollTop;
    layout?.scrollTo({ top: currentPosition + event.deltaY, behavior: 'smooth' });
  };

  return (
    <>
      {isLoading && <Loader />}
      <div
        onWheel={wheelHandler}
        ref={casinoSearchRef}
        className={cn(
          'fixed top-[67px] right-0 bottom-0 w-full transition-transform duration-800 sm:h-auto h-[calc(100vh_-_67px)] z-[5] bg-black/70',

          {
            'translate-y-0': show,
            '-translate-y-full': !show,
          },
          {
            'sm:ml-[62px] sm:max-w-[calc(100%-62px)]': !isToggleSidebar && !showChatType,
            'md:ml-[205px] md:max-w-[calc(100%-205px)]': isToggleSidebar && !showChatType,
            'xl:ml-[205px] xl:max-w-[calc(100%-565px)]': showChatType && isToggleSidebar,
            'sm:ml-[62px] xl:max-w-[calc(100%-422px)]': showChatType && !isToggleSidebar,
          },
        )}
      >
        <div
          className={cn('relative bg-color-header-secondary sm:h-auto h-full z-[6]')}
          style={{ transform: 'translateY(0%) translateZ(0px)' }}
          ref={casinoSearchBodyRef}
        >
          <div className="sm:px-[40px] px-[12px] sm:max-w-[1430px] pb-[30px] pt-[20px] m-auto h-full">
            <div className="relative">
              <input
                className={cn(
                  'p-[18px] pl-[70px] dark:text-white text-[#31373d] w-full text-[14px] h-[40px] rounded-[5px] dark:bg-color-input-secondary bg-[#f5f6fa] border border-solid border-white/10 focus-within:border-color-primary placeholder:text-[#4D545C] outline-none pointer-events-auto',
                )}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={String(t('casino:gameNameAndProvider'))}
              />
              <SearchNormal
                width={22}
                height={22}
                className="absolute top-1/2 left-[20px] transform -translate-x-1/2 -translate-y-1/2 dark:text-[#4D545C] text-[#31373d]"
              />
              {searchValue.length > 3 && (
                <div
                  role="button"
                  className="absolute top-1/2 right-[65px] w-[14px] h-[14px] transform -translate-x-1/2 text-[14px] -translate-y-1/2 text-white cursor-pointer"
                  onClick={() => setSearchValue('')}
                >
                  <XMarkIcon className="w-[14px] h-[14px] text-color-text-primary font-bold" />
                </div>
              )}
              <div
                role="button"
                className="absolute top-1/2 right-[-10px] transform -translate-x-1/2 text-[14px] -translate-y-1/2 text-white"
                onClick={onClose}
              >
                {t('setting:cancel')}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-[20px] ">
              {searchValue && searchValue.length < 3 && (
                <Image src={'/img/empty.png'} alt="noData" width={150} height={150} />
              )}
              {searchValue.length < 3 && (
                <div className="dark:text-gray-500 text-[#31373d]">{t('casino:searchRequires')}</div>
              )}
            </div>
            {searchValue.length >= 3 && !!listSearchGame.length && (
              <div className="sm:mb-[20px] mb-0 h-full">
                <div className="font-[600] dark:text-white text-black sm:text-[18px] text-[16px]">
                  {t('casino:searchResult')}
                </div>
                <div className="game-grid-parent mt-[10px] sm:max-h-[56vh] max-h-[calc(100%_-_100px)] h-fit overflow-y-auto scrollbar">
                  {listSearchGame.map((game, index) => {
                    return (
                      <div key={index} className="max-w-[185px]">
                        <GameCard gameDetail={game} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {searchValue.length >= 3 && !listSearchGame.length && (
              <div className="py-[10px]">
                <NoDataComponent />
              </div>
            )}
            <div className="sm:block hidden">
              <CasinoSS
                title={String(t('casino:recommendedForYou'))}
                data={listRecommendGame}
                renderItem={(item) => <GameCard gameDetail={item} />}
              />
            </div>
          </div>
        </div>
        <div className="top-0 left-0 fixed w-[100vw] h-[100vh] z-[5] bg-transparent" onClick={onClose}></div>
      </div>
    </>
  );
}
