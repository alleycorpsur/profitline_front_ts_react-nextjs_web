import React, { FC } from "react";

import styles from "./timeline-events.module.scss";
import StepperContentSkeleton from "@/modules/clients/containers/invoice-detail-modal/skeleton/skeleton-invoid-detail";

interface TimelineEventsProps {
  events:
    | {
        id: number;
        title: string;
        date?: string;
        content?: React.ReactNode;
        leftIcon?: React.ReactNode;
      }[]
    | undefined;
}

const TimelineEvents: FC<TimelineEventsProps> = ({ events }) => {
  const loading = false;
  return (
    <div className={styles.content}>
      <div className={styles.progress}></div>

      <div className={styles.stepperContainer}>
        <div className={styles.stepperContent}>
          {loading ? (
            <StepperContentSkeleton />
          ) : (
            events?.map((event, index, arr) => (
              <div key={event.id} className={styles.mainStep}>
                <div
                  className={`${styles.stepLine} ${index === arr.length - 1 ? styles.inactive : styles.active}`}
                />
                <div className={`${styles.stepCircle} ${styles.active}`} />
                <div className={styles.stepLabel}>
                  <div className={styles.cardInvoiceFiling}>
                    <h5 className={styles.title}>TITULO</h5>
                    <p>15 Octubre 2023</p>
                    {event.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default TimelineEvents;
