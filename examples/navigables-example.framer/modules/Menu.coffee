tvUtils = require "tvUtils"
{ Navigables } = require "Navigables"

class exports.Menu extends Navigables

	constructor: ( options={} ) ->

		@__construction = true
		@__instancing = true

		_.defaults options,
			menuItems: ['Menu One', 'Menu Two', 'Menu Three']
			content: [layerOne, layerTwo, layerThree]
			backgroundColor: ''
		super options

		delete @__construction

		# print options

		menuNames = options.menuItems
		for names, i in menuNames
			if names instanceof Layer
				menuLayer = names
				menuLayer.y = 6
				menuLayer.x = -2
			else
				menuLayer = new TextLayer
				@highlightY = @.screenFrame.y + menuLayer.height-5
			_.assign menuLayer,
				parent: @
				text: names
				color: "#ebebeb"
				fontFamily: "Avenir-light"
				fontSize: 30
				letterSpacing: 0.3
				backgroundColor: ""
				x: if @.children[i-1]? then @.children[i-1].maxX + 39 else 0
				custom:
					menuContent: options.content[i]

			# menuLayer.addChild(options.content[i]) if options.content[i]?
			options.menuItems[i] = menuLayer
			@highlightIndex = 0

	# print '1'
	@define 'menuItems',
		get: ->	return @.children
		set: ( value ) ->
			return if @__construction
			@menuItems = value

	@define 'content',
		get: -> @_getContent()
		set: ( value ) -> if @__construction? then @_setContent( value )

	layerOne = new TextLayer
		name: ".", y: 100, visible: false, backgroundColor: "red", text: "Define with an array in Menu.custom.content", color: "white"
	layerTwo = new TextLayer
		name: ".", y: 100, visible: false, backgroundColor: "blue", text: "Define with an array in Menu.custom.content", color: "white"
	layerThree = new TextLayer
		name: ".", y: 100, visible: false, backgroundColor: "green", text: "Define with an array in Menu.custom.content", color: "white"

	_getContent: ->
		_content = []
		for child in @.children
			_content.push(child.custom.menuContent)
		return _content

	_setContent: ( value ) ->
		for child, i in @.children
			child.custom.menuContent.destroy()
			child.custom.menuContent = value[i]
			# child.addChild(child.custom.menuContent)

	_moveHighlight: () ->
		@highlightLayer.currentContext = @

	_setIndex: ( highlightedMenuIndex ) ->
		if highlightedMenuIndex == undefined
			highlightedMenuIndex = 0
		return highlightedMenuIndex

	removeHighlight: () ->
		for child, i in @.children
			if i == @highlightIndex
				child.animate
					color: tvUtils.white
			else
				child.animate
					color: tvUtils.darkGrey
		@.highlightLayer.animate
			backgroundColor: tvUtils.white
		for child in @.highlightLayer.children
			child.visible = false
		@.highlightLayer.visible = true


	highlight: ( highlightedMenuIndex ) ->
		if highlightedMenuIndex == undefined then highlightedMenuIndex = 0
		if @.children?
			for child, i in @.children
				if i == highlightedMenuIndex
					child.animate
						color: tvUtils.blue

					if child.custom.menuContent?
						child.custom.menuContent.visible = true

					if @highlightLayer?
						_.assign @highlightLayer,
							width: 0
							y: @highlightY
							x: child.screenFrame.x + child.width/2
						@highlightLayer.children[0].width = 0
						@highlightLayer.children[0].animate
							width: child.width+10
						@highlightLayer.animate
							width: child.width
							x: child.screenFrame.x
				else
					child.animate
						color: tvUtils.white

					if child.custom.menuContent?
						child.custom.menuContent.visible = false
			@.highlightLayer.animate
				backgroundColor: tvUtils.blue
			for child in @.highlightLayer.children
				child.visible = true

			@highlightIndex = highlightedMenuIndex
			@lastHighlight = highlightedMenuIndex

	moveRight: () =>
		if @highlightIndex+1 < @.menuItems.length
			@.highlight( @highlightIndex+1 )
		else @emit("rightOut")
		@lastHighlight = @highlightIndex

	moveLeft: () =>
		if @highlightIndex > 0
			@.highlight( @highlightIndex-1 )
		else @emit("leftOut")
		@lastHighlight = @highlightIndex

	moveUp: () =>
		@emit("upOut")

	moveDown: () =>
		@emit("downOut")
	# =====================
	# Init