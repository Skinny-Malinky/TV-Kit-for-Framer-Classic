TVKit = require "TVKit"

tvUtils.bigBuck()

# This will act as the container for this screen
mainMenuScreen = new Layer
	size: Screen
	backgroundColor: ""

background = new Layer
	parent: mainMenuScreen
	height: 360, width: Screen.width
	backgroundColor: 'rgba(0,0,0,0.8)'
	y: Align.bottom

# Navigables is just a layer but it comes with a bunch of navigation logic which is shown later.
square = new Navigables
	parent: mainMenuScreen
	backgroundColor: "blue"
	x: Align.center
	y: 10

carousels = []

for i in [0..2]
	# Carousels are Navigables by default
	discoverTiles = new Carousel
		name: "."
		x: 64, y: 500
		numberOfTiles: 50
	for child, j in discoverTiles.children
		child.image = Utils.randomImage()
	# We'll push this to an array for later
	carousels.push(discoverTiles)

# This is our Menu.
menu = new Menu
	parent: mainMenuScreen
	x: 64, y: Align.center(150)
	items: [ 'Good TV Show', 'Some Films', 'Some Spooky Ghosts' ]
	content: [ carousels[0], carousels[1], carousels[2] ]
	# Content and items must be an Array

# Every Navigables instance needs a .highlight() function and a .removeHighlight() function to change the layer when it is highlighted. These highlight events can also affect other layers.
square.highlight = ->
	currentHighlightIndex = discoverTiles.lastHighlight
	square.borderColor = "red"
	square.borderWidth = 4
	square.image = 'https://media.giphy.com/media/fHlLIBKV2EsHSCKpeY/giphy.gif'
	# C/O http://jjjjjjjjjjohn.tumblr.com/

square.removeHighlight = ->
	currentHighlightIndex = discoverTiles.lastHighlight
	square.borderWidth = 0
	square.image = ""
	square.animate
		y: 10, x: Align.center()
	discoverTiles.children[currentHighlightIndex].animate
		y: 0

# This function tells the Highlight Object which layer to attach itself to.
highlightSquare = ->
	hi.setContext( square )

# These are Navigables functions that define what happens when you break out of a UI component using keyboard navigation. We are passing functions into them without a () so that they aren't executed immediately. e.g. squ.onDownOut( highlightCarousel ) – instead of – squ.onDownOut( highlightCarousel() )
menu.onUpOut( highlightSquare )

# You can also bypass using an explicitly declared function by using the `setContext` function which will call the `.highlight` function on any Navigables. Like this: –

square.onDownOut( -> hi.setContext(menu) )

for carousel, i in carousels
	carousel.onUpOut( -> hi.setContext( menu ) )

# I'm going to make the following better in the future because it bad
menu.onDownOut( -> hi.setContext( menu.content[menu.highlightIndex] ) )

# The highlight must always be defined after the rest of the navigation logic.
hi = new Highlight

hi.setContext( menu )