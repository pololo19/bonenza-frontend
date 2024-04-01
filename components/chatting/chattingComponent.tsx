import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { CloseCircle, InfoCircle } from 'iconsax-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactLoading from 'react-loading';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getChatHistory, api_sendChat } from '@/api/chat';
import { useTranslation } from '@/base/config/i18next';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { setIsNewMessage } from '@/base/redux/reducers/common.reducer';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowChatRule,
  changeShowChatType,
  changeShowFullChat,
} from '@/base/redux/reducers/modal.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { AuthenticationModeEnum, MessageType } from '@/base/types/common';

import { MessageBox } from './messageBox';

const ChattingComponent = () => {
  const dispatch = useAppDispatch();
  const chatRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isShowChatRules, setIsShowChatRules] = useState(false);
  const [isFirstLoading, setIsFirstLoading] = useState(false);

  const { showChatType, showFullChat, isLogin, lastMessage } = useSelector(
    (state: AppState) => ({
      showChatType: state.modal.showChatType,
      showFullChat: state.modal.showFullChat,
      isLogin: state.auth.isLogin,
      userInfo: state.auth.user,
      lastMessage: state.common.lastMessage,
    }),
    shallowEqual,
  );

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inComingMessage, setInComingMessage] = useState<MessageType[]>([]);

  const getMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const _res = await api_getChatHistory(messages.length, 20);
      const tempMessages: MessageType[] =
        _res.data?.map((item: any) => ({
          id: item.id ?? '',
          userId: item.userId ?? '',
          userName: item.userName ?? '',
          userAvatar: item.userAvatar ?? '',
          level: item.userVipLevel ?? '',
          time: item.time ?? '',
          text: item.text ?? '',
        })) || [];
      if (tempMessages.length > 0) {
        const lastMessage = tempMessages[0];
        CookiesStorage.setCookieData('last_message', lastMessage.id);
        dispatch(setIsNewMessage(false));
      }

      setMessages([...messages, ...tempMessages]);
    } catch (error) {
      console.log(error);
      // setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const scrollDown = () => {
    const $chatContainer = scrollRef.current;
    if (!$chatContainer) {
      return;
    }
    $chatContainer.scrollTop = $chatContainer.scrollHeight;
  };

  const handleSubmit = async (e: any) => {
    let $spanEl;
    let innerText;
    $spanEl = chatRef.current;
    if (!$spanEl) return;
    innerText = $spanEl.innerText;
    innerText = innerText.trim();
    if (e.keyCode !== 13 || e.shiftKey || !innerText) {
      return;
    }
    await sendMessage();

    e.preventDefault();
  };

  const loadNewMessage = async () => {
    const $chatContainer = scrollRef.current;
    if (!$chatContainer) return;
    if ($chatContainer.scrollTop === 0) {
      setIsFirstLoading(false);
      await getMessages();
    }
  };

  const sendMessage = async () => {
    if (!isLogin) {
      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
      dispatch(changeIsShowAuthenticationModal(true));
      return;
    }
    const $spanEl = chatRef.current;
    if (!$spanEl) return;
    let msg = $spanEl.innerHTML;
    msg = msg.replaceAll('<div>', '');
    msg = msg.replaceAll('</div>', '');
    const _res = await api_sendChat(msg);
    scrollDown();
    $spanEl.innerHTML = '';
    $spanEl.blur();
    $spanEl.focus();
  };

  const { t } = useTranslation('');

  useEffect(() => {
    setIsFirstLoading(true);
    getMessages();
  }, [showChatType]);

  useEffect(() => {
    if (lastMessage?.id) {
      setInComingMessage([{ ...lastMessage }]);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (inComingMessage.length > 0) {
      setMessages([...inComingMessage, ...messages]);
    }
  }, [inComingMessage]);

  useEffect(() => {
    if (isFirstLoading && messages.length > 0) {
      scrollDown();
    }
  }, [messages, isFirstLoading]);

  return (
    <>
      <div
        className={cn(
          'shadow-gray-700 shadow bg-white dark:bg-color-bg-primary flex flex-col right-0 justify-between sm:pb-0 pb-2 h-screen',
          {
            flex: showChatType,
            hidden: !showChatType,
            'min-w-[100vw] sm:min-w-[330px]': !showFullChat,
          },
        )}
      >
        <div className="flex flex-col justify-between w-full h-[100vh]">
          <div className="flex justify-between items-center h-[70px] z-[5] px-5 py-2 border-b-[1px] border-solid dark:border-color-border-primary border-color-light-border-primary">
            <div className="text-[18px] text-black dark:text-[#ffffff] font-semibold">{t('chatting:chat')}</div>
            <div className="flex gap-[13px]">
              <button
                className="bg-color-light-bg-primary dark:bg-color-input-primary text-black dark:text-[#ffffff] hover:bg-gray-400 hover:text-white dark:hover:bg-gray-800 rounded-[14px] p-[10px] flex items-center justify-center"
                onClick={() => {
                  dispatch(changeIsShowChatRule(true));
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
          <div
            className="flex flex-col max-h-[calc(100vh_-_70px)] min-h-[calc(100vh_-_70px)] bg-black overflow-y-auto"
            ref={scrollRef}
            onScroll={() => loadNewMessage()}
          >
            <div className="flex w-full pb-[90px] my-[10px] justify-end gap-[20px] flex-col-reverse relative">
              {messages.map((message, index) => (
                <div className="w-full" key={index}>
                  <MessageBox
                    userId={message.userId}
                    userName={message.userName}
                    time={message.time}
                    text={message.text}
                    level={message.level}
                    userAvatar={message.userAvatar}
                  />
                </div>
              ))}
            </div>
            {isLoading && (
              <div
                className={cn(
                  'flex justify-center items-center w-full h-[calc(100vh_-_70px)] dark:bg-color-bg-primary/50 bg-color-light-bg-primary absolute top-[70px]',
                )}
              >
                <ReactLoading type="bubbles" color="#50C627" delay={50} />
              </div>
            )}
            <div className="flex py-[10px] w-full bg-color-bg-primary px-[7px] gap-[10px] absolute bottom-0">
              <div
                contentEditable={true}
                style={{ overflowWrap: 'anywhere', userSelect: 'none' }}
                onKeyDown={(e) => handleSubmit(e)}
                className={
                  'flex w-full max-h-[200px] py-[12px] leading-[20px] px-[10px] overflow-y-auto border-none outline-none lign-baseline editBox dark:bg-[#0A0A0A] rounded-default cursor-text text-[14px] dark:text-white'
                }
                ref={chatRef}
              />
              <div className="flex flex-col flex-1 justify-end">
                <div
                  className="flex flex-col h-fit justify-end p-[10px] rounded-default bg-gradient-btn-play cursor-pointer"
                  onClick={sendMessage}
                >
                  <PaperAirplaneIcon className="w-[25px] h-[25px] text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChattingComponent;
