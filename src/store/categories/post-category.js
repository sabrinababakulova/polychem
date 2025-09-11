import { createAsyncThunk } from "@reduxjs/toolkit";
import { CATEGORY, SUBCATEGORY } from "../../constants";
import api from "../../constants/api";

export const postCategory = createAsyncThunk(
  `post ${CATEGORY}`,
  async (data) => {
    const { name } = data;

    try {
      const response = await api
        .post("/category", {
          name,
          active: true,
        })
        .catch((e) => {
          throw new Error(
            e?.response?.data?.[0] || `${e.message} from ${e?.config?.url}`
          );
        });
      const selectData = {
        id: response?.data?.data?.id,
        name: response?.data?.data?.name,
      };
      return { category: selectData };
    } catch (e) {
      return e;
    }
  }
);
export const postSubcategory = createAsyncThunk(
  `post ${SUBCATEGORY}`,
  async (data) => {
    const { name, parent } = data;
    try {
      const response = await api
        .post("/subcategory", {
          name: name,
          category_id: parent?.value,
          active: true,
        })
        .catch((e) => {
          throw new Error(
            e?.response?.data?.[0] || `${e.message} from ${e?.config?.url}`
          );
        });
      const selectData = {
        id: response?.data?.data?.id,
        name: response?.data?.data?.name,
      };
      return { subcategory: selectData };
    } catch (e) {
      return e;
    }
  }
);
