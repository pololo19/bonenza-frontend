import cn from 'classnames';
import { Eye, EyeSlash } from 'iconsax-react';
import { InputHTMLAttributes, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { MAX_LENGTH, REGEX_JAPANESE_CHARACTERS, SPECIAL_CHARACTER } from '@/base/constants/validation';
import { EnumTypeInput } from '@/base/types/common';
import { InputTextType } from '@/base/types/form';

interface InputTextProps<TFieldValues extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  customClass?: string;
  maxLength?: number;
  dataErrorId?: string;
  invalid?: boolean;
  isBlockSpecialCharacter?: boolean;
  ['data-testid']?: string;
}

const InputPassword = <TFieldValues extends Record<string, unknown>>({
  control,
  name,
  onChange,
  customClass,
  maxLength,
  dataErrorId,
  invalid,
  isBlockSpecialCharacter,
  ...rest
}: InputTextProps<TFieldValues>) => {
  const [showPass, setShowPass] = useState(false);

  const handleChangeValue = (event: InputTextType, formOnChange: (event: InputTextType) => void) => {
    let data = '';
    if (isBlockSpecialCharacter) {
      data = event.target.value.replace(SPECIAL_CHARACTER, '').substring(0, maxLength || MAX_LENGTH);
    } else {
      data = event.target.value.substring(0, maxLength || MAX_LENGTH);
    }
    const eventAfter = {
      ...event,
      target: {
        ...event.target,
        value: data
          .replace(REGEX_JAPANESE_CHARACTERS, '')
          .substring(0, maxLength || MAX_LENGTH)
          .trim(),
      },
    };
    onChange?.(eventAfter);
    formOnChange(eventAfter);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full flex-1">
          <div className="dark:bg-color-bg-primary bg-[#f5f6fa] rounded-[3px] flex items-center px-[10px] py-[10px] gap-[18px] text-[14px] border-[1px] border-solid border-transparent focus-within:border-color-primary">
            <input
              {...rest}
              {...field}
              name={name}
              type={showPass ? EnumTypeInput.TEXT : EnumTypeInput.PASSWORD}
              value={(field.value ?? '') as string}
              onChange={(event: InputTextType) => handleChangeValue(event, field.onChange)}
              className={cn(
                'w-full dark:bg-color-bg-primary bg-[#f5f6fa] focus:outline-none text-[14px] dark:text-white text-black',
                customClass,
                {
                  'border-red-500': !!error?.message,
                },
              )}
            />
            {showPass ? (
              <Eye className="dark:text-[#C4C4C4] text-black cursor-pointer" onClick={() => setShowPass(!showPass)} />
            ) : (
              <EyeSlash
                className="dark:text-[#C4C4C4] text-black cursor-pointer"
                onClick={() => setShowPass(!showPass)}
              />
            )}
          </div>

          {error?.message && <span className="text-red-500 text-[12px]"> {error?.message}</span>}
        </div>
      )}
    />
  );
};
export default InputPassword;
