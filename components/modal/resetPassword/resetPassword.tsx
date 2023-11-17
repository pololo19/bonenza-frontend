import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { ElementType, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { changeIsShowResetPassword } from '@/base/redux/reducers/modal.reducer';
import Loader from '@/components/common/preloader/loader';
import InputPassAuthentication from '@/components/input/typing/InputPassAuthentication';
import CommonModal from '../commonModal/commonModal';

type ModalResetPasswordProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type ResetPasswordFormType = {
  password: string;
  confirmPassword: string;
};

export default function ModalResetPassword({ show, onClose }: ModalResetPasswordProps) {
  const { t } = useTranslation('');
  const { query } = useRouter();
  const dispatch = useDispatch();

  const [isExpiresToken, setIsExpiresToken] = useState(false);

  const resetToken = useMemo(() => {
    return query['forgot-pass-token'];
  }, [query]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    password: yup
      .string()
      .required(String(t('authentication:passwordRequired')))
      .trim(),
    confirmPassword: yup
      .string()
      .required(String(t('authentication:confirmPasswordRequired')))
      .oneOf([yup.ref('password')], String(t('authentication:confirmPasswordMatchNewPassword')))
      .trim(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordFormType>({
    resolver: yupResolver(schema),
  });

  const onReset = async (formReset: ResetPasswordFormType) => {
    try {
      setIsLoading(true);
      await api.post('/auth/reset-password', {
        token: resetToken,
        newPass: formReset.password,
        confirmPass: formReset.confirmPassword,
      });
      dispatch(changeIsShowResetPassword(false));
      toast.success(t('authentication:resetPasswordSuccessfully'), { containerId: TOAST_ENUM.COMMON });
    } catch (error) {
      toast.error(t('authentication:resetPasswordFailed'), { containerId: TOAST_ENUM.MODAL });
    } finally {
      setIsLoading(false);
    }
  };

  const checkExpiresToken = async () => {
    try {
      setIsLoading(true);
      await api.post('/auth/validate-token', {
        token: resetToken,
      });
      setIsExpiresToken(false);
    } catch (error) {
      setIsExpiresToken(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resetToken) {
      checkExpiresToken();
    }
  }, [resetToken]);

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:max-w-[464px]"
        header={
          <div className="relative sm:px-[30px] px-[20px] pt-[25px] pb-[10px] bg-[#161D26]">
            <div className="text-[16px] text-white font-[600]">{t('authentication:resetAccountPassword')}</div>
          </div>
        }
      >
        <>
          {isLoading && <Loader />}
          {!isExpiresToken && (
            <div className="flex flex-col items-center my-[50px] gap-[20px]">
              <div>
                <Image src={'/img/img-reset-password.png'} width={88} height={100} alt="" />
              </div>
              <div>
                <div className="text-[#99a4b099] text-[20px] text-center">
                  {t('authentication:resetAccountPassword')}
                </div>
                <div className="text-[#99a4b099] text-[14px] text-center">{t('authentication:rememberPassword')}</div>
              </div>
              <form onSubmit={handleSubmit(onReset)} data-testid="user-detail-form">
                <div className="sm:mt-5 mt-3 flex flex-col items-start sm:gap-[20px] gap-[10px]">
                  <InputPassAuthentication
                    control={control}
                    name="password"
                    placeholder={'New password'}
                    type="password"
                  />
                  <InputPassAuthentication
                    control={control}
                    name="confirmPassword"
                    placeholder={'New password again'}
                    type="password"
                  />
                </div>
                <button type="submit" className="bg-primary w-full rounded-[5px] text-center py-[10px] sm:mt-5 mt-3">
                  <div />
                  <div className="text-[14px] text-white">{t('authentication:confirm')}</div>
                </button>
              </form>
            </div>
          )}
          {isExpiresToken && (
            <div className="flex flex-col items-center my-[50px] gap-[20px]">
              <div>
                <Image src={'/img/img-reset-password.png'} width={88} height={100} alt="" />
              </div>
              <div>
                <div className="text-[#99a4b099] text-[20px] text-center">
                  {t('authentication:passwordResetLinkHasExpired')}
                </div>
                <div className="text-[#99a4b099] text-[14px] text-center">{t('authentication:pleaseSubmitAgain')}</div>
              </div>
            </div>
          )}
        </>
      </CommonModal>
    </>
  );
}
