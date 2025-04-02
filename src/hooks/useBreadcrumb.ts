import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  BreadcrumbItemInterface,
  resetBreadcrumbs,
  setBreadcrumbs,
} from "@/components/layouts/dashboard/slice";

const useBreadcrumb = (breadcrumbs: BreadcrumbItemInterface[]) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (breadcrumbs) {
      dispatch(setBreadcrumbs(breadcrumbs));
    }

    return () => {
      dispatch(resetBreadcrumbs());
    };
  }, [breadcrumbs, dispatch]);
};

export default useBreadcrumb;
