import { useTranslation } from '@/base/config/i18next';
import { GameDetail, GameListType } from '@/base/types/common';

const GameDescriptionComponent = ({ gameDetail }: { gameDetail: GameListType }) => {
  const { t } = useTranslation('');

  return (
    <div>
      <div className="dark:text-white text-[#000]">{t('gameDetail:aboutThisGame')}</div>
      <div className="sm:text-[18px] text-[16px] dark:text-gray-400 mt-2 text-[#31373d]">
        {gameDetail?.title}: {t('gameDetail:gameReviewTheme')}
      </div>
      <div className="text-[14px] dark:text-gray-400 text-[#31373d] my-4">{gameDetail.description}</div>
    </div>
  );
};

export default GameDescriptionComponent;
