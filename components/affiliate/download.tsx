import Image from 'next/image';
import { useTranslation } from 'react-i18next';

function DownloadComponents() {
  const { t, i18n } = useTranslation('');
  return (
    <div className="flex flex-col lg:flex-row mt-10 gap-4">
      <div className="bg-gradient-card-default rounded-default overflow-hidden">
        <Image
          src="/img/affiliate/banner1.png"
          width={300}
          height={100}
          className="w-full object-cover"
          alt="banner1"
        />
        <div className="flex flex-col gap-4 px-6 py-4">
          <div className="text-m_title font-semibold">{t('affiliate:bannerPack1')}</div>
          <div className="text-default">{t('affiliate:bannerDescription')}</div>
          <a
            href="https://drive.google.com/file/d/1oMqGWsPKqkeEcfCZ5svpSMTrCUilIoZC/view?usp=sharing"
            className="w-[150px]"
            target="_blank"
          >
            <div className="text-m_default bg-gradient-btn-play px-10 py-2 rounded-default w-full">
              {t('affiliate:download')}
            </div>
          </a>
        </div>
      </div>
      <div className="bg-gradient-card-default rounded-default overflow-hidden">
        <Image
          src="/img/affiliate/banner2.png"
          width={300}
          height={100}
          className="w-full object-cover"
          alt="banner1"
        />
        <div className="flex flex-col gap-4 px-6 py-4">
          <div className="text-m_title font-semibold">{t('affiliate:bannerPack2')}</div>
          <div className="text-default">{t('affiliate:bannerDescription')}</div>
          <a
            href="https://drive.google.com/file/d/1DdDE8PqfNvBibT6FCrtlrfaB0N-ltVFE/view?usp=sharing"
            className="w-[150px]"
            target="_blank"
          >
            {/* <a href="https://drive.google.com/file/d/1eLMH--hN5c77H2DUozDc82KydOepTKg-/view?usp=sharing" download="banner2" className="w-[150px]"> */}
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
