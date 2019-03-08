strUtils = require "strUtils"
k = require "Keyboard"
class exports.Highlight extends Layer
    constructor: ( options={} ) ->

        _.defaults @,
            firstHighlight: ""
        super options

        _.assign @,
            backgroundColor: ""
            init: false

        @currentContext = @firstHighlight
        if navigablesArray?
            if @currentContext == ""
                navigablesArray[0]
                @currentContext = navigablesArray[0]
            for nav in navigablesArray
                if nav instanceof Menu
                    nav.highlightLayer = nav._assignHighlight( @._createMenuHighlight( nav ) )
                else if nav instanceof Carousel or nav instanceof Grid
                    nav.highlightLayer = nav._assignHighlight( @._createTileHighlight() )
                else if nav instanceof Navigables
                    console.log("That's fine, this is a custom element and can make it's own highlight state.")
                else if nav.highlight?
                    nav.highlight(0)
                else throw "All Navigables must have a .highlight() function and a .removeHighlight() function."

        # Place in reset context method
        @.setContext( navigablesArray[0] );

    _createMenuHighlight: ( nav ) ->
        @menuHighlight = new Layer
            parent: @
            y: nav.highlightY
            x: nav.children[nav.highlightIndex].screenFrame.x
            height: 2
            width: nav.children[0].width+10
            backgroundColor: strUtils.blue
        menuHighlightGlow = new Layer
            parent: @menuHighlight
            height: 4
            x: -5
            y: -1
            blur: 7
            backgroundColor: strUtils.blue
            opacity: 0
        menuHighlightGlow.bringToFront()

        menuHighlightPulse = new Animation
            layer: menuHighlightGlow
            properties:
                opacity: 1
            time: 2
            curve: "ease-in-out"

        menuHighlightPulseFade = new Animation
            layer: menuHighlightGlow
            properties:
                opacity: 0
            time: 2
            curve: "ease-in-out"

        menuHighlightPulse.on(Events.AnimationEnd, menuHighlightPulseFade.start)
        menuHighlightPulseFade.on(Events.AnimationEnd, menuHighlightPulse.start)
        menuHighlightPulse.start()
        menuHighlightGlow.blur = 7

        return @menuHighlight

    _createTileHighlight: () ->
        @tileHighlight = new Layer
            parent: @
            width: 230
            height: 129
            borderWidth: 2
            borderColor: strUtils.blue
        @tileHighlight.style.background = ""

        tileGlow = @tileHighlight.copy()
        _.assign tileGlow,
            parent: @tileHighlight
            style: "background":""
            borderWidth: 5
            blur: 6
            opacity: 0

        @tileHighlightPulse = new Animation tileGlow,
            opacity: 1
            options:
                time: 3
                curve: 'ease-in-out'

        @tileHighlightPulseFade = @tileHighlightPulse.reverse()
        @tileHighlightPulse.options.delay = 1

        @tileHighlightPulse.on(Events.AnimationEnd, @tileHighlightPulseFade.start)
        @tileHighlightPulseFade.on(Events.AnimationEnd, @tileHighlightPulse.start)
        @tileHighlightPulse.start()

        return @tileHighlight

    setContext: ( newContext ) ->
        for nav in navigablesArray
            if nav != newContext
                nav.removeHighlight()
            else
                nav.highlight(nav.lastHighlight)
                @.currentContext = nav

        if newContext.moveUp? == false then newContext.moveUp = -> newContext.emit("upOut")
        if newContext.moveRight? == false then newContext.moveRight = -> newContext.emit("rightOut")
        if newContext.moveDown? == false then newContext.moveDown = -> newContext.emit("downOut")
        if newContext.moveLeft? == false then newContext.moveLeft = -> newContext.emit("leftOut")

        k.onKey( k.right, newContext.moveRight )
        k.onKey( k.left, newContext.moveLeft )
        k.onKey( k.up, newContext.moveUp )
        k.onKey( k.down, newContext.moveDown )

    removeHighlight: () ->
        for nav in navigablesArray
            nav.removeHighlight()
            nav.highlightLayer.visible = false if nav.highlightLayer?
            k.onKey( k.right, undefined )
            k.onKey( k.left, undefined )
            k.onKey( k.up, undefined )
            k.onKey( k.down, undefined )