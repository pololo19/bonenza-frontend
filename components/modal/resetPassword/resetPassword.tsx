import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ElementType, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { api_resetPassword } from '@/api/auth';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { convertUserInfo } from '@/base/libs/utils';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { changeIsShowResetPassword } from '@/base/redux/reducers/modal.reducer';
import { getWalletInfo } from '@/base/redux/reducers/wallet.reducer';
import { useAppDispatch } from '@/base/redux/store';
import { ResetPasswordRequest } from '@/base/types/requestTypes';
import Loader from '@/components/common/preloader/loader';
import { InputPassAuthentication } from '@/components/input/typing';

import CommonModal from '../commonModal/commonModal';

type ModalResetPasswordProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalResetPassword({ show, onClose }: ModalResetPasswordProps) {
  const { t } = useTranslation('');
  const { query } = useRouter();
  const dispatch = useAppDispatch();

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
  } = useForm<ResetPasswordRequest>({
    resolver: yupResolver(schema),
  });

  const onReset = async (formReset: ResetPasswordRequest) => {
    try {
      setIsLoading(true);

      const res = await api_resetPassword(formReset);

      dispatch(
        saveUserInfo({
          ...convertUserInfo(res.data),
        }),
      );

      dispatch(getWalletInfo());

      dispatch(changeIsShowResetPassword(false));
      toast.success(t('authentication:resetPasswordSuccessfully'), { containerId: TOAST_ENUM.COMMON });
    } catch (error) {
      toast.error(t('authentication:resetPasswordFailed'), { containerId: TOAST_ENUM.MODAL });
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="flex flex-col items-center my-[50px] gap-[20px]">
            <div>
              <Image src={'/img/img-reset-password.png'} width={88} height={100} alt="" />
            </div>
            <div>
              <div className="text-[#99a4b099] text-[20px] text-center">{t('authentication:resetAccountPassword')}</div>
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
        </>
      </CommonModal>
    </>
  );
}
