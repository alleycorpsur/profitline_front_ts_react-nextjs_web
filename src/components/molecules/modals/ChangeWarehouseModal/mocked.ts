import { InventoriesByWarehouse, WarehouseProductsStock } from "./ChangeWarehouseModal";

// Mock data for InventoriesByWarehouse
export const inventoriesByWarehouseMock: InventoriesByWarehouse[] = [
  { id: 1, warehouseName: "Main Warehouse", stockAvailable: true },
  { id: 2, warehouseName: "Secondary Warehouse", stockAvailable: false },
  { id: 3, warehouseName: "East Warehouse", stockAvailable: true },
  { id: 4, warehouseName: "West Warehouse", stockAvailable: false },
  { id: 5, warehouseName: "North Warehouse", stockAvailable: true }
];

// Mock data for WarehouseProductsStock
export const warehouseProductsStockMock: WarehouseProductsStock[] = [
  { id: 1, productName: "Product A", orderQuantity: 50, stock: 100 },
  { id: 2, productName: "Product B", orderQuantity: 30, stock: 20 },
  { id: 3, productName: "Product C", orderQuantity: 10, stock: 5 },
  { id: 4, productName: "Product D", orderQuantity: 100, stock: 200 },
  { id: 5, productName: "Product E", orderQuantity: 5, stock: 50 }
];
