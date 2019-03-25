{ ProgrammeTile } = require "ProgrammeTile"
{ Navigables } = require "Navigables"

class exports.Carousel extends Navigables
	constructor: ( options={} ) ->
		@__construction = true
		@__instancing = true
		_.defaults options,
			tileWidth: 280
			tileHeight: 157
			height: options.tileHeight
			gaps: 8
			numberOfTiles: 5
			tileLabel: 'On Now'
			backgroundColor: 'transparent'
			debug: false
		super options
		delete @__construction

		_.assign @,
			height: options.tileHeight
			tileWidth: options.tileWidth
			tileHeight: options.tileHeight
			gaps: options.gaps
			focusIndex: 0
			carouselIndex: 0
		
		@debug = options.debug
		#Safe zone
		@firstPosition = options.x
		@fullTilesVisible = _.floor( Screen.width / (options.tileWidth+options.gaps) )
		@rightPageBoundary = @fullTilesVisible - 1 - 1 #Accounting for 0
		@leftPageBoundary = 1
		@gaps = options.gaps
		@lastHighlight = 0
		#==============================================
		# Layers
		#==============================================
		
		@events = []
		for i in [0...options.numberOfTiles]
			@addTile()
		
		@_updateWidth()
		@_updateHeight( options.tileHeight )

	#============================================================
	# Events
	#============================================================

		@on "change:width", @_updateWidth
		@on "change:height", @_updateHeight

	#============================================================
	# Private Methods
	#============================================================

	_updateHeight: ( value ) ->
		@.height = value
		for child in @.children
			child.height = value

	_updateWidth: () ->
		@.width = (@.tileWidth+@.gaps)*@.numberOfTiles if @?
	
	_setTileWidth: ( value ) ->
		for tile, i in @.children
			tile.x = (value+@gaps) * i
			tile.width = value

	_applyToAllTiles: ( task, value ) ->
		for tile, i in @.children
			if value?
				task( tile, value )
			else
				task( tile )
	
	_setNumberOfTiles: ( tilesNo ) ->
		tileDelta = -(@numberOfTiles - tilesNo)
		if tileDelta > 0
			for i in [0...tileDelta]
				@addTile()
		else if tileDelta < 0
			@removeTiles( -tileDelta )

	_applyData: ( dataArray ) ->
		if @debug == false
			for tile, i in @.children
				if dataArray[i]?
					tile.title = tvUtils.htmlEntities( dataArray[i].title )
					tile.image = tvUtils.htmlEntities( dataArray[i].image )
					tile.label = tvUtils.htmlEntities( dataArray[i].label )
					tile.thirdLine = tvUtils.htmlEntities( dataArray[i].thirdLine )
		else return
	
	_loadEvents: ( feed ) ->
		for event, i in feed.items
			event = {
				title: if event.brandSummary? then event.brandSummary.title else event.title
				image: tvUtils.findImageByID(event.id)
				thirdLine: if event.seriesSummary? then event.seriesSummary.title + ", " + event.title else event.shortSynopsis
				label: if event.onDemandSummary? then tvUtils.entitlementFinder(event.onDemandSummary) else ""
			}
			@events[i] = ( event )

	_moveHighlight: ( childIndex ) =>
		if @highlightLayer? == false
			return
		if @firstPosition? then extra = @firstPosition else extra = 0
		xPos = childIndex*( @gaps+@tileWidth ) + extra
		if @highlightLayer.screenFrame.y == @.screenFrame.y
			@highlightLayer.animate
				x: xPos 
		else
			@highlightLayer.x = xPos 
			@highlightLayer.y = @.screenFrame.y

		@focusIndex = childIndex
	
	_moveCarousel: ( tileIndex ) ->
		if @highlightLayer? == false
			return
		carouselLeft.stop() if carouselLeft?
		carouselLeft = new Animation @,
			x: -((@tileWidth+@gaps)*@carouselIndex) + @firstPosition
		carouselLeft.start()
		@.select(tileIndex).highlight()

	#============================================================
	# Public Methods
	#============================================================

	addTile: ( tile ) =>
		lastTileIndex = @.children.length
		xPosition = ( @tileWidth + @gaps ) * lastTileIndex
		if tile == undefined
			tile = new ProgrammeTile
				parent: @
				# name: "."
				x: if xPosition == undefined then 0 else xPosition
				width: @tileWidth
				height: @tileHeight
				meta: @meta
				image: @image
				title: @title
				thirdLine: @thirdLine
				opacity: 0

			for tiles, i in @.children
				tiles.disappear.stop()
				tiles.appear.start()

			tile.tileAnimation = tile.animate
				opacity: 1
	
	removeTiles: ( numberOfTiles ) =>
		for i in [0...numberOfTiles]
			lastTileIndex = @.children.length-1
			@.children[lastTileIndex].opacity = 0
			@.children[lastTileIndex].destroy()

	select: ( index ) ->
		return @children[index]
	
	highlight: ( tileIndex ) ->
		if @highlightLayer?
			@.select( tileIndex ).highlight()
			@highlightLayer.height = @.tileHeight
			@highlightLayer.width = @.tileWidth
			for child, i in @highlightLayer.children
				child.height = @.tileHeight
				child.width = @.tileWidth
			@._moveHighlight( @focusIndex )
			@highlightLayer.visible = true
	
	removeHighlight: () ->
		@.select(@lastHighlight).removeHighlight()
		@highlightLayer.visible = false

	moveRight: =>
		totalIndex = @focusIndex+@carouselIndex
		if @focusIndex < @rightPageBoundary or 
		totalIndex == @numberOfTiles-2
			@.select( totalIndex ).removeHighlight()
			@focusIndex++
			totalIndex = @focusIndex + @carouselIndex
			@.highlight( totalIndex )
		else if @focusIndex >= @rightPageBoundary and totalIndex < @numberOfTiles-2
			@.select(totalIndex).removeHighlight()
			@carouselIndex++
			totalIndex = @focusIndex+@carouselIndex
			@._moveCarousel( totalIndex )
		else @emit("rightOut")
		@lastHighlight = totalIndex
	
	moveLeft: =>
		totalIndex = @focusIndex+@carouselIndex
		if @focusIndex > @leftPageBoundary or 
		totalIndex == 1
			@.select( totalIndex ).removeHighlight()
			@focusIndex--
			totalIndex = @focusIndex + @carouselIndex
			@.highlight( totalIndex )
		else if @focusIndex >= @leftPageBoundary and totalIndex > 1
			@.select(totalIndex).removeHighlight()
			@carouselIndex--
			totalIndex = @focusIndex+@carouselIndex
			@._moveCarousel( totalIndex )
		else
			@emit("leftOut")
		@lastHighlight = totalIndex
	
	moveUp: () =>
		@emit("upOut")

	moveDown: () =>
		@emit("downOut")

	#============================================================
	# Init
	#============================================================
	
	

	#============================================================
	# Definitions
	#============================================================

	# @define 'tileWidth',
	# 	get: -> @.select(0).width if @.select()?
	# 	set: ( value ) ->
	# 		return if @__instancing
	# 		@_setTileWidth( value ) if @?
	# @define 'tileHeight',
	# 	get: -> @.select(0).height if @.select(0)?
	# 	set: ( value ) ->
	# 		return if @__construction
	# 		@._updateHeight(value)
	@define 'numberOfTiles',
		get: -> @.children.length
		set: ( value ) ->
			return if @__construction
			@_setNumberOfTiles( value )
	
	# @define 'width',
	# 	get: -> @_width
	# 	set: ( value ) -> @_updateWidth if @?

	delete @__instancing