import { Dispatch, SetStateAction } from "react";

import { IChanel } from "@/types/bre/IBRE";
import { SelectChips } from "../SelectChips/SelectChips";

import "./selectchanel.scss";
interface Props {
  idActiveLine: number;
  chanels: IChanel[];
  setSelectChannel: Dispatch<SetStateAction<number>>;

  setSelectedSublines: Dispatch<
    SetStateAction<
      {
        idChannel: number;
        idLine: number;
        subline: { id: number; description: string };
      }[]
    >
  >;
  selectedSubLines: {
    idChannel: number;
    idLine: number;
    subline: {
      id: number;
      description: string;
    };
  }[];
}
export const SelectChanel = ({ chanels, selectedSubLines, setSelectedSublines }: Props) => {
  return (
    <div className="chanelSelect">
      {chanels.map(({ CHANNEL_ID, CHANNEL_NAME, CHANNEL_LINES }) => {
        return (
          <SelectChips
            key={CHANNEL_ID}
            lines={CHANNEL_LINES}
            channelId={CHANNEL_ID}
            selectedSubLines={selectedSubLines}
            setSelectedSublines={setSelectedSublines}
            channelName={CHANNEL_NAME}
          />
        );
      })}
    </div>
  );
};
