export type Library = {
  _id: string;
  category_name: string;
  image: string;
  description: string;
  topic_id: string;
  isActive: boolean;
  created_at: string;
};

export type TypeAddNewLibrary = {
  category_name: string;
  topic_id: string;
  description: string;
  image: string;
};
export type TypeUpdateLibrary = {
  params: {
    id: string;
  };
  body: {
    category_name: string;
    topic_id: string;
    description: string;
    image: string;
  };
};

export type TypeTitlePage = {
  title: string;
  href?: string;
  contentHref?: string;
  startIcon?: React.ReactNode;
  isReplace?: boolean;
};
