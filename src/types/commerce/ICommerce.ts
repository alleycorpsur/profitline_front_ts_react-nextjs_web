export interface IEcommerceClient {
  client_id: number;
  client_name: string;
}

export interface IProductData {
  category_id: number;
  category: string;
  products: IProduct[];
}

export interface IProduct {
  id: number;
  SKU: string;
  description: string;
  image: string;
  id_line: number;
  id_category: number;
  taxes: number;
  kit: number;
  locked: number;
  is_available: number;
  EAN: string;
  project_id: number;
  price: number;
  line_name: string;
  category_name: string;
}

export interface ISelectedProduct {
  id: number;
  name: string;
  price: number;
  discount: number | undefined;
  discount_percentage: number | undefined;
  quantity: number;
  image: string;
  category_id: number;
  SKU: string;
  stock: boolean;
}

export interface IFetchedCategories {
  category: string;
  products: ISelectedProduct[];
}

export interface IConfirmOrderData {
  discount_package_id: number | undefined;
  order_summary: {
    product_sku: string;
    quantity: number;
  }[];
}

export interface IProductInDetail {
  id: number;
  product_sku: string;
  product_name: string;
  quantity: number;
  price: number;
  taxes: number;
  image: string;
  id_category: number;
  discount: number;
  discount_percentage: number;
}
export interface DiscountApplied {
  id: number;
  discount: number;
  description: string;
  discount_name: string;
}

export interface PrimaryDiscount {
  product_id: number;
  product_sku: string;
  description: string;
  price: number;
  unit_discount: number;
  discount_applied: DiscountApplied;
}

export interface Discount {
  subtotalDiscount: number;
  primary: PrimaryDiscount;
}
export interface DiscountItem {
  product_sku: string;
  quantity: number;
  price: number;
  taxes: number;
  image: string;
  category_id: number;
  line_id: number;
  product_id: number;
  description: string;
  discount: Discount;
}
export interface DiscountOrder {
  discountId: number;
  discount: number;
}
export interface OrderDiscount {
  totalDiscount: number;
  discountOrder: DiscountOrder[];
  discountItems: DiscountItem[];
}

export interface IOrderConfirmedResponse {
  discount_package_id: number;
  products?: IProductInDetail[];
  subtotal: number;
  taxes: number;
  discounts: OrderDiscount;
  total: number;
  total_pronto_pago: number;
  insufficientStockProducts: string[];
}

export interface IShippingInformation {
  address: string;
  city: string;
  dispatch_address: string;
  email: string;
  phone_number: string;
  comments: string;
}

export interface ICreateOrderData {
  shipping_information: IShippingInformation;
  order_summary: IOrderConfirmedResponse;
}

export interface ICommerceAdresses {
  address: string;
  city: string;
  email: string;
  id: number;
}

export interface ISingleOrder {
  id: number;
  client_id: number;
  project_id: number;
  city: string;
  contacto: string;
  total: number;
  total_pronto_pago: number;
  order_status: string;
  detail: IDetailOrder;
  shipping_info: IShippingInformation;
  created_by: number;
  order_date: string;
  created_at: string;
  updated_at: string;
  is_deleted: number;
  is_draft: number;
  client_name: string;
}

interface IDetailOrder {
  products: ICategories[];
  subtotal: number;
  discounts: number;
  discount_id: number;
  taxes: number;
  total_pronto_pago: number;
  total: number;
  discount_name: string;
}

export interface ICategories {
  id_category: number;
  category: string;
  products: IProductInDetail[];
}

export interface IOrderData {
  color: string;
  status: string;
  count: number;
  orders: IOrder[];
}

export interface IOrder {
  order_status: string;
  rgb: string;
  id: number;
  order_date: string;
  city: string;
  contacto: string;
  total: number;
  total_pronto_pago: number;
  client_name: string;
}

export interface IDiscount {
  id: number;
  discount_name: string;
  description: string;
  id_client: number;
  discount_type_id: number;
}

export interface IDiscountPackageAvailable {
  id: number;
  name: string;
  description: string;
}
