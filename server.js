var express = require('express');
const app = express();
const PORT = 5000;

const articleRouter = require('./router/articles');
const mongoose = require('mongoose');
const Article = require('./models/article');
const methodOverride = require('method-override');

// we use methodOverride so that we can use other methods rather than stuck with GET and POST itself
app.use(methodOverride('_method'));
// what this tells is that, it allows to access the field data of the form body
app.use(express.urlencoded({ extended: false }));
// whatever the routes created in articleRouter with contain '/articles' and then the other routes
app.use('/articles', articleRouter);


// connecting to the mongodb
mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// we are using ejs view engine to convert our code to html from ejs
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
	const articles = await Article.find().sort({
		createdAt: 'desc',
	});
	res.render('articles/index', { articles: articles });
});

app.listen(PORT, () => {
	console.log(`Listening on port number ${PORT}`);
});
