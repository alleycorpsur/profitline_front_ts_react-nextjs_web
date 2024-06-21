import { useState } from "react";

interface FileFromDragger {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  originFileObj: File;
  percent: number;
  size: number;
  status: string;
  type: string;
  uid: string;
}

interface FileObjectFromButton {
  file: FileFromDragger;
  fileList: FileFromDragger[];
}

export const useEvidenceModal = () => {
  const [selectedEvidence, setSelectedEvidence] = useState<File[]>([]);
  const [commentary, setCommentary] = useState<string | undefined>();

  const handleOnChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentary(e.target.value);
  };

  const handleOnChangeDocument: any = (info: FileObjectFromButton) => {
    const { file } = info;
    const rawFile = file.originFileObj;
    if (rawFile) {
      const fileSizeInMB = rawFile.size / (1024 * 1024);

      if (fileSizeInMB > 30) {
        alert("El archivo es demasiado grande. Por favor, sube un archivo de menos de 30 MB.");
        return;
      }

      setSelectedEvidence([...selectedEvidence, rawFile]);
    }
  };

  const handleOnDeleteDocument = (fileName: string) => {
    const updatedFiles = selectedEvidence?.filter((file) => file.name !== fileName);
    setSelectedEvidence(updatedFiles);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files as FileList);

    for (let i = 0; i < files.length; i++) {
      if (selectedEvidence.some((file) => file.name === files[i].name)) {
        alert("Ya existe un archivo con el mismo nombre");
        return;
      }
    }

    setSelectedEvidence((prevFiles) => [...prevFiles, ...files]);
  };

  return {
    selectedEvidence,
    commentary,
    handleOnChangeDocument,
    handleOnDeleteDocument,
    handleFileChange,
    handleOnChangeTextArea
  };
};
