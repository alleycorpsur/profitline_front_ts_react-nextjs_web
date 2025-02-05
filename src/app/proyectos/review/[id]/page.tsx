"use client";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

import { MessageProvider } from "@/context/MessageContext";

import BusinessRulesView from "./business-rules/page";
import { DetailsProjectView } from "@/components/organisms/projects/DetailProjectView/DetailProjectView";

const DetailsProjectRouter = () => {
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const activeTab = pathParts[pathParts.length - 1] || "proyecto";

  const renderComponent = () => {
    switch (activeTab) {
      case "proyecto":
        return <DetailsProjectView />;
      case "business-rules":
        return <BusinessRulesView />;
      // case "clientes":
      //   return <ClientsProjectView />;
      // case "usuarios":
      //   return <UserProjectForm />;
      // case "grupos-clientes":
      //   return <ClientsGroupsProjectView />;
      // case "comunicaciones":
      //   return <CommunicationsProjectView />;
      // case "requerimientos":
      //   return <RequirementsView />;
      // default:
      //   return <ProjectFormTab />;
    }
  };

  return (
    <MessageProvider>
      <Suspense fallback={<div>Loading...</div>}>{renderComponent()}</Suspense>
    </MessageProvider>
  );
};

export default DetailsProjectRouter;
