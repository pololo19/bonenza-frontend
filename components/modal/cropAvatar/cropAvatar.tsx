import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { ElementType, useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_uploadAvatar } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { convertUserInfo } from '@/base/libs/utils';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import {
  changeIsShowCropAvatar,
  changeIsShowInformation,
  changeIsShowUpdateInformation,
} from '@/base/redux/reducers/modal.reducer';
import { setLocalFiat } from '@/base/redux/reducers/wallet.reducer';
import { AppState } from '@/base/redux/store';
import { CurrencyType } from '@/base/types/wallet';
import Loader from '@/components/common/preloader/loader';

import CommonModal from '../commonModal/commonModal';
import getCroppedImg from './cropImage';

type ModalCropAvatarProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalCropAvatar({ show, onClose }: ModalCropAvatarProps) {
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { selectedAvatar } = useSelector(
    (state: AppState) => ({
      selectedAvatar: state.modal.selectedAvatar,
    }),
    shallowEqual,
  );

  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [avatarFile, setAvatarFile] = useState<File>();

  const handleUpdateProfile = async () => {
    try {
      if (avatarFile) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', avatarFile);
        const resUser = await api_uploadAvatar(formData);
        const localFiat: CurrencyType = {
          id: resUser.data.settingFiatCurrency.id ?? '',
          name: resUser.data.settingFiatCurrency.symbol ?? '',
          alias: resUser.data.settingFiatCurrency.name ?? '',
          logo: `/img/fiats/${resUser.data.settingFiatCurrency.symbol}.png`,
          iso_currency: resUser.data.settingFiatCurrency.iso_currency,
          iso_decimals: resUser.data.settingFiatCurrency.iso_decimals,
          availableNetworks: [],
          price: Number(resUser.data.settingFiatCurrency.price),
          type: 'fiat',
          favorite: resUser.data.settingFiatCurrency.favorite,
        };
        dispatch(
          saveUserInfo({
            ...convertUserInfo(resUser.data),
          }),
        );
        dispatch(setLocalFiat(localFiat));
        dispatch(changeIsShowInformation(true));
        dispatch(changeIsShowCropAvatar(false));
      }
    } catch (error) {
      toast.error('Update username failed', { containerId: TOAST_ENUM.MODAL });
    } finally {
      setIsLoading(false);
    }
  };

  const goBackUpdateProfile = () => {
    dispatch(changeIsShowUpdateInformation(true));
    dispatch(changeIsShowCropAvatar(false));
  };

  const onCropComplete = useCallback(async (croppedArea: Area, croppedAreaPixels: Area) => {
    const croppedImage = await getCroppedImg(selectedAvatar, croppedAreaPixels, 0);
    const myFile = new File([croppedImage], croppedImage.name, {
      type: croppedImage.type,
    });
    setAvatarFile(myFile);
  }, []);

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded"
        header={
          <div className="relative p-[20px] pb-0 bg-[#161D26]">
            <div className="flex items-center text-white gap-[10px]">
              <ChevronLeftIcon width={20} role="button" onClick={() => goBackUpdateProfile()} />
              <div className="text-[18px] font-[600]">{t('profile:updateAvatar')}</div>
            </div>
          </div>
        }
      >
        <div className="flex-1 p-[20px] bg-[#161D26]">
          {isLoading && <Loader />}
          <div className="relative h-[300px] w-auto">
            <Cropper
              image={selectedAvatar}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              objectFit="vertical-cover"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              classes={{
                mediaClassName: 'cropped-image',
                containerClassName: 'crop-container h-full w-fit m-auto rounded-[5px]',
                cropAreaClassName: 'w-full h-full',
              }}
            />
          </div>
          <div className="flex flex-col m-auto items-center gap-[10px] sm:max-w-[500px] w-full">
            <div className="relative w-[50%] mx-auto mt-[20px]">
              <input
                id="medium-range"
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => {
                  setZoom(Number(e.target.value));
                }}
                className="w-full h-2 mb-6 rounded-lg appearance-none cursor-pointer bg-gray-500 accent-amber-600"
              ></input>
            </div>
            <button
              type="submit"
              className="bg-color-primary w-full rounded-large flex justify-between items-center py-[10px] pl-[40px] pr-[17px] sm:mt-5 mt-3"
              onClick={() => handleUpdateProfile()}
            >
              <div />
              <div className="text-[14px] text-white">{t('profile:modify')}</div>
              <div className="p-[10px] flex items-center justify-center rounded-large bg-white/20">
                <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="" />
              </div>
            </button>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
