const buildAssetsPath = (file: string) => `assets/${file}`
export class Constants {
  // SEARCH DATA
  static readonly TWEETS_PER_REQUEST = 20;
  static readonly TWEETS_TARGET_NUMBER = 60;
  static readonly SEARCH_LIMIT =
    Math.ceil(this.TWEETS_TARGET_NUMBER / this.TWEETS_PER_REQUEST) - 1;
  static readonly PATIENCE = Math.ceil(this.SEARCH_LIMIT * 0.1);

  // MONGO IDENTIFIERS
  static readonly DATABASE = 'tweets';
  static readonly USERS_COLLECTION = 'users';
  static readonly TWEETS_COLLECTION = 'tweet';

  // PATHS
  static readonly API_KEY_PATH = buildAssetsPath('api_key.txt');
  static readonly PROXIES_PATH = buildAssetsPath('proxies.txt');
  static readonly CURSOR_PATH = buildAssetsPath('cursor.txt');
}
