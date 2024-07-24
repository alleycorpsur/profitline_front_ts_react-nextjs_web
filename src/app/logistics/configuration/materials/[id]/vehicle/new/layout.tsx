import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Vehiculo",
  description: "Crear Vehiculo"
};

export default function CreateVehicleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}