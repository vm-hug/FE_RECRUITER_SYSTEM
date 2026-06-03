import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { jwtDecode } from "jwt-decode";

import "./ChatRoom.scss";
import type { MessageResponse } from "../../types/chat/chat.type";
import { chatServices } from "../../services/chat/chat.service";
import { getImageUrl } from "../../helper/loadImage.util";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const ChatRoom: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [inputText, setInputText] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lấy email từ token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        if (decodedToken && decodedToken.sub) {
          setCurrentUserEmail(decodedToken.sub);
        }
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
      }
    }
  }, []);

  // Tự động cuộn xuống cuối
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    // 1. Fetch tin nhắn cũ
    const fetchOldMessages = async () => {
      try {
        const oldMessages = await chatServices.getMessages(
          conversationId,
          0,
          50,
        );
        setMessages(oldMessages.reverse());
      } catch (error) {
        console.error("Lỗi tải tin nhắn cũ:", error);
      }
    };
    fetchOldMessages();

    // 2. Khởi tạo WebSocket
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Vui lòng đăng nhập để chat!");
      return;
    }

    const socket = new SockJS(`${API_BASE_URL}/ws?token=${token}`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        client.subscribe(`/topic/conversation/${conversationId}`, (message) => {
          const newMsg: MessageResponse = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMsg]);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [conversationId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      inputText.trim() === "" ||
      !stompClient ||
      !stompClient.connected ||
      !conversationId
    )
      return;

    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify({
        conversationId: conversationId,
        content: inputText,
      }),
    });

    setInputText("");
  };

  // Trích xuất tên nhà tuyển dụng từ mảng tin nhắn (người có email khác user hiện tại)
  const employerName =
    messages.find((m) => m.senderEmail !== currentUserEmail)?.senderName ||
    "Đang cập nhật...";

  return (
    <div className="chat-room-container">
      {/* HEADER MỚI */}
      <div className="chat-header">
        <div className="header-info">
          <h2>Phòng chat với Nhà tuyển dụng - {employerName}</h2>
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
              {/* AVATAR CHO NGƯỜI KHÁC (NHÀ TUYỂN DỤNG) */}
              {!isMe && (
                <div className="message-avatar">
                  {msg.senderAvatar ? (
                    <img
                      src={getImageUrl(msg.senderAvatar)}
                      alt={msg.senderName}
                    />
                  ) : (
                    <div className="avatar-fallback">
                      {msg.senderName?.charAt(0).toUpperCase()}
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
          placeholder="Viết câu trả lời..."
        />
        <button type="submit">
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
