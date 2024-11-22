import { GenericResponse } from "@/types/global/IGlobal";
import config from "@/config";
import { API } from "@/utils/api/api";
import { IPostRule } from "@/types/banks/IBanks";

export const createBankRule = async (rule: IPostRule) => {
  try {
    const response: GenericResponse<any> = await API.post(`${config.API_HOST}/bank-rule`, rule);

    return response.data;
  } catch (error) {
    console.error("Error al crear la regla:", error);
    throw error;
  }
};

export const deleteBankRule = async (ruleId: number) => {
  try {
    const response: GenericResponse<any> = await API.delete(
      `${config.API_HOST}/bank-rule/${ruleId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la regla:", error);
    throw error;
  }
};

export const deleteManyBankRules = async (ruleIds: React.Key[]) => {
  try {
    const deletePromises = ruleIds.map((id) => deleteBankRule(Number(id)));
    const results = await Promise.allSettled(deletePromises);

    const errors = results.filter((result) => result.status === "rejected");
    if (errors.length > 0) {
      console.error(`Failed to delete ${errors.length} rules`);
      throw new Error(`Failed to delete ${errors.length} rules`);
    }

    return results;
  } catch (error) {
    console.error("Error al eliminar las reglas:", error);
    throw error;
  }
};
