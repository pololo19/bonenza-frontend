import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Add, ArrowRotateLeft, ArrowRotateRight, Camera, Minus } from 'iconsax-react';
import NextImage from 'next/image';
import { ElementType, useCallback, useMemo, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_uploadAvatar } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { convertUserInfo } from '@/base/libs/utils';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import {
  changeIsShowInformation,
  changeIsShowUpdateAvatar,
  changeIsShowUpdateInformation,
} from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';

import CommonModal from '../commonModal/commonModal';
import getCroppedImg from '../cropAvatar/cropImage';

type ModalUpdateAvatarProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalUpdateAvatar({ show, onClose }: ModalUpdateAvatarProps) {
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [avatarFile, setAvatarFile] = useState<File>();
  const [selectedAvatar, setSelectedAvatar] = useState<string>();
  const [isErrorAvatar, setIsErrorAvatar] = useState(false);

  const { avatar } = useSelector(
    (state: AppState) => ({
      avatar: state.auth.user.avatar,
    }),
    shallowEqual,
  );

  const handleZoomIn = () => {
    if (zoom < 10) {
      setZoom(zoom + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 1) {
      const zoomValue = zoom - 0.1 < 0 ? 1 : zoom - 0.1;
      setZoom(zoomValue);
    }
  };

  const handleRotationLeft = () => {
    setRotation(rotation + 45);
  };

  const handleRotationRight = () => {
    setRotation(rotation - 45);
  };

  const goBackUpdateProfile = () => {
    dispatch(changeIsShowUpdateInformation(true));
    dispatch(changeIsShowUpdateAvatar(false));
  };

  const onCropComplete = useCallback(
    async (croppedArea: Area, croppedAreaPixels: Area) => {
      const croppedImage = await getCroppedImg(selectedAvatar, croppedAreaPixels, 0);
      const myFile = new File([croppedImage], croppedImage.name, {
        type: croppedImage.type,
      });
      setAvatarFile(myFile);
    },
    [selectedAvatar],
  );

  const avatarCropper = useMemo(() => {
    if (selectedAvatar) {
      return selectedAvatar;
    }
    if (!isErrorAvatar) {
      return String(process.env.API_AVATAR) + avatar;
    } else return 'img/avatar-1.png';
  }, [isErrorAvatar, avatar, selectedAvatar]);

  const handleUpdateProfile = async () => {
    try {
      if (avatarFile) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', avatarFile);
        const res = await api_uploadAvatar(formData);
        dispatch(saveUserInfo({ ...convertUserInfo(res.data) }));
        dispatch(changeIsShowInformation(true));
        dispatch(changeIsShowUpdateAvatar(false));
      }
    } catch (error) {
      toast.error('Update username failed', { containerId: TOAST_ENUM.MODAL });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded !max-w-[464px]"
        header={
          <div className="relative p-[20px] pb-0 bg-[#f5f6fa] dark:bg-[#161D26]">
            <div className="flex items-center dark:text-white text-black gap-[10px]">
              <ChevronLeftIcon width={20} role="button" onClick={() => goBackUpdateProfile()} />
              <div className="text-[18px] font-[600]">{t('profile:updateAvatar')}</div>
            </div>
          </div>
        }
      >
        <div className="flex-1 p-[20px] bg-[#f5f6fa] dark:bg-[#161D26] flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[20px]">
            <div className="relative h-[300px] w-auto">
              <Cropper
                image={avatarCropper}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                objectFit="vertical-cover"
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                classes={{
                  mediaClassName: 'cropped-image dark:bg-transparent bg-red',
                  containerClassName: 'crop-container h-full w-fit m-auto rounded-[5px]',
                  cropAreaClassName: 'w-full h-full',
                }}
                rotation={rotation}
                onRotationChange={setRotation}
              />
              <label htmlFor="avatar" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Camera role="button" size={30} />
              </label>
              <input
                className="hidden"
                name="avatar"
                id="avatar"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  if (event.target.files?.[0]) {
                    setSelectedAvatar(URL.createObjectURL(event.target.files?.[0]));
                  }
                }}
              ></input>
            </div>
            <div className="flex dark:bg-gray-800 bg-black/20 rounded gap-[10px]">
              <button
                type="button"
                className={
                  'dark:hover:bg-gray-600 hover:bg-gray-300/50 dark:text-gray-400 hover:text-white items-center justify-center gap-[7px] p-[10px]'
                }
                onClick={handleZoomOut}
              >
                <Minus width={18} height={18} />
              </button>
              <div className="relative flex-1 flex items-center">
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
                  className="w-full h-1 rounded-lg appearance-none cursor-pointer bg-gray-500 accent-amber-600 m-auto"
                ></input>
              </div>
              <button
                type="button"
                className={
                  'dark:hover:bg-gray-600 hover:bg-gray-300/50 dark:text-gray-400 hover:text-white items-center justify-center gap-[7px] p-[10px]'
                }
                onClick={handleZoomIn}
              >
                <Add width={18} height={18} />
              </button>
              <button
                type="button"
                className={
                  'dark:hover:bg-gray-600 hover:bg-gray-300/50 dark:text-gray-400 hover:text-white items-center justify-center gap-[7px] p-[10px]'
                }
                onClick={handleRotationLeft}
              >
                <ArrowRotateLeft width={18} height={18} />
              </button>
              <button
                type="button"
                className={
                  'dark:hover:bg-gray-600 hover:bg-gray-300/50 dark:text-gray-400 hover:text-white items-center justify-center gap-[7px] p-[10px]'
                }
                onClick={handleRotationRight}
              >
                <ArrowRotateRight width={18} height={18} />
              </button>
            </div>
          </div>
          <div>
            <div className="dark:text-gray-500 text-gray-700 mb-[10px] text-[14px]">
              {t('updateAvatar:defaultAvatar')}
            </div>
            <div className="flex gap-[10px] items-center justify-center">
              <NextImage
                role="button"
                src={'img/avatar-1.png'}
                alt="avatar"
                height={50}
                width={50}
                onClick={() => {
                  setSelectedAvatar('img/avatar-1.png');
                }}
              />
              <NextImage
                role="button"
                src={'img/avatar-2.png'}
                alt="avatar"
                height={50}
                width={50}
                onClick={() => {
                  setSelectedAvatar('img/avatar-2.png');
                }}
              />
              <NextImage
                role="button"
                src={'img/avatar-3.png'}
                alt="avatar"
                height={50}
                width={50}
                onClick={() => {
                  setSelectedAvatar('img/avatar-3.png');
                }}
              />
              <NextImage
                role="button"
                src={'img/avatar-4.png'}
                alt="avatar"
                height={50}
                width={50}
                onClick={() => {
                  setSelectedAvatar('img/avatar-4.png');
                }}
              />
              <NextImage
                role="button"
                src={'img/avatar-5.png'}
                alt="avatar"
                height={50}
                width={50}
                onClick={() => {
                  setSelectedAvatar('img/avatar-5.png');
                }}
              />
              <label
                htmlFor="avatar"
                role="button"
                className="w-[49px] h-[49px] rounded-full border border-solid border-amber-600 flex items-center justify-center"
              >
                <Add />
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary w-full rounded-large flex justify-between items-center py-[10px] pl-[40px] pr-[17px] sm:mt-2 mt-1"
            onClick={() => handleUpdateProfile()}
          >
            <div />
            <div className="text-[14px] dark:text-white text-black">{t('profile:modify')}</div>
            <div className="px-[10px] py-[5px] flex items-center justify-center rounded-large bg-white/20">
              <NextImage height={14} width={14} src="/img/icon/arrow-right.png" alt="" />
            </div>
          </button>
          {!isErrorAvatar && (
            <NextImage
              role="button"
              src={String(process.env.API_AVATAR) + avatar}
              alt="avatar"
              height={50}
              width={50}
              className="hidden"
              onError={(e) => {
                setIsErrorAvatar(true);
              }}
            />
          )}
        </div>
      </CommonModal>
    </>
  );
}
