

class Post extends Foundation.Model

	defaults:
		title: "Awesome post"
		body: "<ul><li>Postlist 1</li><li>Postlist 2</li></ul>"
		keywords: ["awesome", "post"]
		draft: false

	schema:
		title:
			type: "Text"


class PostCollection extends Foundation.Collection

	model: Post
	localStorage: new Store("PostCollection")


postTemplate = Handlebars.compile("<h1>{{attr.title}}</h1><div>{{{attr.body}}}</div><ul>{{#each attr.keywords}}<li>{{this}}</li>{{/each}}</ul>{{#if attr.draft}}Draft{{else}}Published{{/if}}")

window.Test =
	Post: Post
	PostCollection: PostCollection
	postTemplate: postTemplate