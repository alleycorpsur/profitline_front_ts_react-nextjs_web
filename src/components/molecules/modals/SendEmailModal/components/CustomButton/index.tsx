import React from "react";
import { EditorState, RichUtils } from "draft-js";
import styles from "./CustomButton.module.scss";

interface CustomButtonProps {
  editorState: EditorState;
  onChange: (editorState: EditorState) => void;
  style: string;
  icon: React.FC<{ weight: "bold" | "light"; size: number }>;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  editorState,
  onChange,
  style,
  icon: Icon
}) => {
  const isActive = editorState.getCurrentInlineStyle().has(style);

  const toggleStyle = () => {
    onChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  return (
    <button onClick={toggleStyle} className={styles.activeButton}>
      <Icon weight={isActive ? "bold" : "light"} size={20} />
    </button>
  );
};
