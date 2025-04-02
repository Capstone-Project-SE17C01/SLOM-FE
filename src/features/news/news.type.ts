import { DataTopic } from "../topic/topic.type";

export type TypeNews = {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  isActive: boolean;
  topic_id: DataTopic;
  created_at: string;
  updated_at: string;
};

export type TypeAddNewNews = {
  topic_id: string;
  title: string;
  content: string;
  image: string;
  author: string;
};
export type TypeUpdateNews = {
  params: {
    id: string;
  };
  body: TypeAddNewNews;
};
