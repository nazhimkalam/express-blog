const mongoose = require('mongoose');
const slugify = require('slugify');
const marked = require('marked');

// to purify the markdown block, if html code is present we can covert it to an HTML form
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const domPurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	markdown: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	slug: {
		type: String,
		required: true,
		unique: true,
	},
	sanitizedHtml: {
		type: String,
		required: true,
	},
});

// used to create a unique string other than using the Id for the URl which looks very ugly
articleSchema.pre('validate', function(next){
	if (this.title) {
		this.slug = slugify(this.title, { lower: true, strict: true });
	}

	if (this.markdown) {
		this.sanitizedHtml = domPurify.sanitize(marked(this.markdown));
	}

	next();
});

// now we have a table called 'Article' with all of the columns specified in the articleSchema
module.exports = mongoose.model('Article', articleSchema);
