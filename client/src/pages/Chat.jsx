import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Send,
  Paperclip,
  Bot,
  User,
  Settings,
  Plus,
  MessageSquare,
  Trash2,
  MoreVertical,
} from "lucide-react";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatSessions, setChatSessions] = useState([
    {
      id: "1",
      title: "🧠 MindMesh Chat",
      lastMessage: "Start a new conversation",
      timestamp: new Date(),
      history: [],
    },
  ]);
  const [activeChatId, setActiveChatId] = useState("1");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const userId = "user123";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    // Load chat history for active session
    const activeSession = chatSessions.find(
      (session) => session.id === activeChatId
    );
    if (activeSession) {
      setChatHistory(activeSession.history);
    }
  }, [activeChatId, chatSessions]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createNewChat = () => {
    const newChatId = generateId();
    const newSession = {
      id: newChatId,
      title: "New Chat",
      lastMessage: "Start a new conversation",
      timestamp: new Date(),
      history: [],
    };
    setChatSessions([newSession, ...chatSessions]);
    setActiveChatId(newChatId);
    setChatHistory([]);
  };

  const updateChatSession = (sessionId, newMessage, title) => {
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              title: title || session.title,
              lastMessage: newMessage.message,
              timestamp: new Date(),
              history: [...session.history, newMessage],
            }
          : session
      )
    );
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;

    const userMessage = {
      id: generateId(),
      role: "user",
      message: message.trim(),
      timestamp: new Date(),
    };

    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);

    // Update session with user message
    updateChatSession(
      activeChatId,
      userMessage,
      chatSessions.find((s) => s.id === activeChatId)?.title === "New Chat"
        ? message.slice(0, 30) + (message.length > 30 ? "..." : "")
        : undefined
    );

    setMessage("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        userId,
        message: message.trim(),
      });

      const agentMessage = {
        id: generateId(),
        role: "agent",
        message: res.data.reply || "No response",
        timestamp: new Date(),
      };

      const updatedHistory = [...newChatHistory, agentMessage];
      setChatHistory(updatedHistory);

      // Update session with agent message
      updateChatSession(activeChatId, agentMessage);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = {
        id: generateId(),
        role: "agent",
        message:
          "⚠️ Agent failed to respond. Please check your connection and try again.",
        timestamp: new Date(),
      };

      const updatedHistory = [...newChatHistory, errorMessage];
      setChatHistory(updatedHistory);

      // Update session with error message
      updateChatSession(activeChatId, errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const deleteChat = (chatId) => {
    setChatSessions((prev) => prev.filter((session) => session.id !== chatId));
    if (activeChatId === chatId) {
      const remainingSessions = chatSessions.filter(
        (session) => session.id !== chatId
      );
      if (remainingSessions.length > 0) {
        setActiveChatId(remainingSessions[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const switchChat = (chatId) => {
    setActiveChatId(chatId);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 bg-gray-900 text-white flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Plus size={18} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  activeChatId === session.id
                    ? "bg-gray-700"
                    : "hover:bg-gray-800"
                }`}
                onClick={() => switchChat(session.id)}
              >
                <MessageSquare size={16} className="text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {session.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {session.lastMessage}
                  </p>
                </div>
                {chatSessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{userId}</p>
              <p className="text-xs text-gray-400">Connected</p>
            </div>
            <MoreVertical size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MessageSquare size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🧠</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  MindMesh Chat
                </h1>
                <p className="text-sm text-gray-500">
                  AI-powered conversations
                </p>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {chatHistory.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome to MindMesh
                </h3>
                <p className="text-gray-500">
                  Start a conversation with your AI assistant
                </p>
              </div>
            )}

            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "agent" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] lg:max-w-[60%] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200"
                  } rounded-2xl px-4 py-3 shadow-sm`}
                >
                  <p
                    className={`text-sm leading-relaxed ${
                      msg.role === "user" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {msg.message}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      msg.role === "user" ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={sendMessage} className="relative">
              <div className="flex items-end gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Paperclip size={18} />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 bg-transparent border-0 outline-none resize-none text-gray-900 placeholder-gray-500 text-sm leading-relaxed py-2"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isTyping}
                />

                <button
                  type="submit"
                  disabled={!message.trim() || isTyping}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 mt-3 text-center">
              MindMesh AI can make mistakes. Consider checking important
              information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
