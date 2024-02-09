import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { api_reviewAdd, api_reviewComment } from '@/api/game';
import { API_AVATAR } from '@/base/constants/common';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';
import Textarea from '@/components/input/typing/Textarea';

import CommonModal from '../commonModal/commonModal';

export default function CommentPostModal({
  show,
  onClose,
  gameId,
  commentId,
}: {
  show: boolean;
  onClose: () => void;
  gameId: string;
  commentId?: string;
}) {
  const { avatar } = useSelector((state: AppState) => ({
    avatar: state.auth.user.avatar,
  }));
  const { t } = useTranslation();
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    try {
      setIsLoading(true);
      const _res = await api_reviewAdd(gameId, commentId, review);
      console.log(_res, '-----');
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <Loader />}
      <CommonModal show={show} onClose={onClose} panelClass="sm:!max-w-[530px] sm:my-0 ">
        <div className="flex flex-col p-[20px] gap-[20px] mt-[40px] ">
          <div className="flex gap-[10px]">
            <Image
              height={45}
              width={45}
              src={String(API_AVATAR) + avatar}
              alt=""
              className="w-[50px] h-[50px]"
              onError={(e) => {
                e.currentTarget.src = '/img/avatar-1.png';
              }}
            />
            <textarea
              rows={3}
              className="flex-1 bg-color-modal-bg-secondary outline-none rounded-[5px] p-2 text-[14px] placeholder:text-color-text-primary dark:text-color-text-primary text-color-light-text-primary"
              placeholder="Add a comment"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="truncate bg-gradient-btn-default rounded-[5px] font-semibold sm:py-[9px] py-[5px] px-5 sm:text-[14px] text-[12px] flex items-center gap-[10px]"
              onClick={handlePost}
            >
              <div>{t('gameDetail:post')}</div>
            </button>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
