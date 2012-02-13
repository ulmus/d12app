(function() {
  var Post, PostCollection, postTemplate,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Post = (function(_super) {

    __extends(Post, _super);

    function Post() {
      Post.__super__.constructor.apply(this, arguments);
    }

    Post.prototype.defaults = {
      title: "Awesome post",
      body: "<ul><li>Postlist 1</li><li>Postlist 2</li></ul>",
      keywords: ["awesome", "post"],
      draft: false
    };

    Post.prototype.schema = {
      title: {
        type: "Text"
      }
    };

    return Post;

  })(Foundation.Model);

  PostCollection = (function(_super) {

    __extends(PostCollection, _super);

    function PostCollection() {
      PostCollection.__super__.constructor.apply(this, arguments);
    }

    PostCollection.prototype.model = Post;

    PostCollection.prototype.localStorage = new Store("PostCollection");

    return PostCollection;

  })(Foundation.Collection);

  postTemplate = Handlebars.compile("<h1>{{attr.title}}</h1><div>{{{attr.body}}}</div><ul>{{#each attr.keywords}}<li>{{this}}</li>{{/each}}</ul>{{#if attr.draft}}Draft{{else}}Published{{/if}}");

  window.Test = {
    Post: Post,
    PostCollection: PostCollection,
    postTemplate: postTemplate
  };

}).call(this);
