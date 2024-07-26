import useFollowerInfo from "@/hooks/useFolloweInfo";
import { FollowerInfo } from "@/lib/types";
import { useToast } from "./ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

  const {mutate} = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
  });

  return (
    <Button variant={data.isFollowedByUser ? "secondary" : "default"} onClick={() => mutate()} >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
