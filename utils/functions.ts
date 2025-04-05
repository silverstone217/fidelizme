import AsyncStorage from "@react-native-async-storage/async-storage";

// get data
export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

// set data
export const setData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

// remove data
export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

// clear all data
export const clearData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

// is string empty?
export const isEmptyString = (str: string) => {
  return str.replace(/ /g, "") === "";
};

export const convertToUSD = (nbr: number) => {
  let usdDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
  return usdDollar.format(nbr);
};

export const convertToFCD = (nbr: number) => {
  let usdDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "FCD",
    minimumFractionDigits: 0,
  });
  return usdDollar.format(nbr);
};

// calcul amount points by currency
export const calculatePoints = (
  amount: number,
  currency: "USD" | "FCD" | string,
  pointUsd: number,
  pointFcd: number,
  usd: number,
  fcd: number
) => {
  if (currency === "USD") {
    return Math.round((Number(amount) * pointUsd) / usd);
  } else if (currency === "FCD") {
    return Math.round((Number(amount) * pointFcd) / fcd);
  }
  return 0;
};

// utils.ts
export const validateAndFormatAmount = (text: string): string | null => {
  const textWithPoint = text.replace(",", "."); // Remplace la virgule par un point
  const regex = /^[0-9]+(\.[0-9]+)?$/; // Permet uniquement des chiffres et un point décimal
  if (regex.test(textWithPoint)) {
    return textWithPoint;
  }
  return null;
};

/* 

import * as Linking from 'expo-linking';

const generateDeepLink = (data: object) => {
  const queryString = new URLSearchParams(data).toString();
  return Linking.createURL(`/details?${queryString}`);
};

// Exemple d'utilisation :
const link = generateDeepLink({ id: "123", type: "promo" });
// => "monapp://details?id=123&type=promo"

*/
