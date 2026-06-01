"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarTrigger,
} from "./ui/sidebar";
import Link from "next/link";
import {
  Bot,
  BrainCircuit,
  Clock,
  Cpu,
  Drama,
  Heart,
  Key,
  MessageCircleMore,
  PlusSquare,
  Signpost,
  Tags,
  VenetianMask,
} from "lucide-react";
import AppBrandName from "./AppBrandName";

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center">
        <SidebarTrigger />
        <div className="group-data-[collapsible=icon]:hidden">
          <AppBrandName />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Home</SidebarGroupLabel>
          <SidebarMenuButton asChild>
            <Link href={`/chats`}>
              <MessageCircleMore /> <span>Chats</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <Link href={`/favorites`}>
              <Heart /> <span>Favorites</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <Link href={`/later`}>
              <Clock /> <span>Try later</span>
            </Link>
          </SidebarMenuButton>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Characters</SidebarGroupLabel>
          <SidebarMenuButton asChild>
            <Link href={`/characters`}>
              <Bot /> <span>Characters</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <Link href={`/create/character`}>
              <PlusSquare /> <span>Create Character</span>
            </Link>
          </SidebarMenuButton>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Personas</SidebarGroupLabel>
          <SidebarMenuButton asChild>
            <Link href={`/personas`}>
              <VenetianMask /> <span>Personas</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <Link href={`/create/persona`}>
              <Drama /> <span>Create Persona</span>
            </Link>
          </SidebarMenuButton>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarMenuButton asChild>
            <Link href={`/tags`}>
              <Tags /> <span>Manage Tags</span>
            </Link>
          </SidebarMenuButton>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Manage Models</SidebarGroupLabel>
          <SidebarMenuButton asChild>
            <Link href={`/api-keys`}>
              <Key /> <span>Api Keys</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <Link href={`/providers`}>
              <Signpost />
              <span>Manage Providers</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <Link href={`/models`}>
              <BrainCircuit /> <span>Manage Models</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <Link href={`/interference-profiles`}>
              <Cpu /> <span>Manage interference profiles</span>
            </Link>
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
