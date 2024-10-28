/* eslint-disable no-unused-vars */
import React, { FC, useState } from "react";
import { Modal, Select, Typography } from "antd";
import { X } from "phosphor-react";
import FooterButtons from "@/components/atoms/FooterButtons/FooterButtons";
import useSWR from "swr";
import { DiscountListData } from "@/components/organisms/discounts/discount-package/create/hooks/useCreateDiscountPackage";
import { fetcher } from "@/utils/api/api";
import { useAppStore } from "@/lib/store/store";
import { DiscountBasics } from "@/types/discount/DiscountBasics";
import { TypeDiscount } from "@/components/organisms/discounts/discount-package/create/CreateDiscountPackageView";
const { Title } = Typography;

export interface Option {
  value: number;
  label: string;
}

interface AddDiscountModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  typeDiscount: TypeDiscount | null;
  onConfirm: (discount: DiscountBasics) => void;
}
const AddDiscountModal: FC<AddDiscountModalProps> = ({
  isModalOpen,
  typeDiscount,
  onClose,
  onConfirm
}) => {
  const { ID: projectId } = useAppStore((project) => project.selectedProject);

  const { data, isLoading } = useSWR<DiscountListData>(
    `/discount/project/${projectId}`,
    fetcher,
    {}
  );

  const options = data?.data.map((option) => {
    return {
      value: option.id,
      label: option.description
    };
  });
  const [selectedDiscount, setSelectedDiscount] = useState<Option | null>(null);
  return (
    <Modal
      centered
      open={isModalOpen}
      width={698}
      onCancel={onClose}
      closeIcon={<X size={20} weight="bold" onClick={onClose} />}
      title={<Title level={4}>Agregar descuento</Title>}
      styles={{
        body: {
          maxHeight: "85vh"
        }
      }}
      footer={
        <FooterButtons
          titleConfirm="Agregar requerimiento"
          isConfirmDisabled={!selectedDiscount}
          onClose={onClose}
          handleOk={() => {
            if (selectedDiscount) {
              const findDiscount = data?.data.find((d) => d.id === selectedDiscount.value);
              findDiscount && onConfirm(findDiscount);
              onClose();
              setSelectedDiscount(null);
            }
          }}
        />
      }
    >
      <Select
        showSearch
        placeholder="Seleccione el descuento"
        style={{ width: "100%", height: "45px" }}
        options={options}
        onSelect={(value, option) => {
          option && setSelectedDiscount(option);
        }}
        value={selectedDiscount}
        loading={isLoading}
      />
    </Modal>
  );
};

export default AddDiscountModal;
