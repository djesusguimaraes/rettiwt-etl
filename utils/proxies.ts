import fs from "node:fs";
import { Constants } from "../constants/constants";
import { getStringFromFile } from "./utils";

class Proxies {
  static get = (): URL => {
    const proxies = getStringFromFile(Constants.PROXIES_PATH).split(separator);
    const proxy = proxies[Math.floor(Math.random() * proxies.length)];
    return new URL(proxy);
  };

  static delete = (url: URL) => {
    const data = getStringFromFile(Constants.PROXIES_PATH)
      .split(separator)
      .filter((value) => {
        if (!value) return false;
        return new URL(value).toString() !== url.toString();
      })
      .join(separator);

    fs.writeFileSync(Constants.PROXIES_PATH, data);
  };

  // TODO: Estudar como fazer esse update em paralelo às requisições
  static update = async () => {
    const url = new URL(Constants.PROXY_LIST_URL);
    const data = await fetch(url).then(async (res) => await res.text());

    const proxies = data
      .split(separator)
      .filter((proxy) => !proxy.includes("socks"))
      .join(separator);

    fs.writeFileSync(Constants.PROXIES_PATH, proxies);
  };
}

const separator = "\n";

export { Proxies };
