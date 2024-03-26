import mongoose from "mongoose";

interface ITweetData {
  id: string;
  tweetBy: string;
  createdAt: string;
  // TODO: Adicionar entities e media
  quoted: string;
  fullText: string;
  replyTo: string;
  lang: string;
  quoteCount: number;
  replyCount: number;
  retweetCount: number;
  likeCount: number;
  viewCount: number;
  bookmarkCount: number;
}

interface TweetModelInterface extends mongoose.Model<TweetDoc> {
  build(attr: ITweetData): TweetDoc;
}

interface TweetDoc extends mongoose.Document {
  id: string;
  tweetBy: string;
  createdAt: string;
  quoted: string;
  fullText: string;
  replyTo: string;
  lang: string;
  quoteCount: number;
  replyCount: number;
  retweetCount: number;
  likeCount: number;
  viewCount: number;
  bookmarkCount: number;
}

const tweetSchema = new mongoose.Schema({
  tweetBy: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    required: false,
  },
  quoted: {
    type: String,
    required: false,
  },
  fullText: {
    type: String,
    required: false,
  },
  replyTo: {
    type: String,
    required: false,
  },
  lang: {
    type: String,
    required: false,
  },
  quoteCount: {
    type: Number,
    required: false,
  },
  replyCount: {
    type: Number,
    required: false,
  },
  retweetCount: {
    type: Number,
    required: false,
  },
  likeCount: {
    type: Number,
    required: false,
  },
  viewCount: {
    type: Number,
    required: false,
  },
  bookmarkCount: {
    type: Number,
    required: false,
  },
});

const TweetData = mongoose.model<TweetDoc, TweetModelInterface>(
  "Tweet",
  tweetSchema
);

tweetSchema.statics.build = (attr: ITweetData) => new TweetData(attr);

export { TweetData, TweetDoc };
