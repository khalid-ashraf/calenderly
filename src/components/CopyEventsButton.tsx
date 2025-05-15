"use client";

import { useState, memo } from "react";
import { Button, ButtonProps } from "./ui/button";
import { Copy, CopyCheck, CopyX } from "lucide-react";

type CopyStateType = "idle" | "copied" | "error";

const CopyEventsButton = ({
  eventId,
  clerkUserId,
  ...buttonProps
}: Omit<ButtonProps, "children" | "onClick"> & { eventId: string; clerkUserId: string }) => {
  const [copyState, setCopyState] = useState<CopyStateType>("idle");

  const CopyIcon = getCopyIcon(copyState);

  const handleClick = () => {
    navigator.clipboard
      .writeText(`${location.origin}/book/${clerkUserId}/${eventId}`)
      .then(() => {
        setCopyState("copied");
        setTimeout(() => setCopyState("idle"), 2000);
      })
      .catch(() => {
        setCopyState("error");
        setTimeout(() => setCopyState("idle"), 2000);
      });
  };

  return (
    <Button {...buttonProps} onClick={handleClick}>
      <CopyIcon className='size-4' />
      {getChildren(copyState)}
    </Button>
  );
};

CopyEventsButton.displayName = "CopyEventsButton";

export default memo(CopyEventsButton);

const getCopyIcon = (copyState: CopyStateType) => {
  switch (copyState) {
    case "idle":
      return Copy;

    case "copied":
      return CopyCheck;

    case "error":
      return CopyX;
  }
};

const getChildren = (copyState: CopyStateType) => {
  switch (copyState) {
    case "idle":
      return "Copy Link";

    case "copied":
      return "Copied!";

    case "error":
      return "Error";
  }
};
