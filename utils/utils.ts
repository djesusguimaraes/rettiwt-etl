import fs from "node:fs";
import { Constants } from "../constants/constants";

const getProxyUrl = (): URL => {
  const proxies = getStringFromFile(Constants.PROXIES_PATH).split("\n");
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

const saveCursor = (cursor: string) =>
  fs.writeFileSync(Constants.CURSOR_PATH, cursor);

const getStringFromFile = (path: string) => fs.readFileSync(path).toString();

const elapsed = (beginning: number, log = false) => {
  const duration = (new Date().getTime() - beginning) / 1000;
  if (log) console.info(`${duration}s`);
  return duration;
};

export { delay, getProxyUrl, getApiKey, getCursor, saveCursor, elapsed };
