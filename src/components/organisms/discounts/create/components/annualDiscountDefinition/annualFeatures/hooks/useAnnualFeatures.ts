import { UseFormReturn } from "react-hook-form";
import { DiscountSchema } from "../../../../resolvers/generalResolver";
import { useAppStore } from "@/lib/store/store";
import useSWR from "swr";
import { getContractsRanges } from "@/services/discount/discount.service";
import { useEffect, useState } from "react";
import { getAllLinesByProject } from "@/services/line/line";

type AnnualFeaturesProps = {
  form: UseFormReturn<DiscountSchema, any, undefined>;
};

export default function useAnnualFeatures({ form }: AnnualFeaturesProps) {
  const { ID: projectId } = useAppStore((project) => project.selectProject);
  const [options, setOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);

  const { watch, setValue } = form;

  const { data: dataOption, isLoading: isLoadingOption } = useSWR(
    { projectId },
    ({ projectId }: { projectId: number }) => getAllLinesByProject(projectId.toString())
  );

  const { data } = useSWR(
    { projectId, keyReset: 1 },
    // keyReset is used to force the cache to be reset not remove it
    // eslint-disable-next-line no-unused-vars
    ({ projectId, keyReset }: { projectId: number; keyReset: number }) =>
      getContractsRanges(projectId)
  );

  useEffect(() => {
    if (dataOption) setOptions(dataOption.map((x) => ({ label: x.description_line, value: x.id })));
  }, [dataOption]);

  const watchers = watch();

  const findContract = (idContract?: number) => {
    const match = data?.data?.find((x) => x.id === idContract);
    if (!match) return { range: "No encontrado", discount: "" };
    return {
      discount: `${match?.discount}%`,
      range: `De ${match?.units_from} a ${match?.units_to} unidades`
    };
  };

  const matchRanges = () => {
    watchers.annual_ranges?.forEach((range, index) => {
      const match = data?.data?.find((x) => {
        return x.units_from <= range.units && x.units_to >= range.units;
      });
      if (match) setValue(`annual_ranges.${index}.idContract`, match.id);
      else setValue(`annual_ranges.${index}.idContract`, undefined);
    });
  };
  return {
    findContract,
    matchRanges,
    options,
    isLoadingOption
  };
}
