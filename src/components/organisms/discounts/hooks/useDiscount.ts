"use client";
import useSearch from "@/hooks/useSearch";
import { useAppStore } from "@/lib/store/store";
import {
  changeStatus,
  deleteDiscount,
  getAllDiscountPackages,
  getAllDiscounts
} from "@/services/discount/discount.service";
import { DiscountBasics } from "@/types/discount/DiscountBasics";
import { DiscountPackage } from "@/types/discount/DiscountPackage";
import { GenericResponsePage } from "@/types/global/IGlobal";
import { MessageInstance } from "antd/es/message/interface";
import { ChangeEvent, useEffect, useState } from "react";
import useSWR from "swr";

type Props = {
  messageApi: MessageInstance;
  tabActive: string;
};

//type DiscountBasicsState = DiscountBasics & { checked: boolean };
type DiscountBasicsState = DiscountBasics & { checked: boolean };
type DiscountPackageState = DiscountPackage & { checked: boolean };

export default function useDiscount({ messageApi, tabActive }: Props) {
  const [page, setPage] = useState(1);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [active, setActive] = useState<number | undefined>(undefined);
  const [data, setData] = useState<any[]>([]);
  const { searchQuery, handleChangeSearch } = useSearch();
  const { ID } = useAppStore((project) => project.selectedProject);
  const fetcher = tabActive === "1" ? getAllDiscountPackages : getAllDiscounts;
  const {
    data: res,
    isLoading,
    mutate
  } = useSWR<GenericResponsePage<DiscountBasics[] | DiscountPackage[]>>(
    {
      projectId: ID,
      params: {
        page,
        searchQuery,
        active
      },
      tabActive
    },
    ({ projectId, params }) => fetcher({ projectId, params }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      errorRetryInterval: 1000,
      errorRetryCount: 3,
      onSuccess: (response) => {
        if (response.success) {
          return response;
        } else {
          messageApi.error(response.message);
          throw new Error(response.message);
        }
      }
    }
  );

  useEffect(() => {
    if (res?.data) {
      setData(res.data.map((item) => ({ ...item, checked: false })));
    }
  }, [res, tabActive]);

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    handleChangePage(1);
    return handleChangeSearch(e);
  };

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const handleChangeActive = (
    filter: {
      label: string;
      value: number;
    }[]
  ) => {
    if (!filter?.length) setActive(undefined);
    else setActive(filter[0].value);
  };

  const handleSelectToDelete = (id: number, addToDelete: boolean) => {
    setData((data) =>
      data.map((item) => (item.id === id ? { ...item, checked: addToDelete } : item))
    );
  };

  const handleDeleteDiscount = async () => {
    try {
      setIsLoadingDelete(true);
      await deleteDiscount(data.filter((item) => item.checked).map((item) => item.id));
    } catch (error) {
    } finally {
      handleClose();
      setIsLoadingDelete(false);
      mutate(undefined, {
        revalidate: true
      });
    }
  };

  const handleClose = () => {
    setIsOpenModalDelete(false);
  };
  const handleOpen = () => {
    setIsOpenModalDelete(true);
  };

  const handleChangeStatus = async (id: number, newStatus: boolean) => {
    mutate(
      {
        ...res,
        data: data.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              status: newStatus
            };
          }
          return item;
        })
      } as GenericResponsePage<DiscountBasics[] | DiscountPackage[]>,
      { revalidate: false }
    );
    const response = await changeStatus(id, newStatus);
    if (response.success) {
      messageApi.success(`Descuento ${newStatus ? "activado" : "desactivado"} con éxito`);
    } else {
      mutate();
      messageApi.error(response.message);
    }
  };

  return {
    res,
    data,
    loading: isLoading,
    handleChangePage,
    handleChangeSearch: onChangeSearch,
    page,
    handleChangeActive,
    handleSelectToDelete,
    handleDeleteDiscount,
    handleChangeStatus,
    modalDelete: {
      removeDiscountAction: handleDeleteDiscount,
      isLoading: isLoadingDelete,
      isOpen: isOpenModalDelete,
      handleOpen,
      handleClose
    }
  };
}
