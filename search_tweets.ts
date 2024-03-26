import { CursoredData, Rettiwt, Tweet } from "rettiwt-api";
import { Constants } from "./constants/constants";
import { getApiKey, getProxyUrl } from "./utils/utils";

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
    const rettiwt = new Rettiwt({ apiKey: getApiKey(), proxyUrl: getProxyUrl() });

    return await rettiwt.tweet.search(
      {
        includeWords,
        startDate,
        language,
      },
      Constants.TWEETS_PER_REQUEST,
      cursor
    );
  } catch (error) {
    console.log(`[ERRO]: ${error}`);
    throw error;
  }
};
