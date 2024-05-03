import Image from 'next/image';

function DownloadComponents() {
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
          <div className="text-m_title font-semibold">Banner Pack</div>
          <div className="text-default">Multilingual Package including events, animated banners, and more..</div>
          <div>
            <button className="text-m_default bg-gradient-btn-play px-10 py-2 rounded-default">Download</button>
          </div>
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
          <div className="text-m_title font-semibold">Banner Pack</div>
          <div className="text-default">Multilingual Package including events, animated banners, and more..</div>
          <div>
            <button className="text-m_default bg-gradient-btn-play px-10 py-2 rounded-default">Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadComponents;
