import api from "./api"
import type { AdItem } from "../components/common/ItemCard"

export const getAllItems = async (
  page: number = 1,
  limit: number = 50,
  category?: string
): Promise<{ data: AdItem[]; total?: number }> => {
  try {
    const res = await api.get("/items", {
      params: {
        page,
        limit,
        category: category && category !== "All" ? category : undefined
      }
    })
    const items: AdItem[] = res.data?.data || (Array.isArray(res.data) ? res.data : [])
    return {
      data: items,
      total: res.data?.total || items.length
    }
  } catch (err) {
    console.error("Error fetching items:", err)
    return { data: [], total: 0 }
  }
}

export const getPaidAds = async (
  page: number = 1,
  limit: number = 6,
  category?: string
): Promise<{ data: AdItem[]; total?: number }> => {
  try {
    const res = await api.get("/items/paid", {
      params: {
        page,
        limit,
        category: category && category !== "All" ? category : undefined
      }
    })
    const items: AdItem[] = res.data?.data || (Array.isArray(res.data) ? res.data : [])
    return {
      data: items,
      total: res.data?.total || items.length
    }
  } catch {
    try {
      const res = await api.get("/items", {
        params: {
          page,
          limit,
          category: category && category !== "All" ? category : undefined,
          isPaid: true
        }
      })
      const items: AdItem[] = res.data?.data || (Array.isArray(res.data) ? res.data : [])
      const paidOnly = items.filter((item) => item.isPaid || item.type?.toLowerCase().includes("paid"))
      return {
        data: paidOnly,
        total: paidOnly.length
      }
    } catch (err) {
      console.error("Error fetching paid ads:", err)
      return { data: [], total: 0 }
    }
  }
}
