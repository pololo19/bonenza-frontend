import { AxiosError } from 'axios';
import { compareAsc, differenceInSeconds, format, isValid } from 'date-fns';
import { camelize } from 'humps';
import { identity, pickBy } from 'lodash';
import Router from 'next/router';
import qs from 'qs';
import { Path, UseFormGetValues } from 'react-hook-form';
import { toast } from 'react-toastify';

import { USER_ROLE_DEFAULT } from '@/base/constants/auth';
import {
  CookieKey,
  DATE_TIME_FORMAT_DEFAULT,
  ERROR_CODE_INVALID_ACCOUNT,
  EXTENSION_IMG_AFTER_CROP,
  TYPE_IMG_AFTER_CROP,
} from '@/base/constants/common';
import { DATE_DASH_DELIMITER_REGEX, DATE_ISO_FORMAT, DATE_VALID_DELIMITER } from '@/base/constants/validation';
import { ErrorResponse } from '@/base/types/api';
import { DepositAddress, NetworkType, ObjectLiteral } from '@/base/types/common';
import { getParamByParam } from 'iso-country-currency';
import { CookiesStorage } from '../storage/cookie';

function camelToSnake(value: string) {
  return value.replace(/[\w]([A-Z])/g, (m) => `${m[0]}_${m[1]}`).toLowerCase();
}

const stringifyParams = (data: any) => {
  const { params, option } = data;
  const newParams = pickBy(params, identity);
  return qs.stringify(newParams, {
    encode: false,
    skipNulls: true,
    strictNullHandling: true,
    ...option,
  });
};

function getCurrentDomain() {
  const parts = window.location.hostname.split('.');
  parts.shift();
  return parts.join('.');
}

function getUrlRoot(pathname?: string) {
  return pathname ? pathname.split('/')[1] : '';
}

function isIsoFormat(str: string) {
  return DATE_ISO_FORMAT.test(str);
}

function isIsoDate(str: string) {
  if (!isIsoFormat(str)) return false;
  const d = new Date(str);
  const numSub = 19;
  return d instanceof Date && !Number.isNaN(d) && d.toISOString().substring(0, numSub) === str.substring(0, numSub);
}

function isValidDate(date: Date | number | string | undefined, options?: { strictMode?: boolean }) {
  if (!date) return false;
  if (typeof date !== 'string') return isValid(date);

  // String format
  const newDateString = date.replace(DATE_DASH_DELIMITER_REGEX, DATE_VALID_DELIMITER);
  if (!options?.strictMode) {
    if (isIsoFormat(date)) return isValid(date);
    return isValid(new Date(newDateString));
  }

  // Check strick mode
  if (isIsoFormat(date)) return isIsoDate(date);
  const [year, month, day] = newDateString.split(DATE_VALID_DELIMITER).map((val) => {
    const newVal = val.split(' ')[0];
    return Number(newVal);
  });
  const newDate = new Date(newDateString);
  return newDate.getFullYear() === year && newDate.getMonth() === month - 1 && newDate.getDate() === day;
}

function createDate(date: Date | number | string) {
  if (typeof date === 'string' && isIsoFormat(date)) {
    return new Date(date);
  }
  return new Date(typeof date === 'string' ? date.replace(DATE_DASH_DELIMITER_REGEX, DATE_VALID_DELIMITER) : date);
}

function formatDate(date: Date | number | string | undefined, dateFormat = DATE_TIME_FORMAT_DEFAULT) {
  if (!date || !isValidDate(date)) return '';
  const newDate: Date = createDate(date);
  return format(newDate, dateFormat).toString();
}

function differenceDateInSeconds(date1: Date | number | string | undefined, date2: Date | number | string | undefined) {
  if (!date1 || !isValidDate(date1)) return '';
  if (!date2 || !isValidDate(date2)) return '';
  const newDate1 = createDate(date1);
  const newDate2 = createDate(date2);
  return differenceInSeconds(newDate1, newDate2);
}

function compareDateAsc(date1: Date | number | string | undefined, date2: Date | number | string | undefined) {
  if (!date1 || !isValidDate(date1)) return '';
  if (!date2 || !isValidDate(date2)) return '';
  const newDate1 = createDate(date1);
  const newDate2 = createDate(date2);
  return compareAsc(newDate1, newDate2);
}

function titleCase(text: string) {
  var splitStr = text.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

function getErrors(error?: AxiosError<ErrorResponse>) {
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

function checkFormHasField(getValues: UseFormGetValues<ObjectLiteral>, field: Path<ObjectLiteral>) {
  return Object.keys(getValues())?.includes(field);
}

function isAdminOfCompany(role?: string) {
  return USER_ROLE_DEFAULT.SUPER_ADMIN === role;
}

function pushQueryParams(params: ObjectLiteral, options?: { scroll?: boolean }) {
  const query = pickBy(params, identity);
  Router.push({ pathname: Router.route, query }, undefined, options);
}

function isErrorAccountInvalid(errorCode: string) {
  return ERROR_CODE_INVALID_ACCOUNT.includes(errorCode);
}

function showToastError(message: string, error?: unknown) {
  const errorCode = (error as AxiosError<ErrorResponse>)?.response?.data?.error?.error_code;
  if (!errorCode || !isErrorAccountInvalid(errorCode)) {
    toast.error(message);
  }
}

function convertTimeZone(date: string | Date) {
  return createDate(date).toLocaleString('ja-JP', { timeZone: process.env.TIME_ZONE });
}

const changeExtension = (fileName: string, extension: string) => {
  const ext = fileName.split('.').pop();
  const root = ext ? fileName.substring(0, fileName.length - ext.length) : '';
  return `${root}${extension}`;
};

function canvasToBlob(canvas: HTMLCanvasElement, fileName: string): Promise<File> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], changeExtension(fileName, EXTENSION_IMG_AFTER_CROP), {
          type: TYPE_IMG_AFTER_CROP,
        });
        resolve(file);
      }
    }, TYPE_IMG_AFTER_CROP);
  });
}

function byteToGigabyte(input: number, numFixed?: number) {
  const result = input / 1024 / 1024 / 1024;
  return numFixed || numFixed === 0 ? result.toFixed(numFixed) : result;
}

function byteToMegabyte(input: number, numFixed?: number) {
  const result = input / 1024 / 1024;
  return numFixed || numFixed === 0 ? result.toFixed(numFixed) : result;
}

function getMessageMetamask(account: string) {
  let message = `Welcome to Bonenza.com!
        This request will not trigger a blockchain transaction or cost any gas fees.
        Your authentication status will reset after 24 hours.
        Wallet address:${account}`;
  return message;
}

const truncateAddress = (address: string, dots = 3) => {
  if (!address) return 'No Account';
  const match = address.match(/^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{8})$/);
  if (!match) return address;
  return `${match[1]}${' .'.repeat(dots)} ${match[2]}`;
};

const truncateAddressHeader = (address: string, dots = 3) => {
  if (!address) return 'No Account';
  const match = address.match(/^(0x[a-zA-Z0-9]{5})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/);
  if (!match) return address;
  return `${match[1]}${' .'.repeat(dots)} ${match[2]}`;
};

const transformWalletAddress = (address: string, dots = 3) => {
  if (!address) return 'No Account';
  const match = address.match(/^([a-zA-Z0-9]{7})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/);
  if (!match) return address;
  return `${match[1]}${' .'.repeat(dots)} ${match[2]}`;
};

const getListNetwork = (coin: DepositAddress) => {
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

const updateCoin = (coin: DepositAddress) => {
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

const handleWithdrawURL = (coin?: DepositAddress) => {
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

function removeTrailingZeros(str: string) {
  let num = parseFloat(str); // Convert the string to a number
  let formattedString = num.toString(); // Convert the number back to a string

  // Check if the string contains a decimal point
  if (formattedString.includes('.')) {
    // Remove trailing zeros after the decimal point
    formattedString = formattedString.replace(/(\.\d*?[1-9])0+$/g, '$1');
  }
  return formattedString.slice(1);
}

function currencyFormat(num: number, fixedNumber: number = 4) {
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
        decimalString= removeTrailingZeros(String(Number(decimal).toFixed(i)).slice(1));
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

function exchangeByLocaleFiat(prevFiat?: string, curFiat: string = 'USD', amount?: number) {
  const exchangeRateData = CookiesStorage.getCookieData(CookieKey.exchangeRate);
  if (!exchangeRateData || !prevFiat || !curFiat || !amount) return 0;
  const exchangeRateObj = JSON.parse(exchangeRateData);
  const firstRate = exchangeRateObj[prevFiat.toUpperCase()];
  const secondRate = exchangeRateObj[curFiat.toUpperCase()];
  const newAmount = Number((amount * secondRate) / firstRate);
  return Number.isNaN(newAmount) ? 0 : newAmount;
}

const handleLocaleSymbol = (givenParamValue: string) => {
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

const formatLengthNumber = (num: number | string, length?: number) => {
  if (!length) length = 9;
  if (!num) return Number(0).toFixed(length - 1);
  const integerNumber = Math.abs(Number(num)).toString().split('.')[0];
  if (integerNumber.length > 9) return Math.abs(Number(num));
  const missLength = length - integerNumber.length > 0 ? length - integerNumber.length : 0;
  return Math.abs(Number(num)).toFixed(missLength);
};

const isDecimalNumber = (num: number | string) => {
  if (!num) return false;
  return !!Math.abs(Number(num)).toString().split('.')[1];
};

const snakeCaseToString = (str?: string) => {
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

const convertUserInfo = (userData: any) => {
  return {
    userName: userData?.username,
    userId: userData?.id,
    email: userData?.email,
    avatar: userData?.avatar,
    phone: userData?.phone,
    uuid: userData?.uuid,
    winCount: userData?.winCount,
    betCount: userData?.betCount,
    totalWager: userData?.totalWager,
    referralCode: userData?.referralCode,
    isKyc: userData?.isKyc,
  };
};

export {
  convertUserInfo,
  snakeCaseToString,
  handleLocaleSymbol,
  exchangeByLocaleFiat,
  currencyFormat,
  isDecimalNumber,
  formatLengthNumber,
  titleCase,
  updateCoin,
  handleWithdrawURL,
  getListNetwork,
  truncateAddressHeader,
  truncateAddress,
  transformWalletAddress,
  getMessageMetamask,
  stringifyParams,
  camelToSnake,
  getCurrentDomain,
  getUrlRoot,
  isValidDate,
  formatDate,
  getErrors,
  checkFormHasField,
  pushQueryParams,
  createDate,
  isErrorAccountInvalid,
  showToastError,
  isIsoFormat,
  isIsoDate,
  differenceDateInSeconds,
  compareDateAsc,
  isAdminOfCompany,
  convertTimeZone,
  changeExtension,
  canvasToBlob,
  byteToGigabyte,
  byteToMegabyte,
};
