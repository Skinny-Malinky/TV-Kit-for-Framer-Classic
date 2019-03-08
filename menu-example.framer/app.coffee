TVKit = require "TVKit"

strUtils.bigBuck()

background = new Layer
	size: Screen
	backgroundColor: 'rgba(0,0,0,0.8)'

carousels = []

# Creating some carousels to fill out the Menu content
for i in [0...4]
	contentCarousel = new Carousel
		numberOfTiles: 10
		x: 64
		y: 512
	for child in contentCarousel.children
		child.image = Utils.randomImage()
	carousels.push(contentCarousel)

# Menu items and content are defined in arrays
myMenu = new Menu
	menuItems: ['Comedy', 'Entertainment', 'Romance', 'Keanu Reeves']
	content: [ carousels[0], carousels[1], carousels[2], carousels[3] ]
	x: 64
	y: 412

highlightCarousel = () ->
	# Menus have a highlightIndex property
	selectedIndex = myMenu.highlightIndex
	hi.setContext( carousels[selectedIndex] )

highlightMenu = () ->
	hi.setContext( myMenu )

myMenu.onDownOut( highlightCarousel )

for carousel in carousels
	carousel.onUpOut( highlightMenu )

# The highlight must always be defined after the rest of the navigation logic.
hi = new Highlight

# Sets the initial state
hi.setContext(myMenu)