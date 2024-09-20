import { Button } from "antd";
import { Envelope } from "phosphor-react";

import "./contactUsButton.scss";

export const ContactUsButton = () => {
  return (
    <div className="contactUsButton">
      <Button className="contactUsButton__btn">
        Contáctanos <Envelope size={16} />
      </Button>
    </div>
  );
};
