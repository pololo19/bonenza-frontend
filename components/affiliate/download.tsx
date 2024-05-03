import Image from 'next/image';
import { useTranslation } from 'react-i18next';

function DownloadComponents() {
  const { t, i18n } = useTranslation('');
  return (
    <div className="flex flex-col lg:flex-row mt-10 gap-4">
      <div className="bg-gradient-card-default rounded-default">
        <Image
          src="/img/affiliate/banner1.png"
          width={300}
          height={100}
          className="w-full object-cover"
          alt="banner1"
        />
        <div className="flex flex-col gap-4 px-6 py-4">
          <div className="text-m_title font-semibold">{t('affiliate:bannerPack')}</div>
          <div className="text-default">{t('affiliate:bannerDescription')}</div>
          <a href="/img/affiliate/banner1.png" download="banner1" className="w-[150px]">
            <div className="text-m_default bg-gradient-btn-play px-10 py-2 rounded-default w-full">
              {t('affiliate:download')}
            </div>
          </a>
        </div>
      </div>
      <div className="bg-gradient-card-default rounded-default">
        <Image
          src="/img/affiliate/banner2.png"
          width={300}
          height={100}
          className="w-full object-cover"
          alt="banner1"
        />
        <div className="flex flex-col gap-4 px-6 py-4">
          <div className="text-m_title font-semibold">{t('affiliate:bannerPack')}</div>
          <div className="text-default">{t('affiliate:bannerDescription')}</div>
          <a href="/img/affiliate/banner2.png" download="banner2" className="w-[150px]">
            <div className="text-m_default bg-gradient-btn-play px-10 py-2 rounded-default w-full">
              {t('affiliate:download')}
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default DownloadComponents;
