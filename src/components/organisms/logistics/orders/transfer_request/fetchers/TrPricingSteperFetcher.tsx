"use client";
import { getTransferRequestSteps } from "@/services/logistics/transfer-request";
import { Spin } from "antd";
import useSWR from "swr";
import PricingTransferRequest from "../PricingTransferRequest";
import { MODE_PRICING } from "../constant/constants";
import {
  ITrackingResponse,
  ITransferRequestJourneyInfo,
  ITransferRequestJourneyReview
} from "@/types/logistics/schema";

export default function TrPricingSteperFetcher({ id }: { id: number }) {
  const { data, isLoading, mutate } = useSWR({ id }, ({ id }) => getTransferRequestSteps(id), {
    revalidateOnMount: true,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onError: (error) => {
      console.error("error", error);
    }
  });
  if (isLoading || !data) return <Spin />;
  const mutateStepthree = (journey: ITransferRequestJourneyReview[]) => {
    mutate({ ...data, stepThree: { journey } }, { revalidate: false });
  };
  const mapJourneyToTracking: (journey?: ITransferRequestJourneyInfo[]) => ITrackingResponse[] = (
    journey
  ) =>
    journey?.map((a, i) => ({
      end_date: a.end_date,
      start_date: a.start_date,
      end_location_desc: a.end_location_desc,
      start_location_desc: a.start_location_desc,
      id_end_location: a.id_start_location,
      id_start_location: a.id_end_location,
      order_to: a.order_tr,
      type_service_desc:
        a.id_type_service === 1 ? "Carga" : a.id_type_service === 2 ? "Izaje" : "Personal",
      id_type_service: a.id_type_service
    })) || [];

  return (
    <PricingTransferRequest
      data={data}
      mode={MODE_PRICING.TRANSFER_REQUEST}
      mutateStepthree={mutateStepthree}
      tracking={mapJourneyToTracking(data.stepTwo?.journey)}
    />
  );
}