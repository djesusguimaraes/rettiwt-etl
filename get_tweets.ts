import { Tweet } from "rettiwt-api";
import { Constants } from "./constants/constants";
import { loadData } from "./load_data";
import { TweetData, TweetDoc } from "./models/tweet_data";
import { UserData, UserDoc } from "./models/user_data";
import { searchTweets } from "./search_tweets";
import { delay, getCursor } from "./utils/utils";

export const getTweets = async () => {
  let cursor = getCursor();

  console.log(Constants.SEARCH_LIMIT, Constants.PATIENCE);

  let empty = 0;

  for (let i = 0; i <= Constants.SEARCH_LIMIT; i++) {
    const data = await searchTweets(cursor);
    await delay(2000);

    const setCursor = () => (cursor = data.next.value);

    if (data.list.length === 0) {
      if (empty == Constants.PATIENCE) break;
      setCursor();
      empty++;
      continue;
    }

    await saveData(data.list);
    setCursor();
    empty = 0;
  }
};

const saveData = async (data: Tweet[]) => {
  let tweets: TweetDoc[] = [];
  let users: UserDoc[] = [];

  data.forEach((tweet) => {
    tweets.push(TweetData.build({ ...tweet, tweetBy: tweet.tweetBy.id }));
    users.push(UserData.build(tweet.tweetBy));
  });

  await Promise.all([
    loadData(tweets, Constants.TWEETS_COLLECTION),
    loadData(users, Constants.USERS_COLLECTION),
  ]);
};
