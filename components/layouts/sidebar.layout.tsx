import Image from 'next/image';
import { useTheme } from 'next-themes';
import React, { useState } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { SIDEBAR_LIST } from '@/base/constants/common';

import IconOption from '../common/iconOption/iconOption';

export default function Sidebar() {
  const { t } = useTranslation('');
  const [mode, setMode] = useState(0);
  const { setTheme } = useTheme();

  return (
    <div className={'shadow-[10px_0px_7px_rgba(0,0,0,0.13)]'}>
      <div className="flex-1 md:w-[250px] md:w-full flex flex-col h-full py-5 px-[20px]">
        <div className="flex-1 w-full">
          <ul className="md:flex-col md:min-w-full flex flex-col list-none content-center">
            {!!SIDEBAR_LIST &&
              SIDEBAR_LIST.map((option, index) => (
                <IconOption
                  key={index}
                  title={String(t(option.name))}
                  href={option.href}
                  icon={option.icon}
                  classNames="hover:bg-gray-800 hover:text-white hover:rounded-[6px] text-gray-400"
                />
              ))}
          </ul>
          <div className="px-[15px] mt-[64px]">
            <div className="text-[#C2C2C2]">{t('layout:insights')}</div>
            <div className="mt-[15px] flex gap-[14px]">
              <Image width={24} height={24} src="/img/icon/inbox.png" className="w-6 h-6" alt="inbox" />
              <div className="text-[#C2C2C2]">{t('layout:inbox')}</div>
              <div className="w-[20px] h-[20px] rounded-md text-white bg-red-500 text-sm text-center items-center">
                8
              </div>
            </div>
          </div>
          <div className="mt-[50px] rounded-large bg-[#161D26] flex items-center justify-center p-[10px]">
            <div
              className={`flex justify-center items-center flex-1 px-[15px] py-[10px] gap-[10px] rounded-[14px] cursor-pointer ${mode === 0 ? 'bg-[#F39717]' : ''
                }`}
              onClick={() => {
                setMode(0);
                setTheme('dark');
              }}
            >
              <Image width={16} height={16} src="/img/icon/dark.png" className="w-4 h-4" alt="dark" />
              <div className="text-white text-sm">{t('layout:dark')}</div>
            </div>
            <div
              className={`flex justify-center items-center flex-1 px-[15px] py-[10px] gap-[10px] rounded-[14px] cursor-pointer ${mode === 1 ? 'bg-[#F39717]' : ''
                }`}
              onClick={() => {
                setMode(1);
                setTheme('light');
              }}
            >
              <Image width={16} height={16} src="/img/icon/light.png" className="w-4 h-4" alt="light" />
              <div className="text-white text-sm">{t('layout:light')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
