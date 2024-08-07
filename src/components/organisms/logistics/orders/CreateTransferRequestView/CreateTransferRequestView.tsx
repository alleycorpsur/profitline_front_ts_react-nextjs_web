import {
  Flex,
  Tabs,
  TabsProps,
  Typography,
  message,
  Collapse,
  Row,
  Col,
  Select,
  Switch,
  DatePicker,
  DatePickerProps,
  GetProps,
  TimePicker,
  Table,
  TableProps,
  AutoComplete,
  Input,
  ConfigProvider,
  InputNumber,
  Button,
  Steps,
  Drawer,
  Card,
  Modal
} from "antd";
import React, { useRef, useEffect, useState, useContext } from "react";

// dayjs locale
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es-us";
dayjs.locale("es");

// mapbox
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import MapboxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

// components
import { SideBar } from "@/components/molecules/SideBar/SideBar";
import { NavRightSection } from "@/components/atoms/NavRightSection/NavRightSection";

import { ProjectFormTab } from "@/components/molecules/tabs/Projects/ProjectForm/ProjectFormTab";
import { addProject } from "@/services/projects/projects";

//schemas
import { IListData, ILocation, ITransferOrderRequest, ITransferOrdersRequest } from "@/types/logistics/schema";

//locations
import { getAllLocations } from "@/services/logistics/locations";

//interfaces
import { ICreatePayload } from "@/types/projects/IProjects";

//vars
import { CREATED } from "@/utils/constants/globalConstants";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Calendar,
  Package,
  UserList,
  NewspaperClipping,
  Pencil,
  Trash,
  DotsSixVertical,
  CaretDoubleRight,
  Radioactive,
  Warning
} from "@phosphor-icons/react";

import "../../../../../styles/_variables_logistics.css";

import "./createtransferrequest.scss";
import { UploadDocumentButton } from "@/components/atoms/UploadDocumentButton/UploadDocumentButton";
import TextArea from "antd/es/input/TextArea";
import TabPane from "antd/es/tabs/TabPane";

import FormWizard from "react-form-wizard-component";
import "react-form-wizard-component/dist/style.css";
import UploadDocumentChild from "@/components/atoms/UploadDocumentChild/UploadDocumentChild";

const { Title, Text } = Typography;

export const CreateTransferRequestView = () => {
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  /* Data */
  const [orders, setOrders] = useState<ITransferOrdersRequest>();
  const [orderRequest, setOrderRequest] = useState<ITransferOrderRequest[]>([]);

  /* Tipo de viaje */
  const [typeactive, setTypeActive] = useState("1");

  /* Agendamiento */
  const origin = useRef<any>([]);
  const destination = useRef<any>([]);
  const [origenIzaje, setOrigenIzaje] = useState(false);
  const [destinoIzaje, setDestinoIzaje] = useState(false);
  const [fechaInicial, setFechaInicial] = useState<Dayjs | null>(null);
  const [horaInicial, setHoraInicial] = useState<Dayjs | null>(null);

  /* MAPBOX */
  const mapsAccessToken =
    "pk.eyJ1IjoiamNib2JhZGkiLCJhIjoiY2x4aWgxejVsMW1ibjJtcHRha2xsNjcxbCJ9.CU7FHmPR635zv6_tl6kafA"; //import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN,

  const mapContainerRef = useRef(null);
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v12");
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState([]);
  const [distance, setDistance] = useState<any>(null);
  const [timetravel, setTimeTravel] = useState<any>(null);
  const [suggestions, setSuggestions] = useState([]);

  const [expand, setExpand] = useState(false);
  const initialItemCount = 4;
  const directions = routeInfo.length > 0 ? routeInfo[0]["legs"][0]["steps"] : [];
  const displayedDirections = expand ? directions : directions.slice(0, initialItemCount);

  const [locations, setLocations] = useState<ILocation[]>([]);
  const [locationOptions, setLocationOptions] = useState<any>([]);

  const handleToggleExpand = () => {
    setExpand(!expand);
  };

  const geocodingClient = MapboxGeocoding({
    accessToken: mapsAccessToken
  });

  const [openDrawer, setOpenDrawer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("routeInfo==>", routeInfo);

  useEffect(() => {
    loadLocations();
  });

  const loadLocations = async () => {
    if (locations.length > 0) return;
    const result = await getAllLocations();
    if (result.data.data.length > 0) {
      console.log(result.data.data);

      const listlocations: any[] | ((prevState: ILocation[]) => ILocation[]) = [];
      const listlocationoptions: { label: any; value: any }[] = [];

      result.data.data.forEach((item) => {
        listlocations.push(item);
        listlocationoptions.push({ label: item.description, value: item.id });
      });

      setLocations(listlocations);
      setLocationOptions(listlocationoptions);
    }
  };

  /* Event Handlers */
  // const onCreateProject = async (data: ICreatePayload) => {
  //   console.log("DATA PARA POST: ", data);
  //   if (!data.logo) return;
  //   try {
  //     const response = await addProject(data);
  //     if (response.status === CREATED) {
  //       messageApi.open({
  //         type: "success",
  //         content: "El proyecto fue creado exitosamente."
  //       });
  //       push("/");
  //     }
  //   } catch (error) {
  //     messageApi.open({
  //       type: "error",
  //       content: "Oops, hubo un error por favor intenta mas tarde."
  //     });
  //   }
  // };

  // Cambia origen
  const onChangeOrigin = (value: any) => {
    console.log("origen:" + value);
    locations.forEach(async (item, index) => {
      if (item.id == value) {
        console.log(item);
        origin.current = [item.latitude, item.longitude];
        calcRouteDirection();
      }
    });
  };

  // Cambia destino
  const onChangeDestino = async (value: any) => {
    console.log("destino:" + value);
    locations.forEach(async (item, index) => {
      if (item.id == value) {
        console.log(item);
        destination.current = [item.latitude, item.longitude];
        calcRouteDirection();
      }
    });
  };

  /* MAPBOX */

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = mapsAccessToken;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: { lon: -74.07231699675322, lat: 4.66336863727521 }, // longitude and latitude
      zoom: 12,
      attributionControl: false
    });

    map.on("style.load", () => {
      // Add the compass control
      const compassControl = new mapboxgl.NavigationControl({
        showCompass: true
      });
      map.addControl(compassControl, "top-right");

      // Create a marker at the starting position
      if (origin) {
        const startMarker = new mapboxgl.Marker().setLngLat(origin.current).addTo(map);
      }

      // Create a marker at the finish position
      if (destination) {
        const finalMarker = new mapboxgl.Marker().setLngLat(destination.current).addTo(map);
      }

      if (routeGeometry) {
        console.log(routeGeometry);
        const datajson: GeoJSON.Feature = {
          type: "Feature",
          geometry: routeGeometry,
          properties: {}
        };

        map.addSource("route", {
          type: "geojson",
          data: datajson
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "#3FB1CE",
            "line-width": 6
          }
        });
      }
      // Get the route bounds
      const bounds = routeGeometry.coordinates.reduce(
        (bounds: any, coord: any) => bounds.extend(coord),
        new mapboxgl.LngLatBounds()
      );

      // Zoom out to fit the route within the map view
      map.fitBounds(bounds, {
        padding: 50
      });
    });

    // return () => {
    //   map.remove();
    // };
  }, [mapStyle, routeGeometry, origin, destination]);

  // calculate direction
  const calcRouteDirection = async () => {
    //if (origin.length > 2) {
    console.log("entro0");
    console.log("entro1:" + origin.current.length);
    console.log("entro2:" + destination.current.length);
    if (origin.current.length == 0 || destination.current.length == 0) return;

    try {
      // const originp = 'Bogotá';
      // try {
      //   console.log('entro1');
      //   const response = await geocodingClient
      //     .forwardGeocode({
      //       query: originp,
      //       types: ["place"],
      //       limit: 1,
      //     })
      //     .send();

      //   const destinationCoordinates = response.body.features[0].center;
      //   console.log(destinationCoordinates);
      //   //originCoordinates = destinationCoordinates;
      //   setOrigin(destinationCoordinates);
      // } catch (error) {
      //   console.error("Error calculating directions:", error);
      //   throw error;
      // }

      //setOrigin([-74.07231699675322, 4.66336863727521]);
      //setDestination([-74.027990000000000, 4.918570000000000]);

      console.log(origin);
      console.log(destination);

      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.current[0]},${origin.current[1]};${destination.current[0]},${destination.current[1]}?steps=true&geometries=geojson&access_token=${mapsAccessToken}`
      );

      const routes = response.data.routes;
      console.log("routes=>", routes);
      setRouteInfo(routes);
      // Check if any routes are returned
      if (routes.length > 0) {
        const { distance, duration, geometry } = routes[0];

        // Valid directions, use the distance and duration for further processing
        const directions = {
          distance,
          duration
        };
        setRouteGeometry(geometry); // Set the route geometry
        setDistance(distance);
        setTimeTravel(duration);
        return directions;
      } else {
        // No routes found
        throw new Error("Unable to calculate directions");
      }
    } catch (error) {
      // Handle error
      console.error("Error calculating directions:", error);
      throw error;
    }
    //}
  };

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

  /* Carga */

  const columnsCarga: TableProps<any>["columns"] = [
    {
      title: "Cantidad",
      dataIndex: "quanity",
      key: "name",
      render: (text) => <Text>{text}</Text>,
      sorter: (a, b) => a.quantity - b.quantity,
      showSorterTooltip: false
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "age",
      render: (text) => <Text>{text}</Text>,
      sorter: (a, b) => a.id - b.id,
      showSorterTooltip: false
    },
    {
      title: "Nombre",
      dataIndex: "description",
      key: "address",
      render: (text) => <Text>{text}</Text>,
      sorter: (a, b) => a.description.localeCompare(b.description),
      showSorterTooltip: false
    },
    {
      title: "Volumen",
      dataIndex: "m3_volume",
      key: "address",
      render: (amount) => <Text>{amount}</Text>,
      sorter: (a, b) => a.m3_volume - b.m3_volume,
      showSorterTooltip: false
    },
    {
      title: "Alto",
      dataIndex: "mt_height",
      key: "address",
      render: (amount) => <Text>{amount} m</Text>,
      sorter: (a, b) => a.mt_height - b.mt_height,
      showSorterTooltip: false
    },
    {
      title: "Ancho",
      key: "address",
      dataIndex: "mt_length",
      render: (amount) => <Text>{amount} m</Text>,
      sorter: (a, b) => a.mt_length - b.mt_length,
      showSorterTooltip: false
    },
    {
      title: "Largo",
      key: "address",
      dataIndex: "mt_width",
      render: (amount) => <Text>{amount} m</Text>,
      sorter: (a, b) => a.mt_width - b.mt_width,
      showSorterTooltip: false
    },
    {
      title: "Peso",
      key: "address",
      dataIndex: "kg_weight",
      render: (amount) => <Text>{amount} kg</Text>,
      sorter: (a, b) => a.kg_weight - b.kg_weight,
      showSorterTooltip: false
    },
    {
      title: "Alertas",
      dataIndex: "address",
      key: "address",
      render: (text, record) => (
        <Flex style={{ gap: "6px", justifyContent: "flex-end" }}>
          <Button style={{ backgroundColor: "#F7F7F7" }} icon={<Radioactive size={"1.3rem"} />} />
          <Button style={{ backgroundColor: "#F7F7F7" }} icon={<Warning size={"1.3rem"} />} />
        </Flex>
      )
    }
  ];

  const columnsCargaPersonas: TableProps<any>["columns"] = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text>{text}</Text>,
      sorter: (a, b) => a.name.localeCompare(b.name),
      showSorterTooltip: false
    },
    {
      title: "Telefono",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <Text>{text}</Text>,
      sorter: (a, b) => a.contact_number - b.contact_number,
      showSorterTooltip: false
    },
    {
      title: "PSL",
      dataIndex: "psl",
      key: "psl",
      render: (text) => <Text>{text}</Text>,
      sorter: (a, b) => a.id_psl - b.id_psl,
      showSorterTooltip: false
    },
    {
      title: "CC",
      dataIndex: "typeid",
      key: "typeid",
      render: (text) => <Text>{text}</Text>,
      sorter: (a, b) => a.id_contact - b.id_contact,
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

  /* Responsables */

  /* informacion adicional */
  interface FileObject {
    docReference: string;
    file: File | undefined;
  }
  const [files, setFiles] = useState<FileObject[] | any[]>([]);

  const mockFiles = [
    { id: 1, title: "archivo 1", isMandatory: true },
    { id: 2, title: "archivo 2", isMandatory: true },
    { id: 3, title: "archivo 3", isMandatory: false }
  ];

  const columnsRequerimientosAdicionales = [
    {
      title: "Nombre",
      dataIndex: "namereq",
      key: "namereq"
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
      key: "quantity"
    }
  ];

  /* acoordion */
  const actionsOptions = [
    {
      key: 0,
      style: { border: "1px solid #dddddd", borderRadius: "4px" },
      label: (
        <div className="collapseByAction__label">
          <Title className="collapseByAction__label__text" level={4}>
            Datos del viaje
          </Title>
        </div>
      ),
      children: (
        <Flex vertical className="travelDataWrapper">
          <Flex>
            <Row style={{ width: "100%" }}>
              <Col span={12} style={{ width: "100%" }}>
                <Flex vertical style={{ width: "90%" }}>
                  <Row className="travelDataInfoBox">
                    <Col span={12} className="travelDataTitles">
                      <p>
                        <label>Distancia Total</label>
                      </p>
                      <p>
                        <label>Tiempo Estimado</label>
                      </p>
                      {/*travelData?.service_type !== "3" ? (
                    <>*/}
                      <p>
                        <label>Volumen</label>
                      </p>
                      <p>
                        <label>Peso</label>
                      </p>
                      {/*</>
                  ) : (
                    <p>Personas</p>
                  )*/}
                    </Col>
                    <Col span={12} className="travelDataValues">
                      <p>
                        <label>{distance}</label>
                      </p>
                      <p>
                        <label>{timetravel} hr</label>
                      </p>
                      {/*travelData?.service_type !== "3" ? (
                    <>*/}
                      <p>
                        <label>{/*travelData?.volume*/}00</label>
                      </p>
                      <p>
                        <label>{/*travelData?.weight*/}00</label>
                      </p>
                      {/*</>
                  ) : (
                    <p>{travelData?.carrier_request_persons?.length}</p>
                  )}*/}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12} style={{ paddingTop: "0.5rem" }}>
                      <p style={{ paddingTop: "1rem" }}>
                        <label>
                          <b>Tipo de viaje</b>
                        </label>
                      </p>
                    </Col>
                    <Col span={12} style={{ paddingTop: "0.5rem", textAlign: "right" }}>
                      <p style={{ paddingTop: "1rem" }}>
                        <label>
                          <b>{/*travelData?.service_type*/}Carga</b>
                        </label>
                      </p>
                    </Col>
                    <Col span={24} style={{ paddingTop: "1rem" }}>
                      <hr style={{ borderTop: "1px solid #f7f7f7" }}></hr>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12} style={{ paddingTop: "0.5rem" }}>
                      <p style={{ paddingTop: "1rem" }}>
                        <b>Punto Origen</b>
                      </p>
                    </Col>
                    <Col span={12} style={{ paddingTop: "0.5rem", textAlign: "right" }}>
                      <p style={{ paddingTop: "0.5rem" }}>
                        <label>
                          <b>{/*travelData?.start_location*/}Bogotá Centro</b>
                        </label>
                      </p>
                    </Col>
                    <Col span={24} style={{ paddingTop: "1rem" }}>
                      <hr style={{ borderTop: "1px solid #f7f7f7" }}></hr>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12} style={{ paddingTop: "0.5rem" }}>
                      <p style={{ paddingTop: "1rem" }}>
                        <label>
                          <b>Punto Destino</b>
                        </label>
                      </p>
                    </Col>
                    <Col span={12} style={{ paddingTop: "0.5rem", textAlign: "right" }}>
                      <p style={{ paddingTop: "0.5rem" }}>
                        <label>
                          <b>{/*travelData?.end_location*/}Bogotá Centro</b>
                        </label>
                      </p>
                    </Col>
                    <Col span={24} style={{ paddingTop: "1rem" }}>
                      <hr style={{ borderTop: "1px solid #f7f7f7" }}></hr>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12} style={{ paddingTop: "0.5rem" }}>
                      <p style={{ paddingTop: "1rem" }}>
                        <label>
                          <b>Fecha y hora inicial</b>
                        </label>
                      </p>
                    </Col>
                    <Col span={12} style={{ paddingTop: "0.5rem", textAlign: "right" }}>
                      <p style={{ paddingTop: "1rem" }}>
                        <label>
                          <b>{/*travelData?.start_date?.split(" ")[1]*/} h</b>
                        </label>
                      </p>
                      <p style={{ paddingTop: "0.5rem" }}>
                        {/*travelData?.start_date ? (
                      <b>{formatDatePlaneWithoutComma(travelData?.start_date?.split(" ")[0])}</b>
                    ) : (
                      <p>No date</p>
                    )}*/}
                        <b>01/08/2024</b>
                      </p>
                    </Col>
                    <Col span={24} style={{ paddingTop: "1rem" }}>
                      <hr style={{ borderTop: "1px solid #f7f7f7" }}></hr>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12} style={{ paddingTop: "0.5rem" }}>
                      <p style={{ paddingTop: "1rem" }}>
                        <label>
                          <b>Fecha y hora final</b>
                        </label>
                      </p>
                    </Col>
                    <Col span={12} style={{ paddingTop: "0.5rem", textAlign: "right" }}>
                      <p style={{ paddingTop: "1rem" }}>
                        <label>
                          <b>{/*travelData?.end_date?.split(" ")[1]*/} h</b>
                        </label>
                      </p>
                      <p style={{ paddingTop: "0.5rem" }}>
                        {/*travelData?.end_date ? (
                      <b>{formatDatePlaneWithoutComma(travelData?.end_date?.split(" ")[0])}</b>
                    ) : (
                      <p>No date</p>
                    )}*/}
                        <b>01/08/2024</b>
                      </p>
                    </Col>
                  </Row>
                </Flex>
              </Col>
              <Col span={12}>
                <Flex vertical className="travelDataMapResume" style={{ width: "100%" }}>
                  <div
                    ref={mapContainerRef}
                    style={{
                      width: "100%",
                      height: "50vh",
                      border: "1px #F7F7F7 solid"
                    }}
                  />
                </Flex>
              </Col>
            </Row>
          </Flex>
        </Flex>
      )
    },
    {
      key: 1,
      style: { border: "1px solid #dddddd", borderRadius: "4px" },
      label: (
        <div className="collapseByAction__label">
          <Title className="collapseByAction__label__text" level={4}>
            Responsables
          </Title>
        </div>
      ),
      children: (
        <Flex>
          <Row style={{ width: "100%", marginBottom: "18px" }}>
            <Col span={24}>
              <Flex vertical className="productsContainer" style={{ width: "100%" }}>
                <Row>
                  <Col span={12}>
                    <p style={{ paddingTop: "1rem" }}>
                      <label>
                        <b>PSL:</b> Product service line 1
                      </label>
                    </p>
                    <p style={{ paddingTop: "0.5rem" }}>
                      <label>
                        &nbsp;&nbsp;&nbsp;<b>CC:</b> Centro de costos 1
                      </label>
                    </p>
                  </Col>
                  <Col span={12} style={{ paddingTop: "0.5rem", textAlign: "right" }}>
                    <p style={{ paddingTop: "1rem" }}>
                      <label>
                        <b>100%</b>
                      </label>
                    </p>
                    <p style={{ paddingTop: "0.5rem" }}>
                      <label>
                        <b>100%</b>
                      </label>
                    </p>
                  </Col>
                  <Col span={24} style={{ paddingTop: "1rem" }}>
                    <hr style={{ borderTop: "1px solid #f7f7f7" }}></hr>
                  </Col>
                  <Col span={12}>
                    <p style={{ paddingTop: "1rem" }}>
                      <label>
                        <b>PSL:</b> Product service line 1
                      </label>
                    </p>
                    <p style={{ paddingTop: "0.5rem" }}>
                      <label>
                        &nbsp;&nbsp;&nbsp;<b>CC:</b> Centro de costos 1
                      </label>
                    </p>
                  </Col>
                  <Col span={12} style={{ paddingTop: "0.5rem", textAlign: "right" }}>
                    <p style={{ paddingTop: "1rem" }}>
                      <label>
                        <b>100%</b>
                      </label>
                    </p>
                    <p style={{ paddingTop: "0.5rem" }}>
                      <label>
                        <b>100%</b>
                      </label>
                    </p>
                  </Col>
                </Row>
              </Flex>
            </Col>
          </Row>
        </Flex>
      )
    },
    {
      key: 2,
      style: { border: "1px solid #dddddd", borderRadius: "4px" },
      label: (
        <div className="collapseByAction__label">
          <Title className="collapseByAction__label__text" level={4}>
            Información adicional
          </Title>
        </div>
      ),
      children: (
        <Flex style={{ marginBottom: "24px" }}>
          <Row style={{ width: "100%" }}>
            <Col span={24}>
              <Flex vertical style={{ width: "100%", marginTop: "24px" }}>
                <h4 style={{ fontSize: "20px", lineHeight: "32px", fontWeight: "400" }}>
                  Documentos
                </h4>
                <Row className="mainUploadDocuments">
                  {/*transferOrder?.transfer_order_documents?.map((file) => (
                      <Col span={12} style={{ padding: "15px" }} key={`file-${file.id}`}>
                        <UploadDocumentButton
                          key={file.id}
                          title={file.document_type_desc}
                          isMandatory={!file.active}
                          aditionalData={file.id}
                          setFiles={() => { } }
                          
                          disabled
                        >
                          {file?.url_document ? (
                            <UploadDocumentChild
                              linkFile={file.url_document}
                              nameFile={file.url_document.split("-").pop() || ""}
                              onDelete={() => { } }
                              showTrash={false} />
                          ) : undefined}
                        </UploadDocumentButton>
                      </Col>
                    ))}*/}
                  <Col span={12} style={{ padding: "15px" }}>
                    <UploadDocumentButton
                      key={1}
                      title={"No documents"}
                      isMandatory={false}
                      aditionalData={1}
                      setFiles={() => {}}
                      disabled
                    >
                      <UploadDocumentChild
                        linkFile={"file.url_document"}
                        nameFile={"file.url_document"}
                        onDelete={() => {}}
                        showTrash={false}
                      />
                    </UploadDocumentButton>
                  </Col>
                  <Col span={24} style={{ paddingTop: "1rem" }}>
                    <hr style={{ borderTop: "1px solid #f7f7f7" }}></hr>
                  </Col>
                </Row>
                <Row style={{ marginTop: "2rem" }}>
                  <Col span={12}>
                    <h3>Datos de contacto</h3>
                    <p>&nbsp;</p>
                    <h4>Contacto inicial</h4>
                    {/*transferOrder?.transfer_order_contacts?.filter(x=> x.contact_type == 1).map((contact) => (
                      <Row style={{paddingTop:'0.5rem'}} key={contact.id}>*/}
                    <Row style={{ paddingTop: "0.5rem" }}>
                      {/*When integrated delete this line*/}
                      <Col span={12} style={{ paddingLeft: "25px" }}>
                        {"Daniel"}
                      </Col>
                      <Col span={8} style={{ textAlign: "right" }}>
                        {"18293018293012"}
                      </Col>
                    </Row>
                    {/*))}*/}
                    <p>&nbsp;</p>
                    <h4>Contacto final</h4>
                    {/*{transferOrder?.transfer_order_contacts?.filter(x=> x.contact_type == 2).map((contact) => (
                      <Row style={{paddingTop:'0.5rem'}} key={contact.id}>*/}
                    <Row style={{ paddingTop: "0.5rem" }}>
                      <Col span={12} style={{ paddingLeft: "25px" }}>
                        {"Daniel"}
                      </Col>
                      <Col span={8} style={{ textAlign: "right" }}>
                        {"1391239183123"}
                      </Col>
                    </Row>
                    {/*}))}*/}
                    <p>&nbsp;</p>
                    <Row style={{ paddingTop: "1rem" }}>
                      <Col span={12}>
                        <h4>Cliente final</h4>
                      </Col>
                      <Col span={8} style={{ textAlign: "right" }}>
                        {/*transferOrder?.client_desc*/}Daniel
                      </Col>
                    </Row>
                    <p>&nbsp;</p>
                    <h4>Requerimientos adicionales</h4>
                    {/*<Row style={{paddingTop:'1rem'}}>
                        <Col span={24}>
                        {transferOrder?.transfer_order_other_requeriments?.map((req) => (
                          <div className="selected" key={req.id}>{req.other_requirement_desc} <small>{req.quantity}</small></div>
                         ))}
                        </Col>
                      </Row>*/}
                  </Col>
                  <Col span={12}>
                    <h3>Instrucciones especiales</h3>
                    <p>&nbsp;</p>
                    <p style={{ minHeight: "250px" }}>
                      {/*transferOrder?.observation*/}Observacion
                    </p>
                  </Col>
                </Row>
              </Flex>
            </Col>
          </Row>
        </Flex>
      )
    },
    {
      key: 3,
      style: { border: "1px solid #dddddd", borderRadius: "4px" },
      label: (
        <div className="collapseByAction__label">
          <Title className="collapseByAction__label__text" level={4}>
            {(typeactive == "1" || typeactive == "2") && `Materiales`}
            {typeactive == "3" && `Personas`}
          </Title>
        </div>
      ),
      children: (
        <div>
          <>
            <label className="locationLabels" style={{ display: "flex" }}>
              <text>Vehículo Sugerido</text>
            </label>
          </>
          {(typeactive == "1" || typeactive == "2") && (
            <>
              <Table columns={columnsCarga} />
            </>
          )}
          {typeactive == "3" && (
            <>
              <Table columns={columnsCargaPersonas} />
            </>
          )}
        </div>
      )
    }
  ];

  const tabitems: TabsProps["items"] = [
    {
      key: "1",
      label: "Tab 1",
      children: "Content of Tab Pane 1"
    },
    {
      key: "2",
      label: "Tab 2",
      children: "Content of Tab Pane 2"
    },
    {
      key: "3",
      label: "Tab 3",
      children: "Content of Tab Pane 3"
    }
  ];

  const handleComplete = () => {
    console.log("Form completed!");
    // Handle form completion logic here
  };
  const tabChanged = ({ prevIndex, nextIndex }: { prevIndex: number; nextIndex: number }) => {
    console.log("prevIndex", prevIndex);
    console.log("nextIndex", nextIndex);
  };

  return (
    <>
      {contextHolder}
      <main className="mainCreateOrder">
        <SideBar />
        <Flex vertical className="containerCreateOrder">
          <Flex className="infoHeaderOrder">
            <Flex gap={"2rem"}>
              <Title level={2} className="titleName">
                Ordenes de transferencia
              </Title>
            </Flex>
            <Flex component={"navbar"} align="center" justify="space-between">
              <NavRightSection />
            </Flex>
          </Flex>
          {/* ------------Main Info Order-------------- */}
          <Row className="orderContainer">
            <Col>
              <Row style={{ width: "100%", justifyContent: "center" }}>
                <Col span={16} style={{ padding: "16px 0" }}>
                  <Flex justify="space-evenly">
                    <Steps
                      style={{ width: "100%" }}
                      size="small"
                      current={0}
                      iconPrefix={`-`}
                      items={[
                        {
                          title: "Solicitud de transferencia"
                        },
                        {
                          title: "Seleccion de vehiculos"
                        },
                        {
                          title: "Seleccion de proveedor"
                        }
                      ]}
                    />
                  </Flex>
                </Col>
              </Row>
              <Row style={{ display: "flex", flexDirection: "column", padding: "32px 0" }}>
                <Col style={{ display: "flex", justifyContent: "space-between" }}>
                  <Flex>
                    <Title style={{ fontWeight: "700", fontSize: "24px", lineHeight: "36px" }}>
                      Solicitud de transferencia
                    </Title>
                  </Flex>
                  <Flex>
                    <Button
                      style={{
                        width: "146px",
                        height: "48px",
                        padding: "12px 24px"
                      }}
                      type="default"
                      className="active"
                      onClick={() => {
                        setOpenDrawer(true);
                      }}
                    >
                      <text style={{ fontSize: "16px", lineHeight: "24px", fontWeight: "600" }}>
                        Tracking
                      </text>
                      <CaretDoubleRight size={16} />
                    </Button>
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
                  <Modal
                    width={"60%"}
                    footer=""
                    open={isModalOpen}
                    onOk={() => {
                      setIsModalOpen(false);
                    }}
                    onCancel={() => {
                      setIsModalOpen(false);
                    }}
                  >
                    <FormWizard
                      shape="circle"
                      color="#e74c3c"
                      stepSize="xs"
                      onComplete={handleComplete}
                      onTabChange={tabChanged}
                      nextButtonText="Siguiente"
                      backButtonText="Anterior"
                      finishButtonText="Finalizar"
                    >
                      <FormWizard.TabContent title="Tipo de Viaje" icon="ti-user">
                        <Title className="collapseByAction__label__text" level={4}>
                          Tipo de Viaje
                        </Title>
                        <Flex gap="middle">
                          <button
                            type="button"
                            id={"1"}
                            className={[
                              "tripTypes",
                              typeactive === "1" ? "active" : undefined
                            ].join(" ")}
                            onClick={handleTypeClick}
                          >
                            <div className="tripTypeIcons">
                              <img
                                className="icon"
                                loading="lazy"
                                alt=""
                                src="/images/logistics/truck.svg"
                              />
                              <div className="text">Carga</div>
                            </div>
                          </button>
                          <button
                            type="button"
                            id={"2"}
                            className={[
                              "tripTypes",
                              typeactive === "2" ? "active" : undefined
                            ].join(" ")}
                            onClick={handleTypeClick}
                          >
                            <div className="tripTypeIcons">
                              <img
                                className="icon"
                                loading="lazy"
                                alt=""
                                src="/images/logistics/izaje.svg"
                              />
                              <div className="text">Izaje</div>
                            </div>
                          </button>
                          <button
                            type="button"
                            id={"3"}
                            className={[
                              "tripTypes",
                              typeactive === "3" ? "active" : undefined
                            ].join(" ")}
                            onClick={handleTypeClick}
                          >
                            <div className="tripTypeIcons">
                              <img
                                className="icon"
                                loading="lazy"
                                alt=""
                                src="/images/logistics/users.svg"
                              />
                              <div className="text">Personal</div>
                            </div>
                          </button>
                        </Flex>
                      </FormWizard.TabContent>
                      <FormWizard.TabContent title="Agendamiento" icon="ti-settings">
                        <>
                          <Title className="collapseByAction__label__text" level={4}>
                            Agendamiento
                          </Title>
                          <Row>
                            <Col span={24} style={{ padding: "25px" }}>
                              <Row>
                                <label className="locationLabels">Punto Origen</label>
                                <br></br>

                                <Select
                                  showSearch
                                  placeholder="Buscar dirección inicial"
                                  className="puntoOrigen"
                                  style={{ width: "100%" }}
                                  onChange={onChangeOrigin}
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    option!
                                      .children!.toString()
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  {locationOptions.map(
                                    (option: {
                                      value: React.Key | null | undefined;
                                      label: string | null | undefined;
                                    }) => (
                                      <Select.Option value={option.value} key={option.value}>
                                        {option.label}
                                      </Select.Option>
                                    )
                                  )}
                                </Select>
                              </Row>
                              {typeactive != "2" && (
                                <Row style={{ marginTop: "1rem" }}>
                                  <label className="locationLabels">Punto Destino</label>
                                  <Select
                                    showSearch
                                    placeholder="Buscar dirección final"
                                    className="puntoOrigen"
                                    style={{ width: "100%" }}
                                    onChange={onChangeDestino}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option!
                                        .children!.toString()
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                  >
                                    {locationOptions.map(
                                      (option: {
                                        value: React.Key | null | undefined;
                                        label: string | null | undefined;
                                      }) => (
                                        <Select.Option value={option.value} key={option.value}>
                                          {option.label}
                                        </Select.Option>
                                      )
                                    )}
                                  </Select>
                                </Row>
                              )}
                              <Row style={{ marginTop: "1.5rem" }}>
                                <Col span={24}>
                                  <label className="locationLabels">Fecha y hora inicial</label>
                                </Col>
                                <Col span={8}>
                                  <DatePicker
                                    placeholder="Seleccione fecha"
                                    onChange={(value, dateString) => {
                                      //console.log('Selected Time: ', value);
                                      //console.log('Formatted Selected Time: ', dateString);
                                      setFechaInicial(value);
                                    }}
                                  />
                                </Col>
                                <Col span={8}>
                                  <TimePicker
                                    placeholder="Seleccione hora"
                                    format={"HH:mm"}
                                    minuteStep={15}
                                    hourStep={1}
                                    type={"time"}
                                    onChange={(value) => {
                                      console.log(value);
                                      setHoraInicial(value);
                                    }}
                                  />
                                </Col>
                                <Col span={8}>
                                  <Select
                                    placeholder="Seleccione"
                                    className="puntoOrigen"
                                    style={{ width: "100%" }}
                                    options={[{ value: "2", label: "Exacto" }]}
                                  />
                                </Col>
                              </Row>
                              <Row style={{ marginTop: "1.5rem" }}>
                                <Col span={24}>
                                  <label className="locationLabels">Fecha y hora final</label>
                                </Col>
                                <Col span={8}>
                                  <DatePicker
                                    placeholder="Seleccione fecha"
                                    onChange={(value, dateString) => {
                                      console.log("Selected Time: ", value);
                                      console.log("Formatted Selected Time: ", dateString);
                                    }}
                                  />
                                </Col>
                                <Col span={8}>
                                  <TimePicker
                                    placeholder="Seleccione hora"
                                    format={"HH:mm"}
                                    minuteStep={15}
                                    hourStep={1}
                                    type={"time"}
                                    onChange={(value) => console.log(value)}
                                  />
                                </Col>
                                <Col span={8}>
                                  <Select
                                    placeholder="Seleccione"
                                    className="puntoOrigen"
                                    style={{ width: "100%" }}
                                    options={[{ value: "2", label: "Exacto" }]}
                                  />
                                </Col>
                              </Row>
                              {routeGeometry && (
                                <Row className="divdistance">
                                  <Col span={12}>
                                    <p>
                                      <label>Distancia Total</label>
                                    </p>
                                    <p>
                                      <label>Tiempo Estimado</label>
                                    </p>
                                  </Col>
                                  <Col span={12} className="text-right">
                                    <p>
                                      <label>{distance}</label>
                                    </p>
                                    <p>
                                      <label>{timetravel}</label>
                                    </p>
                                  </Col>
                                </Row>
                              )}
                            </Col>
                            <Col span={24}>
                              <div
                                ref={mapContainerRef}
                                style={{
                                  width: "100%",
                                  height: "30vh",
                                  border: "1px #F7F7F7 solid"
                                }}
                              />
                            </Col>
                          </Row>
                        </>
                      </FormWizard.TabContent>
                      <FormWizard.TabContent title="Responsables" icon="ti-check">
                        <>
                          <Title className="collapseByAction__label__text" level={4}>
                            Responsables
                          </Title>
                          <label
                            className="locationLabels"
                            style={{ display: "flex", marginTop: "2rem" }}
                          >
                            <text>Company Code</text>
                          </label>
                          <Select
                            style={{ width: "350px" }}
                            options={[
                              { value: "1", label: "Halliburton" },
                              { value: "2", label: "Halliburton zona franca" }
                            ]}
                          />
                          <div className="divdistance">
                            <Row>
                              <Col span={10}>
                                <label
                                  className="locationLabels"
                                  style={{ display: "flex", marginTop: "2rem" }}
                                >
                                  <text>Product Service Line (PSL)</text>
                                </label>
                                <Select
                                  style={{ width: "100%" }}
                                  options={[{ value: "1", label: "PSL 1" }]}
                                />
                              </Col>
                              <Col span={8} style={{ paddingLeft: "30px" }}>
                                <label
                                  className="locationLabels"
                                  style={{ display: "flex", marginTop: "2rem" }}
                                >
                                  <text>Porcentaje PSL</text>
                                </label>
                                <InputNumber<number>
                                  style={{ width: "100%" }}
                                  defaultValue={100}
                                  min={0}
                                  max={100}
                                  formatter={(value) => `${value}%`}
                                  parser={(value) => value?.replace("%", "") as unknown as number}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col span={10} style={{ paddingLeft: "30px" }}>
                                <label
                                  className="locationLabels"
                                  style={{ display: "flex", marginTop: "2rem" }}
                                >
                                  <text>Centro de costos</text>
                                </label>
                                <Select
                                  style={{ width: "100%" }}
                                  options={[{ value: "1", label: "Centro de costos 1" }]}
                                />
                              </Col>
                              <Col span={8} style={{ paddingLeft: "30px" }}>
                                <label
                                  className="locationLabels"
                                  style={{ display: "flex", marginTop: "2rem" }}
                                >
                                  <text>Porcentaje CC</text>
                                </label>
                                <InputNumber<number>
                                  style={{ width: "100%" }}
                                  defaultValue={100}
                                  min={0}
                                  max={100}
                                  formatter={(value) => `${value}%`}
                                  parser={(value) => value?.replace("%", "") as unknown as number}
                                />
                              </Col>
                              <Col span={6} style={{ textAlign: "center" }}>
                                <p>&nbsp;</p>
                                <p>&nbsp;</p>
                                <PlusCircle></PlusCircle>
                                <text>Agregar centro de costos</text>
                              </Col>
                            </Row>
                          </div>
                          <Row>
                            <Col span={24} className="text-right">
                              <PlusCircle></PlusCircle>
                              <text>Agregar PSL</text>
                            </Col>
                          </Row>
                        </>
                      </FormWizard.TabContent>
                      <FormWizard.TabContent title="Informacion Adicional" icon="ti-check">
                        <>
                          <Title className="collapseByAction__label__text" level={4}>
                            Informacion Adicional
                          </Title>
                          <label
                            className="locationLabels"
                            style={{ display: "flex", marginTop: "2rem" }}
                          >
                            <text>Documentos</text>
                          </label>
                          <Row className="mainUploadDocuments">
                            {mockFiles.map((file) => (
                              // eslint-disable-next-line react/jsx-key
                              <Col span={24} style={{ padding: "15px" }}>
                                <UploadDocumentButton
                                  key={file.id}
                                  title={file.title}
                                  isMandatory={file.isMandatory}
                                  setFiles={setFiles}
                                />
                              </Col>
                            ))}
                          </Row>
                          <Row>
                            <Col span={24} className="text-right">
                              <PlusCircle></PlusCircle>
                              <text>Agregar otro documento</text>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <label
                                className="locationLabels"
                                style={{ display: "flex", marginTop: "2rem" }}
                              >
                                <text>Instrucciones especiales</text>
                              </label>
                              <TextArea rows={4} />
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <label
                                className="locationLabels"
                                style={{ display: "flex", marginTop: "2rem" }}
                              >
                                <text>Datos de Contacto</text>
                              </label>
                              <Row style={{ paddingLeft: "30px" }}>
                                <Col span={24}>
                                  <label
                                    className="locationLabels"
                                    style={{ display: "flex", marginTop: "2rem" }}
                                  >
                                    <text>Contacto punto origen</text>
                                  </label>
                                  <Row>
                                    <Col span={12} style={{ paddingRight: "15px" }}>
                                      <Input placeholder="Nombre del contacto" />
                                    </Col>
                                    <Col span={12} style={{ paddingLeft: "15px" }}>
                                      <Input placeholder="Teléfono: 000 000 0000 " />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col span={24}>
                                  <label
                                    className="locationLabels"
                                    style={{ display: "flex", marginTop: "2rem" }}
                                  >
                                    <text>Contacto punto origen</text>
                                  </label>
                                  <Row>
                                    <Col span={12} style={{ paddingRight: "15px" }}>
                                      <Input placeholder="Nombre del contacto" />
                                    </Col>
                                    <Col span={12} style={{ paddingLeft: "15px" }}>
                                      <Input placeholder="Teléfono: 000 000 0000 " />
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row style={{ marginTop: "2rem" }}>
                                <Col span={24} className="text-right">
                                  <PlusCircle></PlusCircle>
                                  <text>Agregar otro contacto</text>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </>
                      </FormWizard.TabContent>
                    </FormWizard>
                    {/* add style */}
                    <style>{`
                            @import url("https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css");
                        `}</style>
                  </Modal>
                </Col>
              </Row>
              <Row style={{ width: "100%", flexDirection: "column" }}>
                <Col>
                  <Tabs defaultActiveKey="1">
                    <TabPane key={"1"} tab={<h4>0000001</h4>}>
                      <Row style={{ width: "100%" }} className="contentRow">
                        <Col span={24} style={{ marginBottom: "1.5rem" }}>
                          <Flex>
                            <h5 style={{ fontWeight: "600", fontSize: "24px", lineHeight: "32px" }}>
                              0000001
                            </h5>
                          </Flex>
                        </Col>

                        <Col span={24}>
                          <Collapse
                            className="collapseByAction"
                            style={{ width: "100%" }}
                            expandIconPosition="end"
                            accordion={false}
                            bordered={false}
                            ghost
                            items={actionsOptions}
                          />
                        </Col>
                      </Row>
                    </TabPane>
                  </Tabs>
                </Col>
              </Row>
            </Col>
          </Row>
          <Flex justify="space-between" style={{ marginTop: "24px" }}>
            <Flex align="flex-start">
              <Button disabled className="backButton">
                Atras
              </Button>
            </Flex>
            <Flex gap="middle" align="flex-end">
              {/*<Button type="primary">
                                  Guardar como draft
                              </Button>*/}
              <Button disabled className="nextButton">
                Siguiente
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </main>
    </>
  );
};
