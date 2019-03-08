class exports.Navigables extends Layer
    constructor: ( options={} ) ->
        @__construction = true
        _.assign options,
            active: false
            lastHighlight: undefined
            highlightLayer: undefined
        super options

        _.assign @,
            outLeft: undefined
		
        if window["navigablesArray"]? == false
            window["navigablesArray"] = []
        navigablesArray.push(@)

        @upOutBehaviour = ""
        @downOutBehaviour = ""
        @leftOutBehaviour = ""
        @rightOutBehaviour = ""

        @on "upOut", () ->
            @upOutBehaviour() if @upOutBehaviour != ""
        @on "rightOut", () ->
            @rightOutBehaviour() if @rightOutBehaviour != ""
        @on "downOut", () ->
            @downOutBehaviour() if @downOutBehaviour != ""
        @on "leftOut", () ->
            @leftOutBehaviour() if @leftOutBehaviour != ""
    
    _assignHighlight: ( layer ) ->
        @highlightLayer = layer

    onUpOut: ( behaviour ) ->
        @upOutBehaviour = behaviour
    onRightOut: ( behaviour ) ->
        @rightOutBehaviour = behaviour
    onDownOut: ( behaviour ) ->
        @downOutBehaviour = behaviour
    onLeftOut: ( behaviour ) ->
        @leftOutBehaviour = behaviour


    @define "highlight",
        get: -> return @_highlight
        set: ( value ) ->
            @_highlight = value
    
    @define "upOut",
        get: -> return @_outUp
        set: ( value ) ->
            return if @__construction
            newBehaviour = value
            @upOutBehaviour = value
    @define "rightOut",
        get: -> return @_outright
        set: ( value ) ->
            return if @__construction
            newBehaviour = value
            @rightOutBehaviour = value
    @define "downOut",
        get: -> return @_outDown
        set: ( value ) ->
            return if @__construction
            newBehaviour = value
            @downOutBehaviour = value
    @define "leftOut",
        get: -> return @_outleft
        set: ( value ) ->
            return if @__construction
            newBehaviour = value
            @leftOutBehaviour = value