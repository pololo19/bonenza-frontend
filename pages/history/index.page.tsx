import { useTranslation } from '@/base/config/i18next';
import BaseLayout from '@/components/layouts/base.layout';
import Image from 'next/image';
import { ReactElement } from 'react';

function History() {
  const { t } = useTranslation('');
  const numberLucky = [
    {
      number: 19,
    },
    {
      number: 1,
    },
    {
      number: 30,
    },
    {
      number: 32,
    },
    {
      number: 16,
    },
  ];

  const dataFake = [
    {
      img: 'https://gtjai.com.vn/wp-content/uploads/2021/07/avt.png',
    },
    {
      img: 'https://gtjai.com.vn/wp-content/uploads/2021/07/avt.png',
    },
    {
      img: 'https://gtjai.com.vn/wp-content/uploads/2021/07/avt.png',
    },
    {
      img: 'https://gtjai.com.vn/wp-content/uploads/2021/07/avt.png',
    },
    {
      img: 'https://gtjai.com.vn/wp-content/uploads/2021/07/avt.png',
    },
    {
      img: 'https://gtjai.com.vn/wp-content/uploads/2021/07/avt.png',
    },
    {
      img: 'https://gtjai.com.vn/wp-content/uploads/2021/07/avt.png',
    },
  ];

  return (
    <>
      <div>
        <h3 className="text-[11px] font-bold dark:text-white text-black my-4">
          Ezominvgnyb
          <span className="pl-3 dark:text-[#0DFDE4] text-[#f39717] font-normal">
            {t('history:bought4LotteryTickets')}
          </span>
        </h3>
        <div className="relative flex justify-center">
          <div className="md:bg-[url('/img/banner-history.png')] bg-[url('/img/banner-history-mobile.png')] mb-6 md:mb-5 md:w-full w-[350px] md:h-[260px] h-[348px] pb-[50px] bg-center bg-cover bg-no-repeat">
            <div className="text-xs md:text-[10px] pt-2">
              <div className="font-normal text-[#95989C] ml-[18px]">
                {t('history:lotteryGameID')} <span className="text-white">20230804080000</span>
              </div>
              <div className="flex justify-end gap-4 mr-[18px] text-[#0DFDE4] mt-[11px] md:mt-0">
                <div>{t('history:howToPlay')}</div>
                <div>{t('history:provablyFair')}</div>
              </div>
            </div>
            <div className="flex items-end justify-center">
              <div className="md:mt-24 mt-40">
                <div className="text-sm font-normal">{t('history:nextDrawStartIn')}</div>
                <div className="text-xl font-bold mb-4">23h:52m:00s</div>
                <div
                  role="button"
                  className="w-[125px] h-12 rounded-large bg-color-primary font-bold dark:text-white text-black flex flex-col justify-center items-center"
                >
                  <span className="text-sm">{t('history:buyTicketFor')}</span>
                  <p className="text-xs font-normal">1 {t('history:ticketCosts')} $0.1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 text-[13px] mb-[9px]">
          <button className="dark:bg-[#38393D] bg-white hover:text-black dark:hover:text-white dark:hover:bg-blue-600 dark:text-white text-[#31373d] rounded md:w-[140px] w-[105px] opacity-50 h-[38px]">
            {t('history:myTicket')} (0)
          </button>
          <button className="dark:bg-blue-500 bg-[#eaecf3] dark:bg-[#20D4EB] hover:bg-[#eaecf3] dark:hover:bg-blue-600 md:w-[140px] w-[105px] dark:text-white text-black rounded dark:bg-opacity-0 dark:hover:bg-opacity-100 h-[38px]">
            {t('history:result')}
          </button>
          <button className="dark:bg-[#38393D] bg-white hover:text-black dark:hover:text-white dark:hover:bg-blue-600 md:w-[140px] w-[110px] dark:text-white text-[#31373d] rounded opacity-50 h-[38px]">
            {t('history:jackpotWinner')}
          </button>
        </div>
        <div className="dark:bg-[#17191B] bg-white h-[878px] mb-[34px]">
          <div className="flex flex-col md:flex-row gap-3 md:items-center text-[10px] mb-[37px] pt-[9px] pl-[29px]">
            <span>{t('history:gameID')}</span>
            <div className="flex gap-[5px] md:justify-center items-center">
              <button className="bg-[#f5f6fa] dark:bg-[#212427] w-7 h-6 dark:hover:bg-blue-600 dark:text-white text-black font-bold py-1 px-2 rounded transition duration-300">
                <i className="fi fi-rr-angle-small-left flex items-center dark:text-white text-black"></i>
              </button>
              <div className="w-[140px] h-[32px] dark:bg-[#222428] bg-[#f5f6fa] rounded flex justify-center items-center text-[#4D545C]">
                20230716
              </div>
              <button className="bg-[#f5f6fa] dark:bg-[#212427] w-7 h-6 dark:hover:bg-blue-600 dark:text-white text-black font-bold py-1 px-2 rounded transition duration-300">
                <i className="fi fi-rr-angle-small-right text-[#4D545C] flex items-center"></i>
              </button>
              <button className="bg-[#f5f6fa] dark:bg-[#212427] w-7 h-6 dark:hover:bg-blue-600 dark:text-white text-black font-bold py-1 px-2 rounded transition duration-300">
                <i className="fi fi-rr-angle-small-right flex items-center dark:text-white text-black"></i>
              </button>
            </div>
            <span className="hidden md:block dark:text-light text-black">21:55:00 16/17/2023</span>
          </div>
          <div className="flex justify-center items-center lg:h-[92px] h-[226px] w-full mb-7 ">
            <div className="lg:bg-[url('/img/Subtract.png')] bg-[url('/img/Subtract-mobile.png')] bg-no-repeat h-full lg:w-[1034px] w-[323px] pt-3 lg:pl-5 flex flex-col lg:flex-row justify-between items-center">
              <div>
                <div className="font-normal text-[10px] mb-2 pl-11 lg:pl-0">
                  {t('history:drawTime')} 8/7/2023, 2:55:00 PM
                </div>
                <div className="lg:bg-[url('/img/number-lucky.png')] bg-[url('/img/number-lucky-mobile.png')] bg-no-repeat lg:w-[394px] w-[305px] lg:h-[42px] h-[98px] flex lg:justify-end justify-center lg:items-center items-end lg:gap-x-8 gap-x-5 lg:pr-3 pb-3 lg:pb-0">
                  <div className="flex lg:gap-x-3.5 gap-x-1.5">
                    {numberLucky.map((item, key) => (
                      <div
                        className="flex justify-center items-center lg:h-7 lg:w-7 w-10 h-10 bg-white rounded-full"
                        key={key}
                      >
                        <span className="text-black lg:text-sm text-base font-bold">{item.number}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center items-center lg:h-7 lg:w-7 h-10 w-10 bg-color-primary rounded-full">
                    <span className="dark:text-white text-black lg:text-sm text-base font-bold">2</span>
                  </div>
                </div>
              </div>
              <div className="lg:w-[430px] w-full flex flex-col justify-center items-center gap-y-4 text-[11px] font-normal pb-4 text-[#95989C]">
                <div className="flex gap-x-2 items-center">
                  <Image src="/img/icon-ticket-star.png" width={18} height={18} alt="" />
                  <span>{t('history:drawTime')} 8/7/2023, 2:55:00 PM:</span>
                  <span className="font-bold text-white">26839</span>
                </div>
                <div className="flex gap-x-2">
                  <Image src="/img/icon-crown.png" width={18} height={18} alt="" />
                  <span>{t('history:totalWinning')}</span>
                  <span className="font-bold text-white">226</span>
                </div>
              </div>
            </div>
          </div>
          <div className="min-h-full">
            <div>
              <h3 className="font-bold text-xs 2xl:text-base dark:text-white text-black flex justify-center items-center mb-3 mt-7">
                {t('history:winnersList')}
              </h3>
              <table className="min-w-full divide-y divide-zinc-100 text-[11px] 2xl:text-sm">
                <thead>
                  <tr>
                    <th className="sm:px-6 px-1 py-3 text-xs font-medium text-gray-500 tracking-wider text-left hidden sm:block">
                      {t('history:winnerName')}
                    </th>
                    <th className="sm:px-6 px-1 py-3 text-xs font-medium text-gray-500 tracking-wider text-left block sm:hidden pl-[10px]">
                      {t('history:name')}
                    </th>
                    <th className="sm:px-6 px-1 py-3 text-xs font-medium text-gray-500 tracking-wider text-center">
                      {t('history:numbers')}
                    </th>
                    <th className="sm:px-6 px-1 py-3 text-xs font-medium text-gray-500 tracking-wider text-center hidden sm:block">
                      {t('history:matches')}
                    </th>
                    <th className="sm:px-6 px-1 py-3 text-xs font-medium text-gray-500 tracking-wider text-right pr-[10px]">
                      {t('history:prize')}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[10px] 2xl:text-xs">
                  {dataFake.map((item, key) => (
                    <tr className="divide-y divide-zinc-100" key={key}>
                      <td className="md:px-6 px-1 py-2 whitespace-nowrap text-left pl-[10px]">
                        <div className="flex items-center gap-3">
                          <Image src={item.img} alt="" width={34} height={34} className="hidden md:block" />
                          <span className="dark:text-white text-black">Ancagpprmyb</span>
                        </div>
                      </td>
                      <td className=" whitespace-nowrap">
                        <div className="flex justify-center items-center">
                          <div className="pt-4 md:pt-0 mb-[3px] bg-[url('/img/number-history.png') bg-cover bg-no-repeat h-[34px] flex md:justify-between justfy-center gap-2 items-center">
                            <div className="flex justify-center items-center md:gap-2 gap-1">
                              {numberLucky.map((item, key) => (
                                <div
                                  className="flex justify-center items-center w-5 h-5 bg-white rounded-full"
                                  key={key}
                                >
                                  <span className="text-black md:text-xs text-[9px] font-bold">{item.number}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-center items-center h-5 w-5 bg-color-primary rounded-full mr-2">
                              <span className="dark:text-white text-black md:text-sm text-[9] font-bold">2</span>
                            </div>
                          </div>
                        </div>
                        <div className="block sm:hidden text-center pt-1">{t('history:match')} 4</div>
                      </td>
                      <td className="md:px-6 px-1 py-2 whitespace-nowrap dark:text-white text-black text-center hidden sm:block">
                        3
                      </td>
                      <td className="md:px-6 px-1 py-2 whitespace-nowrap text-right dark:text-[#0DFDE4] text-[#f39717] pr-[10px]">
                        đ{' '}
                        {Number(10000.4455).toLocaleString('en-US', {
                          style: 'decimal',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end items-end mr-5 gap-5">
              <div className="flex items-center gap-3">
                <span className="font-normal text-[10px] 2xl:text-sm text-[#95989C]">{t('history:total')} 23</span>
                <div className="flex gap-3 text-[13px] 2xl:text-base text-[#95989C] cursor-pointer">
                  <span className="dark:text-white text-black font-bold">1</span>
                  <span>2</span>
                  <span>3</span>
                </div>
              </div>
              <div>
                <button className="dark:bg-[#212427] bg-[#f5f6fa] w-7 h-6 dark:hover:bg-blue-600 dark:text-white text-black font-bold py-1 px-2 rounded transition duration-300">
                  <i className="fi fi-rr-angle-small-left flex dark:text-white text-black items-center"></i>
                </button>
                <button className="dark:bg-[#212427] bg-[#f5f6fa] w-7 h-6 dark:hover:bg-blue-600 dark:text-white text-black font-bold py-1 px-2 rounded transition duration-300">
                  <i className="fi fi-rr-angle-small-right dark:text-[#4D545C] text-[#31373d] flex items-center"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-[50px] md:mb-[60px] relative">
          <div className="md:bg-[url('/img/banner-f-history.png')] bg-[url('/img/banner-f-history-mobile.png')] 2xl:h-[200px] md:h-[151px] h-[296px] bg-cover bg-no-repeat mb-6 md:mb-5 w-full"></div>
          <div className="absolute top-[14px] w-[291px] md:w-[412px] sm:w-[95%] left-5 2xl:left-10 2xl:top-7">
            <h2 className="capitalize font-bold text-base 2xl:text-lg mb-2.5">
              {t('history:sendLotteryTicketAsGift')}
            </h2>
            <p className="font-normal text-[11px] 2xl:text-sm mb-2.5">
              {t('history:inviteYourFriendsToWin')} ₫250,000,000.00 {t('history:jackpotByGenerating')}
            </p>
            <div className="flex items-center justify-center md:justify-start">
              <div
                role="button"
                className="bg-[#F61B4F] hover:opacity-[0.9] rounded-[5px] dark:text-white text-black text-[12px] sm:text-[14px] py-[10px] w-[141px] flex items-center justify-center"
              >
                {t('history:sendTicket')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

History.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default History;
