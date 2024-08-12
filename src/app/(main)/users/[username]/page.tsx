import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FolloweCount";
import TrendsSideBar from "@/components/TrendsSideBar";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { FollowerInfo, UserData, getUserDataSelect } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, use } from "react";
import UserPosts from "./UserPosts";
import Linkify from "@/components/Linkify";
import EditProfileButton from "./EditPofileButton";

interface PageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  const { user: loggedInUserId } = await validateRequest();

  if (!loggedInUserId) return {};

  const user = await getUser(username, loggedInUserId.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function Page({ params: { username } }: PageProps) {
  const { user: loggedInUserId } = await validateRequest();

  if (!loggedInUserId) {
    return (
      <p className="text-destructive">Hmm! Sorry You cant see this page</p>
    );
  }
  const user = await getUser(username, loggedInUserId.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedUsedId={loggedInUserId.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s push
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendsSideBar />
    </main>
  );
}

//props for user profile

interface UserProfileProps {
  user: UserData;
  loggedUsedId: string;
}

async function UserProfile({ user, loggedUsedId }: UserProfileProps) {
  const followeInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedUsedId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-md">
      <UserAvatar
        avatarUrl={user.avatrUrl}
        size={250}
        className="mx-h-60 mx-auto size-full max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold"> {user.displayName}</h1>
            <h1 className="text-muted-foreground">@{user.username}</h1>
          </div>
          <div>Member since {formatDate(user.createDAt, "MMM d, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Push:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followeInfo} />
          </div>
        </div>
        {user.id === loggedUsedId ? (
          <EditProfileButton user={user}/>
        ) : (
          <FollowButton userId={user.id} intialState={followeInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr/>
            <Linkify>
              <div className="overflow-hidden whitespace-pre-line break-words">
                {user.bio}
              </div>
            </Linkify>
         
        </>
      )}
    </div>
  );
}
