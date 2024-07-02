import { Flex } from "antd";
import { Triangle } from "phosphor-react";

export default function TablePaginator(
  page: number,
  type: "page" | "prev" | "next" | "jump-prev" | "jump-next",
  originalElement: React.ReactNode
) {
  if (type === "prev") {
    return <Triangle size={".75rem"} weight="fill" style={{ transform: "rotate(-90deg)" }} />;
  }
  if (type === "next") {
    return <Triangle size={".75rem"} weight="fill" style={{ transform: "rotate(90deg)" }} />;
  }
  if (type === "page") {
    return <Flex justify="center">{page}</Flex>;
  }

  if (type === "jump-prev") {
    return <Triangle size={".75rem"} weight="fill" style={{ transform: "rotate(-180deg)" }} />;
  }
  return originalElement;
}
