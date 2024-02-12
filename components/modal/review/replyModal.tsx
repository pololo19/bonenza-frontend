import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

import { api_reviewAdd, api_reviewComment, api_reviewLike, api_reviewList } from '@/api/game';
import { API_AVATAR } from '@/base/constants/common';
import { getDuration } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';
import { CommentType } from '@/components/game/gameReview';
import Textarea from '@/components/input/typing/Textarea';

import CommonModal from '../commonModal/commonModal';

export default function ReplyModal({
  show,
  onClose,
  gameId,
  commentId,
  sourceComment,
}: {
  show: boolean;
  onClose: () => void;
  gameId: string;
  commentId: string;
  sourceComment: CommentType;
}) {
  const { avatar } = useSelector(
    (state: AppState) => ({
      avatar: state.auth.user.avatar,
    }),
    shallowEqual,
  );
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [commentData, setCommentData] = useState<CommentType[]>([]);

  const handleGetList = useCallback(async () => {
    try {
      setIsLoading(true);
      const _res = await api_reviewList(commentId, gameId, page, 10, 'newest');
      const tempCommentDatas: CommentType[] = _res?.data?.comments.map((item: any) => ({
        id: item?.id ?? '',
        userId: item?.userId ?? '',
        userName: item?.userName ?? '',
        userAvatar: item?.userAvatar ?? '',
        text: item?.text ?? '',
        time: item?.time ?? new Date(),
        likes: Number(item?.likesCount ?? 0),
        comments: Number(item?.commentsCount ?? 0),
      }));
      setCommentData(tempCommentDatas);
    } catch (error) {
      setCommentData([]);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    handleGetList();
  }, []);

  return (
    <>
      <CommonModal show={show} onClose={onClose} panelClass="sm:!max-w-[530px] sm:my-0 ">
        <div className="flex flex-col p-[20px] mt-[40px] ">
          <div className="flex gap-[10px]">
            <div className="text-xs dark:text-color-text-primary text-color-light-text-primary w-full">
              <div className="flex justify-between items-center">
                <div className="">
                  <div className="flex items-center gap-2">
                    <Image
                      src={String(API_AVATAR) + sourceComment.userAvatar}
                      alt=""
                      width={36}
                      height={36}
                      className="w-7 h-7 rounded-full"
                      onError={(err) => {
                        err.currentTarget.src = '/img/avatar-1.png';
                      }}
                    />
                    <span
                      className="text-[14px] hover:underline cursor-pointer"
                      // onClick={() => openModalUserProfile(sourceComment.userId, sourceComment.userAvatar, sourceComment.userName)}
                    >
                      {sourceComment.userName}
                    </span>
                    <span className="text-[#53575C]">{getDuration(sourceComment.time)}</span>
                  </div>
                  <p className="mt-[13px] ml-[23px] dark:text-white text-black">{sourceComment.text}</p>
                </div>
                <div className="-mt-8 flex gap-6 mr-3 text-sm">
                  <div
                    className="flex gap-[5px] items-center justify-center cursor-pointer"
                    //   onClick={() => handleLikeComment(comment.id)}
                  >
                    <i className="fi fi-rr-social-network"></i>
                    {sourceComment.likes > 0 && <span className="ml-[10px]">{sourceComment.likes}</span>}
                  </div>
                  <div
                    className="cursor-pointer"
                    //   onClick={() => {
                    //     setCommentId(comment.id);
                    //     setShowComment(true);
                    //   }}
                  >
                    <i className="fi fi-rs-beacon"></i>
                    {sourceComment.comments > 0 && <span className="ml-[10px]">{sourceComment.comments}</span>}
                  </div>
                  <div className="cursor-pointer">
                    <i className="fi fi-rr-menu-dots-vertical"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            {isLoading && <Loader />}
            {commentData.map((comment, index) => (
              <div className="text-xs dark:text-color-text-primary text-color-light-text-primary" key={index}>
                <div className="flex justify-between items-center h-[120px] md:h-[93px] mt-4 dark:bg-color-select-bg-primary bg-white">
                  <div className="ml-[17px]">
                    <div className="flex items-center gap-2">
                      <Image
                        src={String(API_AVATAR) + comment.userAvatar}
                        alt=""
                        width={36}
                        height={36}
                        className="w-7 h-7 rounded-full"
                        onError={(err) => {
                          err.currentTarget.src = '/img/avatar-1.png';
                        }}
                      />
                      <span
                        className="text-[14px] hover:underline cursor-pointer"
                        // onClick={() => openModalUserProfile(comment.userId, comment.userAvatar, comment.userName)}
                      >
                        {comment.userName}
                      </span>
                      <span className="text-[#53575C]">{getDuration(comment.time)}</span>
                    </div>
                    <p className="mt-[13px] ml-[23px] dark:text-white text-black">{comment.text}</p>
                    {comment.comments > 0 && (
                      <p className="mt-[10px] text-color-primary hover:underline cursor-pointer">
                        {t('gameDetail:showReplies', { count: comment.comments })}
                      </p>
                    )}
                  </div>
                  <div className="-mt-8 flex gap-6 mr-3 text-sm">
                    <div
                      className="flex gap-[5px] items-center justify-center cursor-pointer"
                      //   onClick={() => handleLikeComment(comment.id)}
                    >
                      <i className="fi fi-rr-social-network"></i>
                      {comment.likes > 0 && <span className="ml-[10px]">{comment.likes}</span>}
                    </div>
                    <div
                      className="cursor-pointer"
                      //   onClick={() => {
                      //     setCommentId(comment.id);
                      //     setShowComment(true);
                      //   }}
                    >
                      <i className="fi fi-rs-beacon"></i>
                      {comment.comments > 0 && <span className="ml-[10px]">{comment.comments}</span>}
                    </div>
                    <div className="cursor-pointer">
                      <i className="fi fi-rr-menu-dots-vertical"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CommonModal>
    </>
  );
}
