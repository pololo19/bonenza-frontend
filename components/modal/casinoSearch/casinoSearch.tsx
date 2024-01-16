import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { SearchNormal } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, useEffect, useState } from 'react';
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

  return (
    <>
      {isLoading && <Loader />}
      <div
        className={cn(
          'fixed top-[67px] right-0 bottom-0 w-full transition-transform duration-800 sm:h-auto h-[calc(100vh_-_67px)] z-[5]',

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
          className={cn('relative bg-color-header-secondary')}
          style={{ transform: 'translateY(0%) translateZ(0px)' }}
        >
          <div className="sm:px-[40px] px-[12px] sm:max-w-[1430px] pb-[30px] pt-[20px] m-auto h-full">
            <div className="relative">
              <input
                className={cn(
                  'p-[18px] pl-[50px] dark:text-white text-[#31373d] w-full text-[14px] h-[40px] rounded-[5px] dark:bg-color-input-secondary bg-[#f5f6fa] border border-solid border-white/10 focus-within:border-color-primary placeholder:text-[#4D545C] outline-none',
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
              <div className="sm:mb-[20px] mb-0">
                <div className="font-[600] dark:text-white text-black sm:text-[18px] text-[16px]">
                  {t('casino:searchResult')}
                </div>
                <div className="game-grid-parent mt-[10px] max-h-[56vh] h-fit overflow-y-auto">
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
            <div className="">
              <CasinoSS
                title={String(t('casino:recommendedForYou'))}
                data={listRecommendGame}
                renderItem={(item) => <GameCard gameDetail={item} />}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
