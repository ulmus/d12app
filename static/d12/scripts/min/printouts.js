(function() {
  var Printout, PrintoutCollection, baseUrl,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  baseUrl = "/api/export/";

  Printout = (function(_super) {

    __extends(Printout, _super);

    function Printout() {
      Printout.__super__.constructor.apply(this, arguments);
    }

    Printout.name = "printout";

    Printout.prototype.rootUrl = baseUrl + "printout/";

    Printout.prototype.defaults = {
      title: "Export",
      body: "",
      footer: "",
      header: "",
      filename: "export.pdf",
      uuid: ""
    };

    Printout.prototype.toString = function() {
      return this.get("title");
    };

    Printout.prototype.getUrl = function() {
      return "" + baseUrl + "pdf/" + (this.get('uuid')) + "/";
    };

    Printout.prototype.openWindow = function() {
      return window.open(this.getUrl(), "_new");
    };

    return Printout;

  })(Foundation.Model);

  PrintoutCollection = (function(_super) {

    __extends(PrintoutCollection, _super);

    function PrintoutCollection() {
      PrintoutCollection.__super__.constructor.apply(this, arguments);
    }

    PrintoutCollection.prototype.model = Printout;

    PrintoutCollection.prototype.createAndShow = function(attributes) {
      return this.create(attributes, {
        success: function(model, response) {
          return model.openWindow();
        }
      });
    };

    return PrintoutCollection;

  })(Foundation.Collection);

  window.Printouts = {
    Printout: Printout,
    PrintoutCollection: PrintoutCollection,
    printouts: new PrintoutCollection()
  };

}).call(this);
