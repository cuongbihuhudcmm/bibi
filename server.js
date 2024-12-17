const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for tickets
let tickets = Array.from({ length: 200 }, (_, i) => ({
  code: (i + 1).toString().padStart(3, '0'),
  available: true,
  bookedBy: null
}));

// Endpoint to get all tickets
app.get('/tickets', (req, res) => {
  res.json(tickets);
});

// Endpoint to book a ticket
app.post('/book', (req, res) => {
  const { code, name, phone } = req.body;

  if (!name || !phone || !code) {
    return res.status(400).json({ message: 'Missing name, phone, or ticket code.' });
  }

  // Find the ticket by code
  const ticket = tickets.find(t => t.code === code);

  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found.' });
  }

  if (!ticket.available) {
    return res.status(400).json({ message: 'Ticket already booked.' });
  }

  // Mark ticket as booked
  ticket.available = false;
  ticket.bookedBy = { name, phone };

  res.json({ message: 'Ticket booked successfully.', ticket });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
