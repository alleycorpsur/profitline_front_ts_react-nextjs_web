import { IChanel } from "@/types/bre/IBRE";
import { CountryCode } from "@/types/global/IGlobal";

interface Subline {
  id: number;
  description: string;
}

interface MyObject {
  idChannel: number;
  idLine: number;
  subline: Subline;
}
export function removeDuplicatesBySublineId(array: MyObject[]): MyObject[] {
  const uniqueMap = new Map<number, MyObject>();

  array.forEach((item) => {
    const sublineId = item.subline.id;
    if (!uniqueMap.has(sublineId)) {
      uniqueMap.set(sublineId, item);
    }
  });

  const uniqueArray: MyObject[] = Array.from(uniqueMap.values());

  return uniqueArray;
}
export function removeObjectsFromArray(
  originalArray: MyObject[],
  objectsToRemove: MyObject[]
): MyObject[] {
  const objectsToRemoveSet = new Set(objectsToRemove.map((obj) => JSON.stringify(obj)));

  const newArray = originalArray.filter((obj) => !objectsToRemoveSet.has(JSON.stringify(obj)));

  return newArray;
}
export function removeDuplicatesFromArrayNumbers(array: number[]): number[] {
  const uniqueSet = new Set(array);
  const uniqueArray = Array.from(uniqueSet);
  return uniqueArray;
}

export const filterBRbyIdSubline = (brs: any[], sublinesIds: number[]) => {
  if (sublinesIds?.length === 0) return;
  const filteredResults = brs.filter((channel) => {
    if (channel.CHANNEL_LINES) {
      // Filter channels with non-null CHANNEL_LINES
      channel.CHANNEL_LINES = channel.CHANNEL_LINES.filter((line: any) => {
        if (line.sublines?.length > 0) {
          // Filter lines with non-null sublines
          return line?.sublines?.some((subline: any) => sublinesIds?.includes(subline.id));
        }
        return false; // No sublines in this line
      });

      // Keep the channel only if it has lines after filtering
      return channel.CHANNEL_LINES.length > 0;
    }
    return false; // No CHANNEL_LINES in this channel
  });
  return filteredResults;
};

export const transformFormat = (original: any) => {
  const result = [] as any;

  original.forEach((channel: any) => {
    const idChannel = channel.CHANNEL_ID;

    if (channel.CHANNEL_LINES) {
      channel.CHANNEL_LINES.forEach((line: any) => {
        const idLine = line.id;

        if (line.sublines) {
          line.sublines.forEach((subline: any) => {
            const transformedObject = {
              idChannel,
              idLine,
              subline: {
                id: subline.id,
                description: subline.description
              }
            };
            result.push(transformedObject);
          });
        }
      });
    }
  });

  return result;
};

export const extractChannelLineSublines = (brs: IChanel[]) => {
  const extractedData = {
    channels: [] as { id: number; name: string }[],
    lines: [] as { id: number; name: string }[],
    sublines: [] as { id: number; name: string }[]
  };
  brs.forEach((channel) => {
    // Extract channel information
    const channelInfo = {
      id: channel.CHANNEL_ID,
      name: channel.CHANNEL_NAME
    };
    extractedData.channels.push(channelInfo);
    // Extract line information
    if (channel.CHANNEL_LINES) {
      channel.CHANNEL_LINES.forEach((line) => {
        const lineInfo = {
          id: line.id,
          name: line.description
        };
        extractedData.lines.push(lineInfo);

        // Extract subline information
        if (line.sublines) {
          line.sublines.forEach((subline) => {
            const sublineInfo = {
              id: subline.id,
              name: subline.description
            };
            extractedData.sublines.push(sublineInfo);
          });
        }
      });
    }
  });
  return extractedData;
};

export const docTypeIdBasedOnDocType = (documentType: string) => {
  switch (documentType) {
    case "NIT":
      return 1;
    case "Cedula":
      return 2;
    case "Pasaporte":
      return 3;
    case "Cedula de extranjeria":
      return 4;
    default:
      return 0;
  }
};

export function extractSingleParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
export const formatDateBars = (date: string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const day = `0${d.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};

export function daysLeft(dateString: string): number {
  const today = new Date();
  const expirationDate = new Date(dateString);

  const diffInMs = expirationDate.getTime() - today.getTime();

  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
}

export const insertPeriodEveryThreeDigits = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export function formatMoney(text: string, countryCode?: CountryCode): string {
  const { currency, id } = countryFormater(countryCode);
  const number = parseFloat(text);
  const formatter = new Intl.NumberFormat(id, {
    style: "currency",
    currency,
    minimumFractionDigits: 0
  });

  return formatter.format(number);
}

const countryFormater = (currency: CountryCode = "co") => {
  return intFormat[currency];
};

const intFormat = {
  en: { currency: "USD", id: "en-US" },
  eur: { currency: "EUR", id: "en-DE" },
  jpn: { currency: "JPY", id: "ja-JP" },
  ch: { currency: "CNY", id: "zh-CN" },
  kr: { currency: "KRW", id: "ko-KR" },
  es: { currency: "EUR", id: "es-ES" },
  co: { currency: "COP", id: "es-CO" }
};

export const getCityName = (id: number) => {
  const city = locations.find((location) => location.id === id);
  return city?.city;
};

const locations = [
  {
    id: 1,
    city: "Bogotá"
  },
  {
    id: 246,
    city: "Medellin"
  },
  {
    id: 247,
    city: "Cali"
  },
  {
    id: 248,
    city: "Pereira"
  },
  {
    id: 249,
    city: "Barranquilla"
  }
];

export const isNonEmptyObject = (obj: {}) => {
  return !(Object.keys(obj).length === 0 && obj.constructor === Object);
};

export const stringToBoolean = (value: string | boolean | undefined): boolean => {
  if (value === undefined) {
    return false;
  }
  return value === "true" || value === true;
};
