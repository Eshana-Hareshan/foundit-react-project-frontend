import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, MessageSquare, Home, User as UserIcon, Bell, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

export interface CurrentUser {
  name?: string;
  email?: string;
  avatar?: string;
  roles?: string[];
}

interface HeaderProps {
  currentPage?: string;
  setCurrentPage?: (page: string) => void;
  currentUser?: CurrentUser | null;
}

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function Header({ currentPage, setCurrentPage, currentUser }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser ,loading} = useAuth();

  const activeUser = currentUser || user ;

  const isCurrentAllItems = currentPage ? currentPage === 'allItems' : location.pathname === '/all-items';
  const isCurrentChats = currentPage ? currentPage === 'chats' : location.pathname === '/chats';
  const isCurrentAddItem = currentPage? currentPage === 'addItem': location.pathname === '/add-item';

  const handleNavigateHome = () => {
    if (setCurrentPage) {
      setCurrentPage('home');
    } else {
      navigate('/');
    }
  };

  const handleNavigateAddItem = () => {
    if (setCurrentPage) {
      setCurrentPage('addItem');
    } else {
      navigate('/add-item');
    }
  };

  const handleNavigateAllItems = () => {
    if (setCurrentPage) {
      setCurrentPage('allItems');
    } else {
      navigate('/all-items');
    }
  };

  const handleToggleChats = () => {
    if (setCurrentPage) {
      setCurrentPage(isCurrentChats ? 'home' : 'chats');
    } else {
      navigate(isCurrentChats ? '/' : '/chats');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Section */}
          <div 
            onClick={handleNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Clock size={22} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                found<span className="text-indigo-600">it</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Lost & Found Portal
              </span>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-3">

            {/* Add Item Button */}
            <button
              onClick={handleNavigateAddItem}
              className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                isCurrentAddItem
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-300'
              }`}
            >
              + Add Item
            </button>
            
            {/* All Items Button (Navigates to dedicated page) */}
            <button 
              onClick={handleNavigateAllItems}
              className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                isCurrentAllItems
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-300'
              }`}
            >
              All Items
            </button>

            {/* Chat / Home Dynamic Toggle Button */}
            <button 
              onClick={handleToggleChats}
              className={`relative px-4 py-2 text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all ${
                isCurrentChats
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isCurrentChats ? (
                <>
                  <Home size={16} />
                  <span>Home</span>
                </>
              ) : (
                <>
                  <MessageSquare size={16} />
                  <span>Chat</span>
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    3
                  </span>
                </>
              )}
            </button>

            {/* Login Button / Profile Menu */}
            {!loading && !activeUser ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
              >
                Log In
              </button>
            ) : (
              !loading && activeUser && (
                <div className="relative">
                  {/* Profile & Settings Menu */}
                  {!loading && activeUser && (
                    <div className="relative">
                      <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 transition-all shadow-xs"
                      >
                        <img
                          src={activeUser.avatar || DEFAULT_AVATAR}
                          alt={activeUser.name || 'User'}
                          className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                        />

                        <div className="hidden md:flex flex-col text-left">
                          <span className="text-xs font-bold text-slate-800 leading-tight">
                            {activeUser.name || 'User'}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Profile & Settings
                          </span>
                        </div>

                        <ChevronDown size={14} className="text-slate-400" />
                      </button>

                      {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50">

                          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 rounded-t-2xl">
                            <p className="text-sm font-bold text-slate-900">
                              {activeUser.name || 'User'}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {activeUser.email || ''}
                            </p>
                          </div>

                          <div className="py-1">
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5">
                              <UserIcon size={16} /> My Profile & Posts
                            </button>

                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5">
                              <Bell size={16} /> Notifications & Alerts
                            </button>

                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5">
                              <Settings size={16} /> Settings & Security
                            </button>
                          </div>

                          <div className="border-t border-slate-100 pt-1 mt-1">
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                            >
                              <LogOut size={16} /> Log Out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )
            )}

            

          </div>
        </div>
      </div>
    </header>
  );
}
