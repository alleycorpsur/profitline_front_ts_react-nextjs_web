import { useEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Flex } from "antd";

import { useAppStore } from "@/lib/store/store";

import "./modalConcilation.scss";

interface Props {
  total: number;
}

export const ModalConcilation = ({ total }: Props) => {
  const formatMoney = useAppStore((state) => state.formatMoney);

  const updateDefaultPosition = () => {
    const modalWidth = draggleRef.current?.offsetWidth || 240;
    setDefaultPosition({ x: window.innerWidth - modalWidth - 20, y: 0 });
  };

  useEffect(() => {
    updateDefaultPosition();
    window.addEventListener("resize", updateDefaultPosition);
    return () => window.removeEventListener("resize", updateDefaultPosition);
  }, []);

  const draggleRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const [defaultPosition, setDefaultPosition] = useState({ x: 0, y: -160 });

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y)
    });
  };

  return (
    <Draggable
      bounds={bounds}
      nodeRef={draggleRef}
      onStart={(event, uiData) => onStart(event, uiData)}
      defaultClassName="modal__concilation"
      defaultPosition={defaultPosition}
    >
      <div ref={draggleRef} className="draggableModal">
        <Flex justify="space-between" gap="1.5rem">
          <div>Total :</div>
          {formatMoney(total)}
        </Flex>
      </div>
    </Draggable>
  );
};
