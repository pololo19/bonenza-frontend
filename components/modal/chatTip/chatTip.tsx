import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { ElementType, useState } from 'react';

import { useTranslation } from '@/base/config/i18next';

import CommonModal from '../commonModal/commonModal';
import { AppState } from '@/base/redux/store';
import { shallowEqual, useSelector } from 'react-redux';
import { API_AVATAR } from '@/base/constants/common';
import { CryptoNetWorkType, CurrencyType } from '@/base/types/wallet';
import SelectCurrency from '@/components/selectCurrency/selectCurrency';
import InputNumber from '@/components/input/typing/InputNumber';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

type ChatTipProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalChatTip({ show, onClose }: ChatTipProps) {
  const { t } = useTranslation('');
  const { tipReceiver } = useSelector(
    (state: AppState) => ({
      tipReceiver: state.modal.tipReceiver,
    }),
    shallowEqual,
  );
  const [activeCoin, setActiveCoin] = useState<CurrencyType>({
    id: '',
    name: '',
    alias: '',
    logo: '',
    iso_currency: '',
    availableNetworks: [],
    iso_decimals: 0,
    price: 0,
    type: 'crypto',
    favorite: false,
  });
  const [activeNetwork, setActiveNetwork] = useState<CryptoNetWorkType>({
    id: '',
    name: '',
    type: 1,
  });
  return (
    <CommonModal
      show={show}
      onClose={onClose}
      panelClass={`max-w-full sm:max-w-[420px] sm:max-h-[90vh] h-full sm:h-[700px]`}
    >
      <div className="bg-gradient-card-modal overflow-y-auto p-6 h-full">
        <div className="font-normal dark:text-white text-black text-[14px] sm:text-[16px] pb-4">Tip</div>
        <div className="flex flex-col">
          <div className="flex flex-col items-center gap-4">
            {tipReceiver?.userName ? (
              <Image
                className="w-[80px] h-[80px] rounded-full"
                width={80}
                height={80}
                src={tipReceiver.userAvatar ? `${API_AVATAR}${tipReceiver.userAvatar}` : '/img/avatar-1.png'}
                alt=""
                onError={(e) => {
                  e.currentTarget.src = '/img/avatar-1.png';
                }}
              />
            ) : (
              <Image
                className="w-[80px] h-[80px] rounded-full grayscale brightness-50"
                width={80}
                height={80}
                src="/img/avatar-hidden.png"
                alt=""
              />
            )}
            <span className="font-bold">{tipReceiver.userName || ''}</span>
          </div>
          <div>
            <SelectCurrency
              activeCoin={activeCoin}
              activeNetwork={activeNetwork}
              onChangeCoin={setActiveCoin}
              onChangeNetwork={setActiveNetwork}
              withDrawTab={true}
              isShowNetwork={false}
            />
            <div className="mt-[20px] text-left">
              <div className="flex justify-between">
                <div className="text-default dark:text-color-text-primary text-color-light-text-primary mb-[10px] text-left">
                  {t('withdraw:withdrawAmount')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}
