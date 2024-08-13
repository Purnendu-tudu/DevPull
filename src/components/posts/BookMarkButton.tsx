import { BookmarkInfo } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Bookmark, Bug } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookMarkButtonProps {
  postId: string;
  initalState: BookmarkInfo;
}

export default function BookMarkButton({ postId, initalState }: BookMarkButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const queryKey : QueryKey = ["boomark-info", postId];
  
  const {data} = useQuery({
    queryKey,
    queryFn: () => kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initalState,
    staleTime: Infinity
  });

  const {mutate} = useMutation({
    mutationFn: () => 
        data.isBookmarkedByUser
    ? kyInstance.delete(`/api/posts/${postId}/bookmark`)
    : kyInstance.post(`/api/posts/${postId}/bookmark`),
    onMutate: async () => {
        toast({
          description:`Push ${data.isBookmarkedByUser ? "un" : ""}bookmarked`
        })

        await queryClient.cancelQueries({queryKey})

        const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey)

        queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
           
            isBookmarkedByUser: !previousState?.isBookmarkedByUser
          
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
    <Bookmark className={cn("size-5", data.isBookmarkedByUser && "fill-primary ")}/>
  </button>

}
