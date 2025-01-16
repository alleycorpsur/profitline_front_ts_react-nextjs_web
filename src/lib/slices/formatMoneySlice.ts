/* eslint-disable no-unused-vars */

export interface IFormatMoneyStore {
  locale: string; // Global default locale
  currency: string; // Global default currency
  setLocale: (locale: string) => void;
  setCurrency: (currency: string) => void;
  formatMoney: (
    amount: string | number | undefined | null,
    hideCurrencySymbol?: boolean,
    locale?: string,
    currency?: string,
    hideDecimals?: boolean
  ) => string;
}

export const formatMoneySlice = (set: any, get: any): IFormatMoneyStore => ({
  locale: "es-CO",
  currency: "COP",
  setLocale: (locale: string) => set({ locale }),
  setCurrency: (currency: string) => set({ currency }),
  formatMoney: (
    amount: string | number | undefined | null,
    hideCurrencySymbol?: boolean,
    locale?: string,
    currency?: string,
    hideDecimals?: boolean
  ): string => {
    const finalLocale = locale || get().locale;
    const finalCurrency = currency || get().currency;
    const finalHideCurrencySymbol = hideCurrencySymbol || false;

    const formatter = new Intl.NumberFormat(finalLocale, {
      style: "currency",
      currency: finalCurrency,
      minimumFractionDigits: 0
    });

    if (!amount) {
      return formatter.format(0);
    }

    const number = typeof amount === "string" ? parseFloat(amount) : amount;

    if (finalHideCurrencySymbol) {
      return formatter.format(number).replace(/[^\d.,]/g, "");
    }

    if (hideDecimals) {
      const noDecimalNumber = Math.floor(number);
      return formatter.format(noDecimalNumber);
    }

    return formatter.format(number);
  }
});
