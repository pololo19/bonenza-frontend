export default function getErrorMessage(path: string, func: string, status: number, error: string, data: any) {
  let message = '';
  let externalData = {};
  // Authenticate - SignUpEmail
  if (path === 'auth' && func === 'signUpEmail') {
    switch (status) {
      case 409: // conflict
        message = 'authentication:signUpFailed';
        break;
      case 400:
        message = error === 'referralValid' ? 'authentication:referralIsNotExist' : 'authentication:loginEmailFailed';
        break;

      default:
        message = 'errors:internalServer';
        break;
    }
  }

  // Authenticate - SignUpPhone
  if (path === 'auth' && func === 'signUpPhone') {
    switch (status) {
      case 409:
        message = 'authentication:phoneTaken';
        break;
      case 400:
        message = error === 'referralValid' ? 'authentication:referralIsNotExist' : 'authentication:loginPhoneFailed';
        break;
      default:
        message = 'errors:internalServer';
        break;
    }
  }

  // Authenticate - SignIn
  if (path === 'auth' && func === 'signIn') {
    switch (status) {
      case 400:
        if (error === 'credentialMatch') {
          message = data === 'phone' ? 'authentication:loginPhoneFailed' : 'authentication:loginEmailFailed';
        } else if (error === 'tfa') {
          message = 'authentication:invalid2FA';
        } else if (error === 'account') {
          message = 'authentication:passwordNotSet';
        } else {
          message = data === 'phone' ? 'authentication:loginPhoneFailed' : 'authentication:loginEmailFailed';
        }

        break;
      case 404:
        message = 'authentication:userNotRegistered';
        externalData = { user: data };
        break;
      case 406:
        if (error === 'allowUser') {
          message = 'authentication:userNotAllow';
        }
        if (error === 'verifyPhone') {
          message = 'errors:verifyPhone';
        }
        if (error === 'verifyMail') {
          message = 'errors:verifyMail';
        }

        if (error == 'self-exclusive') {
          message = 'errors:selfExclusive';
        }

        break;

      default:
        message = 'errors:internalServer';
        break;
    }
  }

  // Authenticate - Verify
  if (path === 'auth' && func === 'verification') {
    switch (status) {
      case 400:
        if (error === 'match') {
          message = 'authentication:verificationCodeIsNotMatch';
        } else if (error === 'expired') {
          message = 'authentication:verificationCodeHasExpired';
        }
        break;
      case 302:
        message = 'authentication:verificationCodeWrong';
        break;

      default:
        message = 'errors:internalServer';
        break;
    }
  }

  // Wallet - Swap
  if (path === 'wallet' && func === 'swap') {
    switch (status) {
      case 400:
        if (error === 'Wallet: swap') {
          message = 'swap:notEnoughAmount';
        }
        break;

      default:
        message = 'swap:swapFailed';
        break;
    }
  }
  return { message, data: externalData };
}

export function getErrorMesssage1(errorType: string) {
  let message = '';
  switch (errorType) {
    case 'isNotExistUser':
      message = 'authentication:userNotAllow';
      break;
    case 'isNotExistMail':
      message = 'errors:notExistMail';
      break;
    case 'isNotExistPhone':
      message = 'errors:notExistPhone';
      break;
    case 'isNotExistMailOrPhone':
      message = 'errors:notExistMailOrPhone';
      break;
    case 'isNotMatchConfirmationPassword':
      message = 'errors:notMatchConfirmationPassword';
      break;
    case 'disabledAccount':
      message = 'errors:disabledAccount';
      break;
    case 'isNotValidToken':
      message = 'errors:notValidToken';
      break;
    case 'isExpiredToken':
      message = 'errors:expiredToken';
      break;
    case 'isRequiredMail':
      message = 'errors:requiredMail';
      break;
    case 'isExistMail':
      message = 'errors:existMail';
      break;
    case 'isExistPhone':
      message = 'errors:existPhone';
      break;
    case 'isValidReferral':
      message = 'errors:validReferral';
      break;
    case 'isNotPhoneVerified':
      message = 'errors:verifyPhone';
      break;
    case 'isNotMailVerified':
      message = 'errors:verifyMail';
      break;
    case 'isNotMatchededCredential':
      message = 'errors:notMatchedCredential';
      break;
    case 'isNotExistPassword':
      message = 'errors:notExistPassword';
      break;
    case 'isNotMatched2FA':
      message = 'errors:notMatched2FA';
      break;
    case 'isNotMatchedCurrentPassword':
      message = 'errors:notMatchedCurrentPassword';
      break;
    case 'sendGridError':
      message = 'errors:sendGridError';
      break;
    case 'twiloError':
      message = 'errors:twiloError';
      break;
    case 'isNotMatchedVerificationCode':
      message = 'errors:notMatchedVerificationCode';
      break;
    case 'isExpiredVerificationCode':
      message = 'errors:expiredVerficationCode';
      break;
    case 'isNotValidTgInfo':
      message = 'errors:notValidTgInfo';
      break;
    case 'isNotValidSelfExlusionTime':
      message = 'errors:notValidSelfExlusionTime';
      break;
    case 'internalServerError':
      message = 'errors:internalServer';
      break;
    case 'badRequest':
      message = 'errors:badRequest';
      break;
    case 'isNotAllowedAction':
      message = 'errors:notAllowedAction';

    default:
      message = 'errors:internalServer';
      break;
  }
  return message;
}
