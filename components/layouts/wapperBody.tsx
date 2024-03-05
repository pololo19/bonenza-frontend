import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { AppState } from '@/base/redux/store';

type WrapperBodyProps = {
  id?: string;
  children: JSX.Element;
  wrapperClassName?: string;
  contentClassName?: string;
};

const WrapperBody: React.FC<WrapperBodyProps> = ({ children, wrapperClassName, contentClassName, id }) => {
  const { showChatType, isToggleSidebar } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
      isShowInformation: state.modal.isShowInformation,
      isShowUpdateInformation: state.modal.isShowUpdateInformation,
      isShowCropAvatar: state.modal.isShowCropAvatar,
      isShowMultiLanguage: state.modal.isShowMultiLanguage,
      isShowAuthenticationModal: state.modal.isShowAuthenticationModal,
      isShowForgotPassModal: state.modal.isShowForgotPassModal,
      showChatType: state.modal.showChatType,
      isToggleSidebar: state.modal.isToggleSidebar,
      showFullChat: state.modal.showFullChat,
      isShowDepositModal: state.modal.isShowDepositModal,
    }),
    shallowEqual,
  );

  return (
    <>
      <div
        id={id ? id : ''}
        className={classNames(
          'm-auto max-w-full w-full max-[640px]:ml-0 max-[640px]:max-w-full ',
          {
            'min-[1936px]:max-w-[1430px]': showChatType && !isToggleSidebar,
            'max-[1280px]:max-w-[calc(100%-62px)] max-[1280px]:m-[unset] max-[1279px]:ml-[62px] max-[768px]:ml-[62px]':
              isToggleSidebar,
            '2xl:max-w-full xl:max-w-full': showChatType,
            'min-[1786px]:max-w-[1430px] 2xl:max-w-full': !showChatType && isToggleSidebar,
            'max-[1598px]:max-w-[1430px] md:max-w-full': !showChatType && !isToggleSidebar,
          },
          wrapperClassName,
        )}
      >
        <div
          className={classNames(
            'flex max-w-[1430px] md:w-full xl:px-0 min-[1280px]:px-[40px] sm:w-[80%] m-auto  md:px-[40px] sm:px-0 px-[12px]',
            contentClassName,
          )}
        >
          <div className={classNames('flex-1 w-full text-white')}>{children}</div>
        </div>
      </div>
    </>
  );
};

export default WrapperBody;
