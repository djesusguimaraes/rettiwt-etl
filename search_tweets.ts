import { CursoredData, Rettiwt, Tweet, TweetFilter } from "rettiwt-api";
import { Constants } from "./constants/constants";
import { Proxies, FileManager, Logs, Util } from "./utils/utils";

export const searchTweets = async (
  params: SearchTweetParams
): Promise<CursoredData<Tweet>> => {
  const start = new Date().getTime();

  const proxyUrl = Proxies.get();
  try {
    const rettiwt = new Rettiwt({
      apiKey: FileManager.read(Constants.API_KEY_PATH),
      proxyUrl,
    });

    const data = await rettiwt.tweet.search(
      params.query,
      Constants.TWEETS_PER_REQUEST,
      params.cursor
    );

    Logs.search({
      id: params.id,
      data,
      proxyUrl,
      duration: Util.elapsed(start),
    });

    return data;
  } catch (error) {
    const data = new CursoredData<Tweet>();
    Logs.search({
      id: params.id,
      data,
      proxyUrl,
      duration: Util.elapsed(start),
    });
    Proxies.delete(proxyUrl);
    return await searchTweets(params);
  }
};

interface SearchTweetParams {
  id: string;
  cursor?: string | undefined;
  query: TweetFilter;
}
