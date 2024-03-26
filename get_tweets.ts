import { Constants } from "./constants/constants";
import { loadData } from "./load_data";
import { TweetData, TweetDoc } from "./models/tweet_data";
import { searchTweets } from "./search_tweets";
import { delay } from "./utils/delay";

const limit =
  Math.ceil(Constants.TWEETS_TARGET_NUMBER / Constants.TWEETS_PER_REQUEST) - 1;

const patience = Math.ceil(limit * 0.1);

export const getTweets = async () => {
  let cursor = Constants.CURSOR;

  console.log(limit, patience);

  let empty = 0;

  for (let i = 0; i <= limit; i++) {
    const data = await searchTweets(cursor);
    await delay(2000);

    const setCursor = () => (cursor = data.next.value);

    if (data.list.length === 0) {
      if (empty == patience) break;
      setCursor();
      empty++;
      continue;
    }

	let tweets: TweetDoc[] = []

	data.list.forEach(
		(tweet) => {
			const data = TweetData.build({...tweet, tweetBy: tweet.tweetBy.id});
			tweets.push(data);
		}
	);

	await loadData(tweets, "tweet");

    setCursor();
    empty = 0;
  }
};
