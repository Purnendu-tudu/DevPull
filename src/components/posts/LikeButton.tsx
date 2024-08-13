import { LikeInfo } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Bug } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId: string;
  initalState: LikeInfo;
}

export default function LikeButton({ postId, initalState }: LikeButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const queryKey : QueryKey = ["likes-info", postId];
  
  const {data} = useQuery({
    queryKey,
    queryFn: () => kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initalState,
    staleTime: Infinity
  });

  const {mutate} = useMutation({
    mutationFn: () => 
        data.isLikedByUser
    ? kyInstance.delete(`/api/posts/${postId}/likes`)
    : kyInstance.post(`/api/posts/${postId}/likes`),
    onMutate: async () => {
        await queryClient.cancelQueries({queryKey})

        const previousState = queryClient.getQueryData<LikeInfo>(queryKey)

        queryClient.setQueryData<LikeInfo>(queryKey, () => ({
            likes : (previousState?.likes || 0) + (previousState?.likes? -1 : 1),
            isLikedByUser: !previousState?.isLikedByUser
          
        }))

        return {previousState};
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

  return <button onClick={() => mutate()} className="flex items-center gap-2 ">
    <Bug className={cn("size-5", data.isLikedByUser && "fill-green-500 text-green-500")}/>
    <span className="text-sm font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline">bugs</span>
    </span>
  </button>

}
