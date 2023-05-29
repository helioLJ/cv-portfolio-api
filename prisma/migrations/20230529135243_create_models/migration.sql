-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "live" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Stack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_project" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Stack_id_project_fkey" FOREIGN KEY ("id_project") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
