import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { CloseCircle, InfoCircle } from 'iconsax-react';
import { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { changeShowChatType, changeShowFullChat } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import ModalChatRules from '@/components/modal/chatRules/chatRules';

const ChattingComponent = () => {
  const [isShowChatRules, setIsShowChatRules] = useState(false);

  const dispatch = useDispatch();
  const { showChatType, showFullChat, isLogin, userInfo } = useSelector(
    (state: AppState) => ({
      showChatType: state.modal.showChatType,
      showFullChat: state.modal.showFullChat,
      isLogin: state.auth.isLogin,
      userInfo: state.auth.user,
    }),
    shallowEqual,
  );

  const { t } = useTranslation('');

  return (
    <>
      <div
        className={cn(
          'shadow-gray-700 shadow w-full bg-white dark:bg-color-bg-primary flex flex-col right-0 justify-between sm:pb-0 pb-2 h-screen',
          {
            flex: showChatType,
            hidden: !showChatType,
            'w-[360px]': !showFullChat,
          },
        )}
      >
        <div className="flex flex-col justify-between flex-1">
          <div className="flex justify-between items-center h-[70px] px-5 py-2 border-b-[1px] border-solid dark:border-color-border-primary border-color-light-border-primary">
            <div className="text-[18px] text-black dark:text-[#ffffff] font-semibold">{t('chatting:chat')}</div>
            <div className="flex gap-[13px]">
              <button
                className="bg-color-light-bg-primary dark:bg-color-input-primary text-black dark:text-[#ffffff] hover:bg-gray-400 hover:text-white dark:hover:bg-gray-800 rounded-[14px] p-[10px] flex items-center justify-center"
                onClick={() => {
                  setIsShowChatRules(true);
                }}
              >
                <InfoCircle className="" width={20} height={20} />
              </button>
              <button
                className="bg-color-light-bg-primary dark:bg-color-input-primary text-black dark:text-[#ffffff] hover:bg-gray-400 hover:text-white dark:hover:bg-gray-800 rounded-[14px] p-[10px] flex items-center justify-center"
                onClick={() => {
                  dispatch(changeShowChatType(false));
                  dispatch(changeShowFullChat(false));
                }}
              >
                <CloseCircle className="" width={20} height={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col flex-1 justify-end bg-black">
            <div className="flex py-[10px] bg-color-bg-primary px-[7px] gap-[10px]">
              <input className="h-[46px] w-full dark:bg-[#0A0A0A] rounded-default  outline-none px-[10px] dark:text-color-text-primary" />
              <div className="p-[10px] rounded-default bg-gradient-btn-play">
                <PaperAirplaneIcon className="w-[25px] h-[25px] text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isShowChatRules && (
        <ModalChatRules
          show={isShowChatRules}
          onClose={() => {
            setIsShowChatRules(false);
          }}
        />
      )}
    </>
  );
};

export default ChattingComponent;
