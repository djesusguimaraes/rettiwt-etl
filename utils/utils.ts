import fs from "node:fs";
import { setInterval } from "timers/promises";
import { Constants } from "../constants/constants";
import { SearchResponse } from "../search_tweets";

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

    return fs.writeFileSync(Constants.PROXIES_PATH, proxies);
  };

  static updatePeriodcally = async () => {
    for await (const _ of setInterval(5 * 60000)) {
      await this.update().then(Logs.proxiesUpdatedAt);
    }
  };
}

const separator = "\n";

class Logs {
  static init = (id: string, cursor: string | undefined) => {
    console.table({
      Id: id,
      Cursor: cursor,
      Iterações: Constants.SEARCH_LIMIT,
      Objetivo: Constants.TWEETS_TARGET_NUMBER,
      Paciência: Constants.PATIENCE,
    });
  };

  static iteration = (params: IterationLogParams) => {
    console.table({
      Search: params.id,
      "Tweets Salvos": params.saved,
      Época: params.epoch,
      Elapsed: `${params.duration}s`,
    });
  };

  static search = (params: SearchResponse) => {
    const data = {
      Search: params.id,
      Attempts: params.attempts,
      Elapsed: `${params.duration}s`,
      "Proxy Server": params.proxyUrl.toString(),
      Tweets: params.data?.list.length ?? 0,
      "Has Next": !!params.data?.next.value,
      ERROR: params.error?.toString() ?? "None",
    };

    return console.table(data);
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

interface IterationLogParams {
  id: string;
  epoch: number;
  saved: number;
  duration: number;
}

export { Util, FileManager, Proxies, Logs, Cursor };
