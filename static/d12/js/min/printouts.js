(function() {
  var baseUrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Printouts = {};

  baseUrl = "/api/export/";

  Printouts.Printout = (function(_super) {

    __extends(Printout, _super);

    function Printout() {
      this.toString = __bind(this.toString, this);
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

    return Printout;

  })(Foundation.Model);

  Printouts.PrintoutCollection = (function(_super) {

    __extends(PrintoutCollection, _super);

    function PrintoutCollection() {
      PrintoutCollection.__super__.constructor.apply(this, arguments);
    }

    PrintoutCollection.prototype.model = Printouts.Printout;

    return PrintoutCollection;

  })(Foundation.Collection);

}).call(this);
