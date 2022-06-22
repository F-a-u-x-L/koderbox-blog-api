// PACKAGES USED

const express = require('express');
const Blog = require('./models/blog');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();


// CONNECTIONG WITH DATABASE

const db_url = 'mongodb://localhost:27017/koderbox';
mongoose.connect( db_url, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error : "));
db.once("open", () => {
    console.log("Database Connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.json());


// ***************************************************************************************
// GET blog list

app.get('/blog', async (req, res) => {
    const blogs = await Blog.find({});
    res.render('blogs/index', {blogs});
});



// ***************************************************************************************
// CREATE new blog post

app.get('/blog/new', (req, res) => {
    res.render('blogs/newblog');
});

app.post('/blog', async (req, res) => {
    const blog = new Blog(req.body.blog);
    await blog.save();
    res.redirect('/blog');
});



// **************************************************************************************
// SHOW a particular blog post

app.get('/blog/:id', async (req, res) => {
    const {id} = req.params;
    const blog = await Blog.findById(id);
    res.render('blogs/show', {blog});
});



// **************************************************************************************
// EDIT blog post 

app.get('/blog/:id/edit', async (req, res) => {
    const {id} = req.params;
    const blog = Blog.findById(id);
    res.render('blogs/edit', {id, ...blog});
});

app.put('/blog/:id', async (req, res) => {
    const {id} = req.params;
    const blog = await Blog.findByIdAndUpdate(id, {...req.body.blog});
    await blog.save();
    res.redirect(`/blog/${id}`);
});



// *************************************************************************************
// DELETE a blog

app.delete('/blog/:id', async (req, res) => {
    const {id} = req.params;
    await Blog.findByIdAndDelete(id);
    res.redirect('/blog');
});



// ************************************************************************************
// LISTENING to the server

app.listen(3000, () => {
    console.log('Listening on port 3000');
});