export type ProductCategory =
  | 'All'
  | 'Dresses'
  | 'Earrings'
  | 'Necklaces'
  | 'Rings'
  | 'Hair Clips'
  | 'Bangles'
  | 'Chains'
  | 'Bracelets'
  | 'Hair Bands';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'One Size';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  description: string;
  details: string[];
  fabric: string;
  care: string;
  images: string[];
  featuredImage: string;
  sizes: Record<ProductSize, number>; // inventory count per size
  colors: ProductColor[];
  tags: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique key in cart: `${productId}-${selectedSize}-${selectedColor}`
  productId: string;
  product: Product;
  selectedSize: ProductSize;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 'credit_card' | 'upi' | 'cod';

export interface OrderItem {
  productId: string;
  name: string;
  size: ProductSize;
  color: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

export interface Order {
  id: string;
  userId?: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  promoCode?: string;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending';
  createdAt: string;
  trackingNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  token?: string;
  phone?: string;
  address?: string;
  city?: string;
  createdAt: string;
}

export interface ProductFilterState {
  category: ProductCategory;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  selectedSizes: ProductSize[];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  lowStockCount: number;
  recentOrders: Order[];
}
