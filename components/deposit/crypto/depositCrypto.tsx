import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useQRCode } from 'next-qrcode';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

import { useTranslation } from '@/base/config/i18next';
import { CRYPTO_DATA, TOAST_ENUM } from '@/base/constants/common';
import { DepositAddress } from '@/base/types/common';

import { currencyFormat, exchangeByLocaleFiat } from '@/base/libs/utils';
import { DepositAddressComponent } from '@/components/depositAddress/depositAddress';
import ModalDepositMetamask from '@/components/modal/depositMetamask/depositMetamask';
import SelectCurrency from '@/components/selectCurrency/selectCurrency';
import { Tooltip } from 'react-tooltip';
import { InfoCircle } from 'iconsax-react';
import api from '@/api/api';

const DepositCryptoComponent = () => {
  const [activeCoin, setActiveCoin] = useState<DepositAddress>(CRYPTO_DATA[0]);
  const [openDepositMetamask, setOpenDepositMetamask] = useState<boolean>(false);
  const [depositBonus, setDepositBonus] = useState<any>();

  const { Canvas } = useQRCode();
  const { t } = useTranslation('');

  const copy = (text: string) => {
    toast.success('Copied', { containerId: TOAST_ENUM.COMMON });
    navigator.clipboard.writeText(text);
  };

  const getExtra = (countDeposit: number) => {
    let valueDeposit = 0;
    switch (countDeposit) {
      case 1:
        valueDeposit = 20000;
        break;
      case 2:
        valueDeposit = 40000;
        break;
      case 3:
        valueDeposit = 60000;
        break;
      default:
        valueDeposit = 100000;
        break;
    }
    return currencyFormat(exchangeByLocaleFiat('USDT', activeCoin.symbol, valueDeposit), 4);
  };

  const getTime = (time: number) => {
    let rankReturn = '';
    if (time > 3) {
      rankReturn = time + 'th+';
    } else {
      switch (time) {
        case 1:
          rankReturn = '1st';
          break;
        case 2:
          rankReturn = '2nd';
          break;
        default:
          rankReturn = '3rd';
          break;
      }
    }
    return rankReturn;
  };

  const getDepositBonusDetail = async () => {
    try {
      const res = await api.get('deposit/get-deposit-bonus', {
        params: {
          currency: activeCoin?.symbol,
        },
      });
      setDepositBonus(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    getDepositBonusDetail();
  }, [activeCoin]);

  return (
    <>
      <div className="md:max-w-[492px]">
        <div>
          <SelectCurrency onChangeCoin={setActiveCoin} />
        </div>

        <div className="flex flex-col items-start w-full gap-2 mt-[20px]">
          <div className="flex items-center gap-[5px]">
            <div
              className="text-start text-[14px] dark:text-[#C2C2C2] text-[#31373d]"
              dangerouslySetInnerHTML={{
                __html: t('deposit:getExtra', {
                  percent: `${depositBonus?.percentageBonus}%`,
                  value: `${currencyFormat(depositBonus?.minDepositBonus, 4)} ${activeCoin?.symbol}`,
                }),
              }}
            ></div>
            <InfoCircle
              width={17}
              height={17}
              className="text-amber-500 w-[18px] h-[18px]"
              role="button"
              data-tooltip-id={'deposit-tooltip'}
            />
            <Tooltip id={'deposit-tooltip'} place="bottom">
              <div>
                <p className="text-white">
                  {getTime(depositBonus?.depositTimes)}&nbsp;{t('deposit:depositBonus')}
                </p>
                <p className="text-[#98a7b5]">{`${depositBonus?.percentageBonus}% ${t('deposit:upTo')} ${getExtra(
                  depositBonus?.depositTimes,
                )} ${activeCoin?.symbol}`}</p>
                <p className="text-[#98a7b5]">
                  {t('deposit:minimumDeposit')}{' '}
                  {`${currencyFormat(depositBonus?.minDepositBonus, 4)} ${activeCoin?.symbol}`}
                </p>
              </div>
            </Tooltip>
          </div>
          {activeCoin?.depositAddress && (
            <div className="w-full flex sm:flex-row flex-col items-center dark:text-white text-[#31373d] rounded-[16px] gap-[20px] py-[13px] px-[20px] dark:bg-[#161D26]/50 bg-[#f5f6fa]">
              <div className="rounded-[16px]">
                <Canvas
                  text={String(activeCoin.depositAddress)}
                  options={{
                    margin: 3,
                    scale: 4,
                    width: 120,
                    color: {
                      dark: '#000',
                      light: '#FFF',
                    },
                  }}
                />
              </div>
              <div className="flex flex-col gap-[10px] items-start">
                <>
                  <div className="text-[12px] dark:text-[#C2C2C2] text-[#31373d]">{t('deposit:depositAddress')}</div>
                  <div className="flex-1 flex items-center justify-between gap-[20px]">
                    <DepositAddressComponent className="text-[14px] text-start" address={activeCoin?.depositAddress} />
                    <div
                      className="bg-primary hover:opacity-[0.9] rounded-[5px] cursor-pointer flex items-center gap-[5px] p-2 text-[12px] text-white"
                      onClick={() => copy(String(activeCoin?.depositAddress))}
                    >
                      <DocumentDuplicateIcon width={18} height={18} />
                      {t('deposit:copy')}
                    </div>
                  </div>
                </>
                {activeCoin?.symbol === 'BNB' && (
                  <>
                    <div className="text-[12px] dark:text-[#C2C2C2] text-[#31373d]">{t('deposit:orSupport')}</div>
                    <div
                      className="flex items-center gap-[10px]"
                      role="button"
                      onClick={() => setOpenDepositMetamask(true)}
                    >
                      <Image src="/img/icon/MetaMask.png" alt="" width={30} height={30} />
                      <div className="text-[12px] dark:text-[#C2C2C2] text-[#31373d]">Metamask</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="mt-[20px] w-full px-[20px] py-[10px] dark:text-[#0DFDE4] text-[#31373d] dark:bg-[#161D26] bg-[#f5f6fa] rounded-[16px] text-start">
          <h1 className="text-[14px]">
            <span className="text-[#0EC505] me-1 inline text-[16px]">{t('deposit:notice')}</span>{' '}
            {t('deposit:doNotDeposit', { crypto: String(activeCoin?.symbol) })}
          </h1>
        </div>
      </div>
      <ModalDepositMetamask
        show={openDepositMetamask}
        onClose={() => setOpenDepositMetamask(false)}
        walletAddress={String(activeCoin?.depositAddress)}
      />
    </>
  );
};

export default DepositCryptoComponent;
