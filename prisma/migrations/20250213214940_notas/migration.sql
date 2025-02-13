-- CreateTable
CREATE TABLE "Notas" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Notas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notas" ADD CONSTRAINT "Notas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
