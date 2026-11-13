/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from "react"
import { getMyDetails } from "../service/auth"

export interface User {
  id?: string
  _id?: string
  name: string
  email: string
  roles?: string[]
  avatar?: string
  approve?: boolean
}

export interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(() => {
    return Boolean(localStorage.getItem("ACCESS_TOKEN"))
  })

  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN")
    if (!token) {
      return
    }

    getMyDetails()
      .then((res) => {
        if (res.data?.data) {
          setUser(res.data.data)
        } else if (res.data) {
          setUser(res.data)
        } else {
          setUser(null)
        }
      })
      .catch((err) => {
        console.error(err)
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
