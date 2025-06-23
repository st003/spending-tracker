CREATE TABLE "Categories" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_date" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "Payments" (
    "id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "payment_date" TEXT NOT NULL, -- add index?
    "description" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL, -- add index?
    "created_date" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id" AUTOINCREMENT),
    FOREIGN KEY("category_id") REFERENCES "Categories"("id")
);
