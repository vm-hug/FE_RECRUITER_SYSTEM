import axiosClient from "../../api/axiosClient";
import type {
  ConversationResponse,
  MessageResponse,
} from "../../types/chat/chat.type";

export const chatServices = {
  createOrGetConversation: (
    recruiterId: string,
  ): Promise<ConversationResponse> => {
    return axiosClient.post(
      `/chat/conversations?recruiterId=${recruiterId}`,
    ) as Promise<ConversationResponse>;
  },

  getConversations: (): Promise<ConversationResponse[]> => {
    return axiosClient.get("/chat/conversations") as Promise<
      ConversationResponse[]
    >;
  },

  getMessages: (
    conversationId: string,
    page = 0,
    size = 20,
  ): Promise<MessageResponse[]> => {
    return axiosClient.get(`/chat/conversations/${conversationId}/messages`, {
      params: { page, size },
    }) as Promise<MessageResponse[]>;
  },
};
