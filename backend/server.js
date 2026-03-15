const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
 
const app = express();
const PORT = 5000;
 
mongoose.connect('mongodb://localhost:27017/pupaInternDB')
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.log('❌ MongoDB Error:', err));
 
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  joinedDate: { type: String },
  createdAt: { type: Date, default: Date.now }
});
 
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, default: 'Not Started' },
  statusColor: { type: String, default: '#6366f1' },
  priority: { type: String, default: 'Medium' },
  priorityColor: { type: String, default: '#f59e0b' },
  dueDate: { type: String, default: '' },
  tags: [{ type: String }],
  column: { type: String, default: 'col-1' },
  assigneesList: [{ id: String, name: String, email: String, initial: String, color: String }],
  comments: [{ user: String, text: String, time: String, createdAt: { type: Date, default: Date.now } }],
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now }
});
 
const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);
 
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], methods: ['GET','POST','PUT','DELETE'], credentials: true }));
app.use(express.json());
 
app.get('/', (req, res) => res.json({ message: '✅ Backend running!' }));
 
app.get('/users', async (req, res) => {
  try { res.json(await User.find({}, { password: 0 })); }
  catch { res.status(500).json({ error: 'Failed to fetch users' }); }
});
 
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  if (await User.findOne({ email })) return res.status(400).json({ error: 'User already exists' });
  const hashed = await bcrypt.hash(password, 10);
  const joinedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  await new User({ name, email, password: hashed, joinedDate }).save();
  res.status(201).json({ message: 'Account created! Please sign in.' });
});
 
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'All fields required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });
  if (!await bcrypt.compare(password, user.password)) return res.status(400).json({ error: 'Incorrect password' });
  res.status(200).json({ message: 'Login successful!', user: { name: user.name, email: user.email, joinedDate: user.joinedDate } });
});
 
app.get('/tasks', async (req, res) => {
  try { res.json(await Task.find().sort({ createdAt: -1 })); }
  catch { res.status(500).json({ error: 'Failed to fetch tasks' }); }
});
 
app.post('/tasks', async (req, res) => {
  try {
    const task = await new Task(req.body).save();
    console.log('✅ Task saved:', task.title);
    res.status(201).json(task);
  } catch (e) { res.status(500).json({ error: 'Failed to create task' }); }
});
 
app.put('/tasks/:id', async (req, res) => {
  try { res.json(await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch { res.status(500).json({ error: 'Failed to update task' }); }
});
 
app.delete('/tasks/:id', async (req, res) => {
  try { await Task.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch { res.status(500).json({ error: 'Failed to delete' }); }
});
 
app.listen(PORT, () => console.log(`✅ Server at http://localhost:${PORT}`));