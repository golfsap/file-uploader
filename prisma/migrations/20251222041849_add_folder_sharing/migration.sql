-- CreateTable
CREATE TABLE "public"."FolderShare" (
    "id" SERIAL NOT NULL,
    "folderId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FolderShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FolderShare_token_key" ON "public"."FolderShare"("token");

-- CreateIndex
CREATE INDEX "FolderShare_token_idx" ON "public"."FolderShare"("token");

-- CreateIndex
CREATE INDEX "FolderShare_expiresAt_idx" ON "public"."FolderShare"("expiresAt");

-- AddForeignKey
ALTER TABLE "public"."FolderShare" ADD CONSTRAINT "FolderShare_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "public"."Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
