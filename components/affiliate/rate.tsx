import { useTranslation } from 'react-i18next';

function RateAndRulesComponent() {
  const { t, i18n } = useTranslation('');
  return (
    <div className="mt-5">
      <div className="bg-[url('/img/affiliate/casino-rule.png')]">
        <div>{t('layout:casino')}</div>
        <div className="grid grid-cols-2">
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default RateAndRulesComponent;
