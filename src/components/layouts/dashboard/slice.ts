import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BreadcrumbItemInterface {
  label: string;
  href?: string;
}

interface LayoutSliceInterface {
  breadcrumbs: BreadcrumbItemInterface[];
}

const initialState: LayoutSliceInterface = {
  breadcrumbs: [],
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setBreadcrumbs: (
      state,
      action: PayloadAction<BreadcrumbItemInterface[]>
    ) => {
      state.breadcrumbs = action.payload;
    },
    updateBreadcrumb: (
      state,
      action: PayloadAction<{
        index: number;
        breadcrumb: BreadcrumbItemInterface;
      }>
    ) => {
      const { index, breadcrumb } = action.payload;

      if (state.breadcrumbs[index]) {
        state.breadcrumbs[index] = breadcrumb;
      }
    },
    resetBreadcrumbs: (state) => {
      state.breadcrumbs = [];
    },
  },
});

export const { setBreadcrumbs, updateBreadcrumb, resetBreadcrumbs } =
  layoutSlice.actions;

export default layoutSlice.reducer;
