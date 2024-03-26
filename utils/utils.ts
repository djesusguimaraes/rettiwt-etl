import fs from "node:fs";
import { Constants } from "../constants/constants";

const getProxyUrl = (): URL => {
  const proxies = fs
    .readFileSync(Constants.PROXIES_PATH)
    .toString("utf-8")
    .split("\n");

  const proxy = proxies[Math.floor(Math.random() * proxies.length)];

  return new URL(proxy, "https://");
};

const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getApiKey = (): string => getStringFromFile(Constants.API_KEY_PATH);

const getCursor = (): string | undefined => {
  const cursor = getStringFromFile(Constants.CURSOR_PATH);
  if (cursor === "") return undefined;
  return cursor;
};

const getStringFromFile = (path: string) => fs.readFileSync(path).toString();

export { delay, getProxyUrl, getApiKey, getCursor };
