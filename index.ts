import { getTweets, GetTweetsParams } from "./get_tweets";
import parallel from "async/parallel";
import { Proxies } from "./utils/utils";

const buildParams = (year: string) =>
  <GetTweetsParams>{
    id: year,
    endDate: new Date(`${year}-12-31`),
    startDate: new Date(`${year}-01-01`),
  };

const getTweetsByYear = async (year: string) => {
  await getTweets(buildParams(year));
};

const years = ["2017", "2018", "2019", "2020", "2021"];

const tasks = years.map((year) => async () => await getTweetsByYear(year));

parallel([Proxies.updatePeriodcally, ...tasks]);
