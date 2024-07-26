"use client";

import { useState } from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    const [cleint] = useState(new QueryClient())

    return <QueryClientProvider client={cleint}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
}
