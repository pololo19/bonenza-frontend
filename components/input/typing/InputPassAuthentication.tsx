import cn from 'classnames';
import { Eye, EyeSlash } from 'iconsax-react';
import Image from 'next/image';
import { InputHTMLAttributes, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { MAX_LENGTH, SPECIAL_CHARACTER, SPECIAL_CHARACTER_WITHOUT_EMAIL } from '@/base/constants/validation';
import { EnumTypeInput } from '@/base/types/common';
import { InputTextType } from '@/base/types/form';

interface InputTextProps<TFieldValues extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  customClass?: string;
  postfix?: string;
  prefix?: string;
  maxLength?: number;
  dataErrorId?: string;
  invalid?: boolean;
  typeInput?: EnumTypeInput;
  isBlockSpecialCharacter?: boolean;
  ['data-testid']?: string;
  autoComplete?: string;
}

const InputPassAuthentication = <TFieldValues extends Record<string, unknown>>({
  control,
  name,
  onChange,
  customClass,
  postfix,
  prefix,
  maxLength,
  dataErrorId,
  invalid,
  typeInput = EnumTypeInput.TEXT,
  isBlockSpecialCharacter,
  autoComplete,
  ...rest
}: InputTextProps<TFieldValues>) => {
  const [showPass, setShowPass] = useState(false);

  const handleChangeValue = (event: InputTextType, formOnChange: (event: InputTextType) => void) => {
    let data = '';
    if (typeInput === EnumTypeInput.EMAIL) {
      data = event.target.value.replace(SPECIAL_CHARACTER_WITHOUT_EMAIL, '').substring(0, maxLength || MAX_LENGTH);
    } else if (isBlockSpecialCharacter) {
      data = event.target.value.replace(SPECIAL_CHARACTER, '').substring(0, maxLength || MAX_LENGTH);
    } else {
      data = event.target.value.substring(0, maxLength || MAX_LENGTH);
    }
    const eventAfter = { ...event, target: { ...event.target, value: data } };
    onChange?.(eventAfter);
    formOnChange(eventAfter);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="w-full flex-1">
            <div className="bg-white dark:bg-[#12181F] rounded-[10px] flex items-center p-[15px] gap-[18px]">
              <Image width={20} height={20} src="/img/icon/icon-pass.png" alt="" />
              <div className="w-[1px] h-[13px] bg-[#C3CDDB]" />
              <input
                {...rest}
                {...field}
                name={name}
                type={showPass ? EnumTypeInput.TEXT : EnumTypeInput.PASSWORD}
                value={(field.value ?? '') as string}
                autoComplete={autoComplete}
                onChange={(event: InputTextType) => handleChangeValue(event, field.onChange)}
                className={cn(
                  'w-full bg-white dark:bg-[#12181F] focus:outline-none text-[14px] text-black dark:text-white',
                  customClass,
                  {
                    'border-red-500': !!error?.message,
                  },
                )}
              />
              {showPass ? (
                <Eye className="text-[#C4C4C4]" onClick={() => setShowPass(!showPass)} />
              ) : (
                <EyeSlash className="text-[#C4C4C4]" onClick={() => setShowPass(!showPass)} />
              )}
            </div>

            {error?.message && <span className="text-red-500 text-[12px]"> {error?.message}</span>}
          </div>
        );
      }}
    />
  );
};
export default InputPassAuthentication;
