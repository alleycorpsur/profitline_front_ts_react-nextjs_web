import { Flex, Typography } from "antd";
import { InputForm } from "../InputForm/InputForm";
import { Control, FieldErrors } from "react-hook-form";
import { AddressType } from "@/components/molecules/modals/ModalAddress/ModalAddress";

interface Props {
  control: Control<AddressType, any>;
  errors: FieldErrors<AddressType>;
}

export const InputAddress = ({ control, errors }: Props) => {
  return (
    <Flex vertical>
      <Flex align="flex-end">
        <InputForm
          titleInput="Ingresar dirección"
          control={control}
          nameInput="info.name"
          error={errors.info?.name}
          customStyle={{ width: "75%" }}
          placeholder="Carrera"
        />
        <Flex align="center">
          <InputForm
            titleInput=""
            control={control}
            nameInput="info.name"
            error={errors.info?.name}
            customStyle={{ width: "30%" }}
            placeholder="148A"
            hiddenTitle
          />
          <Typography.Text>#</Typography.Text>
          <InputForm
            titleInput=""
            control={control}
            nameInput="info.name"
            error={errors.info?.name}
            placeholder="45Bis"
            customStyle={{ width: "30%" }}
            hiddenTitle
          />
          <Typography.Text>-</Typography.Text>
          <InputForm
            titleInput=""
            placeholder="39"
            control={control}
            nameInput="info.name"
            error={errors.info?.name}
            customStyle={{ width: "30%" }}
            hiddenTitle
          />
        </Flex>
      </Flex>
      <InputForm
        titleInput="Complemento"
        placeholder="Local 1A"
        control={control}
        nameInput="info.name"
        error={errors.info?.name}
        customStyle={{ width: "98%" }}
      />
    </Flex>
  );
};
