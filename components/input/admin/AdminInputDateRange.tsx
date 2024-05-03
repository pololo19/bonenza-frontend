import { DatePicker, InputProps } from 'antd';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import styles from './date.module.scss';

interface InputTextProps<TFieldValues extends FieldValues> extends InputProps {
  name: Path<TFieldValues>;
  customClass?: string;
  control: Control<TFieldValues>;
}

const AdminInputDateRange = <TFieldValues extends Record<string, unknown>>({
  control,
  customClass,
  name,
}: InputTextProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="w-full flex-1">
            {/* <Input
              {...rest}
              {...field}
              name={name}
              className={cn('w-full text-[16px] outline-none', customClass, {
                'border-red-500 border border-solid': !!error?.message,
              })}
              value={(field.value ?? '') as string}
              onChange={(event: InputTextType) => handleChangeValue(event, field.onChange)}
            /> */}
            <DatePicker.RangePicker
              name={name}
              onChange={(val) => field.onChange(val)}
              className={`${customClass} ${styles.mydate}`}
            />
            {error?.message && <span className="text-red-500 text-[12px]"> {error?.message}</span>}
          </div>
        );
      }}
    />
  );
};
export default AdminInputDateRange;
