import { CursoredData, Rettiwt, Tweet } from "rettiwt-api";
import { Constants } from "./constants/constants";

// TODO: Carregar [API_KEY] dinamicamente
const API_KEY =
  "a2R0PTQxbklMQjd3MlJZaHR4SjFFZ2hQUTdJWlZKZUR2WmJZckliR1NkbVg7dHdpZD0idT0xNzY4MjcwMTY3MzMzNTM1NzQ0IjtjdDA9MDgyZjA3YzFiMmUxNWEyZTBhMTgyMzlhYTM3MTNkYmY7YXV0aF90b2tlbj1iMjgwYjUyNWYwZjM3MDYyYWI3MTFlMjc4NzUxYWZkYTc2NDAxZDRkOw==";

const language = "pt";
const startDate = new Date("2016-01-01");
const includeWords = [
  "urna",
  "urna eletronica",
  "urna eletrônica",
  "eleicoes",
  "eleições",
];

export const searchTweets = async (cursor: string | undefined): Promise<CursoredData<Tweet>> => {
  try {
    if (cursor === Constants.CURSOR) cursor = undefined;

	// TODO: Adicionar entrada de proxy aleatório
    const rettiwt = new Rettiwt({ apiKey: API_KEY });

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
    // FIXME: Buscar solução para [TOO_MANY_REQUESTS](https://github.com/Rishikant181/Rettiwt-API/issues/495)
    console.log(`[ERRO]: ${error}`);
    throw error;
  }
};
