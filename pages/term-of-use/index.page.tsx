import BaseLayout from '@/components/layouts/base.layout';
import Head from 'next/head';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

const Term = () => {
  const { t } = useTranslation('');
  const listProhibitedActivities = [
    t('termOfUse:prohibitedActivities2'),
    t('termOfUse:prohibitedActivities3'),
    t('termOfUse:prohibitedActivities4'),
    t('termOfUse:prohibitedActivities5'),
    t('termOfUse:prohibitedActivities6'),
    t('termOfUse:prohibitedActivities7'),
    t('termOfUse:prohibitedActivities8'),
    t('termOfUse:prohibitedActivities9'),
    t('termOfUse:prohibitedActivities10'),
    t('termOfUse:prohibitedActivities11'),
    t('termOfUse:prohibitedActivities12'),
    t('termOfUse:prohibitedActivities13'),
    t('termOfUse:prohibitedActivities14'),
    t('termOfUse:prohibitedActivities15'),
    t('termOfUse:prohibitedActivities16'),
    t('termOfUse:prohibitedActivities17'),
    t('termOfUse:prohibitedActivities18'),
    t('termOfUse:prohibitedActivities19'),
    t('termOfUse:prohibitedActivities20'),
    t('termOfUse:prohibitedActivities21'),
    t('termOfUse:prohibitedActivities22'),
    t('termOfUse:prohibitedActivities23'),
    t('termOfUse:prohibitedActivities24'),
    t('termOfUse:prohibitedActivities25'),
    t('termOfUse:prohibitedActivities26'),
  ];

  const listIntellectualProperty = [
    t('termOfUse:intellectualProperty4'),
    t('termOfUse:intellectualProperty5'),
    t('termOfUse:intellectualProperty6'),
  ];

  const listUserRepresentation = [
    t('termOfUse:userRepresentation2'),
    t('termOfUse:userRepresentation3'),
    t('termOfUse:userRepresentation4'),
  ];

  const listFeeAndPayment1 = [
    t('termOfUse:feeAndPayment1'),
    t('termOfUse:feeAndPayment2'),
    t('termOfUse:feeAndPayment3'),
    t('termOfUse:feeAndPayment4'),
  ];

  const listArbitrationInformal = [
    t('termOfUse:bindingArbitration2'),
    t('termOfUse:bindingArbitration3'),
    t('termOfUse:exceptionsInformal'),
    t('termOfUse:exceptionsInformal1'),
  ];

  const listLimitationLiability = [
    t('termOfUse:limitationLiability1'),
    t('termOfUse:limitationLiability2'),
    t('termOfUse:limitationLiability3'),
    t('termOfUse:limitationLiability4'),
  ];

  const listAssumptionRisk = [
    t('termOfUse:assumptionRisk1'),
    t('termOfUse:assumptionRisk2'),
    t('termOfUse:assumptionRisk3'),
    t('termOfUse:assumptionRisk4'),
    t('termOfUse:assumptionRisk5'),
    t('termOfUse:assumptionRisk6'),
    t('termOfUse:assumptionRisk7'),
  ];
  const listDisclaimers = [t('termOfUse:disclaimers2'), t('termOfUse:disclaimers3'), t('termOfUse:disclaimers4')];
  return (
    <div>
      <Head>
        <title>Term Of Use - Bonenza</title>
      </Head>
      <div className="bg-[url('/img/page/bg-home-image.png')] bg-no-repeat bg-cover flex justify-center pt-[100px] pb-[50px] md:pb-[100px]">
        <div className="bg-[#000f21] w-[1240px] px-[25px] md:px-[60px] pt-[25px] md:pt-[30px] pb-[50px] md:pb-[100px] text-[white] ">
          <div className=" text-[28px] font-bold flex justify-center">{t('termOfUse:termsOfUse')}</div>
          <div
            className="pt-[20px]  text-[16px] pb-[10px] "
            dangerouslySetInnerHTML={{ __html: t('termOfUse:termsOfUse1') }}
          ></div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:termsOfUse2')}</div>
          <div
            className="  text-[16px] pb-[10px] "
            dangerouslySetInnerHTML={{ __html: t('termOfUse:termsOfUse3') }}
          ></div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:termsOfUse4')}</div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:termsOfUse5')}</div>
          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:intellectualProperty')}</div>
          <div
            className="  text-[16px] pb-[10px] "
            dangerouslySetInnerHTML={{ __html: t('termOfUse:intellectualProperty1') }}
          ></div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:intellectualProperty2')}</div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:intellectualProperty3')}</div>
          <div className="w-full">
            <div className="bg-[black]  pl-[30px] md:pl-[50px] pr-[10px] md:pr-[30px] py-[24px]  ">
              <ul className=" ">
                {listIntellectualProperty.map((item, index) => {
                  return <li key={index}>{item}</li>;
                })}
              </ul>
            </div>
          </div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:intellectualProperty7')}</div>

          {/* second */}
          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:userRepresentation')}</div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:userRepresentation1')}</div>
          <div className="w-full">
            <div className="bg-[black]  pl-[30px] md:pl-[50px] pr-[10px] md:pr-[30px] py-[24px]  ">
              <ul className=" ">
                {listUserRepresentation.map((item, index) => {
                  return <li key={index}>{item}</li>;
                })}
              </ul>
            </div>
          </div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:userRepresentation5')}</div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:userRepresentation6')}</div>

          {/* third */}

          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:userRegistration')}</div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:userRegistration1')}</div>

          {/* four  */}

          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:prohibitedActivities')}</div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:prohibitedActivities1')}</div>
          <div className="w-full">
            <div className="bg-[black]  pl-[30px] md:pl-[50px] pr-[10px] md:pr-[30px] py-[24px]  ">
              <ul className=" ">
                {listProhibitedActivities.map((item, index) => {
                  return <li key={index}>{item}</li>;
                })}
              </ul>
            </div>
          </div>

          {/* five */}

          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:feeAndPayment')}</div>
          {listFeeAndPayment1.map((item, index) => {
            return (
              <div className="  text-[16px] pb-[10px] " key={index}>
                {item}
              </div>
            );
          })}
          {/* six */}

          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:submission')}</div>
          <div
            className="  text-[16px] pb-[10px] "
            dangerouslySetInnerHTML={{ __html: t('termOfUse:submission1') }}
          ></div>

          {/* seven */}

          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:thirdParty')}</div>
          <div
            className="  text-[16px] pb-[10px] "
            dangerouslySetInnerHTML={{ __html: t('termOfUse:thirdParty1') }}
          ></div>

          {/* eight */}

          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:advertise')}</div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:advertise1')}</div>

          {/* nine */}

          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:termination')}</div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:termination1')}</div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:termination2')}</div>

          {/* ten */}

          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:governingLaw')}</div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:governingLaw2')}</div>

          {/* eleven */}

          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:disputeResolution')}</div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:informalNegotiations')}</div>
          <div
            className="  text-[16px] pb-[10px] "
            dangerouslySetInnerHTML={{ __html: t('termOfUse:informalNegotiations1') }}
          ></div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:bindingArbitration')}</div>
          <div
            className="  text-[16px] pb-[10px] "
            dangerouslySetInnerHTML={{ __html: t('termOfUse:bindingArbitration1') }}
          ></div>
          {listArbitrationInformal.map((item, index) => {
            return (
              <div className="  text-[16px] pb-[10px] " key={index}>
                {item}
              </div>
            );
          })}

          {/* twelve */}

          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:disclaimers')}</div>
          <div
            className="  text-[16px] pb-[10px] "
            dangerouslySetInnerHTML={{ __html: t('termOfUse:disclaimers1') }}
          ></div>
          {listDisclaimers.map((item, index) => {
            return (
              <div className="  text-[16px] pb-[10px] " key={index}>
                {item}
              </div>
            );
          })}

          {/* thirteen */}

          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:limitationLiability')}</div>
          {listLimitationLiability.map((item, index) => {
            return (
              <div className="  text-[16px] pb-[10px] " key={index}>
                {item}
              </div>
            );
          })}

          {/* fourteen */}

          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:assumptionRisk')}</div>
          {listAssumptionRisk.map((item, index) => {
            return (
              <div className="  text-[16px] pb-[10px] " key={index}>
                {item}
              </div>
            );
          })}

          {/* fifteen */}

          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:indemnification')}</div>
          <div
            className="  text-[16px] pb-[10px] "
            dangerouslySetInnerHTML={{ __html: t('termOfUse:indemnification1') }}
          ></div>

          {/* sixteen */}

          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:userData')}</div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:userData1')}</div>

          {/* seventeen */}

          <div className="text-[20px] pb-[10px] pt-[40px] font-semibold ">{t('termOfUse:miscellaneous')}</div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:miscellaneous1')}</div>
          <div className="  text-[16px] pb-[10px] ">{t('termOfUse:miscellaneous2')}</div>
        </div>
      </div>
    </div>
  );
};

Term.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default Term;
