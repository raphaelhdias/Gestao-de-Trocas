/*
  Warnings:

  - You are about to drop the column `day` on the `SwapRecord` table. All the data in the column will be lost.
  - Added the required column `requesterShiftDay` to the `SwapRecord` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SwapRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "partnerId" TEXT,
    "requesterShiftDay" INTEGER NOT NULL,
    "partnerShiftDay" INTEGER,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "proofUrl" TEXT,
    "recordedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SwapRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SwapRecord_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SwapRecord" ("createdAt", "employeeId", "id", "month", "notes", "partnerId", "proofUrl", "quantity", "recordedBy", "updatedAt", "year") SELECT "createdAt", "employeeId", "id", "month", "notes", "partnerId", "proofUrl", "quantity", "recordedBy", "updatedAt", "year" FROM "SwapRecord";
DROP TABLE "SwapRecord";
ALTER TABLE "new_SwapRecord" RENAME TO "SwapRecord";
CREATE INDEX "SwapRecord_employeeId_idx" ON "SwapRecord"("employeeId");
CREATE INDEX "SwapRecord_partnerId_idx" ON "SwapRecord"("partnerId");
CREATE INDEX "SwapRecord_month_year_idx" ON "SwapRecord"("month", "year");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
