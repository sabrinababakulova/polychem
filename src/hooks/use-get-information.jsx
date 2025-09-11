import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

export const useGetInformation = ({
  selector,
  fetcher,
  data,
  secondfetch = true,
  thirdFetch = true,
}) => {
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const { fetched, loading } = useSelector(selector);
  useEffect(() => {
    if (!fetched && thirdFetch && !loading && secondfetch && token) {
      dispatch(fetcher(data));
    }
  }, [
    fetched,
    loading,
    dispatch,
    fetcher,
    token,
    data,
    thirdFetch,
    secondfetch,
  ]);
  return { fetched, loading };
};

export const useGetInformationLoads = ({ selector, fetcher, itemId }) => {
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const { loadsFetched, loadsLoading, fetched } = useSelector(selector);
  useEffect(() => {
    if (!loadsFetched && !loadsLoading && fetched && fetcher && token) {
      dispatch(fetcher({ itemId }));
    }
  }, [loadsFetched, itemId, loadsLoading, fetcher, token, dispatch, fetched]);
};

export const useGetSubcategoryInformation = ({ selector, fetcher, data }) => {
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const { subcategoryFetched, subcategoryLoading } = useSelector(selector);
  useEffect(() => {
    if (!subcategoryFetched && !subcategoryLoading && token) {
      dispatch(fetcher(data));
    }
  }, [subcategoryFetched, subcategoryLoading, dispatch, fetcher, token, data]);
};

export const useGetCategoryInformation = ({ selector, fetcher, data }) => {
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const { categoryFetched, categoryLoading } = useSelector(selector);
  useEffect(() => {
    if (!categoryFetched && !categoryLoading && token) {
      dispatch(fetcher(data));
    }
  }, [categoryFetched, fetcher, token, categoryLoading, dispatch, data]);
};

export const useGetOptionInformation = ({ selector, fetcher, data }) => {
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const { subOptionFetched, subOptionLoading } = useSelector(selector);

  useEffect(() => {
    if (!subOptionFetched && !subOptionLoading && token) {
      dispatch(fetcher(data));
    }
  }, [subOptionFetched, subOptionLoading, fetcher, token, dispatch, data]);
};

export const useGetAvailableInformation = ({ selector, fetcher }) => {
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const { availableProductsFetched, availableProductsLoading } =
    useSelector(selector);
  useEffect(() => {
    if (!availableProductsFetched && !availableProductsLoading && token) {
      dispatch(fetcher());
    }
  }, [
    availableProductsFetched,
    fetcher,
    token,
    availableProductsLoading,
    dispatch,
  ]);
};
