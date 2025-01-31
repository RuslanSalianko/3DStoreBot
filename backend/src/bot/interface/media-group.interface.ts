export interface IMediaGroup {
  caption: string;
  messages: {
    messageId: number;
    chatId: number;
  }[];
}
