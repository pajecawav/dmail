-- CreateTable
CREATE TABLE "mailbox" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "fromName" TEXT,
    "fromEmail" TEXT NOT NULL,
    "dateSent" DATETIME NOT NULL,
    "mailboxEmail" TEXT NOT NULL,
    CONSTRAINT "message_mailboxEmail_fkey" FOREIGN KEY ("mailboxEmail") REFERENCES "mailbox" ("email") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "mailbox_email_key" ON "mailbox"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mailbox_token_key" ON "mailbox"("token");
