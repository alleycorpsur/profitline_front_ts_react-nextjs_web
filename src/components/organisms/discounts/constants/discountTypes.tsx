import { Bag, CalendarBlank, UsersThree } from "phosphor-react";

export const discountTypesByOrder = [1, 2, 3, 4];

export const typesWithOutMinByOrder = [1, 2];

export const typesWithMinByOrder = [3, 4];

export const discountTypesByClient = [5, 6];

export const discountTypeByAnnual = [7];

const discountCategories: {
  [key: string]: {
    id: number;
    name: string;
    discountType: number[];
    Icon: () => any;
  };
} = {
  byOrder: {
    id: 1,
    name: "Por orden",
    discountType: discountTypesByOrder,
    Icon: () => <Bag size={32} />
  },
  byClient: {
    id: 2,
    name: "Por cliente",
    discountType: discountTypesByClient,
    Icon: () => <UsersThree size={32} />
  },
  annual: {
    id: 3,
    name: "Plan anual",
    discountType: discountTypeByAnnual,
    Icon: () => <CalendarBlank size={32} />
  }
};

/** options[*].value is conected with discountCategories[*].discountType */
export const options = [
  { label: "Cantidad", value: 1 },
  { label: "Monto", value: 2 },
  { label: "Cross-Selling", value: 3 },
  { label: "Cross-Filler", value: 4 },
  { label: "Primera compra", value: 5 },
  { label: "Todas las compras", value: 6 },
  { label: "Plan Anual", value: 7 }
];

export const getOptionsByType = (type: number) => {
  return options.filter((op) =>
    Object.values(discountCategories)
      .find((t) => t.id === type)
      ?.discountType.includes(op.value)
  );
};

export default discountCategories;
