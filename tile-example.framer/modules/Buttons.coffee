{ Navigables } = require "Navigables"
strUtils = require "strUtils"

class exports.Buttons extends Navigables
	constructor: ( options ={} ) ->
		_.defaults options,
			height: 46
			borderRadius: 3
			buttonWidth: 200
			gaps: 14
			items: ["Button 1", "Button 2", "Button 3"]
		super options
		
		_.assign @,
			buttonWidth: options.buttonWidth
			gaps: options.gaps
			backgroundColor: ""

		for buttonText, i in options.items
			@buttonBorder = new Layer
				borderColor: "#9CAABC"
				backgroundColor: ""
				height: 46
				borderRadius: 3
				borderWidth: 1
				width: @buttonWidth
				x: (@buttonWidth+@gaps)*i
				parent: @

			buttonText = new TextLayer
				parent: @buttonBorder
				text: buttonText
				color: strUtils.white
				fontFamily: "Avenir-light"
				fontSize: 20
				letterSpacing: 0.3
				y: Align.center(2)
				x: Align.center()

		@highlightLayer = new Layer
			backgroundColor: ""
		@lastHighlight = 0
	
	highlight: ( newIndex ) ->
		@children[ newIndex ].backgroundColor = strUtils.darkBlue
		@lastHighlight = newIndex
	removeHighlight: () ->
		@children[ @lastHighlight ].backgroundColor = ""
	moveRight: () =>
		if @lastHighlight < @children.length-1
			@.removeHighlight()
			@.highlight(@lastHighlight+1)
		else @emit("rightOut")
	moveLeft: () =>
		if @lastHighlight > 0
			@.removeHighlight()
			@.highlight(@lastHighlight-1)
		else @emit("leftOut")