tvUtils = require "tvUtils"
class exports.ProgrammeTile extends Layer

	constructor: ( options={} ) ->

		# print "constructor-start"
		@__construction = true
		@__instancing = true

		_.defaults options,
			name: "Programme Tile"
			width: 280
			height: 157
			backgroundColor: ""
			title: "Midsomer Murders"
			label: ""
			synopsis: "Once upon a time a dragon entered a dance competition and he was rather good at it. He was a dancing dragon of great import."
			labelColor: "#83858A"
			thirdLine: "Series 1, Episode 1"
			dog: ""
			recorded: false
			watchlist: false
			ghost: false
			linear: false
			onDemand: true
			playable: false

		# print "constructor-end"
		labelText = options.label
		options.label = undefined
		super options


		# print options.height
		_.assign @,
			clip: true
			height: options.height

		#============================================================
		# Layers
		#============================================================

		if @onDemand == true or @linear == true then @playable = true
		@gradientLayer = new Layer
			parent: @
			name:'gradient'
			width: options.width, height: @.height+25
			x: 0, y: 0, index: 0
			backgroundColor: ""
			style:
				"background-image":"linear-gradient(-180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.30) 35%, rgba(0,0,0,0.90) 60%)"

		@textContainer = new Layer
			parent: @, name: 'textContainer'
			backgroundColor: 'transparent'
			x: 10, y: options.height-54, height: 70, index: 1

		@titleLayer = new TextLayer
			parent: @textContainer, name: 'titleLayer'
			text: options.title
			fontFamily: 'Avenir', fontSize: 22, color: '#EBEBEB'
			y: 21, index: 1
			height: 26, width: if options.playable == false then @.width-20 else @.width-40
			x: if options.playable == false then 0 else 26
			truncate: true

		@labelLayer = new TextLayer
			parent: @textContainer
			name: 'labelLayer'
			text: labelText
			fontFamily: 'Avenir-Black'
			fontSize: 16
			textTransform: 'uppercase'
			color: options.labelColor
			letterSpacing: 0.24
			height: 18, width: @.width-20, index: 1
			truncate: true

		@thirdLineLayer = new TextLayer
			parent: @, name:'thirdLineLayer'
			fontFamily: 'Avenir-Black', fontSize: 16, textTransform: 'uppercase', color: '#B6B9BF'
			y: @.height, x: 10, index: 1
			height: 18, width: @.width-20
			text: options.thirdLine
			opacity: 0
			truncate: true

		@dogImageLayer = new Layer
			parent: @, name: 'dog'
			backgroundColor: ''
			y: 10, maxX: @.width-10
			height: 30, width: 100
			html: """<img style = "float:right;max-width:100%;max-height:100%;" src = '#{options.dog}'>"""
			opacity: 0

		@appear = new Animation @,
			opacity: 1
		@disappear = new Animation @,
			opacity: 0

		textLayers = [@titleLayer, @labelLayer, @thirdLineLayer]
		tvUtils.breakLetter(textLayers)

		#============================================================
		# Highlight Animations
		#============================================================

		# Highlight
		@updateHighlightAnimations = ->
			@_containerHighlight = new Animation @textContainer, #Title & label
					y: @.height-74
					options:
						delay: 1
						time: 0.5
			@_thirdLineHighlight = new Animation @thirdLineLayer, #thirdLine
				y: @.height-24
				opacity: 1
				options:
					delay: 1
					time: 0.4
					curve: "ease-out"
			@_gradientHighlight = new Animation @gradientLayer, #Gradient
				y: Align.bottom()
				options:
					delay: 1
					time: 0.4

		@updateRemoveHighlightAnimations = ->
			@_containerRemoveHighlight = new Animation @textContainer, #Title & label
				y: @.height-54
				options:
					time: 0.5
			@_thirdLineRemoveHighlight = new Animation @thirdLineLayer, #thirdLine
				y: @.height
				opacity: 0
				options:
					time: 0.4
					curve: "ease-out"
			@_gradientRemoveHighlight = new Animation @gradientLayer, #Gradient
				maxY: @.maxY+25
				options:
					time: 0.4

		@updateHighlightAnimations()
		@updateRemoveHighlightAnimations()
	#============================================================
	# Events
	#============================================================
		delete @__construction

	#============================================================
	# Public Methods
	#============================================================

	highlight: () ->
		@_containerRemoveHighlight.stop()
		@_thirdLineRemoveHighlight.stop()
		@_gradientRemoveHighlight.stop()

		@_containerHighlight.start()
		@_thirdLineHighlight.start()
		@_gradientHighlight.start()

	removeHighlight: () ->
		@_containerHighlight.stop()
		@_thirdLineHighlight.stop()
		@_gradientHighlight.stop()

		@_containerRemoveHighlight.start()
		@_thirdLineRemoveHighlight.start()
		@_gradientRemoveHighlight.start()

	#============================================================
	# Private Methods
	#============================================================

	_updateHeight: ( value ) ->
		@.height = value
		@gradientLayer.maxY = value+25
		@thirdLineLayer.y = @.height
		@textContainer.y = @.height-54

	#============================================================
	# Definitions
	#============================================================

	# print "start definitions"
	@define "title",
		get: -> return @titleLayer.text
		set: ( value ) -> @titleLayer.text = value if @titleLayer?

	@define "label",
		get: -> return @labelLayer.text if @labelLayer?
		# Not sure why this is happening but I think the Layer class is capturing
		# label and causing it to call the getter before labelLayer exists.
		set: ( value ) -> @labelLayer.text = value if @labelLayer?

	@define "thirdLine",
		get: -> return @thirdLineLayer.text
		set: ( value ) -> @thirdLineLayer.text = value if @thirdLineLayer?

	@define "labelColor",
		get: -> return @labelLayer.color
		set: ( value ) -> @labelLayer.color = value if @labelLayer?

	delete @__instancing
	# print "end definitions"