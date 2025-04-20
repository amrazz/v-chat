import { LogOut, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import useLogout from "./useLogout";

const UserList = ({ users, onUserSelect }) => {
  const logout = useLogout();
  const [search, setSearch] = useState("");

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
          onClick={logout}
          className=" cursor-pointer bg-red-500 w-10 h-10 rounded-full text-white flex items-center justify-center mr-5 mt-4"
        >
          <LogOut size={20} />
        </button>
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
