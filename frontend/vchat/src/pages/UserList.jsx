import {
  LogOut,
  MoreVertical,
  Search,
  User,
  MessageCircle,
  Settings,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import useLogout from "./useLogout";
import { useNavigate } from "react-router-dom";

const UserList = ({ users, loggedinUser, onUserSelect, selectedUser }) => {
  const logout = useLogout();
  import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [more, setMore] = useState(false);

  const filteredUser = useMemo(() => {
    return users
      .filter((user) => user.username !== "dell")
      .filter((user) =>
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [search, users]);
  return (
    <div className="w-[320px] bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 h-screen flex flex-col shadow-lg">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-rose-600 px-6 py-6 shadow-lg">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              {/* <MessageCircle className="text-white" size={22} /> */}
              <img src="/v.png" alt="" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide font-montserrat">
                V CHAT
              </h1>
            </div>
          </div>

          <div className="relative">
            <button onClick={() => setMore(!more)} className="relative group">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105">
                {loggedinUser?.profile_img ? (
                  <img
                    src={`${MEDIA_URL}${loggedinUser?.profile_img}`}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="text-white" size={20} />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </button>

            {more && (
              <div className="absolute right-0 top-14 mt-2 w-48 bg-white shadow-xl rounded-xl z-20 overflow-hidden border border-gray-100">
                <div className="py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">
                      {loggedinUser?.first_name} {loggedinUser?.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      @{loggedinUser?.username}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/edit-profile");
                      setMore(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                  >
                    <Settings size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Profile Settings
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMore(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors duration-200 flex items-center gap-3 border-t border-gray-100"
                  >
                    <LogOut size={16} className="text-red-600" />
                    <span className="text-sm font-medium text-red-600">
                      Sign Out
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-500"
          />
          <Search
            className="absolute right-4 top-3.5 text-gray-400"
            size={18}
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Recent Chats
          </h3>
        </div>

        <ul className="overflow-y-auto h-full px-2 py-2 space-y-1">
          {filteredUser.map((user) => {
            const initials =
              (user.first_name?.[0] || "") + (user.last_name?.[0] || "");
            return (
              <li
                key={user.id}
                onClick={() => {
                  onUserSelect(user);
                }}
                className={`group relative flex items-center gap-4 px-4 py-3 mx-2 rounded-xl hover:bg-red-50 transition-all hover:scale-105 duration-200 cursor-pointer ${
                  user.id === selectedUser?.id
                    ? "bg-red-100 border border-red-100"
                    : ""
                }`}
              >
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  {user.profile_img ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200">
                      <img
                        src={user.profile_img}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-gray-200">
                      {initials.toUpperCase()}
                    </div>
                  )}
                  {user.is_online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-800 truncate text-sm">
                      {user.first_name} {user.last_name}
                    </h4>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {user.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {user.message || "No messages yet"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default UserList;
