import { DiscountBasics } from "@/types/discount/DiscountBasics";
import { UseFormReturn } from "react-hook-form";
import * as yup from "yup";
import { ObjectSchema } from "yup";

const yesterday: any = (date: string) =>
  new Date(new Date(date).setDate(new Date(date).getDate() - 1));
const tomorrow = (date: string) => {
  return new Date(new Date(date).setDate(new Date(date).getDate() + 1));
};

const discountBasicsSchema = yup.object({
  id: yup.number().required(),
  project_id: yup.number().required(),
  discount_type_id: yup.number().required(),
  discount_type: yup.string().required(),
  discount_definition: yup.string().required(),
  client_name: yup.string().optional(),
  discount_name: yup.string().required(),
  description: yup.string().required(),
  start_date: yup.string().required(),
  end_date: yup.string().optional(),
  apply_others_discounts: yup.mixed().required(),
  priority: yup.mixed().required(),
  min_units_by_order: yup.number().required(),
  discount_computation: yup.number().required(),
  id_client: yup.mixed().required(),
  contract_archive: yup.mixed().required(),
  status: yup.number().required(),
  is_deleted: yup.number().required()
});

export const generalResolver: ObjectSchema<DiscountPackageSchema> = yup.object({
  name: yup
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre es requerido"),
  description: yup
    .string()
    .min(3, "La descripción debe tener al menos 3 caracteres")
    .required("La descripción es requerida"),
  start_date: yup
    .date()
    .required("La fecha de inicio es requerida")
    .min(yesterday(new Date() as any), "La fecha de inicio debe ser mayor o igual a hoy"),
  end_date: yup
    .date()
    .optional()
    .when("is_active", {
      is: (checkbox: boolean) => {
        return checkbox === false || checkbox === undefined;
      },
      then: () =>
        yup
          .date()
          .test({
            name: "min",
            message: "La fecha de fin debe ser mayor a la fecha de inicio",
            test: (end_date, context) =>
              new Date(end_date || "") >= tomorrow(context.parent.start_date)
          })
          .required("La fecha de fin es requerida"),
      otherwise: (a) => {
        return a.nullable().optional();
      }
    }),
  is_active: yup.boolean().optional(),
  discounts: yup.array().of(discountBasicsSchema).optional().default([]),
  additionalDiscounts: yup.array().of(discountBasicsSchema).optional().default([])
});

export interface DiscountPackageSchema {
  name: string;
  description: string;
  start_date?: Date | null | undefined;
  end_date?: Date | undefined;
  is_active?: boolean | undefined;
  discounts?: DiscountBasics[];
  additionalDiscounts?: DiscountBasics[];
}

export type DiscountResolverShape = UseFormReturn<DiscountPackageSchema, any, undefined>;
