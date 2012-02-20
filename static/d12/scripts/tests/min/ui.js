(function() {

  module('UI');

  test('ModalView', function() {
    var mTMView, mTView, mView, post;
    expect(9);
    post = new Test.Post({
      id: 1
    });
    mView = new Foundation.UI.ModalView({
      fade: false
    });
    mView.render();
    mView.showModal();
    ok(mView.$el.hasClass("in"), "Modal shown");
    mView.hideModal();
    ok(!mView.$el.hasClass("in"), "Modal hidden again");
    mTView = new Foundation.UI.ModalView({
      fade: false,
      bodyView: new Foundation.StaticView({
        content: "staticTest"
      })
    });
    mTView.render();
    equals(mTView.$("[data-anchor='bodyView']").html(), '<div class="">staticTest</div>', "Static content rendered ok");
    mTView.showModal();
    mTView.bind("modal:ok", function() {
      return ok(true, "Modal triggered modal:ok on ok click");
    });
    mTView.$(".btn[title='OK']").click();
    mTView.bind("modal:cancel", function() {
      return ok(true, "Modal triggered modal:cancel on cancel click");
    });
    mTView.buttons.add({
      label: "New Button",
      onClick: function() {
        return ok(true, "Modal click on new button click");
      },
      buttonClass: "dangerous"
    });
    mTView.$(".btn[title='New Button']").click();
    mTView.$(".btn[title='Cancel']").click();
    ok(!mTView.$el.hasClass("in"), "Modal hidden by click on cancel");
    mTMView = new Foundation.UI.ModalView({
      fade: false,
      bodyView: new Foundation.ModelView({
        model: post,
        template: Test.postTemplate
      })
    });
    mTMView.render();
    equals(mTMView.$el.find("h1").text(), post.get("title"), "Model rendered in modal ok");
    mTMView.showModal();
    mTMView.buttons.add({
      label: "Update model",
      onClick: function() {
        return post.set({
          title: "New Test"
        });
      }
    });
    mTMView.$(".btn[title='Update model']").click();
    equals(mTMView.$el.find("h1").text(), post.get("title"), "Model changed in modal");
    return mTMView.hideModal();
  });

  test('EditableModelView', function() {
    var eMView, post, posts;
    posts = new Test.PostCollection();
    post = posts.create();
    eMView = new Foundation.UI.EditableModelView({
      model: post
    });
    eMView.render();
    eMView.showEdit();
    equals(eMView.formModal.$("#title").val(), post.get("title"), "Form rendered in modal with correct title in input");
    eMView.formModal.$("#title").val("New title");
    eMView.formModal.$(".btn[title='OK']").click();
    equals(post.get("title"), "New title", "Form input saved ok");
    post.set({
      title: "Another new title"
    });
    eMView.showEdit();
    equals(eMView.formModal.$("#title").val(), post.get("title"), "Setting attribute on model updates form");
    return eMView.hideEdit();
  });

  test('ButtonView', function() {
    var button, buttonView, dropDownButton, dropDownButtonView;
    expect(4);
    button = new Foundation.UI.Button({
      label: "Button",
      onClick: function() {
        return ok(true, "Button clicked");
      }
    });
    buttonView = new Foundation.UI.ButtonView({
      model: button
    });
    buttonView.$el.appendTo("#test-main");
    buttonView.render();
    buttonView.$(".btn").click();
    button.set({
      enabled: false
    });
    buttonView.$(".btn").click();
    dropDownButton = new Foundation.UI.Button({
      label: "DropdownButton",
      type: "dropdown",
      menu: new Foundation.UI.ButtonCollection([
        {
          label: "Test",
          onClick: function() {
            return ok(true, "Menu item clicked");
          }
        }
      ])
    });
    dropDownButtonView = new Foundation.UI.ButtonView({
      model: dropDownButton
    });
    dropDownButtonView.$el.appendTo("#test-main");
    dropDownButtonView.render();
    dropDownButtonView.$("a[title='Test']").click();
    dropDownButton.set({
      enabled: false
    });
    dropDownButtonView.$("a[title='Test']").click();
    dropDownButton.get("menu").add({
      label: "Test 2",
      onClick: function() {
        return ok(true, "Menu item 2 clicked");
      }
    });
    dropDownButton.set({
      enabled: true
    });
    dropDownButtonView.$("a[title='Test']").click();
    return dropDownButtonView.$("a[title='Test 2']").click();
  });

}).call(this);
