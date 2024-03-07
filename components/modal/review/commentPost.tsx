import { Popover, Transition } from '@headlessui/react';
import EmojiPicker, { Emoji, EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { Happyemoji } from 'iconsax-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

import { api_reviewAdd, api_reviewComment } from '@/api/game';
import { API_AVATAR } from '@/base/constants/common';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';
import { CommentType } from '@/components/game/gameReview';
import Textarea from '@/components/input/typing/Textarea';

import CommonModal from '../commonModal/commonModal';

export default function CommentPostModal({
  show,
  onClose,
  gameId,
  commentId,
  comments,
  setCommentData,
  subComment = false,
  onSubmit,
}: {
  show: boolean;
  onClose: () => void;
  gameId: string;
  commentId?: string;
  comments: CommentType[];
  setCommentData: (comments: CommentType[]) => void;
  subComment?: boolean;
  onSubmit?: () => void;
}) {
  const { theme } = useTheme();
  const { avatar } = useSelector(
    (state: AppState) => ({
      avatar: state.auth.user.avatar,
    }),
    shallowEqual,
  );
  const { t } = useTranslation();
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    try {
      setIsLoading(true);
      const _res = await api_reviewAdd(gameId, commentId, review);
      const newComment: CommentType = {
        id: _res?.data?.id ?? '',
        userId: _res?.data?.userId ?? '',
        userAvatar: _res?.data?.userAvatar ?? '',
        likes: Number(_res?.data?.likesCount || 0),
        userName: _res?.data?.userName ?? '',
        text: _res?.data?.text ?? '',
        time: _res?.data?.time ?? new Date(),
        like: !!_res?.data.like,
        comments: 0,
        child: [],
        showReply: false,
      };
      if (commentId && !subComment) {
        const tempCommentDatas = [...comments].map((item) => {
          if (item.id === commentId) {
            item.comments += 1;
          }
          return item;
        });
        setCommentData([...tempCommentDatas]);
      } else {
        setCommentData([newComment, ...comments]);
      }
      if (onSubmit) onSubmit();
    } catch (error) {
    } finally {
      onClose();
      setIsLoading(false);
    }
  };
  return (
    <>
      <CommonModal show={show} onClose={onClose} panelClass="sm:!max-w-[530px] sm:my-0 ">
        <div className="flex flex-col p-[20px] gap-[20px] mt-[40px] ">
          {isLoading && <Loader />}
          <div className="flex gap-[10px]">
            <Image
              height={45}
              width={45}
              src={String(API_AVATAR) + avatar}
              alt=""
              className="w-[50px] h-[50px] rounded-full"
              onError={(e) => {
                e.currentTarget.src = '/img/avatar-1.png';
              }}
            />
            <textarea
              rows={5}
              className="flex-1 bg-color-modal-bg-secondary outline-none rounded-[5px] p-2 text-[14px] placeholder:text-color-text-primary dark:text-white text-color-light-text-primary"
              placeholder="Add a comment"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
          <div className="flex justify-between relative ml-[60px]">
            <Popover>
              {({ open }) => (
                <>
                  <Popover.Button>
                    <Happyemoji />
                  </Popover.Button>
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed sm:hidden block inset-0 bg-black/80 transition-opacity z-[-1]" />
                  </Transition.Child>
                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Popover.Panel
                      static
                      className="sm:absolute sm:mr-0 mr-[10px] fixed -top-[300px] h-auto z-10 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none w-full"
                    >
                      <div className="sm:relative fixed rounded-md dark:bg-color-menu-primary bg-white shadow-gray-700 dark:shadow w-full">
                        <EmojiPicker
                          emojiStyle={EmojiStyle.NATIVE}
                          theme={theme == 'light' ? Theme.LIGHT : Theme.DARK}
                          width={'100%'}
                          height={300}
                          onEmojiClick={(emojiData) => setReview((cur) => `${cur}${emojiData.emoji}`)}
                        />
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            <button
              type="button"
              className="truncate bg-gradient-btn-play rounded-[5px] font-semibold sm:py-[9px] py-[5px] px-5 sm:text-[14px] text-[12px] flex items-center gap-[10px]"
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
