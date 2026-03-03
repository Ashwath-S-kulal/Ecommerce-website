import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { Mail, Phone, MapPin, Calendar, Edit2, X, Trash2, User as UserIcon } from "lucide-react";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateUser, setUpdateUser] = useState({});
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState(null);

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!accessToken) {
        setError("You are not logged in or token is missing");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/user/alluser`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUsers(res.data.users);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [accessToken]);

  const handleDeleteAccount = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.firstName}'s account?`)) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/user/deleteuser/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized or failed to delete account");

      const data = await res.json();
      if (!data.success) {
        toast.error("Failed to delete account");
        return;
      }

      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      toast.success(`${user.firstName}'s account deleted successfully`);

      if (currentUser._id === user._id) {
        dispatch(setUser(null));
        localStorage.removeItem("accessToken");
      }

      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Error deleting account");
    }
  };

  const handleEditClick = (user) => {
    setUpdateUser(user);
    setUserId(user._id);
    setFile(null);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(updateUser).forEach(key => {
        if(updateUser[key] !== null) formData.append(key, updateUser[key]);
      });
      if (file) formData.append("file", file);

      const res = await axios.put(`${import.meta.env.VITE_BASE_URI}/api/user/updateuser/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? res.data.user : u))
        );
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f8fafc] min-h-screen pb-20 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 pt-10">
          <div className="h-10 w-48 bg-slate-200 rounded mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-red-100 shadow-2xl rounded-2xl text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><X size={32} /></div>
      <h3 className="text-xl font-bold text-gray-900">Connection Error</h3>
      <p className="text-gray-500 mt-2">{error}</p>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">User Directory</h2>
            <p className="text-slate-500 max-w-md mx-auto md:mx-0">Manage registered team members and administrative accounts.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center md:justify-start w-full md:w-auto">
             <div className="text-center md:text-left">
               <span className="block text-xs text-slate-400 uppercase font-bold">Total Personnel</span>
               <span className="text-2xl font-bold text-indigo-600">{users.length}</span>
             </div>
          </div>
        </div>

        <div className="bg-transparent md:bg-white md:rounded-2xl md:shadow-xl md:shadow-slate-200/50 md:border md:border-slate-200 overflow-hidden">
                    <div className="grid grid-cols-1 gap-4 md:hidden">
            {users.map((user) => (
              <div key={user._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <img className="h-14 w-14 rounded-2xl object-cover" src={user.profilePic || `https://ui-avatars.com/api/?name=${user.firstName}`} alt="" />
                    <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${user.role === 'admin' ? 'bg-purple-500' : 'bg-emerald-500'}`}></div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-bold text-slate-900 truncate">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-indigo-600 font-bold uppercase">{user.role}</div>
                  </div>
                  <button onClick={() => handleEditClick(user)} className="p-2 text-indigo-500 bg-indigo-50 rounded-xl"><Edit2 size={18} /></button>
                </div>
                
                <div className="space-y-3 border-t border-slate-50 pt-4 text-sm">
                  <div className="flex items-center text-slate-600"><Mail size={14} className="mr-3 text-slate-300" /> {user.email}</div>
                  <div className="flex items-center text-slate-600"><Phone size={14} className="mr-3 text-slate-300" /> {user.phoneNo || "N/A"}</div>
                  <div className="flex items-start text-slate-600"><MapPin size={14} className="mr-3 text-slate-300 mt-0.5" /> {user.city || "N/A"}, {user.zipCode}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  {["User Details", "Status & Role", "Contact Info", "Location", "Joined Date", ""].map((header) => (
                    <th key={header} className="px-6 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((user) => (
                  <tr key={user._id} className="group hover:bg-indigo-50/40 transition-all duration-300">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white shadow-md" src={user.profilePic || "https://ui-avatars.com/api/?name="+user.firstName} alt="" />
                          <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${user.role === 'admin' ? 'bg-purple-500' : 'bg-emerald-500'}`}></div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-slate-400 truncate max-w-[150px]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-slate-600 font-medium">{user.phoneNo || "N/A"}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-semibold text-slate-700">{user.city || "N/A"}</div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => handleEditClick(user)} className="p-2 text-indigo-400 hover:text-indigo-600 rounded-xl transition-all"><Edit2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden max-h-[95vh] flex flex-col animate-in fade-in zoom-in duration-200">
              <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Edit Profile</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">First Name</label>
                    <input type="text" name="firstName" value={updateUser.firstName || ""} onChange={handleChange} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 px-4 py-2.5 rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">Last Name</label>
                    <input type="text" name="lastName" value={updateUser.lastName || ""} onChange={handleChange} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 px-4 py-2.5 rounded-xl" />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
                    <input type="email" name="email" value={updateUser.email || ""} onChange={handleChange} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 px-4 py-2.5 rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">Phone Number</label>
                    <input type="text" name="phoneNo" value={updateUser.phoneNo || ""} onChange={handleChange} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 px-4 py-2.5 rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">Role</label>
                    <select name="role" value={updateUser.role || ""} onChange={handleChange} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 px-4 py-2.5 rounded-xl">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">Avatar Update</label>
                    <input type="file" onChange={handleFileChange} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 cursor-pointer" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => handleDeleteAccount(updateUser)} className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold">
                    <Trash2 size={16} className="mr-2" /> Delete Account
                  </button>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-1 sm:flex-none px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 text-sm disabled:opacity-50">
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;