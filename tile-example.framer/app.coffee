TVKit = require "TVKit"

strUtils.bigBuck()

background = new Layer
	size: Screen
	backgroundColor: 'rgba(0,0,0,0.8)'

programme = new ProgrammeTile
	image: Utils.randomImage()
	width: 290
	height: 330
	x: Align.right(-64)
	y: 20

tiles = []

for i in [0...20]
	# Setting properties for Programme Tiles
	tile = new ProgrammeTile
		x: 64
		y: (i * 164) + 20
		title: 'Rocky ' + (i + 1)
		label: 'Not another Rocky'
		labelColor: "green"
		image: Utils.randomImage()
		thirdLine: 'All about chasing chickens'
	
	tiles.push(tile)

tiles[1].highlight()