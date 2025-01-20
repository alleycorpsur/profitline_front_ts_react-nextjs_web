import { QuestionType } from "./schema";

export const mockForm = {
  formName: "Encuesta de Satisfacción",
  formDescription: "Formulario para recopilar opiniones sobre el servicio",
  validity: 1, // 1 año
  questions: [
    {
      id: 1,
      type: QuestionType.TEXT, // Tipo de pregunta
      question: "¿Qué te pareció nuestro servicio?",
      description: "Describe brevemente tu experiencia.",
      isRequired: true
    },
    {
      id: 2,
      type: QuestionType.SINGLE_CHOICE, // Pregunta de opción única
      question: "¿Recomendarías nuestro servicio?",
      description: "Selecciona una opción.",
      isRequired: true,
      options: [
        { value: 1, label: "Sí" },
        { value: 2, label: "No" }
      ]
    },
    {
      id: 3,
      type: QuestionType.MULTIPLE_CHOICE, // Pregunta de opción múltiple
      question: "¿Qué aspectos te gustaron más?",
      description: "Selecciona todas las opciones que apliquen.",
      isRequired: false,
      options: [
        { value: 1, label: "Calidad del servicio" },
        { value: 2, label: "Precio" },
        { value: 3, label: "Atención al cliente" }
      ]
    },
    {
      id: 5,
      type: QuestionType.FILE, //
      question: "Sube una foto",
      description: "Selecciona una foto de tu album",
      isRequired: true
    }
  ]
};
