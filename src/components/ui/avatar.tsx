"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Status = "idle" | "loading" | "loaded" | "error";

const AvatarContext = React.createContext<{
  status: Status;
  setStatus: (status: Status) => void;
}>({ status: "idle", setStatus: () => {} });

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [status, setStatus] = React.useState<Status>("idle");
  return (
    <AvatarContext.Provider value={{ status, setStatus }}>
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-stone/20",
          className
        )}
        {...props}
      />
    </AvatarContext.Provider>
  );
});
Avatar.displayName = "Avatar";

export type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, ...props }, ref) => {
    const { status, setStatus } = React.useContext(AvatarContext);

    React.useEffect(() => {
      if (!src) {
        setStatus("error");
        return;
      }
      setStatus("loading");
      const img = new window.Image();
      img.src = src;
      img.onload = () => setStatus("loaded");
      img.onerror = () => setStatus("error");
    }, [src, setStatus]);

    if (status !== "loaded" || !src) return null;

    return (
      <Image
        ref={ref}
        src={src as string}
        alt={props.alt || "Avatar"}
        fill
        className={cn("object-cover", className)}
        sizes="(max-width: 768px) 10vw, 40px"
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { status } = React.useContext(AvatarContext);
  
  if (status === "loaded") return null;

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-stone text-charcoal font-semibold text-sm",
        className
      )}
      {...props}
    />
  );
});
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
