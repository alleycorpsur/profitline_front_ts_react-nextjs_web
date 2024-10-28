import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppStore } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { DiscountPackageSchema, generalResolver } from "../resolvers/generaResolver";
import { DiscountBasics } from "@/types/discount/DiscountBasics";

type Props = {
  params?: { id: string };
};
export interface DiscountListData {
  status: number;
  message: string;
  data: DiscountBasics[];
}
export default function useCreateDiscountPackage({ params }: Props) {
  const discountPackageId = !!Number(params?.id) ? Number(params?.id) : undefined;
  const [messageApi, contextHolder] = message.useMessage();

  // const { ID } = useAppStore((project) => project.selectedProject);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isModaltOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [statusForm, setStatusForm] = useState<"create" | "edit" | "review">(
    discountPackageId ? "review" : "create"
  );
  const [defaultDiscount, setDefaultDiscount] = useState<DiscountPackageSchema>({
    name: "",
    description: "",
    start_date: null,
    end_date: undefined,
    is_active: false,
    discounts: [],
    additionalDiscounts: []
  });

  const form = useForm({
    resolver: yupResolver(generalResolver),
    defaultValues: defaultDiscount,
    //defaultValues: Number(params?.id) ? fetchDiscount : defaultDiscount,
    disabled: statusForm === "review"
  });

  const {
    watch,
    setValue,
    getValues,
    trigger,
    control,
    resetField,
    formState: { errors }
  } = form;

  const {
    fields: discountFields,
    append: appendDiscount,
    remove: removeDiscount
  } = useFieldArray<DiscountPackageSchema>({
    control,
    name: "discounts"
  });

  const {
    fields: additionalDiscountFields,
    append: appendAdditionalDiscount,
    remove: removeAdditionalDiscount
  } = useFieldArray<DiscountPackageSchema>({
    control,
    name: "additionalDiscounts"
  });

  const handleChangeStatusForm = (status: "create" | "edit" | "review") => {
    setStatusForm(status);
  };

  useEffect(() => {
    if (!Number(params?.id) && typeof params?.id === "string") {
      // if id is not a number and it is a string then the path is incorrect
      router.push("/descuentos");
    }
  }, [params?.id]);

  useEffect(() => {
    if (statusForm === "review") {
      form.reset();
    }
  }, [statusForm]);

  const handlePostDiscount = async (e: DiscountPackageSchema) => {
    setLoading(true);
    try {
      //const res = await createDiscount({ ...e, project_id: ID }, files);
      messageApi.success("Descuento creado exitosamente");
      router.push(`/descuentos`);
      //router.push(`/descuentos/${res.data.idDiscount}`);
    } catch (e: any) {
      messageApi.error(e.response.data.message);
      console.error(e);
    }
    setLoading(false);
  };

  // const handleUpdateDiscount = async (e: DiscountPackageSchema) => {
  //   setLoading(true);
  //   try {
  //     const { data } = await updateDiscount({ ...e, project_id: ID }, discountId as number, files);
  //     messageApi.success("Descuento actualizado exitosamente");
  //     setDefaultDiscount(mapDiscountGetOneToDiscountSchema(data));
  //     setStatusForm("review");
  //     form.reset(mapDiscountGetOneToDiscountSchema(data));
  //   } catch (e: any) {
  //     messageApi.error(e.response.data.message);
  //     console.error(e);
  //   }
  //   setLoading(false);
  // };

  const handleExecCallback = form.handleSubmit(
    handlePostDiscount
    // statusForm === "edit" ? handleUpdateDiscount : handlePostDiscount
  );

  // const handleUpdateContract = () => {
  //   form.setValue("contract_archive", undefined as never);
  // };

  return {
    form,
    handleExecCallback,
    loading,
    statusForm,
    handleChangeStatusForm,
    contextHolder,
    openModal,
    closeModal,
    errors,
    isModaltOpen,
    setIsModalOpen,
    discountFields,
    additionalDiscountFields,
    control,
    trigger,
    appendAdditionalDiscount,
    appendDiscount,
    removeDiscount,
    removeAdditionalDiscount,
    watch
    // appendDiscountRule,
    // appendAdttionalDiscountRule,
    // removeDiscount,
  };
}
