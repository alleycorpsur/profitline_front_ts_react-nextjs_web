import React, { useState } from "react";
import { Button, Row, Col, Select, Flex, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Plus } from "phosphor-react";
import style from "./form.module.scss";
import QuestionCard from "./components/QuestionCard";
import { SelectType } from "./components/SelectType";
import { FormValues, Question, QuestionType } from "./controllers/formSchema";
import { useFieldArray, useForm } from "react-hook-form";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import { InputSelect } from "@/components/atoms/inputs/InputSelect/InputSelect";
import { FooterButtons } from "@/components/molecules/FooterButtons/FooterButtons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Text, Title } = Typography;
const { Option } = Select;

const defaultQuestion = {
  type: null,
  question: "",
  description: "",
  isRequired: false,
  options: [],
  answer: ""
};

const CreateFormView: React.FC = () => {
  const { control, register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      formName: "",
      formDescription: "",
      validity: 0,
      questions: [defaultQuestion]
    }
  });
  const formNow = watch();
  console.log("formNow", formNow);
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "questions",
    keyName: "id"
  });
  const onSubmit = (data: FormValues) => {
    console.log(data);
  };
  console.log("fields", fields);

  const handleFinish = (values: any) => {
    console.log("Form values:", values);
  };
  const handleTypeClick = (index: number, question: Question, type: QuestionType) => {
    update(index, { ...question, type });
  };
  const handleChangeIsMandatory = (index: number, question: Question, newState: boolean) => {
    update(index, { ...question, isRequired: newState });
  };
  const handleDeleteQuestion = (index: number) => {
    remove(index);
  };

  const handleAddQuestion = () => {
    append(defaultQuestion);
  };
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={style.container}>
        <Flex
          vertical
          gap="1.5rem"
          style={{
            maxWidth: "42rem",
            margin: "auto"
          }}
        >
          <Row justify="space-between" align="middle">
            <Title level={4} style={{ margin: 0 }}>
              Crear formulario
            </Title>
          </Row>

          <Button
            type="text"
            icon={<CloseOutlined />}
            style={{ position: "absolute", right: "1rem", top: "1rem" }}
            onClick={handleGoBack}
          />

          <Row gutter={16}>
            <Col span={12}>
              <InputForm
                nameInput="formName"
                titleInput="Nombre del formulario"
                placeholder="Ingresar nombre"
                control={control}
              />
            </Col>
            <Col span={12}>
              <InputSelect
                titleInput="Vigencia"
                nameInput="validity"
                control={control}
                error={undefined}
                options={[
                  { value: 1, label: "1 año" },
                  { value: 2, label: "2 años" },
                  { value: 3, label: "3 años" }
                ]}
                loading={false}
                placeholder="Seleccionar vigencia"
              />
            </Col>
          </Row>
          <InputForm
            nameInput="formDescription"
            titleInput="Descripción"
            placeholder="Ingresar descripción"
            control={control}
          />
          {fields.map((question, index) => {
            if (!question.type)
              return (
                <Flex vertical key={index} gap={8}>
                  <p className={style.selectTitle}>Seleccionar tipo de pregunta</p>
                  <SelectType
                    typeSelected={question.type}
                    handleTypeClick={(type: QuestionType) => handleTypeClick(index, question, type)}
                  />
                </Flex>
              );
            return (
              <QuestionCard
                key={question.id}
                order={index + 1}
                onDelete={() => handleDeleteQuestion(index)}
                onChangeIsMandatory={(newState: boolean) =>
                  handleChangeIsMandatory(index, question, newState)
                }
                questionType={question.type}
                control={control}
                index={index}
                isRequired={question.isRequired}
              />
            );
          })}
          <Flex justify="flex-start">
            <Button
              type="dashed"
              onClick={() => handleAddQuestion()}
              icon={<Plus size={16} />}
              style={{
                backgroundColor: "#F7F7F7",
                fontWeight: 500,
                border: "none"
              }}
            >
              Agregar nueva pregunta
            </Button>
          </Flex>
          <FooterButtons
            backTitle={"Cancelar"}
            nextTitle={`Crear formulario`}
            handleBack={() => {}}
            handleNext={() => {}}
            nextDisabled={false}
            isSubmitting={false}
          />
        </Flex>
      </div>
    </form>
  );
};

export default CreateFormView;
