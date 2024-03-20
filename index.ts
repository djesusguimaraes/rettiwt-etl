import { CursoredData, Rettiwt, Tweet } from "rettiwt-api";

/// API
const API_KEY = "==";
const rettiwt = new Rettiwt({ apiKey: API_KEY });

/// CONSTANTS
const kDefault = "default";
const kTweetsPerRequest = 20;
const kTargetNumber = 1000000;

const getTweets = async () => {
  let next = kDefault;
  const tweets: Tweet[] = [];

  const limit = Math.ceil(kTargetNumber / kTweetsPerRequest) - 1;

  const emptyTollerance = Math.ceil(limit * 0.2);
  let empty = 0;

  console.log(limit, emptyTollerance);

  for (let i = 0; i <= limit; i++) {
    const data = await searchTweets(i, next);

    const nextCursor = data.next.value;

    const hasNoElements = data.list.length === 0;
    if (hasNoElements) {
      if (empty == emptyTollerance) break;
      console.log(`[WARNING]: Empty return ${empty}`);
      next = nextCursor;
      empty++;
      continue;
    }

    data.list.forEach((tweet) => tweets.push(tweet));
    next = nextCursor;
    empty = 0;
  }

  console.log("\n");
  tweets.forEach((tweet) => {
    console.log(`Tweet [${tweet.id}] - '${tweet.createdAt}'`);
  });

  return new CursoredData(tweets, next);
};

const searchTweets = async (i: number, next: string | undefined) => {
  const language = "pt";
  const startDate = new Date("2016-01-01");
  const includeWords = [
    "urna",
    "urnas",
    "urna eletronica",
    "urna eletrônica",
    "justiça eleitoral",
    "eleicoes",
    "eleições",
  ];

  const query = {
    includeWords,
    startDate,
    language,
  };

  console.log(`Cursor[${i}]: ${next}`);

  if (next === kDefault) next = undefined;
  try {
    return await rettiwt.tweet.search(query, kTweetsPerRequest, next);
  } catch (error) {
    // FIXME: Buscar solução para [TOO_MANY_REQUESTS](https://github.com/Rishikant181/Rettiwt-API/issues/495)
    console.log(`[ERRO]: ${error}`);
    throw error;
  }
};

// TODO: Implementar exportação dos dados
getTweets();
