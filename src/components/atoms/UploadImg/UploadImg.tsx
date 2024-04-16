import { Dispatch, SetStateAction, useState } from "react";
import { Flex, Spin, Typography, Upload, UploadProps, message } from "antd";
import "./uploadimg.scss";
import Image from "next/image";
interface Props {
  imgDefault?: string;
  setImgFile: Dispatch<SetStateAction<any>>;
  disabled?: boolean;
}

export const UploadImg = ({ disabled = false, imgDefault = "", setImgFile }: Props) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(imgDefault);

  // eslint-disable-next-line no-unused-vars
  const getBase64 = (img: any, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
    setImgFile(img);
  };
  // Validation for image, max size is 2mb
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) message.error("Image must smaller than 2MB!");
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as any, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  return (
    <Flex vertical className="uploadimg">
      <Upload
        name="avatar"
        listType="picture-card"
        showUploadList={false}
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        disabled={disabled}
      >
        {loading && <Spin />}
        {imageUrl ? (
          <Image src={imageUrl} alt="avatar" width={0} height={0} sizes="100vw" className="img" />
        ) : (
          <Image src={"/images/watermark.svg"} alt="marca de agua" width={48} height={48} />
        )}
      </Upload>
      <Typography.Text className="uploadText">
        * Sube la imagen del logo del proyecto que vas a crear
      </Typography.Text>
    </Flex>
  );
};
