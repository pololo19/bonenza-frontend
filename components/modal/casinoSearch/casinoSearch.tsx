import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { SearchNormal } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { changeIsShowCasinoSearch } from '@/base/redux/reducers/modal.reducer';
import { GameDetail } from '@/base/types/common';
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
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState('');
  const [listRecommendGame, setListRecommendGame] = useState<GameDetail[]>([]);
  const [listSearchGame, setListSearchGame] = useState<GameDetail[]>([]);

  const handleGetListRecommendGame = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-all-games', { params: { limit: 20 } });
      setListRecommendGame(res.data.data);
    } catch (error) {
      setListRecommendGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetSearchGame = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('game/get-all-games', {
        params: { limit: 20, search: searchValue },
      });
      setListSearchGame(res.data.data);
    } catch (error) {
      setListSearchGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetListRecommendGame();
  }, []);

  useEffect(() => {
    if (searchValue.length >= 3) handleGetSearchGame();
  }, [searchValue]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="relative dark:bg-[#25262B] bg-white m-auto mt-[11px] w-full shadow shadow-[0px_9px_17px_0px_#00000040]">
        <div className="sm:px-[40px] px-[12px] sm:max-w-[1430px] pb-[30px] pt-[20px] m-auto">
          <div className="relative">
            <input
              className={cn(
                'p-[18px] pl-[50px] dark:text-white text-[#31373d] w-full text-[14px] h-[40px] rounded-[5px] dark:bg-[#161D26] bg-[#f5f6fa] placeholder:text-[#4D545C] outline-none',
              )}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={String(t('casino:gameNameAndProvider'))}
            />
            <SearchNormal
              width={24}
              height={24}
              className="absolute top-1/2 left-[20px] transform -translate-x-1/2 -translate-y-1/2 dark:text-[#4D545C] text-[#31373d]"
            />
            <div
              role="button"
              className="absolute top-1/2 right-[-10px] transform -translate-x-1/2 -translate-y-1/2 dark:text-[#4D545C] text-[#31373d]"
              onClick={() => {
                dispatch(changeIsShowCasinoSearch(false));
              }}
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
            <div className="mb-[20px]">
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
          <CasinoSS
            title={String(t('casino:recommendedForYou'))}
            data={listRecommendGame}
            renderItem={(item) => <GameCard gameDetail={item} />}
          />
        </div>

        <div
          className="absolute h-[100vh] w-full bg-[black]/50 mb-[-67px]"
          onClick={() => {
            dispatch(changeIsShowCasinoSearch(false));
          }}
        ></div>
      </div>
    </>
  );
}
