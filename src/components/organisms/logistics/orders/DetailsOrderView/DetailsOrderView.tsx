import { Flex, Tabs, TabsProps, Typography, message, Collapse, Row, Col, Select, Switch, DatePicker, DatePickerProps, GetProps, TimePicker, Table, TableProps,AutoComplete, Input, ConfigProvider, InputNumber, Button, Steps } from "antd";
import React, { useRef, useEffect, useState, useContext } from "react";

// dayjs locale
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es-us';
dayjs.locale('es');

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
import { IListData, ILocation, IMaterial, ITransferOrder } from "@/types/logistics/schema";

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
  NewspaperClipping
} from "@phosphor-icons/react";

import "../../../../../styles/_variables_logistics.css";

import "./detailsorder.scss";
import { UploadDocumentButton } from "@/components/atoms/UploadDocumentButton/UploadDocumentButton";
import TextArea from "antd/es/input/TextArea";
import TabPane from "antd/es/tabs/TabPane";
import { StringDecoder } from "string_decoder";
import { getTransferOrderById } from "@/services/logistics/transfer-orders";
import UploadDocumentChild from "@/components/atoms/UploadDocumentChild/UploadDocumentChild";

interface Props {
  idOrder: string;
}
const { Title, Text } = Typography;

export const DetailsOrderView = ({ idOrder = "" }: Props) => {
  //console.log(idOrder);
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const [transferOrder, setTransferOrder] = useState<ITransferOrder>();

  /* Tipo de viaje */
  const [typeactive, setTypeActive] = useState("1");

  /* Agendamiento */
  const origin = useRef<any>([]);
  const destination = useRef<any>([]);
  const [origenIzaje, setOrigenIzaje] = useState(false);
  const [destinoIzaje, setDestinoIzaje] = useState(false);
  const [fechaInicial, setFechaInicial] = useState<Dayjs | null>(null);
  const [horaInicial, setHoraInicial] = useState<Dayjs | null>(null);

  const optionsFlexible=[
    { value: 0, label: 'Exacto' },
    { value: 1, label: '+/- 1 día' },
    { value: 2, label: '+/- 2 días' },
    { value: 3, label: '+/- 3 días' },
  ];

  const [dataCarga, setDataCarga] = useState<IMaterial[]>([]);

  /* MAPBOX */
  const mapsAccessToken = 'pk.eyJ1IjoiamNib2JhZGkiLCJhIjoiY2x4aWgxejVsMW1ibjJtcHRha2xsNjcxbCJ9.CU7FHmPR635zv6_tl6kafA';//import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN,

  const mapContainerRef = useRef(null);
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v12");   
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState([]);
  const [distance, setDistance] = useState<any>(null);
  const [timetravel, setTimeTravel] = useState<any>(null);

  useEffect(() => {
    loadTransferOrder();
  });

  const loadTransferOrder = async () => {
    if(transferOrder != undefined) return;
    const result = await getTransferOrderById(idOrder);
    if(result.data.data.length > 0){
      const to:ITransferOrder = result.data.data[0];
      //console.log(to);
      setTransferOrder(to);
      origin.current = [to.start_location?.at(0)?.longitude, to.start_location?.at(0)?.latitude];
      destination.current = [to.end_location?.at(0)?.longitude, to.end_location?.at(0)?.latitude];
      const routes = to.geometry;
      setRouteInfo(routes);
      // Check if any routes are returned
      if (routes.length > 0) {
        const { distance, duration, geometry } = routes[0];
        setRouteGeometry(geometry); // Set the route geometry
        setDistance(parseFloat((distance/1000).toFixed(2)) + " Km");
        var date = new Date();
        date.setSeconds(duration);
        var hrs = date.toISOString().substr(11, 5);
        setTimeTravel(hrs + " Hrs")
      }

      to.transfer_order_material?.forEach(async (mat)=>{

        mat?.material?.forEach(async m=> {
          const newvalue : IMaterial = m;
          newvalue.quantity = mat.quantity;
          console.log(newvalue);
          await setDataCarga(dataCarga => [...dataCarga, newvalue]);
        })

      });
    } 
  };


  /* MAPBOX */
  
  useEffect(() => {
    if(!mapContainerRef.current) return;
    
    mapboxgl.accessToken = mapsAccessToken;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: {lon:-74.07231699675322, lat:4.66336863727521}, // longitude and latitude
      zoom: 12,
      attributionControl: false,
    });
    
    map.on("style.load", () => {
      // Add the compass control
      const compassControl = new mapboxgl.NavigationControl({
        showCompass: true,
      });
      map.addControl(compassControl, "top-right");

      // Create a marker at the starting position
      if(origin){
        const startMarker = new mapboxgl.Marker()
          .setLngLat(origin.current)
          .addTo(map);
      }

      // Create a marker at the finish position
      if(destination){
        const finalMarker = new mapboxgl.Marker()      
          .setLngLat(destination.current)
          .addTo(map);
      }

      if (routeGeometry) {
        
        const datajson: GeoJSON.Feature = {
            type: 'Feature',
            geometry: routeGeometry,
            properties: {},
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
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3FB1CE",
            "line-width": 6,
          },
        });
      }
      // Get the route bounds
      const bounds = routeGeometry.coordinates.reduce(
        (bounds:any, coord:any) => bounds.extend(coord),
        new mapboxgl.LngLatBounds()
      );

      // Zoom out to fit the route within the map view
      map.fitBounds(bounds, {
        padding: 50,
      });
      
    });

    // return () => {
    //   map.remove();
    // };
  }, [mapStyle, routeGeometry, origin, destination]);


  /* Carga */
  
  const columnsCarga : TableProps<IMaterial>['columns'] = [
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Nombre',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Volumen',
      dataIndex: 'm3_volume',
      key: 'm3_volume',
      render: (_, record) =>{
        return record.m3_volume + ' m3';
      }
    },
    {
      title: 'Alto',
      dataIndex: 'mt_height',
      key: 'mt_height',
      render: (_, record) =>{
        return record.mt_height + ' m';
      }
    },
    {
      title: 'Ancho',
      dataIndex: 'mt_width',
      key: 'mt_width',
      render: (_, record) =>{
        return record.mt_width + ' m';
      }
    },
    {
      title: 'Largo',
      dataIndex: 'mt_length',
      key: 'mt_length',
      render: (_, record) =>{
        return record.mt_length + ' m';
      }
    },
    {
      title: 'Peso',
      dataIndex: 'kg_weight',
      key: 'kg_weight',
      render: (_, record) =>{
        return record.kg_weight + ' kg';
      }
    }
  ];

  const columnsCargaPersonas = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Telefono',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'PSL',
      dataIndex: 'psl',
      key: 'psl',
    },
    {
      title: 'CC',
      dataIndex: 'typeid',
      key: 'typeid',
    }
  ];

  const columnsCargaVehiculo = [
    {
      title: 'Vehiculo',
      dataIndex: 'vehicle',
      key: 'vehicle',
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];

  /* Responsables */

  /* informacion adicional */
  interface FileObject {
    docReference: string;
    file: File | undefined;
  }
  const [files, setFiles] = useState<FileObject[] | any[]>([]);

  const mockFiles = [
    { id: 1, title: "Foto del Vehiculo", isMandatory: true },
    { id: 2, title: "Tecnomecánica", isMandatory: true },
    { id: 3, title: "SOAT", isMandatory: false },
  ];

  const columnsRequerimientosAdicionales = [
    {
      title: 'Nombre',
      dataIndex: 'namereq',
      key: 'namereq',
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];

 
  return (
    <>
      {contextHolder}
      <main className="mainCreateOrder">
        <SideBar />
        <Flex vertical className="containerCreateOrder">
          <Flex className="infoHeaderOrder">
            <Flex gap={"2rem"}>
              <Title level={2} className="titleName">
                Resumen de viaje
              </Title>
            </Flex>
            <Flex component={"navbar"} align="center" justify="space-between">
              <NavRightSection />
            </Flex>
          </Flex>
          {/* ------------Main Info Order-------------- */}
          <Flex>
            <Row style={{width:'100%'}}>
              <Col span={12}>
                <Flex vertical className="orderContainer" style={{width: '98%'}}>
                  <h3>Ruta</h3>
                  <p>&nbsp;</p>
                  <div
                    ref={mapContainerRef}
                    style={{
                      width: "100%",
                      height: "50vh",
                      border: "1px #F7F7F7 solid",
                    }}
                  />
                </Flex>
              </Col>
              <Col span={12}>
                <Flex vertical className="orderContainer" style={{width: '98%'}}>
                  <h3>Resumen</h3>
                  <p>&nbsp;</p>
                  { routeGeometry &&
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
                  }
                  <Row>
                    <Col span={12} style={{paddingTop:'0.5rem'}}>
                      <p style={{paddingTop:'1rem'}}>
                        <label>Tipo de viaje</label>
                      </p>
                      <p style={{paddingTop:'1rem'}}>
                        <label>Vehiculos sugeridos</label>
                      </p>
                    </Col>
                    <Col span={12} style={{paddingTop:'0.5rem', textAlign:'right'}}>
                      <p style={{paddingTop:'1rem'}}>
                        <label><b>{transferOrder?.service_type_desc}</b></label>
                      </p>
                      <p style={{paddingTop:'1rem'}}>
                        <label><b>{
                        transferOrder?.transfer_order_vehicles?.map(v=> v.vehicle_type_desc).join(',')
                        }</b></label>
                      </p>
                    </Col>
                    <Col span={24} style={{paddingTop:'1rem'}}>
                      <hr style={{borderTop: '1px solid #f7f7f7'}}></hr>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12} style={{paddingTop:'0.5rem'}}>
                      <p style={{paddingTop:'1rem'}}>
                        <label>Punto Origen</label>
                      </p>
                    </Col>
                    <Col span={12} style={{paddingTop:'0.5rem', textAlign:'right'}}>
                      { transferOrder?.start_freight_equipment &&
                        <p style={{paddingTop:'0.5rem'}}>
                          <label><b>Requiere agendar izaje</b></label>                      
                        </p>
                      }
                      <p style={{paddingTop:'0.5rem'}}>
                        <label><b>{transferOrder?.start_location?.at(0)?.description}</b></label>
                      </p>
                    </Col>
                    <Col span={24} style={{paddingTop:'1rem'}}>
                      <hr style={{borderTop: '1px solid #f7f7f7'}}></hr>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12} style={{paddingTop:'0.5rem'}}>
                      <p style={{paddingTop:'1rem'}}>
                        <label>Punto Destino</label>
                      </p>
                    </Col>
                    <Col span={12} style={{paddingTop:'0.5rem', textAlign:'right'}}>
                      { transferOrder?.end_freight_equipment &&
                        <p style={{paddingTop:'0.5rem'}}>
                          <label><b>Requiere agendar izaje</b></label>                      
                        </p>
                      }
                      <p style={{paddingTop:'0.5rem'}}>
                        <label><b>{transferOrder?.end_location?.at(0)?.description}</b></label>
                      </p>
                    </Col>
                    <Col span={24} style={{paddingTop:'1rem'}}>
                      <hr style={{borderTop: '1px solid #f7f7f7'}}></hr>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12} style={{paddingTop:'0.5rem'}}>
                      <p style={{paddingTop:'1rem'}}>
                        <label>Fecha y hora inicial</label>
                      </p>
                      <p style={{paddingTop:'0.5rem'}}>
                        <label><b>{
                          optionsFlexible.find(x=> x.value==transferOrder?.start_date_flexible)?.label
                        }</b></label>
                      </p>
                    </Col>
                    <Col span={12} style={{paddingTop:'0.5rem', textAlign:'right'}}>
                      <p style={{paddingTop:'1rem'}}>
                        <label><b>{transferOrder?.start_date?.split('T')[0]}</b></label>
                      </p>
                      <p style={{paddingTop:'0.5rem'}}>
                        <label><b>{transferOrder?.start_date?.split('T')[1].substring(0,5)}</b></label>
                      </p>
                    </Col>
                    <Col span={24} style={{paddingTop:'1rem'}}>
                      <hr style={{borderTop: '1px solid #f7f7f7'}}></hr>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12} style={{paddingTop:'0.5rem'}}>
                      <p style={{paddingTop:'1rem'}}>
                        <label>Fecha y hora final</label>
                      </p>
                      <p style={{paddingTop:'0.5rem'}}>
                        <label><b>{
                          optionsFlexible.find(x=> x.value==transferOrder?.end_date_flexible)?.label
                        }</b></label>
                      </p>
                    </Col>
                    <Col span={12} style={{paddingTop:'0.5rem', textAlign:'right'}}>
                      <p style={{paddingTop:'1rem'}}>
                        <label><b>{transferOrder?.end_date?.split('T')[0]}</b></label>
                      </p>
                      <p style={{paddingTop:'0.5rem'}}>
                        <label><b>{transferOrder?.end_date?.split('T')[1].substring(0,5)}</b></label>
                      </p>
                    </Col>
                    <Col span={24} style={{paddingTop:'1rem'}}>
                      <hr style={{borderTop: '1px solid #f7f7f7'}}></hr>
                    </Col>
                  </Row>                                  
                </Flex>
              </Col>
            </Row>
          </Flex>
          <Flex>
            <Row style={{width:'100%'}}>
              <Col span={24}>
                <Flex vertical className="orderContainer" style={{width: '99%', marginTop: '2rem'}}>
                  <h3>Responsables</h3>
                  <p>&nbsp;</p>
                  <Row>
                    <Col span={12} style={{paddingTop:'0.5rem'}}>
                      <p style={{paddingTop:'1rem'}}>
                        <label><b>PSL:</b> Product service line 1</label>
                      </p>
                      <p style={{paddingTop:'0.5rem'}}>
                        <label>&nbsp;&nbsp;&nbsp;<b>CC:</b> Centro de costos 1</label>
                      </p>
                    </Col>
                    <Col span={12} style={{paddingTop:'0.5rem', textAlign:'right'}}>
                      <p style={{paddingTop:'1rem'}}>
                        <label><b>100%</b></label>
                      </p>
                      <p style={{paddingTop:'0.5rem'}}>
                        <label><b>100%</b></label>
                      </p>
                    </Col>
                    <Col span={24} style={{paddingTop:'1rem'}}>
                      <hr style={{borderTop: '1px solid #f7f7f7'}}></hr>
                    </Col>
                  </Row> 
                </Flex>
              </Col>
            </Row>
          </Flex>

          <Flex style={{marginTop:'1rem'}}>
            <Row style={{width:'100%'}}>
              <Col span={24}>
                <Flex vertical className="orderContainer" style={{width: '99%', marginTop: '2rem'}}>
                  <h3>Información adicional</h3>
                  <p>&nbsp;</p>
                  <h4>Documentos</h4>
                  <Row className="mainUploadDocuments">                    
                    {transferOrder?.transfer_order_documents?.map((file) => (
                      <><Col span={12} style={{ padding: "15px" }} key={`file-${file.id}`}>
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
                      </>
                    ))}
                    <Col span={24} style={{paddingTop:'1rem'}}>
                      <hr style={{borderTop: '1px solid #f7f7f7'}}></hr>
                    </Col>
                  </Row>
                  <Row style={{marginTop:'2rem'}}>
                    <Col span={12}>
                      <h3>Datos de contacto</h3>
                      <p>&nbsp;</p>
                      <h4>Contacto inicial</h4>
                      {transferOrder?.transfer_order_contacts?.filter(x=> x.contact_type == 1).map((contact) => (
                      <Row style={{paddingTop:'0.5rem'}} key={contact.id}>
                        <Col span={12} style={{paddingLeft:'25px'}}>
                          {contact.name}
                        </Col>
                        <Col span={8} style={{textAlign:'right'}}>
                          {contact.contact_number}
                        </Col>
                      </Row>
                      ))}
                      <p>&nbsp;</p>
                      <h4>Contacto final</h4>
                      {transferOrder?.transfer_order_contacts?.filter(x=> x.contact_type == 2).map((contact) => (
                      <Row style={{paddingTop:'0.5rem'}} key={contact.id}>
                        <Col span={12} style={{paddingLeft:'25px'}}>
                          {contact.name}
                        </Col>
                        <Col span={8} style={{textAlign:'right'}}>
                          {contact.contact_number}
                        </Col>
                      </Row>
                      ))}
                      <p>&nbsp;</p>
                      <Row style={{paddingTop:'1rem'}}>
                        <Col span={12}>
                          <h4>Cliente final</h4>
                        </Col>
                        <Col span={8} style={{textAlign:'right'}}>
                          {transferOrder?.client_desc}
                        </Col>
                      </Row>
                      <p>&nbsp;</p>
                      <h4>Requerimientos adicionales</h4>
                      <Row style={{paddingTop:'1rem'}}>
                        <Col span={24}>
                        {transferOrder?.transfer_order_other_requeriments?.map((req) => (
                          <div className="selected" key={req.id}>{req.other_requirement_desc} <small>{req.quantity}</small></div>
                         ))}
                        </Col>
                      </Row>                      
                    </Col>                    
                    <Col span={12} className="bleft">
                      <h3>Instrucciones especiales</h3>
                      <p>&nbsp;</p>
                      <p style={{minHeight:'250px'}}>{transferOrder?.observation}</p>
                    </Col>
                  </Row> 
                </Flex>
              </Col>
            </Row>
          </Flex>

          <Flex style={{marginTop:'1rem'}}>
            <Row style={{width:'100%'}}>
              <Col span={24}>
                <Flex vertical className="orderContainer" style={{width: '99%', marginTop: '2rem'}}>
                  <h3>Carga</h3>
                  <p>&nbsp;</p>
                  <Row>
                    <Col span={24} style={{paddingTop:'1rem'}}>
                    <h4>Materiales</h4>
                    <Table columns={columnsCarga} dataSource={dataCarga}/>
                      <hr style={{borderTop: '1px solid #f7f7f7'}}></hr>
                    </Col>
                  </Row>
                  <p>&nbsp;</p> 
                  <h4>Vehículos sugeridos</h4>                  
                  <Row>
                    <Col span={24} style={{paddingTop:'1rem'}}>
                      {transferOrder?.transfer_order_vehicles?.map((veh) => (
                          <div className="selected" key={veh.id}>{veh.vehicle_type_desc} <small>{veh.quantity}</small></div>
                      ))}
                      
                    </Col>
                  </Row> 
                </Flex>
              
              </Col>
            </Row>
          </Flex>

          <Flex className="orderContainer" style={{marginTop:'2rem'}}>
            <Row style={{width:'100%'}}>
            
              <Col span={4}  className="text-right" style={{marginTop:'2rem', marginBottom:'2rem'}}>
                  <Flex gap="middle" align="flex-start">
                  <Button type="primary" onClick={()=>{
                    push("/logistics/orders");
                  }}>
                    Regresar
                  </Button>
                  </Flex>
              </Col>


              <Col span={6} offset={12} className="text-right" style={{marginTop:'2rem', marginBottom:'2rem'}}>
                  {/* <Flex gap="middle" align="flex-end">
                  <Button type="primary">
                      Guardar como drfat
                  </Button>
                  <Button disabled >
                      Crear Solicitud
                  </Button>
                  </Flex> */}
              </Col>
              </Row>

          </Flex>
        </Flex>
      </main>
    </>
  );
};
