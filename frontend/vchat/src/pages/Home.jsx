import React, { useEffect, useRef, useState } from "react";
import UserList from "./UserList";
import Chatbox from "./ChatBox";
import useApi from "../useApi";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

const Home = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL.replace(/^https?:\/\//, "");
  const [selectedUser, setSelectedUser] = useState(null);
  const { user: loggedinUser, access_token } = useSelector(
    (state) => state.auth
  );
  const socket = useRef(null);
  const api = useApi();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("users/list/");
        const loggedInUserRes = await api.get("users/me/");
        if (response.status === 200 && loggedInUserRes.status === 200) {
          setUsers(response.data);
          setUser(loggedInUserRes.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const userListResponse = await api.get(
          `users/messages/${selectedUser.id}/`
        );

        if (userListResponse.status === 200) {
          setMessage(userListResponse.data);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser || socket.current?.readyState === WebSocket.OPEN) return;

    // const wsUrl = `ws://${baseUrl}/ws/chat/${selectedUser.id}/?token=${access_token}`;
    const wsUrl = `wss://${baseUrl}/ws/chat/${selectedUser.id}/?token=${access_token}`;

    socket.current = new WebSocket(wsUrl);

    socket.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
    
      setMessage((prev) => [...prev, data]);
      setUsers((prevUsers = []) => {
        const updatedUsers = prevUsers.map((user) => {
          if (user.id === data.sender || user.id === data.receiver) {
            return {
              ...user,
              last_message: data.message,
              last_message_time: data.timestamp, 
            };
          }
          return user;
        });
    
        updatedUsers.sort((a, b) => {
          const aTime = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
          const bTime = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
          return bTime - aTime;
        });
    
        return updatedUsers;
      });
    };

    socket.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [selectedUser]);

  const sendMessage = async (msg) => {
    try {
      if (socket.current && msg.trim()) {
        const payload = {
          message: msg,
          sender: loggedinUser.id,
          receiver: selectedUser.id,
        };

        socket.current.send(JSON.stringify(payload));
      }
    } catch (error) {
      toast.error("Failed to send message");
      console.log("Send message error : ", error);
    }
  };
  return (
    <div className="flex">
      <ToastContainer />

      <UserList
        users={users}
        loggedinUser={user}
        onUserSelect={setSelectedUser}
        selectedUser={selectedUser}
      />
      <Chatbox
        messages={message}
        currentUser={selectedUser}
        onSendMessage={sendMessage}
        loggedinUser={loggedinUser}
      />
    </div>
  );
};

export default Home;
