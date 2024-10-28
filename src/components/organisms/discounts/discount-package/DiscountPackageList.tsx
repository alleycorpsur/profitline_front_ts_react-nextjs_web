"use client";
import styles from "./Discounts.module.scss";
import { Flex, Table, message } from "antd";
import UiSearchInput from "@/components/ui/search-input";
import FilterDiscounts from "@/components/atoms/Filters/FilterDiscounts/FilterDiscounts";
import TablePaginator from "@/components/atoms/tablePaginator/TablePaginator";
import DropdownDiscount from "@/components/molecules/dropdown/discount/DropdownDiscount";
import { ModalDeleteDiscount } from "@/components/molecules/modals/modalDeleteDiscount/ModalDeleteDiscount";
import Link from "next/link";
import ButtonHeader from "@/components/atoms/buttons/buttonHeader/ButtonHeader";
import { discountPackagesColumns, discountsColumns } from "../constants/column";
import useDiscount from "../hooks/useDiscount";
import useSWR from "swr";
import { GenericResponsePage } from "@/types/global/IGlobal";
import { DiscountPackage } from "@/types/discount/DiscountPackage";
import { useAppStore } from "@/lib/store/store";

export default function DiscountPackages() {
  const [messageApi, messageContex] = message.useMessage();
  const {
    loading,
    data,
    res,
    handleChangePage,
    handleChangeSearch,
    page,
    handleChangeActive,
    handleSelectToDelete,
    modalDelete,
    handleDeactivate
  } = useDiscount({ messageApi, type: "packages" });

  return (
    <>
      <Table
        scroll={{ y: "61dvh", x: undefined }}
        columns={discountPackagesColumns({
          handleSelect: handleSelectToDelete,
          handleDeactivate: handleDeactivate
        })}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: 25,
          showSizeChanger: false,
          total: res?.pagination.totalPages || 0,
          onChange: handleChangePage,
          itemRender: TablePaginator,
          current: page
        }}
      />
      <ModalDeleteDiscount
        isOpen={modalDelete.isOpen}
        isLoading={modalDelete.isLoading}
        onClose={modalDelete.handleClose}
        onRemove={modalDelete.removeDiscountAction}
      />
    </>
  );
}
