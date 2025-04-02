import React from "react";

import FormAddNewNews from "@/features/news/components/form-add-new-news";

const AddNewNewsPage = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <h3 className="text-2xl font-bold mb-4">Thêm tin tức mới</h3>
      <FormAddNewNews />
    </div>
  );
};

export default AddNewNewsPage;
