import { DiscountPackage } from "@/types/discount/DiscountPackage";

export const mockDiscountPackages: DiscountPackage[] = [
  {
    id: 1,
    project_id: 101,
    name: "Spring Sale Package",
    definitions: "Get up to 50% off on selected products",
    start_date: "2024-03-01",
    end_date: "2024-03-31",
    id_client: null, // Puede ser un ID o null si no está relacionado con un cliente específico
    status: 1 // 1: activo, 0: inactivo
  },
  {
    id: 2,
    project_id: 102,
    name: "Holiday Bundle",
    definitions: "Special discount package for the holiday season",
    start_date: "2024-12-15",
    end_date: "2025-01-05",
    id_client: "C12345", // Ejemplo de un ID de cliente
    status: 1
  },
  {
    id: 3,
    project_id: 101,
    name: "Summer Deals",
    definitions: "Up to 30% discount on all summer collection items",
    start_date: "2024-06-01",
    end_date: "2024-08-31",
    id_client: null,
    status: 0
  },
  {
    id: 4,
    project_id: 103,
    name: "Black Friday Special",
    definitions: "Exclusive Black Friday discounts for all customers",
    start_date: "2024-11-28",
    end_date: "2024-11-29",
    id_client: "C98765",
    status: 1
  },
  {
    id: 5,
    project_id: 102,
    name: "New Year Offers",
    definitions: "New Year discounts on all products with up to 40% off",
    start_date: "2024-12-31",
    end_date: "2025-01-10",
    id_client: null,
    status: 1
  }
];
