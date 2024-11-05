import React, { FC } from "react";

import { formatDatePlane } from "@/utils/utils";

import StepperContentSkeleton from "@/modules/clients/containers/invoice-detail-modal/skeleton/skeleton-invoid-detail";

import styles from "./timeline-events.module.scss";

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
                {event.leftIcon ? <div className={styles.leftIcon}> {event.leftIcon}</div> : null}

                <div
                  className={`${styles.stepLine} ${index === arr.length - 1 ? styles.inactive : styles.active}`}
                />
                <div className={`${styles.stepCircle} ${styles.active}`} />
                <div className={styles.stepLabel}>
                  <div className={styles.cardInvoiceFiling}>
                    <h5 className={styles.title}>{event.title}</h5>
                    {event.date ? (
                      <p className={styles.date}>{formatDatePlane(event.date)}</p>
                    ) : null}
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
