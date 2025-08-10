import {
  Info,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";

const ChatBox = ({
  messages,
  currentUser,
  onSendMessage,
  loggedinUser,
  onBack,
}) => {
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const handleEmoji = (emoji) => {
    setInput((prev) => prev + emoji.emoji);
  };

  const togglePickEmoji = () => {
    setShowEmoji((prev) => !prev);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      {currentUser ? (
        <>
          <div className="bg-gradient-to-r from-red-600 to-rose-600 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="md:hidden text-white font-semibold mr-2"
                  >
                    ←
                  </button>
                )}

                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 overflow-hidden flex items-center justify-center">
                    {currentUser?.profile_img ? (
                      <img
                        src={currentUser.profile_img}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white font-semibold text-sm">
                        {`${currentUser?.first_name?.[0]?.toUpperCase() || ""}${
                          currentUser?.last_name?.[0]?.toUpperCase() || ""
                        }`}
                      </div>
                    )}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      currentUser?.is_online ? "bg-green-400" : "bg-gray-400"
                    }`}
                  ></div>
                </div>

                <div className="text-white">
                  <h3 className="font-semibold text-lg">
                    {currentUser?.first_name} {currentUser?.last_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        currentUser?.is_online ? "bg-green-400" : "bg-gray-300"
                      }`}
                    ></div>
                    <p className="text-sm text-red-100">
                      {currentUser?.is_online
                        ? "Active now"
                        : "Last seen recently"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200">
                  <Phone className="text-white" size={18} />
                </button>
                <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200">
                  <Video className="text-white" size={18} />
                </button>
                <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200">
                  <Info className="text-white" size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            <div className="p-6 space-y-4 max-h-[calc(100vh-220px)]">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <Send className="text-red-500" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Start the conversation
                  </h3>
                  <p className="text-gray-500">
                    Send a message to {currentUser?.first_name} to get started
                  </p>
                </div>
              ) : (
                messages.map((message, i) => {
                  const isSender = message.sender === loggedinUser?.id;
                  const showAvatar =
                    i === 0 || messages[i - 1]?.sender !== message.sender;

                  return (
                    <div
                      key={i}
                      className={`flex gap-3 ${
                        isSender ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 flex-shrink-0 ${
                          showAvatar ? "" : "invisible"
                        }`}
                      >
                        {!isSender && (
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            {currentUser?.profile_img ? (
                              <img
                                src={currentUser.profile_img}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white text-xs font-semibold">
                                {`${
                                  currentUser?.first_name?.[0]?.toUpperCase() ||
                                  ""
                                }${
                                  currentUser?.last_name?.[0]?.toUpperCase() ||
                                  ""
                                }`}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div
                        className={`flex flex-col max-w-[70%] ${
                          isSender ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm relative ${
                            isSender
                              ? "bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-br-xs"
                              : "bg-white text-gray-800 border border-gray-200 rounded-bl-xs"
                          }`}
                        >
                          <p className="text-sm leading-relaxed break-words">
                            {message.message}
                          </p>
                        </div>

                        <span className="text-xs text-gray-500 mt-1 px-2">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    {currentUser?.profile_img ? (
                      <img
                        src={currentUser.profile_img}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white text-xs font-semibold">
                        {`${currentUser?.first_name?.[0]?.toUpperCase() || ""}${
                          currentUser?.last_name?.[0]?.toUpperCase() || ""
                        }`}
                      </div>
                    )}
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
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

              <div ref={messagesEndRef}></div>
            </div>
          </div>

          <div className="bg-white border-t border-gray-200 p-4 relative">
            <div className="flex items-end gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 focus-within:border-red-300 focus-within:ring-1 focus-within:ring-red-300 transition-all duration-200">
              <button
                onClick={togglePickEmoji}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors duration-200 rounded-full hover:bg-red-50"
              >
                <Smile size={20} />
              </button>

              {showEmoji && (
                <div className="absolute bottom-16  z-10">
                  <Picker onEmojiClick={handleEmoji} />
                </div>
              )}
              <input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !showEmoji) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 bg-transparent focus:outline-none resize-none text-lg text-gray-700 placeholder-gray-500 "
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
              <div className="flex items-center gap-2">
                <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors duration-200 rounded-full hover:bg-red-50">
                  <Paperclip size={18} />
                </button>
                <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors duration-200 rounded-full hover:bg-red-50">
                  <Mic size={18} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                    input.trim()
                      ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center max-w-md px-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="text-red-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Welcome to Messages
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Select a conversation from the sidebar to start chatting with your
              contacts.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Secure messaging</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Real-time delivery</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
