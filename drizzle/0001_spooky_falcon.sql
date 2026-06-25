CREATE TABLE `busBookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20) NOT NULL,
	`journeyDate` varchar(50) NOT NULL,
	`source` varchar(255) NOT NULL,
	`destination` varchar(255) NOT NULL,
	`busType` varchar(100) NOT NULL,
	`passengers` int NOT NULL,
	`specialRequests` text,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `busBookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `busFleet` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`type` varchar(50) NOT NULL,
	`isAC` int NOT NULL,
	`seats` int NOT NULL,
	`class` varchar(50) NOT NULL,
	`amenities` text NOT NULL,
	`imageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `busFleet_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customerFeedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`rating` int NOT NULL,
	`message` text NOT NULL,
	`isPublished` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customerFeedback_id` PRIMARY KEY(`id`)
);
