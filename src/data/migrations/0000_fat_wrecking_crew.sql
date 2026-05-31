CREATE TABLE `characters` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`image` text,
	`tags` text,
	`description` text,
	`greeting` text NOT NULL,
	`personality` text NOT NULL,
	`scenario` text,
	`example_dialogue` text,
	`instructions` text,
	`created_at` integer DEFAULT '"2026-05-29T19:28:59.832Z"',
	`updated_at` integer DEFAULT '"2026-05-29T19:28:59.832Z"'
);
--> statement-breakpoint
CREATE TABLE `chats` (
	`id` text PRIMARY KEY NOT NULL,
	`character_id` text,
	`persona_id` text,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`persona_id`) REFERENCES `personas`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chat_id` text,
	`content` text,
	`role` integer DEFAULT 1,
	`created_at` integer DEFAULT '"2026-05-29T19:28:59.832Z"',
	`updated_at` integer DEFAULT '"2026-05-29T19:28:59.832Z"',
	FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `personas` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`image` text,
	`description` text,
	`created_at` integer DEFAULT '"2026-05-29T19:28:59.832Z"',
	`updated_at` integer DEFAULT '"2026-05-29T19:28:59.832Z"'
);
