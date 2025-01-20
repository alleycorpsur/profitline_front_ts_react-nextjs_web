import React from "react";
import { Controller, Control } from "react-hook-form";
import { Typography, Upload } from "antd";
import { ArrowLineUp } from "phosphor-react";

const { Text } = Typography;

interface FileUploadButtonProps {
  name: string;
  control: Control<any>;
  placeholder?: string;
  required?: boolean;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  name,
  control,
  placeholder = "Cargar archivo",
  required = false
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field, fieldState }) => (
        <div>
          <Upload
            beforeUpload={(file) => {
              field.onChange(file); // Actualiza el estado de React Hook Form
              return false; // Evita que el archivo se suba automáticamente
            }}
            showUploadList={false} // Oculta la lista predeterminada de Ant Design
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                height: "48px",
                padding: "8px 16px",
                background: "#f5f5f5",
                border: `1px solid ${fieldState.error ? "#ff4d4f" : "#e5e5e5"}`,
                borderRadius: "8px",
                cursor: "pointer",
                color: "#b3b3b3",
                fontSize: "14px",
                fontWeight: "500",
                transition: "background 0.3s, border-color 0.3s"
              }}
            >
              <ArrowLineUp color="#DDDDDD" size={16} />
              <Text style={{ color: "#DDDDDD" }}>{field.value?.name || placeholder}</Text>
            </div>
          </Upload>
          {fieldState.error && (
            <Text type="danger" style={{ marginTop: 4, display: "block" }}>
              {"Este campo es obligatorio"}
            </Text>
          )}
        </div>
      )}
    />
  );
};

export default FileUploadButton;
