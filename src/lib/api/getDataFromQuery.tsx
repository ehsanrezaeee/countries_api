import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const GetDataFromQuery = ({
  out,
  key,
  url,
  isFeature,
  feature,
  dataForFeature,
  interval,
}: {
  out: boolean;
  key: string;
  url: string;
  isFeature: boolean;
  feature?: string;
  dataForFeature?: string;
  interval?: number;
}) => {
  const addressLink = `${
    !out ? process.env.NEXT_PUBLIC_BASE_URL_BACK_END + "/" : ""
  }${url}${isFeature ? "?" + feature + "=" + dataForFeature : ""}`;
  const { data, refetch, isError, isFetching, isPending, error } = useQuery({
    queryKey: [key],
    queryFn: async () =>
      await axios.get(addressLink).then((res) => {
        return res.data;
      }),
    refetchInterval: interval,
  });
  return { data, refetch, isError, isFetching, error, isPending };
};
