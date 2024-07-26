import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(
  userId: string,
  intialState: FollowerInfo,
) {
  const query = useQuery({
    queryKey: ["followe-info", userId],
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
    initialData: intialState,
    staleTime: Infinity,
  });

  return query;
}
