import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { Mail, Phone, MapPin, Calendar, Edit2, LogOut, Trash2, X, User as UserIcon } from "lucide-react";

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
        const res = await axios.get("/api/user/alluser", {
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

  const logoutHandler = async (user) => {
    try {
      const res = await axios.post(
        `/api/user/logout`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res.data.success) {
        toast.success(`${user.firstName} has been logged out`);
        if (currentUser._id === user._id) {
          dispatch(setUser(null));
          localStorage.removeItem("accessToken");
        }
      }
    } catch (error) {
        console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

 const handleDeleteAccount = async (user) => {
  if (!window.confirm(`Are you sure you want to delete ${user.firstName}'s account?`)) return;

  try {
    const res = await fetch(`/api/user/deleteuser/${user._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`, // <-- add this!
      },
    });

    if (!res.ok) {
      throw new Error("Unauthorized or failed to delete account");
    }

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
    console.error("Delete account error:", error);
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

      const res = await axios.put(`/api/user/updateuser/${userId}`, formData, {
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
        console.error("Update profile error:", error);  
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading user directory...</p>
      </div>
    );
  }

  if (error) return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-red-100 shadow-2xl rounded-2xl text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <X size={32} />
      </div>
      <h3 className="text-xl font-bold text-gray-900">Connection Error</h3>
      <p className="text-gray-500 mt-2">{error}</p>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2">
            <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase">Administration</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">User Directory</h2>
            <p className="text-slate-500 max-w-md">Comprehensive overview and management of all registered team members and administrative accounts.</p>
          </div>
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex items-center">
             <div className="px-5 py-2">
               <span className="block text-xs text-slate-400 uppercase font-bold">Total Personnel</span>
               <span className="text-2xl font-bold text-indigo-600">{users.length}</span>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden transition-all">
          <div className="overflow-x-auto">
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
                          <img className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white shadow-md group-hover:scale-105 transition-transform" src={user.profilePic || "https://ui-avatars.com/api/?name="+user.firstName} alt="" />
                          <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${user.role === 'admin' ? 'bg-purple-500' : 'bg-emerald-500'}`}></div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</div>
                          <div className="flex items-center text-xs text-slate-400 mt-0.5">
                            <Mail size={12} className="mr-1" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-sm text-slate-600 font-medium">
                        <Phone size={14} className="mr-2 text-slate-300" /> {user.phoneNo || "Not provided"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="mt-0.5 text-slate-300" />
                        <div>
                          <div className="text-sm font-semibold text-slate-700">{user.city || "N/A"}</div>
                          <div className="text-[11px] text-slate-400 leading-tight">{user.address} , {user.zipCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center text-sm text-slate-500">
                         <Calendar size={14} className="mr-2 text-slate-300" />
                         {new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleEditClick(user)} 
                        className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Edit Profile</h3>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">User ID: {userId}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-colors">
                   <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">First Name</label>
                    <input type="text" name="firstName" value={updateUser.firstName || ""} onChange={handleChange} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 px-4 py-2.5 rounded-xl transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">Last Name</label>
                    <input type="text" name="lastName" value={updateUser.lastName || ""} onChange={handleChange} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 px-4 py-2.5 rounded-xl transition-all" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
                    <input type="email" name="email" value={updateUser.email || ""} onChange={handleChange} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 px-4 py-2.5 rounded-xl transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">Phone Number</label>
                    <input type="text" name="phoneNo" value={updateUser.phoneNo || ""} onChange={handleChange} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 px-4 py-2.5 rounded-xl transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">Role</label>
                    <select name="role" value={updateUser.role || ""} onChange={handleChange} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 px-4 py-2.5 rounded-xl transition-all">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Avatar Update</label>
                    <input type="file" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
                  <div className="flex gap-3">
                    <button type="button" onClick={() => logoutHandler(updateUser)} className="flex items-center px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-xl text-sm font-bold transition-colors">
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                    <button type="button" onClick={() => handleDeleteAccount(updateUser)} className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-colors">
                      <Trash2 size={16} className="mr-2" /> Delete
                    </button>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all text-sm disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
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