import { toast } from 'react-toastify';

import { TOAST_ENUM } from '@/base/constants/common';
import { useAppDispatch } from '@/base/redux/store';
import { changeIsShowAddressConfirm } from '@/base/redux/reducers/modal.reducer';

export function copyClipBoard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    // text area method
    let textArea = document.createElement('textarea');
    textArea.value = text;
    // make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  }
  toast.success('Copied', { containerId: TOAST_ENUM.COMMON, toastId: 'copy-clipboard-notification' });
}
