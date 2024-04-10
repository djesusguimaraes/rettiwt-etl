import { CursoredData, Rettiwt, Tweet, TweetFilter } from "rettiwt-api";
import { Constants } from "./constants/constants";
import { Proxies, FileManager, Logs, Util } from "./utils/utils";

export const searchTweets = async (
  params: SearchTweetParams,
  attempts = 0
): Promise<SearchResponse> => {
  await Util.delay(3000);

  const start = new Date().getTime();

  const apiKey = FileManager.read(Constants.API_KEY_PATH);
  const proxyUrl = Proxies.get({ switchToChecked: attempts % 5 === 0 });

  try {
    const rettiwt = new Rettiwt({ apiKey, proxyUrl });

    const data = await rettiwt.tweet
      .search(params.query, Constants.TWEETS_PER_REQUEST, params.cursor)
      .catch(async (e) => {
        if (e.toString().includes("Failed to authenticate")) {
          await Util.login();
        }
        throw e;
      });

    Proxies.confirm(proxyUrl);

    const response = {
      id: params.id,
      data,
      proxyUrl,
      attempts,
      duration: Util.elapsed(start),
    };

    Logs.search(response);

    return response;
  } catch (error) {
    Logs.search({
      id: params.id,
      error,
      proxyUrl,
      attempts,
      duration: Util.elapsed(start),
    });
    Proxies.delete(proxyUrl);
    return await searchTweets(params, attempts + 1);
  }
};

interface SearchTweetParams {
  id: string;
  cursor?: string | undefined;
  query: TweetFilter;
}

interface SearchResponse {
  id: string;
  error?: unknown;
  data?: CursoredData<Tweet>;
  duration: number;
  proxyUrl: URL;
  attempts: number;
}

export { SearchResponse };
