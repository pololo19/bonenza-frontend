import cn from 'classnames';
import Image from 'next/image';
import { shallowEqual, useSelector } from 'react-redux';

import { API_AVATAR, TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER } from '@/base/constants/common';
import { changeIsShowChatTip, changeIsShowInformation, setTipReceiver } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { formatDate } from '@/base/libs/utils';
import styles from './message.module.scss';
import { useTranslation } from 'react-i18next';
import { Back, Gift } from 'iconsax-react';

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
  onReply: (messageId: string, messageContent: string, receiverName: string) => void;
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
        className={cn('flex w-full px-[10px] rounded-[4px] min-h-[60px] py-2', styles['message'], {
          'justify-end': id === userId,
          'justify-start': id !== userId,
          'bg-color-primary/10 border-l-[4px] border-solid border-l-color-primary':
            text.toLowerCase().indexOf('@' + name.toLowerCase()) >= 0 && id,
        })}
        onDoubleClick={() => onReply(messageId, text, userName)}
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
                <div
                  className={cn('cursor-pointer pl-4 text-white', styles['tip'])}
                  onClick={() => {
                    dispatch(setTipReceiver({ userId, userName, userAvatar }));
                    dispatch(changeIsShowChatTip(true));
                  }}
                >
                  <Gift className="w-4 h-4 -mt-1" />
                </div>
              )}
              {id !== userId && (
                <div
                  className={cn('cursor-pointer text-white', styles['reply'])}
                  onClick={() => onReply(messageId, text, userName)}
                >
                  <Back className="w-4 h-4 -mt-1" />
                </div>
              )}
            </div>
            <div className="inline-block">
              <div
                className={cn(
                  'text-left text-[13px] h-fit max-w-[220px] sm:max-w-[190px] break-all text-white rounded-[8px] px-2 py-2',
                  { 'bg-color-input-primary': id !== userId, 'bg-[#8873DD]': id === userId },
                )}
              >
                {replyId && (
                  <div className="bg-black/20 rounded-[8px] pt-2 pb-1 px-2 mb-2">
                    <div className="font-semibold text-left text-[#BBB] text-[13px]">{replyUserName}</div>
                    <div
                      className="font-normal inline-block !text-left max-w-[190px] sm:max-w-[160px] text-[13px] h-fit text-white rounded-[8px] !max-h-[20px]"
                      dangerouslySetInnerHTML={{ __html: replyText }}
                    />
                    <br />
                    <div />
                  </div>
                )}
                <div className="break-normal" dangerouslySetInnerHTML={{ __html: text }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
