(function() {
  var getParams, getUrl, methodMap, urlError;

  methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read': 'GET'
  };

  getUrl = function(object) {
    if (!(object && object.url)) return null;
    if (_.isFunction(object.url)) {
      return object.url();
    } else {
      return object.url;
    }
  };

  getParams = function(object) {
    var key, queryParams, queryString, value;
    if (!(object && object.url)) return "";
    queryParams = _.isFunction(object.queryParams) ? object.queryParams() : object.queryParams;
    queryString = "";
    if (queryParams && !_.isEmpty(queryParams)) {
      for (key in queryParams) {
        value = queryParams[key];
        queryString = "?" + ("" + key + "=" + value);
      }
    }
    return queryString;
  };

  urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  Backbone.sync = function(method, model, options) {
    var data, params, type;
    type = methodMap[method];
    params = _.extend({
      type: type,
      dataType: 'json'
    }, options);
    if (!params.url) {
      params.url = getUrl(model) || urlError();
      params.url += getParams(model);
    }
    if (!params.data && model && (method === 'create' || method === 'update')) {
      params.contentType = 'application/json';
      data = model.toJSON();
      delete data.id;
      params.data = JSON.stringify(data);
    }
    if (params.type !== 'GET') params.processData = false;
    return $.ajax(params);
  };

}).call(this);
