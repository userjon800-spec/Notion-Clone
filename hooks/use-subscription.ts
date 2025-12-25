import fetcher from "@/lib/fetcher";
import useSwr from "swr";
export const useSubscription = (email: string) => {
  const { data, isLoading, mutate } = useSwr(
    `/api/stripe/subscription?email=${email}`,
    fetcher
  );
  return {
    plan: data,
    isLoading,
    mutate,
  };
};
