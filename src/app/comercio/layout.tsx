import { Metadata } from "next";
import Wrapper from "@/components/organisms/wrapper/Wrapper";

export const metadata: Metadata = {
  title: "Comercio",
  description: "Comercio"
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Wrapper>{children}</Wrapper>;
}
