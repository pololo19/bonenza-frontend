import cn from 'classnames';
import Image from 'next/image';
import { shallowEqual, useSelector } from 'react-redux';

import { API_AVATAR, TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER } from '@/base/constants/common';
import { changeIsShowInformation } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { formatDate } from '@/base/libs/utils';
import { t } from 'i18next';

interface MessageBoxProps {
  userId: string;
  time: string;
  level: string;
  text: string;
  userName: string;
  userAvatar: string;
}

export const MessageBox = ({ userId, time, level, text, userName, userAvatar }: MessageBoxProps) => {
  const dispatch = useAppDispatch();
  const { id } = useSelector(
    (state: AppState) => ({
      id: state.auth.user.userId,
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
        className={cn('flex w-full px-[20px]', {
          'justify-end': id === userId,
          'justify-start': id !== userId,
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

            <div className="flex items-center justify-center w-full absolute -bottom-2 ">
              <span
                className={'text-white rounded text-[12px] flex justify-center w-fit px-[10px]'}
                style={{ backgroundColor: getColorOfLevel(Number(level)) }}
              >
                {`V${level}`}
              </span>
            </div>
          </div>
          <div className={cn({ 'text-left': id !== userId, 'text-right': id === userId })}>
            <div className="text-m_default pl-1">
              <span
                className={cn('text-[#BBB] font-semibold', { 'hover:underline cursor-pointer': userName })}
                onClick={() => handleModalProfile()}
              >
                {userName ? userName : t('homePage:hidden')}
              </span>
              <span className="text-[11px] text-[#999] font-normal">
                {formatDate(new Date(parseFloat(time) * 1000), '  HH:mm a')}
              </span>
            </div>
            <div
              className="inline-block text-[13px] h-fit max-w-[220px] break-all bg-color-input-primary text-white rounded-[8px] px-2 py-[8px]"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
