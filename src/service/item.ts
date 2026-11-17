
import api from "./api";
import type { AdItem } from "../components/common/ItemCard";

interface BackendItem {
  _id: string;
  itemName: string;
  description: string;
  category: string;
  location: string;
  dateFound: string;
  additionalDetails?: string;
  imageUrl: string;
  userId: string | { _id: string };
  status?: "LOST" | "FOUND";
  isPaid?: boolean;
  isResolved?: boolean;
}

const mapItem = (item: BackendItem): AdItem => ({
  id: item._id,
  itemName: item.itemName,
  description: item.description,
  category: item.category,
  location: item.location,
  dateFound: item.dateFound,
  additionalDetails: item.additionalDetails,
  imageUrl: item.imageUrl,
  userId:
    typeof item.userId === "string"
      ? item.userId
      : item.userId._id,
  status: item.status,
  isPaid: item.isPaid,
  isResolved: item.isResolved ?? false
});

// Get all items with search and category filters
export const getAllItems = async (
  page: number = 1,
  limit: number = 50,
  category?: string,
  search?: string
): Promise<{ data: AdItem[]; total: number }> => {
  try {
    const res = await api.get("/items", {
      params: {
        page,
        limit,
        category:
          category && category !== "All"
            ? category
            : undefined,
        search: search?.trim() || undefined
      }
    });

    const backendItems: BackendItem[] =
      res.data?.data || [];

    const items = backendItems.map(mapItem);

    return {
      data: items,
      total: res.data?.total || 0
    };
  } catch (err) {
    console.error("Error fetching items:", err);
    return { data: [], total: 0 };
  }
};

// Get paid advertisements
export const getPaidAds = async (
  page: number = 1,
  limit: number = 6,
  category?: string
): Promise<{ data: AdItem[]; total: number }> => {
  try {
    const res = await api.get("/items", {
      params: {
        page,
        limit,
        category:
          category && category !== "All"
            ? category
            : undefined
      }
    });

    const backendItems: BackendItem[] =
      res.data?.data || [];

    const paidItems = backendItems
      .filter((item) => item.isPaid)
      .map(mapItem);

    return {
      data: paidItems,
      total: paidItems.length
    };
  } catch (err) {
    console.error("Error fetching paid ads:", err);
    return { data: [], total: 0 };
  }
};

// Mark item as resolved
export const markItemAsResolved = async (id: string) => {
  const res = await api.patch(`/items/${id}/resolve`);
  return res.data;
};
