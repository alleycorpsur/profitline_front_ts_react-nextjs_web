import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Empty, Flex, Spin, Typography } from "antd";
import useSWR from "swr";

import { SelectChanel } from "@/components/molecules/selects/SelectChanel/SelectChanel";

import { useAppStore } from "@/lib/store/store";
import { fetcher } from "@/utils/api/api";
import { IBRE } from "@/types/bre/IBRE";
import { filterBRbyIdSubline, transformFormat } from "@/utils/utils";

import "./selectstructure.scss";
interface Props {
  sublinesUser?: number[];
  selectedSublines: {
    idChannel: number;
    idLine: number;
    subline: {
      id: number;
      description: string;
    };
  }[];
  setSelectedSublines: Dispatch<
    SetStateAction<
      {
        idChannel: number;
        idLine: number;
        subline: {
          id: number;
          description: string;
        };
      }[]
    >
  >;
}
export const SelectStructure = ({
  sublinesUser = [],
  selectedSublines,
  setSelectedSublines
}: Props) => {
  const { ID } = useAppStore((state) => state.selectProject);
  const { data, isLoading } = useSWR<IBRE>(`/bussines-rule/project/${ID}`, fetcher, {});

  const [selectChannel, setSelectChannel] = useState(0);
  useEffect(() => {
    if (!data?.data) return;
    if (sublinesUser.length === 0) return;
    const dataFinal = JSON.parse(JSON.stringify(data?.data));
    const brs = filterBRbyIdSubline(dataFinal, sublinesUser);
    setSelectedSublines(transformFormat(brs));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="selectstructure">
      <Typography.Text className="title">Estructura</Typography.Text>
      <Flex className="structure" gap={"1rem"}>
        {isLoading ? (
          <Spin />
        ) : (
          <>
            {data?.data ? (
              <SelectChanel
                idActiveLine={selectChannel}
                setSelectChannel={setSelectChannel}
                chanels={data.data}
                setSelectedSublines={setSelectedSublines}
                selectedSubLines={selectedSublines}
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </>
        )}
      </Flex>
    </div>
  );
};
