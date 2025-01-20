import dayjs, { Dayjs } from "dayjs";
import { IRequirement, RequirementType, Status, SupplierFormValues } from "../interfaces/FormData";

const mockedRequirements: IRequirement[] = [
  {
    requirementId: 1,
    id: 1,
    name: "RUT",
    description: "Registro Único Tributario del proveedor.",
    template: "https://example.com/templates/rut-template.pdf",
    validity: "3 meses",
    approvers: ["Juan Pérez", "María Gómez"],
    type: RequirementType.document,
    status: Status.Pendiente,
    events: [
      {
        id: 1,
        avatar: null,
        userName: "Carlos Sánchez",
        time: "Hace 2 horas",
        comment: "El archivo está pendiente de revisión."
      }
    ],
    files: [],
    uploadedAt: "2025-01-10T10:00:00Z",
    expirationDate: dayjs()
  },
  {
    requirementId: 2,
    id: 2,
    name: "Formulario de Inscripción",
    description: "Formulario requerido para la inscripción del proveedor.",
    template: "https://example.com/templates/inscription-form-template.pdf",
    validity: "6 meses",
    approvers: ["Sofía Ramírez"],
    type: RequirementType.form,
    status: Status.EnAuditoria,
    events: [
      {
        id: 2,
        avatar: "https://example.com/avatars/user2.png",
        userName: "Luis Martínez",
        time: "Hace 1 día",
        comment: "El formulario fue revisado. Falta validación final."
      }
    ],
    files: [],
    loadedBy: "Ana Torres",
    uploadedAt: "2025-01-08T14:00:00Z",
    expirationDate: dayjs()
  },
  {
    requirementId: 3,
    id: 3,
    name: "Certificación Bancaria",
    description: "Documento para certificar la cuenta bancaria del proveedor.",
    validity: "Indefinido",
    approvers: ["Roberto Delgado"],
    type: RequirementType.document,
    status: Status.Rechazado,
    events: [
      {
        id: 3,
        avatar: "https://example.com/avatars/user3.png",
        userName: "Claudia Ortega",
        time: "Hace 3 días",
        comment: "El archivo cargado no cumple con los requisitos."
      }
    ],
    files: [],
    loadedBy: "Pedro Méndez",
    uploadedAt: "2025-01-05T11:30:00Z"
  }
];

export default mockedRequirements;

export const mockedSupplierFormValues: SupplierFormValues = {
  companyName: "Distribuidora Global S.A.",
  documentNumber: "123456789",
  documentType: "NIT",
  legalRepresentative: "Juan Pérez",
  supplierType: "Proveedor Internacional",
  country: "Colombia",
  department: "Cundinamarca",
  city: "Bogotá",
  address: "Carrera 45 #123-45",
  phone: "+57 312 345 6789",
  email: "contacto@distribuidoraglobal.com",
  economicActivity: "Comercio de bienes de consumo",
  requirements: mockedRequirements
};
