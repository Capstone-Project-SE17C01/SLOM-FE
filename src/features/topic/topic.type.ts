export type DataTopic = {
  _id: string;
  image_url: string;
  topic_name: string;
  description: string;
  image: string;
  isActive: boolean;
};
export type Topic = {
  data: DataTopic[];
};
export type TypeAddNewTopic = {
  topic_name: string;
  description: string;
};
export type TypeUpdateTopic = {
  params: {
    id: string;
  };
  body: {
    topic_name: string;
    description: string;
    image: string;
  };
};
