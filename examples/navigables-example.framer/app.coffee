TVKit = require "TVKit"

tvUtils.bigBuck()

background = new Layer
	size: Screen
	backgroundColor: 'rgba(0,0,0,0.8)'

# Navigables is just a layer but it comes with a bunch of navigation logic which is shown later.
square = new Navigables
	backgroundColor: "blue"
	x: Align.center
	y: 10

# Carousels are Navigables by default
discoverTiles = new Carousel
	y: 300
	x: 64
	numberOfTiles: 50

linearTiles = new Carousel
	y: 500
	x: 64
	numberOfTiles: 50

# Every Navigables instance needs a .highlight() function and a .removeHighlight() function to change the layer when it is highlighted. These highlight events can also affect other layers.
square.highlight = ->
	currentHighlightIndex = discoverTiles.lastHighlight
	square.borderColor = "red"
	square.borderWidth = 4
	square.animate
		y: 50, x: Align.center()
	discoverTiles.children[currentHighlightIndex].animate
		y: -200

square.removeHighlight = ->
	currentHighlightIndex = discoverTiles.lastHighlight
	square.borderWidth = 0
	square.animate
		y: 10, x: Align.center()
	discoverTiles.children[currentHighlightIndex].animate
		y: 0
 
# When called with highlightCarousel(), this function will highlight the first carousel
highlightCarousel = ->
# This stops the highlight from changing while animating
	hi.setContext( discoverTiles )
 
# When called with highlightLinearCarousel(), this function will highlight the second carousel
highlightLinearCarousel = ->
	hi.setContext( linearTiles )

# This function tells the Highlight Object which layer to attach itself to.
highlightSquare = ->
	hi.setContext( square )

# These are Navigables functions that define what happens when you break out of a UI component using keyboard navigation. We are passing functions into them without a () so that they aren't executed immediately. e.g. squ.onDownOut( highlightCarousel ) – instead of – squ.onDownOut( highlightCarousel() )
square.onDownOut( highlightCarousel )
discoverTiles.onUpOut( highlightSquare )
discoverTiles.onDownOut( highlightLinearCarousel )
linearTiles.onUpOut( highlightCarousel )

# # The highlight must always be defined after the rest of the navigation logic.
hi = new Highlight