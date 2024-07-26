import TrendsSideBar from "@/components/TrendsSideBar";
import Post from "@/components/posts/Post";
import PostEditor from "@/components/posts/editor/PostEditor";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import Image from "next/image";
import ForYouFeed from "./ForYouFeed";

export default async function Home() {
  // const post = await prisma.post.findMany({
  //   include: postDataInclude,
  //   orderBy: { createdAt: "desc" },
  // });

  return (
    <main className="h-[200vh] w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouFeed/>
      </div>
      <TrendsSideBar/>
    </main>
  );
}
