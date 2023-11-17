import { Select, SelectProps } from 'antd';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface InputTextProps<TFieldValues extends FieldValues> extends SelectProps {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  customClass?: string;
}

const AdminSelectBox = <TFieldValues extends Record<string, unknown>>({
  control,
  name,
  customClass,
  ...rest
}: InputTextProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="w-full flex-1">
            <Select
              className={customClass}
              {...rest}
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={(val) => field.onChange(val)}
            />
            {error?.message && <span className="text-red-500 text-[12px]"> {error?.message}</span>}
          </div>
        );
      }}
    />
  );
};
export default AdminSelectBox;
