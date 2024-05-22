import cn from 'classnames';
import Image from 'next/image';
import { shallowEqual, useSelector } from 'react-redux';

import { API_AVATAR, TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER } from '@/base/constants/common';
import { changeIsShowInformation } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { formatDate } from '@/base/libs/utils';
import { t } from 'i18next';
import styles from './message.module.scss';
import AltIcon from '../icons/AltIcon';
import TipIcon from '../icons/TipIcon';
import { useTranslation } from 'react-i18next';

interface MessageBoxProps {
  messageId: string;
  userId: string;
  time: string;
  level: string;
  text: string;
  userName: string;
  userAvatar: string;
  replyId: string;
  replyUserId: string;
  replyUserName: string;
  replyText: string;
  onReply: (messageId: string, receiverId: string, receiverName: string, senderId: string) => void;
}

export const MessageBox = ({
  messageId,
  userId,
  time,
  level,
  text,
  userName,
  userAvatar,
  onReply,
  replyId,
  replyUserId,
  replyUserName,
  replyText,
}: MessageBoxProps) => {
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();
  const { id, name } = useSelector(
    (state: AppState) => ({
      id: state.auth.user.userId,
      name: state.auth.user.userName,
    }),
    shallowEqual,
  );

  const handleModalProfile = () => {
    const userData = {
      username: userName,
      userId: userId,
    };

    dispatch(setUserData(userData));
    if (userName) {
      dispatch(changeIsShowInformation(true));
    }
  };

  const getColorOfLevel = (level: number) => {
    let bg = '#00AAE6';
    if (level > 1) {
      bg = '#77493E';
    }
    if (level > 7) {
      bg = '#939699';
    }
    if (level > 21) {
      bg = '#A37843';
    }
    if (level > 37) {
      bg = '#00C2FF';
    }
    if (level > 69) {
      bg = '#00B9A6';
    }
    return bg;
  };
  return (
    <>
      <div
        className={cn('flex w-full px-[10px] rounded min-h-[60px] py-2', styles['message'], {
          'justify-end': id === userId,
          'justify-start': id !== userId,
          'border-l-[3px] border-solid border-l-color-primary':
            text.toLowerCase().indexOf('@' + name.toLowerCase()) >= 0,
        })}
      >
        <div
          className={cn('flex w-full gap-2', {
            'justify-start flex-row-reverse': id === userId,
            'justify-start': id !== userId,
          })}
        >
          <div className="block relative w-[50px] h-fit cursor-pointer" onClick={() => handleModalProfile()}>
            {userName ? (
              <Image
                className="w-[50px] h-[50px] rounded-full"
                width={50}
                height={50}
                alt=""
                src={userAvatar ? `${API_AVATAR}${userAvatar}` : '/img/avatar-1.png'}
                onError={(e) => {
                  e.currentTarget.src = '/img/avatar-1.png';
                }}
              />
            ) : (
              <Image
                width={50}
                height={50}
                className="w-[50px] h-[50px] rounded-full grayscale brightness-50"
                src="/img/avatar-hidden.png"
                alt=""
              />
            )}

            <div className="flex items-center justify-center w-full absolute -bottom-[3px] ">
              <span
                className={'text-white rounded text-[12px] flex justify-center w-fit px-[10px]'}
                style={{ backgroundColor: getColorOfLevel(Number(level)) }}
              >
                {`V${level}`}
              </span>
            </div>
          </div>
          <div className={cn({ 'text-left': id !== userId, 'text-right': id === userId })}>
            <div className={cn('flex items-center gap-2 text-[13px] pl-1')}>
              <div
                className={cn('text-[#BBB] font-semibold', { 'hover:underline cursor-pointer': userName })}
                onClick={() => handleModalProfile()}
              >
                {id !== userId ? (userName ? userName : t('homePage:hidden')) : ''}
              </div>
              <div className={cn('text-[12px] text-center text-[#999] font-normal')}>
                {formatDate(new Date(parseFloat(time) * 1000), '  HH:mm a')}
              </div>
              {id !== userId && (
                <div className={cn('cursor-pointer pl-4', styles['tip'])}>
                  <TipIcon className="w-4 h-4" />
                </div>
              )}
              {id !== userId && (
                <div
                  className={cn('cursor-pointer', styles['reply'])}
                  onClick={() => onReply(messageId, userId, userName, id)}
                >
                  <AltIcon className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="inline-block">
              {}
              {replyId && (replyUserId === id || userId === id) && (
                <div className="bg-[#272727] rounded-[8px] p-2 pb-[10px] -mb-[10px]">
                  <div className="text-left text-gray-400 text-[13px]">
                    {replyUserId === id
                      ? t('chat:replyToYou')
                      : String(
                          t('chat:yourReplyTo', {
                            receiver: replyUserName,
                          }),
                        )}
                  </div>
                  <div
                    className="font-semibold inline-block !text-left text-[13px] h-fit max-w-[230px] break-all text-gray-500 rounded-[8px] py-[8px]"
                    dangerouslySetInnerHTML={{ __html: replyText }}
                  />
                  <br />
                </div>
              )}
              <div
                className={cn(
                  'inline-block text-left text-[13px] h-fit max-w-[230px] break-all text-white rounded-[8px] px-2 py-[8px]',
                  { 'bg-color-input-primary': id !== userId, 'bg-[#385730]': id === userId },
                )}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
