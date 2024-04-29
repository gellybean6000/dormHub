import express from 'express'
import collection from './src/mongodb.js'
import slot from './src/events.js';
import bodyParser from 'body-parser'
import bcrypt, { compare } from 'bcrypt';


const app = express()
const port = 3000


app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render("home")
})
app.get('/login', (req, res) => {
  res.render("login")
})
app.get('/signup', (req, res) => {
  res.render("signup")
})
app.get('/events', (req, res) => {
  res.render("events")
})
app.get('/profile', (req, res) => {
  res.render("profile")
})
app.get('/slot', (req, res) => {
  res.render("slot")
})

app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const data =  {
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      room: req.body.room_number,
      dob: req.body.dob,
      department: req.body.department
    };
    // Insert data into the collection
    await collection.insertMany([data]);

    // Render the login page after successful insertion
    res.redirect('/login');
  } catch (error) {
    console.error("Error inserting data:", error);
    // Handle the error appropriately (e.g., show an error page, send a JSON response)
    res.status(500).send("An error occurred while processing your request.");
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request received:', email); // Logging request body
    const user = await collection.findOne({ email });
    console.log('User found:', user); // Logging user object
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    const passwordMatch = await compare(password, user.password);
    if (passwordMatch) {
      console.log('Login successful');
      res.render('profile', {data: user}); // Redirect to profile page and pass user object as data
    } else {
      console.log('Wrong password');
      res.status(401).json({ error: 'Wrong password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// Slot booking backend

app.post("/events", async (req, res) => {
  try {
    const eventData = {
      name: req.body.name,
      room: req.body.room_number,
      event: req.body.Event,
      date: req.body.date,
      time: req.body.time
    };
    
    // Insert data into the collection
    await slot.insertMany([eventData]);

    const queryParameters = {
      name: eventData.name, // Assuming name is unique for each event
      date: eventData.date,
      time: eventData.time,
      event: eventData.event,
      room: eventData.room
  };
  
  // Find the inserted event data using the query parameters
  const insertedEvent = await slot.findOne(queryParameters);
    res.render('slot', { eventData: insertedEvent });

  } catch (error) {
    console.error("Error inserting data:", error);
    // Handle the error appropriately (e.g., show an error page, send a JSON response)
    res.status(500).send("An error occurred while processing your request.");
  }
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})