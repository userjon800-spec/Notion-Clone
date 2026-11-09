import fetcher from "@/lib/fetcher";
import useSwr from "swr";
export const useSubscription = (email?: string) => {
  const shouldFetch = Boolean(email && email !== "undefined");
  const { data, isLoading, mutate } = useSwr(
    shouldFetch ? `/api/stripe/subscription?email=${email}` : null,
    fetcher,
  );
  return {
    plan: data ?? "Free",
    isLoading: shouldFetch ? isLoading : false,
    mutate,
  };
};
