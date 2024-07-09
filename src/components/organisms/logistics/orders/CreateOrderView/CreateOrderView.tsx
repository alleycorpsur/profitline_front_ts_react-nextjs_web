import { Flex, Tabs, TabsProps, Typography, message, Collapse, Row, Col, Select, Switch, DatePicker, DatePickerProps, GetProps, TimePicker, Table, TableProps,AutoComplete, Input, ConfigProvider, InputNumber, Button, SelectProps, Popconfirm, Modal } from "antd";
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

//schemas
import { IAditionalByMaterial, ICreateRegister, IListData, ILocation, IMaterial, IOrderPsl, IOrderPslCostCenter, ITransferOrder, ITransferOrderContacts, IVehicleType } from "@/types/logistics/schema";

//locations
import { getAllLocations } from "@/services/logistics/locations";

//materials
import { getSearchMaterials } from "@/services/logistics/materials";

//materials
import { getSuggestedVehicles } from "@/services/logistics/vehicles";

//vars
import { CREATED } from "@/utils/constants/globalConstants";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Calendar,
  Package,
  UserList,
  NewspaperClipping,
  Trash,
  CaretLeft,
  CaretRight
} from "@phosphor-icons/react";

import "../../../../../styles/_variables_logistics.css";

import "./createorder.scss";
import { UploadDocumentButton } from "@/components/atoms/UploadDocumentButton/UploadDocumentButton";
import TextArea from "antd/es/input/TextArea";
import { addTransferOrder } from "@/services/logistics/transfer-orders";
import { getOtherRequirements } from "@/services/logistics/other-requirements";
import { getPsl } from "@/services/logistics/psl";

const { Title, Text } = Typography;

export const CreateOrderView = () => {
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  /* Tipo de viaje */
  const [typeactive, setTypeActive] = useState("1");

  /* Agendamiento */
  const origin = useRef<any>([]);
  const destination = useRef<any>([]);
  const [origenIzaje, setOrigenIzaje] = useState(false);
  const [destinoIzaje, setDestinoIzaje] = useState(false);
  const [fechaInicial, setFechaInicial] = useState<Dayjs | null>(null);
  const [horaInicial, setHoraInicial] = useState<Dayjs | null>(null);
  const [fechaFinal, setFechaFinal] = useState<Dayjs | null>(null);
  const [horaFinal, setHoraFinal] = useState<Dayjs | null>(null);

  /* MAPBOX */
  const mapsAccessToken = 'pk.eyJ1IjoiamNib2JhZGkiLCJhIjoiY2x4aWgxejVsMW1ibjJtcHRha2xsNjcxbCJ9.CU7FHmPR635zv6_tl6kafA';//import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN,

  const mapContainerRef = useRef(null);
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v12");   
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState([]);
  const [distance, setDistance] = useState<any>(null);
  const [timetravel, setTimeTravel] = useState<any>(null);
  const [suggestions, setSuggestions] = useState([]);

  const [expand, setExpand] = useState(false);
  const initialItemCount = 4;
  const directions = routeInfo.length > 0 ? routeInfo[0]['legs'][0]['steps'] : [];
  const displayedDirections = expand
    ? directions
    : directions.slice(0, initialItemCount);

  const [locations, setLocations] = useState<ILocation[]>([]);
  const [locationOptions, setLocationOptions] = useState<any>([]);
  const [locationOrigin, setLocationOrigin] = useState<ILocation>();
  const [locationDestination, setLocationDestination] = useState<ILocation>();

  const handleToggleExpand = () => {
    setExpand(!expand);
  };

  const geocodingClient = MapboxGeocoding({
    accessToken: mapsAccessToken
  });

  console.log("routeInfo==>", routeInfo);

  useEffect(() => {
    loadLocations();
  });

  const loadLocations = async () => {
    if(locations.length >0 ) return;
    const result = await getAllLocations();
    if(result.data.data.length > 0){
      //console.log(result.data.data);
      
      const listlocations: any[] | ((prevState: ILocation[]) => ILocation[]) = [];
      const listlocationoptions: { label: any; value: any; }[] = [];

      result.data.data.forEach((item) => {
        listlocations.push(item);
        listlocationoptions.push({label: item.description, value: item.id})
      });

      setLocations(listlocations);
      setLocationOptions(listlocationoptions);
    }
  };


  // Cambia origen 
  const onChangeOrigin = (value:any) =>{
    console.log('origen:'+value);
    locations.forEach(async (item, index) => {
      if(item.id == value){
        console.log(item);
        setLocationOrigin(item);
        origin.current = [item.longitude, item.latitude];
        calcRouteDirection();
      }
    });
  }

  // Cambia destino 
  const onChangeDestino = async (value:any) =>{
    console.log('destino:'+value);
    locations.forEach(async (item, index) => {
      if(item.id == value){
        console.log(item);
        setLocationDestination(item);
        destination.current = [item.longitude, item.latitude];
        calcRouteDirection();
      }
    });
  }

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

  // calculate direction
  const calcRouteDirection = async () => {
    //if (origin.length > 2) {
      console.log('entro0');
      console.log('entro1:'+origin.current.length);
      console.log('entro2:'+destination.current.length);
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
          `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.current[0]},${origin.current[1]};${
            destination.current[0]
          },${destination.current[1]}?steps=true&geometries=geojson&access_token=${
            mapsAccessToken
          }`
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
            duration,
          };
          setRouteGeometry(geometry); // Set the route geometry
          setDistance(distance);
          setTimeTravel(duration)
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
  const handleTypeClick = (event:any) => {
    setTypeActive(event.target.id);
    origin.current = [];
    destination.current = [];
    setRouteGeometry(null)
    setRouteInfo([]);
    setDistance(null);
    setTimeTravel(null);
    if(event.target.id == "2"){
      setOrigenIzaje(true);
    }else{
      setOrigenIzaje(false);
    }
  }

  /* Carga */
  
  const columnsCarga : TableProps<IMaterial>['columns'] = [
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record) =>
        dataCarga.length >= 1 ? (
          <>
          <CaretLeft onClick={() => handleQuantityMaterial(record.key,'-')}/>&nbsp;&nbsp;{record.quantity}&nbsp;&nbsp;<CaretRight onClick={() => handleQuantityMaterial(record.key,'+')}/>
          </>
        ) : null,
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
    },
    {
      title: 'Alto',
      dataIndex: 'mt_height',
      key: 'mt_height',
    },
    {
      title: 'Ancho',
      dataIndex: 'mt_width',
      key: 'mt_width',
    },
    {
      title: 'Largo',
      dataIndex: 'mt_length',
      key: 'mt_length',
    },
    {
      title: 'Peso',
      dataIndex: 'kg_weight',
      key: 'kg_weight',
    },
    {
      title: '',
      dataIndex: 'alerts',
      key: 'alerts',
      render: (_, record) =>
        dataCarga.length >= 1 ? (
          <Popconfirm title="Esta seguro de eliminar?" onConfirm={() => handleDeleteMaterial(record.key)}>
            <Trash/>
          </Popconfirm>
        ) : null,
    },
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
  
  const [optionsMaterial, setOptionsMaterial] = useState<SelectProps<object>['options']>([]);
  const [dataCarga, setDataCarga] = useState<IMaterial[]>([]);
  let cargaIdx = 0;

  const searchResultMaterial = async (query: string) => {
    const res = await (getSearchMaterials(query));
    const result:any = [];
    //console.log (res);
    if(res.data.data.length > 0){
      res.data.data.forEach((item) => {
        const strlabel = <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>
                              {item.type_description} - {item.description}
                              <br></br>
                              Volumen {item.kg_weight} m3 - Peso {item.m3_volume} Kg
                          </span>
                          <span>
                            <button className="btnagregar active" onClick={() => addMaterial(item)}>Agregar</button>
                          </span>
                        </div>;

        result.push({value:item.description, label: strlabel})
      });      
    }

    return result;
  }     

  const addMaterial = async (value:any) =>{
    cargaIdx = cargaIdx + 1;
    
    value.quantity = 1;
    value.key = cargaIdx;

    const newvalue : IMaterial = value;
    console.log(newvalue);
    await setDataCarga(dataCarga => [...dataCarga, newvalue]);
  };

  const handleSearchMaterial = async (value: string) => {
    if(value.length > 3){
      const result =  await searchResultMaterial(value);
      setOptionsMaterial(result);
    }
  };

  const onSelectMaterial = (value: string) => {
    console.log('onSelect', value);
  };

  const handleDeleteMaterial = (key: React.Key) => {
    console.log(key)
    cargaIdx = cargaIdx - 1;
    const newData = dataCarga.filter((item) => item.key !== key);
    setDataCarga(newData);
  };

  const handleQuantityMaterial = (key: React.Key, sign: string) => {
    console.log(key)
    const newData = [...dataCarga];
    newData.forEach(item => {
      if(item.key === key){
        if(sign=='+'){
          item.quantity = item.quantity + 1;
        }
        if(sign=='-'){
          item.quantity = item.quantity - 1;
          if(item.quantity <0) item.quantity = 0;
        }
      }
    });    
    
    setDataCarga(newData);
  };

  /* Vehiculos sugeridos */
  const columnsCargaVehiculo: TableProps<IVehicleType>['columns'] = [
    {
      title: 'Vehiculo',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record) =>
        dataVehicles.length >= 1 ? (
          <>
          <CaretLeft onClick={() => handleQuantityVehicle(record.key,'-')}/>&nbsp;&nbsp;{record.quantity}&nbsp;&nbsp;<CaretRight onClick={() => handleQuantityVehicle(record.key,'+')}/>
          </>
        ) : null,
    },
    {
      title: '',
      dataIndex: 'alerts',
      key: 'alerts',
      render: (_, record) =>
        dataVehicles.length >= 1 ? (
          <Popconfirm title="Esta seguro de eliminar?" onConfirm={() => handleDeleteVehicle(record.key)}>
            <Trash/>
          </Popconfirm>
        ) : null,
    },
  ];

  const [optionsVehicles, setOptionsVehicles] = useState<SelectProps<object>['options']>([]);
  const [dataVehicles, setDataVehicles] = useState<IVehicleType[]>([]);
  let vehiclesIdx = 0;

  const loadSuggestedVehicles = async () => {
    if(optionsVehicles !== undefined && optionsVehicles.length >0 ) return;

    const res = await (getSuggestedVehicles());
    const result:any = [];
    //console.log (res);
    if(res.data.data.length > 0){
      res.data.data.forEach((item) => {
        const strlabel = <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>
                              <b>{item.description}</b>
                              <br></br>
                              Largo {item.length}m - Ancho {item.width}m - Alto {item.height}m - Máximo {item.kg_capacity}Tn
                              <br></br>
                              Cantidad disponibles: {item.available}
                          </span>
                          <span>
                            <button className="btnagregar active" onClick={() => addVehicle(item)}>Agregar</button>
                          </span>
                        </div>;

        result.push({value:item.description, label: strlabel})
      });      
    }

    setOptionsVehicles(result); 
  };
  
  useEffect(() => {
    loadSuggestedVehicles();
  });

  const addVehicle = async (value:any) =>{
    vehiclesIdx = vehiclesIdx + 1;
    
    value.quantity = 1;
    value.key = vehiclesIdx;

    const newvalue : IVehicleType = value;
    console.log(newvalue);
    await setDataVehicles(dataVehicles => [...dataVehicles, newvalue]);
  };

  const handleDeleteVehicle = (key: React.Key) => {
    console.log(key)
    vehiclesIdx = vehiclesIdx - 1;
    const newData = dataVehicles.filter((item) => item.key !== key);
    setDataVehicles(newData);
  };

  const handleQuantityVehicle = (key: React.Key, sign: string) => {
    console.log(key)
    const newData = [...dataVehicles];
    newData.forEach(item => {
      if(item.key === key){
        if(sign=='+'){
          item.quantity = item.quantity + 1;
        }
        if(sign=='-'){
          item.quantity = item.quantity - 1;
          if(item.quantity <0) item.quantity = 0;
        }
      }
    });    
    
    setDataVehicles(newData);
  };

  /* Responsables */

  // TODO: Load PSL
  // TODO: load CostCenters
  const [optionsPSL, setOptionsPSL] = useState<SelectProps<object>['options']>([]);
  const [dataPsl, setDataPsl] = useState<IOrderPsl[]>([]);
  let pslIdx = 0;

  const loadPSL = async () => {
    if(optionsPSL !== undefined && optionsPSL.length >0 ) return;

    const res = await (getPsl());
    const result:any = [];
    //console.log (res);
    if(res.data.data.length > 0){
      res.data.data.forEach((item) => {
        result.push({value:item.id, label: item.description})
      });      
    }

    setOptionsPSL(result); 
  };

  useEffect(() => {
    loadPSL();
  });

  const addPsl = async () =>{
    pslIdx = pslIdx + 1;   

    //default values
    const newvalue : IOrderPsl = {
      key:pslIdx,
      idpsl: 1,
      descpsl: '',
      percent:100,
      costcenters: []
    };
    const costcenter : IOrderPslCostCenter ={
      key:1,
      idpslcostcenter: 1,
      descpslcostcenter: '',
      percent: 100
    }
    newvalue.costcenters.push(costcenter);
    console.log(newvalue);
    await setDataPsl(dataPsl => [...dataPsl, newvalue]);
  };

  const addPslCostCenter = (key: React.Key) => {
    console.log(key)
    const newData = [...dataPsl];
    newData.forEach(item => {
      if(item.key === key){
        //last costcenter
        const lastitem = item.costcenters.at(-1);

        const costcenter : IOrderPslCostCenter ={
          key: (lastitem!=undefined ? lastitem.key +1 : 1),
          idpslcostcenter: 1,
          descpslcostcenter: '',
          percent: 100
        }
        item.costcenters.push(costcenter);
      }
    });    
    
    setDataPsl(newData);
  };


  /* informacion adicional */
  /*archivos*/
  interface FileObject {
    docReference: string;
    file: File | undefined;
  }
  const [files, setFiles] = useState<FileObject[] | any[]>([]);

  const [mockFiles, setMockFiles] = useState<any[]>([]);

  if(mockFiles.length < 1){
    setMockFiles([
      { id: 1, key:1, title: "archivo 1", isMandatory: true },
      { id: 2, key:2, title: "archivo 2", isMandatory: true },
      { id: 3, key:3, title: "archivo 3", isMandatory: false },
    ]);
  }
  const newfile = useRef<any>('');

  const AddFileModal = ()=> {
    newfile.current ='';
    Modal.info({
      title: 'Agregar otro documento',
      content: (
        <Flex style={{width:'100%'}}>          
          <Row style={{width:'100%'}}>
            <Col span={24}>
              <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
                <text>Nombre del documento</text>
              </label>
              <Input placeholder="Escribir nombre" onChange={(e)=>{ 
                newfile.current = (e.target.value);
              }} />
            </Col>   
          </Row>
        </Flex>
      ),
      onOk: ()=>{
        if(newfile.current.length <= 0){
          message.error('Debe digitar un nombre de archivo');
        }else{
          const lastitem = mockFiles.at(-1);
          const newvalue = { id: (lastitem!=undefined ? lastitem.id +1 : 1), key:(lastitem!=undefined ? lastitem.key +1 : 1), title: newfile.current, isMandatory: false };
          setMockFiles(mockFiles => [...mockFiles, newvalue]);
        }
      },
    });
  }
  
  /*requerimientos adicionales*/

  const columnsRequerimientosAdicionales: TableProps<IAditionalByMaterial>['columns']= [
    {
      title: 'Nombre',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record) =>
        dataRequirements.length >= 1 ? (
          <>
          <CaretLeft onClick={() => handleQuantityRequirement(record.key,'-')}/>&nbsp;&nbsp;{record.quantity}&nbsp;&nbsp;<CaretRight onClick={() => handleQuantityRequirement(record.key,'+')}/>
          </>
        ) : null,
    },
    {
      title: '',
      dataIndex: 'alerts',
      key: 'alerts',
      render: (_, record) =>
        dataRequirements.length >= 1 ? (
          <Popconfirm title="Esta seguro de eliminar?" onConfirm={() => handleDeleteRequirement(record.key)}>
            <Trash/>
          </Popconfirm>
        ) : null,
    },
  ];

  const [optionsRequirements, setOptionsRequirements] = useState<SelectProps<object>['options']>([]);
  const [dataRequirements, setDataRequirements] = useState<IAditionalByMaterial[]>([]);
  let requirementsIdx = 0;

  const loadRequirements = async () => {
    if(optionsRequirements !== undefined && optionsRequirements.length >0 ) return;

    const res = await (getOtherRequirements());
    const result:any = [];
    //console.log (res);
    if(res.data.data.length > 0){
      res.data.data.forEach((item) => {
        const strlabel = <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>
                              <b>{item.description}</b>
                          </span>
                          <span>
                            <button className="btnagregar active" onClick={() => addRequeriment(item)}>Agregar</button>
                          </span>
                        </div>;

        result.push({value:item.description, label: strlabel})
      });      
    }

    setOptionsRequirements(result); 
  };

  useEffect(() => {
    loadRequirements();
  });

  const addRequeriment = async (value:any) =>{
    requirementsIdx = requirementsIdx + 1;
    
    value.quantity = 1;
    value.key = requirementsIdx;

    const newvalue : IAditionalByMaterial = value;
    console.log(newvalue);
    await setDataRequirements(dataRequirements => [...dataRequirements, newvalue]);
  };

  const handleDeleteRequirement = (key: React.Key) => {
    console.log(key)
    requirementsIdx = requirementsIdx - 1;
    const newData = dataRequirements.filter((item) => item.key !== key);
    setDataRequirements(newData);
  };

  const handleQuantityRequirement = (key: React.Key, sign: string) => {
    console.log(key)
    const newData = [...dataRequirements];
    newData.forEach(item => {
      if(item.key === key){
        if(sign=='+'){
          item.quantity = item.quantity + 1;
        }
        if(sign=='-'){
          item.quantity = item.quantity - 1;
          if(item.quantity <0) item.quantity = 0;
        }
      }
    });    
    
    setDataRequirements(newData);
  };

  /* Datos de contacto */
  const [dataContacts, setDataContacts] = useState<ITransferOrderContacts[]>([]);
  //default data
  const loadContacts = () =>{
    if(dataContacts !== undefined && dataContacts.length >0 ) return;

    const defaultorigin : ITransferOrderContacts ={
      key: 1,
      contact_type: 1,
      id: 0,
      id_transfer_order: 0,
      id_contact: 0,
      name: "",
      contact_number: '',
      active: "",
      created_at: new Date(),
      created_by: ""
    }
    
    setDataContacts(dataContacts => [...dataContacts, defaultorigin]);

    const defaultdestiny : ITransferOrderContacts ={
      key: 2,
      contact_type: 2,
      id: 0,
      id_transfer_order: 0,
      id_contact: 0,
      name: "",
      contact_number: '',
      active: "",
      created_at: new Date(),
      created_by: ""
    }
    
    setDataContacts(dataContacts => [...dataContacts, defaultdestiny]);
  } 

  useEffect(() => {
    loadContacts();
  });

  const newcontacttype = useRef<number>(0);
  const newcontacname = useRef<string>('');
  const newcontactphone = useRef<string>('');

  const AddContactModal = ()=> {
    newcontacttype.current = 0;
    newcontacname.current = '';
    newcontactphone.current = '';

    Modal.info({
      title: 'Agregar otro contacto',
      content: (
        <Flex style={{width:'100%'}}>          
          <Row style={{width:'100%'}}>
            <Col span={24}>
              <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
                <text>Punto del contacto</text>
              </label>
              <Select
                placeholder = 'Seleccione origen o destino'
                style={{ width: '100%' }}
                options={[{ value: 1, label: 'Origen' },{ value: 2, label: 'Destino' }]}
                onChange={(e)=>{ 
                  newcontacttype.current = (e);
                }}
              />
              <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
                <text>Nombre</text>
              </label>
              <Input placeholder="Escribir nombre" onChange={(e)=>{ 
                newcontacname.current = (e.target.value);
              }} />
              <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
                <text>Teléfono</text>
              </label>
              <Input placeholder="Escribir teléfono" onChange={(e)=>{ 
                newcontactphone.current = (e.target.value);
              }} />
            </Col>   
          </Row>
        </Flex>
      ),
      onOk: ()=>{
        if(newcontacname.current.length <= 0){
          message.error('Debe digitar un nombre de contacto');
        }else{
          const lastitem = dataContacts.filter(f => f.contact_type == newcontacttype.current).at(-1);
                    
          const newcontact : ITransferOrderContacts ={
            key: (lastitem!=undefined ? lastitem.key +1 : 1),
            contact_type: newcontacttype.current,
            id: 0,
            id_transfer_order: 0,
            id_contact: 0,
            name: newcontacname.current,
            contact_number: newcontactphone.current,
            active: "",
            created_at: new Date(),
            created_by: ""
          }
          
          setDataContacts(dataContacts => [...dataContacts, newcontact]);

        }
      },
    });
  }

  const UpdateContact = (key: React.Key, field: string, ndata: string) => {
    console.log(key)
    const newData = [...dataContacts];
    newData.forEach(item => {
      if(item.key === key){
        if(field=='name'){
          item.name = ndata;
        }
        if(field=='phone'){
          item.contact_number = ndata;
        }
      }
    });    
    
    setDataContacts(newData);
  };

  /* Form Event Handlers */
  const onCreateOrder = async () => {
    
    fechaInicial?.hour(horaInicial?horaInicial.get('hour'):0);
    fechaInicial?.hour(horaInicial?horaInicial.get('minute'):0);

    console.log(fechaInicial);
    console.log(horaInicial);

    const data: ITransferOrder = {
      id_start_location: (locationOrigin?locationOrigin.id:0),
      id_end_location: (locationDestination?locationDestination?.id:0),
      id: 0,
      id_user: 0,
      start_date:  new Date(),
      end_date: new Date(),
      start_freight_equipment: "",
      end_freight_equipment: "",
      rotation: "",
      start_date_flexible: 0,
      end_date_flexible: 0,
      image: "",
      id_company: 0,
      active: "",
      created_at: new Date(),
      created_by: ""
    }
    

    console.log("DATA PARA POST: ", data);
    try {
      const response = await addTransferOrder(data);
      if (response.status === CREATED) {
        messageApi.open({
          type: "success",
          content: "La orden fue creada exitosamente."
        });
        push("/");
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Oops, hubo un error por favor intenta mas tarde."
      });
    }
  };

  /* acoordion */
  const actionsOptions = [
    {
      key: 2,
      label: (
        <div className="collapseByAction__label">
          <Calendar size={16} />
          <Title className="collapseByAction__label__text" level={4}>
            Agendamiento
          </Title>
        </div>
      ),
      children: (
        <>
          <Row>
            <Col span={12} style={{ padding:'25px'}}>
              <Row>
                <label className="locationLabels">
                  Punto Origen
                </label><br></br>

                <Select
                  showSearch
                  placeholder="Buscar dirección inicial"                  
                  className="puntoOrigen"
                  style={{ width:'100%' }}
                  onChange={onChangeOrigin}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option!.children!.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  { locationOptions.map(((option: { value: React.Key | null | undefined; label: string  | null | undefined; }) => <Select.Option value={option.value} key={option.value}>{option.label}</Select.Option>)) }
                </Select>
                <Switch checked={origenIzaje} onChange={event =>{
                  setOrigenIzaje(event)
                }}/>
                <label>&nbsp;&nbsp; Requiere Izaje</label>
              </Row>
              { typeactive != "2" &&
              <Row style={{marginTop:'1rem'}}>
                <label className="locationLabels">
                  Punto Destino
                </label>
                <Select
                  showSearch
                  placeholder="Buscar dirección final"                  
                  className="puntoOrigen"
                  style={{ width:'100%' }}
                  onChange={onChangeDestino}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option!.children!.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  { locationOptions.map(((option: { value: React.Key | null | undefined; label: string | null | undefined; }) => <Select.Option value={option.value} key={option.value}>{option.label}</Select.Option>)) }
                </Select>
                <Switch checked={destinoIzaje} onChange={event =>{
                  setDestinoIzaje(event)
                }}/>
                <label>&nbsp;&nbsp; Requiere Izaje</label>
              </Row>
              }
              <Row style={{marginTop:'1.5rem'}}>
                <Col span={24}>
                  <label className="locationLabels">
                    Fecha y hora inicial
                  </label>
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
                    format={'HH:mm'}
                    minuteStep={15} 
                    hourStep={1}
                    type={'time'} 
                    onChange={(value) => {
                      console.log(value)
                      setHoraInicial(value);
                    }}
                  />
                </Col>
                <Col span={8}>
                <Select
                    placeholder="Seleccione"                  
                    className="puntoOrigen"
                    style={{ width:'100%' }}
                    options={[
                      { value: '2', label: 'Exacto' },
                    ]}
                  />
                </Col>
              </Row>
              <Row style={{marginTop:'1.5rem'}}>
                <Col span={24}>
                  <label className="locationLabels">
                    Fecha y hora final
                  </label>
                </Col>
                <Col span={8}>
                  <DatePicker
                    placeholder="Seleccione fecha"                    
                    onChange={(value, dateString) => {
                      //console.log('Selected Time: ', value);
                      //console.log('Formatted Selected Time: ', dateString);
                      setFechaFinal(value);
                    }}
                  />
                </Col>
                <Col span={8}>
                  <TimePicker placeholder="Seleccione hora"  
                  format={'HH:mm'}
                  minuteStep={15} 
                  hourStep={1}
                  type={'time'} 
                  onChange={(value) => {
                    console.log(value);
                    setHoraFinal(value);
                  }} />
                </Col>
                <Col span={8}>
                <Select
                    placeholder="Seleccione"                  
                    className="puntoOrigen"
                    style={{ width:'100%' }}
                    options={[
                      { value: '2', label: 'Exacto' },
                    ]}
                  />
                </Col>
              </Row>
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
            </Col>
            <Col span={12}>
              <div
                ref={mapContainerRef}
                style={{
                  width: "100%",
                  height: "48vh",
                  border: "1px #F7F7F7 solid",
                }}
              />
            </Col>
          </Row>
        </>
      )
    },
    {
      key: 3,
      label: (
        <div className="collapseByAction__label">
          <Package size={16} />
          <Title className="collapseByAction__label__text" level={4}>
            Carga
          </Title>
        </div>
      ),
      children: (
        <div>          
            { (typeactive == "1" || typeactive == "2") &&
              <>
              <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
                Material
              </label><p>&nbsp;</p>
              <AutoComplete
                popupClassName="certain-category-search-dropdown"
                popupMatchSelectWidth={500}
                style={{ width: 250 }}
                size="large"
                options={optionsMaterial}
                onSelect={onSelectMaterial}
                onSearch={handleSearchMaterial}
              >
                <Input.Search size="large" placeholder="Buscar material" enterButton />
              </AutoComplete>
              <Table columns={columnsCarga} dataSource={dataCarga} />
              </>
            }
            { typeactive == "3" &&
              <>
              <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
                Personas
              </label><p>&nbsp;</p>
              <AutoComplete
                popupClassName="certain-category-search-dropdown"
                popupMatchSelectWidth={500}
                style={{ width: 250 }}
                size="large"
              >
                <Input.Search size="large" placeholder="Buscar persona" />
              </AutoComplete>
              <Table columns={columnsCargaPersonas} />
              </>
            }            
              <>
              <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
                Vehículo Sugerido
              </label><p>&nbsp;</p>
              <AutoComplete
                popupClassName="certain-category-search-dropdown"
                popupMatchSelectWidth={500}
                style={{ width: 250 }}
                size="large"
                options={optionsVehicles}
              >
                <Input.Search size="large" placeholder="Agregar vehículo" />
              </AutoComplete>
              <Table columns={columnsCargaVehiculo} dataSource={dataVehicles} />
              </>
        </div>
        
      )
    },
    {
      key: 4,
      label: (
        <div className="collapseByAction__label">
          <UserList size={16} />
          <Title className="collapseByAction__label__text" level={4}>
            Responsables
          </Title>
        </div>
      ),
      children: (
        <>
          <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
            <text>Company Code</text>
          </label>
          <Select
            style={{ width: '350px' }}
            options={[{ value: '1', label: 'Halliburton' },{ value: '2', label: 'Halliburton zona franca' }]}
          />
          {dataPsl.map((psl) => (
            <>
            <div className="divdistance">
              <Row>
                <Col span={10}>
                  <label className="locationLabels" style={{ display: 'flex', marginTop: '1rem' }}>
                    <text>Product Service Line (PSL)</text>
                  </label>
                  <Select
                      style={{ width: '100%' }}
                      options={[{ value: 1, label: 'PSL 1' }]}
                      defaultValue={{ key: psl.idpsl}}
                  />
                </Col>
                <Col span={8} style={{paddingLeft:'30px'}}>
                  <label className="locationLabels" style={{ display: 'flex', marginTop: '1rem' }}>
                    <text>Porcentaje PSL</text>
                  </label>
                  <InputNumber<number>
                    style={{ width: '100%' }}
                    defaultValue={psl.percent}
                    min={0}
                    max={100}
                    formatter={(value) => `${value}%`}
                    parser={(value) => value?.replace('%', '') as unknown as number}
                    value={psl.percent}
                  />
                </Col>
              </Row>
              {psl.costcenters.map((cc) => (
                <>
                <Row>
                  <Col span={10} style={{paddingLeft:'30px'}}>
                    <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
                      <text>Centro de costos</text>
                    </label>
                    <Select
                        style={{ width: '100%' }}
                        options={[{ value: 1, label: 'Centro de costos 1' }]}
                        defaultValue={{ key: cc.idpslcostcenter}}
                    />
                  </Col>
                  <Col span={8} style={{paddingLeft:'30px'}}>
                    <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
                      <text>Porcentaje CC</text>
                    </label>
                    <InputNumber<number>
                      style={{ width: '100%' }}
                      defaultValue={cc.percent}
                      min={0}
                      max={100}
                      formatter={(value) => `${value}%`}
                      parser={(value) => value?.replace('%', '') as unknown as number}
                    />
                  </Col>                  
                </Row>
                </>
              ))}
              <Row>
                <Col span={18}>
                </Col>
                <Col span={6} style={{textAlign:'center'}}>
                    <button onClick={() => addPslCostCenter(psl.key)} className="btnagregarpsl"><PlusCircle></PlusCircle>&nbsp;&nbsp;<text>Agregar centro de costos</text></button>
                </Col>
              </Row>
            </div>
            </>
          ))}
          <Row>
            <Col span={24} className="text-right">
              <button onClick={() => addPsl()} className="btnagregarpsl"><PlusCircle></PlusCircle>&nbsp;&nbsp;<text>Agregar PSL</text></button>
            </Col>
          </Row>
        </>
      )
    },
    {
      key: 5,
      label: (
        <div className="collapseByAction__label">
          <NewspaperClipping size={16} />
          <Title className="collapseByAction__label__text" level={4}>
            Información adicional
          </Title>
        </div>
      ),
      children: (
        <>
          <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
            <text>Documentos</text>
          </label>
          <Row className="mainUploadDocuments">
            {mockFiles.map((file) => (
              // eslint-disable-next-line react/jsx-key
              <Col span={12} style={{padding:'15px'}} key={file.key}>
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
              <button onClick={() =>AddFileModal()} className="btnagregarpsl"><PlusCircle></PlusCircle>&nbsp;&nbsp;<text>Agregar otro documento</text></button>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
                <text>Cliente final</text>
              </label>
              <Select
                mode="multiple"
                placeholder = 'Seleccione cliente final'
                style={{ width: '100%' }}
                options={[{ value: '1', label: 'Cliente 1' }]}
              />
            </Col>   
          </Row>
          <Row>
            <Col span={24}>
              <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
                <text>Requerimientos adicionales</text>
              </label>
              <Select
                  placeholder = 'Seleccione requerimiento adicional'
                  style={{ width: '50%' }}
                  options={optionsRequirements}
                  allowClear={true}
              />
              <Table columns={columnsRequerimientosAdicionales} dataSource={dataRequirements} />
            </Col>   
          </Row>
          <Row>
            <Col span={24}>
              <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
                <text>Instrucciones especiales</text>
              </label>
              <TextArea rows={4} />
            </Col>   
          </Row>
          <Row>
            <Col span={24}>
              <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
                <text>Datos de Contacto</text>
              </label>
              <Row style={{paddingLeft:'30px'}}>
                <Col span={24}>
                  <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
                    <text>Contacto punto origen</text>
                  </label>
                  {dataContacts.filter(f => f.contact_type == 1).map((contact)=>(
                  <>
                  <Row>
                    <Col span={12} style={{paddingRight:'15px'}}>
                      <Input placeholder="Nombre del contacto" key={contact.key} value={contact.name} onChange={(e)=>{ UpdateContact(contact.key,'name', e.target.value)}}/>
                    </Col>
                    <Col span={12} style={{paddingLeft:'15px'}}>
                      <Input placeholder="Teléfono: 000 000 0000 " key={contact.key} value={contact.contact_number} onChange={(e)=>{ UpdateContact(contact.key,'phone', e.target.value)}}/>
                    </Col>                  
                  </Row>
                  </>
                  ))}

                </Col>
                <Col span={24}>
                  <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
                    <text>Contacto punto destino</text>
                  </label>
                  {dataContacts.filter(f => f.contact_type == 2).map((contact)=>(
                  <>
                  <Row>
                    <Col span={12} style={{paddingRight:'15px'}}>
                      <Input placeholder="Nombre del contacto"  key={contact.key}  value={contact.name} onChange={(e)=>{ UpdateContact(contact.key,'name', e.target.value)}}/>
                    </Col>
                    <Col span={12} style={{paddingLeft:'15px'}}>
                      <Input placeholder="Teléfono: 000 000 0000 "  key={contact.key} value={contact.contact_number} onChange={(e)=>{ UpdateContact(contact.key,'phone', e.target.value)}}/>
                    </Col>                  
                  </Row>
                  </>
                  ))}
                </Col>
              </Row>
              <Row style={{marginTop:'2rem'}}>
                <Col span={24} className="text-right">
                  <button onClick={() =>AddContactModal()} className="btnagregarpsl"><PlusCircle></PlusCircle>&nbsp;&nbsp;<text>Agregar otro contacto</text></button>
                </Col>
              </Row>
            </Col>   
          </Row>                         
        </>
      )
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
                Crear Nuevo Viaje
              </Title>
            </Flex>
            <Flex component={"navbar"} align="center" justify="space-between">
              <NavRightSection />
            </Flex>
          </Flex>
          {/* ------------Main Info Order-------------- */}
          <Flex className="orderContainer">
            <Row style={{width:'100%'}}>
              <Col span={24} style={{marginBottom:'1.5rem'}}>
                <Flex gap="middle">
                  <button type="button" id={"1"} className={["tripTypes", (typeactive === "1" ? "active" : undefined)].join(" ")} onClick={handleTypeClick}>
                    <div className="tripTypeIcons">
                      <img className="icon" loading="lazy" alt="" src="/images/logistics/truck.svg"/>
                      <div className="text">Carga</div>
                    </div>
                  </button>
                  <button type="button" id={"2"} className={["tripTypes", (typeactive === "2" ? "active" : undefined)].join(" ")} onClick={handleTypeClick}>
                    <div className="tripTypeIcons">
                      <img className="icon" loading="lazy" alt="" src="/images/logistics/izaje.svg"/>
                      <div className="text">Izaje</div>
                    </div>
                  </button>
                  <button type="button" id={"3"} className={["tripTypes", (typeactive === "3" ? "active" : undefined)].join(" ")} onClick={handleTypeClick}>
                    <div className="tripTypeIcons">
                      <img className="icon" loading="lazy" alt="" src="/images/logistics/users.svg"/>
                      <div className="text">Personal</div>
                    </div>
                  </button>
                </Flex>
              </Col>

              <Col span={24}>
                <Collapse
                className="collapseByAction"
                expandIconPosition="end"
                accordion={false}
                ghost              
                items={actionsOptions}
                defaultActiveKey={['2']}
                />            
              </Col>
              <Col span={6} offset={18} className="text-right" style={{marginTop:'2rem', marginBottom:'2rem'}}>
                <Flex gap="middle" align="flex-end">
                  <Button type="primary" onClick={() => onCreateOrder()}>
                    Guardar como draft
                  </Button>
                  <Button disabled >
                    Siguiente
                  </Button>
                </Flex>
              </Col>
            </Row>
          </Flex>
        </Flex>
      </main>
    </>
  );
};