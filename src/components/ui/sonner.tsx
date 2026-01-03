"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "!bg-background !border !text-foreground",
          success:
            "!border-green-500 !bg-green-50 !text-green-900 dark:!bg-green-950 dark:!text-green-50 [&_[data-icon]]:!text-green-500",
          error:
            "!border-red-500 !bg-red-50 !text-red-900 dark:!bg-red-950 dark:!text-red-50 [&_[data-icon]]:!text-red-500",
          warning:
            "!border-yellow-500 !bg-yellow-50 !text-yellow-900 dark:!bg-yellow-950 dark:!text-yellow-50 [&_[data-icon]]:!text-yellow-500",
          info: "!border-blue-500 !bg-blue-50 !text-blue-900 dark:!bg-blue-950 dark:!text-blue-50 [&_[data-icon]]:!text-blue-500",
          loading:
            "!border-gray-500 !bg-gray-50 !text-gray-900 dark:!bg-gray-950 dark:!text-gray-50 [&_[data-icon]]:!text-gray-500",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
