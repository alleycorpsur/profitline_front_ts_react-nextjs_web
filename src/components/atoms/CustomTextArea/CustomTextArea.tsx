import React, { useEffect, useRef } from "react";
import { ControllerRenderProps } from "react-hook-form";
import "./customTextArea.scss";

type CustomTextAreProps = {
  field?: ControllerRenderProps<any>;
  placeholder?: string;
  customStyles?: React.CSSProperties;
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
  highlightWords?: string[];
  readOnly?: boolean;
  disabled?: boolean;
  customStyleTextArea?: React.CSSProperties;
};

export const CustomTextArea = ({
  field,
  placeholder,
  customStyles,
  onChange,
  value,
  highlightWords,
  readOnly,
  disabled,
  customStyleTextArea
}: CustomTextAreProps) => {
  //
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    const mirror = mirrorRef.current;

    if (textarea && mirror) {
      // Set up styles and event listeners
      const textareaStyles = window.getComputedStyle(textarea);
      [
        "border",
        "boxSizing",
        "fontFamily",
        "fontSize",
        "fontWeight",
        "letterSpacing",
        "lineHeight",
        "padding",
        "textDecoration",
        "textIndent",
        "textTransform",
        "whiteSpace",
        "wordSpacing",
        "wordWrap"
      ].forEach((property: any) => {
        mirror.style[property] = textareaStyles[property];
      });
      mirror.style.borderColor = "transparent";

      const parseValue = (v: string) => (v.endsWith("px") ? parseInt(v.slice(0, -2), 10) : 0);
      const borderWidth = parseValue(textareaStyles.borderWidth);

      const ro = new ResizeObserver(() => {
        mirror.style.width = `${textarea?.clientWidth + 2 * borderWidth}px`;
        mirror.style.height = `${textarea?.clientHeight + 2 * borderWidth}px`;
      });
      ro.observe(textarea);

      textarea.addEventListener("scroll", () => {
        mirror.scrollTop = textarea.scrollTop;
      });

      // Set up scroll event listener
      textarea.addEventListener("scroll", () => {
        mirror.scrollTop = textarea.scrollTop;
      });

      //set up value
      mirror.textContent = value ? value : "";

      // Highlight keywords

      if (highlightWords) {
        const highlight = () => {
          let html = value || "";
          highlightWords.forEach((word) => {
            html = html.split(word).join(`<span class="container__mark">${word}</span>`);
          });
          mirror.innerHTML = html;
        };
        highlight();
      }
    }
  }, [value]);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) onChange(e);
  };

  return (
    <div className="container" id="container" style={customStyles}>
      <div ref={mirrorRef} className="container__mirror" />
      <textarea
        {...field}
        style={customStyleTextArea}
        ref={textareaRef}
        id="textarea"
        className="container__textarea"
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        readOnly={readOnly}
        disabled={disabled}
      />
    </div>
  );
};
