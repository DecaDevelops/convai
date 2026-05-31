import { BrainCog } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AppBrandName() {
  return (
    <Link href={`/`}>
      <span className="flex flex-row items-center">
        <span className="text-red-600">Conv</span>
        <BrainCog />
        <span>AI</span>
      </span>
    </Link>
  );
}
