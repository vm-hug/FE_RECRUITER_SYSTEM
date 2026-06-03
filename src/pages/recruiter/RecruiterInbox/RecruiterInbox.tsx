import React, { useEffect, useState, useRef, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { jwtDecode } from "jwt-decode";
import { FiMessageSquare, FiSend, FiUser } from "react-icons/fi";

import "./RecruiterInbox.scss";
import type {
  ConversationResponse,
  MessageResponse,
} from "../../../types/chat/chat.type";
import { chatServices } from "../../../services/chat/chat.service";
import { getImageUrl } from "../../../helper/loadImage.util";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const RecruiterInbox: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationResponse[]>(
    [],
  );
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");

  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [inputText, setInputText] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Hàm lấy danh sách cuộc hội thoại
  const fetchConversations = useCallback(async () => {
    try {
      const data = await chatServices.getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Lỗi tải danh sách chat:", error);
    }
  }, []);

  // 2. Lấy Email và load danh sách lần đầu
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken?.sub) setCurrentUserEmail(decodedToken.sub);
    }
    fetchConversations();
  }, [fetchConversations]);

  // 3. KHỞI TẠO WEBSOCKET GLOBALLY
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || !currentUserEmail) return;

    const socket = new SockJS(`${API_BASE_URL}/ws?token=${token}`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log("STOMP: ", str),
      onConnect: () => {
        const inboxTopic = `/topic/user/${currentUserEmail.toLowerCase()}/inbox`;

        client.subscribe(inboxTopic, (msg) => {
          fetchConversations();

          const newMsg: MessageResponse = JSON.parse(msg.body);

          setActiveConvId((currentActive) => {
            if (currentActive === newMsg.conversationId) {
              setMessages((prev) => {
                if (prev.find((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });

              client.publish({
                destination: "/app/chat.markAsRead",
                body: JSON.stringify({ conversationId: newMsg.conversationId }),
              });
            }
            return currentActive;
          });
        });
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [currentUserEmail, fetchConversations]);

  // 4. KHI CLICK CHỌN MỘT PHÒNG CHAT
  useEffect(() => {
    if (!activeConvId || !stompClient || !stompClient.connected) return;

    const fetchOldMessages = async () => {
      try {
        const oldMsgs = await chatServices.getMessages(activeConvId, 0, 50);
        setMessages(oldMsgs.reverse());
      } catch (error) {
        console.error("Lỗi tải tin nhắn:", error);
      }
    };
    fetchOldMessages();

    const subscription = stompClient.subscribe(
      `/topic/conversation/${activeConvId}`,
      (msg) => {
        const newMsg: MessageResponse = JSON.parse(msg.body);
        setMessages((prev) => {
          if (prev.find((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      },
    );

    stompClient.publish({
      destination: "/app/chat.markAsRead",
      body: JSON.stringify({ conversationId: activeConvId }),
    });

    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, unreadCount: 0 } : c)),
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [activeConvId, stompClient]);

  // Cuộn xuống cuối
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 5. GỬI TIN NHẮN
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      inputText.trim() === "" ||
      !stompClient ||
      !stompClient.connected ||
      !activeConvId
    )
      return;

    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify({
        conversationId: activeConvId,
        content: inputText,
      }),
    });
    setInputText("");
  };

  // Trích xuất thông tin cuộc hội thoại đang được chọn để hiển thị Header
  const activeConversationInfo = conversations.find(
    (c) => c.id === activeConvId,
  );

  return (
    <div className="inbox-container">
      {/* CỘT TRÁI: DANH SÁCH CUỘC HỘI THOẠI */}
      <div className="inbox-sidebar">
        <div className="sidebar-header">
          <h2>Hộp thư ứng viên</h2>
        </div>
        <div className="conversation-list">
          {conversations.length === 0 ? (
            <div className="empty-state">Chưa có tin nhắn nào</div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${activeConvId === conv.id ? "active" : ""}`}
                onClick={() => setActiveConvId(conv.id)}
              >
                <div className="avatar">
                  {/* Có thể tích hợp ảnh ứng viên ở đây nếu API có trả về candidateAvatar */}
                  <FiUser size={20} />
                  {(conv.unreadCount ?? 0) > 0 && (
                    <span className="unread-badge">{conv.unreadCount}</span>
                  )}
                </div>
                <div className="conv-info">
                  <div className="conv-name">
                    {conv.candidateName || "Ứng viên ẩn danh"}
                  </div>
                  <div className="conv-last-msg">
                    {conv.lastMessage || "Chưa có tin nhắn..."}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CỘT PHẢI: KHUNG CHAT CHI TIẾT */}
      <div className="inbox-main">
        {!activeConvId ? (
          <div className="no-chat-selected">
            <div className="icon-wrapper">
              <FiMessageSquare size={48} />
            </div>
            <p>Chọn một cuộc hội thoại để bắt đầu trò chuyện</p>
          </div>
        ) : (
          <>
            {/* Header khung chat động */}
            <div className="chat-header">
              <div className="header-info">
                <h3>{activeConversationInfo?.candidateName || "Ứng viên"}</h3>
                <div className="status-indicator">
                  <span className="dot"></span>
                  <span className="text">Đang hoạt động</span>
                </div>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg) => {
                const isMe = msg.senderEmail === currentUserEmail;
                return (
                  <div
                    key={msg.id}
                    className={`message-wrapper ${isMe ? "me" : "other"}`}
                  >
                    {/* BỔ SUNG AVATAR CỦA ỨNG VIÊN BÊN TRÁI */}
                    {!isMe && (
                      <div className="message-avatar">
                        {msg.senderAvatar ? (
                          <img
                            src={getImageUrl(msg.senderAvatar)}
                            alt={msg.senderName}
                          />
                        ) : (
                          <div className="avatar-fallback">
                            {msg.senderName?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                    )}

                    <div className={`message-bubble ${isMe ? "me" : "other"}`}>
                      {!isMe && (
                        <div className="message-sender">{msg.senderName}</div>
                      )}
                      <div className="message-content">{msg.content}</div>
                      <div className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập câu trả lời..."
              />
              <button type="submit" disabled={!inputText.trim()}>
                <FiSend size={18} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RecruiterInbox;
