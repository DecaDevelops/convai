"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Image from "next/image";
type props = {
  url: string;
  height?: number;
  width?: number;
};

export default function PopoverImage({ url, width = 16, height = 16 }: props) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className={`relative cursor-pointer`}
            style={{
              width,
              height,
            }}
          >
            <Image
              fill
              loading="eager"
              src={url}
              alt="image not found"
              unoptimized
            />
          </div>
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className="ring-0 bg-transparent"
        >
          <DialogHeader hidden>
            <DialogTitle hidden></DialogTitle>
          </DialogHeader>
          <DialogDescription hidden />
          <div className="relative w-lg h-128">
            <Image fill src={url} alt="" unoptimized />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
