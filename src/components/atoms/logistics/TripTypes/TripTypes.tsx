import { FunctionComponent, useState} from "react";
import styles from "./TripTypes.module.css";

export type TripTypesType = {
  className?: string;
  icon?: string;
  text?: string;
  id?: string;
};

const TripTypes: FunctionComponent<TripTypesType> = ({
  className = "",
  icon,
  text,
  id
}) => {

  const [active, setActive] = useState("");
 
  const handleClick = (event:any) => {
    setActive(event.target.id);
    console.log(event);
  }

  return (
    <button id={id} className={[styles.tripTypes, (active === id ? styles.active : undefined), className].join(" ")} onClick={handleClick}>
      <div className={styles.tripTypeIcons}>
        <img
          className={styles.icon}
          loading="lazy"
          alt=""
          src={icon}
        />
        <a className={styles.text}>
          {text}
        </a>
      </div>
    </button>
  );
};

export default TripTypes;
