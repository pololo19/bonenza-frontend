import {
  API_USER_PROFILE_GET_PROFILE,
  API_USER_PROFILE_UPLOAD_AVATAR,
  API_USER_SESSION_DELETE_SESSION,
  API_USER_SESSION_LIST_SESSIONS,
  API_USER_SETTING_EMAIL_AND_PHONE_VERIFY,
  API_USER_SETTING_GENERAL_SETTING,
  API_USER_SETTING_PRIVACY_SETTING,
  API_USER_SETTING_UPDATE,
} from 'constants/endpoints';
import { API_USER_PROFILE_EDIT_PROFILE } from 'constants/endpoints';

import { UserSettingGeneralType, UserSettingPrivacyType, UserSettingVerifiedType } from '@/base/types/common';

import api from '../api';

export const api_getProfile = async (userId: string) => {
  return api.get(API_USER_PROFILE_GET_PROFILE, { params: { userId } });
};

export const api_editUserName = async (userName: string) => {
  return api.post(API_USER_PROFILE_EDIT_PROFILE, { username: userName });
};

export const api_uploadAvatar = async (formData: any) => {
  return api.post(API_USER_PROFILE_UPLOAD_AVATAR, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const api_getGeneralSetting = async () => {
  return api.get(API_USER_SETTING_GENERAL_SETTING);
};

export const api_getPrivacySetting = async () => {
  return api.get(API_USER_SETTING_PRIVACY_SETTING);
};

export const api_getVerifySetting = async () => {
  return api.get(API_USER_SETTING_EMAIL_AND_PHONE_VERIFY);
};

export const api_updateSetting = async (
  data: UserSettingGeneralType | UserSettingPrivacyType | UserSettingVerifiedType,
) => {
  return api.put(API_USER_SETTING_UPDATE, data);
};

export const api_getSessions = async () => {
  return api.get(API_USER_SESSION_LIST_SESSIONS);
};

export const api_deleteSession = async (userSessionId: string) => {
  return api.delete(API_USER_SESSION_DELETE_SESSION, { params: { userSessionId } });
};
