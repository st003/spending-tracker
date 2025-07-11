CREATE TABLE "Categories" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL, -- add unique index?
    "created_date" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "Payments" (
    "id" INTEGER NOT NULL,
    "payment_date" TEXT NOT NULL, -- add index?
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL, -- add index?
    "note" TEXT,
    "created_date" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id" AUTOINCREMENT),
    FOREIGN KEY("category_id") REFERENCES "Categories"("id")
);
