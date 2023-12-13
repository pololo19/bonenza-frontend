import { format } from 'date-fns';
import jschardet from 'jschardet';
import Papa, { ParseResult } from 'papaparse';

import { ALLOW_FILE_TYPE_CSV } from '@/base/constants/validation';
import { CSVReaderResult, EnumCSVValidateResult, ObjectLiteral } from '@/base/types/common';
import {
  DATE_TIME_FORMAT_CSV,
  IMAGE_THUMBNAIL,
  SIZE_IMAGE,
  TYPE_IMAGE,
  UNICODE_NORMALIZATION,
} from '@/constants/common';

const hasExtension = (fileName: string, exts: string[]) =>
  new RegExp(`(${exts.join('|').replace(/\./g, '\\.')})$`, 'i').test(fileName);

const convertFileCSV = async (file: File) => {
  try {
    const ogFile = file;
    const detectEncodingReader = new FileReader();
    let encoding = 'utf-8';
    await new Promise((resolve) => {
      detectEncodingReader.onload = () => {
        const buffer = detectEncodingReader.result as string;
        const detectedBuffer = jschardet.detect(buffer);
        encoding = detectedBuffer.encoding;

        resolve(true);
      };
      detectEncodingReader.readAsBinaryString(ogFile);
    });

    return new Promise<File>((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const buffer = fileReader.result as string;
        const blob = new Blob([buffer], { type: 'text/csv;charset=utf-8;' });
        const converted = new File([blob], ogFile.name, { type: 'text/csv' });
        resolve(converted);
      };
      fileReader.readAsText(ogFile, encoding);
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const matchColumns = (aColumns: string[], bColumns: string[]) => {
  if (aColumns.some((item) => !bColumns.includes(item))) return false;
  if (bColumns.some((item) => !aColumns.includes(item))) return false;
  return true;
};

const ignoreLineFilter = (key: string) => {
  return key !== 'line';
};

const isEmptyLine = (data: ObjectLiteral) => {
  const keys = Object.keys(data).filter(ignoreLineFilter);
  if (keys.length > 1) return false;
  if (!keys.length) return true;
  const firstKey = keys[0];
  return !data[firstKey] || !String(data[firstKey]).trim();
};

async function handleFileCSV(
  file: File,
  options: {
    columnsCompare?: string[];
    maxRow?: number;
    transform?: (value: string, field: string) => any;
  } = {},
): Promise<CSVReaderResult> {
  const { columnsCompare, maxRow, transform } = options;
  const res: CSVReaderResult = {
    error: undefined,
    result: undefined,
  };

  const isAllowed = hasExtension(file?.name, ALLOW_FILE_TYPE_CSV);
  if (!isAllowed) {
    res.error = EnumCSVValidateResult.CSV_ERROR_EXTENSION;
    return Promise.resolve(res);
  }

  try {
    const fileConvert = await convertFileCSV(file);

    return new Promise((resolve) => {
      const onComplete = (result: ParseResult<ObjectLiteral>) => {
        const data = result.data
          .map((item, index) => ({ ...item, line: index + 1 })) // no for header
          .filter((item) => !isEmptyLine(item));
        res.result = { ...result, data };
        const { fields } = result.meta;
        if (!fields?.length || (columnsCompare?.length && !matchColumns(fields, columnsCompare))) {
          res.error = EnumCSVValidateResult.CSV_ERROR_COLUMN;
        }

        if (!data?.length) {
          res.error = EnumCSVValidateResult.CSV_ERROR_FILE_EMPTY_DATA;
        }

        if (maxRow && data.length > maxRow) {
          res.error = EnumCSVValidateResult.CSV_ERROR_LIMIT;
        }
        resolve(res);
      };

      const onError = () => {
        res.error = EnumCSVValidateResult.CSV_ERROR_DATA;
        resolve(res);
      };

      const transformData = (value: string, field: string | number) => {
        const newValue = value.trim();
        if (transform) return transform(newValue, String(field));
        return newValue;
      };

      Papa.parse(fileConvert, {
        header: true,
        skipEmptyLines: false,
        transformHeader: (header) => header.trim(),
        transform: transformData,
        complete: onComplete,
        error: onError,
      });
    });
  } catch (error) {
    res.error = EnumCSVValidateResult.CSV_ERROR_DATA;
    return Promise.resolve(res);
  }
}

const downloadFile = (file: string, fileName: string, fileType?: string) => {
  const blob = new Blob([file], { type: fileType || 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const timeDownload = format(new Date(), DATE_TIME_FORMAT_CSV);
  a.download = `${fileName}_${timeDownload}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const getFileExtension = (fileName: string) => fileName.split('.').pop()?.toLowerCase();

const getExactFileName = (fileName: string) => {
  if (!getFileExtension(fileName)) return fileName;
  return fileName.substr(0, fileName.lastIndexOf('.'));
};

const generateUrl = (bucket?: string, url?: string, type?: string, size?: string) => {
  if (url && bucket) {
    return `${process.env.RESOURCE_PUBLIC_URL}/${type || TYPE_IMAGE}/${bucket}/${size || SIZE_IMAGE}/${url}`;
  }
  return IMAGE_THUMBNAIL;
};

const LIST_CHARACTERS: { [key: string]: string } = {
  ァ: 'ｧ',
  ア: 'ｱ',
  ィ: 'ｨ',
  イ: 'ｲ',
  ゥ: 'ｩ',
  ウ: 'ｳ',
  ェ: 'ｪ',
  エ: 'ｴ',
  ォ: 'ｫ',
  オ: 'ｵ',
  カ: 'ｶ',
  ガ: 'ｶﾞ',
  キ: 'ｷ',
  ギ: 'ｷﾞ',
  ク: 'ｸ',
  グ: 'ｸﾞ',
  ケ: 'ｹ',
  ゲ: 'ｹﾞ',
  コ: 'ｺ',
  ゴ: 'ｺﾞ',
  サ: 'ｻ',
  ザ: 'ｻﾞ',
  シ: 'ｼ',
  ジ: 'ｼﾞ',
  ス: 'ｽ',
  ズ: 'ｽﾞ',
  セ: 'ｾ',
  ゼ: 'ｾﾞ',
  ソ: 'ｿ',
  ゾ: 'ｿﾞ',
  タ: 'ﾀ',
  ダ: 'ﾀﾞ',
  チ: 'ﾁ',
  ヂ: 'ﾁﾞ',
  ッ: 'ｯ',
  ツ: 'ﾂ',
  ヅ: 'ﾂﾞ',
  テ: 'ﾃ',
  デ: 'ﾃﾞ',
  ト: 'ﾄ',
  ド: 'ﾄﾞ',
  ナ: 'ﾅ',
  ニ: 'ﾆ',
  ヌ: 'ﾇ',
  ネ: 'ﾈ',
  ノ: 'ﾉ',
  ハ: 'ﾊ',
  バ: 'ﾊﾞ',
  パ: 'ﾊﾟ',
  ヒ: 'ﾋ',
  ビ: 'ﾋﾞ',
  ピ: 'ﾋﾟ',
  フ: 'ﾌ',
  ブ: 'ﾌﾞ',
  プ: 'ﾌﾟ',
  ヘ: 'ﾍ',
  ベ: 'ﾍﾞ',
  ペ: 'ﾍﾟ',
  ホ: 'ﾎ',
  ボ: 'ﾎﾞ',
  ポ: 'ﾎﾟ',
  マ: 'ﾏ',
  ミ: 'ﾐ',
  ム: 'ﾑ',
  メ: 'ﾒ',
  モ: 'ﾓ',
  ャ: 'ｬ',
  ヤ: 'ﾔ',
  ュ: 'ｭ',
  ユ: 'ﾕ',
  ョ: 'ｮ',
  ヨ: 'ﾖ',
  ラ: 'ﾗ',
  リ: 'ﾘ',
  ル: 'ﾙ',
  レ: 'ﾚ',
  ロ: 'ﾛ',
  ヮ: '',
  ワ: 'ﾜ',
  ヲ: 'ｦ',
  ン: 'ﾝ',
  ヴ: 'ｳﾞ',
  '・': '･',
  ー: 'ｰ',
  '。': '.',
  '「': '｢',
  '」': '｣',
};

const getCharacters = (string: string) => {
  return string.split('');
};

const mapToHalfWidth = (character: string) => {
  if (typeof LIST_CHARACTERS[character] === 'undefined') {
    return character;
  }
  return LIST_CHARACTERS[character];
};

const mapToFullWidth = (character: string) => {
  const fullWidthCharacter = Object.keys(LIST_CHARACTERS).find((key) => LIST_CHARACTERS[key] === character);
  if (typeof fullWidthCharacter === 'undefined') {
    return character;
  }
  return fullWidthCharacter;
};

const toHalfWidth = (string: string) => {
  const stringNormalize = string.normalize(UNICODE_NORMALIZATION);
  const characters = getCharacters(stringNormalize);
  let halfWidthString = '';
  characters.forEach((character) => {
    halfWidthString += mapToHalfWidth(character);
  });
  return halfWidthString;
};

const toFullWidth = (string: string) => {
  const convertString = string.replace(/[!-~]/g, (fullWidthChar) =>
    String.fromCharCode(fullWidthChar.charCodeAt(0) + 0xfee0),
  );
  const characters = getCharacters(convertString);
  let fullWidthString = '';
  characters.forEach((character) => {
    fullWidthString += mapToFullWidth(character);
  });
  return fullWidthString;
};

const isNameAsSame = (fileName1: string, fileName2: string) => {
  return toHalfWidth(fileName1.toUpperCase()) === toHalfWidth(fileName2.toUpperCase());
};

export {
  downloadFile,
  generateUrl,
  getExactFileName,
  getFileExtension,
  handleFileCSV,
  hasExtension,
  ignoreLineFilter,
  isNameAsSame,
  toFullWidth,
  toHalfWidth,
};
