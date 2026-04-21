// < -- ENTITIES -- >

import {string} from "slate";

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: 'USER' | 'ADMIN'
  isVerified: boolean
  createdAt: string
}

type StockStatus = 'IN_STOCK' | 'OUT_OF_STOCK';

export interface TranslatedStrings { en: string; ru?: string; et?: string; }


// < ------------- ENTITIES ------------- >

export interface Category {
  id: string;
  name: TranslatedStrings;
  slug: string;
  image?: string;
  createdAt: string;
}
export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Russian", flag: "🇷🇺" },
  { code: "et", label: "Estonian", flag: "🇪🇪" },
];

export type Locale = "en" | "ru" | "et";

export interface Tag {
  id: string;
  name: TranslatedStrings;
  createdAt: string;
}

export interface Product {
  id: string;
  brand: string;
  name: TranslatedStrings;
  slug: string;
  shortDescription: TranslatedStrings;
  description: TranslatedStrings;
  price: number;
  salePrice: number | null;
  stockStatus: StockStatus;
  images: string[];
  thumbnails: string[];
  category: Category;
  tags: string[];
}

// < -- HELPERS -- >

export type Tab = 'profile' | 'dashboard' | 'orders' | 'logout';

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  type: AlertType,
  message: string
}


export interface MediaImage {
  filename: string
  url: string
  size: number
  createdAt: string
}

export interface CartItem {
  id: string
  cartId: string
  productId: string
  product: Product
  quantity: number
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
}

export interface Order {
  id: string;

  userId: string;
  status: OrderStatus;

  totalAmount: number;

  // payment
  mkTransactionId?: string | null;
  mkPaymentMethod?: string | null;

  // delivery
  deliveryMethod?: string | null;
  deliveryPrice?: number | null;

  // customer info
  contactInfo?: OrderContactInfo | null;

  createdAt: string;

  items: OrderItem[];
}

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;

  productId: string;
  product?: Product; // optional → sometimes backend won’t include full product

  name: string;      // snapshot (important!)
  price: number;     // snapshot price
  quantity: number;
}

export interface OrderContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  note?: string;
}



export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "image" | "pdf" | "video" | "other";
  size: number; // bytes
  width?: number;
  height?: number;
  uploadedAt: Date;
  altText: string;
  title: string;
  caption: string;
  description: string;
}

