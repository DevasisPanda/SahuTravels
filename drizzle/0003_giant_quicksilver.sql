CREATE TABLE `galleryPhotos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text NOT NULL,
	`category` enum('AC Interior','AC Exterior','Non-AC Interior','Non-AC Exterior','Other') NOT NULL,
	`busType` varchar(50),
	`isActive` int NOT NULL DEFAULT 1,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `galleryPhotos_id` PRIMARY KEY(`id`)
);
