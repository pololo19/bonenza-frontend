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
        } else if (error === 'tfa') message = 'authentication:invalid2FA';
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
