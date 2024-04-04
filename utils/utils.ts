import fs from "node:fs";
import { setInterval } from "timers/promises";
import { CursoredData, Tweet } from "rettiwt-api";
import { Constants } from "../constants/constants";

class Util {
  static delay = async (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  static elapsed = (beginning: number, log = false) => {
    const duration = (new Date().getTime() - beginning) / 1000;
    if (log) console.info(`${duration}s`);
    return duration;
  };
}

class FileManager {
  static read = (path: string) => {
    if (this.exists(path)) return fs.readFileSync(path).toString();
    return "";
  };

  static exists = (path: string) => fs.existsSync(path);

  static write = (content: string, path: string) =>
    fs.writeFileSync(path, content);

  static pathWithId = (id: string, path: string) => {
    const separator = ".";
    const parts = path.split(separator);
    parts.splice(0, 1, `${parts[0]}_${id}`);
    return parts.join(separator);
  };
}

class Cursor {
  static get = (id: string) => {
    const cursor = FileManager.read(this.path(id));
    if (cursor) return cursor;
    return undefined;
  };

  static path = (id: string) =>
    FileManager.pathWithId(id, Constants.CURSOR_PATH);

  static save = (cursor: string, id: string) =>
    FileManager.write(cursor, this.path(id));
}

class Proxies {
  static values = FileManager.read(Constants.PROXIES_PATH);

  static get = (): URL => {
    const proxies = this.values.split(separator);
    const proxy = proxies[Math.floor(Math.random() * proxies.length)];
    return new URL(proxy);
  };

  static delete = (url: URL) => {
    const data = this.values
      .split(separator)
      .filter((value) => {
        if (!value) return false;
        return new URL(value).toString() !== url.toString();
      })
      .join(separator);

    fs.writeFileSync(Constants.PROXIES_PATH, data);
  };

  static update = async () => {
    const url = new URL(Constants.PROXY_LIST_URL);
    const data = await fetch(url).then(async (res) => await res.text());

    const proxies = data
      .split(separator)
      .filter((proxy) => !proxy.includes("socks"))
      .join(separator);

    fs.writeFileSync(Constants.PROXIES_PATH, proxies);
  };

  static updatePeriodcally = async () => {
    for await (const _ of setInterval(5 * 60000)) {
      this.update().finally(Logs.proxiesUpdatedAt);
    }
  };
}

const separator = "\n";

class Logs {
  static init = (cursor: string | undefined) => {
    console.info(
      `------------ Busca iniciada ---------------\n`,
      `-------------------------------------------\n`,
      `------------ Cursor Inicial ---------------\n`,
      `--------- ${cursor?.substring(0, 20)}... ---------\n`,
      `----------------------------------------`
    );
    console.table({
      Iterações: Constants.SEARCH_LIMIT,
      Objetivo: Constants.TWEETS_TARGET_NUMBER,
      Paciência: Constants.PATIENCE,
    });
  };

  static iteration = (params: IterationLogParams) => {
    console.table({
      "Tweets Salvos": params.saved,
      Época: params.epoch,
      Elapsed: `${params.duration}s`,
    });
  };

  static search = (params: SearchLogParams) => {
    if (params.error) {
      console.error(`\n[ERROR]: ${params.error}`);
      return;
    }

    console.table({
      Elapsed: `${params.duration}s`,
      "Proxy Server": params.proxyUrl.toString(),
    });
  };

  static proxiesUpdatedAt = () => {
    const date = new Date();
    const formattedDate = date.toLocaleTimeString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
    console.info(`Lista de proxies atualizada em: ${formattedDate}`);
  };
}

interface SearchLogParams {
  id: string,
  error?: unknown;
  data?: CursoredData<Tweet>;
  duration: number;
  proxyUrl: URL;
}

interface IterationLogParams {
  epoch: number;
  saved: number;
  duration: number;
}

export { Util, FileManager, Proxies, Logs, Cursor };
