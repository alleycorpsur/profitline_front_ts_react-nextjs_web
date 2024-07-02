"use client";
import useSearch from "@/hooks/useSearch";
import { useAppStore } from "@/lib/store/store";
import {
  deactivateDiscount,
  deleteDiscount,
  getAllDiscounts
} from "@/services/discount/discount.service";
import { DiscountBasics } from "@/types/discount/DiscountBasics";
import { GenericResponsePage } from "@/types/global/IGlobal";
import { MessageInstance } from "antd/es/message/interface";
import { ChangeEvent, useEffect, useState } from "react";
import useSWR from "swr";

type Props = {
  messageApi: MessageInstance;
};

type DiscountBasicsState = DiscountBasics & { checked: boolean };

export default function useDiscount({ messageApi }: Props) {
  const [page, setPage] = useState(1);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [active, setActive] = useState<number | undefined>(undefined);
  const [data, setData] = useState<DiscountBasicsState[]>([]);
  const { searchQuery, handleChangeSearch } = useSearch();
  const { ID } = useAppStore((projects) => projects.selectProject);

  const {
    data: res,
    isLoading,
    mutate
  } = useSWR<GenericResponsePage<DiscountBasics[]>>(
    {
      projectId: ID,
      params: {
        page,
        searchQuery,
        active
      }
    },
    ({ projectId, params }) => getAllDiscounts({ projectId, params }),
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
  }, [res]);

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

  const handleDeactivate = async (id: number, status: boolean) => {
    mutate(
      {
        ...res,
        data: data.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              status
            };
          }
          return item;
        })
      } as GenericResponsePage<DiscountBasics[]>,
      { revalidate: false }
    );
    const response = await deactivateDiscount(id, status);
    if (response.success) {
      messageApi.success(`Descuento ${status ? "desactivado" : "activado"} con éxito`);
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
    handleDeactivate,
    modalDelete: {
      removeDiscountAction: handleDeleteDiscount,
      isLoading: isLoadingDelete,
      isOpen: isOpenModalDelete,
      handleOpen,
      handleClose
    }
  };
}
