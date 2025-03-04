-- CreateTable
CREATE TABLE "HashTag" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "HashTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "photo" TEXT,
    "authorId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "hashTagId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HashTag_title_key" ON "HashTag"("title");

-- CreateIndex
CREATE UNIQUE INDEX "HashTag_slug_key" ON "HashTag"("slug");

-- AddForeignKey
ALTER TABLE "HashTag" ADD CONSTRAINT "HashTag_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_hashTagId_fkey" FOREIGN KEY ("hashTagId") REFERENCES "HashTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
