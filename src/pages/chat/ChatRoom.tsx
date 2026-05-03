import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import "./ChatRoom.scss";

import { jwtDecode } from "jwt-decode";
import type { MessageResponse } from "../../types/chat/chat.type";
import { chatServices } from "../../services/chat/chat.service";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const ChatRoom: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [inputText, setInputText] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    // 1. Fetch tin nhắn cũ qua REST API
    const fetchOldMessages = async () => {
      try {
        const oldMessages = await chatServices.getMessages(
          conversationId,
          0,
          50,
        );
        // API thường trả về tin nhắn mới nhất trước (DESC), ta cần đảo ngược lại để hiển thị từ trên xuống
        setMessages(oldMessages.reverse());
      } catch (error) {
        console.error("Lỗi tải tin nhắn cũ:", error);
      }
    };
    fetchOldMessages();

    // 2. Khởi tạo WebSocket kết nối đến backend
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
        console.log("Đã kết nối STOMP/WebSocket");
        // Đăng ký nhận tin nhắn từ phòng chat này
        client.subscribe(`/topic/conversation/${conversationId}`, (message) => {
          const newMsg: MessageResponse = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMsg]);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate(); // Ngắt kết nối khi rời trang
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

    // Gửi tin nhắn qua STOMP
    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify({
        conversationId: conversationId,
        content: inputText,
      }),
    });

    setInputText("");
  };

  return (
    <div className="chat-room-container">
      <div className="chat-header">
        <h2>Phòng Chat Thực Tập / Việc Làm</h2>
        <p>Mã phòng: {conversationId}</p>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => {
          // 4. THAY ĐỔI LOGIC SO SÁNH: So sánh email của tin nhắn với email trong Token
          const isMe = msg.senderEmail === currentUserEmail;

          return (
            <div
              key={msg.id}
              className={`message-wrapper ${isMe ? "me" : "other"}`}
            >
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
          placeholder="Nhập tin nhắn..."
        />
        <button type="submit">Gửi</button>
      </form>
    </div>
  );
};

export default ChatRoom;
