import React from "react";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { cn } from "./ui/utils";

interface LoadingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function LoadingCard({ className, ...props }: LoadingCardProps) {
  return (
    <Card variant="loading" className={cn("p-6 space-y-4", className)} {...props}>
      {/* Profile Header Section */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Profile Stats Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-8" />
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-4 w-12" />
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex gap-2 pt-2">
        <Skeleton className="flex-1 h-8" />
        <Skeleton className="flex-1 h-8" />
      </div>
    </Card>
  );
}

export function LoadingProfileCard({ className, ...props }: LoadingCardProps) {
  return <LoadingCard className={className} {...props} />;
}

