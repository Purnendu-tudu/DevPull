import TrendsSideBar from "@/components/TrendsSideBar";
import Post from "@/components/posts/Post";
import PostEditor from "@/components/posts/editor/PostEditor";
import prisma from "@/lib/prisma";
// import { postDataInclude } from "@/lib/types";
import Image from "next/image";
import ForYouFeed from "./ForYouFeed";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import FollowingFeed from "./FollowingFeed";

export default async function Home() {
  // const post = await prisma.post.findMany({
  //   include: postDataInclude,
  //   orderBy: { createdAt: "desc" },
  // });

  return (
    <main className="flex h-[200vh] w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />

        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For-you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed/>
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSideBar />
    </main>
  );
}
