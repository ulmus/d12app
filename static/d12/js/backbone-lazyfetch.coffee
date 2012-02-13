# Backbone.sync

# Map from CRUD to HTTP for our default `Backbone.sync` implementation.
methodMap =
	'create': 'POST',
	'update': 'PUT',
	'delete': 'DELETE',
	'read'  : 'GET'

# Helper function to get a URL from a Model or Collection as a property
# or as a function.

getUrl = (object) ->
  if (not (object && object.url)) then return null
  return if _.isFunction(object.url) then object.url() else object.url

# If the collection or model has a queryParams attribute, cas a function or object literal
# use it to set the query-string

getParams = (object) ->
	if (not (object && object.url)) then return ""
	queryParams = if _.isFunction(object.queryParams) then object.queryParams() else object.queryParams
	queryString = ""
	if queryParams and not _.isEmpty(queryParams)
		queryString = "?" + "#{key}=#{value}" for key, value of queryParams
	return queryString

# Throw an error when a URL is needed, and none is supplied.
urlError = ->
	throw new Error('A "url" property or function must be specified')


Backbone.sync = (method, model, options) ->
	type = methodMap[method]

	# Default JSON-request options.
	params = _.extend({
	  type:         type
	  dataType:     'json'
	}, options)

	# Ensure that we have a URL.
	if not params.url
	  params.url = getUrl(model) or urlError()
	  params.url += getParams(model)


	# Ensure that we have the appropriate request data.
	if not params.data and model and (method == 'create' or method == 'update')
	  params.contentType = 'application/json';
	  data = model.toJSON()
	  delete data.id
	  params.data = JSON.stringify(data);


	# Don't process data on a non-GET request.
	if (params.type != 'GET')
	  params.processData = false

	# Make the request.
	return $.ajax(params)

