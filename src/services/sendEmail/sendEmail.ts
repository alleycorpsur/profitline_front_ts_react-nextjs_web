import { API } from "@/utils/api/api";

interface ISelect {
  value: string;
  label: string;
}
export interface Email {
  forward_to: ISelect[];
  copy_to?: ISelect[];
  subject: string;
  body: string;
  attachments: File[];
}

export const sendEmail = async (data: Email): Promise<any> => {
  const forward_to = data.forward_to.map((user) => user.value);
  const copy_to = data?.copy_to?.map((user) => user.value);

  const formData = new FormData();

  formData.append("to", JSON.stringify(forward_to));
  if (copy_to) formData.append("copy", JSON.stringify(copy_to));
  formData.append("subject", data.subject);
  formData.append("body", data.body);
  data.attachments.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const response = await API.post(
      `https://z3i5kgp9mm.us-east-2.awsapprunner.com/api/comunication/email`,
      formData
    );

    return response;
  } catch (error) {
    console.error("Error creating send email", error);
    throw error;
  }
};
