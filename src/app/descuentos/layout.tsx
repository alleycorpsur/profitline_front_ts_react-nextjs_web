import { Metadata } from "next";
import DiscountWrapper from "@/components/organisms/discounts/wrapper/DiscountWrapper";

export const metadata: Metadata = {
  title: "Crear Descuento",
  description: "Crear Descuento"
};
export default function Layout({ children }: { children: React.ReactNode; pathname: string }) {
  return <DiscountWrapper>{children}</DiscountWrapper>;
}
