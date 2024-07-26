import { PostData } from "@/lib/types";
import { useState } from "react";
import DeletePostDialog from "./DeletePostDialog";

import { Button } from "../ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface PostMoreButtonProps{
    post : PostData;
    className?: string
}

export default function PostMoreButton({post, className}: PostMoreButtonProps){
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className={className}>
                    <MoreHorizontal className="size-5 text-muted-foreground"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                    <Trash2 className="size-4"/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <DeletePostDialog
            post={post}
            open={showDeleteDialog}
            onClose={()=> setShowDeleteDialog(false)}
        />
    </>
}