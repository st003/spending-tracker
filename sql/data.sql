/* TEMPORARY TESTING DATA */

INSERT INTO Categories
    (name)
VALUES
    ('Uncategorized'), -- 1
    ('Groceries'), -- 2
    ('Restraunts'), -- 3
    ('Shopping'), -- 4
    ('Utilities'), -- 5
    ('Entertainment'), -- 6
    ('Insurance'), -- 7
    ('Mortgage'); -- 8

INSERT INTO Payments
    (amount, payment_date, description, category_id)
VALUES
    (2216, '2025-05-31', 'Safeway', 2),
    (3567, '2025-05-28', 'Pizza Place', 3),
    (6074, '2025-05-28', 'Amazon Purchase', 4),
    (7000, '2025-05-27', 'Electricity', 5),
    (1499, '2025-05-25', 'Movie Ticket', 6),
    (5112, '2025-05-24', 'Safeway', 2),
    (9000, '2025-05-23', 'Internet', 5),
    (3054, '2025-05-18', 'Amazon Purchase', 4),
    (4223, '2025-05-17', 'Safeway', 2),
    (1499, '2025-05-14', 'Movie Ticket', 6),
    (4989, '2025-05-10', 'Safeway', 2),
    (1989, '2025-05-05', 'Amazon Purchase', 4),
    (3533, '2025-05-03', 'Safeway', 2),
    (3533, '2025-05-01', 'Car Insurance', 7),
    (100000, '2025-05-01', 'Mortgage Payment', 8);
