# Add the following line to your project in Framer Studio.
# TVKit = require "TVKit"

require "moreutils"

Framer.Defaults.Animation =
    time: 0.3

Canvas.backgroundColor = '#1f1f1f'

strUtils = require "strUtils"
window.strUtils = strUtils

{ ProgrammeTile } = require "ProgrammeTile"
{ Navigables } = require "Navigables"
{ Menu } = require "Menu"
{ Carousel } = require "Carousel"
{ Grid } = require "Grid"
{ Highlight } = require "Highlight"
{ Buttons } = require "Buttons"

window.ProgrammeTile = ProgrammeTile
window.Menu = Menu
window.Carousel = Carousel
window.Grid = Grid
window.Highlight = Highlight
window.Buttons = Buttons
window.Navigables = Navigables