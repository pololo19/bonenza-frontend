import cn from 'classnames';
import Image from 'next/image';
import { shallowEqual, useSelector } from 'react-redux';

import { API_AVATAR } from '@/base/constants/common';
import { changeIsShowInformation } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';

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
      <div className={cn('flex w-full px-[10px]', { 'justify-end': id === userId, 'justify-start': id !== userId })}>
        <div
          className={cn('flex w-full gap-1', {
            'justify-start flex-row-reverse': id === userId,
            'justify-start': id !== userId,
          })}
        >
          <div className="block relative w-[50px] h-fit cursor-pointer" onClick={() => handleModalProfile()}>
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

            <div className="flex items-center justify-center w-full absolute bottom-0 ">
              <span
                className={'text-white rounded text-[12px] flex justify-center w-fit px-[10px]'}
                style={{ backgroundColor: getColorOfLevel(Number(level)) }}
              >
                {`V${level}`}
              </span>
            </div>
          </div>
          <div
            className="flex items-center text-[12px] h-fit max-w-[220px] break-all bg-color-bg-primary text-white rounded-default p-[10px]"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      </div>
    </>
  );
};
