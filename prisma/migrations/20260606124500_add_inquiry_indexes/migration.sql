CREATE INDEX `inquiries_createdAt_idx` ON `inquiries`(`createdAt`);
CREATE INDEX `inquiries_email_idx` ON `inquiries`(`email`);
CREATE INDEX `inquiries_phone_idx` ON `inquiries`(`phone`);
CREATE INDEX `inquiries_bookingCode_idx` ON `inquiries`(`bookingCode`);
CREATE INDEX `inquiries_preferredDate_reminderSentAt_idx` ON `inquiries`(`preferredDate`, `reminderSentAt`);
