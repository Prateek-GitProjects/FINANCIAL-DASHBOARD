const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let records = [
  { id: "1", title: "Salary", amount: 60000, type: "Income", createdAt: "2026-01-01T00:00:00Z" },
  { id: "2", title: "Rent", amount: 15000, type: "Expense", createdAt: "2026-01-01T00:00:00Z" },
  { id: "3", title: "Freelance Project", amount: 20000, type: "Income", createdAt: "2026-01-02T00:00:00Z" },
  { id: "4", title: "Groceries", amount: 5000, type: "Expense", createdAt: "2026-01-02T00:00:00Z" },
  { id: "5", title: "Grocerie", amount: 5000, type: "Expense", createdAt: "2026-01-02T00:00:00Z" },
  { id: "5", title: "Grocerie", amount: 5000, type: "Expense", createdAt: "2026-01-02T00:00:00Z" },
  { id: "5", title: "Grocerie", amount: 5000, type: "Expense", createdAt: "2026-01-02T00:00:00Z" },
];

// Get all records
app.get('/records', (req, res) => {
  res.json(records);
});

// Add a record
app.post('/records', (req, res) => {
  const newRecord = { ...req.body, id: Date.now().toString() };
  records.push(newRecord);
  res.status(201).json(newRecord);
});

// Update a record
app.put('/records/:id', (req, res) => {
  const { id } = req.params;
  records = records.map(r => r.id === id ? { ...r, ...req.body } : r);
  res.json(records.find(r => r.id === id));
});

// Delete a record
app.delete('/records/:id', (req, res) => {
  const { id } = req.params;
  records = records.filter(r => r.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
