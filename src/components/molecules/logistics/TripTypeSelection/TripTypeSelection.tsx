import { FunctionComponent } from "react";
import TripTypes from "../../../atoms/logistics/TripTypes/TripTypes";
import styles from "./TripTypeSelection.module.css";
import { Flex } from "antd";

export type TripTypeSelectionType = {
  className?: string;
};

const TripTypeSelection: FunctionComponent<TripTypeSelectionType> = ({
  className = "",
}) => {
  return (
    <Flex gap="middle">
      <TripTypes icon="/images/logistics/truck.svg" text="Carga" id="1"/>
      <TripTypes icon="/images/logistics/izaje.svg" text="Izaje" id="2"/>
      <TripTypes icon="/images/logistics/users.svg" text="Personal" id="3"/>
    </Flex>
  );
};

export default TripTypeSelection;
