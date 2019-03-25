
# ========================
# List of desired helpers
# ========================
# * 

# Colours
exports.blue = "#1D5AD0"
exports.darkBlue = "#0F5391"
exports.white = "#fff"
exports.darkGrey = "#3A3A3A"

exports.liveFeed = ( id ) ->
	channel = ["http://a.files.bbci.co.uk/media/live/manifesto/audio_video/simulcast/hls/uk/abr_hdtv/ak/bbc_one_hd.m3u8","http://a.files.bbci.co.uk/media/live/manifesto/audio_video/simulcast/hls/uk/abr_hdtv/ak/bbc_two_hd.m3u8","http://a.files.bbci.co.uk/media/live/manifesto/audio_video/simulcast/hls/uk/abr_hdtv/ak/bbc_four_hd.m3u8","http://a.files.bbci.co.uk/media/live/manifesto/audio_video/simulcast/hls/uk/abr_hdtv/ak/cbeebies_hd.m3u8","http://a.files.bbci.co.uk/media/live/manifesto/audio_video/simulcast/hls/uk/abr_hdtv/ak/bbc_news_channel_hd.m3u8", "http://a.files.bbci.co.uk/media/live/manifesto/audio_video/simulcast/hls/uk/abr_hdtv/ak/bbc_one_scotland_hd.m3u8"]
	if id == undefined then id = 0
	window["liveFeed"] = new VideoLayer
		name: "liveFeed"
		video: if typeof id == 'number' then channel[id] else id
		backgroundColor: ""
		size: Screen.size
	liveFeed.player.play()
	liveFeed.player.volume = 0

exports.bigBuck = ->
	window["bigBuck"] = new VideoLayer
		video: "http://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/index_3_av.m3u8"
		size: Screen.size
		backgroundColor: ""
	bigBuck.player.play()
	bigBuck.player.volume = 0


# Framer truncates on words by default. This forces Framer to truncate individual characters.
# You can pass an individual layer or an array of layers.
exports.breakLetter = ( layer ) ->
	if layer instanceof Object
		for child, i in layer
			child.style = 
				"word-break" : "break-all"
	else
		layer.style = 
			"word-break" : "break-all"

exports.htmlEntities = (str) ->
	return str.replace("&amp;", '&').replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"').replace("&apos;", "'").replace("&cent;", "¢").replace("&pound;", "£").replace("&yen;", "¥").replace("&euro;", "€").replace("copyright", "©").replace("&reg;", "®")

exports.findIndex = (layer) ->
	for child, i in layer.parent.children
		if layer == child
			return i

exports.hRule = (pixelNum, color, opac) ->
	new Layer
		name: "."
		y: pixelNum
		width: Screen.width
		height: 1
		backgroundColor: if color? then color else "red"
		opacity: if opac? then opac else 0.5

exports.vRule = (pixelNum, color, opac) ->
	new Layer
		name: "."
		x: pixelNum
		width: 1
		height: Screen.height
		backgroundColor: if color? then color else "red"
		opacity: if opac? then opac else 0.5

exports.hGrid = (xGap, color, opac) ->
	numberOfLines = Screen.height / xGap
	for i in [0..numberOfLines]
		@.hRule(i*xGap, color, opac)

exports.vGrid = (yGap, color, opac) ->
	numberOfLines = Screen.width / yGap
	for i in [0..numberOfLines]
		@.vRule(i*yGap, color, opac)

exports.convertToMins = ( secs ) ->
	return secs*60