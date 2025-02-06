"use client";
import { useState } from "react";
import { UsersProjectTable } from "@/components/molecules/tables/UsersProjectTable/UsersProjectTable";
import { UserProjectForm } from "@/components/molecules/tabs/Projects/UserProjectForm/UserProjectForm";
import { useParams } from "next/navigation";
import { extractSingleParam } from "@/utils/utils";

export const UsersProjectView = () => {
  const params = useParams();
  const projectId = extractSingleParam(params.id) || "";
  const [isCreateUser, setIsCreateUser] = useState(false);
  const [isViewDetailsUser, setIsViewDetailsUser] = useState({
    active: false,
    id: 0
  });

  const onGoBackTableUsers = () => {
    setIsCreateUser(false);
    setIsViewDetailsUser({ active: false, id: 0 });
  };

  return (
    <>
      {isCreateUser || isViewDetailsUser.active ? (
        <UserProjectForm
          onGoBackTable={onGoBackTableUsers}
          isViewDetailsUser={isViewDetailsUser}
          setIsCreateUser={setIsCreateUser}
          setIsViewDetailsUser={setIsViewDetailsUser}
        />
      ) : (
        <UsersProjectTable
          idProject={projectId}
          setIsViewDetails={setIsViewDetailsUser}
          setIsCreateUser={setIsCreateUser}
        />
      )}
    </>
  );
};

export default UsersProjectView;
