import { Dispatch, SetStateAction, useState } from "react";
import { Checkbox, Flex, Tag, Typography } from "antd";
import { CheckCircle } from "phosphor-react";

import { ChannelLine } from "@/types/bre/IBRE";
import { removeDuplicatesBySublineId, removeObjectsFromArray } from "@/utils/utils";

import "./selectchips.scss";

const { Text } = Typography;

interface Props {
  channelId: number;
  channelName: string;
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

  lines: ChannelLine[];
}

export const SelectChips = ({
  channelName,
  lines,
  channelId,
  selectedSubLines = [],
  setSelectedSublines = () => {}
}: Props) => {
  const [isAllSublinesSelected, setIsAllSublinesSelected] = useState(false);

  const sublines = lines
    ?.map((line) => line?.sublines?.map((subline) => subline?.id))
    .flat()
    .filter((subline) => typeof subline === "number");
  const onSelectAllSublines = (e: any) => {
    const lineData = lines
      ?.map((line) =>
        line.sublines?.map((subline) => ({
          idChannel: channelId,
          idLine: line.id,
          subline
        }))
      )
      .flat()
      .filter((item) => typeof item !== "undefined");
    if (e.target.checked) {
      setSelectedSublines(removeDuplicatesBySublineId([...selectedSubLines, ...lineData]));
      setIsAllSublinesSelected(true);
    } else {
      setSelectedSublines(removeObjectsFromArray(selectedSubLines, lineData));
      setIsAllSublinesSelected(false);
    }
  };
  const onSelectSubline = (
    lineId: number,
    idSubline: number,
    description: string,
    isActiveSubline: boolean
  ) => {
    const allSublinesChannel = selectedSubLines.filter(
      (line) => line?.idChannel === channelId
    ).length;
    if (isActiveSubline) {
      const desactivatedSublines = selectedSubLines.filter(
        (subline) => subline?.subline?.id !== idSubline
      );
      setIsAllSublinesSelected((sublines.length ?? 0) === allSublinesChannel - 1);
      return setSelectedSublines(desactivatedSublines);
    }

    setSelectedSublines((s) => [
      ...s,
      {
        idChannel: channelId,
        idLine: lineId,
        subline: {
          id: idSubline,
          description: description
        }
      }
    ]);

    setIsAllSublinesSelected((sublines.length ?? 0) === allSublinesChannel + 1);
  };

  return (
    <Flex className="selectchips" vertical>
      <Flex component="header" justify="space-between" className="headerselectchips">
        <Text className="titleChannel">{channelName}</Text>
        {lines && <Checkbox checked={isAllSublinesSelected} onChange={onSelectAllSublines} />}
      </Flex>
      <Flex component="main" className="mainTags">
        {lines?.length > 0 ? (
          lines.map((line) => (
            <Flex key={line.id} vertical className="line">
              <Text className="titleLine">{line.description}</Text>
              <Flex className="sublines">
                {line.sublines?.length > 0 ? (
                  <>
                    {line.sublines.map(({ id, description }) => {
                      const activeSubline = selectedSubLines.filter(
                        (subline) => subline?.subline?.id === id
                      );
                      return (
                        <Tag
                          key={id}
                          closeIcon={
                            <CheckCircle
                              color={activeSubline[0] ? "green" : "gray"}
                              onClick={() =>
                                onSelectSubline(line.id, id, description, !!activeSubline[0])
                              }
                              size={"1.4rem"}
                            />
                          }
                          className="tag"
                        >
                          {description}
                        </Tag>
                      );
                    })}
                  </>
                ) : (
                  <Text>Sin sublineas actualmente.</Text>
                )}
              </Flex>
            </Flex>
          ))
        ) : (
          <Text>Sin Lineas actualmente.</Text>
        )}
      </Flex>
    </Flex>
  );
};
