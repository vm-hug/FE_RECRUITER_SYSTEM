export interface ConversationResponse {
  id: string;
  candidateId?: string;
  candidateName?: string;
  recruiterId?: string;
  recruiterName?: string;
  lastMessageAt?: string;
  lastMessage?: string;
  unreadCount?: number;
}

export interface MessageResponse {
  id: string;
  senderId: string;
  conversationId: string;
  senderEmail: string;
  senderName: string;
  senderAvatar: string | null;
  content: string;
  timestamp: string;
  isRead: boolean;
}
