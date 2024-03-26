import { Dispatch, SetStateAction } from "react";
import { Checkbox, Flex, Spin, Typography } from "antd";
import useSWR from "swr";

import { fetcher } from "@/utils/api/api";
import { useAppStore } from "@/lib/store/store";
import { IZones } from "@/types/zones/IZones";

import "./selectzone.scss";

interface Props {
  zones: number[];
  setZones: Dispatch<SetStateAction<number[]>>;
}

export const SelectZone = ({ zones, setZones }: Props) => {
  const { ID } = useAppStore((state) => state.selectProject);
  const { data, isLoading } = useSWR<IZones>(`/zone/project/${ID}`, fetcher, {});

  const activateZone = (zoneId: number) => {
    setZones((s) => [...s, zoneId]);
  };
  const desactivateZone = (zoneId: number) => {
    const filterZones = zones.filter((zone) => zone !== zoneId);
    setZones(filterZones);
  };

  return (
    <div className="selectzone">
      <Typography.Text className="title">Zonas</Typography.Text>
      <Flex vertical className="zones">
        {isLoading ? (
          <Spin />
        ) : (
          <>
            {data?.data.map((zone) => {
              const zonesData = zones ? JSON.parse(JSON.stringify(zones)) : [];
              const filterZone = zonesData.filter((_zone: number) => _zone === zone.ID)[0];
              return (
                <Flex key={zone.ID} justify="space-between" className="zone">
                  <Typography.Text>{zone.ZONE_DESCRIPTION}</Typography.Text>
                  <Checkbox
                    checked={!!filterZone}
                    onClick={() => (!filterZone ? activateZone(zone.ID) : desactivateZone(zone.ID))}
                    className="checboxzone"
                  />
                </Flex>
              );
            })}
          </>
        )}
      </Flex>
    </div>
  );
};
