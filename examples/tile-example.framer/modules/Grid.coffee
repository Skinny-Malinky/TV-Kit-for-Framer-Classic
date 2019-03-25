{ ProgrammeTile } = require "ProgrammeTile"
{ Navigables } = require "Navigables"

class exports.Grid extends Navigables
	constructor: ( options={} ) ->
		@__construction = true
		@__instancing = true
		_.defaults options,
			tileWidth: 230
			tileHeight: 129
			gaps: 8
			numberOfTiles: 30
			tileLabel: 'On Now'
			columns: 4
			debug: false
		super options
		delete @__construction

		_.assign @,
			tileWidth: options.tileWidth
			tileHeight: options.tileHeight
			gaps: options.gaps
			columns: options.columns
			numberOfTiles: options.numberOfTiles

		@debug = options.debug
		#Safe zone
		@firstPosition = options.x
		@gaps = options.gaps
		@xPos = 1
		@yPos = 1
		@events = []

		# for i in [0...@numberOfTiles]
		# 	console.log( "added" )
		# 	@addTile()
		
		# @_updateWidth()
		# @_updateHeight( options.tileHeight )

	#============================================================
	# Private Methods
	#============================================================

	# _updateHeight: ( value ) ->
	# 	@.height = value

	# _updateWidth: () ->
	# 	@.width = (@.tileWidth+@.gaps)*@.numberOfTiles if @?
	
	# _setTileWidth: ( value ) ->
	# 	for tile, i in @.children
	# 		tile.x = (value+@gaps) * i
	# 		tile.width = value

	# _applyToAllTiles: ( task, value ) ->
	# 	for tile, i in @.children
	# 		if value?
	# 			task( tile, value )
	# 		else
	# 			task( tile )
	
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

	# _moveHighlight: ( childIndex ) =>
	# 	if @highlightLayer? == false
	# 		return
	# 	xPos = childIndex*( @gaps+@tileWidth ) + @firstPosition
	# 	if @highlightLayer.screenFrame.y == @.screenFrame.y
	# 		@highlightLayer.animate
	# 			x: xPos 
	# 	else
	# 		@highlightLayer.x = xPos 
	# 		@highlightLayer.y = @.screenFrame.y

	# 	@focusIndex = childIndex
	
	# _moveCarousel: ( tileIndex ) ->
	# 	if @highlightLayer? == false
	# 		return
	# 	carouselLeft.stop() if carouselLeft?
	# 	carouselLeft = new Animation @,
	# 		x: -((@tileWidth+@gaps)*@carouselIndex) + @firstPosition
	# 	carouselLeft.start()
	# 	@.select(tileIndex).highlight()

	# #============================================================
	# # Public Methods
	# #============================================================

	addTile: ( tile ) =>
		console.log( @ )
		lastTileIndex = @.children.length
		rowNo = Math.floor(lastTileIndex/@columns) # rowNumber
		fullTileWidth = @tileWidth+@gaps
		@width = fullTileWidth * @columns
		xPosition = fullTileWidth*lastTileIndex - @width*rowNo
		yPosition = rowNo*(@tileHeight+@gaps)
		if tile == undefined
			tile = new ProgrammeTile
				parent: @
				width: @tileWidth
				height: @tileHeight
				meta: @meta
				image: @image
				title: @title
				thirdLine: @thirdLine
				opacity: 0
			tile.x = xPosition
			tile.y = yPosition
			for tiles, i in @.children
				tiles.disappear.stop()
				tiles.appear.start()
			tile.tileAnimation = tile.animate
				opacity: 1
	
	# removeTiles: ( numberOfTiles ) =>
	# 	for i in [0...numberOfTiles]
	# 		lastTileIndex = @.children.length-1
	# 		@.children[lastTileIndex].opacity = 0
	# 		@.children[lastTileIndex].destroy()

	# select: ( xPos, yPos ) ->
	# 	return @children[(xPos*yPos)-1]
	
	highlight: ( xPos, yPos ) ->
		# if @highlightLayer?
		# 	@.select( tileIndex ).highlight()
		# 	@highlightLayer.height = @.tileHeight
		# 	@highlightLayer.width = @.tileWidth
		# 	for child, i in @highlightLayer.children
		# 		child.height = @.tileHeight
		# 		child.width = @.tileWidth
		# 	@._moveHighlight( @focusIndex )
		# 	@highlightLayer.visible = true
		console.log("highlight " + xPos + " | " + yPos)
	
	removeHighlight: () ->
		# @.select(@lastHighlight).removeHighlight()
		# @highlightLayer.visible = false
        console.log("remove highlight")

	# moveRight: =>
	# 	totalIndex = @focusIndex+@carouselIndex
	# 	if @focusIndex < @rightPageBoundary or 
	# 	totalIndex == @numberOfTiles-2
	# 		@.select( totalIndex ).removeHighlight()
	# 		@focusIndex++
	# 		totalIndex = @focusIndex + @carouselIndex
	# 		@.highlight( totalIndex )
	# 	else if @focusIndex >= @rightPageBoundary and totalIndex < @numberOfTiles-2
	# 		@.select(totalIndex).removeHighlight()
	# 		@carouselIndex++
	# 		totalIndex = @focusIndex+@carouselIndex
	# 		@._moveCarousel( totalIndex )
	# 	else @emit("rightOut")
	# 	@lastHighlight = totalIndex
	
	# moveLeft: =>
	# 	totalIndex = @focusIndex+@carouselIndex
	# 	if @focusIndex > @leftPageBoundary or 
	# 	totalIndex == 1
	# 		@.select( totalIndex ).removeHighlight()
	# 		@focusIndex--
	# 		totalIndex = @focusIndex + @carouselIndex
	# 		@.highlight( totalIndex )
	# 	else if @focusIndex >= @leftPageBoundary and totalIndex > 1
	# 		@.select( totalIndex ).removeHighlight()
	# 		@carouselIndex--
	# 		totalIndex = @focusIndex+@carouselIndex
	# 		@._moveCarousel( totalIndex )
	# 	else @emit("leftOut")
	# 	@lastHighlight = totalIndex
	
	# moveUp: () =>
	# 	@emit("upOut")

	# moveDown: () =>
	# 	@emit("downOut")

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