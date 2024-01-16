import { AxiosError } from 'axios';
import { compareAsc, differenceInSeconds, format } from 'date-fns';
import { camelize } from 'humps';
import { getParamByParam } from 'iso-country-currency';
import { identity, pickBy } from 'lodash';
import Router from 'next/router';
import qs from 'qs';
import { Path, UseFormGetValues } from 'react-hook-form';
import { toast } from 'react-toastify';

import { CookieKey, DATE_TIME_FORMAT_DEFAULT, ERROR_CODE_INVALID_ACCOUNT } from '@/base/constants/common';
import { DATE_DASH_DELIMITER_REGEX, DATE_VALID_DELIMITER } from '@/base/constants/validation';
import { ErrorResponse } from '@/base/types/api';
import { DepositAddress, NetworkType, ObjectLiteral } from '@/base/types/common';
import { TransactionStatus } from '@/types/common';

import { CookiesStorage } from '../storage/cookie';
import { isIsoFormat, isValidDate } from './validate';

export * from './copyClipboard';
export * from './pageTitle';
export * from './validate';

export const stringifyParams = (data: any) => {
  const { params, option } = data;
  const newParams = pickBy(params, identity);
  return qs.stringify(newParams, {
    encode: false,
    skipNulls: true,
    strictNullHandling: true,
    ...option,
  });
};

export function getCurrentDomain() {
  const parts = window.location.hostname.split('.');
  parts.shift();
  return parts.join('.');
}

export function getUrlRoot(pathname?: string) {
  return pathname ? pathname.split('/')[1] : '';
}

export function createDate(date: Date | number | string) {
  if (typeof date === 'string' && isIsoFormat(date)) {
    return new Date(date);
  }
  return new Date(typeof date === 'string' ? date.replace(DATE_DASH_DELIMITER_REGEX, DATE_VALID_DELIMITER) : date);
}

export function formatDate(date: Date | number | string | undefined, dateFormat = DATE_TIME_FORMAT_DEFAULT) {
  if (!date || !isValidDate(date)) return '';
  const newDate: Date = createDate(date);
  return format(newDate, dateFormat).toString();
}

export function differenceDateInSeconds(
  date1: Date | number | string | undefined,
  date2: Date | number | string | undefined,
) {
  if (!date1 || !isValidDate(date1)) return '';
  if (!date2 || !isValidDate(date2)) return '';
  const newDate1 = createDate(date1);
  const newDate2 = createDate(date2);
  return differenceInSeconds(newDate1, newDate2);
}

export function compareDateAsc(date1: Date | number | string | undefined, date2: Date | number | string | undefined) {
  if (!date1 || !isValidDate(date1)) return '';
  if (!date2 || !isValidDate(date2)) return '';
  const newDate1 = createDate(date1);
  const newDate2 = createDate(date2);
  return compareAsc(newDate1, newDate2);
}

export function titleCase(text: string) {
  var splitStr = text.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

export function getErrors(error?: AxiosError<ErrorResponse>) {
  const fieldErrors: { error_code?: string; field?: Path<unknown>; message?: string }[] =
    error?.response?.data?.error?.errors?.map((item) => ({
      ...item,
      field: camelize(item?.field),
    })) || [];

  return {
    error: error?.response?.data.error || {},
    fieldErrors,
    firstFieldErrors: fieldErrors?.[0] || {},
  };
}

export function checkFormHasField(getValues: UseFormGetValues<ObjectLiteral>, field: Path<ObjectLiteral>) {
  return Object.keys(getValues())?.includes(field);
}

export function pushQueryParams(params: ObjectLiteral, options?: { scroll?: boolean }) {
  const query = pickBy(params, identity);
  Router.push({ pathname: Router.route, query }, undefined, options);
}

export function isErrorAccountInvalid(errorCode: string) {
  return ERROR_CODE_INVALID_ACCOUNT.includes(errorCode);
}

export function showToastError(message: string, error?: unknown) {
  const errorCode = (error as AxiosError<ErrorResponse>)?.response?.data?.error?.error_code;
  if (!errorCode || !isErrorAccountInvalid(errorCode)) {
    toast.error(message);
  }
}

export function convertTimeZone(date: string | Date) {
  return createDate(date).toLocaleString('ja-JP', { timeZone: process.env.TIME_ZONE });
}

export function byteToGigabyte(input: number, numFixed?: number) {
  const result = input / 1024 / 1024 / 1024;
  return numFixed || numFixed === 0 ? result.toFixed(numFixed) : result;
}

export function getMessageMetamask(account: string) {
  let message = `Welcome to Bonenza.com!
        This request will not trigger a blockchain transaction or cost any gas fees.
        Your authentication status will reset after 24 hours.
        Wallet address:${account}`;
  return message;
}

export const truncateAddress = (address: string, dots = 3) => {
  if (!address) return 'No Account';
  const match = address.match(/^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{8})$/);
  if (!match) return address;
  return `${match[1]}${' .'.repeat(dots)} ${match[2]}`;
};

export const truncateAddressHeader = (address: string, dots = 3) => {
  if (!address) return 'No Account';
  const match = address.match(/^(0x[a-zA-Z0-9]{5})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/);
  if (!match) return address;
  return `${match[1]}${' .'.repeat(dots)} ${match[2]}`;
};

export const transformWalletAddress = (address: string, dots = 3) => {
  if (!address) return 'No Account';
  const match = address.match(/^([a-zA-Z0-9]{7})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/);
  if (!match) return address;
  return `${match[1]}${' .'.repeat(dots)} ${match[2]}`;
};

export const getListNetwork = (coin: DepositAddress) => {
  switch (coin.symbol) {
    case 'USDT':
      return [
        {
          symbol: 'BEP20',
          image: '/img/icon/BNB-logo.svg',
        },
        {
          symbol: 'ERC20',
          image: '/img/icon/ETH-logo.svg',
        },
      ] as NetworkType[];
    case 'BNB':
      return [
        {
          symbol: 'Binance Coin(BEP20)',
          image: '/img/icon/BNB-logo.svg',
        },
      ] as NetworkType[];
    case 'ETH':
      return [
        {
          symbol: 'Ethereum',
          image: '/img/icon/ETH-logo.svg',
        },
      ] as NetworkType[];
    case 'GOD':
      return [
        {
          symbol: 'BEP20',
          image: '/img/icon/BNB-logo.svg',
        },
      ] as NetworkType[];
    case 'DRON':
      return [
        {
          symbol: 'BEP20',
          image: '/img/icon/BNB-logo.svg',
        },
      ] as NetworkType[];
    default:
      return [] as NetworkType[];
  }
};

export const updateCoin = (coin: DepositAddress) => {
  switch (coin?.symbol) {
    case 'USDT':
      return { ...coin, image: '/img/icon/USDT-logo.svg' };
    case 'BNB':
      return { ...coin, image: '/img/icon/BNB-logo.svg' };
    case 'ETH':
      return { ...coin, image: '/img/icon/ETH-logo.svg' };
    case 'GOD':
      return { ...coin, image: '/img/icon/GOD-logo.svg' };
    case 'DRON':
      return { ...coin, image: '/img/icon/DRON-logo.png' };
    default:
      return { ...coin, image: '/img/icon/BNB-logo.svg' };
  }
};

export const handleWithdrawURL = (coin?: DepositAddress) => {
  if (coin?.symbol === 'USDT' && coin?.network === 'BEP20') {
    return 'withdraw/transfer-BEP20-USDT';
  } else if (coin?.symbol === 'USDT' && coin?.network === 'ERC20') {
    return 'withdraw/transfer-ERC20';
  } else if (coin?.symbol === 'BNB') {
    return 'withdraw/transfer-BNB';
  } else if (coin?.symbol === 'DRON') {
    return 'withdraw/transfer-BEP20-DRON';
  } else if (coin?.symbol === 'GOD') {
    return 'withdraw/transfer-BEP20-GOD';
  } else if (coin?.symbol === 'ETH') {
    return 'withdraw/transfer-ETH';
  }
  return '';
};

export function removeTrailingZeros(str: string) {
  let num = parseFloat(str); // Convert the string to a number
  let formattedString = num.toString(); // Convert the number back to a string

  // Check if the string contains a decimal point
  if (formattedString.includes('.')) {
    // Remove trailing zeros after the decimal point
    formattedString = formattedString.replace(/(\.\d*?[1-9])0+$/g, '$1');
  }
  return formattedString.slice(1);
}

export function currencyFormat(num: number, fixedNumber: number = 4) {
  if (!num) return Number(0).toFixed(fixedNumber);
  if (Number(num) < 0.01) {
    let numFixed = Number(Number(num)?.toFixed(fixedNumber));
    let integer = Math.abs(Math.trunc(numFixed));
    let decimal = Math.abs(numFixed) - Math.floor(Math.abs(numFixed));
    let decimalString = removeTrailingZeros(String(Number(decimal).toFixed(fixedNumber)).slice(1));
    if (decimal === 0) {
      for (let i = fixedNumber; i <= 8; i++) {
        numFixed = Number(Number(num)?.toFixed(i));
        integer = Math.abs(Math.trunc(numFixed));
        decimal = Math.abs(numFixed) - Math.floor(Math.abs(numFixed));
        decimalString = removeTrailingZeros(String(Number(decimal).toFixed(i)).slice(1));
        if (decimal !== 0) {
          break;
        }
      }
    }

    const minusSymbol = numFixed < 0 ? '-' : '';
    return minusSymbol + String(integer).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + decimalString;
  }
  const numFixed = Number(Number(num)?.toFixed(fixedNumber));
  const integer = Math.abs(Math.trunc(numFixed));
  const decimal = Math.abs(numFixed) - Math.floor(Math.abs(numFixed));
  const minusSymbol = numFixed < 0 ? '-' : '';
  return (
    minusSymbol +
    String(integer).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') +
    String(Number(decimal).toFixed(fixedNumber)).slice(1)
  );
}

export function exchangeByLocaleFiat(prevFiat?: string, curFiat: string = 'USD', amount?: number) {
  const exchangeRateData = CookiesStorage.getCookieData(CookieKey.exchangeRate);
  if (!exchangeRateData || !prevFiat || !curFiat || !amount) return 0;
  const exchangeRateObj = JSON.parse(exchangeRateData);
  const firstRate = exchangeRateObj[prevFiat.toUpperCase()];
  const secondRate = exchangeRateObj[curFiat.toUpperCase()];
  const newAmount = Number((amount * secondRate) / firstRate);
  return Number.isNaN(newAmount) ? 0 : newAmount;
}

export const handleLocaleSymbol = (givenParamValue: string) => {
  try {
    if (!givenParamValue) return '$';
    if (givenParamValue === 'RUB') return '₽';
    if (givenParamValue === 'MAD') return 'د.م.';
    if (givenParamValue === 'IRR') return '﷼';
    return getParamByParam('currency', givenParamValue, 'symbol');
  } catch (error) {
    return '';
  }
};

export const formatLengthNumber = (num: number | string, length?: number) => {
  if (!length) length = 9;
  if (!num) return Number(0).toFixed(length);
  let zeroCount = -Math.floor(Math.log10(Number(num)));
  if (zeroCount > length / 2 && Number(num) > 0) {
    let nonZeros = '';
    let numberString = new Intl.NumberFormat('en', { maximumFractionDigits: length, minimumFractionDigits: 2 })
      .format(Number(num))
      .toString();
    for (let i = zeroCount + 1; i < (numberString.length > zeroCount + 5 ? zeroCount + 5 : numberString.length); i++) {
      nonZeros += numberString[i];
    }
    const res = `0.(${zeroCount - 1})${nonZeros}`;
    return res;
  }
  // const integerNumber = Math.abs(Number(num)).toString().split('.')[0];
  // if (integerNumber.length > 9) return Math.abs(Number(num));
  // console.log('-----390', integerNumber.length);
  // const missLength = length - integerNumber.length > 0 ? length - integerNumber.length : length;
  // console.log(missLength, '------392');
  return formatCompactNumber(Number(num), {
    maximumFractionDigits: length,
    minimumFractionDigits: 2,
  });
};

export const snakeCaseToString = (str?: string) => {
  try {
    return String(str)
      .split('_')
      .filter((x) => x.length > 0)
      .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
      .join(' ');
  } catch (error) {
    return '';
  }
};

export const convertUserInfo = (userData: any) => {
  return {
    userId: userData?.id,
    userName: userData?.name,
    email: userData?.email,
    phone: userData?.phone,
    wallet: userData?.wallet,
    avatar: userData?.avatar,
    betCount: userData?.betCount,
    winCount: userData?.winCount,
    totalWager: userData?.totalWager,
    referralCode: userData?.referralCode,
    isKyc: userData?.isKyc,
    tfa: userData?.tfa,
    generalSetting: {
      settingShowFullNameCrypto: userData?.settingShowFullNameCrypto,
      settingReceiveMarketPromotion: userData?.settingReceiveMarketPromotion,
      settingLanguage: userData?.settingLanguage,
      settingCurrency: 'usd',
    },
    privacySetting: {
      settingHideUserName: userData?.settingHideUserName,
      settingHideGamingData: userData?.settingHideGamingData,
      settingRefuseTipFromStrangers: userData?.settingRefuseTipFromStrangers,
    },
    verifiedSetting: {
      emailVerified: userData?.emailVerified,
      phoneVerified: userData?.phoneVerified,
    },
  };
};

export function formatCompactNumber(number: number, setting: any) {
  try {
    const res = Intl.NumberFormat('en', setting).format(number);
    return res;
  } catch (error) {
    return 0;
  }
}
export function currencyFormat1(number: number, zeroNum: number, currency: string = 'USD', flag: boolean = true) {
  try {
    let res = '';
    const symbol = flag ? handleLocaleSymbol(currency) : '';
    if (number === 0) {
      res = new Array(2).fill('0').join('');
      res = `${symbol} 0.` + res;
      return res;
    }
    let zeroCount = -Math.floor(Math.log10(number));
    if (zeroNum < 5) {
      res = formatCompactNumber(number, {
        maximumFractionDigits: zeroNum,
        minimumFractionDigits: 2,
      }).toString();
      return `${symbol} ${res}`;
    }
    if (zeroCount < zeroNum) {
      res = formatCompactNumber(number, {
        maximumFractionDigits: zeroNum + 2,
        minimumFractionDigits: 2,
      }).toString();
      return `${symbol} ${res}`;
    }
    const miniZeroNum = zeroNum > 5 ? zeroNum : 5;
    let numberString = new Intl.NumberFormat('en', { maximumFractionDigits: miniZeroNum - 1 })
      .format(number)
      .toString();
    if (zeroCount > miniZeroNum) {
      let nonZeros = '';
      for (
        let i = zeroCount + 1;
        i < (numberString.length > zeroCount + 5 ? zeroCount + 5 : numberString.length);
        i++
      ) {
        nonZeros += numberString[i];
      }
      res = `0.(${zeroCount - 1})${nonZeros}`;
    } else {
      res = formatCompactNumber(number, {
        maximumFractionDigits: zeroNum,
        minimumFractionDigits: 2,
      }).toString();
    }
    return `${symbol} ${res}`;
  } catch (error) {
    return '';
  }
}

export const getColorByStatus = (status: TransactionStatus) => {
  let bgColor = '';
  switch (status) {
    case 'process':
      bgColor = 'bg-[#efef19]';
      break;
    case 'pending':
      bgColor = 'bg-[#efef19]';
      break;
    case 'refunding':
      bgColor = 'bg-[#efef19]';
      break;
    case 'rejected':
      bgColor = 'bg-[#c31414]';
      break;
    case 'fail':
      bgColor = 'bg-[#c31414]';
      break;
    default:
      bgColor = 'bg-[#3BC117]';
      break;
  }
  return bgColor;
};
export const convertStatus = (status: TransactionStatus) => {
  let newStatus = '';
  switch (status) {
    case 'process':
      newStatus = 'processing';
      break;
    case 'pending':
      newStatus = 'processing';
      break;
    case 'refunding':
      newStatus = 'processing';
      break;
    case 'fail':
      newStatus = 'failed';
      break;
    case 'rejected':
      newStatus = 'failed';
      break;
    case 'approve':
      newStatus = 'success';
      break;
    default:
      newStatus = status;
      break;
  }
  return newStatus?.charAt(0)?.toUpperCase() + newStatus?.slice(1);
};
