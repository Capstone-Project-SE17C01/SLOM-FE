import React from "react";

import FormAddNewLibrary from "@/features/library/components/form-add-new-library";

const AddNewLibraryPage = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <h3 className="text-2xl font-bold mb-4">Thêm nội dung mới</h3>
      <FormAddNewLibrary />
    </div>
  );
};

export default AddNewLibraryPage;
