import axios, { AxiosResponse } from "axios";
import { MessageInstance } from "antd/es/message/interface";

import config from "@/config";
import { IUserAxios, IUserForm } from "@/types/users/IUser";
import { getIdToken } from "@/utils/api/api";
import { SUCCESS } from "@/utils/constants/globalConstants";
import { ISelectedBussinessRules } from "@/types/bre/IBRE";
import { IGroupsByUser } from "@/types/clientsGroups/IClientsGroups";

export const getUserById = async (idUser: string): Promise<IUserAxios> => {
  const token = await getIdToken();
  try {
    const response: IUserAxios = await axios.get(`${config.API_HOST}/user/${idUser}`, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`
      }
    });

    return response;
  } catch (error) {
    return error as any;
  }
};

// create
export const inviteUser = async (
  data: IUserForm,
  selectedBusinessRules: ISelectedBussinessRules,
  selectedGroups: number[],
  zones: any,
  ID: any
): Promise<any> => {
  const modelData = {
    email: data.info.email,
    user_name: data.info.name,
    channel: selectedBusinessRules.channels,
    line: selectedBusinessRules.lines,
    subline: selectedBusinessRules.sublines,
    zone: zones,
    password: "123456",
    phone: data.info.phone,
    position: data.info.cargo,
    project_id: ID,
    rol_id: data.info.rol?.value,
    groups_id: selectedGroups
  };
  const token = await getIdToken();
  const endpointRole = data.info.rol?.value === 2 ? "admin" : "user";
  try {
    const response: AxiosResponse = await axios.post(
      `${config.API_HOST}/user/invitation/${endpointRole}/email`,
      modelData,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response;
  } catch (error) {
    console.warn("error inviting user: ", error);
    return error as any;
  }
};
//update
export const updateUser = async (
  data: IUserForm,
  selectedBusinessRules: ISelectedBussinessRules,
  selectedGroups: number[],
  zones: any,
  ID: any,
  project_id: number,
  isActive: boolean
): Promise<any> => {
  const modelData = {
    active: isActive ? 1 : 0,
    channel: selectedBusinessRules.channels,
    email: data.info.email,
    id: ID,
    line: selectedBusinessRules.lines,
    phone: data.info.phone,
    position: data.info.cargo,
    project_id: `${project_id}`,
    rol_id: data.info.rol?.value,
    subline: selectedBusinessRules.sublines,
    user_name: data.info.name,
    zones: zones.map((zone: number) => ({ ZONE_ID: zone })),
    groups_id: selectedGroups
  };

  const token = await getIdToken();
  try {
    const response: AxiosResponse = await axios.put(`${config.API_HOST}/user`, modelData, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.warn("error updating user: ", error);
    return error as any;
  }
};

export const onChangeStatusById = async (
  data: any,
  isActive: 1 | 0,
  messageApi: MessageInstance,
  onClose: () => void
) => {
  const modelData = {
    email: data.EMAIL,
    user_name: data.USER_NAME,
    zones:
      data.USER_ZONES?.map((zone: { ZONE_ID: number; ZONE_DESCRIPTION: string }) => ({
        ZONE_ID: zone.ZONE_ID
      })) ?? [],
    phone: data.PHONE,
    position: data.POSITION,
    id: data.ID,
    rol_id: data.ROL_ID,
    project_id: `${data.PROJECT_ID}`,
    active: isActive
  };
  const token = await getIdToken();
  try {
    const response: AxiosResponse = await axios.put(`${config.API_HOST}/user`, modelData, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === SUCCESS) {
      messageApi.open({
        type: "success",
        content: `El usuario fue ${isActive === 1 ? "activado" : "desactivado"} exitosamente.`
      });
      onClose();
    } else {
      messageApi.open({
        type: "error",
        content: "Oops ocurrio un error."
      });
      onClose();
    }

    return response;
  } catch (error) {
    return error as any;
  }
};

export const onRemoveUserById = async (
  idUser: number,
  idProject: number,
  messageApi: MessageInstance,
  onClose: () => void
): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();
  try {
    const response: AxiosResponse<any> = await axios.delete(
      `${config.API_HOST}/user/id=${idUser}&project_id=${idProject}`,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (response.status === SUCCESS) {
      messageApi.open({
        type: "success",
        content: "El usuario fue eliminado exitosamente."
      });
      onClose();
    } else {
      messageApi.open({
        type: "error",
        content: "Oops ocurrio un error."
      });
      onClose();
    }

    return response;
  } catch (error) {
    return error as any;
  }
};
export const onResendInvitationUser = async (email: string): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${config.API_HOST}/user/invitation/resend`,
      { email },
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    return error as any;
  }
};

export const deleteUsersById = async (
  users_id: number[],
  project_id: string
): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();

  const modelData = {
    users: users_id,
    project_id
  };

  try {
    const response: AxiosResponse = await axios.put(
      `${config.API_HOST}/massive-action/user/delete`,
      modelData,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    console.warn("error deleting users: ", error);
    return error as any;
  }
};

export const resendInvitationUsers = async (users_id: number[]): Promise<AxiosResponse<any>> => {
  const token = await getIdToken();

  const modelData = {
    users: users_id
  };

  try {
    const response: AxiosResponse = await axios.post(
      `${config.API_HOST}/massive-action/user/resend-invitation`,
      modelData,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    console.warn("error re-sending invite to users: ", error);
    return error as any;
  }
};

export const getGroupsByUser = async (userID: number, projectID: number) => {
  const token = await getIdToken();
  try {
    const response: AxiosResponse<IGroupsByUser> = await axios.get(
      `${config.API_HOST}/group-client/user/${userID}/project/${projectID}`,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.warn("error getting groups by user: ", error);
    return error as any;
  }
};
