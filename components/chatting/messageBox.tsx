import { API_AVATAR } from '@/base/constants/common';
import { AppState } from '@/base/redux/store';
import cn from 'classnames';
import Image from 'next/image';
import { shallowEqual, useSelector } from 'react-redux';

interface MessageBoxProps {
  userId: string;
  time: number;
  level: string;
  text: string;
  userName: string;
  userAvatar: string;
}

export const MessageBox = ({ userId, time, level, text, userName, userAvatar }: MessageBoxProps) => {
  const { id } = useSelector(
    (state: AppState) => ({
      id: state.auth.user.userId,
    }),
    shallowEqual,
  );
  return (
    <>
      <div className={cn('flex w-full', { 'justify-end': id === userId, 'justify-start': id !== userId })}>
        <div className="flex">
          <div className="flex relative">
            <Image width={50} height={50} alt="" src={String(API_AVATAR) + userAvatar} />
            <span>{level}</span>
          </div>
          <div className="w-[70%] rounded-default">{text}</div>
        </div>
      </div>
    </>
  );
};
