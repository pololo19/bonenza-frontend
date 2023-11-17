import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ModalState } from '@/base/types/reducer-states';
import { AuthenticationModeEnum } from '@/base/types/common';
import { MultiLanguageTabEnum } from '@/components/modal/multiLanguage/MultiLanguage';

const initialCommonState: ModalState = {
  isShowInformation: false,
  isShowReferAndEarn: false,
  isShowDepositModal: false,
  isShowAuthenticationModal: false,
  isShowForgotPassModal: false,
  isShowUpdateInformation: false,
  isShowUpdateAvatar: false,
  isShowCropAvatar: false,
  isShowMultiLanguage: false,
  authenticationType: AuthenticationModeEnum.SIGN_IN,
  multiLanguageTab: MultiLanguageTabEnum.LANGUAGE,
  selectedAvatar: '',
  showChatType: false,
  isToggleSidebar: true,
  showFullChat: false,
  isShowVipClubModal: false,
  isShowVipLevelModal: false,
  isShowCryptoOnlineModal: false,
  isShowResetPassword: false,
  isShowDetailBets: false,
  isShowCasinoSearch: false,
  isShowRakeBackModal: false,
  isShowRakeBackDetailModal: false,
  isShowModalBonusHistory: false,
};

export const queryDataSlice = createSlice({
  name: 'auth',
  initialState: initialCommonState,
  reducers: {
    changeIsShowInformation: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowInformation = action.payload;
    },
    changeIsShowCasinoSearch: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowCasinoSearch = action.payload;
    },
    changeIsShowReferAndEarn: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowReferAndEarn = action.payload;
    },
    changeIsShowDepositModal: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowDepositModal = action.payload;
    },
    changeIsShowUpdateInformation: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowUpdateInformation = action.payload;
    },
    changeIsShowUpdateAvatar: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowUpdateAvatar = action.payload;
    },
    changeIsShowCropAvatar: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowCropAvatar = action.payload;
    },
    changeIsShowMultiLanguageModal: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowMultiLanguage = action.payload;
    },
    changeIsShowAuthenticationModal: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowAuthenticationModal = action.payload;
    },
    changeAuthenticationType: (state: ModalState, action: PayloadAction<AuthenticationModeEnum>) => {
      state.authenticationType = action.payload;
    },
    changeMultiLanguageTab: (state: ModalState, action: PayloadAction<MultiLanguageTabEnum>) => {
      state.multiLanguageTab = action.payload;
    },
    changeIsShowForgotPassModal: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowForgotPassModal = action.payload;
    },
    changeSelectedAvatar: (state: ModalState, action: PayloadAction<string>) => {
      state.selectedAvatar = action.payload;
    },
    changeShowChatType: (state: ModalState, action: PayloadAction<boolean>) => {
      state.showChatType = action.payload;
    },
    changeToggleSidebar: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isToggleSidebar = action.payload;
    },
    changeShowFullChat: (state: ModalState, action: PayloadAction<boolean>) => {
      state.showFullChat = action.payload;
    },
    changeIsShowVipClubModal: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowVipClubModal = action.payload;
    },
    changeIsShowVipLevelModal: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowVipLevelModal = action.payload;
    },
    changeIsShowCryptoOnlineModal: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowCryptoOnlineModal = action.payload;
    },
    changeIsShowResetPassword: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowResetPassword = action.payload;
    },
    changeIsShowDetailBets: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowDetailBets = action.payload;
    },
    changeIsShowRakeBack: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowRakeBackModal = action.payload;
    },
    changeIsShowRakeBackDetail: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowRakeBackDetailModal = action.payload;
    },
    changeIsShowBonusHistory: (state: ModalState, action: PayloadAction<boolean>) => {
      state.isShowModalBonusHistory = action.payload;
    },
  },
});

export const {
  changeToggleSidebar,
  changeMultiLanguageTab,
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowForgotPassModal,
  changeIsShowInformation,
  changeIsShowReferAndEarn,
  changeIsShowUpdateInformation,
  changeIsShowCropAvatar,
  changeSelectedAvatar,
  changeIsShowMultiLanguageModal,
  changeShowChatType,
  changeShowFullChat,
  changeIsShowDepositModal,
  changeIsShowVipClubModal,
  changeIsShowVipLevelModal,
  changeIsShowCryptoOnlineModal,
  changeIsShowUpdateAvatar,
  changeIsShowResetPassword,
  changeIsShowDetailBets,
  changeIsShowCasinoSearch,
  changeIsShowRakeBack,
  changeIsShowRakeBackDetail,
  changeIsShowBonusHistory,
} = queryDataSlice.actions;
export default queryDataSlice.reducer;
