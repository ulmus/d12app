(function() {

  module('Foundation');

  test('Foundation.View', function() {
    var childView1, childView2, view;
    view = new Foundation.View();
    childView1 = new Foundation.View();
    childView2 = new Foundation.View();
    view.addChildView(childView1, {
      anchor: "childView1"
    });
    view.addChildView(childView2, {
      anchor: "childView2"
    });
    equals(view.getChildView(childView1.cid), childView1, "ChildView1 added ok");
    equals(view.getChildView(childView2.cid), childView2, "ChildView2 added ok");
    view.removeChildView(childView1);
    equals(view.getChildView(childView1.cid), void 0, "ChildView1 removed ok");
    equals(view.getChildView(childView2.cid), childView2, "ChildView2 still there");
    view.removeChildView(childView2);
    equals(view.getChildView(childView1.cid), void 0, "ChildView1 still not there");
    equals(view.getChildView(childView2.cid), void 0, "ChildView2 removed ok");
    view.addChildView(childView1, {
      anchor: "childView1"
    });
    equals(view.getChildView(childView1.cid), childView1, "ChildView1 added");
    equals(view.getChildView(childView2.cid), void 0, "ChildView2 still not there");
    return equals(view.getChildView("sdfsdfsdf"), null, "Trying to get unattached childView");
  });

  test('TemplateView', function() {
    var childTView1, childTView2, parentTView, tView;
    tView = new Foundation.TemplateView({
      template: Handlebars.compile("{{html}},{{{html}}}"),
      context: {
        html: "<h1>Test</h1>"
      }
    });
    tView.render();
    equals($(tView.el).html(), "&lt;h1&gt;Test&lt;/h1&gt;,<h1>Test</h1>", "Template output OK");
    parentTView = new Foundation.TemplateView({
      template: Handlebars.compile('{{parentContext}}<div data-anchor="childView1">ShouldBeRemoved</div><div data-anchor="childView2"></div>'),
      context: {
        parentContext: "parent"
      }
    });
    childTView1 = new Foundation.TemplateView({
      template: Handlebars.compile("{{childAttribute}}"),
      context: {
        childAttribute: "child1"
      }
    });
    childTView2 = new Foundation.TemplateView({
      template: Handlebars.compile("{{childAttribute}}"),
      context: {
        childAttribute: "child2"
      }
    });
    equals(parentTView.render().$el.html(), 'parent<div data-anchor="childView1">ShouldBeRemoved</div><div data-anchor="childView2"></div>', "Render with not attached ChildViews OK");
    parentTView.addChildView(childTView1);
    equals(parentTView.render().$el.html(), 'parent<div data-anchor="childView1">ShouldBeRemoved</div><div data-anchor="childView2"></div>', "Unanchored ChildView attached, renders OK");
    parentTView.removeChildView(childTView1);
    equals(parentTView.render().$el.html(), 'parent<div data-anchor="childView1">ShouldBeRemoved</div><div data-anchor="childView2"></div>', "Unanchored ChildView removed, renders OK");
    parentTView.addChildView(childTView1, {
      anchor: "childView1"
    });
    equals(parentTView.render().$el.html(), 'parent<div data-anchor="childView1">child1</div><div data-anchor="childView2"></div>', "Anchored ChildView added, renders OK");
    parentTView.addChildView(childTView2);
    equals(parentTView.render().$el.html(), 'parent<div data-anchor="childView1">child1</div><div data-anchor="childView2"></div>', "Unanchored ChildView added, renders OK");
    parentTView.removeChildView(childTView2);
    equals(parentTView.render().$el.html(), 'parent<div data-anchor="childView1">child1</div><div data-anchor="childView2"></div>', "Unanchored ChildView removed, renders OK");
    parentTView.addChildView(childTView2, {
      anchor: "childView2"
    });
    equals(parentTView.render().$el.html(), 'parent<div data-anchor="childView1">child1</div><div data-anchor="childView2">child2</div>', "Anchored ChildView added, renders OK");
    parentTView.removeChildView(childTView2);
    equals(parentTView.render().$el.html(), 'parent<div data-anchor="childView1">child1</div><div data-anchor="childView2"></div>', "Anchored ChildView removed, renders OK");
    parentTView.removeChildView(childTView1);
    return equals(parentTView.render().$el.html(), 'parent<div data-anchor="childView1">ShouldBeRemoved</div><div data-anchor="childView2"></div>', "All anchored ChildViews removed, renders OK");
  });

  test('ModelView', function() {
    var anotherPost, mView, post;
    post = new Test.Post({
      id: 1
    });
    mView = new Foundation.ModelView({
      el: $('<div class="test-model-view"></div>').appendTo("#test-main"),
      model: post,
      template: Test.postTemplate
    });
    mView.render();
    equals($(mView.el).html(), "<h1>Awesome post</h1><div><ul><li>Postlist 1</li><li>Postlist 2</li></ul></div><ul><li>awesome</li><li>post</li></ul>Published", "Model template output ok");
    equals($(mView.el).data("modelId"), post.id, "Model id saved in element data-attribute");
    post.set({
      title: "New Title",
      id: 2
    });
    equals($(mView.el).html(), "<h1>New Title</h1><div><ul><li>Postlist 1</li><li>Postlist 2</li></ul></div><ul><li>awesome</li><li>post</li></ul>Published", "Model template rerendered on change");
    equals($(mView.el).data("modelId"), post.id, "Model id re-saved in element data-attribute");
    anotherPost = new Test.Post({
      id: 2,
      title: "Another Title"
    });
    mView.setModel(anotherPost);
    equals($(mView.el).html(), "<h1>Another Title</h1><div><ul><li>Postlist 1</li><li>Postlist 2</li></ul></div><ul><li>awesome</li><li>post</li></ul>Published", "New Model template rerendered on change");
    return equals($(mView.el).data("modelId"), anotherPost.id, "New Model id saved in element data-attribute");
  });

}).call(this);
