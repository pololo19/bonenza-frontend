import cn from 'classnames';
import { InputHTMLAttributes } from 'react';
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
}

const InputText = <TFieldValues extends Record<string, unknown>>({
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
  ...rest
}: InputTextProps<TFieldValues>) => {
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
            <input
              {...rest}
              {...field}
              name={name}
              className={cn(
                'dark:text-white text-color-light-text-primary w-full text-[16px] rounded-[3px] placeholder:text-[#53575C] outline-none border-[1px] border-solid border-transparent focus-within:border-color-primary dark:dark-autofill light-autofill',
                customClass,
                {
                  'border-red-500 border border-solid': !!error?.message,
                },
              )}
              value={(field.value ?? '') as string}
              onChange={(event: InputTextType) => handleChangeValue(event, field.onChange)}
            />
            {postfix && (
              <span data-testid={`${rest['data-testid'] || ''}-input-postfix`} className="postfix">
                {postfix}
              </span>
            )}
            {prefix && (
              <span data-testid={`${rest['data-testid'] || ''}-input-prefix`} className="prefix">
                {prefix}
              </span>
            )}
            {error?.message && <span className="text-red-500 text-[12px]"> {error?.message}</span>}
          </div>
        );
      }}
    />
  );
};
export default InputText;
