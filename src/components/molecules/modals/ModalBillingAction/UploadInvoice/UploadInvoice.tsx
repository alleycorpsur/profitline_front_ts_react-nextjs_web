import UiTabs from "@/components/ui/ui-tabs";
import { Flex, Skeleton } from "antd";
import { useEffect, useState } from "react";
import styles from "./UploadInvoice.module.scss";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import { FieldError, useFieldArray, useForm, useWatch } from "react-hook-form";
import UploadFileButton from "../UploadFileButton/UploadFileButton";
import FooterButtons from "../FooterButtons/FooterButtons";
import { InputDateForm } from "@/components/atoms/inputs/InputDate/InputDateForm";
import dayjs from "dayjs";
import { getPreauthorizedInfo, sendInvoices } from "@/services/billings/billings";
import { PreAuthorizationRequestData } from "@/types/logistics/schema";
import { PA, UploadInvoiceForm } from "./controllers/uploadinvoice.types";
import { defaultUploadInvoiceForm } from "./controllers/createDefault";
import { UploadDocumentButton } from "@/components/atoms/UploadDocumentButton/UploadDocumentButton";
import UploadDocumentChild from "@/components/atoms/UploadDocumentChild/UploadDocumentChild";
import { MessageInstance } from "antd/es/message/interface";
import { yupResolver } from "@hookform/resolvers/yup";
import { uploadInvoiceFormSchema } from "./controllers/formSchema";

interface UploadInvoice {
  idTR: number;
  onClose: () => void;
  messageApi: MessageInstance;
}
const UploadInvoice = ({ idTR, onClose, messageApi }: UploadInvoice) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [preauthorizeds, setPreauthorizeds] = useState<PreAuthorizationRequestData[]>([]);
  const [defaultValues, setDefaultValues] = useState<UploadInvoiceForm>(defaultUploadInvoiceForm);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    trigger
  } = useForm<UploadInvoiceForm>({
    defaultValues,
    resolver: yupResolver(uploadInvoiceFormSchema) as any
  });
  const { fields } = useFieldArray({
    control,
    name: "pas"
  });

  //Create default with api data
  function createDefaultValues(pasData: PreAuthorizationRequestData[]): UploadInvoiceForm {
    const defaultValues: PA[] = pasData.map((pa) => ({
      info: {
        id: pa.id,
        idAuthorization: pa.idAuthorization,
        date: dayjs(pa.dateAuthorization),
        value: pa.authorizationFare,
        link: pa.link
      },
      invoice: {
        id: "",
        date: null,
        value: pa.authorizationFare,
        pdfFile: undefined,
        xmlFile: undefined
      }
    }));
    return {
      pas: defaultValues
    };
  }

  const formValues = useWatch({ control });
  const pasCodes = fields.map((field) => `PA-${field.info.idAuthorization}`);

  // Calculate total pre-authorized value
  const getTotalInfoValue = (data: PA[]): number =>
    data.reduce((total, pa) => total + pa.info.value, 0);
  const totalPreAuthorized = getTotalInfoValue(fields);

  // Fetch pre-authorized info
  async function getPreauthorized() {
    try {
      setIsLoading(true);
      const response = await getPreauthorizedInfo(idTR);
      if (response) {
        setPreauthorizeds(response);
      }
    } catch (error) {
      messageApi?.open({
        type: "error",
        content: "Hubo un problema, vuelve a intentarlo"
      });
    } finally {
      setIsLoading(false);
    }
  }
  // Handle form submission
  async function sendForm(form: UploadInvoiceForm) {
    try {
      setIsLoading(true);
      const response = await sendInvoices(form, idTR);
      if (response) {
        messageApi?.open({
          type: "success",
          content: "Creado correctamente",
          duration: 3
        });
      } else {
        messageApi?.open({
          type: "error",
          content: "Hubo un error",
          duration: 3
        });
      }
    } catch (error: any) {
      messageApi?.open({
        type: "error",
        content: error?.message ?? "Hubo un error",
        duration: 3
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  }

  const onSubmit = (data: UploadInvoiceForm) => {
    sendForm(data);
  };

  // Handle document changes
  const handleOnChangeDocument = (type: "pdfFile" | "xmlFile", fileToSave: any) => {
    const { file: rawFile } = fileToSave;
    if (rawFile) {
      const fileSizeInMB = rawFile.size / (1024 * 1024);
      if (fileSizeInMB > 30) {
        console.log(
          "El archivo es demasiado grande. Por favor, sube un archivo de menos de 30 MB."
        );
        return;
      }
      setValue(`pas.${selectedTab}.invoice.${type}.file`, rawFile);
      trigger(`pas.${selectedTab}.invoice.${type}`);
    }
  };

  const handleOnDeleteDocument = (type: "pdfFile" | "xmlFile") => {
    setValue(`pas.${selectedTab}.invoice.${type}.file`, undefined);
    trigger(`pas.${selectedTab}.invoice.${type}`);
  };

  // Calculate pending invoice value
  const getPendingInvoiceValue = (): number => {
    const currentInvoiceTotal =
      formValues?.pas?.reduce((total: number, pa: any) => {
        if (pa.invoice.pdfFile?.file) {
          return total + Number(pa.invoice.value);
        }
        return total;
      }, 0) ?? 0;
    return totalPreAuthorized - currentInvoiceTotal;
  };

  const pendingInvoiceValue = formValues?.pas ? getPendingInvoiceValue() : 0;

  useEffect(() => {
    if (!isInitialized) {
      getPreauthorized();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (preauthorizeds && preauthorizeds.length > 0) {
      const newDefaultValues = createDefaultValues(preauthorizeds);
      setDefaultValues(newDefaultValues);
      reset(newDefaultValues);
    }
  }, [preauthorizeds, reset]);

  const currentInvoice = watch(`pas.${selectedTab}.invoice`);
  const currentInfo = watch(`pas.${selectedTab}.info`);
  const currentErrors = errors ? errors?.pas?.[selectedTab] : undefined;

  const isConfirmDisabled = pendingInvoiceValue !== 0;

  if (isLoading || preauthorizeds.length === 0) {
    return <Skeleton active loading={isLoading} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex vertical gap={24} style={{ paddingBottom: 24 }}>
        <Flex gap={4} vertical>
          <Flex justify="space-between">
            <p className={styles.subtitle}>
              <b>Total preautorizado</b>
            </p>
            <p className={styles.subtitle}>
              <b>{`$${totalPreAuthorized}`}</b>
            </p>
          </Flex>
          <Flex justify="space-between">
            <p className={styles.subtitle}>Pendiente facturación</p>
            <p className={styles.subtitle}>{`$${pendingInvoiceValue}`}</p>
          </Flex>
        </Flex>
        <UiTabs
          tabs={pasCodes}
          onTabClick={(index) => setSelectedTab(index)}
          initialTabIndex={selectedTab}
          className={styles.scrollableTabsUI}
        />
        <Flex vertical gap={16}>
          <Flex gap={16}>
            <InputForm
              key={`info.idAuthorization-${selectedTab}`}
              nameInput={`pas.${selectedTab}.info.idAuthorization`}
              placeholder="Id"
              control={control}
              error={undefined}
              titleInput="Id Preautorización"
              readOnly
            />
            <InputDateForm
              key={`info.date-${selectedTab}`}
              titleInput="Fecha"
              nameInput={`pas.${selectedTab}.info.date`}
              control={control}
              error={undefined}
              disabled
            />
            <InputForm
              key={`info.value-${selectedTab}`}
              placeholder="Valor"
              nameInput={`pas.${selectedTab}.info.value`}
              control={control}
              error={undefined}
              titleInput="Valor"
              readOnly
            />
          </Flex>
          <UploadDocumentButton
            key={`info.file-${selectedTab}`}
            title={"Preautorización"}
            isMandatory={true}
            setFiles={() => {}}
            disabled
          >
            <UploadDocumentChild
              linkFile={currentInfo.link}
              nameFile={pasCodes[selectedTab]}
              showTrash={false}
              onDelete={() => {}}
            />
          </UploadDocumentButton>
        </Flex>
        <Flex vertical gap={16}>
          <p className={styles.subtitle}>
            <b>Factura</b>
          </p>
          <Flex gap={16}>
            <InputForm
              key={`invoice.id-${selectedTab}`}
              className={styles.inputForm}
              placeholder="Id Factura"
              nameInput={`pas.${selectedTab}.invoice.id`}
              control={control}
              error={currentErrors?.invoice?.id}
              titleInput="Id Factura"
            />
            <InputDateForm
              key={`invoice.date-${selectedTab}`}
              titleInput="Fecha"
              nameInput={`pas.${selectedTab}.invoice.date`}
              control={control}
              error={(currentErrors?.invoice?.date as FieldError) ?? undefined}
            />
            <InputForm
              key={`invoice.value-${selectedTab}`}
              placeholder="Valor"
              nameInput={`pas.${selectedTab}.invoice.value`}
              control={control}
              error={undefined}
              readOnly
              titleInput="Valor"
            />
          </Flex>
          <UploadFileButton
            isMandatory={true}
            key={`${selectedTab}.${currentInvoice.id}.pdf`}
            title={"PDF Factura"}
            handleOnDelete={() => handleOnDeleteDocument("pdfFile")}
            handleOnChange={(file) => handleOnChangeDocument("pdfFile", file)}
            fileName={currentInvoice?.pdfFile?.file?.name ?? undefined}
            fileSize={currentInvoice?.pdfFile?.file?.size ?? undefined}
          />
          <UploadFileButton
            isMandatory={false}
            key={`${selectedTab}.${currentInvoice.id}.xml`}
            title={"XML Factura"}
            handleOnDelete={() => handleOnDeleteDocument("xmlFile")}
            handleOnChange={(file) => handleOnChangeDocument("xmlFile", file)}
            fileName={currentInvoice?.xmlFile?.file?.name ?? undefined}
            fileSize={currentInvoice?.xmlFile?.file?.size ?? undefined}
          />
        </Flex>
      </Flex>
      <FooterButtons
        isConfirmDisabled={isConfirmDisabled}
        titleConfirm="Cargar facturas"
        onClose={onClose}
        handleOk={handleSubmit(onSubmit)}
      />
    </form>
  );
};
export default UploadInvoice;