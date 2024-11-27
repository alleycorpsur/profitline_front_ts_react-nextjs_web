"use client";
import { Table } from "antd";
import TablePaginator from "@/components/atoms/tablePaginator/TablePaginator";
import { discountPackagesColumns } from "../../constants/column";
export interface IDiscountPackageTable {
  data: any;
  res: any;
  page: number;
  handleSelectToDelete: (id: number, addToDelete: boolean) => void;
  handleChangeStatus: (id: number, status: boolean) => void;
  handleChangePage: (page: number) => void;
  loading: boolean;
}

export default function DiscountPackages({
  data,
  res,
  page,
  handleSelectToDelete,
  handleChangeStatus,
  handleChangePage,
  loading
}: Readonly<IDiscountPackageTable>) {
  return (
    <Table
      scroll={{ y: "61dvh", x: undefined }}
      columns={discountPackagesColumns({
        handleSelect: handleSelectToDelete,
        handleChangeStatus
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
  );
}
