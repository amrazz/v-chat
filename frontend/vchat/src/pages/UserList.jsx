import { LogOut, MoreVertical, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import useLogout from "./useLogout";
import { useNavigate } from "react-router-dom";
import useApi from "../useApi";

const UserList = ({ users, loggedinUser, onUserSelect }) => {
  const logout = useLogout();
  // const MEDIA_URL = 'http://localhost:8000'
  const MEDIA_URL = 'https://v-chat-j9d2.onrender.com'
  const navigate = useNavigate()
  const [search, setSearch] = useState("");
  const [more, setMore] = useState(false)

  console.log(`this is the logged in user ${JSON.stringify(loggedinUser)}`)
  

  const filteredUser = useMemo(() => {
    return users.filter((user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);

  return (
    <div className="w-[300px] bg-white border-r h-screen flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="pt-5 px-5 pb-2 text-2xl font-montserrat font-extrabold">
          Chat
        </div>
        <button
  onClick={() => setMore(!more)}
  className="cursor-pointer bg-white w-12 h-12 rounded-full border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center mr-5 mt-4"
>
  <img
    src={`${MEDIA_URL}${loggedinUser?.profile_img}`}
    alt="Profile"
    className="w-full h-full rounded-full object-cover"
  />
</button>
        {more && (
            <div className="absolute left-28 top-14 mt-2 w-40 bg-white shadow-lg rounded-lg z-10 overflow-hidden">
              <ul className="font-montserrat p-3 cursor-pointer">
                <li
                onClick={() => navigate("/edit-profile")}
                className="hover:bg-gray-200">Profile</li>
                <li
                onClick={logout}
                className="hover:bg-gray-200">Logout</li>
              </ul>

          </div>
        )}
      </div>

      <div className="w-full flex justify-center relative px-5 pb-5">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg w-full focus:outline-none py-1 px-3 pr-10 font-montserrat tracking-wider bg-gray-100"
        />
        <Search className="absolute right-7 top-2 cursor-pointer" size={17} />
      </div>

      <ul className="overflow-y-auto p-5 pb-5 space-y-3 flex-1">
        {filteredUser.map((user) => {
          const initials =
            (user.first_name?.[0] || "") + (user.last_name?.[0] || "");
          return (
            <li
              key={user.id}
              onClick={() => onUserSelect(user)}
              className="flex items-center gap-3 bg-white rounded-lg px-3 shadow-sm hover:bg-gray-200 transition cursor-pointer"
            >
              {user.profile_img ? (
                <div className="w-10 h-10 my-3 rounded-full overflow-hidden">
                  <img
                    src={user.profile_img}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-500 text-center text-white flex items-center justify-center my-3 text-sm font-montserrat tracking-wider">
                  {initials.toUpperCase()}
                </div>
              )}

              <div className="flex-1">
                <div className="font-montserrat font-semibold ">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {user.message}
                </div>
              </div>

              <div className="text-xs ">{user.time}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserList;
