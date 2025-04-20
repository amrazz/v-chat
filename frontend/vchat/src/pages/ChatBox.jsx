import { MoreVertical, Send, Smile } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import EditProfile from "./EditProfile";

const ChatBox = ({ messages, currentUser, onSendMessage, loggedinUser }) => {
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
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

  const toggleEditProfile = () => {
    setShowEditProfile((prev) => !prev);
  };

  return (
    <div className="flex flex-col flex-1">
      {currentUser ? (
        <>
          <div className="p-7 flex items-center justify-between border-b bg-red-500 font-montserrat font-semibold text-white">
            <div className="flex items-center gap-1">
              <div className="w-10 h-10 mr-4 rounded-full bg-white border overflow-hidden flex items-center justify-center shrink-0">
                {currentUser?.profile_img ? (
                  <img
                    src={currentUser.profile_img}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="font-montserrat text-black">
                    {`${currentUser?.first_name[0].toUpperCase()}${currentUser?.last_name[0].toUpperCase()}`}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span>
                  {currentUser?.first_name} {currentUser?.last_name}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      currentUser?.is_online ? "bg-green-400" : "bg-red-300"
                    }`}
                  ></div>
                  <p
                    className={`text-xs font-medium ${
                      currentUser?.is_online ? "text-green-400" : "text-red-200"
                    }`}
                  >
                    {currentUser?.is_online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>
            <button className="cursor-pointer" onClick={toggleEditProfile}>
              <MoreVertical />
            </button>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto p-5 space-y-4 max-h-[calc(100vh-164px)]">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-screen text-gray-400">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message, i) => {
                const isSender = message.sender === loggedinUser?.id;
                return (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      isSender ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg shadow w-fit max-w-[70%] break-words ${
                        isSender
                          ? "bg-red-500 text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      {message.message}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {showEditProfile && (
            <EditProfile
              loggedinUser={loggedinUser}
              onClose={toggleEditProfile}
            />
          )}

          <div className="p-2">
            <div className="flex items-center rounded-lg px-4 py-2 shadow-sm">
              <button
                onClick={togglePickEmoji}
                className="mr-2 text-gray-500 hover:text-gray-700 text-lg cursor-pointer"
              >
                🤣
              </button>

              {showEmoji && (
                <div className="absolute bottom-16  z-10">
                  <Picker onEmojiClick={handleEmoji} />
                </div>
              )}
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
                className="flex-1 bg-transparent focus:outline-none font-montserrat tracking-wider"
              />
              <button
                onClick={handleSend}
                className="ml-2 text-red-500 hover:text-red-600 cursor-pointer"
              >
                <Send size={24} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center flex-1 text-red-500 text-lg font-montserrat">
          SELECT A USER TO START CHATTING...
        </div>
      )}
    </div>
  );
};

export default ChatBox;
