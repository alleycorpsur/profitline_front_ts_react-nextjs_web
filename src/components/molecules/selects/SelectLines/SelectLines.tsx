import { Dispatch, SetStateAction } from "react";
import { Empty, Flex, Typography } from "antd";

import { SelectChips } from "../SelectChips/SelectChips";
import { IChanel } from "@/types/bre/IBRE";

import "./selectlines.scss";

const { Text } = Typography;
interface Props {
  lines: IChanel;
  selectedSubLines: {
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
        subline: { id: number; description: string };
      }[]
    >
  >;
}
export const SelectLines = ({ lines, selectedSubLines, setSelectedSublines }: Props) => {
  return (
    <div className="lineSelect">
      <Text>Lineas</Text>
      <Flex vertical>
        <Flex vertical>
          {lines.CHANNEL_LINES?.length > 0 ? (
            <>
              {lines.CHANNEL_LINES.map((line) => (
                <SelectChips
                  key={line.id}
                  lines={[]}
                  channelId={lines.CHANNEL_ID}
                  channelName={line.description}
                  selectedSubLines={selectedSubLines}
                  setSelectedSublines={setSelectedSublines}
                />
              ))}
            </>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Flex>
      </Flex>
    </div>
  );
};
