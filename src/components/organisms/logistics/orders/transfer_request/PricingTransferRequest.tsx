import {
  Flex,
  Typography,
  message,
  Row,
  Col,
  Select,
  Table,
  TableProps,
  Button,
  Drawer,
  Card,
  Spin
} from "antd";
import React, { useRef, useEffect, useState } from "react";

// dayjs locale
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es-us";
dayjs.locale("es");

// mapbox
import "mapbox-gl/dist/mapbox-gl.css";

//schemas
import {
  IMaterial,
  ISelectOptionOrders,
  ITransferOrderRequest,
  ITransferOrderRequestContacts,
  ITransferRequestCreation,
  ITransferOrdersRequest,
  IVehicleType,
  ITransferRequestJourneyReview,
  ITrackingPartial
} from "@/types/logistics/schema";

import {
  Pencil,
  Trash,
  DotsSixVertical,
  CaretDoubleRight,
  Warning,
  Truck,
  CraneTower,
  Eye,
  CaretDown,
  User,
  CaretLeft,
  CaretRight,
  Circle
} from "@phosphor-icons/react";

import "../../../../../styles/_variables_logistics.css";

import "./PricingTransferRequest.scss";

import "react-form-wizard-component/dist/style.css";
import { formatMoney } from "@/utils/utils";
import {
  createTransferRequest,
  finishTransferRequest
} from "@/services/logistics/transfer-request";
import { getSuggestedVehicles } from "@/services/logistics/vehicles";
import VehiclesSelection from "./vehiclesSelection/VehiclesSelection";
import { useParams, useRouter } from "next/navigation";
import Steper from "@/components/molecules/Steppers/Steper";
import PricingStepOne from "./components/steps/PricingStepOne";
import { MODE_PRICING } from "./constant/constants";
import PricingStepThree from "./components/steps/PricingStepThree";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import { TransferRequestFinish } from "@/types/logistics/transferRequest/transferRequest";
import { useForm } from "react-hook-form";
import ModalSelectCarrierPricing from "./components/modals/ModalSelectCarrierPricing";

const { Title, Text } = Typography;

interface PricingTransferOrderRequestProps {
  data: ITransferRequestCreation;
  mode: MODE_PRICING;
  // eslint-disable-next-line no-unused-vars
  mutateStepthree: (journey: ITransferRequestJourneyReview[]) => void;
  tracking: ITrackingPartial[];
}

export default function PricingTransferRequest({
  data: transferRequest,
  mode,
  mutateStepthree,
  tracking
}: PricingTransferOrderRequestProps) {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const params = useParams();
  const id = parseInt(params.id as string);

  const {
    control,
    handleSubmit,
    getValues,
    watch,
    formState: { isSubmitting }
  } = useForm<TransferRequestFinish>({
    defaultValues: { id, providers: [] }
  });

  /* Data first page*/
  const [ordersId, setOrdersId] = useState<number[]>(
    transferRequest?.stepOne?.transferOrders.map((a) => a.id)
  );
  const [orders, setOrders] = useState<ITransferOrdersRequest | undefined>({
    orders: transferRequest?.stepOne?.transferOrders,
    tracking
  });
  const [orderRequest, setOrderRequest] = useState<ITransferOrderRequest>();
  const [dataCarga, setDataCarga] = useState<IMaterial[]>([]);
  const [_transferRequest, setTransferRequest] = useState<ITransferRequestCreation>();

  /*Data second page */
  const [vehicleKey, setVehicleKey] = useState<number | null>(null);
  const [vehiclesSelected, setVehiclesSelected] = useState<IVehicleType[]>([]);
  const [vehiclesSections, setVehiclesSections] = useState<number[]>([0]);
  const [sugestedVehicles, setSugestedVehicles] = useState<IVehicleType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [optionsVehicles, setOptionsVehicles] = useState<any>([]);
  const [modalCarrier, setModalCarrier] = useState(false);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const addVehiclesSections = () => {
    setVehiclesSections([...vehiclesSections, vehiclesSections.length]);
  };

  const removeVehiclesSection = (index: number) => {
    if (index === 0) return; // Prevent removal of the first section

    // Remove the section
    setVehiclesSections((prevSections) => prevSections.filter((_, i) => i !== index));

    // Remove the associated vehicle if it exists
    setVehiclesSelected((prevVehicles) => prevVehicles.filter((_, i) => i !== index));
  };

  // Function to handle quantity changes and update totals
  const handleQuantityMaterial = (key: React.Key, sign: string) => {
    const newData = [...dataCarga];
    newData.forEach((item) => {
      if (item.key === key) {
        if (sign == "+") {
          item.quantity = item.quantity + 1;
        }
        if (sign == "-") {
          if (item.quantity === 1) return item.quantity;
          item.quantity = item.quantity - 1;
        }
      }
    });

    setDataCarga(newData);
  };

  const filteredVehiclesOptions = optionsVehicles.filter(
    (option: any) => !vehiclesSelected?.some((vehicle) => vehicle.description === option.value)
  );

  const loadSuggestedVehicles = async () => {
    const res = await getSuggestedVehicles("1");
    const result: any = [];
    if (res.data.data.length > 0) {
      res.data.data.forEach((item) => {
        const strlabel = (
          <Flex align="center" gap={12}>
            <Circle size={24} />
            <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "4px" }}>
              <Flex justify="space-between">
                <Text>
                  <b>{item.description}</b>
                </Text>
                <div>{formatMoney(item.price)}</div>
              </Flex>
              <Text>
                Ocupación Volumen {item.volume} - Peso {item.weight}
              </Text>
              <Text>Cantidad disponibles: {item.available}</Text>
            </div>
          </Flex>
        );

        result.push({ value: item.description, label: strlabel });
      });
    }

    setSugestedVehicles(res.data.data);
    setOptionsVehicles(result);
  };

  const addVehicle = (index: number, selectedOption: any) => {
    // Find the actual vehicle object from the selected option
    const vehicle = sugestedVehicles.find((v) => v.description === selectedOption.value);
    console.log(vehicle);

    if (vehicle) {
      const newVehicle: IVehicleType = {
        key: index,
        id: vehicle.id,
        description: vehicle.description,
        vehicle_subtype: vehicle.vehicle_subtype,
        actyvity_type: vehicle.actyvity_type,
        kg_capacity: vehicle.kg_capacity,
        m3_volume: vehicle.m3_volume,
        width: vehicle.width,
        height: vehicle.height,
        aditional_info: vehicle.aditional_info,
        length: vehicle.length,
        passenger_capacity: vehicle.passenger_capacity,
        speed_multiple: vehicle.speed_multiple,
        active: vehicle.active,
        created_at: vehicle.created_at,
        created_by: vehicle.created_by,
        modified_at: vehicle.modified_at,
        modified_by: vehicle.modified_by,
        icon: vehicle.icon,
        image: vehicle.image,
        quantity: 1,
        plate_number: vehicle.plate_number
      };

      setVehiclesSelected((prevVehicles) => {
        const updatedVehicles = [...prevVehicles];
        updatedVehicles[index] = newVehicle;
        return updatedVehicles;
      });
    }
  };

  const calculateTotalCapacities = () => {
    let totalVolume = 0;
    let totalWeight = 0;
    let totalPersons = 0;

    vehiclesSelected.forEach((vehicle) => {
      totalVolume += vehicle.m3_volume * vehicle.quantity;
      totalWeight += vehicle.kg_capacity * vehicle.quantity;
      totalPersons += vehicle.passenger_capacity * vehicle.quantity;
    });

    return { totalVolume, totalWeight, totalPersons };
  };

  const { totalVolume, totalWeight, totalPersons } = calculateTotalCapacities();

  const usedVolume = dataCarga.reduce(
    (sum, material) => sum + material.m3_volume * material.quantity,
    0
  );
  const usedWeight = dataCarga.reduce(
    (sum, material) => sum + material.kg_weight * material.quantity,
    0
  );

  const volumeUsedPercentage = (usedVolume / totalVolume) * 100;
  const weightUsedPercentage = (usedWeight / totalWeight) * 100;

  useEffect(() => {
    loadSuggestedVehicles();
  }, [orderRequest]);

  /* Tipo de viaje */
  const [typeactive, setTypeActive] = useState("1");

  /* Agendamiento */
  const origin = useRef<any>([]);
  const destination = useRef<any>([]);
  const [origenIzaje, setOrigenIzaje] = useState(false);
  const [destinoIzaje, setDestinoIzaje] = useState(false);
  const [fechaInicial, setFechaInicial] = useState<Dayjs | null>(null);
  const [horaInicial, setHoraInicial] = useState<Dayjs | null>(null);

  /*Steps */
  const [view, setView] = useState<"solicitation" | "vehicles" | "carrier">("solicitation");
  const [isNextStepActive, setIsNextStepActive] = useState<boolean>(true);
  const steps = [
    { title: "Solicitud de transferencia" },
    { title: "Seleccion de vehiculos" },
    { title: "Seleccion de proveedor" }
  ];
  const currentStepIndex = view === "solicitation" ? 0 : view === "vehicles" ? 1 : 2;

  const mapContainerRef = useRef(null);
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState([]);
  const [distance, setDistance] = useState<any>(null);
  const [timetravel, setTimeTravel] = useState<any>(null);
  const [suggestions, setSuggestions] = useState([]);

  const [expand, setExpand] = useState(false);
  //const directions = routeInfo.length > 0 ? routeInfo[0]["legs"][0]["steps"] : [];

  /*Service loader */
  const [isLoading, setIsLoading] = useState<boolean>(false);
  /* 
  useEffect(() => {
    const decodedParam = params ? decodeURIComponent(params.id) : "";
    const numbers = decodedParam ? decodedParam.split(",").map(Number) : [];
    setOrdersId(numbers);
  }, [params]); */

  useEffect(() => {
    if (!!transferRequest?.stepTwo) {
      if (
        transferRequest?.stepThree?.journey?.some((j) =>
          j.trips.some((t) => t.carriers_pricing.some(() => true))
        )
      ) {
        setView("carrier");
      } else {
        setView("vehicles");
      }
    }
  }, [transferRequest]);

  useEffect(() => {
    if (view === "solicitation") setIsNextStepActive(true);
    if (view === "carrier") {
      const isValid = transferRequest?.stepThree?.journey?.every((j) =>
        j.trips.every((t) => getValues("providers").some((p) => p.id_trip === t.id_trip))
      );
      setIsNextStepActive(!!isValid);
    }
  }, [isNextStepActive, watch("providers"), view]);

  const handleToggleExpand = () => {
    setExpand(!expand);
  };

  const [openDrawer, setOpenDrawer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* Tipo de viaje */
  const handleTypeClick = (event: any) => {
    setTypeActive(event.target.id);
    origin.current = [];
    destination.current = [];
    setRouteGeometry(null);
    setRouteInfo([]);
    setDistance(null);
    setTimeTravel(null);
    if (event.target.id == "2") {
      setOrigenIzaje(true);
    } else {
      setOrigenIzaje(false);
    }
  };

  /*Steps funcionality */

  const handleCreateTransferRequest = async () => {
    setIsLoading(true);
    const ordersId = orders ? orders?.orders.map((a) => a.id) : [0];
    const tracking = orders ? orders?.tracking : [];
    try {
      const res = await createTransferRequest(ordersId, tracking);
      message.success("Solicitud de transferencia creada");
      res?.stepOne?.transferRequest?.length
        ? router.replace("/logistics/transfer-request/" + res.stepOne.transferRequest[0].id)
        : undefined;
    } catch (error) {
      if (error instanceof Error) message.error(error.message);
      else message.error("Error al crear la solicitud de transferencia");
    }

    setIsLoading(false);
  };

  const handleNext = async () => {
    if (view === "solicitation") {
      if (mode === MODE_PRICING.TRANSFER_REQUEST) {
        setView("vehicles");
      } else {
        handleCreateTransferRequest();
      }
    } else if (view === "vehicles") {
      if (
        transferRequest?.stepThree?.journey?.some((j) =>
          j.trips.some((t) => t.carriers_pricing.length)
        )
      )
        setView("carrier");
      else setModalCarrier(true);
    } else if (view === "carrier") {
      if (
        transferRequest?.stepThree?.journey?.every((j) =>
          j.trips.every((t) => getValues("providers").some((p) => p.id_trip === t.id_trip))
        )
      )
        handleSubmit(handleFinish)();
    }
  };

  const handleFinish = async (data: TransferRequestFinish) => {
    try {
      await finishTransferRequest(data);
      message.success("Solicitud de transferencia finalizada");
      router.push("/logistics/transfer-orders");
    } catch (error) {
      if (error instanceof Error) message.error(error.message);
      else message.error("Error al finalizar la solicitud de transferencia");
    }
  };

  const handleBack = () => {
    if (view === "carrier") {
      setView("vehicles");
    } else if (view === "vehicles") {
      setView("solicitation");
    } else router.push("/logistics/orders");
  };

  /* Carga */

  const columnsVehiclesMaterial: TableProps<IMaterial>["columns"] = [
    {
      title: "Total",
      dataIndex: "quantity",
      key: "quantity",
      render: (total) => <Text>{total}</Text>,
      sorter: (a, b) => a.quantity - b.quantity,
      showSorterTooltip: false,
      align: "center"
    },
    {
      title: "Cantidad en el trayecto",
      dataIndex: "",
      key: "",
      render: (_, record) => (
        <Flex align="center" justify="center">
          <CaretLeft onClick={() => handleQuantityMaterial(record.key, "-")} />
          &nbsp;&nbsp;{record.quantity}&nbsp;&nbsp;
          <CaretRight onClick={() => handleQuantityMaterial(record.key, "+")} />
        </Flex>
      ),
      sorter: (a, b) => a.id - b.id,
      showSorterTooltip: false,
      align: "center",
      width: "10%"
    },
    {
      title: "SKU",
      key: "sku",
      dataIndex: "sku",
      render: (text) => <Text>{text}</Text>,
      sorter: (a, b) => a.quantity - b.quantity,
      showSorterTooltip: false,
      align: "center"
    },
    {
      title: "Nombre",
      key: "name",
      dataIndex: "description",
      render: (text) => <Text>{text}</Text>,
      sorter: (a, b) => a.description.localeCompare(b.description),
      showSorterTooltip: false
    },
    {
      title: "Dimensiones",
      key: "dimensions",
      dataIndex: ["mt_height", "mt_length", "mt_width"],
      render: (text, record) => (
        <>
          <Text>W {record.mt_width}</Text>
          <Text>H {record.mt_height}</Text>
          <Text>D {record.mt_length}</Text>
        </>
      ),
      sorter: (a, b) => a.mt_width - b.mt_width,
      showSorterTooltip: false,
      align: "center"
    },
    {
      title: "Volumen",
      key: "m3_volume",
      dataIndex: "m3_volume",
      render: (text) => <Text>{text}</Text>,
      sorter: (a, b) => Number(a.m3_volume) - Number(b.m3_volume),
      showSorterTooltip: false,
      align: "center"
    },
    {
      title: "Peso",
      key: "kg_weight",
      dataIndex: "kg_weight",
      render: (text) => <Text>{text}</Text>,
      sorter: (a, b) => a.kg_weight - b.kg_weight,
      showSorterTooltip: false,
      align: "center"
    },
    {
      title: "Alertas",
      key: "buttonSee",
      width: 64,
      dataIndex: "id",
      render: (id) => (
        <Flex style={{ gap: "6px", justifyContent: "flex-end" }}>
          <Button style={{ backgroundColor: "#F7F7F7" }} icon={<Warning size={"1.3rem"} />} />
          <Button style={{ backgroundColor: "#F7F7F7" }} icon={<Eye size={"1.3rem"} />} />
        </Flex>
      ),
      align: "center"
    }
  ];

  const columnsVehiclesPerson: TableProps<ITransferOrderRequestContacts>["columns"] = [
    {
      title: "Nombre",
      key: "name",
      dataIndex: "name",
      render: (text) => <Text>{text}</Text>,
      sorter: (a, b) => a.name.localeCompare(b.name),
      showSorterTooltip: false
    },
    {
      title: "Telefono",
      dataIndex: "contact_number",
      key: "contact_number",
      render: () => <Text>a</Text>,
      sorter: (a, b) => a.contact_number - b.contact_number,
      showSorterTooltip: false
    },
    {
      title: "PSL",
      key: "psl",
      dataIndex: "psl",
      render: (text) => <Text>{text}</Text>,
      sorter: (a, b) => Number(a.id_psl) - Number(b.id_psl),
      showSorterTooltip: false
    },
    {
      title: "CC",
      key: "id_cost_center",
      dataIndex: "id_cost_center",
      render: (text) => <Text>{text}</Text>,
      sorter: (a, b) => Number(a.id_cost_center) - Number(b.id_cost_center),
      showSorterTooltip: false
    }
  ];

  const columnsCargaVehiculo = [
    {
      title: "Vehiculo",
      dataIndex: "vehicle",
      key: "vehicle"
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
      key: "quantity"
    }
  ];

  /*Acoordion selection */

  const TitleComponent = ({ state, id }: { state: string; id: number }) => (
    <div className="collapseHeader">
      <div className="collapseJustify">
        <div className="collapseStateContainer">
          {state === "Carga" ? (
            <Truck size={27} color="#FFFFFF" weight="fill" />
          ) : state === "Izaje" ? (
            <CraneTower size={27} color="#FFFFFF" weight="fill" />
          ) : (
            <User size={27} color="#FFFFFF" weight="fill" />
          )}
          <Text className="collapseState">{state}</Text>
        </div>
        <div>
          <CaretDown
            className={`collapseCaret ${id === vehicleKey && "collapseRotate"}`}
            size={24}
          />
        </div>
      </div>
      <div className="collapseFromTo">
        <div className="collapseFromToContainer">
          <Text className="collapseTitle">Origen</Text>
          <Text className="collapseSubtitle">CENTRO EMPRESARIAL DORADO PLAZA</Text>
        </div>
        <div className="collapseFromToContainer collapseRight">
          <div className="collapseFromToContainer">
            <Text className="collapseTitle">Destino</Text>
            <Text className="collapseSubtitle">BASE BARRANCABERMEJA</Text>
          </div>
        </div>
      </div>
    </div>
  );

  /*Acordion to vehicles selection */
  const actionsOptionsVehiclesSelection = [
    {
      key: 0,
      style: { border: "1px solid #dddddd", borderRadius: "4px" },
      label: <TitleComponent state={"Carga"} id={0} />,
      showArrow: false,
      children: (
        <div className="collapseInformationWrapper">
          {vehiclesSections.map((section, index) => (
            <div className="collapseInformationContainer" key={index}>
              <div className="collapseResumeWrapper">
                <div className="collapseTopSection">
                  <Select
                    showSearch
                    placeholder="Agregar vehículo"
                    style={{ width: "28%", height: "45px" }}
                    optionFilterProp="children"
                    value={vehiclesSelected.find((v) => v.key === index)?.description || null}
                    options={filteredVehiclesOptions.map((option: ISelectOptionOrders) => ({
                      value: option.value,
                      key: option.value,
                      label: option.label
                    }))}
                    onSelect={(value) => {
                      const selectedVehicle = optionsVehicles.find(
                        (option: { value: string }) => option.value === value
                      );
                      addVehicle(index, selectedVehicle);
                    }}
                    listHeight={510}
                    dropdownStyle={{ width: "600px" }}
                  />
                  <Trash
                    size={18}
                    onClick={() => removeVehiclesSection(index)}
                    style={{ cursor: index === 0 ? "not-allowed" : "pointer" }}
                  />
                </div>
                {dataCarga.filter((a) => a.id_type_material === 3) ? (
                  <>
                    <div className="collapseResumeContainer">
                      <div className="collapseResum">
                        <div className="collapseResumItem collapseBorder">
                          <Text className="collapseText">Volumen utilizado</Text>
                          <Text className="collapseText collapseBold">
                            {vehiclesSelected.length === 0 ? 0 : volumeUsedPercentage.toFixed(2)} %
                          </Text>
                        </div>
                        <div className="collapseResumItem collapseBorder">
                          <Text className="collapseText">Volumen máximo</Text>
                          <Text className="collapseText collapseBold">
                            {totalVolume.toFixed(2)} m3
                          </Text>
                        </div>
                        <div className="collapseResumItem collapseBorder">
                          <Text className="collapseText">Peso utilizado</Text>
                          <Text className="collapseText collapseBold">
                            {vehiclesSelected.length === 0 ? 0 : weightUsedPercentage.toFixed(2)} %
                          </Text>
                        </div>
                        <div className="collapseResumItem">
                          <Text className="collapseText">Peso máximo</Text>
                          <Text className="collapseText collapseBold">
                            {totalWeight.toFixed(2)} kg
                          </Text>
                        </div>
                      </div>
                    </div>
                    <div className="collapseResumeContainer">
                      <div className="collapseResum">
                        <div className="collapseResumItem collapseBorder">
                          <Text className="collapseText">Volumen productos</Text>
                          <Text className="collapseText collapseBold">{usedVolume} m3</Text>
                        </div>
                        <div className="collapseResumItem collapseBorder">
                          <Text className="collapseText">Peso productos</Text>
                          <Text className="collapseText collapseBold">{usedWeight} kg</Text>
                        </div>
                        <div className="collapseResumItem collapseBorder">
                          <Text className="collapseText">Productos</Text>
                          <Text className="collapseText collapseBold">
                            {dataCarga.reduce((total, item) => total + item.quantity, 0)}/40
                          </Text>
                        </div>
                        <div className="collapseResumItem">
                          <Button disabled className="collapseBaggageButton">
                            Embalaje
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="collapsePersonsResumeContainer">
                    <div className="collapsePersonsResum">
                      <div className="collapsePersonsResumItem collapsePersonsBorder">
                        <Text className="collapsePersonsText">Personas</Text>
                        <Text className="collapsePersonsText collapsePersonsBold">{`5/${totalPersons}`}</Text>
                      </div>
                      <div className="collapsePersonsResumItem">
                        <Button disabled className="collapsePersonsAcomodationButton">
                          Acomodación
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                {dataCarga.filter((a) => a.id_type_material === 2) ? (
                  <Table
                    columns={columnsVehiclesMaterial}
                    dataSource={dataCarga}
                    pagination={false}
                    rowSelection={rowSelection}
                    rowClassName={(record) =>
                      selectedRowKeys.includes(record.id) ? "selectedRow" : ""
                    }
                  />
                ) : (
                  <Table
                    columns={columnsVehiclesPerson}
                    dataSource={[]}
                    pagination={false}
                    rowSelection={rowSelection}
                    rowClassName={(record) =>
                      selectedRowKeys.includes(record.id) ? "selectedRow" : ""
                    }
                  />
                )}
              </div>
            </div>
          ))}
          <div className="collapseButtons">
            <Button className="collapseAddVehicleButton" onClick={addVehiclesSections}>
              Agregar vehíchulo
            </Button>
            <Button className="collapseSaveButton">Guardar</Button>
          </div>
        </div>
      )
    }
  ];

  const handleComplete = () => {
    // Handle form completion logic here
  };
  const tabChanged = ({ prevIndex, nextIndex }: { prevIndex: number; nextIndex: number }) => {
    console.log("prevIndex", prevIndex);
    console.log("nextIndex", nextIndex);
  };

  return (
    <>
      {contextHolder}
      <Flex className="mainCreateOrder">
        <Flex className="orderContainer">
          <Flex style={{ flexDirection: "column" }}>
            <Flex style={{ width: "100%", justifyContent: "center" }}>
              <Flex style={{ padding: "16px 0" }}>
                <Flex className="stepper">
                  <Flex>
                    <Flex justify="space-evenly" style={{ width: "100%" }}>
                      <Steper
                        steps={steps.map((step, index) => ({
                          title: step.title,
                          active: currentStepIndex == index,
                          completed: currentStepIndex > index
                        }))}
                      />
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex style={{ flexDirection: "column", padding: "24px 0" }}>
              <Flex style={{ justifyContent: "space-between" }}>
                <div>
                  <Title style={{ fontWeight: "700", fontSize: "24px", lineHeight: "36px" }}>
                    {view === "solicitation"
                      ? "Solicitud de transferencia"
                      : view === "vehicles"
                        ? "Asignación de vehículos"
                        : "Selección de proveedor"}
                  </Title>
                  {view === "vehicles" && (
                    <Flex className="vehiclesSubtitle" gap={10}>
                      <label className="vehiclesSubtitleSugestion">
                        <p>Vehículos sugeridos</p>
                      </label>
                      {transferRequest.general?.transferRequestVehiclesSugest?.map((veh) => (
                        <div className="vehiclesSubtitleInformation" key={veh.id}>
                          <p className="vehiclesSubtitleInformationVehicle">{veh.vehicle_type_desc}</p>
                          <label className="vehiclesSubtitleInformationQuantity">
                            <p className="vehiclesSubtitleInformationQuantityNumber">
                              {veh.units.toString().padStart(2, "0")}
                            </p>
                          </label>
                        </div>
                      ))}
                    </Flex>
                  )}
                </div>
                <Flex
                  gap={24}
                  style={{
                    height: "48px"
                  }}
                >
                  {view === "carrier" && (
                    <PrincipalButton type="default" onClick={() => setModalCarrier(true)}>
                      Proveedores
                    </PrincipalButton>
                  )}
                  <PrincipalButton
                    className="active"
                    onClick={() => {
                      setOpenDrawer(true);
                    }}
                  >
                    <text style={{ fontSize: "16px", lineHeight: "24px", fontWeight: "600" }}>
                      Tracking
                    </text>
                    <CaretDoubleRight size={16} />
                  </PrincipalButton>
                </Flex>
                <Drawer
                  title="Tracking"
                  placement="right"
                  open={openDrawer}
                  onClose={() => {
                    setOpenDrawer(false);
                  }}
                  closable={true}
                  key="right"
                  footer={
                    <>
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                        }}
                        className="active"
                        style={{
                          borderRadius: "10px",
                          padding: "10px",
                          border: "none",
                          float: "right"
                        }}
                      >
                        Agregar
                      </button>
                    </>
                  }
                >
                  <Card style={{ width: "100%", padding: "0px" }}>
                    <Row>
                      <Col span={2}>
                        <DotsSixVertical style={{ fontSize: "20px" }} />
                      </Col>
                      <Col span={18}>
                        <p>Izaje</p>
                        <p>Bogotá Centro</p>
                        <p>
                          <b>Inicio</b> 27 Junio 2024 - 02:15
                        </p>
                        <p>
                          <b>Inicio</b> 28 Junio 2024 - 14:30
                        </p>
                      </Col>
                      <Col span={4} style={{ textAlign: "right" }}>
                        <p>
                          <button
                            className="active"
                            style={{ width: "24px", border: "none", borderRadius: "5px" }}
                          >
                            1
                          </button>{" "}
                        </p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>
                          <Pencil style={{ fontSize: "20px" }} />
                          <Trash style={{ fontSize: "20px" }} />
                        </p>
                      </Col>
                    </Row>
                  </Card>
                  <div className="carddivider"></div>
                  <Card style={{ width: "100%", padding: "0px" }}>
                    <Row>
                      <Col span={2}>
                        <DotsSixVertical style={{ fontSize: "20px" }} />
                      </Col>
                      <Col span={18}>
                        <p>Carga</p>
                        <p>Bogotá Centro</p>
                        <p>Cajica Plaza</p>
                        <p>
                          <b>Inicio</b> 27 Junio 2024 - 02:15
                        </p>
                        <p>
                          <b>Inicio</b> 28 Junio 2024 - 14:30
                        </p>
                      </Col>
                      <Col span={4} style={{ textAlign: "right" }}>
                        <p>
                          <button
                            className="active"
                            style={{ width: "24px", border: "none", borderRadius: "5px" }}
                          >
                            2
                          </button>{" "}
                        </p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>
                          <Pencil style={{ fontSize: "20px" }} />
                          <Trash style={{ fontSize: "20px" }} />
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </Drawer>
              </Flex>
            </Flex>
            {view === "solicitation" ? (
              <PricingStepOne ordersId={ordersId} orders={orders} />
            ) : view === "vehicles" ? (
              <div>
                <Flex style={{ padding: "24px 0", flexDirection: "column" }} gap={32}>
                  {transferRequest?.stepTwo?.journey?.map((a, index) => (
                    <VehiclesSelection
                      key={"vehicles-" + index}
                      journey={a}
                      transferRequest={transferRequest}
                      index={index}
                      id_journey={a.id_journey}
                      start_location_desc={a.start_location_desc}
                      end_location_desc={a.end_location_desc}
                      id_type_service={a.id_type_service}
                      setIsNextStepActive={setIsNextStepActive}
                    />
                  ))}
                </Flex>
              </div>
            ) : (
              <PricingStepThree
                data={transferRequest?.stepThree || { journey: [] }}
                control={control}
              />
            )}
          </Flex>
        </Flex>
        <Flex justify="space-between" style={{ marginTop: "24px", height: "53px" }}>
          <PrincipalButton type="default" onClick={handleBack}>
            Atras
          </PrincipalButton>
          <Flex gap="middle" align="flex-end">
            {/* view === "vehicles" && <Button className="saveButton">Guardar como draft</Button> */}
            <PrincipalButton
              disabled={!isNextStepActive}
              onClick={handleNext}
              loading={isSubmitting || isLoading}
            >
              {view !== "carrier" ? "Siguiente" : "Finalizar"}
            </PrincipalButton>
          </Flex>
        </Flex>
      </Flex>
      <ModalSelectCarrierPricing
        open={modalCarrier}
        handleModalCarrier={(val: boolean) => setModalCarrier(val)}
        mutateStepthree={mutateStepthree}
        view={view}
        setView={setView}
      />
    </>
  );
}