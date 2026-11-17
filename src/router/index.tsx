import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import type { ReactNode } from "react"
import Register from "../pages/Register"
import Login from "../pages/Login"
import { Home } from "../pages/Home"
import  AllItem  from "../pages/AllItem"
import Chats from "../pages/Chats"
import MainLayout from "../components/layout/MainLayout"
import AddItem from "../pages/AddItem"
import ItemDetails from "../pages/ItemDetails"
import EditItem from "../pages/EditItem"
import MyProfile from "../pages/MyProfile"
import ForgotPassword from "../pages/ForgotPassword"
import AdminLayout from "../components/admin/AdminLayout"
import AdminDashboard from "../pages/admin/AdminDashboard"
import AdminUsers from "../pages/admin/AdminUsers"
import AdminItems from "../pages/admin/AdminItems"
import AdminReports from "../pages/admin/AdminReports"
import AdminSettings from "../pages/admin/AdminSettings"
import AdminModerationHistory from "../pages/admin/AdminModerationHistory";

type RequireAuthTypes = { children: ReactNode; roles?: string[] }

const RequireAuth = ({ children, roles }: RequireAuthTypes) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to={"/login"} replace />

  if (roles && !roles.some((role) => user?.roles?.includes(role))) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-sm text-slate-600">
          You do not have permission to view this page.
        </p>
      </div>
    )
  }
  return <>{children}</>
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Public & Main Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/all-items" element={<AllItem />} />
          <Route path="/items/:id" element={<ItemDetails />} />

          
          {/* Protected Routes */}
          <Route
            path="/chats"
            element={
              <RequireAuth>
                <Chats />
              </RequireAuth>
            }
          />

          <Route
            path="/add-item"
            element={
              <RequireAuth>
                <AddItem />
              </RequireAuth>
            }
          />


          <Route 
            path="/items/:id/edit" 
            element={
            <RequireAuth>
              <EditItem />
            </RequireAuth>
            } 
          />

          <Route 
            path="/my-profile" 
            element={
              <RequireAuth>
                <MyProfile />
              </RequireAuth>
            } 
          />
            
        </Route>

         {/* Admin Layout Routes */}
        <Route
          path="/admin"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="items" element={<AdminItems />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="moderation-history"element={<AdminModerationHistory />}/>
        </Route>

        <Route path="*" element={<Navigate to="/all-items" replace />} />
      </Routes>
    </BrowserRouter>
  )
}