import React from "react";
import {Skeleton} from "@/components/ui/skeleton";

const ChatItemLoaderSkeleton = () => {
  return (
    <div className="relative flex flex-row px-4 items-center gap-3 py-4  cursor-pointer rounded-md hover:bg-gray-800/50 hover:border-[1px] border-gray-800">
      <Skeleton className="rounded-full w-[70px] h-[60px] bg-gray-800" />

      <div className="flex flex-col gap-2 w-full overflow-x-hidden">
        <div className="space-y-2">
          <div className="flex flex-row justify-between">
            <Skeleton className="h-4 w-[150px] bg-gray-800" />
            <Skeleton className="h-4 w-[50px] bg-gray-800" />
          </div>
          <Skeleton className="h-4 w-[200px] bg-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default ChatItemLoaderSkeleton;