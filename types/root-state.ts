import { AuthState, CommonState, LoadingState, ModalState } from '@/types/reducer-states';

type RootState = {
  auth: AuthState;
  modal: ModalState;
  loading: LoadingState;
  common: CommonState;
};
export type { RootState };
