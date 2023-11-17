import { useTranslation } from '@/base/config/i18next';
import classNames from 'classnames';
import { HTMLAttributes, useMemo } from 'react';

type DepositAddressProps = {
  address: string;
} & HTMLAttributes<HTMLElement>;

export const DepositAddressComponent = (props: DepositAddressProps) => {
  const { address, ...rest } = props;
  const { t } = useTranslation('');

  const prefixAddress = useMemo(() => {
    return address.slice(0, 4);
  }, [address]);

  const suffixAddress = useMemo(() => {
    return address.slice(-4);
  }, [address]);

  const centerAddress = useMemo(() => {
    return address.slice(4, -4);
  }, [address]);

  return (
    <div {...rest} className={classNames('break-all', rest?.className)}>
      <span className="text-amber-500">{prefixAddress}</span>
      {centerAddress}
      <span className="text-amber-500">{suffixAddress}</span>
    </div>
  );
};
