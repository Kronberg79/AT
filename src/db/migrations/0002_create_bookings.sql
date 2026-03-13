CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD
  time TEXT NOT NULL, -- HH:MM
  status TEXT DEFAULT 'pending', -- pending, confirmed, rejected
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
