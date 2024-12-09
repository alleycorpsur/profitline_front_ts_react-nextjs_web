import dayjs from "dayjs";
import { DiscountGetOne } from "@/types/discount/DiscountBasics";
import { DiscountSchema } from "../resolvers/generalResolver";

// eslint-disable-next-line no-unused-vars
export const mapDiscountGetOneToDiscountSchema: (discount: DiscountGetOne) => DiscountSchema = (
  discount: DiscountGetOne
) => {
  return {
    client: discount.id_client,
    client_name: discount.client_name,
    contract_archive: discount.contract_archive || "",
    description: discount.description,
    discount_type: discount.discount_type_id,
    name: discount.discount_name,
    products_category: discount.productsCategory?.map((e) => e.id_product) || [],
    min_order: discount.min_units_by_order,
    computation_type: discount.discount_computation,
    client_groups: discount.clientGroups?.map((e) => e.id_clientgroup) || [],
    discount: discount.discount,
    is_active: !discount.end_date,
    start_date: dayjs(discount.start_date) as any,
    end_date: discount.end_date ? (dayjs(discount.end_date) as any) : undefined,
    ranges:
      discount.ranges?.map((e) => {
        const [unitsMin, unitsMax] =
          discount.discount_type_id === 3
            ? [e.min_channel, e.min_units_by_channel]
            : [e.min_channel, e.min_units_by_order_by_sku];
        return {
          id: e.id,
          unitsMin: e.units_from || unitsMin,
          unitsMax: e.units_to || unitsMax,
          discount: e.discount
        };
      }) || [],
    annual_ranges:
      discount.contracts?.map((e) => ({
        id: e.id,
        idLine: e.id_line,
        units: e.units,
        idProduct: e.id_product,
        discount: e.discount
      })) || []
  };
};
