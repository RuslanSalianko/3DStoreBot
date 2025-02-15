import { create } from 'zustand';

import { EMessageType } from '@/models/message-type.enum';

export type MessageStore = {
  message: string;
  type: EMessageType;
  messageInfo: (message: string) => void;
  messageSuccess: (message: string) => void;
  messageError: (message: string) => void;
  messageWarning: (message: string) => void;
  clearMessage: () => void;
};

const defaultState = {
  message: '',
  type: EMessageType.info,
};

export const useMessage = create<MessageStore>((set) => ({
  ...defaultState,
  messageInfo: (message: string) => set({ message, type: EMessageType.info }),
  messageSuccess: (message: string) =>
    set({ message, type: EMessageType.success }),
  messageError: (message: string) => set({ message, type: EMessageType.error }),
  messageWarning: (message: string) =>
    set({ message, type: EMessageType.warning }),
  clearMessage: () => set({ ...defaultState }),
}));
