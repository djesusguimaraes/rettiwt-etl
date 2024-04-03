import { isNumberObject } from "node:util/types";
import { Tweet } from "rettiwt-api";
import { Constants } from "./constants/constants";
import { loadData } from "./load_data";
import { TweetData, TweetDoc } from "./models/tweet_data";
import { UserData, UserDoc } from "./models/user_data";
import { searchTweets } from "./search_tweets";
import { Logs } from "./utils/logs";
import { delay, elapsed, getCursor, saveCursor } from "./utils/utils";

export const getTweets = async () => {
  let cursor = getCursor();

  Logs.init(cursor);

  let empty = 0;
  let saved = 0;

  for (let i = 0; i <= Constants.SEARCH_LIMIT; i++) {
    const start = new Date().getTime();
    const data = await searchTweets(cursor);
    await delay(2000);

    const endIteration = (replaceCursor = true) => {
      if (replaceCursor) setCursor();
      const duration = elapsed(start);
      Logs.iteration({
        epoch: i,
        saved,
        duration,
      });
    };

    const setCursor = () => {
      cursor = data.next.value;
      if (!cursor) return;
      saveCursor(cursor);
    };

    if (data.list.length === 0) {
      if (empty == Constants.PATIENCE) {
        endIteration(false);
        break;
      }

      empty++;
      endIteration();
      continue;
    }

    const count = await saveData(data.list);
    saved += count;
    empty = 0;
    endIteration();
  }
};

const saveData = async (data: Tweet[]): Promise<number> => {
  let tweets: TweetDoc[] = [];
  let users: UserDoc[] = [];

  data.forEach((tweet) => {
    tweets.push(new TweetData({ ...tweet, tweetBy: tweet.tweetBy.id }));
    users.push(new UserData(tweet.tweetBy));
  });

  const savedDocs = await Promise.all([
    loadData(tweets, Constants.TWEETS_COLLECTION),
    loadData(users, Constants.USERS_COLLECTION),
  ]).then((value) => {
    const counts = value.filter((e) => isNumberObject(e));
    if (counts.length === 0) return 0;
    return counts[0];
  });

  return savedDocs ?? 0;
};
