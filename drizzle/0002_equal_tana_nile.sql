CREATE TABLE `homeBanners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text NOT NULL,
	`ctaText` varchar(100),
	`ctaLink` varchar(255),
	`isActive` int NOT NULL DEFAULT 1,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `homeBanners_id` PRIMARY KEY(`id`)
);
