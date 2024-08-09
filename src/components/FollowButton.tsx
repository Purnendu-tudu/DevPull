"use client"
import useFollowerInfo from "@/hooks/useFolloweInfo";
import { FollowerInfo } from "@/lib/types";
import { useToast } from "./ui/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import kyInstance from "@/lib/ky";

interface FollowButtonProps {
  userId: string;
  intialState: FollowerInfo;
}

export default function FollowButton({
  userId,
  intialState,
}: FollowButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { data } = useFollowerInfo(userId, intialState);

  const queryKey: QueryKey = ["followe-info", userId];

  const {mutate} = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
        onMutate: async() => {
          

          await queryClient.cancelQueries({queryKey});

          const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

          queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
            followers : (previousState?.followers || 0) + (previousState?.isFollowedByUser ? - 1 : 1),
            isFollowedByUser: !previousState?.isFollowedByUser
          }));

          return { previousState };
          
        },
        onError(error, variable, context) {
          queryClient.setQueryData(queryKey, context?.previousState)
          console.error(error);

          toast ({
            variant: "destructive",
            description: "Something went wrong. Please Try again."
          })
        }
  });

  return (
    <Button variant={data.isFollowedByUser ? "secondary" : "default"} onClick={() => mutate()} >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
