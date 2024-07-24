import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehiculo",
  description: "Vehiculo"
};

export default function VehicleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}