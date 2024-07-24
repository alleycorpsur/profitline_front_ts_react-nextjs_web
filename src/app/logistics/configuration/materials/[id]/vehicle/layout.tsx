import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehiculos",
  description: "Vehiculos"
};

export default function VehicleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
