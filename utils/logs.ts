import { CursoredData, Tweet } from "rettiwt-api";
import { Constants } from "../constants/constants";

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
    console.table({
      Elapsed: `${params.duration}s`,
      Length: params.data.list.length,
      "Has Next": params.data.next.value !== undefined,
      "Proxy Server": params.proxyUrl.toString(),
    });
  };
}

interface SearchLogParams {
  data: CursoredData<Tweet>;
  duration: number;
  proxyUrl: URL;
}

interface IterationLogParams {
  epoch: number;
  saved: number;
  duration: number;
}

export { Logs };
