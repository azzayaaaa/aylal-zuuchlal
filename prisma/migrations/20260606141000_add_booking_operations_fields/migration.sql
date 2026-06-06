ALTER TABLE `inquiries`
  ADD COLUMN `paymentProofUrl` TEXT NULL,
  ADD COLUMN `adminNote` TEXT NULL,
  ADD COLUMN `followUpAt` DATETIME(3) NULL;

CREATE INDEX `inquiries_followUpAt_idx` ON `inquiries`(`followUpAt`);
