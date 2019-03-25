TVKit = require "TVKit"

# Carousels are made up of programme tiles which can be seen in the tile-example.framer project

tvUtils.bigBuck()

background = new Layer
	size: Screen
	backgroundColor: 'rgba(0,0,0,0.8)'

discoverTiles = new Carousel
	y: 300
	x: 64
	numberOfTiles: 50

linearTiles = new Carousel
	y: 500
	x: 64
	numberOfTiles: 50
	tileHeight: 200

# Sets some Metadata for the tiles
for tile, i in linearTiles.children
	discoverTiles.children[i].image = Utils.randomImage()
	linearTiles.children[i].image = Utils.randomImage()
	discoverTiles.children[i].title = "Another Title"
	discoverTiles.children[i].thirdLine = "A Synopsis"
	discoverTiles.children[i].label = "Something else"
	discoverTiles.children[i].labelColor = "red"

# When called with highlightCarousel(), this function will highlight the first carousel
highlightCarousel = ->
# hi is defined later in the document. Highlight.setContext( layer ) calls layer.highlight() which is defined in the module
	hi.setContext( discoverTiles )
 
# When called with highlightLinearCarousel(), this function will highlight the second carousel
highlightLinearCarousel = ->
	hi.setContext( linearTiles )

# These are Navigables functions that define what happens when you break out of a UI component using keyboard navigation. We are passing functions into them without a () so that they aren't executed immediately. e.g. squ.onDownOut( highlightCarousel ) – instead of – squ.onDownOut( highlightCarousel() )
discoverTiles.onDownOut( highlightLinearCarousel )
linearTiles.onUpOut( highlightCarousel )

# The highlight must always be defined after the rest of the navigation logic.
hi = new Highlight