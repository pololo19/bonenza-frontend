import { CloseSquare, SearchNormal1 } from 'iconsax-react';
import { InputHTMLAttributes } from 'react';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  showClose?: boolean;
  onClose?: () => void;
  className?: string;
}

const InputSearch = <TFieldValues extends Record<string, unknown>>({
  showClose,
  onClose,
  className,
  ...rest
}: InputTextProps) => {
  return (
    <div className="relative w-full">
      <input
        className={`w-full px-2 py-2 outline-none dark:bg-gray-700/75 bg-white rounded pl-[35px] dark:text-white text-[#31373d] sm:text-[14px] text-[12px] placeholder:text-[14px] ${className}`}
        placeholder="Search"
        {...rest}
      />
      <SearchNormal1 className="absolute left-[10px] top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      {showClose && (
        <CloseSquare
          className="text-gray-400 absolute right-[10px] top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={onClose}
          size={14}
        />
      )}
    </div>
  );
};
export default InputSearch;
