import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  MessageSquare,
  Home,
  Plus,
  LayoutGrid,
  User as UserIcon,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getUnreadMessageCount } from "../../service/chat";
import { getPublicSettings } from "../../service/publicSettings";

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
  /** Unread chat count shown on the Chat button. Wire this to real data. */
  unreadChats?: number;
}

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

export default function Header({
  currentPage,
  setCurrentPage,
  currentUser,
}: HeaderProps) {
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, loading } = useAuth();

  const activeUser = currentUser || user;

  const isCurrentAllItems = currentPage ? currentPage === 'allItems' : location.pathname === '/all-items';
  const isCurrentChats = currentPage ? currentPage === 'chats' : location.pathname === '/chats';
  const isCurrentAddItem = currentPage ? currentPage === 'addItem' : location.pathname === '/add-item';

  const [platformName, setPlatformName] = useState("Foundit");

  const [platformDescription, setPlatformDescription] = useState("Lost & Found");

  useEffect(() => {
    // Don't request unread messages if user is not logged in
    if (!activeUser) {
        setUnreadMessageCount(0);
        return;
    }

    const fetchUnreadCount = async () => {
            try {
                const count = await getUnreadMessageCount();
                setUnreadMessageCount(count);
            } catch (error) {
                console.error("Failed to get unread message count:", error);
            }
        };

        fetchUnreadCount();

        const interval = setInterval(fetchUnreadCount, 10000);

        return () => clearInterval(interval);
    }, [activeUser]);

  // Close profile menu on outside click / Escape
  useEffect(() => {
    if (!isProfileOpen) return;
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isProfileOpen]);

  const closeMenus = () => {
    setIsProfileOpen(false);
    setIsMobileOpen(false);
  };

  const handleNavigateHome = () => {
    closeMenus();
    if (setCurrentPage) setCurrentPage('home');
    else navigate('/');
  };

  const handleNavigateAddItem = () => {
    closeMenus();
    if (setCurrentPage) setCurrentPage('addItem');
    else navigate('/add-item');
  };

  const handleNavigateAllItems = () => {
    closeMenus();
    if (setCurrentPage) setCurrentPage('allItems');
    else navigate('/all-items');
  };

  const handleToggleChats = () => {
    closeMenus();
    if (setCurrentPage) setCurrentPage(isCurrentChats ? 'home' : 'chats');
    else navigate(isCurrentChats ? '/' : '/chats');
  };

  const handleLogin = () => {
    closeMenus();
    navigate('/login');
  };

  const handleLogout = () => {
    closeMenus();
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('REFRESH_TOKEN');
    setUser(null);
    navigate('/login');
  };

  const pill = (active: boolean) =>
    `inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all ${
      active
        ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
    }`;

  const chatBtn = `relative inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full text-white shadow-sm shadow-emerald-200 transition-all ${
    isCurrentChats ? 'bg-emerald-900 hover:bg-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700'
  }`;

  const chatContent = isCurrentChats ? (
    <>
      <Home size={16} />
      <span>Home</span>
    </>
  ) : (
    <>
      <MessageSquare size={16} />
      <span>Chat</span>
      {unreadMessageCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-amber-400 text-emerald-950 text-[10px] rounded-full flex items-center justify-center font-bold ring-2 ring-white">
          {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
        </span>
      )}
    </>
  );

  useEffect(() => {
      const fetchPublicSettings = async () => {
          try {
              const response = await getPublicSettings();

              setPlatformName(response.data.platformName);
              setPlatformDescription(response.data.description);

          } catch (error) {
              console.error("Failed to load platform settings:", error);
          }
      };

      fetchPublicSettings();
  }, []);

  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <button
              type="button"
              onClick={handleNavigateHome}
              className="group flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left"
              aria-label={`${platformName} home`}
          >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-200">
                  <Compass
                      size={22}
                      className="stroke-[2.25] transition-transform duration-500 group-hover:rotate-[135deg]"
                  />
              </div>

              <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tight text-emerald-950 leading-none">
                      {platformName}
                  </span>

                  <span className="text-[10px] font-semibold tracking-wider text-emerald-700/60 uppercase">
                      {platformDescription}
                  </span>
              </div>
          </button>


          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button onClick={handleNavigateAddItem} className={pill(isCurrentAddItem)}>
              <Plus size={16} /> Add Item
            </button>
            <button onClick={handleNavigateAllItems} className={pill(isCurrentAllItems)}>
              <LayoutGrid size={16} /> All Items
            </button>
            <button onClick={handleToggleChats} className={`${chatBtn} ml-1`}>
              {chatContent}
            </button>
          </nav>

          {/* Right side: auth + mobile toggle */}
          <div className="flex items-center gap-2">
            {!loading && !activeUser && (
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-sm font-semibold rounded-full bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-all"
              >
                Log In
              </button>
            )}

            {!loading && activeUser && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={isProfileOpen}
                  className="flex items-center gap-2.5 p-1 pr-2.5 rounded-full border border-emerald-200 hover:border-emerald-300 bg-white hover:bg-emerald-50 transition-all"
                >
                  <img
                    src={activeUser.avatar || DEFAULT_AVATAR}
                    alt={activeUser.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-200"
                  />
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {activeUser.name || 'User'}
                    </span>
                    <span className="text-[10px] text-slate-500">Profile &amp; Settings</span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-emerald-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isProfileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-emerald-900/10 border border-emerald-100 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-emerald-100 bg-emerald-50/70 rounded-t-2xl">
                      <p className="text-sm font-bold text-slate-900">{activeUser.name || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{activeUser.email || ''}</p>
                    </div>

                    <div className="py-1">
                      <button
                        role="menuitem"
                        onClick={() => {
                          closeMenus();
                          navigate('/my-profile');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5"
                      >
                        <UserIcon size={16} /> My Profile &amp; Posts
                      </button>

                      <button
                        role="menuitem"
                        onClick={() => {
                          closeMenus();
                          navigate('/notifications');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5"
                      >
                        <Bell size={16} />
                        Notifications &amp; Alerts
                      </button>

                      <button
                        role="menuitem"
                        onClick={() => {
                          closeMenus();
                          navigate('/settings');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5"
                      >
                        <Settings size={16} /> Settings &amp; Security
                      </button>
                    </div>

                    <div className="border-t border-emerald-100 pt-1 mt-1">
                      <button
                        role="menuitem"
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

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
              className="md:hidden p-2 rounded-full text-emerald-800 hover:bg-emerald-50 transition-colors"
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {isMobileOpen && (
          <nav className="md:hidden mt-3 pt-3 border-t border-emerald-100 flex flex-col gap-1.5">
            <button onClick={handleNavigateAddItem} className={`${pill(isCurrentAddItem)} w-full`}>
              <Plus size={16} /> Add Item
            </button>
            <button onClick={handleNavigateAllItems} className={`${pill(isCurrentAllItems)} w-full`}>
              <LayoutGrid size={16} /> All Items
            </button>
            <button onClick={handleToggleChats} className={`${chatBtn} w-full justify-center`}>
              {chatContent}
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
