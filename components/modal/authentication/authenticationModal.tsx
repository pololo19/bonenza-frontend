/* eslint-disable @next/next/no-img-element */
import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { ElementType, useState } from 'react';

import { useTranslation } from '@/base/config/i18next';

import { AuthenticationModeEnum } from '@/base/types/common';
import { RootState } from '@/base/types/root-state';
import LoginWallet from '@/components/loginWallet/loginWallet';
import { ArrowLeft2 } from 'iconsax-react';
import { shallowEqual, useSelector } from 'react-redux';
import CommonModal from '../commonModal/commonModal';
import ModalForgotPassword from '../forgotPassword/forgotPassword';
import SignInTab from './signInTab/signInTab';
import SignUpTab from './signUpTab/signUpTab';

type ModalAuthenticationProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalAuthentication({ show, onClose }: ModalAuthenticationProps) {
  const { t } = useTranslation('');
  const [isLoginTwoFactor, setIsLoginTwoFactor] = useState<boolean>(false);
  const [forgotKey, setForgotKey] = useState<boolean>(false);

  const { authenticationType, email } = useSelector(
    (state: RootState) => ({
      authenticationType: state.modal.authenticationType,
      email: state.auth.email,
    }),
    shallowEqual,
  );

  return (
    <>
      <CommonModal show={show} onClose={onClose} isShowCloseButton={forgotKey ? false : true}>
        <div className="flex sm:flex-row flex-col overflow-y-auto bg-[#161D26] rounded-[15px] sm:max-h-[634px] h-[100vh]">
          <div className="sm:flex-1 rounded-l-md relative">
            <Image
              width={401}
              height={600}
              src="/img/img-login.jpg"
              alt=""
              className="sm:rounded-l-[15px] sm:w-[400px] w-full sm:h-full sm:max-h-[none] max-h-[175px] object-cover"
            />
          </div>
          <div
            className={`sm:py-[20px] pt-[20px] pb-[75px] bg-[#f6f7fa] dark:bg-[#25262B] sm:px-[30px] px-[20px] mx-auto flex-1 sm:overflow-y-auto w-full flex flex-col ${
              forgotKey ? 'justify-center' : 'justify-between'
            }`}
          >
            {(authenticationType === AuthenticationModeEnum.SIGN_IN ||
              authenticationType === AuthenticationModeEnum.SIGN_UP) && (
              <div>
                {authenticationType === AuthenticationModeEnum.SIGN_IN &&
                  (forgotKey ? null : isLoginTwoFactor ? (
                    <div className="flex gap-3 items-center text-black dark:text-white font-bold text-[16px] ">
                      <ArrowLeft2 className="cursor-pointer" onClick={() => setIsLoginTwoFactor(false)} size="16" />
                      <div className="">{t('authentication:googleSecurity2FA')}</div>
                    </div>
                  ) : (
                    <div className="font-bold text-[16px] text-black dark:text-white">
                      {t('authentication:welcomeBack')}
                    </div>
                  ))}
                {authenticationType === AuthenticationModeEnum.SIGN_UP && (
                  <div className="font-bold text-[16px] text-black dark:text-white">{t('authentication:signUp')}</div>
                )}
                {authenticationType === AuthenticationModeEnum.SIGN_IN && (
                  <SignInTab
                    setForgotKey={setForgotKey}
                    forgotKey={forgotKey}
                    isLoginTwoFactor={isLoginTwoFactor}
                    setIsLoginTwoFactor={setIsLoginTwoFactor}
                    email={email}
                  />
                )}
                {authenticationType === AuthenticationModeEnum.SIGN_UP && <SignUpTab onClose={onClose} />}
              </div>
            )}
            {authenticationType === AuthenticationModeEnum.FORGOT_PASS && <ModalForgotPassword />}
            {!isLoginTwoFactor && <LoginWallet onClose={onClose} />}
          </div>
        </div>
      </CommonModal>
    </>
  );
}
