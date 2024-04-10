import { getTweets, GetTweetsParams } from "./get_tweets";
import { Proxies } from "./utils/utils";
import { parallel, reflect } from "async";

const buildParams = (year: string) =>
  <GetTweetsParams>{
    id: year,
    endDate: new Date(`${year}-12-31`),
    startDate: new Date(`${year}-01-01`),
  };

const years = ["2017", "2018", "2019", "2020", "2021"];

const tasks = years.map((year) => reflect(() => getTweets(buildParams(year))));

parallel([Proxies.updatePeriodcally, ...tasks]);
