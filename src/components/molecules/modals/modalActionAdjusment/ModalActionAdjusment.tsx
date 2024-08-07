import { Flex, Modal, Spin } from "antd";
import { CaretRight, Pencil, Trash } from "phosphor-react";
import React, { useState } from "react";
import "./modalActionAdjusment.scss";
import { Gavel } from "@phosphor-icons/react";
import ItemsModalLegalize from "@/components/atoms/ItemsModalLegalize/ItemsModalLegalize";
import { ISelectedAccountingAdjustment } from "../ModalActionDiscountCredit/ModalActionDiscountCredit";
import { formatMoney } from "@/utils/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  adjustment: {
    type: string | undefined;
    id: string;
    amount: string;
  };
}

const extractType = (type: string | undefined) => {
  if (type === "Nota debito") {
    return 1;
  } else if (type === "Nota credito") {
    return 2;
  } else if (type === "Descuento") {
    return 3;
  }
  return 1;
};
export const ModalActionAdjusment = ({ isOpen, onClose, adjustment }: Props) => {
  const [currentView, setCurrentView] = useState<string>("selectAccountingAdjustment");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // Update the handleCheckClick function
  const handleCheckClick = (item: ISelectedAccountingAdjustment) => {
    setSelectedItemId(item.id);
  };

  const noteData = [
    {
      id: 1,
      current_value: 100000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 1000000
    },
    {
      id: 2,
      current_value: 200000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 2000000
    },
    {
      id: 3,
      current_value: 300000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 300000
    },
    {
      id: 4,
      current_value: 400000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 400000
    },
    {
      id: 5,
      current_value: 500000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 500000
    },
    {
      id: 6,
      current_value: 600000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 600000
    },
    {
      id: 1,
      current_value: 100000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 1000000
    },
    {
      id: 2,
      current_value: 200000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 2000000
    },
    {
      id: 3,
      current_value: 300000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 300000
    },
    {
      id: 4,
      current_value: 400000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 400000
    },
    {
      id: 5,
      current_value: 500000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 500000
    },
    {
      id: 6,
      current_value: 600000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 600000
    },
    {
      id: 1,
      current_value: 100000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 1000000
    },
    {
      id: 2,
      current_value: 200000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 2000000
    },
    {
      id: 3,
      current_value: 300000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 300000
    },
    {
      id: 4,
      current_value: 400000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 400000
    },
    {
      id: 5,
      current_value: 500000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 500000
    },
    {
      id: 6,
      current_value: 600000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 600000
    },
    {
      id: 1,
      current_value: 100000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 1000000
    },
    {
      id: 2,
      current_value: 200000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 2000000
    },
    {
      id: 3,
      current_value: 300000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 300000
    },
    {
      id: 4,
      current_value: 400000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 400000
    },
    {
      id: 5,
      current_value: 500000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 500000
    },
    {
      id: 6,
      current_value: 600000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 600000
    },
    {
      id: 7,
      current_value: 700000,
      selected: false,
      motive_name: "Volumen",
      intialAmount: 700000
    }
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={
        currentView === "selectAccountingAdjustment"
          ? onClose
          : () => setCurrentView("selectAccountingAdjustment")
      }
      title={
        currentView === "legalizeAccountingAdjustment" ? (
          <div className="title_modal_adjusment">
            <div> {adjustment.type} por legalizar</div>
            <div>
              NC{adjustment.id} {formatMoney(adjustment.amount)}
            </div>
          </div>
        ) : (
          "Selecciona la acción que vas a realizar"
        )
      }
      footer={null}
      width={"40%"}
      bodyStyle={{
        height: currentView === "legalizeAccountingAdjustment" ? "calc(80vh - 20px)" : "auto"
      }}
    >
      {currentView === "selectAccountingAdjustment" && (
        <div className="content">
          <Flex vertical gap="small">
            <button
              className="actionButton"
              onClick={() => setCurrentView("legalizeAccountingAdjustment")}
            >
              <p className="actionButton__text">
                <Gavel size={24} /> Legalizar ajuste contable
              </p>
              <CaretRight className="actionButton__caretRight" />
            </button>
            <button
              className="actionButton"
              onClick={() => setCurrentView("editAccountingAdjustment")}
            >
              <p className="actionButton__text">
                <Pencil size={24} />
                Editar ajuste contable
              </p>
              <CaretRight className="actionButton__caretRight" />
            </button>
            <button
              className="actionButton"
              onClick={() => setCurrentView("deleteAccountingAdjustment")}
            >
              <p className="actionButton__text">
                <Trash size={24} />
                Eliminar ajuste contable
              </p>
              <CaretRight className="actionButton__caretRight" />
            </button>
          </Flex>
        </div>
      )}
      {currentView === "legalizeAccountingAdjustment" && (
        <div className="mal-modalContent">
          <p className="mal-subTitleModalAction">
            {subtitleMap[extractType(adjustment.type) || 1]}
          </p>
          <Flex vertical gap="small" className="mal-conten_modal_select_ajust">
            <div className="mal-modalContentScroll">
              {isLoading ? (
                <Spin size="large" style={{ margin: "auto" }} />
              ) : (
                noteData.map((item, index) => (
                  <ItemsModalLegalize
                    key={index}
                    item={item}
                    type={extractType(adjustment.type) || 1}
                    onHeaderClick={() => handleCheckClick(item)}
                    selectedItemId={selectedItemId}
                  />
                ))
              )}
            </div>
            <Flex gap="8px" className="mal-container__button">
              <button
                type="button"
                className="button__action__text button__action__text__white"
                onClick={() => setCurrentView("selectAccountingAdjustment")}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`mal-button__action__text ${selectedItemId !== null ? "mal-button__action__text__green" : ""}`}
                onClick={() => {
                  selectedItemId !== null && setCurrentView("selectAccountingAdjustment");
                }}
              >
                Continuar
              </button>
            </Flex>
          </Flex>
        </div>
      )}
      {currentView === "editAccountingAdjustment" && (
        <div className="content">
          <Flex vertical gap="small">
            <button
              className="actionButton"
              onClick={() => setCurrentView("selectAccountingAdjustment")}
            >
              <p className="actionButton__text">
                <Pencil size={24} />
                Editar ajuste contable
              </p>
              <CaretRight className="actionButton__caretRight" />
            </button>
          </Flex>
        </div>
      )}
      {currentView === "deleteAccountingAdjustment" && (
        <div className="content">
          <Flex vertical gap="small">
            <button
              className="actionButton"
              onClick={() => setCurrentView("selectAccountingAdjustment")}
            >
              <p className="actionButton__text">
                <Trash size={24} />
                Eliminar ajuste contable
              </p>
              <CaretRight className="actionButton__caretRight" />
            </button>
          </Flex>
        </div>
      )}
    </Modal>
  );
};

const subtitleMap: Record<number, string> = {
  1: "Selecciona la(s) nota(s) débito a aplicar",
  2: "Selecciona la(s) nota(s) crédito a aplicar",
  3: "Selecciona los descuento a aplicar"
};
