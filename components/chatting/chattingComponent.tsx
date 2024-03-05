import 'stream-chat-react/dist/css/v2/index.css';

import { Menu, Transition } from '@headlessui/react';
import cn from 'classnames';
import { ArrowDown2, CloseCircle, InfoCircle } from 'iconsax-react';
import sign from 'jwt-encode';
import { useTheme } from 'next-themes';
import { Fragment, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { SendMessageOptions, StreamChat, User } from 'stream-chat';
import { Channel, Chat, MessageInput, MessageList, MessageToSend } from 'stream-chat-react';

import { useTranslation } from '@/base/config/i18next';
import { API_AVATAR, CHANNELS, DEFAULT_AVATAR, STREAM_API_KEY, STREAM_API_SECRET } from '@/base/constants/common';
import {
  changeIsShowAuthenticationModal,
  changeShowChatType,
  changeShowFullChat,
} from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import ModalChatRules from '@/components/modal/chatRules/chatRules';

import LoadingChannelComponent from './loadingChannel';

const ChattingComponent = () => {
  const { theme } = useTheme();
  const [isShowChatRules, setIsShowChatRules] = useState(false);
  const [chatClient, setChatClient] = useState<StreamChat | undefined>(undefined);
  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    image: ``,
  });
  const [channel, setChannel] = useState<any>();
  const [activeChannel, setActiveChannel] = useState<any>(CHANNELS[1]);

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

  useEffect(() => {
    const setStreamChat = async ({ id, name, image }: User) => {
      const client = new StreamChat(STREAM_API_KEY || '');
      let didUserConnectInterrupt = false;

      const token = sign({ user_id: String(id) }, STREAM_API_SECRET || '');
      const connection = await client.connectUser({ id, name, image }, token);
      const channel = client.channel('livestream', activeChannel.id, { name: activeChannel.name });

      setUser({ id, name, image });
      setChatClient(client);
      setChannel(channel);
    };
    if (isLogin) {
      const chatUserId = userInfo.userId ? String(userInfo.userId) : '';
      const chatUserName = userInfo.userName ? String(userInfo.userName) : '';
      const image = userInfo.avatar ? `${API_AVATAR}${userInfo.avatar}` : DEFAULT_AVATAR;

      setStreamChat({ id: chatUserId, name: chatUserName, image });
    }
  }, [userInfo]);

  const overrideSubmitHandler = (
    message: MessageToSend,
    channelCid: any,
    customMessageData?: any,
    options?: SendMessageOptions,
  ) => {
    if (!user.id) {
      dispatch(changeIsShowAuthenticationModal(true));
    } else {
      return undefined;
    }
  };

  return (
    <>
      <div
        className={cn(
          'shadow-gray-700 shadow w-full bg-white dark:bg-color-bg-primary flex flex-col right-0 justify-between sm:pb-0 pb-2 h-screen',
          {
            flex: showChatType,
            hidden: !showChatType,
            'max-w-[360px]': !showFullChat,
          },
        )}
      >
        {chatClient && channel && (
          <Chat
            client={chatClient}
            theme={cn(' flex-1 w-full !h-[calc(100vh-120px)]', {
              'str-chat__theme-dark': theme === 'dark',
              'str-chat__theme-light': theme === 'light',
            })}
          >
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
            <Channel channel={channel} LoadingIndicator={LoadingChannelComponent}>
              <MessageList />
              <div className="relative border-t-[1px] border-solid dark:border-color-border-primary border-color-light-border-primary">
                {!user.id && <MessageInput overrideSubmitHandler={overrideSubmitHandler} />}
                {user.id && <MessageInput />}
              </div>
            </Channel>
            <div className="px-2 py-2 flex gap-2 text-white">
              <div className="relative">
                <Menu>
                  <Menu.Button className="text-[12px] flex items-center gap-[4px] cursor-pointer min-w-[80px] dark:bg-color-select-bg-primary bg-color-light-bg-primary px-2 ">
                    <div className="flex-1 text-color-light-text-primary dark:text-color-text-primary">
                      {activeChannel.name}
                    </div>
                    <ArrowDown2 className="w-[11px]" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute dark:bg-color-select-bg-primary bg-color-light-bg-primary w-full overflow-y-auto left-0 cursor-pointer rounded bottom-[35px] max-h-[135px]">
                      {CHANNELS.map((channel, index) => {
                        return (
                          <Menu.Item as={Fragment} key={index}>
                            {({ active }) => (
                              <button
                                className={cn('flex p-2 text-[12px] text-gray-400 rounded truncate w-full', {
                                  'bg-gray-800 text-white': active,
                                })}
                                onClick={() => {
                                  setActiveChannel(channel);
                                }}
                              >
                                {channel.name}
                              </button>
                            )}
                          </Menu.Item>
                        );
                      })}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </Chat>
        )}
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
