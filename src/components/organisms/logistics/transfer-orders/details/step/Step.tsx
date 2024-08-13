import { Typography } from 'antd';
import styles from './step.module.scss';

const Text = Typography;

export const Step = () => {
  const steps = [
    {
      id: 1,
      number: 1,
      title: 'Booking',
      date: '22/12/24 - 07:00 h',
      name: 'Nombre del responsable',
    },
    {
      id: 2,
      number: 2,
      title: 'Pricing',
      date: '22/12/24 - 07:00 h',
      name: 'Nombre del responsable',
    },
    {
      id: 3,
      number: 4,
      title: 'En curso',
      date: '22/12/24 - 07:00 h',
      name: 'Nombre del responsable',
    },
    {
      id: 4,
      number: 4,
      title: 'Legalización',
      date: '22/12/24 - 07:00 h',
      name: 'Nombre del responsable',
    },
    {
      id: 5,
      number: 5,
      title: 'Facturado',
      date: '22/12/24 - 07:00 h',
      name: 'Nombre del responsable',
    },
  ]
  return (
    <div className={styles.mainSteps}>
      {steps.map((item, index) => (
        <div key={`step-${index}`} className={`${styles.step} ${index + 1 === steps.length && styles.lastStep}`}>
          <div className={styles.dotContainer}>
            <div className={styles.dot}>
              <Text className={styles.dotText}>{item.number}</Text>
            </div>
            {index + 1 === steps.length || <div className={styles.dotLine} />}
          </div>
          <div>
            <Text className={styles.title}>{item.title}</Text>
            <Text className={styles.subtitle}>{item.date}</Text>
            <Text className={styles.subtitle}>{item.name}</Text>
          </div>
        </div>
      ))}
    </div>
  )
}