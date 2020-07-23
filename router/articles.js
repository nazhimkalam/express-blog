const express = require('express');
const router = express.Router();
const Article = require('../models/article');

router.get('/new', (req, res) => {
	res.render('articles/new', { article: new Article() });
});

router.get('/edit/:id', async (req, res) => {
	const article = await Article.findById(req.params.id);
	res.render('articles/edit', { article: article }); // goes through the view folder finds the edit.ejs
});

router.get('/:slug', async (req, res) => {
	// Article.finsById is an async function
	const article = await Article.findOne({ slug: req.params.slug }); // we used slugify to get good looking unique values for the URL other than long ugly numerical Ids

	if (article == null) {
		// if its null we direct back to the localhost:3000
		res.redirect('/');
	} else {
		res.render('articles/show', { article: article });
	}
});

router.post(
	'/',
	async (req, res, next) => {
		req.article = new Article();
		next();
	},
	saveArticleAndRedirect('new')
);

router.put(
	// this is for update
	'/:id',
	async (req, res, next) => {
		req.article = await Article.findById(req.params.id);
		next();
	},
	saveArticleAndRedirect('edit')
);

router.delete('/:id', async (req, res) => {
	// deleting by id
	await Article.findByIdAndDelete(req.params.id);
	res.redirect('/'); // redirects to localhost:5000
});

function saveArticleAndRedirect(path) {
	return async (req, res) => {
		let article = req.article;

		article.title = req.body.title;
		article.description = req.body.description;
		article.markdown = req.body.markdown;

		try {
			// save() is an async function (for async function we make sure that the entire function is async, has a await and a try catch)
			article = await article.save(); // returns the article with an id
			res.redirect(`/articles/${article.slug}`);
		} catch (e) {
			console.log(e);
			res.render(`articles/${path}`, { article: article });
		}
	};
}

module.exports = router;
