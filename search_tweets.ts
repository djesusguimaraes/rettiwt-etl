import { CursoredData, Rettiwt, Tweet } from "rettiwt-api";
import { Constants } from "./constants/constants";
import { Logs } from "./utils/logs";
import { elapsed, getApiKey, getProxyUrl } from "./utils/utils";

const language = "pt";
const startDate = new Date("2016-01-01");
const includeWords = [
  "urna",
  "urna eletronica",
  "urna eletrônica",
  "eleicoes",
  "eleições",
];

export const searchTweets = async (
  cursor: string | undefined
): Promise<CursoredData<Tweet>> => {
  try {
    const start = new Date().getTime();

    const proxyUrl = getProxyUrl();

    const rettiwt = new Rettiwt({
      apiKey: getApiKey(),
      proxyUrl,
    });

    const data = await rettiwt.tweet.search(
      {
        includeWords,
        startDate,
        language,
      },
      Constants.TWEETS_PER_REQUEST,
      cursor
    );

    Logs.search({
      data,
      proxyUrl,
      duration: elapsed(start)
    });

    return data;
  } catch (error) {
    console.error(`[ERROR]: ${error}`);
    throw error;
  }
};
