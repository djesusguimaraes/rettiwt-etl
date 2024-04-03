import { CursoredData, Rettiwt, Tweet } from "rettiwt-api";
import { Constants } from "./constants/constants";
import { Logs } from "./utils/logs";
import { Proxies } from "./utils/proxies";
import { elapsed, getApiKey } from "./utils/utils";

const language = "pt";
const startDate = new Date("2016-01-01");
const endDate = new Date("2016-01-01");
const includeWords = ["urna", "urnas", "eleicoes"];

export const searchTweets = async (
  cursor: string | undefined
): Promise<CursoredData<Tweet>> => {
  const start = new Date().getTime();
  const proxyUrl = Proxies.get();
  try {
    const rettiwt = new Rettiwt({
      apiKey: getApiKey(),
      proxyUrl,
    });

    const data = await rettiwt.tweet.search(
      {
        includeWords,
        startDate,
        endDate,
        language,
      },
      Constants.TWEETS_PER_REQUEST,
      cursor
    );

    Logs.search({
      data,
      proxyUrl,
      duration: elapsed(start),
    });

    return data;
  } catch (error) {
    console.error(`\n[ERROR]: ${error}`);
    const data = new CursoredData<Tweet>();
    Logs.search({
      data,
      proxyUrl,
      duration: elapsed(start),
    });
    Proxies.delete(proxyUrl);
    return await searchTweets(cursor);
  }
};
