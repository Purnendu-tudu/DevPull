"use client";

import kyInstance from "@/lib/ky";
import { UserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { PropsWithChildren } from "react";
import Link from "next/link";
import UserTooltip from "./UserToolTip";

interface UserLinkWithToolTipProps extends PropsWithChildren {
  username: string;
}

export default function UserLinkWithToolTipProps({
  children,
  username,
}: UserLinkWithToolTipProps) {
  const { data } = useQuery({
    queryKey: ["user-data", username],
    queryFn: () =>
      kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }

      return failureCount < 3; //retry for 3 times
    },
    staleTime: Infinity,
  });

  if (!data) {
    return <Link className="text-primary hover:underline" href={`/users/${username}`}>{children}</Link>;
  }

  return (
    <UserTooltip user={data}>
      <Link className="text-primary hover:underline" href={`/users/${username}`}>{children}</Link>
    </UserTooltip>
  );
}
