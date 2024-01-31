import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ArrowLeft2 } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, Fragment, useCallback, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';
import LoginWallet from '@/components/loginWallet/loginWallet';

import CommonModal from '../commonModal/commonModal';
import ModalForgotPassword from '../forgotPassword/forgotPassword';
import SignInTab from './signInTab/signInTab';
import SignUpTab from './signUpTab/signUpTab';
import VerificationTab from './verificationTab/verificationTab';

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
    (state: AppState) => ({
      authenticationType: state.modal.authenticationType,
      email: state.auth.user.email,
    }),
    shallowEqual,
  );

  const returnForm = useCallback(() => {
    switch (authenticationType) {
      case AuthenticationModeEnum.SIGN_IN:
        return (
          <div>
            {forgotKey ? null : isLoginTwoFactor ? (
              <div className="flex gap-3 items-center text-color-light-text-primary dark:text-white font-bold text-[16px] ">
                <ArrowLeft2 className="cursor-pointer" onClick={() => setIsLoginTwoFactor(false)} size="16" />
                <div className="">{t('authentication:googleSecurity2FA')}</div>
              </div>
            ) : (
              <div className="font-bold text-[16px] text-color-light-text-primary dark:text-white">
                {t('authentication:welcomeBack')}
              </div>
            )}
            <SignInTab
              setForgotKey={setForgotKey}
              forgotKey={forgotKey}
              isLoginTwoFactor={isLoginTwoFactor}
              setIsLoginTwoFactor={setIsLoginTwoFactor}
              email={email}
            />
          </div>
        );

      case AuthenticationModeEnum.SIGN_UP:
        return (
          <div>
            <div className="font-bold text-[16px] text-color-light-text-primary dark:text-white">
              {t('authentication:signUp')}
            </div>
            <SignUpTab onClose={onClose} />
          </div>
        );
      case AuthenticationModeEnum.FORGOT_PASS:
        return (
          <>
            <ModalForgotPassword />
          </>
        );
      case AuthenticationModeEnum.VERIFY:
        return <VerificationTab />;
      default:
        break;
    }
  }, [authenticationType, forgotKey, isLoginTwoFactor, email]);

  return (
    <>
      <CommonModal show={show} onClose={onClose} isShowCloseButton={forgotKey ? false : true}>
        <div className="flex sm:flex-row flex-col overflow-y-auto dark:bg-color-modal-bg-primary bg-color-light-modal-bg-primary sm:max-h-[634px] h-[100vh]">
          <div className="sm:flex-1 relative">
            <Image
              width={401}
              height={600}
              src="/img/img-login.jpg"
              alt=""
              className="sm:w-[400px] w-full sm:h-full sm:max-h-[none] max-h-[175px] object-cover"
            />
            <div className="absolute inset-0 dark:bg-gradient-top-bottom bg-light-gradient-top-bottom" />
            <div className="absolute sm:bottom-[50px] bottom-[10px] text-center w-full">
              <p className="text-[18px] dark:text-white text-black font-bold">
                {t('homePage:welcomeTo')} <span className="text-color-primary font-bold">BONENZA</span>
              </p>
              <p className="text-[13px] dark:text-white text-black mt-[5px]">{t('homePage:startJourney')}</p>
            </div>
          </div>
          <div
            className={`sm:py-[20px] pt-[20px] pb-[75px] sm:px-[30px] px-[20px] mx-auto flex-1 sm:overflow-y-auto w-full flex flex-col ${
              forgotKey ? 'justify-center' : 'justify-between'
            }`}
          >
            {returnForm()}
            {!isLoginTwoFactor && authenticationType != AuthenticationModeEnum.VERIFY && (
              <LoginWallet onClose={onClose} />
            )}
          </div>
        </div>
      </CommonModal>
    </>
  );
}
