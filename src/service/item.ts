
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
  isPaid: item.isPaid
});

export const getAllItems = async (
  page: number = 1,
  limit: number = 50,
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

    const items = backendItems.map(mapItem);

    return {
      data: items,
      total: res.data?.total || items.length
    };
  } catch (err) {
    console.error("Error fetching items:", err);
    return { data: [], total: 0 };
  }
};

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
