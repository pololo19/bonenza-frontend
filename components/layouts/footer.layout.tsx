import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowReferAndEarn,
  changeIsShowVipClubModal,
} from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

import ModalBusinessContacts from '../modal/businessContacts/businessContacts';
import ModalVerifyRepresentative from '../modal/verifyRepresentative/verifyRepresentative';

export default function Footer({ isDetailPage }: { isDetailPage?: boolean }) {
  const { t } = useTranslation('');
  const [showModalContacts, setShowModalContacts] = useState<boolean>(false);
  const [showModalVerify, setShowModalVerify] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { showChatType, isLogin } = useSelector(
    (state: AppState) => ({
      showChatType: state.modal.showChatType,
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const openModalLogin = () => {
    dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
    dispatch(changeIsShowAuthenticationModal(true));
  };

  return (
    <>
      <footer
        className={cn('pt-5 h-fit bg-transparent', {
          block: !isDetailPage,
          'sm:block hidden': isDetailPage,
        })}
      >
        <div className="container mx-auto px-4">
          <div className="flex gap-[20px] md:gap-[55px] justify-center">
            <Link
              href={ROUTER.Tagname('slots')}
              className="text-[12px] font-bold text-color-light-text-primary dark:text-white hover:text-black dark:hover:text-white"
            >
              {String(t('footer:joinUs'))}
            </Link>
            <Link
              href={ROUTER.Tagname('slots')}
              className="text-[12px] font-bold text-color-light-text-primary dark:text-white hover:text-black dark:hover:text-white"
            >
              {String(t('footer:forum'))}
            </Link>
            <Link
              href={ROUTER.Tagname('slots')}
              className="text-[12px] font-bold text-color-light-text-primary dark:text-white hover:text-black dark:hover:text-white"
            >
              {String(t('footer:gambleAware'))}
            </Link>
            <Link
              href={ROUTER.Tagname('slots')}
              className="text-[12px] font-bold text-color-light-text-primary dark:text-white hover:text-black dark:hover:text-white"
            >
              {String(t('footer:news'))}
            </Link>
            <Link
              href={ROUTER.Tagname('slots')}
              className="text-[12px] font-bold text-color-light-text-primary dark:text-white hover:text-black dark:hover:text-white"
            >
              {String(t('footer:sportsBettingInsights'))}
            </Link>
          </div>
          <div className="flex gap-[25px] justify-center mt-[50px]">
            <Image
              alt=""
              src="/img/icon/twitter.png"
              width={30}
              height={30}
              className="w-[48px] h-[48px] cursor-pointer"
            />
            <Image
              alt=""
              src="/img/icon/discord.png"
              width={30}
              height={30}
              className="w-[48px] h-[48px] cursor-pointer"
            />
          </div>
          <div className="mb-[60px] sm:mb-0 mt-[50px] grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-0">
            <div className="flex flex-col gap-5 px-0 md:px-5 xl:px-20">
              <Image
                alt=""
                src="/img/logo-light.png"
                width={220}
                height={27}
                className="w-[220px] h-[44px] cursor-pointer"
              />
              <div className="text-default font-light">
                {String(t('footer:bonenzaDescription1'))}
              </div>
              <div className="flex flex-col gap-[10px] text-default font-light">
                <div className="flex gap-[5px]">
                  {String(t('footer:business'))}
                  <span className="text-color-text-mailto">
                    {String(t('footer:businessMail'))}
                  </span>
                </div>
                <div className="flex gap-[5px]">
                  {String(t('footer:help'))}
                  <span className="text-color-text-mailto">
                    {String(t('footer:helpMail'))}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 px-0 md:px-5 xl:px-20">
              <Image
                alt=""
                src="/img/footer/sprite.png"
                width={45}
                height={44}
                className="w-[45px] h-[44px] cursor-pointer"
              />
              <div className="text-default font-light">
                {String(t('footer:bonenzaDescription2'))}
              </div>
              <div className="flex gap-10">
                <Image
                  alt=""
                  src="/img/footer/sprite_1.png"
                  width={63}
                  height={33}
                  className="w-[63px] h-[33px] cursor-pointer"
                />
                <Image
                  alt=""
                  src="/img/footer/sprite_2.png"
                  width={35}
                  height={33}
                  className="w-[35px] h-[33px] cursor-pointer"
                />
                <Image
                  alt=""
                  src="/img/footer/sprite_3.png"
                  width={91}
                  height={33}
                  className="w-[91px] h-[33px] cursor-pointer"
                />
                <Image
                  alt=""
                  src="/img/footer/sprite_4.png"
                  width={32}
                  height={34}
                  className="w-[32px] h-[34px] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
      {showModalContacts && (
        <ModalBusinessContacts
          show={showModalContacts}
          onClose={() => {
            setShowModalContacts(false);
          }}
        />
      )}
      {showModalVerify && (
        <ModalVerifyRepresentative
          show={showModalVerify}
          onClose={() => {
            setShowModalVerify(false);
          }}
        />
      )}
    </>
  );
}
