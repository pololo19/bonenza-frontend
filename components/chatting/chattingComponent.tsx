import { RootState } from '@/base/types/root-state';
import cn from 'classnames';
import { ArrowDown2, CloseCircle, InfoCircle } from 'iconsax-react';
import sign from 'jwt-encode';
import { Fragment, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { CHANNELS } from '@/base/constants/common';
import {
  changeIsShowAuthenticationModal,
  changeShowChatType,
  changeShowFullChat,
} from '@/base/redux/reducers/modal.reducer';
import ModalChatRules from '@/components/modal/chatRules/chatRules';
import { Menu, Transition } from '@headlessui/react';
import { SendMessageOptions, StreamChat, User } from 'stream-chat';
import { Channel, Chat, MessageInput, MessageList, MessageToSend } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import LoadingChannelComponent from './loadingChannel';

const apiKey = 'kcs7q6knt2nf';
const apiSecret = 'jfkwgfttdtbk352bxa2nhk94t477vrj9n4kvtpdzr8wzdyd2ycnjsfhxnx9dtsfm';

const ChattingComponent = () => {
  const [isShowChatRules, setIsShowChatRules] = useState(false);
  const [chatClient, setChatClient] = useState<StreamChat | undefined>(undefined);
  const [user, setUser] = useState<User>({
    id: 'userId',
    name: 'userName',
    image: `https://getstream.io/random_png/?id=userId&name=userName`,
  });
  const [channel, setChannel] = useState<any>();
  const [activeChannel, setActiveChannel] = useState<any>(CHANNELS[1]);

  const dispatch = useDispatch();
  const { showChatType, showFullChat, userId, userName, avatar } = useSelector(
    (state: RootState) => ({
      showChatType: state.modal.showChatType,
      showFullChat: state.modal.showFullChat,
      userId: state.auth.userId,
      userName: state.auth.userName,
      avatar: state.auth.avatar,
    }),
    shallowEqual,
  );

  const { t } = useTranslation('');

  useEffect(() => {
    const chatUserId = userId ? String(userId) : 'userId';
    const chatUserName = userName ? String(userName) : 'userName';
    setUser({
      id: chatUserId,
      name: chatUserName,
      image: String(process.env.API_AVATAR) + avatar || 'https://bonenza.com/img/avatar-1.png',
    });
  }, [userId, userName, avatar]);

  useEffect(() => {
    if (user) {
      const client = new StreamChat(apiKey);
      let didUserConnectInterrupt = false;
      const token = sign({ user_id: String(user.id) }, apiSecret);
      const connectionPromise = client.connectUser(user, token).then(async () => {
        if (!didUserConnectInterrupt) {
          setChatClient(client);
        }
      });

      return () => {
        didUserConnectInterrupt = true;
        setChatClient(undefined);
        connectionPromise
          .then(() => client.disconnectUser())
          .then(() => {
            console.log('connection closed');
          });
      };
    }
  }, [user]);

  useEffect(() => {
    if (chatClient) {
      const channel = chatClient.channel('livestream', activeChannel.id, {
        name: activeChannel.name,
      });
      setChannel(channel);
      return () => {
        setChannel(undefined);
      };
    }
  }, [activeChannel, chatClient]);

  const overrideSubmitHandler = (
    message: MessageToSend,
    channelCid: any,
    customMessageData?: any,
    options?: SendMessageOptions,
  ) => {
    if (user.id === 'userId') {
      dispatch(changeIsShowAuthenticationModal(true));
    } else {
      return undefined;
    }
  };

  return (
    <>
      <div
        className={cn(
          'shadow-gray-700 shadow w-full bg-[#ffffff] dark:bg-[#1D1E22] flex flex-col gap-[5px] right-0 justify-between sm:pb-0 pb-2 h-screen',
          {
            flex: showChatType,
            hidden: !showChatType,
            'max-w-[360px]': !showFullChat,
          },
        )}
      >
        {chatClient && channel && (
          <Chat client={chatClient} theme="str-chat__theme-dark flex-1 w-full !h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center px-5 pt-4 py-2">
              <div className="text-[18px] text-black dark:text-[#ffffff] font-semibold">{t('chatting:chat')}</div>
              <div className="flex gap-[13px]">
                <button
                  className="bg-[#F6F7FA] dark:bg-[#0B0F13] text-black dark:text-[#ffffff] hover:bg-gray-400 hover:text-white dark:hover:bg-gray-800 rounded-[14px] p-[10px] flex items-center justify-center"
                  onClick={() => {
                    setIsShowChatRules(true);
                  }}
                >
                  <InfoCircle className="" width={20} height={20} />
                </button>
                <button
                  className="bg-[#F6F7FA] dark:bg-[#0B0F13] text-black dark:text-[#ffffff] hover:bg-gray-400 hover:text-white dark:hover:bg-gray-800 rounded-[14px] p-[10px] flex items-center justify-center"
                  onClick={() => {
                    dispatch(changeShowChatType(false));
                    dispatch(changeShowFullChat(false));
                  }}
                >
                  <CloseCircle className="" width={20} height={20} />
                </button>
              </div>
            </div>
            <Channel
              channel={channel}
              LoadingIndicator={LoadingChannelComponent}
            >
              <MessageList />
              {user.id === 'userId' && <MessageInput overrideSubmitHandler={overrideSubmitHandler} />}
              {user.id !== 'userId' && <MessageInput />}
            </Channel>
            <div className="px-2 py-2 flex gap-2 text-white">
              <div className="relative">
                <Menu>
                  <Menu.Button className="text-[12px] flex items-center gap-[4px] cursor-pointer min-w-[80px] bg-[#272a2f] px-2 hover:bg-gray-800">
                    <div className="flex-1 text-[#99a1ad]">{activeChannel.name}</div>
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
                    <Menu.Items className="absolute bg-[#12181f] w-full overflow-y-auto left-0 cursor-pointer rounded bottom-[35px] max-h-[135px]">
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
