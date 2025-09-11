import { createAsyncThunk } from "@reduxjs/toolkit";
import { PRODUCT } from "../../constants";
import api, { formDataApi } from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

export const postProduct = createAsyncThunk(
  `post ${PRODUCT}`,
  async (data, thunk) => {
    const { category, subcategory, name, file } = data;

    try {
      const product = {
        name,
        category_id: category?.value,
        subcategory_id: subcategory?.value,
      };
      const response = await api.post("/product", product).catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      if (file?.length !== 0) {
        const formData = new FormData();
        file?.forEach((eachFile, index) => {
          formData.append(`file${index + 1}`, eachFile);
        });
        formData.append("product_id", response?.data?.data?.id);
        await formDataApi.post(`/file`, formData).catch((e) => {
          thunk.dispatch(
            setError(
              isArray(e?.response?.data)
                ? e?.response?.data?.[0]
                : `${e.message} from ${e?.config?.url}`
            )
          );
          throw new Error(e);
        });
      }
      const responseData = {
        name,
        category_id: category?.value,
        subcategory_id: subcategory?.value,
        category_name: category?.label,
        subcategory_name: subcategory?.label,
        id: response?.data?.data?.id,
        files: file,
        insiderData: {
          id: response?.data?.data?.id,
          name: name,
          category: category?.label,
          subcategory: subcategory?.label,
        },
        table: [name, category?.label, subcategory?.label, file?.length],
      };
      thunk.dispatch(setSuccess("Successfuly added product"));
      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
