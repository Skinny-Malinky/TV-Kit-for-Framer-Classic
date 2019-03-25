require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Buttons":[function(require,module,exports){
var Navigables, tvUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Navigables = require("Navigables").Navigables;

tvUtils = require("tvUtils");

exports.Buttons = (function(superClass) {
  extend(Buttons, superClass);

  function Buttons(options) {
    var buttonText, i, j, len, ref;
    if (options == null) {
      options = {};
    }
    this.moveLeft = bind(this.moveLeft, this);
    this.moveRight = bind(this.moveRight, this);
    _.defaults(options, {
      height: 46,
      borderRadius: 3,
      buttonWidth: 200,
      gaps: 14,
      items: ["Button 1", "Button 2", "Button 3"]
    });
    Buttons.__super__.constructor.call(this, options);
    _.assign(this, {
      buttonWidth: options.buttonWidth,
      gaps: options.gaps,
      backgroundColor: ""
    });
    ref = options.items;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      buttonText = ref[i];
      this.buttonBorder = new Layer({
        borderColor: "#9CAABC",
        backgroundColor: "",
        height: 46,
        borderRadius: 3,
        borderWidth: 1,
        width: this.buttonWidth,
        x: (this.buttonWidth + this.gaps) * i,
        parent: this
      });
      buttonText = new TextLayer({
        parent: this.buttonBorder,
        text: buttonText,
        color: tvUtils.white,
        fontFamily: "Avenir-light",
        fontSize: 20,
        letterSpacing: 0.3,
        y: Align.center(2),
        x: Align.center()
      });
    }
    this.highlightLayer = new Layer({
      backgroundColor: ""
    });
    this.lastHighlight = 0;
  }

  Buttons.prototype.highlight = function(newIndex) {
    this.children[newIndex].backgroundColor = tvUtils.darkBlue;
    return this.lastHighlight = newIndex;
  };

  Buttons.prototype.removeHighlight = function() {
    return this.children[this.lastHighlight].backgroundColor = "";
  };

  Buttons.prototype.moveRight = function() {
    if (this.lastHighlight < this.children.length - 1) {
      this.removeHighlight();
      return this.highlight(this.lastHighlight + 1);
    } else {
      return this.emit("rightOut");
    }
  };

  Buttons.prototype.moveLeft = function() {
    if (this.lastHighlight > 0) {
      this.removeHighlight();
      return this.highlight(this.lastHighlight - 1);
    } else {
      return this.emit("leftOut");
    }
  };

  return Buttons;

})(Navigables);


},{"Navigables":"Navigables","tvUtils":"tvUtils"}],"Carousel":[function(require,module,exports){
var Navigables, ProgrammeTile,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ProgrammeTile = require("ProgrammeTile").ProgrammeTile;

Navigables = require("Navigables").Navigables;

exports.Carousel = (function(superClass) {
  extend(Carousel, superClass);

  function Carousel(options) {
    var i, j, ref;
    if (options == null) {
      options = {};
    }
    this.moveDown = bind(this.moveDown, this);
    this.moveUp = bind(this.moveUp, this);
    this.moveLeft = bind(this.moveLeft, this);
    this.moveRight = bind(this.moveRight, this);
    this.removeTiles = bind(this.removeTiles, this);
    this.addTile = bind(this.addTile, this);
    this._moveHighlight = bind(this._moveHighlight, this);
    this.__construction = true;
    this.__instancing = true;
    _.defaults(options, {
      tileWidth: 280,
      tileHeight: 157,
      height: options.tileHeight,
      gaps: 8,
      numberOfTiles: 5,
      tileLabel: 'On Now',
      backgroundColor: 'transparent',
      debug: false
    });
    Carousel.__super__.constructor.call(this, options);
    delete this.__construction;
    _.assign(this, {
      height: options.tileHeight,
      tileWidth: options.tileWidth,
      tileHeight: options.tileHeight,
      gaps: options.gaps,
      focusIndex: 0,
      carouselIndex: 0
    });
    this.debug = options.debug;
    this.firstPosition = options.x;
    this.fullTilesVisible = _.floor(Screen.width / (options.tileWidth + options.gaps));
    this.rightPageBoundary = this.fullTilesVisible - 1 - 1;
    this.leftPageBoundary = 1;
    this.gaps = options.gaps;
    this.lastHighlight = 0;
    this.events = [];
    for (i = j = 0, ref = options.numberOfTiles; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      this.addTile();
    }
    this._updateWidth();
    this._updateHeight(options.tileHeight);
    this.on("change:width", this._updateWidth);
    this.on("change:height", this._updateHeight);
  }

  Carousel.prototype._updateHeight = function(value) {
    var child, j, len, ref, results;
    this.height = value;
    ref = this.children;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      child = ref[j];
      results.push(child.height = value);
    }
    return results;
  };

  Carousel.prototype._updateWidth = function() {
    if (this != null) {
      return this.width = (this.tileWidth + this.gaps) * this.numberOfTiles;
    }
  };

  Carousel.prototype._setTileWidth = function(value) {
    var i, j, len, ref, results, tile;
    ref = this.children;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      tile = ref[i];
      tile.x = (value + this.gaps) * i;
      results.push(tile.width = value);
    }
    return results;
  };

  Carousel.prototype._applyToAllTiles = function(task, value) {
    var i, j, len, ref, results, tile;
    ref = this.children;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      tile = ref[i];
      if (value != null) {
        results.push(task(tile, value));
      } else {
        results.push(task(tile));
      }
    }
    return results;
  };

  Carousel.prototype._setNumberOfTiles = function(tilesNo) {
    var i, j, ref, results, tileDelta;
    tileDelta = -(this.numberOfTiles - tilesNo);
    if (tileDelta > 0) {
      results = [];
      for (i = j = 0, ref = tileDelta; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        results.push(this.addTile());
      }
      return results;
    } else if (tileDelta < 0) {
      return this.removeTiles(-tileDelta);
    }
  };

  Carousel.prototype._applyData = function(dataArray) {
    var i, j, len, ref, results, tile;
    if (this.debug === false) {
      ref = this.children;
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        tile = ref[i];
        if (dataArray[i] != null) {
          tile.title = tvUtils.htmlEntities(dataArray[i].title);
          tile.image = tvUtils.htmlEntities(dataArray[i].image);
          tile.label = tvUtils.htmlEntities(dataArray[i].label);
          results.push(tile.thirdLine = tvUtils.htmlEntities(dataArray[i].thirdLine));
        } else {
          results.push(void 0);
        }
      }
      return results;
    } else {

    }
  };

  Carousel.prototype._loadEvents = function(feed) {
    var event, i, j, len, ref, results;
    ref = feed.items;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      event = ref[i];
      event = {
        title: event.brandSummary != null ? event.brandSummary.title : event.title,
        image: tvUtils.findImageByID(event.id),
        thirdLine: event.seriesSummary != null ? event.seriesSummary.title + ", " + event.title : event.shortSynopsis,
        label: event.onDemandSummary != null ? tvUtils.entitlementFinder(event.onDemandSummary) : ""
      };
      results.push(this.events[i] = event);
    }
    return results;
  };

  Carousel.prototype._moveHighlight = function(childIndex) {
    var extra, xPos;
    if ((this.highlightLayer != null) === false) {
      return;
    }
    if (this.firstPosition != null) {
      extra = this.firstPosition;
    } else {
      extra = 0;
    }
    xPos = childIndex * (this.gaps + this.tileWidth) + extra;
    if (this.highlightLayer.screenFrame.y === this.screenFrame.y) {
      this.highlightLayer.animate({
        x: xPos
      });
    } else {
      this.highlightLayer.x = xPos;
      this.highlightLayer.y = this.screenFrame.y;
    }
    return this.focusIndex = childIndex;
  };

  Carousel.prototype._moveCarousel = function(tileIndex) {
    var carouselLeft;
    if ((this.highlightLayer != null) === false) {
      return;
    }
    if (typeof carouselLeft !== "undefined" && carouselLeft !== null) {
      carouselLeft.stop();
    }
    carouselLeft = new Animation(this, {
      x: -((this.tileWidth + this.gaps) * this.carouselIndex) + this.firstPosition
    });
    carouselLeft.start();
    return this.select(tileIndex).highlight();
  };

  Carousel.prototype.addTile = function(tile) {
    var i, j, lastTileIndex, len, ref, tiles, xPosition;
    lastTileIndex = this.children.length;
    xPosition = (this.tileWidth + this.gaps) * lastTileIndex;
    if (tile === void 0) {
      tile = new ProgrammeTile({
        parent: this,
        x: xPosition === void 0 ? 0 : xPosition,
        width: this.tileWidth,
        height: this.tileHeight,
        meta: this.meta,
        image: this.image,
        title: this.title,
        thirdLine: this.thirdLine,
        opacity: 0
      });
      ref = this.children;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        tiles = ref[i];
        tiles.disappear.stop();
        tiles.appear.start();
      }
      return tile.tileAnimation = tile.animate({
        opacity: 1
      });
    }
  };

  Carousel.prototype.removeTiles = function(numberOfTiles) {
    var i, j, lastTileIndex, ref, results;
    results = [];
    for (i = j = 0, ref = numberOfTiles; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      lastTileIndex = this.children.length - 1;
      this.children[lastTileIndex].opacity = 0;
      results.push(this.children[lastTileIndex].destroy());
    }
    return results;
  };

  Carousel.prototype.select = function(index) {
    return this.children[index];
  };

  Carousel.prototype.highlight = function(tileIndex) {
    var child, i, j, len, ref;
    if (this.highlightLayer != null) {
      this.select(tileIndex).highlight();
      this.highlightLayer.height = this.tileHeight;
      this.highlightLayer.width = this.tileWidth;
      ref = this.highlightLayer.children;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        child = ref[i];
        child.height = this.tileHeight;
        child.width = this.tileWidth;
      }
      this._moveHighlight(this.focusIndex);
      return this.highlightLayer.visible = true;
    }
  };

  Carousel.prototype.removeHighlight = function() {
    this.select(this.lastHighlight).removeHighlight();
    return this.highlightLayer.visible = false;
  };

  Carousel.prototype.moveRight = function() {
    var totalIndex;
    totalIndex = this.focusIndex + this.carouselIndex;
    if (this.focusIndex < this.rightPageBoundary || totalIndex === this.numberOfTiles - 2) {
      this.select(totalIndex).removeHighlight();
      this.focusIndex++;
      totalIndex = this.focusIndex + this.carouselIndex;
      this.highlight(totalIndex);
    } else if (this.focusIndex >= this.rightPageBoundary && totalIndex < this.numberOfTiles - 2) {
      this.select(totalIndex).removeHighlight();
      this.carouselIndex++;
      totalIndex = this.focusIndex + this.carouselIndex;
      this._moveCarousel(totalIndex);
    } else {
      this.emit("rightOut");
    }
    return this.lastHighlight = totalIndex;
  };

  Carousel.prototype.moveLeft = function() {
    var totalIndex;
    totalIndex = this.focusIndex + this.carouselIndex;
    if (this.focusIndex > this.leftPageBoundary || totalIndex === 1) {
      this.select(totalIndex).removeHighlight();
      this.focusIndex--;
      totalIndex = this.focusIndex + this.carouselIndex;
      this.highlight(totalIndex);
    } else if (this.focusIndex >= this.leftPageBoundary && totalIndex > 1) {
      this.select(totalIndex).removeHighlight();
      this.carouselIndex--;
      totalIndex = this.focusIndex + this.carouselIndex;
      this._moveCarousel(totalIndex);
    } else {
      this.emit("leftOut");
    }
    return this.lastHighlight = totalIndex;
  };

  Carousel.prototype.moveUp = function() {
    return this.emit("upOut");
  };

  Carousel.prototype.moveDown = function() {
    return this.emit("downOut");
  };

  Carousel.define('numberOfTiles', {
    get: function() {
      return this.children.length;
    },
    set: function(value) {
      if (this.__construction) {
        return;
      }
      return this._setNumberOfTiles(value);
    }
  });

  delete Carousel.__instancing;

  return Carousel;

})(Navigables);


},{"Navigables":"Navigables","ProgrammeTile":"ProgrammeTile"}],"Grid":[function(require,module,exports){
var Navigables, ProgrammeTile,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ProgrammeTile = require("ProgrammeTile").ProgrammeTile;

Navigables = require("Navigables").Navigables;

exports.Grid = (function(superClass) {
  extend(Grid, superClass);

  function Grid(options) {
    if (options == null) {
      options = {};
    }
    this.addTile = bind(this.addTile, this);
    this.__construction = true;
    this.__instancing = true;
    _.defaults(options, {
      tileWidth: 230,
      tileHeight: 129,
      gaps: 8,
      numberOfTiles: 30,
      tileLabel: 'On Now',
      columns: 4,
      debug: false
    });
    Grid.__super__.constructor.call(this, options);
    delete this.__construction;
    _.assign(this, {
      tileWidth: options.tileWidth,
      tileHeight: options.tileHeight,
      gaps: options.gaps,
      columns: options.columns,
      numberOfTiles: options.numberOfTiles
    });
    this.debug = options.debug;
    this.firstPosition = options.x;
    this.gaps = options.gaps;
    this.xPos = 1;
    this.yPos = 1;
    this.events = [];
  }

  Grid.prototype._setNumberOfTiles = function(tilesNo) {
    var i, j, ref, results, tileDelta;
    tileDelta = -(this.numberOfTiles - tilesNo);
    if (tileDelta > 0) {
      results = [];
      for (i = j = 0, ref = tileDelta; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        results.push(this.addTile());
      }
      return results;
    } else if (tileDelta < 0) {
      return this.removeTiles(-tileDelta);
    }
  };

  Grid.prototype._applyData = function(dataArray) {
    var i, j, len, ref, results, tile;
    if (this.debug === false) {
      ref = this.children;
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        tile = ref[i];
        if (dataArray[i] != null) {
          tile.title = tvUtils.htmlEntities(dataArray[i].title);
          tile.image = tvUtils.htmlEntities(dataArray[i].image);
          tile.label = tvUtils.htmlEntities(dataArray[i].label);
          results.push(tile.thirdLine = tvUtils.htmlEntities(dataArray[i].thirdLine));
        } else {
          results.push(void 0);
        }
      }
      return results;
    } else {

    }
  };

  Grid.prototype._loadEvents = function(feed) {
    var event, i, j, len, ref, results;
    ref = feed.items;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      event = ref[i];
      event = {
        title: event.brandSummary != null ? event.brandSummary.title : event.title,
        image: tvUtils.findImageByID(event.id),
        thirdLine: event.seriesSummary != null ? event.seriesSummary.title + ", " + event.title : event.shortSynopsis,
        label: event.onDemandSummary != null ? tvUtils.entitlementFinder(event.onDemandSummary) : ""
      };
      results.push(this.events[i] = event);
    }
    return results;
  };

  Grid.prototype.addTile = function(tile) {
    var fullTileWidth, i, j, lastTileIndex, len, ref, rowNo, tiles, xPosition, yPosition;
    console.log(this);
    lastTileIndex = this.children.length;
    rowNo = Math.floor(lastTileIndex / this.columns);
    fullTileWidth = this.tileWidth + this.gaps;
    this.width = fullTileWidth * this.columns;
    xPosition = fullTileWidth * lastTileIndex - this.width * rowNo;
    yPosition = rowNo * (this.tileHeight + this.gaps);
    if (tile === void 0) {
      tile = new ProgrammeTile({
        parent: this,
        width: this.tileWidth,
        height: this.tileHeight,
        meta: this.meta,
        image: this.image,
        title: this.title,
        thirdLine: this.thirdLine,
        opacity: 0
      });
      tile.x = xPosition;
      tile.y = yPosition;
      ref = this.children;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        tiles = ref[i];
        tiles.disappear.stop();
        tiles.appear.start();
      }
      return tile.tileAnimation = tile.animate({
        opacity: 1
      });
    }
  };

  Grid.prototype.highlight = function(xPos, yPos) {
    return console.log("highlight " + xPos + " | " + yPos);
  };

  Grid.prototype.removeHighlight = function() {
    return console.log("remove highlight");
  };

  Grid.define('numberOfTiles', {
    get: function() {
      return this.children.length;
    },
    set: function(value) {
      if (this.__construction) {
        return;
      }
      return this._setNumberOfTiles(value);
    }
  });

  delete Grid.__instancing;

  return Grid;

})(Navigables);


},{"Navigables":"Navigables","ProgrammeTile":"ProgrammeTile"}],"Highlight":[function(require,module,exports){
var k, tvUtils,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

tvUtils = require("tvUtils");

k = require("Keyboard");

exports.Highlight = (function(superClass) {
  extend(Highlight, superClass);

  function Highlight(options) {
    var i, len, nav;
    if (options == null) {
      options = {};
    }
    _.defaults(this, {
      firstHighlight: ""
    });
    Highlight.__super__.constructor.call(this, options);
    _.assign(this, {
      backgroundColor: "",
      init: false
    });
    this.currentContext = this.firstHighlight;
    if (typeof navigablesArray !== "undefined" && navigablesArray !== null) {
      if (this.currentContext === "") {
        navigablesArray[0];
        this.currentContext = navigablesArray[0];
      }
      for (i = 0, len = navigablesArray.length; i < len; i++) {
        nav = navigablesArray[i];
        if (nav instanceof Menu) {
          nav.highlightLayer = nav._assignHighlight(this._createMenuHighlight(nav));
        } else if (nav instanceof Carousel || nav instanceof Grid) {
          nav.highlightLayer = nav._assignHighlight(this._createTileHighlight());
        } else if (nav instanceof Navigables) {
          console.log("That's fine, this is a custom element and can make it's own highlight state.");
        } else if (nav.highlight != null) {
          nav.highlight(0);
        } else {
          throw "All Navigables must have a .highlight() function and a .removeHighlight() function.";
        }
      }
    }
    this.setContext(navigablesArray[0]);
  }

  Highlight.prototype._createMenuHighlight = function(nav) {
    var menuHighlightGlow, menuHighlightPulse, menuHighlightPulseFade;
    this.menuHighlight = new Layer({
      parent: this,
      y: nav.highlightY,
      x: nav.children[nav.highlightIndex].screenFrame.x,
      height: 2,
      width: nav.children[0].width + 10,
      backgroundColor: tvUtils.blue
    });
    menuHighlightGlow = new Layer({
      parent: this.menuHighlight,
      height: 4,
      x: -5,
      y: -1,
      blur: 7,
      backgroundColor: tvUtils.blue,
      opacity: 0
    });
    menuHighlightGlow.bringToFront();
    menuHighlightPulse = new Animation({
      layer: menuHighlightGlow,
      properties: {
        opacity: 1
      },
      time: 2,
      curve: "ease-in-out"
    });
    menuHighlightPulseFade = new Animation({
      layer: menuHighlightGlow,
      properties: {
        opacity: 0
      },
      time: 2,
      curve: "ease-in-out"
    });
    menuHighlightPulse.on(Events.AnimationEnd, menuHighlightPulseFade.start);
    menuHighlightPulseFade.on(Events.AnimationEnd, menuHighlightPulse.start);
    menuHighlightPulse.start();
    menuHighlightGlow.blur = 7;
    return this.menuHighlight;
  };

  Highlight.prototype._createTileHighlight = function() {
    var tileGlow;
    this.tileHighlight = new Layer({
      parent: this,
      width: 230,
      height: 129,
      borderWidth: 2,
      borderColor: tvUtils.blue
    });
    this.tileHighlight.style.background = "";
    tileGlow = this.tileHighlight.copy();
    _.assign(tileGlow, {
      parent: this.tileHighlight,
      style: {
        "background": ""
      },
      borderWidth: 5,
      blur: 6,
      opacity: 0
    });
    this.tileHighlightPulse = new Animation(tileGlow, {
      opacity: 1,
      options: {
        time: 3,
        curve: 'ease-in-out'
      }
    });
    this.tileHighlightPulseFade = this.tileHighlightPulse.reverse();
    this.tileHighlightPulse.options.delay = 1;
    this.tileHighlightPulse.on(Events.AnimationEnd, this.tileHighlightPulseFade.start);
    this.tileHighlightPulseFade.on(Events.AnimationEnd, this.tileHighlightPulse.start);
    this.tileHighlightPulse.start();
    return this.tileHighlight;
  };

  Highlight.prototype.setContext = function(newContext) {
    var i, len, nav;
    for (i = 0, len = navigablesArray.length; i < len; i++) {
      nav = navigablesArray[i];
      if (nav !== newContext) {
        nav.removeHighlight();
      } else {
        nav.highlight(nav.lastHighlight);
        this.currentContext = nav;
      }
    }
    if ((newContext.moveUp != null) === false) {
      newContext.moveUp = function() {
        return newContext.emit("upOut");
      };
    }
    if ((newContext.moveRight != null) === false) {
      newContext.moveRight = function() {
        return newContext.emit("rightOut");
      };
    }
    if ((newContext.moveDown != null) === false) {
      newContext.moveDown = function() {
        return newContext.emit("downOut");
      };
    }
    if ((newContext.moveLeft != null) === false) {
      newContext.moveLeft = function() {
        return newContext.emit("leftOut");
      };
    }
    k.onKey(k.right, newContext.moveRight);
    k.onKey(k.left, newContext.moveLeft);
    k.onKey(k.up, newContext.moveUp);
    return k.onKey(k.down, newContext.moveDown);
  };

  Highlight.prototype.removeHighlight = function() {
    var i, len, nav, results;
    results = [];
    for (i = 0, len = navigablesArray.length; i < len; i++) {
      nav = navigablesArray[i];
      nav.removeHighlight();
      if (nav.highlightLayer != null) {
        nav.highlightLayer.visible = false;
      }
      k.onKey(k.right, void 0);
      k.onKey(k.left, void 0);
      k.onKey(k.up, void 0);
      results.push(k.onKey(k.down, void 0));
    }
    return results;
  };

  return Highlight;

})(Layer);


},{"Keyboard":"Keyboard","tvUtils":"tvUtils"}],"Keyboard":[function(require,module,exports){
var keyMap;

exports.backspace = 8;

exports.tab = 9;

exports.enter = 13;

exports.shift = 16;

exports.ctrl = 17;

exports.alt = 18;

exports.caps = 20;

exports.escape = 27;

exports.pageUp = 33;

exports.pageDown = 34;

exports.left = 37;

exports.up = 38;

exports.right = 39;

exports.down = 40;

exports["delete"] = 46;

exports.zero = 48;

exports.one = 49;

exports.two = 50;

exports.three = 51;

exports.four = 52;

exports.five = 53;

exports.six = 54;

exports.seven = 55;

exports.eight = 56;

exports.nine = 57;

exports.a = 65;

exports.b = 66;

exports.c = 67;

exports.d = 68;

exports.e = 69;

exports.f = 70;

exports.g = 71;

exports.h = 72;

exports.i = 73;

exports.j = 74;

exports.k = 75;

exports.l = 76;

exports.m = 77;

exports.n = 78;

exports.o = 79;

exports.p = 80;

exports.q = 81;

exports.r = 82;

exports.s = 83;

exports.t = 84;

exports.u = 85;

exports.v = 86;

exports.w = 87;

exports.x = 88;

exports.y = 89;

exports.z = 90;

exports.numZero = 96;

exports.numOne = 97;

exports.numTwo = 98;

exports.numThree = 99;

exports.numFour = 100;

exports.numFive = 101;

exports.numSix = 102;

exports.numSeven = 103;

exports.numEight = 104;

exports.numNine = 105;

exports.fOne = 112;

exports.fTwo = 113;

exports.fThree = 114;

exports.fFour = 115;

exports.fFive = 116;

exports.fSix = 117;

exports.fSeven = 118;

exports.fEight = 119;

exports.fNine = 120;

exports.fTen = 121;

exports.semiColon = 186;

exports.equalSign = 187;

exports.comma = 188;

exports.dash = 189;

exports.period = 190;

exports.forwardSlash = 191;

exports.openBracket = 219;

exports.backSlash = 220;

exports.closeBracket = 221;

exports.singleQuote = 222;

keyMap = {};

exports.onKey = function(key, handler, throttleTime) {
  if (handler !== void 0) {
    return keyMap[key] = Utils.throttle(throttleTime, handler);
  } else {
    return keyMap[key] = "";
  }
};

exports.offKey = function(key) {
  return delete keyMap[key];
};

window.addEventListener('keydown', function(event) {
  var handler;
  event.preventDefault();
  handler = keyMap[event.keyCode];
  if (handler) {
    return handler();
  }
});


},{}],"Menu":[function(require,module,exports){
var Navigables, tvUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

tvUtils = require("tvUtils");

Navigables = require("Navigables").Navigables;

exports.Menu = (function(superClass) {
  var layerOne, layerThree, layerTwo;

  extend(Menu, superClass);

  function Menu(options) {
    var i, j, len, menuLayer, menuNames, names;
    if (options == null) {
      options = {};
    }
    this.moveDown = bind(this.moveDown, this);
    this.moveUp = bind(this.moveUp, this);
    this.moveLeft = bind(this.moveLeft, this);
    this.moveRight = bind(this.moveRight, this);
    this.__construction = true;
    this.__instancing = true;
    _.defaults(options, {
      menuItems: ['Menu One', 'Menu Two', 'Menu Three'],
      content: [layerOne, layerTwo, layerThree],
      backgroundColor: ''
    });
    Menu.__super__.constructor.call(this, options);
    delete this.__construction;
    menuNames = options.menuItems;
    for (i = j = 0, len = menuNames.length; j < len; i = ++j) {
      names = menuNames[i];
      if (names instanceof Layer) {
        menuLayer = names;
        menuLayer.y = 6;
        menuLayer.x = -2;
      } else {
        menuLayer = new TextLayer;
        this.highlightY = this.screenFrame.y + menuLayer.height - 5;
      }
      _.assign(menuLayer, {
        parent: this,
        text: names,
        color: "#ebebeb",
        fontFamily: "Avenir-light",
        fontSize: 30,
        letterSpacing: 0.3,
        backgroundColor: "",
        x: this.children[i - 1] != null ? this.children[i - 1].maxX + 39 : 0,
        custom: {
          menuContent: options.content[i]
        }
      });
      options.menuItems[i] = menuLayer;
      this.highlightIndex = 0;
    }
  }

  Menu.define('menuItems', {
    get: function() {
      return this.children;
    },
    set: function(value) {
      if (this.__construction) {
        return;
      }
      return this.menuItems = value;
    }
  });

  Menu.define('content', {
    get: function() {
      return this._getContent();
    },
    set: function(value) {
      if (this.__construction != null) {
        return this._setContent(value);
      }
    }
  });

  layerOne = new TextLayer({
    name: ".",
    y: 100,
    visible: false,
    backgroundColor: "red",
    text: "Define with an array in Menu.custom.content",
    color: "white"
  });

  layerTwo = new TextLayer({
    name: ".",
    y: 100,
    visible: false,
    backgroundColor: "blue",
    text: "Define with an array in Menu.custom.content",
    color: "white"
  });

  layerThree = new TextLayer({
    name: ".",
    y: 100,
    visible: false,
    backgroundColor: "green",
    text: "Define with an array in Menu.custom.content",
    color: "white"
  });

  Menu.prototype._getContent = function() {
    var _content, child, j, len, ref;
    _content = [];
    ref = this.children;
    for (j = 0, len = ref.length; j < len; j++) {
      child = ref[j];
      _content.push(child.custom.menuContent);
    }
    return _content;
  };

  Menu.prototype._setContent = function(value) {
    var child, i, j, len, ref, results;
    ref = this.children;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      child = ref[i];
      child.custom.menuContent.destroy();
      results.push(child.custom.menuContent = value[i]);
    }
    return results;
  };

  Menu.prototype._moveHighlight = function() {
    return this.highlightLayer.currentContext = this;
  };

  Menu.prototype._setIndex = function(highlightedMenuIndex) {
    if (highlightedMenuIndex === void 0) {
      highlightedMenuIndex = 0;
    }
    return highlightedMenuIndex;
  };

  Menu.prototype.removeHighlight = function() {
    var child, i, j, k, len, len1, ref, ref1;
    ref = this.children;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      child = ref[i];
      if (i === this.highlightIndex) {
        child.animate({
          color: tvUtils.white
        });
      } else {
        child.animate({
          color: tvUtils.darkGrey
        });
      }
    }
    this.highlightLayer.animate({
      backgroundColor: tvUtils.white
    });
    ref1 = this.highlightLayer.children;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      child = ref1[k];
      child.visible = false;
    }
    return this.highlightLayer.visible = true;
  };

  Menu.prototype.highlight = function(highlightedMenuIndex) {
    var child, i, j, k, len, len1, ref, ref1;
    if (highlightedMenuIndex === void 0) {
      highlightedMenuIndex = 0;
    }
    if (this.children != null) {
      ref = this.children;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        child = ref[i];
        if (i === highlightedMenuIndex) {
          child.animate({
            color: tvUtils.blue
          });
          if (child.custom.menuContent != null) {
            child.custom.menuContent.visible = true;
          }
          if (this.highlightLayer != null) {
            _.assign(this.highlightLayer, {
              width: 0,
              y: this.highlightY,
              x: child.screenFrame.x + child.width / 2
            });
            this.highlightLayer.children[0].width = 0;
            this.highlightLayer.children[0].animate({
              width: child.width + 10
            });
            this.highlightLayer.animate({
              width: child.width,
              x: child.screenFrame.x
            });
          }
        } else {
          child.animate({
            color: tvUtils.white
          });
          if (child.custom.menuContent != null) {
            child.custom.menuContent.visible = false;
          }
        }
      }
      this.highlightLayer.animate({
        backgroundColor: tvUtils.blue
      });
      ref1 = this.highlightLayer.children;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        child = ref1[k];
        child.visible = true;
      }
      this.highlightIndex = highlightedMenuIndex;
      return this.lastHighlight = highlightedMenuIndex;
    }
  };

  Menu.prototype.moveRight = function() {
    if (this.highlightIndex + 1 < this.menuItems.length) {
      this.highlight(this.highlightIndex + 1);
    } else {
      this.emit("rightOut");
    }
    return this.lastHighlight = this.highlightIndex;
  };

  Menu.prototype.moveLeft = function() {
    if (this.highlightIndex > 0) {
      this.highlight(this.highlightIndex - 1);
    } else {
      this.emit("leftOut");
    }
    return this.lastHighlight = this.highlightIndex;
  };

  Menu.prototype.moveUp = function() {
    return this.emit("upOut");
  };

  Menu.prototype.moveDown = function() {
    return this.emit("downOut");
  };

  return Menu;

})(Navigables);


},{"Navigables":"Navigables","tvUtils":"tvUtils"}],"Navigables":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.Navigables = (function(superClass) {
  extend(Navigables, superClass);

  function Navigables(options) {
    if (options == null) {
      options = {};
    }
    this.__construction = true;
    _.assign(options, {
      active: false,
      lastHighlight: void 0,
      highlightLayer: void 0
    });
    Navigables.__super__.constructor.call(this, options);
    _.assign(this, {
      outLeft: void 0
    });
    if ((window["navigablesArray"] != null) === false) {
      window["navigablesArray"] = [];
    }
    navigablesArray.push(this);
    this.upOutBehaviour = "";
    this.downOutBehaviour = "";
    this.leftOutBehaviour = "";
    this.rightOutBehaviour = "";
    this.on("upOut", function() {
      if (this.upOutBehaviour !== "") {
        return this.upOutBehaviour();
      }
    });
    this.on("rightOut", function() {
      if (this.rightOutBehaviour !== "") {
        return this.rightOutBehaviour();
      }
    });
    this.on("downOut", function() {
      if (this.downOutBehaviour !== "") {
        return this.downOutBehaviour();
      }
    });
    this.on("leftOut", function() {
      if (this.leftOutBehaviour !== "") {
        return this.leftOutBehaviour();
      }
    });
  }

  Navigables.prototype._assignHighlight = function(layer) {
    return this.highlightLayer = layer;
  };

  Navigables.prototype.onUpOut = function(behaviour) {
    return this.upOutBehaviour = behaviour;
  };

  Navigables.prototype.onRightOut = function(behaviour) {
    return this.rightOutBehaviour = behaviour;
  };

  Navigables.prototype.onDownOut = function(behaviour) {
    return this.downOutBehaviour = behaviour;
  };

  Navigables.prototype.onLeftOut = function(behaviour) {
    return this.leftOutBehaviour = behaviour;
  };

  Navigables.define("highlight", {
    get: function() {
      return this._highlight;
    },
    set: function(value) {
      return this._highlight = value;
    }
  });

  Navigables.define("upOut", {
    get: function() {
      return this._outUp;
    },
    set: function(value) {
      var newBehaviour;
      if (this.__construction) {
        return;
      }
      newBehaviour = value;
      return this.upOutBehaviour = value;
    }
  });

  Navigables.define("rightOut", {
    get: function() {
      return this._outright;
    },
    set: function(value) {
      var newBehaviour;
      if (this.__construction) {
        return;
      }
      newBehaviour = value;
      return this.rightOutBehaviour = value;
    }
  });

  Navigables.define("downOut", {
    get: function() {
      return this._outDown;
    },
    set: function(value) {
      var newBehaviour;
      if (this.__construction) {
        return;
      }
      newBehaviour = value;
      return this.downOutBehaviour = value;
    }
  });

  Navigables.define("leftOut", {
    get: function() {
      return this._outleft;
    },
    set: function(value) {
      var newBehaviour;
      if (this.__construction) {
        return;
      }
      newBehaviour = value;
      return this.leftOutBehaviour = value;
    }
  });

  return Navigables;

})(Layer);


},{}],"ProgrammeTile":[function(require,module,exports){
var tvUtils,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

tvUtils = require("tvUtils");

exports.ProgrammeTile = (function(superClass) {
  extend(ProgrammeTile, superClass);

  function ProgrammeTile(options) {
    var labelText, textLayers;
    if (options == null) {
      options = {};
    }
    this.__construction = true;
    this.__instancing = true;
    _.defaults(options, {
      name: "Programme Tile",
      width: 280,
      height: 157,
      backgroundColor: "",
      title: "Midsomer Murders",
      label: "",
      synopsis: "Once upon a time a dragon entered a dance competition and he was rather good at it. He was a dancing dragon of great import.",
      labelColor: "#83858A",
      thirdLine: "Series 1, Episode 1",
      dog: "",
      recorded: false,
      watchlist: false,
      ghost: false,
      linear: false,
      onDemand: true,
      playable: false
    });
    labelText = options.label;
    options.label = void 0;
    ProgrammeTile.__super__.constructor.call(this, options);
    _.assign(this, {
      clip: true,
      height: options.height
    });
    if (this.onDemand === true || this.linear === true) {
      this.playable = true;
    }
    this.gradientLayer = new Layer({
      parent: this,
      name: 'gradient',
      width: options.width,
      height: this.height + 25,
      x: 0,
      y: 0,
      index: 0,
      backgroundColor: "",
      style: {
        "background-image": "linear-gradient(-180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.30) 35%, rgba(0,0,0,0.90) 60%)"
      }
    });
    this.textContainer = new Layer({
      parent: this,
      name: 'textContainer',
      backgroundColor: 'transparent',
      x: 10,
      y: options.height - 54,
      height: 70,
      index: 1
    });
    this.titleLayer = new TextLayer({
      parent: this.textContainer,
      name: 'titleLayer',
      text: options.title,
      fontFamily: 'Avenir',
      fontSize: 22,
      color: '#EBEBEB',
      y: 21,
      index: 1,
      height: 26,
      width: options.playable === false ? this.width - 20 : this.width - 40,
      x: options.playable === false ? 0 : 26,
      truncate: true
    });
    this.labelLayer = new TextLayer({
      parent: this.textContainer,
      name: 'labelLayer',
      text: labelText,
      fontFamily: 'Avenir-Black',
      fontSize: 16,
      textTransform: 'uppercase',
      color: options.labelColor,
      letterSpacing: 0.24,
      height: 18,
      width: this.width - 20,
      index: 1,
      truncate: true
    });
    this.thirdLineLayer = new TextLayer({
      parent: this,
      name: 'thirdLineLayer',
      fontFamily: 'Avenir-Black',
      fontSize: 16,
      textTransform: 'uppercase',
      color: '#B6B9BF',
      y: this.height,
      x: 10,
      index: 1,
      height: 18,
      width: this.width - 20,
      text: options.thirdLine,
      opacity: 0,
      truncate: true
    });
    this.dogImageLayer = new Layer({
      parent: this,
      name: 'dog',
      backgroundColor: '',
      y: 10,
      maxX: this.width - 10,
      height: 30,
      width: 100,
      html: "<img style = \"float:right;max-width:100%;max-height:100%;\" src = '" + options.dog + "'>",
      opacity: 0
    });
    this.appear = new Animation(this, {
      opacity: 1
    });
    this.disappear = new Animation(this, {
      opacity: 0
    });
    textLayers = [this.titleLayer, this.labelLayer, this.thirdLineLayer];
    tvUtils.breakLetter(textLayers);
    this.updateHighlightAnimations = function() {
      this._containerHighlight = new Animation(this.textContainer, {
        y: this.height - 74,
        options: {
          delay: 1,
          time: 0.5
        }
      });
      this._thirdLineHighlight = new Animation(this.thirdLineLayer, {
        y: this.height - 24,
        opacity: 1,
        options: {
          delay: 1,
          time: 0.4,
          curve: "ease-out"
        }
      });
      return this._gradientHighlight = new Animation(this.gradientLayer, {
        y: Align.bottom(),
        options: {
          delay: 1,
          time: 0.4
        }
      });
    };
    this.updateRemoveHighlightAnimations = function() {
      this._containerRemoveHighlight = new Animation(this.textContainer, {
        y: this.height - 54,
        options: {
          time: 0.5
        }
      });
      this._thirdLineRemoveHighlight = new Animation(this.thirdLineLayer, {
        y: this.height,
        opacity: 0,
        options: {
          time: 0.4,
          curve: "ease-out"
        }
      });
      return this._gradientRemoveHighlight = new Animation(this.gradientLayer, {
        maxY: this.maxY + 25,
        options: {
          time: 0.4
        }
      });
    };
    this.updateHighlightAnimations();
    this.updateRemoveHighlightAnimations();
    delete this.__construction;
  }

  ProgrammeTile.prototype.highlight = function() {
    this._containerRemoveHighlight.stop();
    this._thirdLineRemoveHighlight.stop();
    this._gradientRemoveHighlight.stop();
    this._containerHighlight.start();
    this._thirdLineHighlight.start();
    return this._gradientHighlight.start();
  };

  ProgrammeTile.prototype.removeHighlight = function() {
    this._containerHighlight.stop();
    this._thirdLineHighlight.stop();
    this._gradientHighlight.stop();
    this._containerRemoveHighlight.start();
    this._thirdLineRemoveHighlight.start();
    return this._gradientRemoveHighlight.start();
  };

  ProgrammeTile.prototype._updateHeight = function(value) {
    this.height = value;
    this.gradientLayer.maxY = value + 25;
    this.thirdLineLayer.y = this.height;
    return this.textContainer.y = this.height - 54;
  };

  ProgrammeTile.define("title", {
    get: function() {
      return this.titleLayer.text;
    },
    set: function(value) {
      if (this.titleLayer != null) {
        return this.titleLayer.text = value;
      }
    }
  });

  ProgrammeTile.define("label", {
    get: function() {
      if (this.labelLayer != null) {
        return this.labelLayer.text;
      }
    },
    set: function(value) {
      if (this.labelLayer != null) {
        return this.labelLayer.text = value;
      }
    }
  });

  ProgrammeTile.define("thirdLine", {
    get: function() {
      return this.thirdLineLayer.text;
    },
    set: function(value) {
      if (this.thirdLineLayer != null) {
        return this.thirdLineLayer.text = value;
      }
    }
  });

  ProgrammeTile.define("labelColor", {
    get: function() {
      return this.labelLayer.color;
    },
    set: function(value) {
      if (this.labelLayer != null) {
        return this.labelLayer.color = value;
      }
    }
  });

  delete ProgrammeTile.__instancing;

  return ProgrammeTile;

})(Layer);


},{"tvUtils":"tvUtils"}],"TVKit":[function(require,module,exports){
var Buttons, Carousel, Grid, Highlight, Menu, Navigables, ProgrammeTile, tvUtils;

require("moreutils");

Framer.Defaults.Animation = {
  time: 0.3
};

Canvas.backgroundColor = '#1f1f1f';

tvUtils = require("tvUtils");

window.tvUtils = tvUtils;

ProgrammeTile = require("ProgrammeTile").ProgrammeTile;

Navigables = require("Navigables").Navigables;

Menu = require("Menu").Menu;

Carousel = require("Carousel").Carousel;

Grid = require("Grid").Grid;

Highlight = require("Highlight").Highlight;

Buttons = require("Buttons").Buttons;

window.ProgrammeTile = ProgrammeTile;

window.Menu = Menu;

window.Carousel = Carousel;

window.Grid = Grid;

window.Highlight = Highlight;

window.Buttons = Buttons;

window.Navigables = Navigables;


},{"Buttons":"Buttons","Carousel":"Carousel","Grid":"Grid","Highlight":"Highlight","Menu":"Menu","Navigables":"Navigables","ProgrammeTile":"ProgrammeTile","moreutils":"moreutils","tvUtils":"tvUtils"}],"moreutils":[function(require,module,exports){

/*
Pin a layer to another layer. When the second layer moves, the first one will too.

@param {Layer} layer The layer to pin.
@param {Layer} target The layer to pin to. 
@param {...String} directions Which sides of the layer to pin to.

	Utils.pin(layerA, layerB, 'left')
 */
var StateManager, Timer, loremSource,
  slice = [].slice,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Utils.pin = function() {
  var direction, directions, k, layer, len, results, target;
  layer = arguments[0], target = arguments[1], directions = 3 <= arguments.length ? slice.call(arguments, 2) : [];
  if (directions.length > 2) {
    throw 'Utils.pin can only take two direction arguments (e.g. "left", "top"). Any more would conflict!';
  }
  results = [];
  for (k = 0, len = directions.length; k < len; k++) {
    direction = directions[k];
    results.push((function(layer, target, direction) {
      var distance, getDifference, lProp, len1, m, prop, props, results1, setPin;
      switch (direction) {
        case "left":
          props = ['x'];
          lProp = 'maxX';
          distance = target.x - layer.maxX;
          getDifference = function() {
            return target.x - distance;
          };
          break;
        case "right":
          props = ['x', 'width'];
          lProp = 'x';
          distance = layer.x - target.maxX;
          getDifference = function() {
            return target.maxX + distance;
          };
          break;
        case "top":
          props = ['y'];
          lProp = 'maxY';
          distance = target.y - layer.maxY;
          getDifference = function() {
            return target.y - distance;
          };
          break;
        case "bottom":
          props = ['y', 'height'];
          lProp = 'y';
          distance = layer.y - target.maxY;
          getDifference = function() {
            return target.maxY + distance;
          };
          break;
        default:
          throw 'Utils.pin - directions can only be top, right, bottom or left.';
      }
      results1 = [];
      for (m = 0, len1 = props.length; m < len1; m++) {
        prop = props[m];
        setPin = {
          targetLayer: target,
          direction: direction,
          event: "change:" + prop,
          func: function() {
            return layer[lProp] = getDifference();
          }
        };
        if (layer.pins == null) {
          layer.pins = [];
        }
        layer.pins.push(setPin);
        results1.push(target.on(setPin.event, setPin.func));
      }
      return results1;
    })(layer, target, direction));
  }
  return results;
};


/*
Remove all of a layer's pins, or pins from a certain target layer and/or direction.

@param {Layer} layer The layer to unpin.
@param {Layer} [target] The layer to unpin from. 
@param {...String} [directions] The directions to unpin.

	Utils.unpin(layerA)
 */

Utils.unpin = function(layer, target, direction) {
  var k, len, results, setPin, setPins;
  setPins = _.filter(layer.pins, function(p) {
    var isDirection, isLayer;
    isLayer = target != null ? p.target === target : true;
    isDirection = direction != null ? p.direction === direction : true;
    return isLayer && isDirection;
  });
  results = [];
  for (k = 0, len = setPins.length; k < len; k++) {
    setPin = setPins[k];
    results.push(setPin.target.off(setPin.event, setPin.func));
  }
  return results;
};


/*
Pin layer to another layer, based on the first layer's origin.

@param {Layer} layer The layer to pin.
@param {Layer} [target] The layer to pin to. 
@param {Boolean} [undo] Remove, rather than create, this pin. 

	Utils.pinOrigin(layerA, layerB)
 */

Utils.pinOrigin = function(layer, target, undo) {
  if (undo == null) {
    undo = false;
  }
  if (undo) {
    target.off("change:size", layer.setPosition);
    return;
  }
  layer.setPosition = function() {
    layer.x = (target.width - layer.width) * layer.originX;
    return layer.y = (target.height - layer.height) * layer.originY;
  };
  layer.setPosition();
  return target.on("change:size", layer.setPosition);
};


/*
Pin layer to another layer, based on the first layer's originX.

@param {Layer} layer The layer to pin.
@param {Layer} [target] The layer to pin to. 
@param {Boolean} [undo] Remove, rather than create, this pin. 

	Utils.pinOriginX(layerA, layerB)
 */

Utils.pinOriginX = function(layer, target, undo) {
  if (undo == null) {
    undo = false;
  }
  if (undo) {
    target.off("change:size", layer.setPosition);
    return;
  }
  layer.setPosition = function() {
    return layer.x = (target.width - layer.width) * layer.originX;
  };
  layer.setPosition();
  return target.on("change:size", layer.setPosition);
};


/*
Pin layer to another layer, based on the first layer's originY.

@param {Layer} layer The layer to pin.
@param {Layer} [target] The layer to pin to. 
@param {Boolean} [undo] Remove, rather than create, this pin. 

	Utils.pinOriginY(layerA, layerB)
 */

Utils.pinOriginY = function(layer, target, undo) {
  if (undo == null) {
    undo = false;
  }
  if (undo) {
    target.off("change:size", layer.setPosition);
    return;
  }
  layer.setPosition = function() {
    return layer.y = (target.height - layer.height) * layer.originY;
  };
  layer.setPosition();
  return target.on("change:size", layer.setPosition);
};


/*
Set a layer's contraints to its parent

@param {Layer} layer The layer to constrain.
@param {...String} options The constraint options to use.

Valid options are: 'left', 'top', 'right', 'bottom', 'height', 'width', and 'aspectRatio'.

	Utils.constrain(layer, 'left', 'top', 'apectRatio')
 */

Utils.constrain = function() {
  var k, layer, len, opt, options, opts, ref, ref1, ref2, ref3, ref4, ref5, values;
  layer = arguments[0], options = 2 <= arguments.length ? slice.call(arguments, 1) : [];
  if (layer.parent == null) {
    throw 'Utils.constrain requires a layer with a parent.';
  }
  opts = {
    left: false,
    top: false,
    right: false,
    bottom: false,
    height: false,
    width: false,
    aspectRatio: false
  };
  for (k = 0, len = options.length; k < len; k++) {
    opt = options[k];
    opts[opt] = true;
  }
  values = {
    left: opts.left ? layer.x : null,
    height: layer.height,
    centerAnchorX: layer.midX / ((ref = layer.parent) != null ? ref.width : void 0),
    width: layer.width,
    right: opts.right ? ((ref1 = layer.parent) != null ? ref1.width : void 0) - layer.maxX : null,
    top: opts.top ? layer.y : null,
    centerAnchorY: layer.midY / ((ref2 = layer.parent) != null ? ref2.height : void 0),
    bottom: opts.bottom ? ((ref3 = layer.parent) != null ? ref3.height : void 0) - layer.maxY : null,
    widthFactor: null,
    heightFactor: null,
    aspectRatioLocked: opts.aspectRatio
  };
  if (!(opts.top && opts.bottom)) {
    if (opts.height) {
      values.heightFactor = layer.height / ((ref4 = layer.parent) != null ? ref4.height : void 0);
    }
  }
  if (!(opts.left && opts.right)) {
    if (opts.width) {
      values.widthFactor = layer.width / ((ref5 = layer.parent) != null ? ref5.width : void 0);
    }
  }
  return layer.constraintValues = values;
};


/*
Immediately execute a function that is bound to the target.

@param {Object} object The object to bind the callback to.
@param {Function} callback The callback to run.

	Utils.bind(myLayer, -> this.name = "My Layer")
 */

Utils.bind = function(object, callback) {
  return _.bind(callback, object)();
};


/*
Alias for Utils.bind.
 */

Utils.build = function(object, callback) {
  return this.bind(object, callback);
};


/*
Define a property on a Layer that will emit a change event when that property changes. Also, optionally give the property an initial value and a callback to run when the property changes.

@param {Layer} layer The layer on which to define the property.
@param {String} property The name of the property.
@param {Object} [value] The initial value of the property.
@param {Function} [callback] The callback to run when this property changes. Executed with two arguments: the property's new value and the Layer itself.
@param {Function} [validation] A function to validate the property's new value.
@param {String} [error] An error to throw if the validation function returned false.

	Utils.define(myLayer, "toggled")
	Utils.define(myLayer, "toggled", false)
	Utils.define(myLayer, "toggled", false, myLayer.showToggled)
	Utils.define(myLayer, "toggled", false, null, _.isBoolean, "Layer.toggled must be true or false.")
 */

Utils.define = function(layer, property, value, callback, validation, error) {
  if (validation == null) {
    validation = function() {
      return true;
    };
  }
  if (error == null) {
    error = "Layer " + layer.id + "'s property '" + property + "' was given the wrong value type.";
  }
  Object.defineProperty(layer, property, {
    get: function() {
      return layer["_" + property];
    },
    set: function(value) {
      if (value != null) {
        if (!validation(value)) {
          throw error;
        }
        if (value === layer["_" + property]) {
          return;
        }
      }
      layer["_" + property] = value;
      return layer.emit("change:" + property, value, layer);
    },
    configurable: true
  });
  if ((callback != null) && typeof callback === 'function') {
    layer.on("change:" + property, callback);
  }
  return layer[property] = value;
};


/*
Set all layers in an array to the same property or properties.

@param {Array} layers The array of layers to align.
@param {Object} options The properties to set.
@param {Boolean} [minimum] Whether to use average values or minimum values for middle / center.
@param {Boolean} [animate] Whether to animate to the new property.
@param {Object} [animationOptions] The animation options to use.

	Utils.align [layerA, layerB],
		x: 200

	Utils.align [layerA, layerB],
		x: 200
		true
		time: .5
 */

Utils.align = function(layers, direction, minimum, animate, animationOptions) {
  var i, k, layer, len, maxX, maxY, minX, minY, options, results;
  if (layers == null) {
    layers = [];
  }
  if (minimum == null) {
    minimum = true;
  }
  if (animationOptions == null) {
    animationOptions = {};
  }
  minX = _.minBy(layers, 'x').x;
  maxX = _.maxBy(layers, 'maxX').maxX;
  minY = _.minBy(layers, 'y').y;
  maxY = _.maxBy(layers, 'maxY').maxY;
  options = (function() {
    switch (direction) {
      case "top":
        return {
          y: minY
        };
      case "middle":
        if (minimum) {
          return {
            midY: _.minBy(layers, 'y').midY
          };
        } else {
          return {
            midY: (maxY - minY) / 2 + minY
          };
        }
        break;
      case "bottom":
        return {
          maxY: maxY
        };
      case "left":
        return {
          x: minY
        };
      case "center":
        if (minimum) {
          return {
            midX: _.minBy(layers, 'x').midX
          };
        } else {
          return {
            midX: (maxX - minX) / 2 + minX
          };
        }
        break;
      case "right":
        return {
          maxX: maxX
        };
      default:
        return {};
    }
  })();
  results = [];
  for (i = k = 0, len = layers.length; k < len; i = ++k) {
    layer = layers[i];
    if (animate) {
      results.push(layer.animate(options, animationOptions));
    } else {
      results.push(_.assign(layer, options));
    }
  }
  return results;
};


/*
Distribute an array of layers between two values.

@param {Array} layers The array of layers to distribute.
@param {String} property The property to distribute.
@param {Object} [start] The value to start from. By default, the lowest value of the given property among the layers array.
@param {Object} [end] The value to distribute to. By default, the highest value of the given property among the layers array.
@param {Boolean} [animate] Whether to animate to the new property.
@param {Object} [animationOptions] The animation options to use.

	Utils.align [layerA, layerB], 'x'

	Utils.align [layerA, layerB], 'x', 32, 200

	Utils.align [layerA, layerB], 'x', 32, 200, true, {time: .5}

Also works with 'horizontal' and 'vertical', (alias to 'midX' and 'midY').

	Utils.align [layerA, layerB], 'horizontal'
 */

Utils.distribute = function(layers, property, start, end, animate, animationOptions) {
  var distance, i, k, layer, len, results, values;
  if (layers == null) {
    layers = [];
  }
  if (animate == null) {
    animate = false;
  }
  if (animationOptions == null) {
    animationOptions = {};
  }
  if (property === 'horizontal') {
    property = 'midX';
  }
  if (property === 'vertical') {
    property = 'midY';
  }
  layers = _.sortBy(layers, [property]);
  if (_.isUndefined(start) || typeof start === 'boolean') {
    animate = start != null ? start : false;
    animationOptions = end != null ? end : {};
    start = layers[0][property];
    end = _.last(layers)[property];
  }
  distance = (end - start) / (layers.length - 1);
  values = layers.map(function(layer, i) {
    var obj1;
    return (
      obj1 = {},
      obj1["" + property] = start + (distance * i),
      obj1
    );
  });
  results = [];
  for (i = k = 0, len = layers.length; k < len; i = ++k) {
    layer = layers[i];
    if (animate) {
      layer.animate(values[i], animationOptions);
      continue;
    }
    results.push(_.assign(layer, values[i]));
  }
  return results;
};


/*
Stack layers.

@param {Array} layers The array of layers to offset.
@param {Number} distance The distance between each layer.
@param {String} axis Whether to stack on the x or y axis.
@param {Boolean} [animate] Whether to animate layers to the new position.
@param {Object} [animationOptions] The animation options to use.
 */

Utils.stack = function(layers, distance, axis, animate, animationOptions) {
  if (layers == null) {
    layers = [];
  }
  if (distance == null) {
    distance = 0;
  }
  if (axis == null) {
    axis = "vertical";
  }
  if (animate == null) {
    animate = false;
  }
  if (animationOptions == null) {
    animationOptions = {};
  }
  if (layers.length <= 1) {
    return;
  }
  if (axis === "vertical" || axis === "y") {
    Utils.offsetY(layers, distance, animate, animationOptions);
  } else if (axis === "horizontal" || axis === "x") {
    Utils.offsetX(layers, distance, animate, animationOptions);
  }
  return layers;
};


/*
Offset an array of layers vertically.

@param {Array} layers The array of layers to offset.
@param {Number} distance The distance between each layer.
@param {Boolean} [animate] Whether to animate layers to the new position.
@param {Object} [animationOptions] The animation options to use.

	Utils.align [layerA, layerB],
		x: 200

	Utils.align [layerA, layerB],
		x: 200
		true
		time: .5
 */

Utils.offsetY = function(layers, distance, animate, animationOptions) {
  var i, k, layer, len, startY, values;
  if (layers == null) {
    layers = [];
  }
  if (distance == null) {
    distance = 0;
  }
  if (animate == null) {
    animate = false;
  }
  if (animationOptions == null) {
    animationOptions = {};
  }
  if (layers.length <= 1) {
    return;
  }
  startY = layers[0].y;
  values = [];
  values = layers.map(function(layer, i) {
    var v;
    v = {
      y: startY
    };
    startY += layer.height + distance;
    return v;
  });
  for (i = k = 0, len = layers.length; k < len; i = ++k) {
    layer = layers[i];
    if (animate) {
      layer.animate(values[i], animationOptions);
    } else {
      _.assign(layer, values[i]);
    }
  }
  return layers;
};


/*
Offset an array of layers horizontally.

@param {Array} array The array of layers to offset.
@param {Number} distance The distance between each layer.
@param {Boolean} [animate] Whether to animate layers to the new position.
@param {Object} [animationOptions] The animation options to use.

	Utils.align [layerA, layerB],
		x: 200

	Utils.align [layerA, layerB],
		x: 200
		true
		time: .5
 */

Utils.offsetX = function(layers, distance, animate, animationOptions) {
  var i, k, layer, len, startX, values;
  if (layers == null) {
    layers = [];
  }
  if (distance == null) {
    distance = 0;
  }
  if (animate == null) {
    animate = false;
  }
  if (animationOptions == null) {
    animationOptions = {};
  }
  if (layers.length <= 1) {
    return;
  }
  startX = layers[0].x;
  values = [];
  values = layers.map(function(layer, i) {
    var v;
    v = {
      x: startX
    };
    startX += layer.width + distance;
    return v;
  });
  for (i = k = 0, len = layers.length; k < len; i = ++k) {
    layer = layers[i];
    if (animate) {
      layer.animate(values[i], animationOptions);
    } else {
      _.assign(layer, values[i]);
    }
  }
  return layers;
};

Utils.Timer = Timer = (function() {
  function Timer(time, f) {
    this.restart = bind(this.restart, this);
    this.reset = bind(this.reset, this);
    this.resume = bind(this.resume, this);
    this.pause = bind(this.pause, this);
    this.start = bind(this.start, this);
    this.paused = false;
    this.saveTime = null;
    this.saveFunction = null;
    if ((time != null) && (f != null)) {
      this.start(time, f);
    }
  }

  Timer.prototype.start = function(time, f) {
    var proxy, timer;
    this.saveTime = time;
    this.saveFunction = f;
    f();
    proxy = (function(_this) {
      return function() {
        if (!_this.paused) {
          return f();
        }
      };
    })(this);
    if (!this.paused) {
      return this._id = timer = Utils.interval(time, proxy);
    } else {

    }
  };

  Timer.prototype.pause = function() {
    return this.paused = true;
  };

  Timer.prototype.resume = function() {
    return this.paused = false;
  };

  Timer.prototype.reset = function() {
    return clearInterval(this._id);
  };

  Timer.prototype.restart = function() {
    clearInterval(this._id);
    return Utils.delay(0, (function(_this) {
      return function() {
        return _this.start(_this.saveTime, _this.saveFunction);
      };
    })(this));
  };

  return Timer;

})();


/*
A class to manage states of multiple TextLayers, which "observe" the state. 
When the state changes, the StateManager will update all "observer" TextLayers,
applying the new state to each TextLayer's template property.

@param {Array} [layers] The layers to observe the state.
@param {Object} [state] The initial state.

	stateMgr = new Utils.StateManager, myLayers
		firstName: "David"
		lastName: "Attenborough"

	stateMgr.setState
		firstName: "Sir David"
 */

Utils.StateManager = StateManager = (function() {
  function StateManager(layers, state) {
    if (layers == null) {
      layers = [];
    }
    if (state == null) {
      state = {};
    }
    this._updateState = bind(this._updateState, this);
    this._state = state;
    this._observers = layers;
    Object.defineProperty(this, "observers", {
      get: function() {
        return this._observers;
      }
    });
    Object.defineProperty(this, "state", {
      get: function() {
        return this._state;
      },
      set: function(obj) {
        if (typeof obj !== "object") {
          throw "State must be an object.";
        }
        return this.setState(obj);
      }
    });
    this._updateState();
  }

  StateManager.prototype._updateState = function() {
    return this.observers.forEach((function(_this) {
      return function(layer) {
        return layer.template = _this.state;
      };
    })(this));
  };

  StateManager.prototype.addObserver = function(layer) {
    this._observers.push(layer);
    return layer.template = this.state;
  };

  StateManager.prototype.removeObserver = function(layer) {
    return _.pull(this._observers, layer);
  };

  StateManager.prototype.setState = function(options) {
    if (options == null) {
      options = {};
    }
    _.merge(this._state, options);
    this._updateState();
    return this._state;
  };

  return StateManager;

})();

Utils.grid = function(array, cols, rowMargin, colMargin) {
  var g, ref, ref1, ref2;
  if (array == null) {
    array = [];
  }
  if (cols == null) {
    cols = 4;
  }
  if (rowMargin == null) {
    rowMargin = 16;
  }
  g = {
    x: array[0].x,
    y: array[0].y,
    cols: cols,
    height: (ref = _.maxBy(array, 'height')) != null ? ref.height : void 0,
    width: (ref1 = _.maxBy(array, 'width')) != null ? ref1.width : void 0,
    rowMargin: rowMargin != null ? rowMargin : 0,
    columnMargin: (ref2 = colMargin != null ? colMargin : rowMargin) != null ? ref2 : 0,
    rows: [],
    columns: [],
    layers: [],
    apply: function(func) {
      var k, layer, len, ref3, results;
      ref3 = this.layers;
      results = [];
      for (k = 0, len = ref3.length; k < len; k++) {
        layer = ref3[k];
        results.push(Utils.build(layer, func));
      }
      return results;
    },
    getColumn: function(layer) {
      return this.columns.indexOf(_.find(this.columns, function(c) {
        return _.includes(c, layer);
      }));
    },
    getRow: function(layer) {
      return this.rows.indexOf(_.find(this.rows, function(r) {
        return _.includes(r, layer);
      }));
    },
    getLayer: function(row, col) {
      return this.rows[row][col];
    },
    getRandom: function() {
      return _.sample(_.sample(this.rows));
    },
    add: function(layer, i, animate) {
      if (i == null) {
        i = this.layers.length;
      }
      if (animate == null) {
        animate = false;
      }
      if (layer == null) {
        layer = this.layers[0].copySingle();
      }
      layer.parent = this.layers[0].parent;
      this.layers.splice(i, 0, layer);
      this._refresh(this.layers, animate);
      return layer;
    },
    remove: function(layer, animate) {
      this._refresh(_.without(this.layers, layer), animate);
      layer.destroy();
      return this;
    },
    _refresh: function(layers, animate) {
      this.rows = [];
      this.columns = [];
      this.layers = layers;
      return this._build(animate);
    },
    _build: function(animate) {
      var base, base1, col, i, k, layer, len, ref3, results, row;
      if (animate == null) {
        animate = false;
      }
      ref3 = this.layers;
      results = [];
      for (i = k = 0, len = ref3.length; k < len; i = ++k) {
        layer = ref3[i];
        col = i % cols;
        row = Math.floor(i / cols);
        if ((base = this.rows)[row] == null) {
          base[row] = [];
        }
        this.rows[row].push(layer);
        if ((base1 = this.columns)[col] == null) {
          base1[col] = [];
        }
        this.columns[col].push(layer);
        if (animate) {
          layer.animate({
            x: this.x + (col * (this.width + this.columnMargin)),
            y: this.y + (row * (this.height + this.rowMargin))
          });
          continue;
        }
        results.push(_.assign(layer, {
          x: this.x + (col * (this.width + this.columnMargin)),
          y: this.y + (row * (this.height + this.rowMargin))
        }));
      }
      return results;
    }
  };
  g._refresh(array);
  return g;
};

Utils.makeGrid = function(layer, cols, rows, rowMargin, colMargin) {
  var g, i, k, layers, len, ref;
  if (cols == null) {
    cols = 4;
  }
  if (rows == null) {
    rows = 1;
  }
  layers = [layer];
  ref = _.range((cols * rows) - 1);
  for (k = 0, len = ref.length; k < len; k++) {
    i = ref[k];
    layers[i + 1] = layer.copy();
    layers[i + 1].parent = layer.parent;
  }
  g = Utils.grid(layers, cols, rowMargin, colMargin);
  return g;
};


/*
Change a layer's size to fit around the layer's children.

@param {Layer} layer The parent layer to change.osition.
@param {Object} [padding] The padding to use for the hug.

	Utils.hug(layerA)

	Utils.hug(layerA, 32)

	Utils.hug(layerA, {top: 16, bottom: 24})
 */

Utils.hug = function(layer, padding) {
  var def, defStack;
  def = 0;
  defStack = void 0;
  if (typeof padding === "number") {
    def = padding;
    defStack = padding;
    padding = {};
  }
  _.defaults(padding, {
    top: def,
    bottom: def,
    left: def,
    right: def,
    stack: defStack
  });
  return Utils.bind(layer, function() {
    var child, i, k, len, ref, ref1;
    ref = this.children;
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      child = ref[i];
      child.y += this.padding.top;
      child.x += this.padding.left;
      if ((this.padding.right != null) > 0) {
        this.width = ((ref1 = _.maxBy(this.children, 'maxY')) != null ? ref1.maxY : void 0) + this.padding.right;
      }
    }
    if ((this.padding.stack != null) >= 0) {
      Utils.offsetY(this.children, this.padding.stack);
      Utils.delay(0, (function(_this) {
        return function() {
          return Utils.contain(_this, false, _this.padding.right, _this.padding.bottom);
        };
      })(this));
      return;
    }
    return Utils.contain(this, false, this.padding.right, this.padding.bottom);
  });
};


/*
Increase or decrease a layer's size to contain its layer's children.

@param {Layer} layer The parent layer to change size.
@param {Boolean} fit Whether to limit size change to increase only.
@param {Number} paddingX Extra space to add to the right side of the new size.
@param {Number} paddingY Extra space to add to the bottom of the new size.

	Utils.contain(layerA)
 */

Utils.contain = function(layer, fit, paddingX, paddingY) {
  var maxChildX, maxChildY, ref, ref1;
  if (fit == null) {
    fit = false;
  }
  if (paddingX == null) {
    paddingX = 0;
  }
  if (paddingY == null) {
    paddingY = 0;
  }
  if (layer.children.length === 0) {
    return;
  }
  maxChildX = ((ref = _.maxBy(layer.children, 'maxX')) != null ? ref.maxX : void 0) + paddingX;
  maxChildY = ((ref1 = _.maxBy(layer.children, 'maxY')) != null ? ref1.maxY : void 0) + paddingY;
  if (fit) {
    layer.props = {
      width: Math.max(layer.width, maxChildX),
      height: Math.max(layer.height, maxChildY)
    };
    return;
  }
  layer.props = {
    width: maxChildX,
    height: maxChildY
  };
  return layer;
};

Utils.getStatusColor = function(dev, lowerBetter) {
  var color, colors;
  if (lowerBetter == null) {
    lowerBetter = false;
  }
  colors = ['#ec4741', '#f48847', '#ffc84a', '#a7c54b', '#4fbf4f'];
  if (lowerBetter) {
    dev = -dev;
  }
  color = Utils.modulate(dev, [-.1, 0.1], [0, colors.length - 1], false);
  return colors[color.toFixed()];
};

Utils.chainAnimations = function() {
  var anim, animations, fn, i, j, k, len, looping;
  animations = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  looping = true;
  if (typeof _.last(animations) === "boolean") {
    looping = animations.pop();
  }
  j = animations.length - 1;
  fn = function(i, animations) {
    if (anim === animations[j] && looping) {
      anim.onAnimationEnd(function() {
        var ref;
        if ((ref = animations[0]) != null) {
          ref.reset();
        }
        return Utils.delay(0, function() {
          var ref1;
          return (ref1 = animations[0]) != null ? ref1.start() : void 0;
        });
      });
    }
    return anim.onAnimationEnd(function() {
      var ref;
      return (ref = animations[i + 1]) != null ? ref.restart() : void 0;
    });
  };
  for (i = k = 0, len = animations.length; k < len; i = ++k) {
    anim = animations[i];
    fn(i, animations);
  }
  return Utils.delay(0, function() {
    return animations[0].restart();
  });
};

Utils.pointInPolygon = function(point, vs) {
  var ccw, i, inside, intersect, j;
  if (vs == null) {
    vs = [];
  }
  if (vs[0].x != null) {
    vs = _.map(vs, function(p) {
      return [p.x, p.y];
    });
  }
  ccw = function(A, B, C) {
    return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0]);
  };
  intersect = function(A, B, C, D) {
    return (ccw(A, C, D) !== ccw(B, C, D)) && (ccw(A, B, C) !== ccw(A, B, D));
  };
  inside = false;
  i = 0;
  j = vs.length - 1;
  while (i < vs.length) {
    if (intersect([-999999, point.y], [point.x, point.y], vs[i], vs[j])) {
      inside = !inside;
    }
    j = i++;
  }
  return inside;
};

Utils.pointInLayer = function(point, layer) {
  return Utils.pointInPolygon(point, Utils.pointsFromFrame(layer));
};

Utils.getLayerAtPoint = function(point, array) {
  var k, layer, len, ref, under, valid;
  if (array == null) {
    array = Framer.CurrentContext._layers;
  }
  under = Utils.getLayersAtPoint(event.point, array);
  valid = [];
  for (k = 0, len = under.length; k < len; k++) {
    layer = under[k];
    if (_.intersection(under, layer.children).length > 0) {
      continue;
    }
    valid.push(layer);
  }
  return (ref = _.maxBy(valid, 'index')) != null ? ref : null;
};

Utils.getLayersAtPoint = function(point, array) {
  var i, k, layer, layers, len;
  if (array == null) {
    array = Framer.CurrentContext._layers;
  }
  layers = [];
  for (i = k = 0, len = array.length; k < len; i = ++k) {
    layer = array[i];
    if (Utils.pointInPolygon(point, Utils.pointsFromFrame(layer))) {
      layers.push(layer);
    }
  }
  return layers;
};

Utils.getLayerFromElement = (function(_this) {
  return function(element, array) {
    var findLayerElement, layerElement, ref;
    if (array == null) {
      array = Framer.CurrentContext._layers;
    }
    if (!element) {
      return;
    }
    findLayerElement = function(element) {
      if (!(element != null ? element.classList : void 0)) {
        return;
      }
      if (element.classList.contains('framerLayer')) {
        return element;
      }
      return findLayerElement(element.parentNode);
    };
    layerElement = findLayerElement(element);
    return (ref = _.find(array, function(l) {
      return l._element === layerElement;
    })) != null ? ref : null;
  };
})(this);

Utils.getOrdinal = function(number) {
  switch (number % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

Utils.px = function(num) {
  return (num * Framer.Device.context.scale) + 'px';
};

Utils.linkProperties = function() {
  var layerA, layerB, props;
  layerA = arguments[0], layerB = arguments[1], props = 3 <= arguments.length ? slice.call(arguments, 2) : [];
  return props.forEach(function(prop) {
    var update;
    update = function() {
      return layerB[prop] = layerA[prop];
    };
    layerA.on("change:" + prop, update);
    return update();
  });
};

Utils.copyTextToClipboard = function(text) {
  var copyElement, ctx;
  copyElement = document.createElement("textarea");
  copyElement.style.opacity = 0;
  ctx = document.getElementsByClassName("framerContext")[0];
  ctx.appendChild(copyElement);
  copyElement.value = text;
  copyElement.select();
  document.execCommand('copy');
  copyElement.blur();
  return ctx.removeChild(copyElement);
};

Utils.CORSproxy = function(url) {
  var regexp;
  regexp = /(^127\.)|(^192\.168\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^::1$)|(^[fF][cCdD])/;
  if (regexp.test(window.location.hostname)) {
    return "http://" + window.location.host + "/_server/proxy/" + url;
  }
  return "https://cors-anywhere.herokuapp.com/" + url;
};

Utils.setAttributes = function(element, attributes) {
  var key, results, value;
  if (attributes == null) {
    attributes = {};
  }
  results = [];
  for (key in attributes) {
    value = attributes[key];
    results.push(element.setAttribute(key, value));
  }
  return results;
};

Utils.toMarkdown = function(textLayer) {
  var el, k, len, loopString, ref, regexes;
  if (!textLayer instanceof TextLayer) {
    throw "Utils.toMarkdown only works with TextLayers.";
  }
  loopString = function(string, reg) {
    if (!string.match(reg[0])) {
      return string;
    }
    return loopString(string.replace(reg[0], reg[1]), reg);
  };
  regexes = [[/\[([^\[]+)\]\(([^\)]+)\)/, '<a href=\'$2\'>$1</a>'], [/(\*\*|__)(.*?)\1/, '<b>$2</b>'], [/(\*|_)(.*?)\1/, '<i>$2</i>'], [/\~\~(.*?)\~\~/, '<del>$1</del>'], [/`(.*?)`/, '<code>$1</code>']];
  ref = textLayer._element.children[1].childNodes;
  for (k = 0, len = ref.length; k < len; k++) {
    el = ref[k];
    el.childNodes[0].innerHTML = _.reduce(regexes, loopString, el.childNodes[0].innerHTML);
  }
  _.bind(function() {
    var calculatedSize, constrainedHeight, constrainedWidth, constraints, forceRender, padding, parentWidth;
    forceRender = false;
    this._updateHTMLScale();
    if (!this.autoSize) {
      if (this.width < this._elementHTML.clientWidth || this.height < this._elementHTML.clientHeight) {
        this.clip = true;
      }
    }
    if (!(forceRender || this.autoHeight || this.autoWidth || this.textOverflow !== null)) {
      return;
    }
    parentWidth = this.parent != null ? this.parent.width : Screen.width;
    constrainedWidth = this.autoWidth ? parentWidth : this.size.width;
    padding = Utils.rectZero(Utils.parseRect(this.padding));
    constrainedWidth -= padding.left + padding.right;
    if (this.autoHeight) {
      constrainedHeight = null;
    } else {
      constrainedHeight = this.size.height - (padding.top + padding.bottom);
    }
    constraints = {
      width: constrainedWidth,
      height: constrainedHeight,
      multiplier: this.context.pixelMultiplier
    };
    calculatedSize = this._styledText.measure(constraints);
    this.disableAutosizeUpdating = true;
    if (calculatedSize.width != null) {
      this.width = calculatedSize.width + padding.left + padding.right;
    }
    if (calculatedSize.height != null) {
      this.height = calculatedSize.height + padding.top + padding.bottom;
    }
    return this.disableAutosizeUpdating = false;
  }, textLayer)();
  return textLayer.emit("change:text", textLayer.text, textLayer);
};

Utils.fetch = function(url, callback) {
  if (!url.includes('cors-anywhere')) {
    url = Utils.CORSproxy(url);
  }
  return fetch(url, {
    'method': 'GET',
    'mode': 'cors'
  }).then(callback);
};

Utils.fetchJSON = function(url, callback) {
  if (!url.includes('cors-anywhere')) {
    url = Utils.CORSproxy(url);
  }
  return fetch(url, {
    'method': 'GET',
    'mode': 'cors'
  }).then(function(r) {
    return r.json().then(callback);
  });
};

Utils.randomText = function(words, sentences, paragraphs) {
  var k, len, length, m, n, paragraph, results, results1, text;
  if (words == null) {
    words = 12;
  }
  if (sentences == null) {
    sentences = false;
  }
  if (paragraphs == null) {
    paragraphs = false;
  }
  text = Array.from({
    length: words
  }, function() {
    return _.sample(loremSource);
  });
  if (!sentences) {
    return text.join(' ');
  }
  if (words <= 3) {
    return _.capitalize(_.sampleSize(text, 3).join(' ')) + '.';
  }
  sentences = [];
  while (text.length > 0) {
    if (text.length <= 3) {
      _.sample(sentences).push(text.pop());
      continue;
    }
    length = _.clamp(_.random(3, 6), 0, text.length);
    sentences.push(_.pullAt(text, (function() {
      results = [];
      for (var k = 0; 0 <= length ? k < length : k > length; 0 <= length ? k++ : k--){ results.push(k); }
      return results;
    }).apply(this)));
  }
  if (sentences.length < 3) {
    paragraphs = false;
  }
  if (!paragraphs) {
    return sentences.map(function(a) {
      return _.capitalize(a.join(' ')) + '.';
    }).join(' ');
  }
  paragraphs = [];
  while (sentences.length > 0) {
    if (sentences.length <= 3 && paragraphs.length > 0) {
      _.sample(paragraphs).push(sentences.pop());
      continue;
    }
    length = _.clamp(_.random(3, 6), 0, sentences.length);
    paragraphs.push(_.pullAt(sentences, (function() {
      results1 = [];
      for (var m = 0; 0 <= length ? m < length : m > length; 0 <= length ? m++ : m--){ results1.push(m); }
      return results1;
    }).apply(this)));
  }
  text = '';
  for (n = 0, len = paragraphs.length; n < len; n++) {
    paragraph = paragraphs[n];
    text += _.reduce(paragraph, function(string, sentence) {
      return string += _.capitalize(sentence.join(' ')) + '. ';
    }, '').trim() + '\n\n';
  }
  return text.trim();
};

Utils.isEmail = function(string) {
  return string.toLowerCase().match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

loremSource = ["alias", "consequatur", "aut", "perferendis", "sit", "voluptatem", "accusantium", "doloremque", "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore", "veritatis", "et", "quasi", "architecto", "beatae", "vitae", "dicta", "sunt", "explicabo", "aspernatur", "aut", "odit", "aut", "fugit", "sed", "quia", "consequuntur", "magni", "dolores", "eos", "qui", "ratione", "voluptatem", "sequi", "nesciunt", "neque", "dolorem", "ipsum", "quia", "dolor", "sit", "amet", "consectetur", "adipisci", "velit", "sed", "quia", "non", "numquam", "eius", "modi", "tempora", "incidunt", "ut", "labore", "et", "dolore", "magnam", "aliquam", "quaerat", "voluptatem", "ut", "enim", "ad", "minima", "veniam", "quis", "nostrum", "exercitationem", "ullam", "corporis", "nemo", "enim", "ipsam", "voluptatem", "quia", "voluptas", "sit", "suscipit", "laboriosam", "nisi", "ut", "aliquid", "ex", "ea", "commodi", "consequatur", "quis", "autem", "vel", "eum", "iure", "reprehenderit", "qui", "in", "ea", "voluptate", "velit", "esse", "quam", "nihil", "molestiae", "et", "iusto", "odio", "dignissimos", "ducimus", "qui", "blanditiis", "praesentium", "laudantium", "totam", "rem", "voluptatum", "deleniti", "atque", "corrupti", "quos", "dolores", "et", "quas", "molestias", "excepturi", "sint", "occaecati", "cupiditate", "non", "provident", "sed", "ut", "perspiciatis", "unde", "omnis", "iste", "natus", "error", "similique", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollitia", "animi", "id", "est", "laborum", "et", "dolorum", "fuga", "et", "harum", "quidem", "rerum", "facilis", "est", "et", "expedita", "distinctio", "nam", "libero", "tempore", "cum", "soluta", "nobis", "est", "eligendi", "optio", "cumque", "nihil", "impedit", "quo", "porro", "quisquam", "est", "qui", "minus", "id", "quod", "maxime", "placeat", "facere", "possimus", "omnis", "voluptas", "assumenda", "est", "omnis", "dolor", "repellendus", "temporibus", "autem", "quibusdam", "et", "aut", "consequatur", "vel", "illum", "qui", "dolorem", "eum", "fugiat", "quo", "voluptas", "nulla", "pariatur", "at", "vero", "eos", "et", "accusamus", "officiis", "debitis", "aut", "rerum", "necessitatibus", "saepe", "eveniet", "ut", "et", "voluptates", "repudiandae", "sint", "et", "molestiae", "non", "recusandae", "itaque", "earum", "rerum", "hic", "tenetur", "a", "sapiente", "delectus", "ut", "aut", "reiciendis", "voluptatibus", "maiores", "doloribus", "asperiores", "repellat"];


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}],"tvUtils":[function(require,module,exports){
exports.blue = "#1D5AD0";

exports.darkBlue = "#0F5391";

exports.white = "#fff";

exports.darkGrey = "#3A3A3A";

exports.liveFeed = function(id) {
  var channel;
  channel = ["http://a.files.bbci.co.uk/media/live/manifesto/audio_video/simulcast/hls/uk/abr_hdtv/ak/bbc_one_hd.m3u8", "http://a.files.bbci.co.uk/media/live/manifesto/audio_video/simulcast/hls/uk/abr_hdtv/ak/bbc_two_hd.m3u8", "http://a.files.bbci.co.uk/media/live/manifesto/audio_video/simulcast/hls/uk/abr_hdtv/ak/bbc_four_hd.m3u8", "http://a.files.bbci.co.uk/media/live/manifesto/audio_video/simulcast/hls/uk/abr_hdtv/ak/cbeebies_hd.m3u8", "http://a.files.bbci.co.uk/media/live/manifesto/audio_video/simulcast/hls/uk/abr_hdtv/ak/bbc_news_channel_hd.m3u8", "http://a.files.bbci.co.uk/media/live/manifesto/audio_video/simulcast/hls/uk/abr_hdtv/ak/bbc_one_scotland_hd.m3u8"];
  if (id === void 0) {
    id = 0;
  }
  window["liveFeed"] = new VideoLayer({
    name: "liveFeed",
    video: typeof id === 'number' ? channel[id] : id,
    backgroundColor: "",
    size: Screen.size
  });
  liveFeed.player.play();
  return liveFeed.player.volume = 0;
};

exports.bigBuck = function() {
  window["bigBuck"] = new VideoLayer({
    video: "http://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/index_3_av.m3u8",
    size: Screen.size,
    backgroundColor: ""
  });
  bigBuck.player.play();
  return bigBuck.player.volume = 0;
};

exports.breakLetter = function(layer) {
  var child, i, j, len, results;
  if (layer instanceof Object) {
    results = [];
    for (i = j = 0, len = layer.length; j < len; i = ++j) {
      child = layer[i];
      results.push(child.style = {
        "word-break": "break-all"
      });
    }
    return results;
  } else {
    return layer.style = {
      "word-break": "break-all"
    };
  }
};

exports.htmlEntities = function(str) {
  return str.replace("&amp;", '&').replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"').replace("&apos;", "'").replace("&cent;", "¢").replace("&pound;", "£").replace("&yen;", "¥").replace("&euro;", "€").replace("copyright", "©").replace("&reg;", "®");
};

exports.findIndex = function(layer) {
  var child, i, j, len, ref;
  ref = layer.parent.children;
  for (i = j = 0, len = ref.length; j < len; i = ++j) {
    child = ref[i];
    if (layer === child) {
      return i;
    }
  }
};

exports.hRule = function(pixelNum, color, opac) {
  return new Layer({
    name: ".",
    y: pixelNum,
    width: Screen.width,
    height: 1,
    backgroundColor: color != null ? color : "red",
    opacity: opac != null ? opac : 0.5
  });
};

exports.vRule = function(pixelNum, color, opac) {
  return new Layer({
    name: ".",
    x: pixelNum,
    width: 1,
    height: Screen.height,
    backgroundColor: color != null ? color : "red",
    opacity: opac != null ? opac : 0.5
  });
};

exports.hGrid = function(xGap, color, opac) {
  var i, j, numberOfLines, ref, results;
  numberOfLines = Screen.height / xGap;
  results = [];
  for (i = j = 0, ref = numberOfLines; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
    results.push(this.hRule(i * xGap, color, opac));
  }
  return results;
};

exports.vGrid = function(yGap, color, opac) {
  var i, j, numberOfLines, ref, results;
  numberOfLines = Screen.width / yGap;
  results = [];
  for (i = j = 0, ref = numberOfLines; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
    results.push(this.vRule(i * yGap, color, opac));
  }
  return results;
};

exports.convertToMins = function(secs) {
  return secs * 60;
};


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2V4YW1wbGVzL25hdmlnYWJsZXMtZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy90dlV0aWxzLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2V4YW1wbGVzL25hdmlnYWJsZXMtZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9teU1vZHVsZS5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9zZnJhc2VyL2Rldi9mcmFtZXIvVFYtUHJvdG90eXBpbmctVG9vbGtpdC9leGFtcGxlcy9uYXZpZ2FibGVzLWV4YW1wbGUuZnJhbWVyL21vZHVsZXMvbW9yZXV0aWxzLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2V4YW1wbGVzL25hdmlnYWJsZXMtZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9UVktpdC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9zZnJhc2VyL2Rldi9mcmFtZXIvVFYtUHJvdG90eXBpbmctVG9vbGtpdC9leGFtcGxlcy9uYXZpZ2FibGVzLWV4YW1wbGUuZnJhbWVyL21vZHVsZXMvUHJvZ3JhbW1lVGlsZS5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9zZnJhc2VyL2Rldi9mcmFtZXIvVFYtUHJvdG90eXBpbmctVG9vbGtpdC9leGFtcGxlcy9uYXZpZ2FibGVzLWV4YW1wbGUuZnJhbWVyL21vZHVsZXMvTmF2aWdhYmxlcy5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9zZnJhc2VyL2Rldi9mcmFtZXIvVFYtUHJvdG90eXBpbmctVG9vbGtpdC9leGFtcGxlcy9uYXZpZ2FibGVzLWV4YW1wbGUuZnJhbWVyL21vZHVsZXMvTWVudS5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9zZnJhc2VyL2Rldi9mcmFtZXIvVFYtUHJvdG90eXBpbmctVG9vbGtpdC9leGFtcGxlcy9uYXZpZ2FibGVzLWV4YW1wbGUuZnJhbWVyL21vZHVsZXMvS2V5Ym9hcmQuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc2ZyYXNlci9kZXYvZnJhbWVyL1RWLVByb3RvdHlwaW5nLVRvb2xraXQvZXhhbXBsZXMvbmF2aWdhYmxlcy1leGFtcGxlLmZyYW1lci9tb2R1bGVzL0hpZ2hsaWdodC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9zZnJhc2VyL2Rldi9mcmFtZXIvVFYtUHJvdG90eXBpbmctVG9vbGtpdC9leGFtcGxlcy9uYXZpZ2FibGVzLWV4YW1wbGUuZnJhbWVyL21vZHVsZXMvR3JpZC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9zZnJhc2VyL2Rldi9mcmFtZXIvVFYtUHJvdG90eXBpbmctVG9vbGtpdC9leGFtcGxlcy9uYXZpZ2FibGVzLWV4YW1wbGUuZnJhbWVyL21vZHVsZXMvQ2Fyb3VzZWwuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc2ZyYXNlci9kZXYvZnJhbWVyL1RWLVByb3RvdHlwaW5nLVRvb2xraXQvZXhhbXBsZXMvbmF2aWdhYmxlcy1leGFtcGxlLmZyYW1lci9tb2R1bGVzL0J1dHRvbnMuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgPT09PT09PT09PT09PT09PT09PT09PT09XG4jIExpc3Qgb2YgZGVzaXJlZCBoZWxwZXJzXG4jID09PT09PT09PT09PT09PT09PT09PT09PVxuIyAqIFxuXG4jIENvbG91cnNcbmV4cG9ydHMuYmx1ZSA9IFwiIzFENUFEMFwiXG5leHBvcnRzLmRhcmtCbHVlID0gXCIjMEY1MzkxXCJcbmV4cG9ydHMud2hpdGUgPSBcIiNmZmZcIlxuZXhwb3J0cy5kYXJrR3JleSA9IFwiIzNBM0EzQVwiXG5cbmV4cG9ydHMubGl2ZUZlZWQgPSAoIGlkICkgLT5cblx0Y2hhbm5lbCA9IFtcImh0dHA6Ly9hLmZpbGVzLmJiY2kuY28udWsvbWVkaWEvbGl2ZS9tYW5pZmVzdG8vYXVkaW9fdmlkZW8vc2ltdWxjYXN0L2hscy91ay9hYnJfaGR0di9hay9iYmNfb25lX2hkLm0zdThcIixcImh0dHA6Ly9hLmZpbGVzLmJiY2kuY28udWsvbWVkaWEvbGl2ZS9tYW5pZmVzdG8vYXVkaW9fdmlkZW8vc2ltdWxjYXN0L2hscy91ay9hYnJfaGR0di9hay9iYmNfdHdvX2hkLm0zdThcIixcImh0dHA6Ly9hLmZpbGVzLmJiY2kuY28udWsvbWVkaWEvbGl2ZS9tYW5pZmVzdG8vYXVkaW9fdmlkZW8vc2ltdWxjYXN0L2hscy91ay9hYnJfaGR0di9hay9iYmNfZm91cl9oZC5tM3U4XCIsXCJodHRwOi8vYS5maWxlcy5iYmNpLmNvLnVrL21lZGlhL2xpdmUvbWFuaWZlc3RvL2F1ZGlvX3ZpZGVvL3NpbXVsY2FzdC9obHMvdWsvYWJyX2hkdHYvYWsvY2JlZWJpZXNfaGQubTN1OFwiLFwiaHR0cDovL2EuZmlsZXMuYmJjaS5jby51ay9tZWRpYS9saXZlL21hbmlmZXN0by9hdWRpb192aWRlby9zaW11bGNhc3QvaGxzL3VrL2Ficl9oZHR2L2FrL2JiY19uZXdzX2NoYW5uZWxfaGQubTN1OFwiLCBcImh0dHA6Ly9hLmZpbGVzLmJiY2kuY28udWsvbWVkaWEvbGl2ZS9tYW5pZmVzdG8vYXVkaW9fdmlkZW8vc2ltdWxjYXN0L2hscy91ay9hYnJfaGR0di9hay9iYmNfb25lX3Njb3RsYW5kX2hkLm0zdThcIl1cblx0aWYgaWQgPT0gdW5kZWZpbmVkIHRoZW4gaWQgPSAwXG5cdHdpbmRvd1tcImxpdmVGZWVkXCJdID0gbmV3IFZpZGVvTGF5ZXJcblx0XHRuYW1lOiBcImxpdmVGZWVkXCJcblx0XHR2aWRlbzogaWYgdHlwZW9mIGlkID09ICdudW1iZXInIHRoZW4gY2hhbm5lbFtpZF0gZWxzZSBpZFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRcdHNpemU6IFNjcmVlbi5zaXplXG5cdGxpdmVGZWVkLnBsYXllci5wbGF5KClcblx0bGl2ZUZlZWQucGxheWVyLnZvbHVtZSA9IDBcblxuZXhwb3J0cy5iaWdCdWNrID0gLT5cblx0d2luZG93W1wiYmlnQnVja1wiXSA9IG5ldyBWaWRlb0xheWVyXG5cdFx0dmlkZW86IFwiaHR0cDovL211bHRpcGxhdGZvcm0tZi5ha2FtYWloZC5uZXQvaS9tdWx0aS93aWxsL2J1bm55L2JpZ19idWNrX2J1bm55Xyw2NDB4MzYwXzQwMCw2NDB4MzYwXzcwMCw2NDB4MzYwXzEwMDAsOTUweDU0MF8xNTAwLC5mNHYuY3NtaWwvaW5kZXhfM19hdi5tM3U4XCJcblx0XHRzaXplOiBTY3JlZW4uc2l6ZVxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRiaWdCdWNrLnBsYXllci5wbGF5KClcblx0YmlnQnVjay5wbGF5ZXIudm9sdW1lID0gMFxuXG5cbiMgRnJhbWVyIHRydW5jYXRlcyBvbiB3b3JkcyBieSBkZWZhdWx0LiBUaGlzIGZvcmNlcyBGcmFtZXIgdG8gdHJ1bmNhdGUgaW5kaXZpZHVhbCBjaGFyYWN0ZXJzLlxuIyBZb3UgY2FuIHBhc3MgYW4gaW5kaXZpZHVhbCBsYXllciBvciBhbiBhcnJheSBvZiBsYXllcnMuXG5leHBvcnRzLmJyZWFrTGV0dGVyID0gKCBsYXllciApIC0+XG5cdGlmIGxheWVyIGluc3RhbmNlb2YgT2JqZWN0XG5cdFx0Zm9yIGNoaWxkLCBpIGluIGxheWVyXG5cdFx0XHRjaGlsZC5zdHlsZSA9IFxuXHRcdFx0XHRcIndvcmQtYnJlYWtcIiA6IFwiYnJlYWstYWxsXCJcblx0ZWxzZVxuXHRcdGxheWVyLnN0eWxlID0gXG5cdFx0XHRcIndvcmQtYnJlYWtcIiA6IFwiYnJlYWstYWxsXCJcblxuZXhwb3J0cy5odG1sRW50aXRpZXMgPSAoc3RyKSAtPlxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoXCImYW1wO1wiLCAnJicpLnJlcGxhY2UoXCImbHQ7XCIsIFwiPFwiKS5yZXBsYWNlKFwiJmd0O1wiLCBcIj5cIikucmVwbGFjZShcIiZxdW90O1wiLCAnXCInKS5yZXBsYWNlKFwiJmFwb3M7XCIsIFwiJ1wiKS5yZXBsYWNlKFwiJmNlbnQ7XCIsIFwiwqJcIikucmVwbGFjZShcIiZwb3VuZDtcIiwgXCLCo1wiKS5yZXBsYWNlKFwiJnllbjtcIiwgXCLCpVwiKS5yZXBsYWNlKFwiJmV1cm87XCIsIFwi4oKsXCIpLnJlcGxhY2UoXCJjb3B5cmlnaHRcIiwgXCLCqVwiKS5yZXBsYWNlKFwiJnJlZztcIiwgXCLCrlwiKVxuXG5leHBvcnRzLmZpbmRJbmRleCA9IChsYXllcikgLT5cblx0Zm9yIGNoaWxkLCBpIGluIGxheWVyLnBhcmVudC5jaGlsZHJlblxuXHRcdGlmIGxheWVyID09IGNoaWxkXG5cdFx0XHRyZXR1cm4gaVxuXG5leHBvcnRzLmhSdWxlID0gKHBpeGVsTnVtLCBjb2xvciwgb3BhYykgLT5cblx0bmV3IExheWVyXG5cdFx0bmFtZTogXCIuXCJcblx0XHR5OiBwaXhlbE51bVxuXHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRoZWlnaHQ6IDFcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGlmIGNvbG9yPyB0aGVuIGNvbG9yIGVsc2UgXCJyZWRcIlxuXHRcdG9wYWNpdHk6IGlmIG9wYWM/IHRoZW4gb3BhYyBlbHNlIDAuNVxuXG5leHBvcnRzLnZSdWxlID0gKHBpeGVsTnVtLCBjb2xvciwgb3BhYykgLT5cblx0bmV3IExheWVyXG5cdFx0bmFtZTogXCIuXCJcblx0XHR4OiBwaXhlbE51bVxuXHRcdHdpZHRoOiAxXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBpZiBjb2xvcj8gdGhlbiBjb2xvciBlbHNlIFwicmVkXCJcblx0XHRvcGFjaXR5OiBpZiBvcGFjPyB0aGVuIG9wYWMgZWxzZSAwLjVcblxuZXhwb3J0cy5oR3JpZCA9ICh4R2FwLCBjb2xvciwgb3BhYykgLT5cblx0bnVtYmVyT2ZMaW5lcyA9IFNjcmVlbi5oZWlnaHQgLyB4R2FwXG5cdGZvciBpIGluIFswLi5udW1iZXJPZkxpbmVzXVxuXHRcdEAuaFJ1bGUoaSp4R2FwLCBjb2xvciwgb3BhYylcblxuZXhwb3J0cy52R3JpZCA9ICh5R2FwLCBjb2xvciwgb3BhYykgLT5cblx0bnVtYmVyT2ZMaW5lcyA9IFNjcmVlbi53aWR0aCAvIHlHYXBcblx0Zm9yIGkgaW4gWzAuLm51bWJlck9mTGluZXNdXG5cdFx0QC52UnVsZShpKnlHYXAsIGNvbG9yLCBvcGFjKVxuXG5leHBvcnRzLmNvbnZlcnRUb01pbnMgPSAoIHNlY3MgKSAtPlxuXHRyZXR1cm4gc2Vjcyo2MCIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCIjIEEgY29sbGVjdGlvbiBmb3IgaGVscGVyIG1ldGhvZHMuXG4jXG4jIEBhdXRob3Igc3RldmVydWl6b2tcblxuXG4jIyNcblBpbiBhIGxheWVyIHRvIGFub3RoZXIgbGF5ZXIuIFdoZW4gdGhlIHNlY29uZCBsYXllciBtb3ZlcywgdGhlIGZpcnN0IG9uZSB3aWxsIHRvby5cblxuQHBhcmFtIHtMYXllcn0gbGF5ZXIgVGhlIGxheWVyIHRvIHBpbi5cbkBwYXJhbSB7TGF5ZXJ9IHRhcmdldCBUaGUgbGF5ZXIgdG8gcGluIHRvLiBcbkBwYXJhbSB7Li4uU3RyaW5nfSBkaXJlY3Rpb25zIFdoaWNoIHNpZGVzIG9mIHRoZSBsYXllciB0byBwaW4gdG8uXG5cblx0VXRpbHMucGluKGxheWVyQSwgbGF5ZXJCLCAnbGVmdCcpXG5cbiMjI1xuVXRpbHMucGluID0gKGxheWVyLCB0YXJnZXQsIGRpcmVjdGlvbnMuLi4pIC0+XG5cdGlmIGRpcmVjdGlvbnMubGVuZ3RoID4gMiBcblx0XHR0aHJvdyAnVXRpbHMucGluIGNhbiBvbmx5IHRha2UgdHdvIGRpcmVjdGlvbiBhcmd1bWVudHMgKGUuZy4gXCJsZWZ0XCIsIFwidG9wXCIpLiBBbnkgbW9yZSB3b3VsZCBjb25mbGljdCEnXG5cdFxuXHRmb3IgZGlyZWN0aW9uIGluIGRpcmVjdGlvbnNcblx0XHRkbyAobGF5ZXIsIHRhcmdldCwgZGlyZWN0aW9uKSAtPlxuXHRcdFx0c3dpdGNoIGRpcmVjdGlvblxuXHRcdFx0XHR3aGVuIFwibGVmdFwiXG5cdFx0XHRcdFx0cHJvcHMgPSBbJ3gnXVxuXHRcdFx0XHRcdGxQcm9wID0gJ21heFgnXG5cdFx0XHRcdFx0ZGlzdGFuY2UgPSB0YXJnZXQueCAtIChsYXllci5tYXhYKVxuXHRcdFx0XHRcdGdldERpZmZlcmVuY2UgPSAtPiB0YXJnZXQueCAtIGRpc3RhbmNlXG5cdFx0XHRcdHdoZW4gXCJyaWdodFwiXG5cdFx0XHRcdFx0cHJvcHMgPSBbJ3gnLCAnd2lkdGgnXVxuXHRcdFx0XHRcdGxQcm9wID0gJ3gnXG5cdFx0XHRcdFx0ZGlzdGFuY2UgPSBsYXllci54IC0gKHRhcmdldC5tYXhYKVxuXHRcdFx0XHRcdGdldERpZmZlcmVuY2UgPSAtPiB0YXJnZXQubWF4WCArIGRpc3RhbmNlXG5cdFx0XHRcdHdoZW4gXCJ0b3BcIlxuXHRcdFx0XHRcdHByb3BzID0gWyd5J11cblx0XHRcdFx0XHRsUHJvcCA9ICdtYXhZJ1xuXHRcdFx0XHRcdGRpc3RhbmNlID0gdGFyZ2V0LnkgLSAobGF5ZXIubWF4WSlcblx0XHRcdFx0XHRnZXREaWZmZXJlbmNlID0gLT4gdGFyZ2V0LnkgLSBkaXN0YW5jZVxuXHRcdFx0XHR3aGVuIFwiYm90dG9tXCJcblx0XHRcdFx0XHRwcm9wcyA9IFsneScsICdoZWlnaHQnXVxuXHRcdFx0XHRcdGxQcm9wID0gJ3knXG5cdFx0XHRcdFx0ZGlzdGFuY2UgPSBsYXllci55IC0gKHRhcmdldC5tYXhZKVxuXHRcdFx0XHRcdGdldERpZmZlcmVuY2UgPSAtPiB0YXJnZXQubWF4WSArIGRpc3RhbmNlXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR0aHJvdyAnVXRpbHMucGluIC0gZGlyZWN0aW9ucyBjYW4gb25seSBiZSB0b3AsIHJpZ2h0LCBib3R0b20gb3IgbGVmdC4nXG5cdFx0XHRcblx0XHRcdGZvciBwcm9wIGluIHByb3BzXG5cdFx0XHRcdHNldFBpbiA9XG5cdFx0XHRcdFx0dGFyZ2V0TGF5ZXI6IHRhcmdldFxuXHRcdFx0XHRcdGRpcmVjdGlvbjogZGlyZWN0aW9uXG5cdFx0XHRcdFx0ZXZlbnQ6IFwiY2hhbmdlOiN7cHJvcH1cIlxuXHRcdFx0XHRcdGZ1bmM6IC0+IGxheWVyW2xQcm9wXSA9IGdldERpZmZlcmVuY2UoKVxuXHRcdFx0XG5cdFx0XHRcdGxheWVyLnBpbnMgPz0gW11cblx0XHRcdFx0bGF5ZXIucGlucy5wdXNoKHNldFBpbilcblx0XHRcdFx0XG5cdFx0XHRcdHRhcmdldC5vbihzZXRQaW4uZXZlbnQsIHNldFBpbi5mdW5jKVxuXHRcblxuIyMjXG5SZW1vdmUgYWxsIG9mIGEgbGF5ZXIncyBwaW5zLCBvciBwaW5zIGZyb20gYSBjZXJ0YWluIHRhcmdldCBsYXllciBhbmQvb3IgZGlyZWN0aW9uLlxuXG5AcGFyYW0ge0xheWVyfSBsYXllciBUaGUgbGF5ZXIgdG8gdW5waW4uXG5AcGFyYW0ge0xheWVyfSBbdGFyZ2V0XSBUaGUgbGF5ZXIgdG8gdW5waW4gZnJvbS4gXG5AcGFyYW0gey4uLlN0cmluZ30gW2RpcmVjdGlvbnNdIFRoZSBkaXJlY3Rpb25zIHRvIHVucGluLlxuXG5cdFV0aWxzLnVucGluKGxheWVyQSlcblxuIyMjXG5VdGlscy51bnBpbiA9IChsYXllciwgdGFyZ2V0LCBkaXJlY3Rpb24pIC0+XG5cdFxuXHRzZXRQaW5zID0gXy5maWx0ZXIgbGF5ZXIucGlucywgKHApIC0+XG5cdFx0aXNMYXllciA9IGlmIHRhcmdldD8gdGhlbiBwLnRhcmdldCBpcyB0YXJnZXQgZWxzZSB0cnVlXG5cdFx0aXNEaXJlY3Rpb24gPSBpZiBkaXJlY3Rpb24/IHRoZW4gcC5kaXJlY3Rpb24gaXMgZGlyZWN0aW9uIGVsc2UgdHJ1ZVxuXHRcdFxuXHRcdHJldHVybiBpc0xheWVyIGFuZCBpc0RpcmVjdGlvblxuXHRcblx0Zm9yIHNldFBpbiBpbiBzZXRQaW5zXG5cdFx0c2V0UGluLnRhcmdldC5vZmYoc2V0UGluLmV2ZW50LCBzZXRQaW4uZnVuYylcblxuXG4jIyNcblBpbiBsYXllciB0byBhbm90aGVyIGxheWVyLCBiYXNlZCBvbiB0aGUgZmlyc3QgbGF5ZXIncyBvcmlnaW4uXG5cbkBwYXJhbSB7TGF5ZXJ9IGxheWVyIFRoZSBsYXllciB0byBwaW4uXG5AcGFyYW0ge0xheWVyfSBbdGFyZ2V0XSBUaGUgbGF5ZXIgdG8gcGluIHRvLiBcbkBwYXJhbSB7Qm9vbGVhbn0gW3VuZG9dIFJlbW92ZSwgcmF0aGVyIHRoYW4gY3JlYXRlLCB0aGlzIHBpbi4gXG5cblx0VXRpbHMucGluT3JpZ2luKGxheWVyQSwgbGF5ZXJCKVxuXG4jIyNcblV0aWxzLnBpbk9yaWdpbiA9IChsYXllciwgdGFyZ2V0LCB1bmRvID0gZmFsc2UpIC0+XG5cdGlmIHVuZG9cblx0XHR0YXJnZXQub2ZmIFwiY2hhbmdlOnNpemVcIiwgbGF5ZXIuc2V0UG9zaXRpb24gXG5cdFx0cmV0dXJuXG5cblx0bGF5ZXIuc2V0UG9zaXRpb24gPSAtPlxuXHRcdGxheWVyLnggPSAodGFyZ2V0LndpZHRoIC0gbGF5ZXIud2lkdGgpICogbGF5ZXIub3JpZ2luWFxuXHRcdGxheWVyLnkgPSAodGFyZ2V0LmhlaWdodCAtIGxheWVyLmhlaWdodCkgKiBsYXllci5vcmlnaW5ZXG5cdFxuXHRsYXllci5zZXRQb3NpdGlvbigpXG5cdFxuXHR0YXJnZXQub24gXCJjaGFuZ2U6c2l6ZVwiLCBsYXllci5zZXRQb3NpdGlvblxuXG5cbiMjI1xuUGluIGxheWVyIHRvIGFub3RoZXIgbGF5ZXIsIGJhc2VkIG9uIHRoZSBmaXJzdCBsYXllcidzIG9yaWdpblguXG5cbkBwYXJhbSB7TGF5ZXJ9IGxheWVyIFRoZSBsYXllciB0byBwaW4uXG5AcGFyYW0ge0xheWVyfSBbdGFyZ2V0XSBUaGUgbGF5ZXIgdG8gcGluIHRvLiBcbkBwYXJhbSB7Qm9vbGVhbn0gW3VuZG9dIFJlbW92ZSwgcmF0aGVyIHRoYW4gY3JlYXRlLCB0aGlzIHBpbi4gXG5cblx0VXRpbHMucGluT3JpZ2luWChsYXllckEsIGxheWVyQilcblxuIyMjXG5VdGlscy5waW5PcmlnaW5YID0gKGxheWVyLCB0YXJnZXQsIHVuZG8gPSBmYWxzZSkgLT5cblx0aWYgdW5kb1xuXHRcdHRhcmdldC5vZmYgXCJjaGFuZ2U6c2l6ZVwiLCBsYXllci5zZXRQb3NpdGlvbiBcblx0XHRyZXR1cm5cblxuXHRsYXllci5zZXRQb3NpdGlvbiA9IC0+XG5cdFx0bGF5ZXIueCA9ICh0YXJnZXQud2lkdGggLSBsYXllci53aWR0aCkgKiBsYXllci5vcmlnaW5YXG5cdFxuXHRsYXllci5zZXRQb3NpdGlvbigpXG5cdFxuXHR0YXJnZXQub24gXCJjaGFuZ2U6c2l6ZVwiLCBsYXllci5zZXRQb3NpdGlvblxuXG5cbiMjI1xuUGluIGxheWVyIHRvIGFub3RoZXIgbGF5ZXIsIGJhc2VkIG9uIHRoZSBmaXJzdCBsYXllcidzIG9yaWdpblkuXG5cbkBwYXJhbSB7TGF5ZXJ9IGxheWVyIFRoZSBsYXllciB0byBwaW4uXG5AcGFyYW0ge0xheWVyfSBbdGFyZ2V0XSBUaGUgbGF5ZXIgdG8gcGluIHRvLiBcbkBwYXJhbSB7Qm9vbGVhbn0gW3VuZG9dIFJlbW92ZSwgcmF0aGVyIHRoYW4gY3JlYXRlLCB0aGlzIHBpbi4gXG5cblx0VXRpbHMucGluT3JpZ2luWShsYXllckEsIGxheWVyQilcblxuIyMjXG5VdGlscy5waW5PcmlnaW5ZID0gKGxheWVyLCB0YXJnZXQsIHVuZG8gPSBmYWxzZSkgLT5cblx0aWYgdW5kb1xuXHRcdHRhcmdldC5vZmYgXCJjaGFuZ2U6c2l6ZVwiLCBsYXllci5zZXRQb3NpdGlvbiBcblx0XHRyZXR1cm5cblxuXHRsYXllci5zZXRQb3NpdGlvbiA9IC0+XG5cdFx0bGF5ZXIueSA9ICh0YXJnZXQuaGVpZ2h0IC0gbGF5ZXIuaGVpZ2h0KSAqIGxheWVyLm9yaWdpbllcblx0XG5cdGxheWVyLnNldFBvc2l0aW9uKClcblx0XG5cdHRhcmdldC5vbiBcImNoYW5nZTpzaXplXCIsIGxheWVyLnNldFBvc2l0aW9uXG5cblxuIyMjXG5TZXQgYSBsYXllcidzIGNvbnRyYWludHMgdG8gaXRzIHBhcmVudFxuXG5AcGFyYW0ge0xheWVyfSBsYXllciBUaGUgbGF5ZXIgdG8gY29uc3RyYWluLlxuQHBhcmFtIHsuLi5TdHJpbmd9IG9wdGlvbnMgVGhlIGNvbnN0cmFpbnQgb3B0aW9ucyB0byB1c2UuXG5cblZhbGlkIG9wdGlvbnMgYXJlOiAnbGVmdCcsICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2hlaWdodCcsICd3aWR0aCcsIGFuZCAnYXNwZWN0UmF0aW8nLlxuXG5cdFV0aWxzLmNvbnN0cmFpbihsYXllciwgJ2xlZnQnLCAndG9wJywgJ2FwZWN0UmF0aW8nKVxuXG4jIyNcblV0aWxzLmNvbnN0cmFpbiA9IChsYXllciwgb3B0aW9ucy4uLikgLT5cblx0aWYgbm90IGxheWVyLnBhcmVudD8gdGhlbiB0aHJvdyAnVXRpbHMuY29uc3RyYWluIHJlcXVpcmVzIGEgbGF5ZXIgd2l0aCBhIHBhcmVudC4nXG5cdFxuXHRvcHRzID1cblx0XHRsZWZ0OiBmYWxzZSwgXG5cdFx0dG9wOiBmYWxzZSwgXG5cdFx0cmlnaHQ6IGZhbHNlLCBcblx0XHRib3R0b206IGZhbHNlLFxuXHRcdGhlaWdodDogZmFsc2Vcblx0XHR3aWR0aDogZmFsc2Vcblx0XHRhc3BlY3RSYXRpbzogZmFsc2VcblxuXHRmb3Igb3B0IGluIG9wdGlvbnNcblx0XHRvcHRzW29wdF0gPSB0cnVlXG5cdFxuXHR2YWx1ZXMgPSBcblx0XHRsZWZ0OiBpZiBvcHRzLmxlZnQgdGhlbiBsYXllci54IGVsc2UgbnVsbFxuXHRcdGhlaWdodDogbGF5ZXIuaGVpZ2h0XG5cdFx0Y2VudGVyQW5jaG9yWDogbGF5ZXIubWlkWCAvIGxheWVyLnBhcmVudD8ud2lkdGhcblx0XHR3aWR0aDogbGF5ZXIud2lkdGhcblx0XHRyaWdodDogaWYgb3B0cy5yaWdodCB0aGVuIGxheWVyLnBhcmVudD8ud2lkdGggLSBsYXllci5tYXhYIGVsc2UgbnVsbFxuXHRcdHRvcDogaWYgb3B0cy50b3AgdGhlbiBsYXllci55IGVsc2UgbnVsbFxuXHRcdGNlbnRlckFuY2hvclk6IGxheWVyLm1pZFkgLyBsYXllci5wYXJlbnQ/LmhlaWdodFxuXHRcdGJvdHRvbTogaWYgb3B0cy5ib3R0b20gdGhlbiBsYXllci5wYXJlbnQ/LmhlaWdodCAtIGxheWVyLm1heFkgZWxzZSBudWxsXG5cdFx0d2lkdGhGYWN0b3I6IG51bGxcblx0XHRoZWlnaHRGYWN0b3I6IG51bGxcblx0XHRhc3BlY3RSYXRpb0xvY2tlZDogb3B0cy5hc3BlY3RSYXRpb1xuXHRcblx0dW5sZXNzIG9wdHMudG9wIGFuZCBvcHRzLmJvdHRvbVxuXHRcdGlmIG9wdHMuaGVpZ2h0XG5cdFx0XHR2YWx1ZXMuaGVpZ2h0RmFjdG9yID0gbGF5ZXIuaGVpZ2h0IC8gbGF5ZXIucGFyZW50Py5oZWlnaHRcblx0XHRcdFxuXHR1bmxlc3Mgb3B0cy5sZWZ0IGFuZCBvcHRzLnJpZ2h0IFxuXHRcdGlmIG9wdHMud2lkdGhcblx0XHRcdHZhbHVlcy53aWR0aEZhY3RvciA9IGxheWVyLndpZHRoIC8gbGF5ZXIucGFyZW50Py53aWR0aFxuXHRcblx0bGF5ZXIuY29uc3RyYWludFZhbHVlcyA9IHZhbHVlc1xuXG5cbiMjI1xuSW1tZWRpYXRlbHkgZXhlY3V0ZSBhIGZ1bmN0aW9uIHRoYXQgaXMgYm91bmQgdG8gdGhlIHRhcmdldC5cblxuQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGJpbmQgdGhlIGNhbGxiYWNrIHRvLlxuQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIHJ1bi5cblxuXHRVdGlscy5iaW5kKG15TGF5ZXIsIC0+IHRoaXMubmFtZSA9IFwiTXkgTGF5ZXJcIilcblxuIyMjXG5VdGlscy5iaW5kID0gKG9iamVjdCwgY2FsbGJhY2spIC0+XG5cdGRvIF8uYmluZChjYWxsYmFjaywgb2JqZWN0KVxuXG5cbiMjI1xuQWxpYXMgZm9yIFV0aWxzLmJpbmQuXG4jIyNcblV0aWxzLmJ1aWxkID0gKG9iamVjdCwgY2FsbGJhY2spIC0+IEBiaW5kKG9iamVjdCwgY2FsbGJhY2spXG5cblxuIyMjXG5EZWZpbmUgYSBwcm9wZXJ0eSBvbiBhIExheWVyIHRoYXQgd2lsbCBlbWl0IGEgY2hhbmdlIGV2ZW50IHdoZW4gdGhhdCBwcm9wZXJ0eSBjaGFuZ2VzLiBBbHNvLCBvcHRpb25hbGx5IGdpdmUgdGhlIHByb3BlcnR5IGFuIGluaXRpYWwgdmFsdWUgYW5kIGEgY2FsbGJhY2sgdG8gcnVuIHdoZW4gdGhlIHByb3BlcnR5IGNoYW5nZXMuXG5cbkBwYXJhbSB7TGF5ZXJ9IGxheWVyIFRoZSBsYXllciBvbiB3aGljaCB0byBkZWZpbmUgdGhlIHByb3BlcnR5LlxuQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5IFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eS5cbkBwYXJhbSB7T2JqZWN0fSBbdmFsdWVdIFRoZSBpbml0aWFsIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eS5cbkBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGNhbGxiYWNrIHRvIHJ1biB3aGVuIHRoaXMgcHJvcGVydHkgY2hhbmdlcy4gRXhlY3V0ZWQgd2l0aCB0d28gYXJndW1lbnRzOiB0aGUgcHJvcGVydHkncyBuZXcgdmFsdWUgYW5kIHRoZSBMYXllciBpdHNlbGYuXG5AcGFyYW0ge0Z1bmN0aW9ufSBbdmFsaWRhdGlvbl0gQSBmdW5jdGlvbiB0byB2YWxpZGF0ZSB0aGUgcHJvcGVydHkncyBuZXcgdmFsdWUuXG5AcGFyYW0ge1N0cmluZ30gW2Vycm9yXSBBbiBlcnJvciB0byB0aHJvdyBpZiB0aGUgdmFsaWRhdGlvbiBmdW5jdGlvbiByZXR1cm5lZCBmYWxzZS5cblxuXHRVdGlscy5kZWZpbmUobXlMYXllciwgXCJ0b2dnbGVkXCIpXG5cdFV0aWxzLmRlZmluZShteUxheWVyLCBcInRvZ2dsZWRcIiwgZmFsc2UpXG5cdFV0aWxzLmRlZmluZShteUxheWVyLCBcInRvZ2dsZWRcIiwgZmFsc2UsIG15TGF5ZXIuc2hvd1RvZ2dsZWQpXG5cdFV0aWxzLmRlZmluZShteUxheWVyLCBcInRvZ2dsZWRcIiwgZmFsc2UsIG51bGwsIF8uaXNCb29sZWFuLCBcIkxheWVyLnRvZ2dsZWQgbXVzdCBiZSB0cnVlIG9yIGZhbHNlLlwiKVxuXG4jIyNcblV0aWxzLmRlZmluZSA9IChsYXllciwgcHJvcGVydHksIHZhbHVlLCBjYWxsYmFjaywgdmFsaWRhdGlvbiwgZXJyb3IpIC0+XG5cdHZhbGlkYXRpb24gPz0gLT4gdHJ1ZVxuXHRlcnJvciA/PSBcIkxheWVyICN7bGF5ZXIuaWR9J3MgcHJvcGVydHkgJyN7cHJvcGVydHl9JyB3YXMgZ2l2ZW4gdGhlIHdyb25nIHZhbHVlIHR5cGUuXCJcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBsYXllcixcblx0XHRwcm9wZXJ0eSxcblx0XHRnZXQ6IC0+IHJldHVybiBsYXllcltcIl8je3Byb3BlcnR5fVwiXVxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0aWYgdmFsdWU/XG5cdFx0XHRcdGlmIG5vdCB2YWxpZGF0aW9uKHZhbHVlKSB0aGVuIHRocm93IGVycm9yXG5cdFx0XHRcdHJldHVybiBpZiB2YWx1ZSBpcyBsYXllcltcIl8je3Byb3BlcnR5fVwiXVxuXG5cdFx0XHRsYXllcltcIl8je3Byb3BlcnR5fVwiXSA9IHZhbHVlXG5cdFx0XHRsYXllci5lbWl0KFwiY2hhbmdlOiN7cHJvcGVydHl9XCIsIHZhbHVlLCBsYXllcilcblx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHRcdFxuXHRpZiBjYWxsYmFjaz8gYW5kIHR5cGVvZiBjYWxsYmFjayBpcyAnZnVuY3Rpb24nXG5cdFx0bGF5ZXIub24oXCJjaGFuZ2U6I3twcm9wZXJ0eX1cIiwgY2FsbGJhY2spXG5cdFxuXHRsYXllcltwcm9wZXJ0eV0gPSB2YWx1ZVxuXG4jIyNcblNldCBhbGwgbGF5ZXJzIGluIGFuIGFycmF5IHRvIHRoZSBzYW1lIHByb3BlcnR5IG9yIHByb3BlcnRpZXMuXG5cbkBwYXJhbSB7QXJyYXl9IGxheWVycyBUaGUgYXJyYXkgb2YgbGF5ZXJzIHRvIGFsaWduLlxuQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIHByb3BlcnRpZXMgdG8gc2V0LlxuQHBhcmFtIHtCb29sZWFufSBbbWluaW11bV0gV2hldGhlciB0byB1c2UgYXZlcmFnZSB2YWx1ZXMgb3IgbWluaW11bSB2YWx1ZXMgZm9yIG1pZGRsZSAvIGNlbnRlci5cbkBwYXJhbSB7Qm9vbGVhbn0gW2FuaW1hdGVdIFdoZXRoZXIgdG8gYW5pbWF0ZSB0byB0aGUgbmV3IHByb3BlcnR5LlxuQHBhcmFtIHtPYmplY3R9IFthbmltYXRpb25PcHRpb25zXSBUaGUgYW5pbWF0aW9uIG9wdGlvbnMgdG8gdXNlLlxuXG5cdFV0aWxzLmFsaWduIFtsYXllckEsIGxheWVyQl0sXG5cdFx0eDogMjAwXG5cblx0VXRpbHMuYWxpZ24gW2xheWVyQSwgbGF5ZXJCXSxcblx0XHR4OiAyMDBcblx0XHR0cnVlXG5cdFx0dGltZTogLjVcbiMjI1xuVXRpbHMuYWxpZ24gPSAobGF5ZXJzID0gW10sIGRpcmVjdGlvbiwgbWluaW11bSA9IHRydWUsIGFuaW1hdGUsIGFuaW1hdGlvbk9wdGlvbnMgPSB7fSkgLT4gXG5cdG1pblggPSBfLm1pbkJ5KGxheWVycywgJ3gnKS54XG5cdG1heFggPSBfLm1heEJ5KGxheWVycywgJ21heFgnKS5tYXhYXG5cdG1pblkgPSBfLm1pbkJ5KGxheWVycywgJ3knKS55XG5cdG1heFkgPSBfLm1heEJ5KGxheWVycywgJ21heFknKS5tYXhZXG5cblxuXHRvcHRpb25zID0gc3dpdGNoIGRpcmVjdGlvblxuXHRcdHdoZW4gXCJ0b3BcIiB0aGVuIHt5OiBtaW5ZfVxuXHRcdHdoZW4gXCJtaWRkbGVcIlxuXHRcdFx0aWYgbWluaW11bVxuXHRcdFx0XHR7bWlkWTogXy5taW5CeShsYXllcnMsICd5JykubWlkWX1cblx0XHRcdGVsc2UgXG5cdFx0XHRcdHttaWRZOiAobWF4WSAtIG1pblkpLzIgKyBtaW5ZfVxuXHRcdHdoZW4gXCJib3R0b21cIiB0aGVuIHttYXhZOiBtYXhZfVxuXHRcdHdoZW4gXCJsZWZ0XCIgdGhlbiB7eDogbWluWX1cblx0XHR3aGVuIFwiY2VudGVyXCJcblx0XHRcdGlmIG1pbmltdW0gXG5cdFx0XHRcdHttaWRYOiBfLm1pbkJ5KGxheWVycywgJ3gnKS5taWRYfVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR7bWlkWDogKG1heFggLSBtaW5YKS8yICsgbWluWH1cblx0XHR3aGVuIFwicmlnaHRcIiB0aGVuIHttYXhYOiBtYXhYfVxuXHRcdGVsc2Uge31cblxuXHRmb3IgbGF5ZXIsIGkgaW4gbGF5ZXJzXG5cdFx0aWYgYW5pbWF0ZVxuXHRcdFx0bGF5ZXIuYW5pbWF0ZSBvcHRpb25zLCBhbmltYXRpb25PcHRpb25zXG5cdFx0ZWxzZVxuXHRcdFx0Xy5hc3NpZ24gbGF5ZXIsIG9wdGlvbnNcblxuIyMjXG5EaXN0cmlidXRlIGFuIGFycmF5IG9mIGxheWVycyBiZXR3ZWVuIHR3byB2YWx1ZXMuXG5cbkBwYXJhbSB7QXJyYXl9IGxheWVycyBUaGUgYXJyYXkgb2YgbGF5ZXJzIHRvIGRpc3RyaWJ1dGUuXG5AcGFyYW0ge1N0cmluZ30gcHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIGRpc3RyaWJ1dGUuXG5AcGFyYW0ge09iamVjdH0gW3N0YXJ0XSBUaGUgdmFsdWUgdG8gc3RhcnQgZnJvbS4gQnkgZGVmYXVsdCwgdGhlIGxvd2VzdCB2YWx1ZSBvZiB0aGUgZ2l2ZW4gcHJvcGVydHkgYW1vbmcgdGhlIGxheWVycyBhcnJheS5cbkBwYXJhbSB7T2JqZWN0fSBbZW5kXSBUaGUgdmFsdWUgdG8gZGlzdHJpYnV0ZSB0by4gQnkgZGVmYXVsdCwgdGhlIGhpZ2hlc3QgdmFsdWUgb2YgdGhlIGdpdmVuIHByb3BlcnR5IGFtb25nIHRoZSBsYXllcnMgYXJyYXkuXG5AcGFyYW0ge0Jvb2xlYW59IFthbmltYXRlXSBXaGV0aGVyIHRvIGFuaW1hdGUgdG8gdGhlIG5ldyBwcm9wZXJ0eS5cbkBwYXJhbSB7T2JqZWN0fSBbYW5pbWF0aW9uT3B0aW9uc10gVGhlIGFuaW1hdGlvbiBvcHRpb25zIHRvIHVzZS5cblxuXHRVdGlscy5hbGlnbiBbbGF5ZXJBLCBsYXllckJdLCAneCdcblxuXHRVdGlscy5hbGlnbiBbbGF5ZXJBLCBsYXllckJdLCAneCcsIDMyLCAyMDBcblxuXHRVdGlscy5hbGlnbiBbbGF5ZXJBLCBsYXllckJdLCAneCcsIDMyLCAyMDAsIHRydWUsIHt0aW1lOiAuNX1cblxuQWxzbyB3b3JrcyB3aXRoICdob3Jpem9udGFsJyBhbmQgJ3ZlcnRpY2FsJywgKGFsaWFzIHRvICdtaWRYJyBhbmQgJ21pZFknKS5cblxuXHRVdGlscy5hbGlnbiBbbGF5ZXJBLCBsYXllckJdLCAnaG9yaXpvbnRhbCdcblxuIyMjXG5VdGlscy5kaXN0cmlidXRlID0gKGxheWVycyA9IFtdLCBwcm9wZXJ0eSwgc3RhcnQsIGVuZCwgYW5pbWF0ZSA9IGZhbHNlLCBhbmltYXRpb25PcHRpb25zID0ge30pIC0+XG5cdFxuXHRwcm9wZXJ0eSA9ICdtaWRYJyBpZiBwcm9wZXJ0eSBpcyAnaG9yaXpvbnRhbCdcblx0cHJvcGVydHkgPSAnbWlkWScgaWYgcHJvcGVydHkgaXMgJ3ZlcnRpY2FsJ1xuXG5cdGxheWVycyA9IF8uc29ydEJ5KGxheWVycywgW3Byb3BlcnR5XSlcblxuXHRpZiBfLmlzVW5kZWZpbmVkKHN0YXJ0KSBvciB0eXBlb2Ygc3RhcnQgaXMgJ2Jvb2xlYW4nXG5cdFx0YW5pbWF0ZSA9IHN0YXJ0ID8gZmFsc2Vcblx0XHRhbmltYXRpb25PcHRpb25zID0gZW5kID8ge31cblx0XHRzdGFydCA9IGxheWVyc1swXVtwcm9wZXJ0eV1cblx0XHRlbmQgPSBfLmxhc3QobGF5ZXJzKVtwcm9wZXJ0eV1cblxuXHRkaXN0YW5jZSA9IChlbmQgLSBzdGFydCkgLyAobGF5ZXJzLmxlbmd0aCAtIDEpXG5cblx0dmFsdWVzID0gbGF5ZXJzLm1hcCAobGF5ZXIsIGkpIC0+XG5cdFx0cmV0dXJuIHtcIiN7cHJvcGVydHl9XCI6IHN0YXJ0ICsgKGRpc3RhbmNlICogaSl9XG5cdFxuXHRmb3IgbGF5ZXIsIGkgaW4gbGF5ZXJzXG5cdFx0aWYgYW5pbWF0ZVxuXHRcdFx0bGF5ZXIuYW5pbWF0ZSB2YWx1ZXNbaV0sIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdGNvbnRpbnVlXG5cdFx0XG5cdFx0Xy5hc3NpZ24gbGF5ZXIsIHZhbHVlc1tpXVxuXG4jIyNcblN0YWNrIGxheWVycy5cblxuQHBhcmFtIHtBcnJheX0gbGF5ZXJzIFRoZSBhcnJheSBvZiBsYXllcnMgdG8gb2Zmc2V0LlxuQHBhcmFtIHtOdW1iZXJ9IGRpc3RhbmNlIFRoZSBkaXN0YW5jZSBiZXR3ZWVuIGVhY2ggbGF5ZXIuXG5AcGFyYW0ge1N0cmluZ30gYXhpcyBXaGV0aGVyIHRvIHN0YWNrIG9uIHRoZSB4IG9yIHkgYXhpcy5cbkBwYXJhbSB7Qm9vbGVhbn0gW2FuaW1hdGVdIFdoZXRoZXIgdG8gYW5pbWF0ZSBsYXllcnMgdG8gdGhlIG5ldyBwb3NpdGlvbi5cbkBwYXJhbSB7T2JqZWN0fSBbYW5pbWF0aW9uT3B0aW9uc10gVGhlIGFuaW1hdGlvbiBvcHRpb25zIHRvIHVzZS5cblxuIyMjXG5VdGlscy5zdGFjayA9IChsYXllcnMgPSBbXSwgZGlzdGFuY2UgPSAwLCBheGlzID0gXCJ2ZXJ0aWNhbFwiLCBhbmltYXRlID0gZmFsc2UsIGFuaW1hdGlvbk9wdGlvbnMgPSB7fSkgLT5cblx0cmV0dXJuIGlmIGxheWVycy5sZW5ndGggPD0gMVxuXG5cdGlmIGF4aXMgaXMgXCJ2ZXJ0aWNhbFwiIG9yIGF4aXMgaXMgXCJ5XCJcblx0XHRVdGlscy5vZmZzZXRZKGxheWVycywgZGlzdGFuY2UsIGFuaW1hdGUsIGFuaW1hdGlvbk9wdGlvbnMpXG5cdGVsc2UgaWYgYXhpcyBpcyBcImhvcml6b250YWxcIiBvciBheGlzIGlzIFwieFwiXG5cdFx0VXRpbHMub2Zmc2V0WChsYXllcnMsIGRpc3RhbmNlLCBhbmltYXRlLCBhbmltYXRpb25PcHRpb25zKVxuXG5cdHJldHVybiBsYXllcnNcblxuXG4jIyNcbk9mZnNldCBhbiBhcnJheSBvZiBsYXllcnMgdmVydGljYWxseS5cblxuQHBhcmFtIHtBcnJheX0gbGF5ZXJzIFRoZSBhcnJheSBvZiBsYXllcnMgdG8gb2Zmc2V0LlxuQHBhcmFtIHtOdW1iZXJ9IGRpc3RhbmNlIFRoZSBkaXN0YW5jZSBiZXR3ZWVuIGVhY2ggbGF5ZXIuXG5AcGFyYW0ge0Jvb2xlYW59IFthbmltYXRlXSBXaGV0aGVyIHRvIGFuaW1hdGUgbGF5ZXJzIHRvIHRoZSBuZXcgcG9zaXRpb24uXG5AcGFyYW0ge09iamVjdH0gW2FuaW1hdGlvbk9wdGlvbnNdIFRoZSBhbmltYXRpb24gb3B0aW9ucyB0byB1c2UuXG5cblx0VXRpbHMuYWxpZ24gW2xheWVyQSwgbGF5ZXJCXSxcblx0XHR4OiAyMDBcblxuXHRVdGlscy5hbGlnbiBbbGF5ZXJBLCBsYXllckJdLFxuXHRcdHg6IDIwMFxuXHRcdHRydWVcblx0XHR0aW1lOiAuNVxuIyMjXG5VdGlscy5vZmZzZXRZID0gKGxheWVycyA9IFtdLCBkaXN0YW5jZSA9IDAsIGFuaW1hdGUgPSBmYWxzZSwgYW5pbWF0aW9uT3B0aW9ucyA9IHt9KSAtPiBcblx0cmV0dXJuIGlmIGxheWVycy5sZW5ndGggPD0gMVxuXG5cdHN0YXJ0WSA9IGxheWVyc1swXS55XG5cdHZhbHVlcyA9IFtdXG5cdHZhbHVlcyA9IGxheWVycy5tYXAgKGxheWVyLCBpKSAtPlxuXHRcdHYgPSB7eTogc3RhcnRZfVxuXHRcdHN0YXJ0WSArPSBsYXllci5oZWlnaHQgKyBkaXN0YW5jZVxuXHRcdHJldHVybiB2XG5cdFx0XG5cdGZvciBsYXllciwgaSBpbiBsYXllcnNcblx0XHRpZiBhbmltYXRlXG5cdFx0XHRsYXllci5hbmltYXRlIHZhbHVlc1tpXSwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdGVsc2Vcblx0XHRcdF8uYXNzaWduIGxheWVyLCB2YWx1ZXNbaV1cblxuXHRyZXR1cm4gbGF5ZXJzXG5cbiMjI1xuT2Zmc2V0IGFuIGFycmF5IG9mIGxheWVycyBob3Jpem9udGFsbHkuXG5cbkBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSBvZiBsYXllcnMgdG8gb2Zmc2V0LlxuQHBhcmFtIHtOdW1iZXJ9IGRpc3RhbmNlIFRoZSBkaXN0YW5jZSBiZXR3ZWVuIGVhY2ggbGF5ZXIuXG5AcGFyYW0ge0Jvb2xlYW59IFthbmltYXRlXSBXaGV0aGVyIHRvIGFuaW1hdGUgbGF5ZXJzIHRvIHRoZSBuZXcgcG9zaXRpb24uXG5AcGFyYW0ge09iamVjdH0gW2FuaW1hdGlvbk9wdGlvbnNdIFRoZSBhbmltYXRpb24gb3B0aW9ucyB0byB1c2UuXG5cblx0VXRpbHMuYWxpZ24gW2xheWVyQSwgbGF5ZXJCXSxcblx0XHR4OiAyMDBcblxuXHRVdGlscy5hbGlnbiBbbGF5ZXJBLCBsYXllckJdLFxuXHRcdHg6IDIwMFxuXHRcdHRydWVcblx0XHR0aW1lOiAuNVxuIyMjXG5VdGlscy5vZmZzZXRYID0gKGxheWVycyA9IFtdLCBkaXN0YW5jZSA9IDAsIGFuaW1hdGUgPSBmYWxzZSwgYW5pbWF0aW9uT3B0aW9ucyA9IHt9KSAtPiBcblx0cmV0dXJuIGlmIGxheWVycy5sZW5ndGggPD0gMVxuXG5cdHN0YXJ0WCA9IGxheWVyc1swXS54XG5cdHZhbHVlcyA9IFtdXG5cdHZhbHVlcyA9IGxheWVycy5tYXAgKGxheWVyLCBpKSAtPlxuXHRcdHYgPSB7eDogc3RhcnRYfVxuXHRcdHN0YXJ0WCArPSBsYXllci53aWR0aCArIGRpc3RhbmNlXG5cdFx0cmV0dXJuIHZcblx0XHRcblx0Zm9yIGxheWVyLCBpIGluIGxheWVyc1xuXHRcdGlmIGFuaW1hdGVcblx0XHRcdGxheWVyLmFuaW1hdGUgdmFsdWVzW2ldLCBhbmltYXRpb25PcHRpb25zXG5cdFx0ZWxzZVxuXHRcdFx0Xy5hc3NpZ24gbGF5ZXIsIHZhbHVlc1tpXVxuXG5cdHJldHVybiBsYXllcnNcblxuIyBDcmVhdGUgYSB0aW1lciBpbnN0YW5jZSB0byBzaW1wbGlmeSBpbnRlcnZhbHMuXG4jIFRoYW5rcyB0byBodHRwczovL2dpdGh1Yi5jb20vbWFyY2tyZW5uLlxuI1xuIyBAZXhhbXBsZVxuI1xuIyB0aW1lciA9IG5ldyBVdGlscy50aW1lcigxLCAtPiBwcmludCAnaGVsbG8gd29ybGQhJylcbiMgVXRpbHMuZGVsYXkgNSwgLT4gdGltZXIucGF1c2UoKVxuIyBVdGlscy5kZWxheSA4LCAtPiB0aW1lci5yZXN1bWUoKVxuIyBVdGlscy5kZWxheSAxMCwgLT4gdGltZXIucmVzdGFydCgpXG4jXG5VdGlscy5UaW1lciA9IGNsYXNzIFRpbWVyXG5cdGNvbnN0cnVjdG9yOiAodGltZSwgZikgLT5cblx0XHRAcGF1c2VkID0gZmFsc2Vcblx0XHRAc2F2ZVRpbWUgPSBudWxsXG5cdFx0QHNhdmVGdW5jdGlvbiA9IG51bGxcblxuXHRcdGlmIHRpbWU/IGFuZCBmP1xuXHRcdFx0QHN0YXJ0KHRpbWUsIGYpXG5cdFxuXHRzdGFydDogKHRpbWUsIGYpID0+XG5cdFx0QHNhdmVUaW1lID0gdGltZVxuXHRcdEBzYXZlRnVuY3Rpb24gPSBmXG5cblx0XHRmKClcblx0XHRwcm94eSA9ID0+IGYoKSB1bmxlc3MgQHBhdXNlZFxuXHRcdHVubGVzcyBAcGF1c2VkXG5cdFx0XHRAX2lkID0gdGltZXIgPSBVdGlscy5pbnRlcnZhbCh0aW1lLCBwcm94eSlcblx0XHRlbHNlIHJldHVyblxuXHRcblx0cGF1c2U6ICAgPT4gQHBhdXNlZCA9IHRydWVcblx0cmVzdW1lOiAgPT4gQHBhdXNlZCA9IGZhbHNlXG5cdHJlc2V0OiAgID0+IGNsZWFySW50ZXJ2YWwoQF9pZClcblx0cmVzdGFydDogPT4gXG5cdFx0Y2xlYXJJbnRlcnZhbChAX2lkKVxuXHRcdFV0aWxzLmRlbGF5IDAsID0+IEBzdGFydChAc2F2ZVRpbWUsIEBzYXZlRnVuY3Rpb24pXG5cblxuIyMjXG5BIGNsYXNzIHRvIG1hbmFnZSBzdGF0ZXMgb2YgbXVsdGlwbGUgVGV4dExheWVycywgd2hpY2ggXCJvYnNlcnZlXCIgdGhlIHN0YXRlLiBcbldoZW4gdGhlIHN0YXRlIGNoYW5nZXMsIHRoZSBTdGF0ZU1hbmFnZXIgd2lsbCB1cGRhdGUgYWxsIFwib2JzZXJ2ZXJcIiBUZXh0TGF5ZXJzLFxuYXBwbHlpbmcgdGhlIG5ldyBzdGF0ZSB0byBlYWNoIFRleHRMYXllcidzIHRlbXBsYXRlIHByb3BlcnR5LlxuXG5AcGFyYW0ge0FycmF5fSBbbGF5ZXJzXSBUaGUgbGF5ZXJzIHRvIG9ic2VydmUgdGhlIHN0YXRlLlxuQHBhcmFtIHtPYmplY3R9IFtzdGF0ZV0gVGhlIGluaXRpYWwgc3RhdGUuXG5cblx0c3RhdGVNZ3IgPSBuZXcgVXRpbHMuU3RhdGVNYW5hZ2VyLCBteUxheWVyc1xuXHRcdGZpcnN0TmFtZTogXCJEYXZpZFwiXG5cdFx0bGFzdE5hbWU6IFwiQXR0ZW5ib3JvdWdoXCJcblxuXHRzdGF0ZU1nci5zZXRTdGF0ZVxuXHRcdGZpcnN0TmFtZTogXCJTaXIgRGF2aWRcIlxuXG4jIyNcblV0aWxzLlN0YXRlTWFuYWdlciA9IGNsYXNzIFN0YXRlTWFuYWdlclxuXHRjb25zdHJ1Y3RvcjogKGxheWVycyA9IFtdLCBzdGF0ZSA9IHt9KSAtPlxuXHRcdFxuXHRcdEBfc3RhdGUgPSBzdGF0ZVxuXHRcdEBfb2JzZXJ2ZXJzID0gbGF5ZXJzXG5cdFx0XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5IEAsXG5cdFx0XHRcIm9ic2VydmVyc1wiLFxuXHRcdFx0Z2V0OiAtPiByZXR1cm4gQF9vYnNlcnZlcnNcblx0XHRcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkgQCxcblx0XHRcdFwic3RhdGVcIixcblx0XHRcdGdldDogLT4gcmV0dXJuIEBfc3RhdGVcblx0XHRcdHNldDogKG9iaikgLT5cblx0XHRcdFx0aWYgdHlwZW9mIG9iaiBpc250IFwib2JqZWN0XCJcblx0XHRcdFx0XHR0aHJvdyBcIlN0YXRlIG11c3QgYmUgYW4gb2JqZWN0LlwiXG5cdFx0XHRcdFxuXHRcdFx0XHRAc2V0U3RhdGUob2JqKVxuXG5cdFx0QF91cGRhdGVTdGF0ZSgpXG5cblx0X3VwZGF0ZVN0YXRlOiA9PlxuXHRcdEBvYnNlcnZlcnMuZm9yRWFjaCAobGF5ZXIpID0+XG5cdFx0XHRsYXllci50ZW1wbGF0ZSA9IEBzdGF0ZVxuXHRcblx0YWRkT2JzZXJ2ZXI6IChsYXllcikgLT5cblx0XHRAX29ic2VydmVycy5wdXNoKGxheWVyKVxuXHRcdGxheWVyLnRlbXBsYXRlID0gQHN0YXRlXG5cdFx0XG5cdHJlbW92ZU9ic2VydmVyOiAobGF5ZXIpIC0+XG5cdFx0Xy5wdWxsKEBfb2JzZXJ2ZXJzLCBsYXllcilcblx0XG5cdHNldFN0YXRlOiAob3B0aW9ucyA9IHt9KSAtPiBcblx0XHRfLm1lcmdlKEBfc3RhdGUsIG9wdGlvbnMpXG5cdFx0QF91cGRhdGVTdGF0ZSgpXG5cdFx0XG5cdFx0cmV0dXJuIEBfc3RhdGVcblxuIyBhcnJhbmdlIGxheWVycyBpbiBhbiBhcnJheSBpbnRvIGEgZ3JpZCwgdXNpbmcgYSBzZXQgbnVtYmVyIG9mIGNvbHVtbnMgYW5kIHJvdy9jb2x1bW4gbWFyZ2luc1xuIyBAZXhhbXBsZSAgICBVdGlscy5ncmlkKGxheWVycywgNClcblV0aWxzLmdyaWQgPSAoYXJyYXkgPSBbXSwgY29scyA9IDQsIHJvd01hcmdpbiA9IDE2LCBjb2xNYXJnaW4pIC0+XG5cdFxuXHRnID1cblx0XHR4OiBhcnJheVswXS54XG5cdFx0eTogYXJyYXlbMF0ueVxuXHRcdGNvbHM6IGNvbHNcblx0XHRoZWlnaHQ6IF8ubWF4QnkoYXJyYXksICdoZWlnaHQnKT8uaGVpZ2h0XG5cdFx0d2lkdGg6IF8ubWF4QnkoYXJyYXksICd3aWR0aCcpPy53aWR0aFxuXHRcdHJvd01hcmdpbjogcm93TWFyZ2luID8gMFxuXHRcdGNvbHVtbk1hcmdpbjogY29sTWFyZ2luID8gcm93TWFyZ2luID8gMFxuXHRcdHJvd3M6IFtdXG5cdFx0Y29sdW1uczogW11cblx0XHRsYXllcnM6IFtdXG5cblx0XHRhcHBseTogKGZ1bmMpIC0+XG5cdFx0XHRmb3IgbGF5ZXIgaW4gQGxheWVyc1xuXHRcdFx0XHRVdGlscy5idWlsZChsYXllciwgZnVuYylcblxuXHRcdCMgZ2V0IGEgc3BlY2lmaWVkIGNvbHVtblxuXHRcdGdldENvbHVtbjogKGxheWVyKSAtPiBcblx0XHRcdHJldHVybiBAY29sdW1ucy5pbmRleE9mKF8uZmluZChAY29sdW1ucywgKGMpIC0+IF8uaW5jbHVkZXMoYywgbGF5ZXIpKSlcblxuXHRcdCMgZ2V0IGEgc3BlY2lmaWVkIHJvd1xuXHRcdGdldFJvdzogKGxheWVyKSAtPiBcblx0XHRcdHJldHVybiBAcm93cy5pbmRleE9mKF8uZmluZChAcm93cywgKHIpIC0+IF8uaW5jbHVkZXMociwgbGF5ZXIpKSlcblxuXHRcdCMgZ2V0IGEgbGF5ZXIgYXQgYSBzcGVjaWZpZWQgZ3JpZCBwb3NpdGlvbnNcblx0XHRnZXRMYXllcjogKHJvdywgY29sKSAtPiBcblx0XHRcdHJldHVybiBAcm93c1tyb3ddW2NvbF1cblxuXHRcdCMgcmV0dXJuIGEgcmFuZG9tIGxheWVyIGZyb20gdGhlIGdyaWRcblx0XHRnZXRSYW5kb206IC0+IFxuXHRcdFx0cmV0dXJuIF8uc2FtcGxlKF8uc2FtcGxlKEByb3dzKSlcblxuXHRcdCMgYWRkIGEgbmV3IGxheWVyIHRvIHRoZSBncmlkLCBvcHRpb25hbGx5IGF0IGEgc3BlY2lmaWVkIHBvc2l0aW9uXG5cdFx0YWRkOiAobGF5ZXIsIGkgPSBAbGF5ZXJzLmxlbmd0aCwgYW5pbWF0ZSA9IGZhbHNlKSAtPlxuXG5cdFx0XHRpZiBub3QgbGF5ZXI/XG5cdFx0XHRcdGxheWVyID0gQGxheWVyc1swXS5jb3B5U2luZ2xlKClcblx0XHRcdFxuXHRcdFx0bGF5ZXIucGFyZW50ID0gQGxheWVyc1swXS5wYXJlbnRcblxuXHRcdFx0QGxheWVycy5zcGxpY2UoaSwgMCwgbGF5ZXIpXG5cdFx0XHRcblx0XHRcdEBfcmVmcmVzaChAbGF5ZXJzLCBhbmltYXRlKVxuXG5cdFx0XHRyZXR1cm4gbGF5ZXJcblx0XHRcblx0XHQjIHJlbW92ZSBhIGxheWVyIGZyb20gdGhlIGdyaWRcblx0XHRyZW1vdmU6IChsYXllciwgYW5pbWF0ZSkgLT5cblx0XHRcdEBfcmVmcmVzaChfLndpdGhvdXQoQGxheWVycywgbGF5ZXIpLCBhbmltYXRlKVxuXHRcdFx0bGF5ZXIuZGVzdHJveSgpXG5cblx0XHRcdHJldHVybiBAXG5cblx0XHQjIGNsZWFyIGFuZCByZS1maWxsIGFycmF5cywgdGhlbiBidWlsZFxuXHRcdF9yZWZyZXNoOiAobGF5ZXJzLCBhbmltYXRlKSAtPlxuXHRcdFx0QHJvd3MgPSBbXVxuXHRcdFx0QGNvbHVtbnMgPSBbXVxuXHRcdFx0QGxheWVycyA9IGxheWVyc1xuXG5cdFx0XHRAX2J1aWxkKGFuaW1hdGUpXG5cblx0XHQjIHB1dCB0b2dldGhlciB0aGUgZ3JpZFxuXHRcdF9idWlsZDogKGFuaW1hdGUgPSBmYWxzZSkgLT5cblx0XHRcdGZvciBsYXllciwgaSBpbiBAbGF5ZXJzXG5cdFx0XHRcdGNvbCA9IGkgJSBjb2xzXG5cdFx0XHRcdHJvdyA9IE1hdGguZmxvb3IoaSAvIGNvbHMpXG5cdFx0XHRcdFxuXHRcdFx0XHRAcm93c1tyb3ddID89IFtdIFxuXHRcdFx0XHRAcm93c1tyb3ddLnB1c2gobGF5ZXIpXG5cdFx0XHRcdFxuXHRcdFx0XHRAY29sdW1uc1tjb2xdID89IFtdXG5cdFx0XHRcdEBjb2x1bW5zW2NvbF0ucHVzaChsYXllcilcblx0XHRcdFx0XG5cdFx0XHRcdGlmIGFuaW1hdGVcblx0XHRcdFx0XHRsYXllci5hbmltYXRlXG5cdFx0XHRcdFx0XHR4OiBAeCArIChjb2wgKiAoQHdpZHRoICsgQGNvbHVtbk1hcmdpbikpXG5cdFx0XHRcdFx0XHR5OiBAeSArIChyb3cgKiAoQGhlaWdodCArIEByb3dNYXJnaW4pKVxuXHRcdFx0XHRcdGNvbnRpbnVlXG5cblx0XHRcdFx0Xy5hc3NpZ24gbGF5ZXIsXG5cdFx0XHRcdFx0eDogQHggKyAoY29sICogKEB3aWR0aCArIEBjb2x1bW5NYXJnaW4pKVxuXHRcdFx0XHRcdHk6IEB5ICsgKHJvdyAqIChAaGVpZ2h0ICsgQHJvd01hcmdpbikpXG5cdFxuXHRnLl9yZWZyZXNoKGFycmF5KVxuXG5cdHJldHVybiBnXG5cblxuIyBtYWtlIGEgZ3JpZCBvdXQgb2YgYSBsYXllciwgY29weWluZyB0aGUgbGF5ZXIgdG8gZmlsbCByb3dzXG4jIEBleGFtcGxlICAgIFV0aWxzLm1ha2VHcmlkKGxheWVyLCAyLCA0LCA4LCA4KVxuVXRpbHMubWFrZUdyaWQgPSAobGF5ZXIsIGNvbHMgPSA0LCByb3dzID0gMSwgcm93TWFyZ2luLCBjb2xNYXJnaW4pIC0+XG5cdGxheWVycyA9IFtsYXllcl1cblx0XG5cdGZvciBpIGluIF8ucmFuZ2UoKGNvbHMgKiByb3dzKSAtIDEpXG5cdFx0bGF5ZXJzW2kgKyAxXSA9IGxheWVyLmNvcHkoKVxuXHRcdGxheWVyc1tpICsgMV0ucGFyZW50ID0gbGF5ZXIucGFyZW50XG5cdFx0XG5cdGcgPSBVdGlscy5ncmlkKGxheWVycywgY29scywgcm93TWFyZ2luLCBjb2xNYXJnaW4pXG5cdFxuXHRyZXR1cm4gZ1xuXG5cblxuIyMjXG5DaGFuZ2UgYSBsYXllcidzIHNpemUgdG8gZml0IGFyb3VuZCB0aGUgbGF5ZXIncyBjaGlsZHJlbi5cblxuQHBhcmFtIHtMYXllcn0gbGF5ZXIgVGhlIHBhcmVudCBsYXllciB0byBjaGFuZ2Uub3NpdGlvbi5cbkBwYXJhbSB7T2JqZWN0fSBbcGFkZGluZ10gVGhlIHBhZGRpbmcgdG8gdXNlIGZvciB0aGUgaHVnLlxuXG5cdFV0aWxzLmh1ZyhsYXllckEpXG5cblx0VXRpbHMuaHVnKGxheWVyQSwgMzIpXG5cblx0VXRpbHMuaHVnKGxheWVyQSwge3RvcDogMTYsIGJvdHRvbTogMjR9KVxuIyMjXG5VdGlscy5odWcgPSAobGF5ZXIsIHBhZGRpbmcpIC0+XG5cblx0ZGVmID0gMFxuXHRkZWZTdGFjayA9IHVuZGVmaW5lZFxuXG5cdGlmIHR5cGVvZiBwYWRkaW5nIGlzIFwibnVtYmVyXCIgXG5cdFx0ZGVmID0gcGFkZGluZ1xuXHRcdGRlZlN0YWNrID0gcGFkZGluZ1xuXHRcdHBhZGRpbmcgPSB7fVxuXG5cdF8uZGVmYXVsdHMgcGFkZGluZyxcblx0XHR0b3A6IGRlZlxuXHRcdGJvdHRvbTogZGVmXG5cdFx0bGVmdDogZGVmXG5cdFx0cmlnaHQ6IGRlZlxuXHRcdHN0YWNrOiBkZWZTdGFja1xuXG5cdFV0aWxzLmJpbmQgbGF5ZXIsIC0+XG5cdFx0Zm9yIGNoaWxkLCBpIGluIEBjaGlsZHJlblxuXG5cdFx0XHRjaGlsZC55ICs9IEBwYWRkaW5nLnRvcFxuXG5cdFx0XHRjaGlsZC54ICs9IEBwYWRkaW5nLmxlZnRcblxuXHRcdFx0aWYgQHBhZGRpbmcucmlnaHQ/ID4gMFxuXHRcdFx0XHRAd2lkdGggPSBfLm1heEJ5KEBjaGlsZHJlbiwgJ21heFknKT8ubWF4WSArIEBwYWRkaW5nLnJpZ2h0XG5cblx0XHRpZiBAcGFkZGluZy5zdGFjaz8gPj0gMFxuXHRcdFx0VXRpbHMub2Zmc2V0WShAY2hpbGRyZW4sIEBwYWRkaW5nLnN0YWNrKVxuXHRcdFx0VXRpbHMuZGVsYXkgMCwgPT5cblx0XHRcdFx0VXRpbHMuY29udGFpbihALCBmYWxzZSwgQHBhZGRpbmcucmlnaHQsIEBwYWRkaW5nLmJvdHRvbSlcblx0XHRcdHJldHVyblxuXG5cdFx0VXRpbHMuY29udGFpbihALCBmYWxzZSwgQHBhZGRpbmcucmlnaHQsIEBwYWRkaW5nLmJvdHRvbSlcblxuXG4jIyNcbkluY3JlYXNlIG9yIGRlY3JlYXNlIGEgbGF5ZXIncyBzaXplIHRvIGNvbnRhaW4gaXRzIGxheWVyJ3MgY2hpbGRyZW4uXG5cbkBwYXJhbSB7TGF5ZXJ9IGxheWVyIFRoZSBwYXJlbnQgbGF5ZXIgdG8gY2hhbmdlIHNpemUuXG5AcGFyYW0ge0Jvb2xlYW59IGZpdCBXaGV0aGVyIHRvIGxpbWl0IHNpemUgY2hhbmdlIHRvIGluY3JlYXNlIG9ubHkuXG5AcGFyYW0ge051bWJlcn0gcGFkZGluZ1ggRXh0cmEgc3BhY2UgdG8gYWRkIHRvIHRoZSByaWdodCBzaWRlIG9mIHRoZSBuZXcgc2l6ZS5cbkBwYXJhbSB7TnVtYmVyfSBwYWRkaW5nWSBFeHRyYSBzcGFjZSB0byBhZGQgdG8gdGhlIGJvdHRvbSBvZiB0aGUgbmV3IHNpemUuXG5cblx0VXRpbHMuY29udGFpbihsYXllckEpXG4jIyNcblV0aWxzLmNvbnRhaW4gPSAobGF5ZXIsIGZpdCA9IGZhbHNlLCBwYWRkaW5nWCA9IDAsIHBhZGRpbmdZID0gMCkgLT5cblx0cmV0dXJuIGlmIGxheWVyLmNoaWxkcmVuLmxlbmd0aCBpcyAwXG5cblx0bWF4Q2hpbGRYID0gXy5tYXhCeShsYXllci5jaGlsZHJlbiwgJ21heFgnKT8ubWF4WCArIHBhZGRpbmdYXG5cdG1heENoaWxkWSA9IF8ubWF4QnkobGF5ZXIuY2hpbGRyZW4sICdtYXhZJyk/Lm1heFkgKyBwYWRkaW5nWVxuXG5cdGlmIGZpdFxuXHRcdGxheWVyLnByb3BzID0gXG5cdFx0XHR3aWR0aDogTWF0aC5tYXgobGF5ZXIud2lkdGgsIG1heENoaWxkWClcblx0XHRcdGhlaWdodDogTWF0aC5tYXgobGF5ZXIuaGVpZ2h0LCBtYXhDaGlsZFkpXG5cdFx0cmV0dXJuIFxuXG5cdGxheWVyLnByb3BzID0gXG5cdFx0d2lkdGg6IG1heENoaWxkWFxuXHRcdGhlaWdodDogbWF4Q2hpbGRZXG5cblx0cmV0dXJuIGxheWVyXG5cbiMgZ2V0IGEgc3RhdHVzIGNvbG9yIGJhc2VkIG9uIGEgc3RhbmRhcmQgZGV2aWF0aW9uXG4jIEBleGFtcGxlICAgIFV0aWxzLmdldFN0YXR1c0NvbG9yKC4wNCwgZmFsc2UpXG5VdGlscy5nZXRTdGF0dXNDb2xvciA9IChkZXYsIGxvd2VyQmV0dGVyID0gZmFsc2UpIC0+XG5cdFxuXHRjb2xvcnMgPSBbJyNlYzQ3NDEnLCAnI2Y0ODg0NycsICcjZmZjODRhJywgJyNhN2M1NGInLCAnIzRmYmY0ZiddXG5cdFxuXHRpZiBsb3dlckJldHRlciB0aGVuIGRldiA9IC1kZXZcblx0XG5cdGNvbG9yID0gVXRpbHMubW9kdWxhdGUoZGV2LCBbLS4xLCAwLjFdLCBbMCwgY29sb3JzLmxlbmd0aCAtIDFdLCBmYWxzZSlcblx0XG5cdHJldHVybiBjb2xvcnNbY29sb3IudG9GaXhlZCgpXVxuXG5cbiMgQ2hhaW4gYW4gYXJyYXkgb2YgYW5pbWF0aW9ucywgb3B0aW9uYWxseSBsb29waW5nIHRoZW1cbiMgQGV4YW1wbGUgICAgVXRpbHMuY2hhaW5BbmltYXRpb25zKFthcnJheU9mQW5pbWF0aW9uc10sIGZhbHNlKVxuVXRpbHMuY2hhaW5BbmltYXRpb25zID0gKGFuaW1hdGlvbnMuLi4pIC0+XG5cdGxvb3BpbmcgPSB0cnVlXG5cdFxuXHRpZiB0eXBlb2YgXy5sYXN0KGFuaW1hdGlvbnMpIGlzIFwiYm9vbGVhblwiXG5cdFx0bG9vcGluZyA9IGFuaW1hdGlvbnMucG9wKClcblx0XG5cdGogPSBhbmltYXRpb25zLmxlbmd0aCAtIDFcblx0Zm9yIGFuaW0sIGkgaW4gYW5pbWF0aW9uc1xuXHRcdGRvIChpLCBhbmltYXRpb25zKSAtPlxuXHRcdFx0aWYgYW5pbSBpcyBhbmltYXRpb25zW2pdIGFuZCBsb29waW5nXG5cdFx0XHRcdGFuaW0ub25BbmltYXRpb25FbmQgLT5cblx0XHRcdFx0XHRhbmltYXRpb25zWzBdPy5yZXNldCgpXG5cdFx0XHRcdFx0VXRpbHMuZGVsYXkgMCwgLT4gYW5pbWF0aW9uc1swXT8uc3RhcnQoKVxuXHRcdFx0XG5cdFx0XHRhbmltLm9uQW5pbWF0aW9uRW5kIC0+XG5cdFx0XHRcdGFuaW1hdGlvbnNbaSArIDFdPy5yZXN0YXJ0KClcblx0XHRcblx0VXRpbHMuZGVsYXkgMCwgLT4gYW5pbWF0aW9uc1swXS5yZXN0YXJ0KClcblxuXG4jIENoZWNrIHdoZXRoZXIgYSBwb2ludCBleGlzdHMgd2l0aGluIGEgcG9seWdvbiwgZGVmaW5lZCBieSBhbiBhcnJheSBvZiBwb2ludHNcbiMgTm90ZTogdGhpcyByZXBsYWNlcyBGcmFtZXIncyBleGlzdGluZyAoYnV0IGJyb2tlbikgVXRpbHMucG9pbnRJblBvbHlnb24gbWV0aG9kLlxuIyBAZXhhbXBsZVx0VXRpbHMucG9pbnRJblBvbGd5Z29uKHt4OiAyLCB5OiAxMn0sIFtdKVxuVXRpbHMucG9pbnRJblBvbHlnb24gPSAocG9pbnQsIHZzID0gW10pIC0+XG5cblx0aWYgdnNbMF0ueD8gdGhlbiB2cyA9IF8ubWFwIHZzLCAocCkgLT4gW3AueCwgcC55XVxuXG5cdCMgZGV0ZXJtaW5lIHdoZXRoZXIgdG8gYW5hbHl6ZSBwb2ludHMgaW4gY291bnRlcmNsb2Nrd2lzZSBvcmRlclxuXHRjY3cgPSAoQSxCLEMpIC0+IHJldHVybiAoQ1sxXS1BWzFdKSooQlswXS1BWzBdKSA+IChCWzFdLUFbMV0pKihDWzBdLUFbMF0pXG5cblx0IyBkZXRlcm1pbmUgd2hldGhlciB0d28gbGluZXMgaW50ZXJzZWN0XG5cdGludGVyc2VjdCA9IChBLEIsQyxEKSAtPiByZXR1cm4gKGNjdyhBLEMsRCkgaXNudCBjY3coQixDLEQpKSBhbmQgKGNjdyhBLEIsQykgaXNudCBjY3coQSxCLEQpKVxuXHRcblx0aW5zaWRlID0gZmFsc2Vcblx0aSA9IDBcblx0aiA9IHZzLmxlbmd0aCAtIDFcblx0XG5cdHdoaWxlIGkgPCB2cy5sZW5ndGhcblx0XG5cdFx0aWYgaW50ZXJzZWN0KFstOTk5OTk5LCBwb2ludC55XSwgW3BvaW50LngsIHBvaW50LnldLCB2c1tpXSwgdnNbal0pXG5cdFx0XHRpbnNpZGUgPSAhaW5zaWRlXG5cdFx0aiA9IGkrK1xuXHRcblx0cmV0dXJuIGluc2lkZVxuXG4jIENoZWNrcyB3aGV0aGVyIGEgcG9pbnQgaXMgd2l0aGluIGEgTGF5ZXIncyBmcmFtZS4gV29ya3MgYmVzdCB3aXRoIGV2ZW50LmNvbnRleHRQb2ludCFcbiNcbiMgQGV4YW1wbGVcdFxuI1xuIyBsYXllci5vbk1vdXNlTW92ZSAoZXZlbnQpIC0+IFxuI1x0Zm9yIGJ1dHRvbkxheWVyIGluIGJ1dHRvbkxheWVyc1xuI1x0XHRwcmludCBVdGlscy5wb2ludEluTGF5ZXIoYnV0dG9uTGF5ZXIpXG4jXG5VdGlscy5wb2ludEluTGF5ZXIgPSAocG9pbnQsIGxheWVyKSAtPlxuXHRyZXR1cm4gVXRpbHMucG9pbnRJblBvbHlnb24ocG9pbnQsIFV0aWxzLnBvaW50c0Zyb21GcmFtZShsYXllcikpXG5cblxuIyBHZXQgdGhlIGxheWVyIHVuZGVyIGEgc2NyZWVuIHBvaW50LiBJZiBtdWx0aXBsZSBsYXllcnMgb3ZlcmxhcCwgbGF5ZXJzIG92ZXJsYXBwZWRcbiMgYnkgdGhlaXIgY2hpbGRyZW4gd2lsbCBiZSBpZ25vcmVkLCBhbmQgdGhlIGxheWVyIHdpdGggdGhlIGhpZ2hlc3QgaW5kZXggd2lsbCBiZVxuIyByZXR1cm5lZC4gV29ya3MgYmVzdCB3aXRoIGV2ZW50LmNvbnRleHRQb2ludCFcbiNcbiMgQGV4YW1wbGVcdFxuI1xuIyBteUxheWVyLm9uTW91c2VNb3ZlIChldmVudCkgLT4gXG4jXHRwcmludCBVdGlscy5nZXRMYXllckF0UG9pbnQoZXZlbnQuY29udGV4dFBvaW50KVxuI1xuVXRpbHMuZ2V0TGF5ZXJBdFBvaW50ID0gKHBvaW50LCBhcnJheSA9IEZyYW1lci5DdXJyZW50Q29udGV4dC5fbGF5ZXJzKSAtPlxuXHR1bmRlciA9IFV0aWxzLmdldExheWVyc0F0UG9pbnQoZXZlbnQucG9pbnQsIGFycmF5KVxuXHRcblx0dmFsaWQgPSBbXVxuXG5cdGZvciBsYXllciBpbiB1bmRlclxuXHRcdGlmIF8uaW50ZXJzZWN0aW9uKHVuZGVyLCBsYXllci5jaGlsZHJlbikubGVuZ3RoID4gMFxuXHRcdFx0Y29udGludWVcblx0XHR2YWxpZC5wdXNoKGxheWVyKVxuXG5cdHJldHVybiBfLm1heEJ5KHZhbGlkLCAnaW5kZXgnKSA/IG51bGxcblxuIyBHZXQgYW4gYXJyYXkgb2YgYWxsIGxheWVycyB1bmRlciBhIHNjcmVlbiBwb2ludC4gQnkgZGVmYXVsdCwgaXQgd2lsbCBjaGVjayBcbiMgYWxsIGxheWVycyBpbiB0aGUgY3VycmVudCBGcmFtZXIgY29udGV4dDsgYnV0IHlvdSBjYW4gc3BlY2lmeSB5b3VyIG93biBhcnJheSBvZlxuIyBsYXllcnMgaW5zdGVhZC4gV29ya3MgYmVzdCB3aXRoIGV2ZW50LmNvbnRleHRQb2ludCFcbiNcbiMgQGV4YW1wbGVcdFxuI1xuIyBteUxheWVyLm9uTW91c2VNb3ZlIChldmVudCkgLT4gXG4jXHRwcmludCBVdGlscy5nZXRMYXllcnNBdFBvaW50KGV2ZW50LmNvbnRleHRQb2ludClcbiNcblV0aWxzLmdldExheWVyc0F0UG9pbnQgPSAocG9pbnQsIGFycmF5ID0gRnJhbWVyLkN1cnJlbnRDb250ZXh0Ll9sYXllcnMpIC0+XG5cdFxuXHRsYXllcnMgPSBbXVxuXHRcblx0Zm9yIGxheWVyLCBpIGluIGFycmF5XG5cdFx0aWYgVXRpbHMucG9pbnRJblBvbHlnb24ocG9pbnQsIFV0aWxzLnBvaW50c0Zyb21GcmFtZShsYXllcikpXG5cdFx0XHRsYXllcnMucHVzaChsYXllcilcblx0XHRcdFxuXHRyZXR1cm4gbGF5ZXJzXG5cbiMgVHJ5IHRvIGZpbmQgdGhlIGxheWVyIHRoYXQgb3ducyBhIGdpdmVuIEhUTUwgZWxlbWVudC4gQnkgZGVmYXVsdCwgaXQgd2lsbCBjaGVjayBcbiMgYWxsIGxheWVycyBpbiB0aGUgY3VycmVudCBGcmFtZXIgY29udGV4dDsgYnV0IHlvdSBjYW4gc3BlY2lmeSB5b3VyIG93biBhcnJheSBvZlxuIyBsYXllcnMgaW5zdGVhZC5cbiNcbiMgQGV4YW1wbGVcdFxuI1xuIyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vtb3ZlXCIsIChldmVudCkgLT4gXG4jXHRwcmludCBVdGlscy5nZXRMYXllckZyb21FbGVtZW50KGV2ZW50LnRhcmdldClcbiNcblV0aWxzLmdldExheWVyRnJvbUVsZW1lbnQgPSAoZWxlbWVudCwgYXJyYXkgPSBGcmFtZXIuQ3VycmVudENvbnRleHQuX2xheWVycykgPT5cblx0cmV0dXJuIGlmIG5vdCBlbGVtZW50XG5cdFxuXHRmaW5kTGF5ZXJFbGVtZW50ID0gKGVsZW1lbnQpIC0+XG5cdFx0cmV0dXJuIGlmIG5vdCBlbGVtZW50Py5jbGFzc0xpc3Rcblx0XHRcblx0XHRpZiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZnJhbWVyTGF5ZXInKVxuXHRcdFx0cmV0dXJuIGVsZW1lbnRcblx0XHRcdFxuXHRcdGZpbmRMYXllckVsZW1lbnQoZWxlbWVudC5wYXJlbnROb2RlKVxuXHRcblx0bGF5ZXJFbGVtZW50ID0gZmluZExheWVyRWxlbWVudChlbGVtZW50KVxuXHRyZXR1cm4gXy5maW5kKGFycmF5LCAobCkgLT4gbC5fZWxlbWVudCBpcyBsYXllckVsZW1lbnQpID8gbnVsbFxuXG4jIEdldCBhbiBvcmRpbmFsIGZvciBhIGRhdGVcbiNcbiMgQGV4YW1wbGVcdFxuI1xuIyBudW0gPSAyXG4jIGRhdGUudGV4dCA9IG51bSArIFV0aWxzLmdldE9yZGluYWwobnVtKVxuI1xuVXRpbHMuZ2V0T3JkaW5hbCA9IChudW1iZXIpIC0+XG5cdHN3aXRjaCBudW1iZXIgJSAxMFx0XG5cdFx0d2hlbiAxIHRoZW4gcmV0dXJuICdzdCdcdFxuXHRcdHdoZW4gMiB0aGVuIHJldHVybiAnbmQnXHRcblx0XHR3aGVuIDMgdGhlbiByZXR1cm4gJ3JkJ1x0XG5cdFx0ZWxzZSByZXR1cm4gJ3RoJ1xuXG4jIENvbnZlcnQgYSBudW1iZXIgdG8gdGhlIHJpZ2h0IG51bWJlciBvZiBwaXhlbHMuXG4jXG4jIEBleGFtcGxlXHRcbiNcbiMgbGF5ZXIuX2VsZW1lbnQuc3R5bGUuYm9yZGVyV2lkdGggPSBVdGlscy5weCg0KVxuI1xuVXRpbHMucHggPSAobnVtKSAtPlxuXHRyZXR1cm4gKG51bSAqIEZyYW1lci5EZXZpY2UuY29udGV4dC5zY2FsZSkgKyAncHgnXG5cbiMgTGluayBsYXllckIncyBwcm9wZXJ0eSB0byBhbHdheXMgbWF0Y2ggbGF5ZXJBJ3MgcHJvcGVydHkuXG4jXG4jIEBleGFtcGxlXHRcbiNcbiMgVXRpbHMubGlua1Byb3BlcnRpZXMobGF5ZXJBLCBsYXllckIsICd4JylcbiNcblV0aWxzLmxpbmtQcm9wZXJ0aWVzID0gKGxheWVyQSwgbGF5ZXJCLCBwcm9wcy4uLikgLT5cblx0cHJvcHMuZm9yRWFjaCAocHJvcCkgLT5cblx0XHR1cGRhdGUgPSAtPiBsYXllckJbcHJvcF0gPSBsYXllckFbcHJvcF1cblx0XHRsYXllckEub24gXCJjaGFuZ2U6I3twcm9wfVwiLCB1cGRhdGVcblx0XHR1cGRhdGUoKVxuXG5cblxuXG5cbiMgQ29weSB0ZXh0IHRvIHRoZSBjbGlwYm9hcmQuXG4jXG4jIEBleGFtcGxlXG4jIFV0aWxzLmNvcHlUZXh0VG9DbGlwYm9hcmQobXlUZXh0TGF5ZXIudGV4dClcbiNcblV0aWxzLmNvcHlUZXh0VG9DbGlwYm9hcmQgPSAodGV4dCkgLT5cblx0Y29weUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwidGV4dGFyZWFcIlxuXHRjb3B5RWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMFxuXG5cdGN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmcmFtZXJDb250ZXh0XCIpWzBdXG5cdGN0eC5hcHBlbmRDaGlsZChjb3B5RWxlbWVudClcblxuXHRjb3B5RWxlbWVudC52YWx1ZSA9IHRleHRcblx0Y29weUVsZW1lbnQuc2VsZWN0KClcblx0ZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKVxuXHRjb3B5RWxlbWVudC5ibHVyKClcblxuXHRjdHgucmVtb3ZlQ2hpbGQoY29weUVsZW1lbnQpXG5cbiMgUnVuIGEgVVJMIHRocm91Z2ggRnJhbWVyJ3MgQ09SU3Byb3h5LCB0byBwcmV2ZW50IGNyb3NzLW9yaWdpbiBpc3N1ZXMuXG4jIFRoYW5rcyB0byBAbWFyY2tyZW5uOiBodHRwczovL2dvby5nbC9VaEZ3OXlcbiNcbiMgQGV4YW1wbGVcbiMgZmV0Y2goVXRpbHMuQ09SU3Byb3h5KHVybCkpLnRoZW4oY2FsbGJhY2spXG4jXG5VdGlscy5DT1JTcHJveHkgPSAodXJsKSAtPlxuXG5cdCMgRGV0ZWN0IGxvY2FsIElQdjQvSXZQNiBhZGRyZXNzZXNcblx0IyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTEzMjczNDVcblx0cmVnZXhwID0gLyheMTI3XFwuKXwoXjE5MlxcLjE2OFxcLil8KF4xMFxcLil8KF4xNzJcXC4xWzYtOV1cXC4pfCheMTcyXFwuMlswLTldXFwuKXwoXjE3MlxcLjNbMC0xXVxcLil8KF46OjEkKXwoXltmRl1bY0NkRF0pL1xuXG5cdGlmIHJlZ2V4cC50ZXN0KHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSlcblx0XHRyZXR1cm4gXCJodHRwOi8vI3t3aW5kb3cubG9jYXRpb24uaG9zdH0vX3NlcnZlci9wcm94eS8je3VybH1cIlxuXHRcblx0cmV0dXJuIFwiaHR0cHM6Ly9jb3JzLWFueXdoZXJlLmhlcm9rdWFwcC5jb20vI3t1cmx9XCJcblxuIyBTZXQgdGhlIGF0dHJpYnV0ZXMgb2YgYSBET00gZWxlbWVudC5cbiNcbiMgQGV4YW1wbGVcbiMgVXRpbHMuc2V0QXR0cmlidXRlcyBteUhUTUxJbnB1dCwge2F1dG9jb3JyZWN0OiAnb2ZmJ31cbiNcblV0aWxzLnNldEF0dHJpYnV0ZXMgPSAoZWxlbWVudCwgYXR0cmlidXRlcyA9IHt9KSAtPlxuXHRmb3Iga2V5LCB2YWx1ZSBvZiBhdHRyaWJ1dGVzXG5cdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSlcblxuIyBVc2UgaW5saW5lIHN0eWxlcyB3aXRoIGEgVGV4dExheWVyLlxuI1xuIyBAZXhhbXBsZVxuIyBteVRleHRMYXllci50ZXh0ID0gXCJUaGlzIGlzIGEgKipib2xkKiogc3RhdGVtZW50LlwiXG4jIFV0aWxzLnRvTWFya2Rvd24obXlUZXh0TGF5ZXIpXG4jXG5VdGlscy50b01hcmtkb3duID0gKHRleHRMYXllcikgLT5cblx0XG5cdGlmIG5vdCB0ZXh0TGF5ZXIgaW5zdGFuY2VvZiBUZXh0TGF5ZXJcblx0XHR0aHJvdyBcIlV0aWxzLnRvTWFya2Rvd24gb25seSB3b3JrcyB3aXRoIFRleHRMYXllcnMuXCJcblxuXHRsb29wU3RyaW5nID0gKHN0cmluZywgcmVnKSAtPlxuXHRcdGlmIG5vdCBzdHJpbmcubWF0Y2gocmVnWzBdKVxuXHRcdFx0cmV0dXJuIHN0cmluZyBcblxuXHRcdGxvb3BTdHJpbmcoc3RyaW5nLnJlcGxhY2UocmVnWzBdLCByZWdbMV0pLCByZWcpXG5cblx0cmVnZXhlcyA9IFtcblx0XHRbL1xcWyhbXlxcW10rKVxcXVxcKChbXlxcKV0rKVxcKS8sICc8YSBocmVmPVxcJyQyXFwnPiQxPC9hPiddXG5cdFx0Wy8oXFwqXFwqfF9fKSguKj8pXFwxLywgJzxiPiQyPC9iPiddXG5cdFx0Wy8oXFwqfF8pKC4qPylcXDEvLCAnPGk+JDI8L2k+J11cblx0XHRbL1xcflxcfiguKj8pXFx+XFx+LywgJzxkZWw+JDE8L2RlbD4nXVxuXHRcdFsvYCguKj8pYC8sICc8Y29kZT4kMTwvY29kZT4nXVxuXHRcdF1cblxuXHRmb3IgZWwgaW4gdGV4dExheWVyLl9lbGVtZW50LmNoaWxkcmVuWzFdLmNoaWxkTm9kZXNcblx0XHRlbC5jaGlsZE5vZGVzWzBdLmlubmVySFRNTCA9IF8ucmVkdWNlKHJlZ2V4ZXMsIGxvb3BTdHJpbmcsIGVsLmNoaWxkTm9kZXNbMF0uaW5uZXJIVE1MKVxuXHRcblx0ZG8gXy5iaW5kKCAtPlxuXHRcdGZvcmNlUmVuZGVyID0gZmFsc2Vcblx0XHRAX3VwZGF0ZUhUTUxTY2FsZSgpXG5cdFx0aWYgbm90IEBhdXRvU2l6ZVxuXHRcdFx0aWYgQHdpZHRoIDwgQF9lbGVtZW50SFRNTC5jbGllbnRXaWR0aCBvciBAaGVpZ2h0IDwgQF9lbGVtZW50SFRNTC5jbGllbnRIZWlnaHRcblx0XHRcdFx0QGNsaXAgPSB0cnVlXG5cdFx0cmV0dXJuIHVubGVzcyBmb3JjZVJlbmRlciBvciBAYXV0b0hlaWdodCBvciBAYXV0b1dpZHRoIG9yIEB0ZXh0T3ZlcmZsb3cgaXNudCBudWxsXG5cdFx0cGFyZW50V2lkdGggPSBpZiBAcGFyZW50PyB0aGVuIEBwYXJlbnQud2lkdGggZWxzZSBTY3JlZW4ud2lkdGhcblx0XHRjb25zdHJhaW5lZFdpZHRoID0gaWYgQGF1dG9XaWR0aCB0aGVuIHBhcmVudFdpZHRoIGVsc2UgQHNpemUud2lkdGhcblx0XHRwYWRkaW5nID0gVXRpbHMucmVjdFplcm8oVXRpbHMucGFyc2VSZWN0KEBwYWRkaW5nKSlcblx0XHRjb25zdHJhaW5lZFdpZHRoIC09IChwYWRkaW5nLmxlZnQgKyBwYWRkaW5nLnJpZ2h0KVxuXHRcdGlmIEBhdXRvSGVpZ2h0XG5cdFx0XHRjb25zdHJhaW5lZEhlaWdodCA9IG51bGxcblx0XHRlbHNlXG5cdFx0XHRjb25zdHJhaW5lZEhlaWdodCA9IEBzaXplLmhlaWdodCAtIChwYWRkaW5nLnRvcCArIHBhZGRpbmcuYm90dG9tKVxuXHRcdGNvbnN0cmFpbnRzID1cblx0XHRcdHdpZHRoOiBjb25zdHJhaW5lZFdpZHRoXG5cdFx0XHRoZWlnaHQ6IGNvbnN0cmFpbmVkSGVpZ2h0XG5cdFx0XHRtdWx0aXBsaWVyOiBAY29udGV4dC5waXhlbE11bHRpcGxpZXJcblxuXHRcdGNhbGN1bGF0ZWRTaXplID0gQF9zdHlsZWRUZXh0Lm1lYXN1cmUgY29uc3RyYWludHNcblx0XHRAZGlzYWJsZUF1dG9zaXplVXBkYXRpbmcgPSB0cnVlXG5cdFx0aWYgY2FsY3VsYXRlZFNpemUud2lkdGg/XG5cdFx0XHRAd2lkdGggPSBjYWxjdWxhdGVkU2l6ZS53aWR0aCArIHBhZGRpbmcubGVmdCArIHBhZGRpbmcucmlnaHRcblx0XHRpZiBjYWxjdWxhdGVkU2l6ZS5oZWlnaHQ/XG5cdFx0XHRAaGVpZ2h0ID0gY2FsY3VsYXRlZFNpemUuaGVpZ2h0ICsgcGFkZGluZy50b3AgKyBwYWRkaW5nLmJvdHRvbVxuXHRcdEBkaXNhYmxlQXV0b3NpemVVcGRhdGluZyA9IGZhbHNlXG5cdCwgdGV4dExheWVyKVxuXHRcdFxuXHR0ZXh0TGF5ZXIuZW1pdCBcImNoYW5nZTp0ZXh0XCIsIHRleHRMYXllci50ZXh0LCB0ZXh0TGF5ZXJcblxuIyBNYWtlIGFuIGFzeW5jcm9ub3VzIHJlcXVlc3RcbiNcbiMgQGV4YW1wbGUgRmV0Y2ggYW5kIHJldHVybiBhIFJlc3BvbnNlIG9iamVjdC5cbiNcdFV0aWxzLmZldGNoICdodHRwOi8vZXhhbXBsZS5jb20vYW5zd2VyJywgKGQpIC0+IHByaW50IGRcbiNcbiMgQHBhcmFtIFtTdHJpbmddIHVybCB0aGUgdXJsIHRvIGZldGNoLCByZXR1cm5zIGEgUmVzcG9uc2VcbiMgQHBhcmFtIFtGdW5jdGlvbl0gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIHRvIHJ1biB3aXRoIHRoZSByZXR1cm5lZCBkYXRhXG4jXG5VdGlscy5mZXRjaCA9ICh1cmwsIGNhbGxiYWNrKSAtPlxuXHR1bmxlc3MgdXJsLmluY2x1ZGVzICdjb3JzLWFueXdoZXJlJ1xuXHRcdHVybCA9IFV0aWxzLkNPUlNwcm94eSh1cmwpXG5cdFxuXHRmZXRjaCh1cmwsIHsnbWV0aG9kJzogJ0dFVCcsICdtb2RlJzogJ2NvcnMnfSkudGhlbiggY2FsbGJhY2sgKVxuXG5cbiMgTWFrZSBhbiBhc3luY3Jvbm91cyByZXF1ZXN0IGFuZCByZXR1cm4gSlNPTi5cbiNcbiMgQGV4YW1wbGUgRmV0Y2ggYW5kIHJldHVybiBhIEpTT04gb2JqZWN0LlxuI1x0VXRpbHMuZmV0Y2hKU09OICdodHRwOi8vZXhhbXBsZS5jb20vYW5zd2VyJywgKGQpIC0+IHByaW50IGRcbiNcbiMgQHBhcmFtIFtTdHJpbmddIHVybCB0aGUgdXJsIHRvIGZldGNoLCByZXR1cm5zIEpTT04gb2JqZWN0XG4jIEBwYXJhbSBbRnVuY3Rpb25dIGNhbGxiYWNrIHRoZSBjYWxsYmFjayB0byBydW4gd2l0aCB0aGUgcmV0dXJuZWQgZGF0YVxuI1xuVXRpbHMuZmV0Y2hKU09OID0gKHVybCwgY2FsbGJhY2spIC0+XG5cdHVubGVzcyB1cmwuaW5jbHVkZXMgJ2NvcnMtYW55d2hlcmUnXG5cdFx0dXJsID0gVXRpbHMuQ09SU3Byb3h5KHVybClcblx0XG5cdGZldGNoKHVybCwgeydtZXRob2QnOiAnR0VUJywgJ21vZGUnOiAnY29ycyd9KS50aGVuKCBcblx0XHQocikgLT4gci5qc29uKCkudGhlbiggY2FsbGJhY2sgKVxuXHRcdClcblxuXG4jIFJldHVybiBhIHJhbmRvbSB0ZXh0IHN0cmluZy5cbiNcbiMgQGV4YW1wbGUgR2VuZXJhdGUgcGxhaW4gdGV4dC5cbiNcdFV0aWxzLnJhbmRvbVRleHQoNCkgXG4jXHTCuyBcImF1dCBleHBlZGl0YSBhdXQgZnVnaXRcIlxuI1xuIyBAZXhhbXBsZSBHZW5lcmF0ZSBzZW50ZW5jZXMuXG4jXHRVdGlscy5yYW5kb21UZXh0KDQsIHRydWUpXG4jXHTCuyBcIlNvbHV0YSBkb2xvciB0ZW1wb3JlIHBhcmlhdHVyLlwiXG4jXG4jIEAgcGFyYW0gW0ludGVnZXJdIHdvcmRzIFRoZSBudW1iZXIgb2Ygd29yZHMgdG8gcmV0dXJuXG4jIEAgcGFyYW0gW0Jvb2xlYW5dIFtzZW50ZW5jZXNdIFdoZXRoZXIgdG8gc3BsaXQgdGhlIHdvcmRzIGludG8gc2VudGVuY2VzXG4jIEAgcGFyYW0gW0Jvb2xlYW5dIFtwYXJhZ3JhcGhzXSBXaGV0aGVyIHRvIHNwbGl0IHRoZSB3b3JkcyBpbnRvIHBhcmFncmFwaHNcbiNcblV0aWxzLnJhbmRvbVRleHQgPSAod29yZHMgPSAxMiwgc2VudGVuY2VzID0gZmFsc2UsIHBhcmFncmFwaHMgPSBmYWxzZSkgLT5cblx0dGV4dCA9IEFycmF5LmZyb20oe2xlbmd0aDogd29yZHN9LCAtPiBfLnNhbXBsZShsb3JlbVNvdXJjZSkpXG5cblx0dW5sZXNzIHNlbnRlbmNlcyBcblx0XHRyZXR1cm4gdGV4dC5qb2luKCcgJylcblxuXHRpZiB3b3JkcyA8PSAzXG5cdFx0cmV0dXJuIF8uY2FwaXRhbGl6ZSggXy5zYW1wbGVTaXplKHRleHQsIDMpLmpvaW4oJyAnKSApICsgJy4nXG5cblx0IyBtYWtlIHNlbnRlbmNlc1xuXG5cdHNlbnRlbmNlcyA9IFtdXG5cblx0d2hpbGUgdGV4dC5sZW5ndGggPiAwXG5cdFx0aWYgdGV4dC5sZW5ndGggPD0gM1xuXHRcdFx0Xy5zYW1wbGUoc2VudGVuY2VzKS5wdXNoKHRleHQucG9wKCkpXG5cdFx0XHRjb250aW51ZSBcblxuXHRcdGxlbmd0aCA9IF8uY2xhbXAoXy5yYW5kb20oMywgNiksIDAsIHRleHQubGVuZ3RoKVxuXHRcdHNlbnRlbmNlcy5wdXNoKF8ucHVsbEF0KHRleHQsIFswLi4ubGVuZ3RoXSkpXG5cblx0aWYgc2VudGVuY2VzLmxlbmd0aCA8IDNcblx0XHRwYXJhZ3JhcGhzID0gZmFsc2Vcblx0XG5cdHVubGVzcyBwYXJhZ3JhcGhzXG5cdFx0cmV0dXJuIHNlbnRlbmNlcy5tYXAoIChhKSAtPlxuXHRcdFx0Xy5jYXBpdGFsaXplKCBhLmpvaW4oJyAnKSApICsgJy4nXG5cdFx0XHQpLmpvaW4oJyAnKVxuXG5cdCMgbWFrZSBwYXJhZ3JhcGhzXG5cblx0cGFyYWdyYXBocyA9IFtdXG5cblx0d2hpbGUgc2VudGVuY2VzLmxlbmd0aCA+IDBcblx0XHRpZiBzZW50ZW5jZXMubGVuZ3RoIDw9IDMgYW5kIHBhcmFncmFwaHMubGVuZ3RoID4gMFxuXHRcdFx0Xy5zYW1wbGUocGFyYWdyYXBocykucHVzaChzZW50ZW5jZXMucG9wKCkpXG5cdFx0XHRjb250aW51ZSBcblxuXHRcdGxlbmd0aCA9IF8uY2xhbXAoXy5yYW5kb20oMywgNiksIDAsIHNlbnRlbmNlcy5sZW5ndGgpXG5cdFx0cGFyYWdyYXBocy5wdXNoKF8ucHVsbEF0KHNlbnRlbmNlcywgWzAuLi5sZW5ndGhdKSlcblxuXHQjIE1ha2UgdGV4dFxuXG5cdHRleHQgPSAnJ1xuXG5cdGZvciBwYXJhZ3JhcGggaW4gcGFyYWdyYXBoc1xuXHRcdHRleHQgKz0gXy5yZWR1Y2UoXG5cdFx0XHRwYXJhZ3JhcGgsXG5cdFx0XHQoc3RyaW5nLCBzZW50ZW5jZSkgLT5cblx0XHRcdFx0c3RyaW5nICs9IF8uY2FwaXRhbGl6ZSggc2VudGVuY2Uuam9pbignICcpICkgKyAnLiAnXG5cdFx0XHQnJykudHJpbSgpICsgJ1xcblxcbidcblxuXHRyZXR1cm4gdGV4dC50cmltKClcblxuIyBDaGVjayB3aGV0aGVyIGEgc3RyaW5nIGlzIGEgdmFsaWQgZW1haWwuXG4jXG4jIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjaGVjay5cblV0aWxzLmlzRW1haWwgPSAoc3RyaW5nKSAtPlxuICAgIHJldHVybiBzdHJpbmcudG9Mb3dlckNhc2UoKS5tYXRjaCgvXigoW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKyhcXC5bXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKSopfChcIi4rXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31dKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkLylcblxuXG4jIFNvdXJjZSB3b3JkcyBmb3IgVXRpbHMucmFuZG9tVGV4dCgpXG4jXG5sb3JlbVNvdXJjZSA9IFtcImFsaWFzXCIsIFwiY29uc2VxdWF0dXJcIiwgXCJhdXRcIiwgXCJwZXJmZXJlbmRpc1wiLCBcInNpdFwiLFxuXCJ2b2x1cHRhdGVtXCIsIFwiYWNjdXNhbnRpdW1cIiwgXCJkb2xvcmVtcXVlXCIsIFwiYXBlcmlhbVwiLCBcImVhcXVlXCIsIFwiaXBzYVwiLCBcInF1YWVcIixcblwiYWJcIiwgXCJpbGxvXCIsIFwiaW52ZW50b3JlXCIsIFwidmVyaXRhdGlzXCIsIFwiZXRcIiwgXCJxdWFzaVwiLCBcImFyY2hpdGVjdG9cIiwgXCJiZWF0YWVcIixcblwidml0YWVcIiwgXCJkaWN0YVwiLCBcInN1bnRcIiwgXCJleHBsaWNhYm9cIiwgXCJhc3Blcm5hdHVyXCIsIFwiYXV0XCIsIFwib2RpdFwiLCBcImF1dFwiLFxuXCJmdWdpdFwiLCBcInNlZFwiLCBcInF1aWFcIiwgXCJjb25zZXF1dW50dXJcIiwgXCJtYWduaVwiLCBcImRvbG9yZXNcIiwgXCJlb3NcIiwgXCJxdWlcIixcblwicmF0aW9uZVwiLCBcInZvbHVwdGF0ZW1cIiwgXCJzZXF1aVwiLCBcIm5lc2NpdW50XCIsIFwibmVxdWVcIiwgXCJkb2xvcmVtXCIsIFwiaXBzdW1cIixcblwicXVpYVwiLCBcImRvbG9yXCIsIFwic2l0XCIsIFwiYW1ldFwiLCBcImNvbnNlY3RldHVyXCIsIFwiYWRpcGlzY2lcIiwgXCJ2ZWxpdFwiLCBcInNlZFwiLFxuXCJxdWlhXCIsIFwibm9uXCIsIFwibnVtcXVhbVwiLCBcImVpdXNcIiwgXCJtb2RpXCIsIFwidGVtcG9yYVwiLCBcImluY2lkdW50XCIsIFwidXRcIiwgXCJsYWJvcmVcIixcblwiZXRcIiwgXCJkb2xvcmVcIiwgXCJtYWduYW1cIiwgXCJhbGlxdWFtXCIsIFwicXVhZXJhdFwiLCBcInZvbHVwdGF0ZW1cIiwgXCJ1dFwiLCBcImVuaW1cIixcblwiYWRcIiwgXCJtaW5pbWFcIiwgXCJ2ZW5pYW1cIiwgXCJxdWlzXCIsIFwibm9zdHJ1bVwiLCBcImV4ZXJjaXRhdGlvbmVtXCIsIFwidWxsYW1cIixcblwiY29ycG9yaXNcIiwgXCJuZW1vXCIsIFwiZW5pbVwiLCBcImlwc2FtXCIsIFwidm9sdXB0YXRlbVwiLCBcInF1aWFcIiwgXCJ2b2x1cHRhc1wiLCBcInNpdFwiLFxuXCJzdXNjaXBpdFwiLCBcImxhYm9yaW9zYW1cIiwgXCJuaXNpXCIsIFwidXRcIiwgXCJhbGlxdWlkXCIsIFwiZXhcIiwgXCJlYVwiLCBcImNvbW1vZGlcIixcblwiY29uc2VxdWF0dXJcIiwgXCJxdWlzXCIsIFwiYXV0ZW1cIiwgXCJ2ZWxcIiwgXCJldW1cIiwgXCJpdXJlXCIsIFwicmVwcmVoZW5kZXJpdFwiLCBcInF1aVwiLFxuXCJpblwiLCBcImVhXCIsIFwidm9sdXB0YXRlXCIsIFwidmVsaXRcIiwgXCJlc3NlXCIsIFwicXVhbVwiLCBcIm5paGlsXCIsIFwibW9sZXN0aWFlXCIsIFwiZXRcIixcblwiaXVzdG9cIiwgXCJvZGlvXCIsIFwiZGlnbmlzc2ltb3NcIiwgXCJkdWNpbXVzXCIsIFwicXVpXCIsIFwiYmxhbmRpdGlpc1wiLCBcInByYWVzZW50aXVtXCIsXG5cImxhdWRhbnRpdW1cIiwgXCJ0b3RhbVwiLCBcInJlbVwiLCBcInZvbHVwdGF0dW1cIiwgXCJkZWxlbml0aVwiLCBcImF0cXVlXCIsIFwiY29ycnVwdGlcIixcblwicXVvc1wiLCBcImRvbG9yZXNcIiwgXCJldFwiLCBcInF1YXNcIiwgXCJtb2xlc3RpYXNcIiwgXCJleGNlcHR1cmlcIiwgXCJzaW50XCIsIFwib2NjYWVjYXRpXCIsXG5cImN1cGlkaXRhdGVcIiwgXCJub25cIiwgXCJwcm92aWRlbnRcIiwgXCJzZWRcIiwgXCJ1dFwiLCBcInBlcnNwaWNpYXRpc1wiLCBcInVuZGVcIiwgXCJvbW5pc1wiLFxuXCJpc3RlXCIsIFwibmF0dXNcIiwgXCJlcnJvclwiLCBcInNpbWlsaXF1ZVwiLCBcInN1bnRcIiwgXCJpblwiLCBcImN1bHBhXCIsIFwicXVpXCIsIFwib2ZmaWNpYVwiLFxuXCJkZXNlcnVudFwiLCBcIm1vbGxpdGlhXCIsIFwiYW5pbWlcIiwgXCJpZFwiLCBcImVzdFwiLCBcImxhYm9ydW1cIiwgXCJldFwiLCBcImRvbG9ydW1cIixcblwiZnVnYVwiLCBcImV0XCIsIFwiaGFydW1cIiwgXCJxdWlkZW1cIiwgXCJyZXJ1bVwiLCBcImZhY2lsaXNcIiwgXCJlc3RcIiwgXCJldFwiLCBcImV4cGVkaXRhXCIsXG5cImRpc3RpbmN0aW9cIiwgXCJuYW1cIiwgXCJsaWJlcm9cIiwgXCJ0ZW1wb3JlXCIsIFwiY3VtXCIsIFwic29sdXRhXCIsIFwibm9iaXNcIiwgXCJlc3RcIixcblwiZWxpZ2VuZGlcIiwgXCJvcHRpb1wiLCBcImN1bXF1ZVwiLCBcIm5paGlsXCIsIFwiaW1wZWRpdFwiLCBcInF1b1wiLCBcInBvcnJvXCIsIFwicXVpc3F1YW1cIixcblwiZXN0XCIsIFwicXVpXCIsIFwibWludXNcIiwgXCJpZFwiLCBcInF1b2RcIiwgXCJtYXhpbWVcIiwgXCJwbGFjZWF0XCIsIFwiZmFjZXJlXCIsIFwicG9zc2ltdXNcIixcblwib21uaXNcIiwgXCJ2b2x1cHRhc1wiLCBcImFzc3VtZW5kYVwiLCBcImVzdFwiLCBcIm9tbmlzXCIsIFwiZG9sb3JcIiwgXCJyZXBlbGxlbmR1c1wiLFxuXCJ0ZW1wb3JpYnVzXCIsIFwiYXV0ZW1cIiwgXCJxdWlidXNkYW1cIiwgXCJldFwiLCBcImF1dFwiLCBcImNvbnNlcXVhdHVyXCIsIFwidmVsXCIsIFwiaWxsdW1cIixcblwicXVpXCIsIFwiZG9sb3JlbVwiLCBcImV1bVwiLCBcImZ1Z2lhdFwiLCBcInF1b1wiLCBcInZvbHVwdGFzXCIsIFwibnVsbGFcIiwgXCJwYXJpYXR1clwiLCBcImF0XCIsXG5cInZlcm9cIiwgXCJlb3NcIiwgXCJldFwiLCBcImFjY3VzYW11c1wiLCBcIm9mZmljaWlzXCIsIFwiZGViaXRpc1wiLCBcImF1dFwiLCBcInJlcnVtXCIsXG5cIm5lY2Vzc2l0YXRpYnVzXCIsIFwic2FlcGVcIiwgXCJldmVuaWV0XCIsIFwidXRcIiwgXCJldFwiLCBcInZvbHVwdGF0ZXNcIiwgXCJyZXB1ZGlhbmRhZVwiLFxuXCJzaW50XCIsIFwiZXRcIiwgXCJtb2xlc3RpYWVcIiwgXCJub25cIiwgXCJyZWN1c2FuZGFlXCIsIFwiaXRhcXVlXCIsIFwiZWFydW1cIiwgXCJyZXJ1bVwiLFxuXCJoaWNcIiwgXCJ0ZW5ldHVyXCIsIFwiYVwiLCBcInNhcGllbnRlXCIsIFwiZGVsZWN0dXNcIiwgXCJ1dFwiLCBcImF1dFwiLCBcInJlaWNpZW5kaXNcIixcblwidm9sdXB0YXRpYnVzXCIsIFwibWFpb3Jlc1wiLCBcImRvbG9yaWJ1c1wiLCBcImFzcGVyaW9yZXNcIiwgXCJyZXBlbGxhdFwiXSIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby5cbiMgVFZLaXQgPSByZXF1aXJlIFwiVFZLaXRcIlxuXG5yZXF1aXJlIFwibW9yZXV0aWxzXCJcblxuRnJhbWVyLkRlZmF1bHRzLkFuaW1hdGlvbiA9XG4gICAgdGltZTogMC4zXG5cbkNhbnZhcy5iYWNrZ3JvdW5kQ29sb3IgPSAnIzFmMWYxZidcblxudHZVdGlscyA9IHJlcXVpcmUgXCJ0dlV0aWxzXCJcbndpbmRvdy50dlV0aWxzID0gdHZVdGlsc1xuXG57IFByb2dyYW1tZVRpbGUgfSA9IHJlcXVpcmUgXCJQcm9ncmFtbWVUaWxlXCJcbnsgTmF2aWdhYmxlcyB9ID0gcmVxdWlyZSBcIk5hdmlnYWJsZXNcIlxueyBNZW51IH0gPSByZXF1aXJlIFwiTWVudVwiXG57IENhcm91c2VsIH0gPSByZXF1aXJlIFwiQ2Fyb3VzZWxcIlxueyBHcmlkIH0gPSByZXF1aXJlIFwiR3JpZFwiXG57IEhpZ2hsaWdodCB9ID0gcmVxdWlyZSBcIkhpZ2hsaWdodFwiXG57IEJ1dHRvbnMgfSA9IHJlcXVpcmUgXCJCdXR0b25zXCJcblxud2luZG93LlByb2dyYW1tZVRpbGUgPSBQcm9ncmFtbWVUaWxlXG53aW5kb3cuTWVudSA9IE1lbnVcbndpbmRvdy5DYXJvdXNlbCA9IENhcm91c2VsXG53aW5kb3cuR3JpZCA9IEdyaWRcbndpbmRvdy5IaWdobGlnaHQgPSBIaWdobGlnaHRcbndpbmRvdy5CdXR0b25zID0gQnV0dG9uc1xud2luZG93Lk5hdmlnYWJsZXMgPSBOYXZpZ2FibGVzIiwidHZVdGlscyA9IHJlcXVpcmUgXCJ0dlV0aWxzXCJcbmNsYXNzIGV4cG9ydHMuUHJvZ3JhbW1lVGlsZSBleHRlbmRzIExheWVyXG5cblx0Y29uc3RydWN0b3I6ICggb3B0aW9ucz17fSApIC0+XG5cblx0XHQjIHByaW50IFwiY29uc3RydWN0b3Itc3RhcnRcIlxuXHRcdEBfX2NvbnN0cnVjdGlvbiA9IHRydWVcblx0XHRAX19pbnN0YW5jaW5nID0gdHJ1ZVxuXG5cdFx0Xy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0bmFtZTogXCJQcm9ncmFtbWUgVGlsZVwiXG5cdFx0XHR3aWR0aDogMjgwXG5cdFx0XHRoZWlnaHQ6IDE1N1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIlwiXG5cdFx0XHR0aXRsZTogXCJNaWRzb21lciBNdXJkZXJzXCJcblx0XHRcdGxhYmVsOiBcIlwiXG5cdFx0XHRzeW5vcHNpczogXCJPbmNlIHVwb24gYSB0aW1lIGEgZHJhZ29uIGVudGVyZWQgYSBkYW5jZSBjb21wZXRpdGlvbiBhbmQgaGUgd2FzIHJhdGhlciBnb29kIGF0IGl0LiBIZSB3YXMgYSBkYW5jaW5nIGRyYWdvbiBvZiBncmVhdCBpbXBvcnQuXCJcblx0XHRcdGxhYmVsQ29sb3I6IFwiIzgzODU4QVwiXG5cdFx0XHR0aGlyZExpbmU6IFwiU2VyaWVzIDEsIEVwaXNvZGUgMVwiXG5cdFx0XHRkb2c6IFwiXCJcblx0XHRcdHJlY29yZGVkOiBmYWxzZVxuXHRcdFx0d2F0Y2hsaXN0OiBmYWxzZVxuXHRcdFx0Z2hvc3Q6IGZhbHNlXG5cdFx0XHRsaW5lYXI6IGZhbHNlXG5cdFx0XHRvbkRlbWFuZDogdHJ1ZVxuXHRcdFx0cGxheWFibGU6IGZhbHNlXG5cblx0XHQjIHByaW50IFwiY29uc3RydWN0b3ItZW5kXCJcblx0XHRsYWJlbFRleHQgPSBvcHRpb25zLmxhYmVsXG5cdFx0b3B0aW9ucy5sYWJlbCA9IHVuZGVmaW5lZFxuXHRcdHN1cGVyIG9wdGlvbnNcblxuXG5cdFx0IyBwcmludCBvcHRpb25zLmhlaWdodFxuXHRcdF8uYXNzaWduIEAsXG5cdFx0XHRjbGlwOiB0cnVlXG5cdFx0XHRoZWlnaHQ6IG9wdGlvbnMuaGVpZ2h0XG5cblx0XHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0IyBMYXllcnNcblx0XHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0XHRpZiBAb25EZW1hbmQgPT0gdHJ1ZSBvciBAbGluZWFyID09IHRydWUgdGhlbiBAcGxheWFibGUgPSB0cnVlXG5cdFx0QGdyYWRpZW50TGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHBhcmVudDogQFxuXHRcdFx0bmFtZTonZ3JhZGllbnQnXG5cdFx0XHR3aWR0aDogb3B0aW9ucy53aWR0aCwgaGVpZ2h0OiBALmhlaWdodCsyNVxuXHRcdFx0eDogMCwgeTogMCwgaW5kZXg6IDBcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRcdFx0c3R5bGU6XG5cdFx0XHRcdFwiYmFja2dyb3VuZC1pbWFnZVwiOlwibGluZWFyLWdyYWRpZW50KC0xODBkZWcsIHJnYmEoMCwwLDAsMC4zMCkgMCUsIHJnYmEoMCwwLDAsMC4zMCkgMzUlLCByZ2JhKDAsMCwwLDAuOTApIDYwJSlcIlxuXG5cdFx0QHRleHRDb250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHBhcmVudDogQCwgbmFtZTogJ3RleHRDb250YWluZXInXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCdcblx0XHRcdHg6IDEwLCB5OiBvcHRpb25zLmhlaWdodC01NCwgaGVpZ2h0OiA3MCwgaW5kZXg6IDFcblxuXHRcdEB0aXRsZUxheWVyID0gbmV3IFRleHRMYXllclxuXHRcdFx0cGFyZW50OiBAdGV4dENvbnRhaW5lciwgbmFtZTogJ3RpdGxlTGF5ZXInXG5cdFx0XHR0ZXh0OiBvcHRpb25zLnRpdGxlXG5cdFx0XHRmb250RmFtaWx5OiAnQXZlbmlyJywgZm9udFNpemU6IDIyLCBjb2xvcjogJyNFQkVCRUInXG5cdFx0XHR5OiAyMSwgaW5kZXg6IDFcblx0XHRcdGhlaWdodDogMjYsIHdpZHRoOiBpZiBvcHRpb25zLnBsYXlhYmxlID09IGZhbHNlIHRoZW4gQC53aWR0aC0yMCBlbHNlIEAud2lkdGgtNDBcblx0XHRcdHg6IGlmIG9wdGlvbnMucGxheWFibGUgPT0gZmFsc2UgdGhlbiAwIGVsc2UgMjZcblx0XHRcdHRydW5jYXRlOiB0cnVlXG5cblx0XHRAbGFiZWxMYXllciA9IG5ldyBUZXh0TGF5ZXJcblx0XHRcdHBhcmVudDogQHRleHRDb250YWluZXJcblx0XHRcdG5hbWU6ICdsYWJlbExheWVyJ1xuXHRcdFx0dGV4dDogbGFiZWxUZXh0XG5cdFx0XHRmb250RmFtaWx5OiAnQXZlbmlyLUJsYWNrJ1xuXHRcdFx0Zm9udFNpemU6IDE2XG5cdFx0XHR0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJ1xuXHRcdFx0Y29sb3I6IG9wdGlvbnMubGFiZWxDb2xvclxuXHRcdFx0bGV0dGVyU3BhY2luZzogMC4yNFxuXHRcdFx0aGVpZ2h0OiAxOCwgd2lkdGg6IEAud2lkdGgtMjAsIGluZGV4OiAxXG5cdFx0XHR0cnVuY2F0ZTogdHJ1ZVxuXG5cdFx0QHRoaXJkTGluZUxheWVyID0gbmV3IFRleHRMYXllclxuXHRcdFx0cGFyZW50OiBALCBuYW1lOid0aGlyZExpbmVMYXllcidcblx0XHRcdGZvbnRGYW1pbHk6ICdBdmVuaXItQmxhY2snLCBmb250U2l6ZTogMTYsIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLCBjb2xvcjogJyNCNkI5QkYnXG5cdFx0XHR5OiBALmhlaWdodCwgeDogMTAsIGluZGV4OiAxXG5cdFx0XHRoZWlnaHQ6IDE4LCB3aWR0aDogQC53aWR0aC0yMFxuXHRcdFx0dGV4dDogb3B0aW9ucy50aGlyZExpbmVcblx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdHRydW5jYXRlOiB0cnVlXG5cblx0XHRAZG9nSW1hZ2VMYXllciA9IG5ldyBMYXllclxuXHRcdFx0cGFyZW50OiBALCBuYW1lOiAnZG9nJ1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAnJ1xuXHRcdFx0eTogMTAsIG1heFg6IEAud2lkdGgtMTBcblx0XHRcdGhlaWdodDogMzAsIHdpZHRoOiAxMDBcblx0XHRcdGh0bWw6IFwiXCJcIjxpbWcgc3R5bGUgPSBcImZsb2F0OnJpZ2h0O21heC13aWR0aDoxMDAlO21heC1oZWlnaHQ6MTAwJTtcIiBzcmMgPSAnI3tvcHRpb25zLmRvZ30nPlwiXCJcIlxuXHRcdFx0b3BhY2l0eTogMFxuXG5cdFx0QGFwcGVhciA9IG5ldyBBbmltYXRpb24gQCxcblx0XHRcdG9wYWNpdHk6IDFcblx0XHRAZGlzYXBwZWFyID0gbmV3IEFuaW1hdGlvbiBALFxuXHRcdFx0b3BhY2l0eTogMFxuXG5cdFx0dGV4dExheWVycyA9IFtAdGl0bGVMYXllciwgQGxhYmVsTGF5ZXIsIEB0aGlyZExpbmVMYXllcl1cblx0XHR0dlV0aWxzLmJyZWFrTGV0dGVyKHRleHRMYXllcnMpXG5cblx0XHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0IyBIaWdobGlnaHQgQW5pbWF0aW9uc1xuXHRcdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRcdCMgSGlnaGxpZ2h0XG5cdFx0QHVwZGF0ZUhpZ2hsaWdodEFuaW1hdGlvbnMgPSAtPlxuXHRcdFx0QF9jb250YWluZXJIaWdobGlnaHQgPSBuZXcgQW5pbWF0aW9uIEB0ZXh0Q29udGFpbmVyLCAjVGl0bGUgJiBsYWJlbFxuXHRcdFx0XHRcdHk6IEAuaGVpZ2h0LTc0XG5cdFx0XHRcdFx0b3B0aW9uczpcblx0XHRcdFx0XHRcdGRlbGF5OiAxXG5cdFx0XHRcdFx0XHR0aW1lOiAwLjVcblx0XHRcdEBfdGhpcmRMaW5lSGlnaGxpZ2h0ID0gbmV3IEFuaW1hdGlvbiBAdGhpcmRMaW5lTGF5ZXIsICN0aGlyZExpbmVcblx0XHRcdFx0eTogQC5oZWlnaHQtMjRcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRvcHRpb25zOlxuXHRcdFx0XHRcdGRlbGF5OiAxXG5cdFx0XHRcdFx0dGltZTogMC40XG5cdFx0XHRcdFx0Y3VydmU6IFwiZWFzZS1vdXRcIlxuXHRcdFx0QF9ncmFkaWVudEhpZ2hsaWdodCA9IG5ldyBBbmltYXRpb24gQGdyYWRpZW50TGF5ZXIsICNHcmFkaWVudFxuXHRcdFx0XHR5OiBBbGlnbi5ib3R0b20oKVxuXHRcdFx0XHRvcHRpb25zOlxuXHRcdFx0XHRcdGRlbGF5OiAxXG5cdFx0XHRcdFx0dGltZTogMC40XG5cblx0XHRAdXBkYXRlUmVtb3ZlSGlnaGxpZ2h0QW5pbWF0aW9ucyA9IC0+XG5cdFx0XHRAX2NvbnRhaW5lclJlbW92ZUhpZ2hsaWdodCA9IG5ldyBBbmltYXRpb24gQHRleHRDb250YWluZXIsICNUaXRsZSAmIGxhYmVsXG5cdFx0XHRcdHk6IEAuaGVpZ2h0LTU0XG5cdFx0XHRcdG9wdGlvbnM6XG5cdFx0XHRcdFx0dGltZTogMC41XG5cdFx0XHRAX3RoaXJkTGluZVJlbW92ZUhpZ2hsaWdodCA9IG5ldyBBbmltYXRpb24gQHRoaXJkTGluZUxheWVyLCAjdGhpcmRMaW5lXG5cdFx0XHRcdHk6IEAuaGVpZ2h0XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0b3B0aW9uczpcblx0XHRcdFx0XHR0aW1lOiAwLjRcblx0XHRcdFx0XHRjdXJ2ZTogXCJlYXNlLW91dFwiXG5cdFx0XHRAX2dyYWRpZW50UmVtb3ZlSGlnaGxpZ2h0ID0gbmV3IEFuaW1hdGlvbiBAZ3JhZGllbnRMYXllciwgI0dyYWRpZW50XG5cdFx0XHRcdG1heFk6IEAubWF4WSsyNVxuXHRcdFx0XHRvcHRpb25zOlxuXHRcdFx0XHRcdHRpbWU6IDAuNFxuXG5cdFx0QHVwZGF0ZUhpZ2hsaWdodEFuaW1hdGlvbnMoKVxuXHRcdEB1cGRhdGVSZW1vdmVIaWdobGlnaHRBbmltYXRpb25zKClcblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIEV2ZW50c1xuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0ZGVsZXRlIEBfX2NvbnN0cnVjdGlvblxuXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyBQdWJsaWMgTWV0aG9kc1xuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0aGlnaGxpZ2h0OiAoKSAtPlxuXHRcdEBfY29udGFpbmVyUmVtb3ZlSGlnaGxpZ2h0LnN0b3AoKVxuXHRcdEBfdGhpcmRMaW5lUmVtb3ZlSGlnaGxpZ2h0LnN0b3AoKVxuXHRcdEBfZ3JhZGllbnRSZW1vdmVIaWdobGlnaHQuc3RvcCgpXG5cblx0XHRAX2NvbnRhaW5lckhpZ2hsaWdodC5zdGFydCgpXG5cdFx0QF90aGlyZExpbmVIaWdobGlnaHQuc3RhcnQoKVxuXHRcdEBfZ3JhZGllbnRIaWdobGlnaHQuc3RhcnQoKVxuXG5cdHJlbW92ZUhpZ2hsaWdodDogKCkgLT5cblx0XHRAX2NvbnRhaW5lckhpZ2hsaWdodC5zdG9wKClcblx0XHRAX3RoaXJkTGluZUhpZ2hsaWdodC5zdG9wKClcblx0XHRAX2dyYWRpZW50SGlnaGxpZ2h0LnN0b3AoKVxuXG5cdFx0QF9jb250YWluZXJSZW1vdmVIaWdobGlnaHQuc3RhcnQoKVxuXHRcdEBfdGhpcmRMaW5lUmVtb3ZlSGlnaGxpZ2h0LnN0YXJ0KClcblx0XHRAX2dyYWRpZW50UmVtb3ZlSGlnaGxpZ2h0LnN0YXJ0KClcblxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgUHJpdmF0ZSBNZXRob2RzXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRfdXBkYXRlSGVpZ2h0OiAoIHZhbHVlICkgLT5cblx0XHRALmhlaWdodCA9IHZhbHVlXG5cdFx0QGdyYWRpZW50TGF5ZXIubWF4WSA9IHZhbHVlKzI1XG5cdFx0QHRoaXJkTGluZUxheWVyLnkgPSBALmhlaWdodFxuXHRcdEB0ZXh0Q29udGFpbmVyLnkgPSBALmhlaWdodC01NFxuXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyBEZWZpbml0aW9uc1xuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0IyBwcmludCBcInN0YXJ0IGRlZmluaXRpb25zXCJcblx0QGRlZmluZSBcInRpdGxlXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQHRpdGxlTGF5ZXIudGV4dFxuXHRcdHNldDogKCB2YWx1ZSApIC0+IEB0aXRsZUxheWVyLnRleHQgPSB2YWx1ZSBpZiBAdGl0bGVMYXllcj9cblxuXHRAZGVmaW5lIFwibGFiZWxcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAbGFiZWxMYXllci50ZXh0IGlmIEBsYWJlbExheWVyP1xuXHRcdCMgTm90IHN1cmUgd2h5IHRoaXMgaXMgaGFwcGVuaW5nIGJ1dCBJIHRoaW5rIHRoZSBMYXllciBjbGFzcyBpcyBjYXB0dXJpbmdcblx0XHQjIGxhYmVsIGFuZCBjYXVzaW5nIGl0IHRvIGNhbGwgdGhlIGdldHRlciBiZWZvcmUgbGFiZWxMYXllciBleGlzdHMuXG5cdFx0c2V0OiAoIHZhbHVlICkgLT4gQGxhYmVsTGF5ZXIudGV4dCA9IHZhbHVlIGlmIEBsYWJlbExheWVyP1xuXG5cdEBkZWZpbmUgXCJ0aGlyZExpbmVcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAdGhpcmRMaW5lTGF5ZXIudGV4dFxuXHRcdHNldDogKCB2YWx1ZSApIC0+IEB0aGlyZExpbmVMYXllci50ZXh0ID0gdmFsdWUgaWYgQHRoaXJkTGluZUxheWVyP1xuXG5cdEBkZWZpbmUgXCJsYWJlbENvbG9yXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQGxhYmVsTGF5ZXIuY29sb3Jcblx0XHRzZXQ6ICggdmFsdWUgKSAtPiBAbGFiZWxMYXllci5jb2xvciA9IHZhbHVlIGlmIEBsYWJlbExheWVyP1xuXG5cdGRlbGV0ZSBAX19pbnN0YW5jaW5nXG5cdCMgcHJpbnQgXCJlbmQgZGVmaW5pdGlvbnNcIiIsImNsYXNzIGV4cG9ydHMuTmF2aWdhYmxlcyBleHRlbmRzIExheWVyXG4gICAgY29uc3RydWN0b3I6ICggb3B0aW9ucz17fSApIC0+XG4gICAgICAgIEBfX2NvbnN0cnVjdGlvbiA9IHRydWVcbiAgICAgICAgXy5hc3NpZ24gb3B0aW9ucyxcbiAgICAgICAgICAgIGFjdGl2ZTogZmFsc2VcbiAgICAgICAgICAgIGxhc3RIaWdobGlnaHQ6IHVuZGVmaW5lZFxuICAgICAgICAgICAgaGlnaGxpZ2h0TGF5ZXI6IHVuZGVmaW5lZFxuICAgICAgICBzdXBlciBvcHRpb25zXG5cbiAgICAgICAgXy5hc3NpZ24gQCxcbiAgICAgICAgICAgIG91dExlZnQ6IHVuZGVmaW5lZFxuXHRcdFxuICAgICAgICBpZiB3aW5kb3dbXCJuYXZpZ2FibGVzQXJyYXlcIl0/ID09IGZhbHNlXG4gICAgICAgICAgICB3aW5kb3dbXCJuYXZpZ2FibGVzQXJyYXlcIl0gPSBbXVxuICAgICAgICBuYXZpZ2FibGVzQXJyYXkucHVzaChAKVxuXG4gICAgICAgIEB1cE91dEJlaGF2aW91ciA9IFwiXCJcbiAgICAgICAgQGRvd25PdXRCZWhhdmlvdXIgPSBcIlwiXG4gICAgICAgIEBsZWZ0T3V0QmVoYXZpb3VyID0gXCJcIlxuICAgICAgICBAcmlnaHRPdXRCZWhhdmlvdXIgPSBcIlwiXG5cbiAgICAgICAgQG9uIFwidXBPdXRcIiwgKCkgLT5cbiAgICAgICAgICAgIEB1cE91dEJlaGF2aW91cigpIGlmIEB1cE91dEJlaGF2aW91ciAhPSBcIlwiXG4gICAgICAgIEBvbiBcInJpZ2h0T3V0XCIsICgpIC0+XG4gICAgICAgICAgICBAcmlnaHRPdXRCZWhhdmlvdXIoKSBpZiBAcmlnaHRPdXRCZWhhdmlvdXIgIT0gXCJcIlxuICAgICAgICBAb24gXCJkb3duT3V0XCIsICgpIC0+XG4gICAgICAgICAgICBAZG93bk91dEJlaGF2aW91cigpIGlmIEBkb3duT3V0QmVoYXZpb3VyICE9IFwiXCJcbiAgICAgICAgQG9uIFwibGVmdE91dFwiLCAoKSAtPlxuICAgICAgICAgICAgQGxlZnRPdXRCZWhhdmlvdXIoKSBpZiBAbGVmdE91dEJlaGF2aW91ciAhPSBcIlwiXG4gICAgXG4gICAgX2Fzc2lnbkhpZ2hsaWdodDogKCBsYXllciApIC0+XG4gICAgICAgIEBoaWdobGlnaHRMYXllciA9IGxheWVyXG5cbiAgICBvblVwT3V0OiAoIGJlaGF2aW91ciApIC0+XG4gICAgICAgIEB1cE91dEJlaGF2aW91ciA9IGJlaGF2aW91clxuICAgIG9uUmlnaHRPdXQ6ICggYmVoYXZpb3VyICkgLT5cbiAgICAgICAgQHJpZ2h0T3V0QmVoYXZpb3VyID0gYmVoYXZpb3VyXG4gICAgb25Eb3duT3V0OiAoIGJlaGF2aW91ciApIC0+XG4gICAgICAgIEBkb3duT3V0QmVoYXZpb3VyID0gYmVoYXZpb3VyXG4gICAgb25MZWZ0T3V0OiAoIGJlaGF2aW91ciApIC0+XG4gICAgICAgIEBsZWZ0T3V0QmVoYXZpb3VyID0gYmVoYXZpb3VyXG5cblxuICAgIEBkZWZpbmUgXCJoaWdobGlnaHRcIixcbiAgICAgICAgZ2V0OiAtPiByZXR1cm4gQF9oaWdobGlnaHRcbiAgICAgICAgc2V0OiAoIHZhbHVlICkgLT5cbiAgICAgICAgICAgIEBfaGlnaGxpZ2h0ID0gdmFsdWVcbiAgICBcbiAgICBAZGVmaW5lIFwidXBPdXRcIixcbiAgICAgICAgZ2V0OiAtPiByZXR1cm4gQF9vdXRVcFxuICAgICAgICBzZXQ6ICggdmFsdWUgKSAtPlxuICAgICAgICAgICAgcmV0dXJuIGlmIEBfX2NvbnN0cnVjdGlvblxuICAgICAgICAgICAgbmV3QmVoYXZpb3VyID0gdmFsdWVcbiAgICAgICAgICAgIEB1cE91dEJlaGF2aW91ciA9IHZhbHVlXG4gICAgQGRlZmluZSBcInJpZ2h0T3V0XCIsXG4gICAgICAgIGdldDogLT4gcmV0dXJuIEBfb3V0cmlnaHRcbiAgICAgICAgc2V0OiAoIHZhbHVlICkgLT5cbiAgICAgICAgICAgIHJldHVybiBpZiBAX19jb25zdHJ1Y3Rpb25cbiAgICAgICAgICAgIG5ld0JlaGF2aW91ciA9IHZhbHVlXG4gICAgICAgICAgICBAcmlnaHRPdXRCZWhhdmlvdXIgPSB2YWx1ZVxuICAgIEBkZWZpbmUgXCJkb3duT3V0XCIsXG4gICAgICAgIGdldDogLT4gcmV0dXJuIEBfb3V0RG93blxuICAgICAgICBzZXQ6ICggdmFsdWUgKSAtPlxuICAgICAgICAgICAgcmV0dXJuIGlmIEBfX2NvbnN0cnVjdGlvblxuICAgICAgICAgICAgbmV3QmVoYXZpb3VyID0gdmFsdWVcbiAgICAgICAgICAgIEBkb3duT3V0QmVoYXZpb3VyID0gdmFsdWVcbiAgICBAZGVmaW5lIFwibGVmdE91dFwiLFxuICAgICAgICBnZXQ6IC0+IHJldHVybiBAX291dGxlZnRcbiAgICAgICAgc2V0OiAoIHZhbHVlICkgLT5cbiAgICAgICAgICAgIHJldHVybiBpZiBAX19jb25zdHJ1Y3Rpb25cbiAgICAgICAgICAgIG5ld0JlaGF2aW91ciA9IHZhbHVlXG4gICAgICAgICAgICBAbGVmdE91dEJlaGF2aW91ciA9IHZhbHVlIiwidHZVdGlscyA9IHJlcXVpcmUgXCJ0dlV0aWxzXCJcbnsgTmF2aWdhYmxlcyB9ID0gcmVxdWlyZSBcIk5hdmlnYWJsZXNcIlxuXG5jbGFzcyBleHBvcnRzLk1lbnUgZXh0ZW5kcyBOYXZpZ2FibGVzXG5cblx0Y29uc3RydWN0b3I6ICggb3B0aW9ucz17fSApIC0+XG5cblx0XHRAX19jb25zdHJ1Y3Rpb24gPSB0cnVlXG5cdFx0QF9faW5zdGFuY2luZyA9IHRydWVcblxuXHRcdF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdG1lbnVJdGVtczogWydNZW51IE9uZScsICdNZW51IFR3bycsICdNZW51IFRocmVlJ11cblx0XHRcdGNvbnRlbnQ6IFtsYXllck9uZSwgbGF5ZXJUd28sIGxheWVyVGhyZWVdXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcnXG5cdFx0c3VwZXIgb3B0aW9uc1xuXG5cdFx0ZGVsZXRlIEBfX2NvbnN0cnVjdGlvblxuXG5cdFx0IyBwcmludCBvcHRpb25zXG5cblx0XHRtZW51TmFtZXMgPSBvcHRpb25zLm1lbnVJdGVtc1xuXHRcdGZvciBuYW1lcywgaSBpbiBtZW51TmFtZXNcblx0XHRcdGlmIG5hbWVzIGluc3RhbmNlb2YgTGF5ZXJcblx0XHRcdFx0bWVudUxheWVyID0gbmFtZXNcblx0XHRcdFx0bWVudUxheWVyLnkgPSA2XG5cdFx0XHRcdG1lbnVMYXllci54ID0gLTJcblx0XHRcdGVsc2Vcblx0XHRcdFx0bWVudUxheWVyID0gbmV3IFRleHRMYXllclxuXHRcdFx0XHRAaGlnaGxpZ2h0WSA9IEAuc2NyZWVuRnJhbWUueSArIG1lbnVMYXllci5oZWlnaHQtNVxuXHRcdFx0Xy5hc3NpZ24gbWVudUxheWVyLFxuXHRcdFx0XHRwYXJlbnQ6IEBcblx0XHRcdFx0dGV4dDogbmFtZXNcblx0XHRcdFx0Y29sb3I6IFwiI2ViZWJlYlwiXG5cdFx0XHRcdGZvbnRGYW1pbHk6IFwiQXZlbmlyLWxpZ2h0XCJcblx0XHRcdFx0Zm9udFNpemU6IDMwXG5cdFx0XHRcdGxldHRlclNwYWNpbmc6IDAuM1xuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiXCJcblx0XHRcdFx0eDogaWYgQC5jaGlsZHJlbltpLTFdPyB0aGVuIEAuY2hpbGRyZW5baS0xXS5tYXhYICsgMzkgZWxzZSAwXG5cdFx0XHRcdGN1c3RvbTpcblx0XHRcdFx0XHRtZW51Q29udGVudDogb3B0aW9ucy5jb250ZW50W2ldXG5cblx0XHRcdCMgbWVudUxheWVyLmFkZENoaWxkKG9wdGlvbnMuY29udGVudFtpXSkgaWYgb3B0aW9ucy5jb250ZW50W2ldP1xuXHRcdFx0b3B0aW9ucy5tZW51SXRlbXNbaV0gPSBtZW51TGF5ZXJcblx0XHRcdEBoaWdobGlnaHRJbmRleCA9IDBcblxuXHQjIHByaW50ICcxJ1xuXHRAZGVmaW5lICdtZW51SXRlbXMnLFxuXHRcdGdldDogLT5cdHJldHVybiBALmNoaWxkcmVuXG5cdFx0c2V0OiAoIHZhbHVlICkgLT5cblx0XHRcdHJldHVybiBpZiBAX19jb25zdHJ1Y3Rpb25cblx0XHRcdEBtZW51SXRlbXMgPSB2YWx1ZVxuXG5cdEBkZWZpbmUgJ2NvbnRlbnQnLFxuXHRcdGdldDogLT4gQF9nZXRDb250ZW50KClcblx0XHRzZXQ6ICggdmFsdWUgKSAtPiBpZiBAX19jb25zdHJ1Y3Rpb24/IHRoZW4gQF9zZXRDb250ZW50KCB2YWx1ZSApXG5cblx0bGF5ZXJPbmUgPSBuZXcgVGV4dExheWVyXG5cdFx0bmFtZTogXCIuXCIsIHk6IDEwMCwgdmlzaWJsZTogZmFsc2UsIGJhY2tncm91bmRDb2xvcjogXCJyZWRcIiwgdGV4dDogXCJEZWZpbmUgd2l0aCBhbiBhcnJheSBpbiBNZW51LmN1c3RvbS5jb250ZW50XCIsIGNvbG9yOiBcIndoaXRlXCJcblx0bGF5ZXJUd28gPSBuZXcgVGV4dExheWVyXG5cdFx0bmFtZTogXCIuXCIsIHk6IDEwMCwgdmlzaWJsZTogZmFsc2UsIGJhY2tncm91bmRDb2xvcjogXCJibHVlXCIsIHRleHQ6IFwiRGVmaW5lIHdpdGggYW4gYXJyYXkgaW4gTWVudS5jdXN0b20uY29udGVudFwiLCBjb2xvcjogXCJ3aGl0ZVwiXG5cdGxheWVyVGhyZWUgPSBuZXcgVGV4dExheWVyXG5cdFx0bmFtZTogXCIuXCIsIHk6IDEwMCwgdmlzaWJsZTogZmFsc2UsIGJhY2tncm91bmRDb2xvcjogXCJncmVlblwiLCB0ZXh0OiBcIkRlZmluZSB3aXRoIGFuIGFycmF5IGluIE1lbnUuY3VzdG9tLmNvbnRlbnRcIiwgY29sb3I6IFwid2hpdGVcIlxuXG5cdF9nZXRDb250ZW50OiAtPlxuXHRcdF9jb250ZW50ID0gW11cblx0XHRmb3IgY2hpbGQgaW4gQC5jaGlsZHJlblxuXHRcdFx0X2NvbnRlbnQucHVzaChjaGlsZC5jdXN0b20ubWVudUNvbnRlbnQpXG5cdFx0cmV0dXJuIF9jb250ZW50XG5cblx0X3NldENvbnRlbnQ6ICggdmFsdWUgKSAtPlxuXHRcdGZvciBjaGlsZCwgaSBpbiBALmNoaWxkcmVuXG5cdFx0XHRjaGlsZC5jdXN0b20ubWVudUNvbnRlbnQuZGVzdHJveSgpXG5cdFx0XHRjaGlsZC5jdXN0b20ubWVudUNvbnRlbnQgPSB2YWx1ZVtpXVxuXHRcdFx0IyBjaGlsZC5hZGRDaGlsZChjaGlsZC5jdXN0b20ubWVudUNvbnRlbnQpXG5cblx0X21vdmVIaWdobGlnaHQ6ICgpIC0+XG5cdFx0QGhpZ2hsaWdodExheWVyLmN1cnJlbnRDb250ZXh0ID0gQFxuXG5cdF9zZXRJbmRleDogKCBoaWdobGlnaHRlZE1lbnVJbmRleCApIC0+XG5cdFx0aWYgaGlnaGxpZ2h0ZWRNZW51SW5kZXggPT0gdW5kZWZpbmVkXG5cdFx0XHRoaWdobGlnaHRlZE1lbnVJbmRleCA9IDBcblx0XHRyZXR1cm4gaGlnaGxpZ2h0ZWRNZW51SW5kZXhcblxuXHRyZW1vdmVIaWdobGlnaHQ6ICgpIC0+XG5cdFx0Zm9yIGNoaWxkLCBpIGluIEAuY2hpbGRyZW5cblx0XHRcdGlmIGkgPT0gQGhpZ2hsaWdodEluZGV4XG5cdFx0XHRcdGNoaWxkLmFuaW1hdGVcblx0XHRcdFx0XHRjb2xvcjogdHZVdGlscy53aGl0ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjaGlsZC5hbmltYXRlXG5cdFx0XHRcdFx0Y29sb3I6IHR2VXRpbHMuZGFya0dyZXlcblx0XHRALmhpZ2hsaWdodExheWVyLmFuaW1hdGVcblx0XHRcdGJhY2tncm91bmRDb2xvcjogdHZVdGlscy53aGl0ZVxuXHRcdGZvciBjaGlsZCBpbiBALmhpZ2hsaWdodExheWVyLmNoaWxkcmVuXG5cdFx0XHRjaGlsZC52aXNpYmxlID0gZmFsc2Vcblx0XHRALmhpZ2hsaWdodExheWVyLnZpc2libGUgPSB0cnVlXG5cblxuXHRoaWdobGlnaHQ6ICggaGlnaGxpZ2h0ZWRNZW51SW5kZXggKSAtPlxuXHRcdGlmIGhpZ2hsaWdodGVkTWVudUluZGV4ID09IHVuZGVmaW5lZCB0aGVuIGhpZ2hsaWdodGVkTWVudUluZGV4ID0gMFxuXHRcdGlmIEAuY2hpbGRyZW4/XG5cdFx0XHRmb3IgY2hpbGQsIGkgaW4gQC5jaGlsZHJlblxuXHRcdFx0XHRpZiBpID09IGhpZ2hsaWdodGVkTWVudUluZGV4XG5cdFx0XHRcdFx0Y2hpbGQuYW5pbWF0ZVxuXHRcdFx0XHRcdFx0Y29sb3I6IHR2VXRpbHMuYmx1ZVxuXG5cdFx0XHRcdFx0aWYgY2hpbGQuY3VzdG9tLm1lbnVDb250ZW50P1xuXHRcdFx0XHRcdFx0Y2hpbGQuY3VzdG9tLm1lbnVDb250ZW50LnZpc2libGUgPSB0cnVlXG5cblx0XHRcdFx0XHRpZiBAaGlnaGxpZ2h0TGF5ZXI/XG5cdFx0XHRcdFx0XHRfLmFzc2lnbiBAaGlnaGxpZ2h0TGF5ZXIsXG5cdFx0XHRcdFx0XHRcdHdpZHRoOiAwXG5cdFx0XHRcdFx0XHRcdHk6IEBoaWdobGlnaHRZXG5cdFx0XHRcdFx0XHRcdHg6IGNoaWxkLnNjcmVlbkZyYW1lLnggKyBjaGlsZC53aWR0aC8yXG5cdFx0XHRcdFx0XHRAaGlnaGxpZ2h0TGF5ZXIuY2hpbGRyZW5bMF0ud2lkdGggPSAwXG5cdFx0XHRcdFx0XHRAaGlnaGxpZ2h0TGF5ZXIuY2hpbGRyZW5bMF0uYW5pbWF0ZVxuXHRcdFx0XHRcdFx0XHR3aWR0aDogY2hpbGQud2lkdGgrMTBcblx0XHRcdFx0XHRcdEBoaWdobGlnaHRMYXllci5hbmltYXRlXG5cdFx0XHRcdFx0XHRcdHdpZHRoOiBjaGlsZC53aWR0aFxuXHRcdFx0XHRcdFx0XHR4OiBjaGlsZC5zY3JlZW5GcmFtZS54XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRjaGlsZC5hbmltYXRlXG5cdFx0XHRcdFx0XHRjb2xvcjogdHZVdGlscy53aGl0ZVxuXG5cdFx0XHRcdFx0aWYgY2hpbGQuY3VzdG9tLm1lbnVDb250ZW50P1xuXHRcdFx0XHRcdFx0Y2hpbGQuY3VzdG9tLm1lbnVDb250ZW50LnZpc2libGUgPSBmYWxzZVxuXHRcdFx0QC5oaWdobGlnaHRMYXllci5hbmltYXRlXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogdHZVdGlscy5ibHVlXG5cdFx0XHRmb3IgY2hpbGQgaW4gQC5oaWdobGlnaHRMYXllci5jaGlsZHJlblxuXHRcdFx0XHRjaGlsZC52aXNpYmxlID0gdHJ1ZVxuXG5cdFx0XHRAaGlnaGxpZ2h0SW5kZXggPSBoaWdobGlnaHRlZE1lbnVJbmRleFxuXHRcdFx0QGxhc3RIaWdobGlnaHQgPSBoaWdobGlnaHRlZE1lbnVJbmRleFxuXG5cdG1vdmVSaWdodDogKCkgPT5cblx0XHRpZiBAaGlnaGxpZ2h0SW5kZXgrMSA8IEAubWVudUl0ZW1zLmxlbmd0aFxuXHRcdFx0QC5oaWdobGlnaHQoIEBoaWdobGlnaHRJbmRleCsxIClcblx0XHRlbHNlIEBlbWl0KFwicmlnaHRPdXRcIilcblx0XHRAbGFzdEhpZ2hsaWdodCA9IEBoaWdobGlnaHRJbmRleFxuXG5cdG1vdmVMZWZ0OiAoKSA9PlxuXHRcdGlmIEBoaWdobGlnaHRJbmRleCA+IDBcblx0XHRcdEAuaGlnaGxpZ2h0KCBAaGlnaGxpZ2h0SW5kZXgtMSApXG5cdFx0ZWxzZSBAZW1pdChcImxlZnRPdXRcIilcblx0XHRAbGFzdEhpZ2hsaWdodCA9IEBoaWdobGlnaHRJbmRleFxuXG5cdG1vdmVVcDogKCkgPT5cblx0XHRAZW1pdChcInVwT3V0XCIpXG5cblx0bW92ZURvd246ICgpID0+XG5cdFx0QGVtaXQoXCJkb3duT3V0XCIpXG5cdCMgPT09PT09PT09PT09PT09PT09PT09XG5cdCMgSW5pdCIsIiMgS2V5c1xuZXhwb3J0cy5iYWNrc3BhY2UgPSA4XG5leHBvcnRzLnRhYiA9IDlcbmV4cG9ydHMuZW50ZXIgPSAxM1xuZXhwb3J0cy5zaGlmdCA9IDE2XG5leHBvcnRzLmN0cmwgPSAxN1xuZXhwb3J0cy5hbHQgPSAxOFxuXG5leHBvcnRzLmNhcHMgPSAyMFxuZXhwb3J0cy5lc2NhcGUgPSAyN1xuZXhwb3J0cy5wYWdlVXAgPSAzM1xuZXhwb3J0cy5wYWdlRG93biA9IDM0XG5cbmV4cG9ydHMubGVmdCA9IDM3XG5leHBvcnRzLnVwID0gMzhcbmV4cG9ydHMucmlnaHQgPSAzOVxuZXhwb3J0cy5kb3duID0gNDBcbmV4cG9ydHMuZGVsZXRlID0gNDZcblxuZXhwb3J0cy56ZXJvID0gNDhcbmV4cG9ydHMub25lID0gNDlcbmV4cG9ydHMudHdvID0gNTBcbmV4cG9ydHMudGhyZWUgPSA1MVxuZXhwb3J0cy5mb3VyID0gNTJcbmV4cG9ydHMuZml2ZSA9IDUzXG5leHBvcnRzLnNpeCA9IDU0XG5leHBvcnRzLnNldmVuID0gNTVcbmV4cG9ydHMuZWlnaHQgPSA1NlxuZXhwb3J0cy5uaW5lID0gNTdcblxuZXhwb3J0cy5hID0gNjVcbmV4cG9ydHMuYiA9IDY2XG5leHBvcnRzLmMgPSA2N1xuZXhwb3J0cy5kID0gNjhcbmV4cG9ydHMuZSA9IDY5XG5leHBvcnRzLmYgPSA3MFxuZXhwb3J0cy5nID0gNzFcbmV4cG9ydHMuaCA9IDcyXG5leHBvcnRzLmkgPSA3M1xuZXhwb3J0cy5qID0gNzRcbmV4cG9ydHMuayA9IDc1XG5leHBvcnRzLmwgPSA3NlxuZXhwb3J0cy5tID0gNzdcbmV4cG9ydHMubiA9IDc4XG5leHBvcnRzLm8gPSA3OVxuZXhwb3J0cy5wID0gODBcbmV4cG9ydHMucSA9IDgxXG5leHBvcnRzLnIgPSA4MlxuZXhwb3J0cy5zID0gODNcbmV4cG9ydHMudCA9IDg0XG5leHBvcnRzLnUgPSA4NVxuZXhwb3J0cy52ID0gODZcbmV4cG9ydHMudyA9IDg3XG5leHBvcnRzLnggPSA4OFxuZXhwb3J0cy55ID0gODlcbmV4cG9ydHMueiA9IDkwXG5cbmV4cG9ydHMubnVtWmVybyA9IDk2XG5leHBvcnRzLm51bU9uZSA9IDk3XG5leHBvcnRzLm51bVR3byA9IDk4XG5leHBvcnRzLm51bVRocmVlID0gOTlcbmV4cG9ydHMubnVtRm91ciA9IDEwMFxuZXhwb3J0cy5udW1GaXZlID0gMTAxXG5leHBvcnRzLm51bVNpeCA9IDEwMlxuZXhwb3J0cy5udW1TZXZlbiA9IDEwM1xuZXhwb3J0cy5udW1FaWdodCA9IDEwNFxuZXhwb3J0cy5udW1OaW5lID0gMTA1XG5cbmV4cG9ydHMuZk9uZSA9IDExMlxuZXhwb3J0cy5mVHdvID0gMTEzXG5leHBvcnRzLmZUaHJlZSA9IDExNFxuZXhwb3J0cy5mRm91ciA9IDExNVxuZXhwb3J0cy5mRml2ZSA9IDExNlxuZXhwb3J0cy5mU2l4ID0gMTE3XG5leHBvcnRzLmZTZXZlbiA9IDExOFxuZXhwb3J0cy5mRWlnaHQgPSAxMTlcbmV4cG9ydHMuZk5pbmUgPSAxMjBcbmV4cG9ydHMuZlRlbiA9IDEyMVxuXG5leHBvcnRzLnNlbWlDb2xvbiA9IDE4NlxuZXhwb3J0cy5lcXVhbFNpZ24gPSAxODdcbmV4cG9ydHMuY29tbWEgPSAxODhcbmV4cG9ydHMuZGFzaCA9IDE4OVxuZXhwb3J0cy5wZXJpb2QgPSAxOTBcbmV4cG9ydHMuZm9yd2FyZFNsYXNoID0gMTkxXG5leHBvcnRzLm9wZW5CcmFja2V0ID0gMjE5XG5leHBvcnRzLmJhY2tTbGFzaCA9IDIyMFxuZXhwb3J0cy5jbG9zZUJyYWNrZXQgPSAyMjFcbmV4cG9ydHMuc2luZ2xlUXVvdGUgPSAyMjJcblxua2V5TWFwID0ge31cblxuZXhwb3J0cy5vbktleSA9IChrZXksIGhhbmRsZXIsIHRocm90dGxlVGltZSkgLT5cbiAgICBpZiBoYW5kbGVyICE9IHVuZGVmaW5lZFxuICAgICAgICBrZXlNYXBba2V5XSA9IFV0aWxzLnRocm90dGxlIHRocm90dGxlVGltZSwgaGFuZGxlclxuICAgIGVsc2VcbiAgICAgICAga2V5TWFwW2tleV0gPSBcIlwiXG5cbmV4cG9ydHMub2ZmS2V5ID0gKGtleSkgLT5cbiAgICBkZWxldGUga2V5TWFwW2tleV1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ2tleWRvd24nLCAoZXZlbnQpIC0+XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZXIgPSBrZXlNYXBbZXZlbnQua2V5Q29kZV1cbiAgICBpZiAoaGFuZGxlcilcbiAgICAgICAgaGFuZGxlcigpIiwidHZVdGlscyA9IHJlcXVpcmUgXCJ0dlV0aWxzXCJcbmsgPSByZXF1aXJlIFwiS2V5Ym9hcmRcIlxuY2xhc3MgZXhwb3J0cy5IaWdobGlnaHQgZXh0ZW5kcyBMYXllclxuICAgIGNvbnN0cnVjdG9yOiAoIG9wdGlvbnM9e30gKSAtPlxuXG4gICAgICAgIF8uZGVmYXVsdHMgQCxcbiAgICAgICAgICAgIGZpcnN0SGlnaGxpZ2h0OiBcIlwiXG4gICAgICAgIHN1cGVyIG9wdGlvbnNcblxuICAgICAgICBfLmFzc2lnbiBALFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIlwiXG4gICAgICAgICAgICBpbml0OiBmYWxzZVxuXG4gICAgICAgIEBjdXJyZW50Q29udGV4dCA9IEBmaXJzdEhpZ2hsaWdodFxuICAgICAgICBpZiBuYXZpZ2FibGVzQXJyYXk/XG4gICAgICAgICAgICBpZiBAY3VycmVudENvbnRleHQgPT0gXCJcIlxuICAgICAgICAgICAgICAgIG5hdmlnYWJsZXNBcnJheVswXVxuICAgICAgICAgICAgICAgIEBjdXJyZW50Q29udGV4dCA9IG5hdmlnYWJsZXNBcnJheVswXVxuICAgICAgICAgICAgZm9yIG5hdiBpbiBuYXZpZ2FibGVzQXJyYXlcbiAgICAgICAgICAgICAgICBpZiBuYXYgaW5zdGFuY2VvZiBNZW51XG4gICAgICAgICAgICAgICAgICAgIG5hdi5oaWdobGlnaHRMYXllciA9IG5hdi5fYXNzaWduSGlnaGxpZ2h0KCBALl9jcmVhdGVNZW51SGlnaGxpZ2h0KCBuYXYgKSApXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBuYXYgaW5zdGFuY2VvZiBDYXJvdXNlbCBvciBuYXYgaW5zdGFuY2VvZiBHcmlkXG4gICAgICAgICAgICAgICAgICAgIG5hdi5oaWdobGlnaHRMYXllciA9IG5hdi5fYXNzaWduSGlnaGxpZ2h0KCBALl9jcmVhdGVUaWxlSGlnaGxpZ2h0KCkgKVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgbmF2IGluc3RhbmNlb2YgTmF2aWdhYmxlc1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoYXQncyBmaW5lLCB0aGlzIGlzIGEgY3VzdG9tIGVsZW1lbnQgYW5kIGNhbiBtYWtlIGl0J3Mgb3duIGhpZ2hsaWdodCBzdGF0ZS5cIilcbiAgICAgICAgICAgICAgICBlbHNlIGlmIG5hdi5oaWdobGlnaHQ/XG4gICAgICAgICAgICAgICAgICAgIG5hdi5oaWdobGlnaHQoMClcbiAgICAgICAgICAgICAgICBlbHNlIHRocm93IFwiQWxsIE5hdmlnYWJsZXMgbXVzdCBoYXZlIGEgLmhpZ2hsaWdodCgpIGZ1bmN0aW9uIGFuZCBhIC5yZW1vdmVIaWdobGlnaHQoKSBmdW5jdGlvbi5cIlxuXG4gICAgICAgICPCoFBsYWNlIGluIHJlc2V0IGNvbnRleHQgbWV0aG9kXG4gICAgICAgIEAuc2V0Q29udGV4dCggbmF2aWdhYmxlc0FycmF5WzBdICk7XG5cbiAgICBfY3JlYXRlTWVudUhpZ2hsaWdodDogKCBuYXYgKSAtPlxuICAgICAgICBAbWVudUhpZ2hsaWdodCA9IG5ldyBMYXllclxuICAgICAgICAgICAgcGFyZW50OiBAXG4gICAgICAgICAgICB5OiBuYXYuaGlnaGxpZ2h0WVxuICAgICAgICAgICAgeDogbmF2LmNoaWxkcmVuW25hdi5oaWdobGlnaHRJbmRleF0uc2NyZWVuRnJhbWUueFxuICAgICAgICAgICAgaGVpZ2h0OiAyXG4gICAgICAgICAgICB3aWR0aDogbmF2LmNoaWxkcmVuWzBdLndpZHRoKzEwXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHR2VXRpbHMuYmx1ZVxuICAgICAgICBtZW51SGlnaGxpZ2h0R2xvdyA9IG5ldyBMYXllclxuICAgICAgICAgICAgcGFyZW50OiBAbWVudUhpZ2hsaWdodFxuICAgICAgICAgICAgaGVpZ2h0OiA0XG4gICAgICAgICAgICB4OiAtNVxuICAgICAgICAgICAgeTogLTFcbiAgICAgICAgICAgIGJsdXI6IDdcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdHZVdGlscy5ibHVlXG4gICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgIG1lbnVIaWdobGlnaHRHbG93LmJyaW5nVG9Gcm9udCgpXG5cbiAgICAgICAgbWVudUhpZ2hsaWdodFB1bHNlID0gbmV3IEFuaW1hdGlvblxuICAgICAgICAgICAgbGF5ZXI6IG1lbnVIaWdobGlnaHRHbG93XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIHRpbWU6IDJcbiAgICAgICAgICAgIGN1cnZlOiBcImVhc2UtaW4tb3V0XCJcblxuICAgICAgICBtZW51SGlnaGxpZ2h0UHVsc2VGYWRlID0gbmV3IEFuaW1hdGlvblxuICAgICAgICAgICAgbGF5ZXI6IG1lbnVIaWdobGlnaHRHbG93XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDBcbiAgICAgICAgICAgIHRpbWU6IDJcbiAgICAgICAgICAgIGN1cnZlOiBcImVhc2UtaW4tb3V0XCJcblxuICAgICAgICBtZW51SGlnaGxpZ2h0UHVsc2Uub24oRXZlbnRzLkFuaW1hdGlvbkVuZCwgbWVudUhpZ2hsaWdodFB1bHNlRmFkZS5zdGFydClcbiAgICAgICAgbWVudUhpZ2hsaWdodFB1bHNlRmFkZS5vbihFdmVudHMuQW5pbWF0aW9uRW5kLCBtZW51SGlnaGxpZ2h0UHVsc2Uuc3RhcnQpXG4gICAgICAgIG1lbnVIaWdobGlnaHRQdWxzZS5zdGFydCgpXG4gICAgICAgIG1lbnVIaWdobGlnaHRHbG93LmJsdXIgPSA3XG5cbiAgICAgICAgcmV0dXJuIEBtZW51SGlnaGxpZ2h0XG5cbiAgICBfY3JlYXRlVGlsZUhpZ2hsaWdodDogKCkgLT5cbiAgICAgICAgQHRpbGVIaWdobGlnaHQgPSBuZXcgTGF5ZXJcbiAgICAgICAgICAgIHBhcmVudDogQFxuICAgICAgICAgICAgd2lkdGg6IDIzMFxuICAgICAgICAgICAgaGVpZ2h0OiAxMjlcbiAgICAgICAgICAgIGJvcmRlcldpZHRoOiAyXG4gICAgICAgICAgICBib3JkZXJDb2xvcjogdHZVdGlscy5ibHVlXG4gICAgICAgIEB0aWxlSGlnaGxpZ2h0LnN0eWxlLmJhY2tncm91bmQgPSBcIlwiXG5cbiAgICAgICAgdGlsZUdsb3cgPSBAdGlsZUhpZ2hsaWdodC5jb3B5KClcbiAgICAgICAgXy5hc3NpZ24gdGlsZUdsb3csXG4gICAgICAgICAgICBwYXJlbnQ6IEB0aWxlSGlnaGxpZ2h0XG4gICAgICAgICAgICBzdHlsZTogXCJiYWNrZ3JvdW5kXCI6XCJcIlxuICAgICAgICAgICAgYm9yZGVyV2lkdGg6IDVcbiAgICAgICAgICAgIGJsdXI6IDZcbiAgICAgICAgICAgIG9wYWNpdHk6IDBcblxuICAgICAgICBAdGlsZUhpZ2hsaWdodFB1bHNlID0gbmV3IEFuaW1hdGlvbiB0aWxlR2xvdyxcbiAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIG9wdGlvbnM6XG4gICAgICAgICAgICAgICAgdGltZTogM1xuICAgICAgICAgICAgICAgIGN1cnZlOiAnZWFzZS1pbi1vdXQnXG5cbiAgICAgICAgQHRpbGVIaWdobGlnaHRQdWxzZUZhZGUgPSBAdGlsZUhpZ2hsaWdodFB1bHNlLnJldmVyc2UoKVxuICAgICAgICBAdGlsZUhpZ2hsaWdodFB1bHNlLm9wdGlvbnMuZGVsYXkgPSAxXG5cbiAgICAgICAgQHRpbGVIaWdobGlnaHRQdWxzZS5vbihFdmVudHMuQW5pbWF0aW9uRW5kLCBAdGlsZUhpZ2hsaWdodFB1bHNlRmFkZS5zdGFydClcbiAgICAgICAgQHRpbGVIaWdobGlnaHRQdWxzZUZhZGUub24oRXZlbnRzLkFuaW1hdGlvbkVuZCwgQHRpbGVIaWdobGlnaHRQdWxzZS5zdGFydClcbiAgICAgICAgQHRpbGVIaWdobGlnaHRQdWxzZS5zdGFydCgpXG5cbiAgICAgICAgcmV0dXJuIEB0aWxlSGlnaGxpZ2h0XG5cbiAgICBzZXRDb250ZXh0OiAoIG5ld0NvbnRleHQgKSAtPlxuICAgICAgICBmb3IgbmF2IGluIG5hdmlnYWJsZXNBcnJheVxuICAgICAgICAgICAgaWYgbmF2ICE9IG5ld0NvbnRleHRcbiAgICAgICAgICAgICAgICBuYXYucmVtb3ZlSGlnaGxpZ2h0KClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBuYXYuaGlnaGxpZ2h0KG5hdi5sYXN0SGlnaGxpZ2h0KVxuICAgICAgICAgICAgICAgIEAuY3VycmVudENvbnRleHQgPSBuYXZcblxuICAgICAgICBpZiBuZXdDb250ZXh0Lm1vdmVVcD8gPT0gZmFsc2UgdGhlbiBuZXdDb250ZXh0Lm1vdmVVcCA9IC0+IG5ld0NvbnRleHQuZW1pdChcInVwT3V0XCIpXG4gICAgICAgIGlmIG5ld0NvbnRleHQubW92ZVJpZ2h0PyA9PSBmYWxzZSB0aGVuIG5ld0NvbnRleHQubW92ZVJpZ2h0ID0gLT4gbmV3Q29udGV4dC5lbWl0KFwicmlnaHRPdXRcIilcbiAgICAgICAgaWYgbmV3Q29udGV4dC5tb3ZlRG93bj8gPT0gZmFsc2UgdGhlbiBuZXdDb250ZXh0Lm1vdmVEb3duID0gLT4gbmV3Q29udGV4dC5lbWl0KFwiZG93bk91dFwiKVxuICAgICAgICBpZiBuZXdDb250ZXh0Lm1vdmVMZWZ0PyA9PSBmYWxzZSB0aGVuIG5ld0NvbnRleHQubW92ZUxlZnQgPSAtPiBuZXdDb250ZXh0LmVtaXQoXCJsZWZ0T3V0XCIpXG5cbiAgICAgICAgay5vbktleSggay5yaWdodCwgbmV3Q29udGV4dC5tb3ZlUmlnaHQgKVxuICAgICAgICBrLm9uS2V5KCBrLmxlZnQsIG5ld0NvbnRleHQubW92ZUxlZnQgKVxuICAgICAgICBrLm9uS2V5KCBrLnVwLCBuZXdDb250ZXh0Lm1vdmVVcCApXG4gICAgICAgIGsub25LZXkoIGsuZG93biwgbmV3Q29udGV4dC5tb3ZlRG93biApXG5cbiAgICByZW1vdmVIaWdobGlnaHQ6ICgpIC0+XG4gICAgICAgIGZvciBuYXYgaW4gbmF2aWdhYmxlc0FycmF5XG4gICAgICAgICAgICBuYXYucmVtb3ZlSGlnaGxpZ2h0KClcbiAgICAgICAgICAgIG5hdi5oaWdobGlnaHRMYXllci52aXNpYmxlID0gZmFsc2UgaWYgbmF2LmhpZ2hsaWdodExheWVyP1xuICAgICAgICAgICAgay5vbktleSggay5yaWdodCwgdW5kZWZpbmVkIClcbiAgICAgICAgICAgIGsub25LZXkoIGsubGVmdCwgdW5kZWZpbmVkIClcbiAgICAgICAgICAgIGsub25LZXkoIGsudXAsIHVuZGVmaW5lZCApXG4gICAgICAgICAgICBrLm9uS2V5KCBrLmRvd24sIHVuZGVmaW5lZCApIiwieyBQcm9ncmFtbWVUaWxlIH0gPSByZXF1aXJlIFwiUHJvZ3JhbW1lVGlsZVwiXG57IE5hdmlnYWJsZXMgfSA9IHJlcXVpcmUgXCJOYXZpZ2FibGVzXCJcblxuY2xhc3MgZXhwb3J0cy5HcmlkIGV4dGVuZHMgTmF2aWdhYmxlc1xuXHRjb25zdHJ1Y3RvcjogKCBvcHRpb25zPXt9ICkgLT5cblx0XHRAX19jb25zdHJ1Y3Rpb24gPSB0cnVlXG5cdFx0QF9faW5zdGFuY2luZyA9IHRydWVcblx0XHRfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHR0aWxlV2lkdGg6IDIzMFxuXHRcdFx0dGlsZUhlaWdodDogMTI5XG5cdFx0XHRnYXBzOiA4XG5cdFx0XHRudW1iZXJPZlRpbGVzOiAzMFxuXHRcdFx0dGlsZUxhYmVsOiAnT24gTm93J1xuXHRcdFx0Y29sdW1uczogNFxuXHRcdFx0ZGVidWc6IGZhbHNlXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdGRlbGV0ZSBAX19jb25zdHJ1Y3Rpb25cblxuXHRcdF8uYXNzaWduIEAsXG5cdFx0XHR0aWxlV2lkdGg6IG9wdGlvbnMudGlsZVdpZHRoXG5cdFx0XHR0aWxlSGVpZ2h0OiBvcHRpb25zLnRpbGVIZWlnaHRcblx0XHRcdGdhcHM6IG9wdGlvbnMuZ2Fwc1xuXHRcdFx0Y29sdW1uczogb3B0aW9ucy5jb2x1bW5zXG5cdFx0XHRudW1iZXJPZlRpbGVzOiBvcHRpb25zLm51bWJlck9mVGlsZXNcblxuXHRcdEBkZWJ1ZyA9IG9wdGlvbnMuZGVidWdcblx0XHQjU2FmZSB6b25lXG5cdFx0QGZpcnN0UG9zaXRpb24gPSBvcHRpb25zLnhcblx0XHRAZ2FwcyA9IG9wdGlvbnMuZ2Fwc1xuXHRcdEB4UG9zID0gMVxuXHRcdEB5UG9zID0gMVxuXHRcdEBldmVudHMgPSBbXVxuXG5cdFx0IyBmb3IgaSBpbiBbMC4uLkBudW1iZXJPZlRpbGVzXVxuXHRcdCMgXHRjb25zb2xlLmxvZyggXCJhZGRlZFwiIClcblx0XHQjIFx0QGFkZFRpbGUoKVxuXHRcdFxuXHRcdCMgQF91cGRhdGVXaWR0aCgpXG5cdFx0IyBAX3VwZGF0ZUhlaWdodCggb3B0aW9ucy50aWxlSGVpZ2h0IClcblxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgUHJpdmF0ZSBNZXRob2RzXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHQjIF91cGRhdGVIZWlnaHQ6ICggdmFsdWUgKSAtPlxuXHQjIFx0QC5oZWlnaHQgPSB2YWx1ZVxuXG5cdCMgX3VwZGF0ZVdpZHRoOiAoKSAtPlxuXHQjIFx0QC53aWR0aCA9IChALnRpbGVXaWR0aCtALmdhcHMpKkAubnVtYmVyT2ZUaWxlcyBpZiBAP1xuXHRcblx0IyBfc2V0VGlsZVdpZHRoOiAoIHZhbHVlICkgLT5cblx0IyBcdGZvciB0aWxlLCBpIGluIEAuY2hpbGRyZW5cblx0IyBcdFx0dGlsZS54ID0gKHZhbHVlK0BnYXBzKSAqIGlcblx0IyBcdFx0dGlsZS53aWR0aCA9IHZhbHVlXG5cblx0IyBfYXBwbHlUb0FsbFRpbGVzOiAoIHRhc2ssIHZhbHVlICkgLT5cblx0IyBcdGZvciB0aWxlLCBpIGluIEAuY2hpbGRyZW5cblx0IyBcdFx0aWYgdmFsdWU/XG5cdCMgXHRcdFx0dGFzayggdGlsZSwgdmFsdWUgKVxuXHQjIFx0XHRlbHNlXG5cdCMgXHRcdFx0dGFzayggdGlsZSApXG5cdFxuXHRfc2V0TnVtYmVyT2ZUaWxlczogKCB0aWxlc05vICkgLT5cblx0XHR0aWxlRGVsdGEgPSAtKEBudW1iZXJPZlRpbGVzIC0gdGlsZXNObylcblx0XHRpZiB0aWxlRGVsdGEgPiAwXG5cdFx0XHRmb3IgaSBpbiBbMC4uLnRpbGVEZWx0YV1cblx0XHRcdFx0QGFkZFRpbGUoKVxuXHRcdGVsc2UgaWYgdGlsZURlbHRhIDwgMFxuXHRcdFx0QHJlbW92ZVRpbGVzKCAtdGlsZURlbHRhIClcblxuXHRfYXBwbHlEYXRhOiAoIGRhdGFBcnJheSApIC0+XG5cdFx0aWYgQGRlYnVnID09IGZhbHNlXG5cdFx0XHRmb3IgdGlsZSwgaSBpbiBALmNoaWxkcmVuXG5cdFx0XHRcdGlmIGRhdGFBcnJheVtpXT9cblx0XHRcdFx0XHR0aWxlLnRpdGxlID0gdHZVdGlscy5odG1sRW50aXRpZXMoIGRhdGFBcnJheVtpXS50aXRsZSApXG5cdFx0XHRcdFx0dGlsZS5pbWFnZSA9IHR2VXRpbHMuaHRtbEVudGl0aWVzKCBkYXRhQXJyYXlbaV0uaW1hZ2UgKVxuXHRcdFx0XHRcdHRpbGUubGFiZWwgPSB0dlV0aWxzLmh0bWxFbnRpdGllcyggZGF0YUFycmF5W2ldLmxhYmVsIClcblx0XHRcdFx0XHR0aWxlLnRoaXJkTGluZSA9IHR2VXRpbHMuaHRtbEVudGl0aWVzKCBkYXRhQXJyYXlbaV0udGhpcmRMaW5lIClcblx0XHRlbHNlIHJldHVyblxuXHRcblx0X2xvYWRFdmVudHM6ICggZmVlZCApIC0+XG5cdFx0Zm9yIGV2ZW50LCBpIGluIGZlZWQuaXRlbXNcblx0XHRcdGV2ZW50ID0ge1xuXHRcdFx0XHR0aXRsZTogaWYgZXZlbnQuYnJhbmRTdW1tYXJ5PyB0aGVuIGV2ZW50LmJyYW5kU3VtbWFyeS50aXRsZSBlbHNlIGV2ZW50LnRpdGxlXG5cdFx0XHRcdGltYWdlOiB0dlV0aWxzLmZpbmRJbWFnZUJ5SUQoZXZlbnQuaWQpXG5cdFx0XHRcdHRoaXJkTGluZTogaWYgZXZlbnQuc2VyaWVzU3VtbWFyeT8gdGhlbiBldmVudC5zZXJpZXNTdW1tYXJ5LnRpdGxlICsgXCIsIFwiICsgZXZlbnQudGl0bGUgZWxzZSBldmVudC5zaG9ydFN5bm9wc2lzXG5cdFx0XHRcdGxhYmVsOiBpZiBldmVudC5vbkRlbWFuZFN1bW1hcnk/IHRoZW4gdHZVdGlscy5lbnRpdGxlbWVudEZpbmRlcihldmVudC5vbkRlbWFuZFN1bW1hcnkpIGVsc2UgXCJcIlxuXHRcdFx0fVxuXHRcdFx0QGV2ZW50c1tpXSA9ICggZXZlbnQgKVxuXG5cdCMgX21vdmVIaWdobGlnaHQ6ICggY2hpbGRJbmRleCApID0+XG5cdCMgXHRpZiBAaGlnaGxpZ2h0TGF5ZXI/ID09IGZhbHNlXG5cdCMgXHRcdHJldHVyblxuXHQjIFx0eFBvcyA9IGNoaWxkSW5kZXgqKCBAZ2FwcytAdGlsZVdpZHRoICkgKyBAZmlyc3RQb3NpdGlvblxuXHQjIFx0aWYgQGhpZ2hsaWdodExheWVyLnNjcmVlbkZyYW1lLnkgPT0gQC5zY3JlZW5GcmFtZS55XG5cdCMgXHRcdEBoaWdobGlnaHRMYXllci5hbmltYXRlXG5cdCMgXHRcdFx0eDogeFBvcyBcblx0IyBcdGVsc2Vcblx0IyBcdFx0QGhpZ2hsaWdodExheWVyLnggPSB4UG9zIFxuXHQjIFx0XHRAaGlnaGxpZ2h0TGF5ZXIueSA9IEAuc2NyZWVuRnJhbWUueVxuXG5cdCMgXHRAZm9jdXNJbmRleCA9IGNoaWxkSW5kZXhcblx0XG5cdCMgX21vdmVDYXJvdXNlbDogKCB0aWxlSW5kZXggKSAtPlxuXHQjIFx0aWYgQGhpZ2hsaWdodExheWVyPyA9PSBmYWxzZVxuXHQjIFx0XHRyZXR1cm5cblx0IyBcdGNhcm91c2VsTGVmdC5zdG9wKCkgaWYgY2Fyb3VzZWxMZWZ0P1xuXHQjIFx0Y2Fyb3VzZWxMZWZ0ID0gbmV3IEFuaW1hdGlvbiBALFxuXHQjIFx0XHR4OiAtKChAdGlsZVdpZHRoK0BnYXBzKSpAY2Fyb3VzZWxJbmRleCkgKyBAZmlyc3RQb3NpdGlvblxuXHQjIFx0Y2Fyb3VzZWxMZWZ0LnN0YXJ0KClcblx0IyBcdEAuc2VsZWN0KHRpbGVJbmRleCkuaGlnaGxpZ2h0KClcblxuXHQjICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyAjIFB1YmxpYyBNZXRob2RzXG5cdCMgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdGFkZFRpbGU6ICggdGlsZSApID0+XG5cdFx0Y29uc29sZS5sb2coIEAgKVxuXHRcdGxhc3RUaWxlSW5kZXggPSBALmNoaWxkcmVuLmxlbmd0aFxuXHRcdHJvd05vID0gTWF0aC5mbG9vcihsYXN0VGlsZUluZGV4L0Bjb2x1bW5zKSAjIHJvd051bWJlclxuXHRcdGZ1bGxUaWxlV2lkdGggPSBAdGlsZVdpZHRoK0BnYXBzXG5cdFx0QHdpZHRoID0gZnVsbFRpbGVXaWR0aCAqIEBjb2x1bW5zXG5cdFx0eFBvc2l0aW9uID0gZnVsbFRpbGVXaWR0aCpsYXN0VGlsZUluZGV4IC0gQHdpZHRoKnJvd05vXG5cdFx0eVBvc2l0aW9uID0gcm93Tm8qKEB0aWxlSGVpZ2h0K0BnYXBzKVxuXHRcdGlmIHRpbGUgPT0gdW5kZWZpbmVkXG5cdFx0XHR0aWxlID0gbmV3IFByb2dyYW1tZVRpbGVcblx0XHRcdFx0cGFyZW50OiBAXG5cdFx0XHRcdHdpZHRoOiBAdGlsZVdpZHRoXG5cdFx0XHRcdGhlaWdodDogQHRpbGVIZWlnaHRcblx0XHRcdFx0bWV0YTogQG1ldGFcblx0XHRcdFx0aW1hZ2U6IEBpbWFnZVxuXHRcdFx0XHR0aXRsZTogQHRpdGxlXG5cdFx0XHRcdHRoaXJkTGluZTogQHRoaXJkTGluZVxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHR0aWxlLnggPSB4UG9zaXRpb25cblx0XHRcdHRpbGUueSA9IHlQb3NpdGlvblxuXHRcdFx0Zm9yIHRpbGVzLCBpIGluIEAuY2hpbGRyZW5cblx0XHRcdFx0dGlsZXMuZGlzYXBwZWFyLnN0b3AoKVxuXHRcdFx0XHR0aWxlcy5hcHBlYXIuc3RhcnQoKVxuXHRcdFx0dGlsZS50aWxlQW5pbWF0aW9uID0gdGlsZS5hbmltYXRlXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XG5cdCMgcmVtb3ZlVGlsZXM6ICggbnVtYmVyT2ZUaWxlcyApID0+XG5cdCMgXHRmb3IgaSBpbiBbMC4uLm51bWJlck9mVGlsZXNdXG5cdCMgXHRcdGxhc3RUaWxlSW5kZXggPSBALmNoaWxkcmVuLmxlbmd0aC0xXG5cdCMgXHRcdEAuY2hpbGRyZW5bbGFzdFRpbGVJbmRleF0ub3BhY2l0eSA9IDBcblx0IyBcdFx0QC5jaGlsZHJlbltsYXN0VGlsZUluZGV4XS5kZXN0cm95KClcblxuXHQjIHNlbGVjdDogKCB4UG9zLCB5UG9zICkgLT5cblx0IyBcdHJldHVybiBAY2hpbGRyZW5bKHhQb3MqeVBvcyktMV1cblx0XG5cdGhpZ2hsaWdodDogKCB4UG9zLCB5UG9zICkgLT5cblx0XHQjIGlmIEBoaWdobGlnaHRMYXllcj9cblx0XHQjIFx0QC5zZWxlY3QoIHRpbGVJbmRleCApLmhpZ2hsaWdodCgpXG5cdFx0IyBcdEBoaWdobGlnaHRMYXllci5oZWlnaHQgPSBALnRpbGVIZWlnaHRcblx0XHQjIFx0QGhpZ2hsaWdodExheWVyLndpZHRoID0gQC50aWxlV2lkdGhcblx0XHQjIFx0Zm9yIGNoaWxkLCBpIGluIEBoaWdobGlnaHRMYXllci5jaGlsZHJlblxuXHRcdCMgXHRcdGNoaWxkLmhlaWdodCA9IEAudGlsZUhlaWdodFxuXHRcdCMgXHRcdGNoaWxkLndpZHRoID0gQC50aWxlV2lkdGhcblx0XHQjIFx0QC5fbW92ZUhpZ2hsaWdodCggQGZvY3VzSW5kZXggKVxuXHRcdCMgXHRAaGlnaGxpZ2h0TGF5ZXIudmlzaWJsZSA9IHRydWVcblx0XHRjb25zb2xlLmxvZyhcImhpZ2hsaWdodCBcIiArIHhQb3MgKyBcIiB8IFwiICsgeVBvcylcblx0XG5cdHJlbW92ZUhpZ2hsaWdodDogKCkgLT5cblx0XHQjIEAuc2VsZWN0KEBsYXN0SGlnaGxpZ2h0KS5yZW1vdmVIaWdobGlnaHQoKVxuXHRcdCMgQGhpZ2hsaWdodExheWVyLnZpc2libGUgPSBmYWxzZVxuICAgICAgICBjb25zb2xlLmxvZyhcInJlbW92ZSBoaWdobGlnaHRcIilcblxuXHQjIG1vdmVSaWdodDogPT5cblx0IyBcdHRvdGFsSW5kZXggPSBAZm9jdXNJbmRleCtAY2Fyb3VzZWxJbmRleFxuXHQjIFx0aWYgQGZvY3VzSW5kZXggPCBAcmlnaHRQYWdlQm91bmRhcnkgb3IgXG5cdCMgXHR0b3RhbEluZGV4ID09IEBudW1iZXJPZlRpbGVzLTJcblx0IyBcdFx0QC5zZWxlY3QoIHRvdGFsSW5kZXggKS5yZW1vdmVIaWdobGlnaHQoKVxuXHQjIFx0XHRAZm9jdXNJbmRleCsrXG5cdCMgXHRcdHRvdGFsSW5kZXggPSBAZm9jdXNJbmRleCArIEBjYXJvdXNlbEluZGV4XG5cdCMgXHRcdEAuaGlnaGxpZ2h0KCB0b3RhbEluZGV4IClcblx0IyBcdGVsc2UgaWYgQGZvY3VzSW5kZXggPj0gQHJpZ2h0UGFnZUJvdW5kYXJ5IGFuZCB0b3RhbEluZGV4IDwgQG51bWJlck9mVGlsZXMtMlxuXHQjIFx0XHRALnNlbGVjdCh0b3RhbEluZGV4KS5yZW1vdmVIaWdobGlnaHQoKVxuXHQjIFx0XHRAY2Fyb3VzZWxJbmRleCsrXG5cdCMgXHRcdHRvdGFsSW5kZXggPSBAZm9jdXNJbmRleCtAY2Fyb3VzZWxJbmRleFxuXHQjIFx0XHRALl9tb3ZlQ2Fyb3VzZWwoIHRvdGFsSW5kZXggKVxuXHQjIFx0ZWxzZSBAZW1pdChcInJpZ2h0T3V0XCIpXG5cdCMgXHRAbGFzdEhpZ2hsaWdodCA9IHRvdGFsSW5kZXhcblx0XG5cdCMgbW92ZUxlZnQ6ID0+XG5cdCMgXHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXgrQGNhcm91c2VsSW5kZXhcblx0IyBcdGlmIEBmb2N1c0luZGV4ID4gQGxlZnRQYWdlQm91bmRhcnkgb3IgXG5cdCMgXHR0b3RhbEluZGV4ID09IDFcblx0IyBcdFx0QC5zZWxlY3QoIHRvdGFsSW5kZXggKS5yZW1vdmVIaWdobGlnaHQoKVxuXHQjIFx0XHRAZm9jdXNJbmRleC0tXG5cdCMgXHRcdHRvdGFsSW5kZXggPSBAZm9jdXNJbmRleCArIEBjYXJvdXNlbEluZGV4XG5cdCMgXHRcdEAuaGlnaGxpZ2h0KCB0b3RhbEluZGV4IClcblx0IyBcdGVsc2UgaWYgQGZvY3VzSW5kZXggPj0gQGxlZnRQYWdlQm91bmRhcnkgYW5kIHRvdGFsSW5kZXggPiAxXG5cdCMgXHRcdEAuc2VsZWN0KCB0b3RhbEluZGV4ICkucmVtb3ZlSGlnaGxpZ2h0KClcblx0IyBcdFx0QGNhcm91c2VsSW5kZXgtLVxuXHQjIFx0XHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXgrQGNhcm91c2VsSW5kZXhcblx0IyBcdFx0QC5fbW92ZUNhcm91c2VsKCB0b3RhbEluZGV4IClcblx0IyBcdGVsc2UgQGVtaXQoXCJsZWZ0T3V0XCIpXG5cdCMgXHRAbGFzdEhpZ2hsaWdodCA9IHRvdGFsSW5kZXhcblx0XG5cdCMgbW92ZVVwOiAoKSA9PlxuXHQjIFx0QGVtaXQoXCJ1cE91dFwiKVxuXG5cdCMgbW92ZURvd246ICgpID0+XG5cdCMgXHRAZW1pdChcImRvd25PdXRcIilcblxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgSW5pdFxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFxuXHRcblxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgRGVmaW5pdGlvbnNcblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdCMgQGRlZmluZSAndGlsZVdpZHRoJyxcblx0IyBcdGdldDogLT4gQC5zZWxlY3QoMCkud2lkdGggaWYgQC5zZWxlY3QoKT9cblx0IyBcdHNldDogKCB2YWx1ZSApIC0+XG5cdCMgXHRcdHJldHVybiBpZiBAX19pbnN0YW5jaW5nXG5cdCMgXHRcdEBfc2V0VGlsZVdpZHRoKCB2YWx1ZSApIGlmIEA/XG5cdCMgQGRlZmluZSAndGlsZUhlaWdodCcsXG5cdCMgXHRnZXQ6IC0+IEAuc2VsZWN0KDApLmhlaWdodCBpZiBALnNlbGVjdCgwKT9cblx0IyBcdHNldDogKCB2YWx1ZSApIC0+XG5cdCMgXHRcdHJldHVybiBpZiBAX19jb25zdHJ1Y3Rpb25cblx0IyBcdFx0QC5fdXBkYXRlSGVpZ2h0KHZhbHVlKVxuXHRAZGVmaW5lICdudW1iZXJPZlRpbGVzJyxcblx0XHRnZXQ6IC0+IEAuY2hpbGRyZW4ubGVuZ3RoXG5cdFx0c2V0OiAoIHZhbHVlICkgLT5cblx0XHRcdHJldHVybiBpZiBAX19jb25zdHJ1Y3Rpb25cblx0XHRcdEBfc2V0TnVtYmVyT2ZUaWxlcyggdmFsdWUgKVxuXHRcblx0IyBAZGVmaW5lICd3aWR0aCcsXG5cdCMgXHRnZXQ6IC0+IEBfd2lkdGhcblx0IyBcdHNldDogKCB2YWx1ZSApIC0+IEBfdXBkYXRlV2lkdGggaWYgQD9cblxuXHRkZWxldGUgQF9faW5zdGFuY2luZyIsInsgUHJvZ3JhbW1lVGlsZSB9ID0gcmVxdWlyZSBcIlByb2dyYW1tZVRpbGVcIlxueyBOYXZpZ2FibGVzIH0gPSByZXF1aXJlIFwiTmF2aWdhYmxlc1wiXG5cbmNsYXNzIGV4cG9ydHMuQ2Fyb3VzZWwgZXh0ZW5kcyBOYXZpZ2FibGVzXG5cdGNvbnN0cnVjdG9yOiAoIG9wdGlvbnM9e30gKSAtPlxuXHRcdEBfX2NvbnN0cnVjdGlvbiA9IHRydWVcblx0XHRAX19pbnN0YW5jaW5nID0gdHJ1ZVxuXHRcdF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdHRpbGVXaWR0aDogMjgwXG5cdFx0XHR0aWxlSGVpZ2h0OiAxNTdcblx0XHRcdGhlaWdodDogb3B0aW9ucy50aWxlSGVpZ2h0XG5cdFx0XHRnYXBzOiA4XG5cdFx0XHRudW1iZXJPZlRpbGVzOiA1XG5cdFx0XHR0aWxlTGFiZWw6ICdPbiBOb3cnXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCdcblx0XHRcdGRlYnVnOiBmYWxzZVxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRkZWxldGUgQF9fY29uc3RydWN0aW9uXG5cblx0XHRfLmFzc2lnbiBALFxuXHRcdFx0aGVpZ2h0OiBvcHRpb25zLnRpbGVIZWlnaHRcblx0XHRcdHRpbGVXaWR0aDogb3B0aW9ucy50aWxlV2lkdGhcblx0XHRcdHRpbGVIZWlnaHQ6IG9wdGlvbnMudGlsZUhlaWdodFxuXHRcdFx0Z2Fwczogb3B0aW9ucy5nYXBzXG5cdFx0XHRmb2N1c0luZGV4OiAwXG5cdFx0XHRjYXJvdXNlbEluZGV4OiAwXG5cdFx0XG5cdFx0QGRlYnVnID0gb3B0aW9ucy5kZWJ1Z1xuXHRcdCNTYWZlIHpvbmVcblx0XHRAZmlyc3RQb3NpdGlvbiA9IG9wdGlvbnMueFxuXHRcdEBmdWxsVGlsZXNWaXNpYmxlID0gXy5mbG9vciggU2NyZWVuLndpZHRoIC8gKG9wdGlvbnMudGlsZVdpZHRoK29wdGlvbnMuZ2FwcykgKVxuXHRcdEByaWdodFBhZ2VCb3VuZGFyeSA9IEBmdWxsVGlsZXNWaXNpYmxlIC0gMSAtIDEgI0FjY291bnRpbmcgZm9yIDBcblx0XHRAbGVmdFBhZ2VCb3VuZGFyeSA9IDFcblx0XHRAZ2FwcyA9IG9wdGlvbnMuZ2Fwc1xuXHRcdEBsYXN0SGlnaGxpZ2h0ID0gMFxuXHRcdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0IyBMYXllcnNcblx0XHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdFxuXHRcdEBldmVudHMgPSBbXVxuXHRcdGZvciBpIGluIFswLi4ub3B0aW9ucy5udW1iZXJPZlRpbGVzXVxuXHRcdFx0QGFkZFRpbGUoKVxuXHRcdFxuXHRcdEBfdXBkYXRlV2lkdGgoKVxuXHRcdEBfdXBkYXRlSGVpZ2h0KCBvcHRpb25zLnRpbGVIZWlnaHQgKVxuXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyBFdmVudHNcblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0QG9uIFwiY2hhbmdlOndpZHRoXCIsIEBfdXBkYXRlV2lkdGhcblx0XHRAb24gXCJjaGFuZ2U6aGVpZ2h0XCIsIEBfdXBkYXRlSGVpZ2h0XG5cblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIFByaXZhdGUgTWV0aG9kc1xuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0X3VwZGF0ZUhlaWdodDogKCB2YWx1ZSApIC0+XG5cdFx0QC5oZWlnaHQgPSB2YWx1ZVxuXHRcdGZvciBjaGlsZCBpbiBALmNoaWxkcmVuXG5cdFx0XHRjaGlsZC5oZWlnaHQgPSB2YWx1ZVxuXG5cdF91cGRhdGVXaWR0aDogKCkgLT5cblx0XHRALndpZHRoID0gKEAudGlsZVdpZHRoK0AuZ2FwcykqQC5udW1iZXJPZlRpbGVzIGlmIEA/XG5cdFxuXHRfc2V0VGlsZVdpZHRoOiAoIHZhbHVlICkgLT5cblx0XHRmb3IgdGlsZSwgaSBpbiBALmNoaWxkcmVuXG5cdFx0XHR0aWxlLnggPSAodmFsdWUrQGdhcHMpICogaVxuXHRcdFx0dGlsZS53aWR0aCA9IHZhbHVlXG5cblx0X2FwcGx5VG9BbGxUaWxlczogKCB0YXNrLCB2YWx1ZSApIC0+XG5cdFx0Zm9yIHRpbGUsIGkgaW4gQC5jaGlsZHJlblxuXHRcdFx0aWYgdmFsdWU/XG5cdFx0XHRcdHRhc2soIHRpbGUsIHZhbHVlIClcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGFzayggdGlsZSApXG5cdFxuXHRfc2V0TnVtYmVyT2ZUaWxlczogKCB0aWxlc05vICkgLT5cblx0XHR0aWxlRGVsdGEgPSAtKEBudW1iZXJPZlRpbGVzIC0gdGlsZXNObylcblx0XHRpZiB0aWxlRGVsdGEgPiAwXG5cdFx0XHRmb3IgaSBpbiBbMC4uLnRpbGVEZWx0YV1cblx0XHRcdFx0QGFkZFRpbGUoKVxuXHRcdGVsc2UgaWYgdGlsZURlbHRhIDwgMFxuXHRcdFx0QHJlbW92ZVRpbGVzKCAtdGlsZURlbHRhIClcblxuXHRfYXBwbHlEYXRhOiAoIGRhdGFBcnJheSApIC0+XG5cdFx0aWYgQGRlYnVnID09IGZhbHNlXG5cdFx0XHRmb3IgdGlsZSwgaSBpbiBALmNoaWxkcmVuXG5cdFx0XHRcdGlmIGRhdGFBcnJheVtpXT9cblx0XHRcdFx0XHR0aWxlLnRpdGxlID0gdHZVdGlscy5odG1sRW50aXRpZXMoIGRhdGFBcnJheVtpXS50aXRsZSApXG5cdFx0XHRcdFx0dGlsZS5pbWFnZSA9IHR2VXRpbHMuaHRtbEVudGl0aWVzKCBkYXRhQXJyYXlbaV0uaW1hZ2UgKVxuXHRcdFx0XHRcdHRpbGUubGFiZWwgPSB0dlV0aWxzLmh0bWxFbnRpdGllcyggZGF0YUFycmF5W2ldLmxhYmVsIClcblx0XHRcdFx0XHR0aWxlLnRoaXJkTGluZSA9IHR2VXRpbHMuaHRtbEVudGl0aWVzKCBkYXRhQXJyYXlbaV0udGhpcmRMaW5lIClcblx0XHRlbHNlIHJldHVyblxuXHRcblx0X2xvYWRFdmVudHM6ICggZmVlZCApIC0+XG5cdFx0Zm9yIGV2ZW50LCBpIGluIGZlZWQuaXRlbXNcblx0XHRcdGV2ZW50ID0ge1xuXHRcdFx0XHR0aXRsZTogaWYgZXZlbnQuYnJhbmRTdW1tYXJ5PyB0aGVuIGV2ZW50LmJyYW5kU3VtbWFyeS50aXRsZSBlbHNlIGV2ZW50LnRpdGxlXG5cdFx0XHRcdGltYWdlOiB0dlV0aWxzLmZpbmRJbWFnZUJ5SUQoZXZlbnQuaWQpXG5cdFx0XHRcdHRoaXJkTGluZTogaWYgZXZlbnQuc2VyaWVzU3VtbWFyeT8gdGhlbiBldmVudC5zZXJpZXNTdW1tYXJ5LnRpdGxlICsgXCIsIFwiICsgZXZlbnQudGl0bGUgZWxzZSBldmVudC5zaG9ydFN5bm9wc2lzXG5cdFx0XHRcdGxhYmVsOiBpZiBldmVudC5vbkRlbWFuZFN1bW1hcnk/IHRoZW4gdHZVdGlscy5lbnRpdGxlbWVudEZpbmRlcihldmVudC5vbkRlbWFuZFN1bW1hcnkpIGVsc2UgXCJcIlxuXHRcdFx0fVxuXHRcdFx0QGV2ZW50c1tpXSA9ICggZXZlbnQgKVxuXG5cdF9tb3ZlSGlnaGxpZ2h0OiAoIGNoaWxkSW5kZXggKSA9PlxuXHRcdGlmIEBoaWdobGlnaHRMYXllcj8gPT0gZmFsc2Vcblx0XHRcdHJldHVyblxuXHRcdGlmIEBmaXJzdFBvc2l0aW9uPyB0aGVuIGV4dHJhID0gQGZpcnN0UG9zaXRpb24gZWxzZSBleHRyYSA9IDBcblx0XHR4UG9zID0gY2hpbGRJbmRleCooIEBnYXBzK0B0aWxlV2lkdGggKSArIGV4dHJhXG5cdFx0aWYgQGhpZ2hsaWdodExheWVyLnNjcmVlbkZyYW1lLnkgPT0gQC5zY3JlZW5GcmFtZS55XG5cdFx0XHRAaGlnaGxpZ2h0TGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHR4OiB4UG9zIFxuXHRcdGVsc2Vcblx0XHRcdEBoaWdobGlnaHRMYXllci54ID0geFBvcyBcblx0XHRcdEBoaWdobGlnaHRMYXllci55ID0gQC5zY3JlZW5GcmFtZS55XG5cblx0XHRAZm9jdXNJbmRleCA9IGNoaWxkSW5kZXhcblx0XG5cdF9tb3ZlQ2Fyb3VzZWw6ICggdGlsZUluZGV4ICkgLT5cblx0XHRpZiBAaGlnaGxpZ2h0TGF5ZXI/ID09IGZhbHNlXG5cdFx0XHRyZXR1cm5cblx0XHRjYXJvdXNlbExlZnQuc3RvcCgpIGlmIGNhcm91c2VsTGVmdD9cblx0XHRjYXJvdXNlbExlZnQgPSBuZXcgQW5pbWF0aW9uIEAsXG5cdFx0XHR4OiAtKChAdGlsZVdpZHRoK0BnYXBzKSpAY2Fyb3VzZWxJbmRleCkgKyBAZmlyc3RQb3NpdGlvblxuXHRcdGNhcm91c2VsTGVmdC5zdGFydCgpXG5cdFx0QC5zZWxlY3QodGlsZUluZGV4KS5oaWdobGlnaHQoKVxuXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyBQdWJsaWMgTWV0aG9kc1xuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0YWRkVGlsZTogKCB0aWxlICkgPT5cblx0XHRsYXN0VGlsZUluZGV4ID0gQC5jaGlsZHJlbi5sZW5ndGhcblx0XHR4UG9zaXRpb24gPSAoIEB0aWxlV2lkdGggKyBAZ2FwcyApICogbGFzdFRpbGVJbmRleFxuXHRcdGlmIHRpbGUgPT0gdW5kZWZpbmVkXG5cdFx0XHR0aWxlID0gbmV3IFByb2dyYW1tZVRpbGVcblx0XHRcdFx0cGFyZW50OiBAXG5cdFx0XHRcdCMgbmFtZTogXCIuXCJcblx0XHRcdFx0eDogaWYgeFBvc2l0aW9uID09IHVuZGVmaW5lZCB0aGVuIDAgZWxzZSB4UG9zaXRpb25cblx0XHRcdFx0d2lkdGg6IEB0aWxlV2lkdGhcblx0XHRcdFx0aGVpZ2h0OiBAdGlsZUhlaWdodFxuXHRcdFx0XHRtZXRhOiBAbWV0YVxuXHRcdFx0XHRpbWFnZTogQGltYWdlXG5cdFx0XHRcdHRpdGxlOiBAdGl0bGVcblx0XHRcdFx0dGhpcmRMaW5lOiBAdGhpcmRMaW5lXG5cdFx0XHRcdG9wYWNpdHk6IDBcblxuXHRcdFx0Zm9yIHRpbGVzLCBpIGluIEAuY2hpbGRyZW5cblx0XHRcdFx0dGlsZXMuZGlzYXBwZWFyLnN0b3AoKVxuXHRcdFx0XHR0aWxlcy5hcHBlYXIuc3RhcnQoKVxuXG5cdFx0XHR0aWxlLnRpbGVBbmltYXRpb24gPSB0aWxlLmFuaW1hdGVcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcblx0cmVtb3ZlVGlsZXM6ICggbnVtYmVyT2ZUaWxlcyApID0+XG5cdFx0Zm9yIGkgaW4gWzAuLi5udW1iZXJPZlRpbGVzXVxuXHRcdFx0bGFzdFRpbGVJbmRleCA9IEAuY2hpbGRyZW4ubGVuZ3RoLTFcblx0XHRcdEAuY2hpbGRyZW5bbGFzdFRpbGVJbmRleF0ub3BhY2l0eSA9IDBcblx0XHRcdEAuY2hpbGRyZW5bbGFzdFRpbGVJbmRleF0uZGVzdHJveSgpXG5cblx0c2VsZWN0OiAoIGluZGV4ICkgLT5cblx0XHRyZXR1cm4gQGNoaWxkcmVuW2luZGV4XVxuXHRcblx0aGlnaGxpZ2h0OiAoIHRpbGVJbmRleCApIC0+XG5cdFx0aWYgQGhpZ2hsaWdodExheWVyP1xuXHRcdFx0QC5zZWxlY3QoIHRpbGVJbmRleCApLmhpZ2hsaWdodCgpXG5cdFx0XHRAaGlnaGxpZ2h0TGF5ZXIuaGVpZ2h0ID0gQC50aWxlSGVpZ2h0XG5cdFx0XHRAaGlnaGxpZ2h0TGF5ZXIud2lkdGggPSBALnRpbGVXaWR0aFxuXHRcdFx0Zm9yIGNoaWxkLCBpIGluIEBoaWdobGlnaHRMYXllci5jaGlsZHJlblxuXHRcdFx0XHRjaGlsZC5oZWlnaHQgPSBALnRpbGVIZWlnaHRcblx0XHRcdFx0Y2hpbGQud2lkdGggPSBALnRpbGVXaWR0aFxuXHRcdFx0QC5fbW92ZUhpZ2hsaWdodCggQGZvY3VzSW5kZXggKVxuXHRcdFx0QGhpZ2hsaWdodExheWVyLnZpc2libGUgPSB0cnVlXG5cdFxuXHRyZW1vdmVIaWdobGlnaHQ6ICgpIC0+XG5cdFx0QC5zZWxlY3QoQGxhc3RIaWdobGlnaHQpLnJlbW92ZUhpZ2hsaWdodCgpXG5cdFx0QGhpZ2hsaWdodExheWVyLnZpc2libGUgPSBmYWxzZVxuXG5cdG1vdmVSaWdodDogPT5cblx0XHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXgrQGNhcm91c2VsSW5kZXhcblx0XHRpZiBAZm9jdXNJbmRleCA8IEByaWdodFBhZ2VCb3VuZGFyeSBvciBcblx0XHR0b3RhbEluZGV4ID09IEBudW1iZXJPZlRpbGVzLTJcblx0XHRcdEAuc2VsZWN0KCB0b3RhbEluZGV4ICkucmVtb3ZlSGlnaGxpZ2h0KClcblx0XHRcdEBmb2N1c0luZGV4Kytcblx0XHRcdHRvdGFsSW5kZXggPSBAZm9jdXNJbmRleCArIEBjYXJvdXNlbEluZGV4XG5cdFx0XHRALmhpZ2hsaWdodCggdG90YWxJbmRleCApXG5cdFx0ZWxzZSBpZiBAZm9jdXNJbmRleCA+PSBAcmlnaHRQYWdlQm91bmRhcnkgYW5kIHRvdGFsSW5kZXggPCBAbnVtYmVyT2ZUaWxlcy0yXG5cdFx0XHRALnNlbGVjdCh0b3RhbEluZGV4KS5yZW1vdmVIaWdobGlnaHQoKVxuXHRcdFx0QGNhcm91c2VsSW5kZXgrK1xuXHRcdFx0dG90YWxJbmRleCA9IEBmb2N1c0luZGV4K0BjYXJvdXNlbEluZGV4XG5cdFx0XHRALl9tb3ZlQ2Fyb3VzZWwoIHRvdGFsSW5kZXggKVxuXHRcdGVsc2UgQGVtaXQoXCJyaWdodE91dFwiKVxuXHRcdEBsYXN0SGlnaGxpZ2h0ID0gdG90YWxJbmRleFxuXHRcblx0bW92ZUxlZnQ6ID0+XG5cdFx0dG90YWxJbmRleCA9IEBmb2N1c0luZGV4K0BjYXJvdXNlbEluZGV4XG5cdFx0aWYgQGZvY3VzSW5kZXggPiBAbGVmdFBhZ2VCb3VuZGFyeSBvciBcblx0XHR0b3RhbEluZGV4ID09IDFcblx0XHRcdEAuc2VsZWN0KCB0b3RhbEluZGV4ICkucmVtb3ZlSGlnaGxpZ2h0KClcblx0XHRcdEBmb2N1c0luZGV4LS1cblx0XHRcdHRvdGFsSW5kZXggPSBAZm9jdXNJbmRleCArIEBjYXJvdXNlbEluZGV4XG5cdFx0XHRALmhpZ2hsaWdodCggdG90YWxJbmRleCApXG5cdFx0ZWxzZSBpZiBAZm9jdXNJbmRleCA+PSBAbGVmdFBhZ2VCb3VuZGFyeSBhbmQgdG90YWxJbmRleCA+IDFcblx0XHRcdEAuc2VsZWN0KHRvdGFsSW5kZXgpLnJlbW92ZUhpZ2hsaWdodCgpXG5cdFx0XHRAY2Fyb3VzZWxJbmRleC0tXG5cdFx0XHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXgrQGNhcm91c2VsSW5kZXhcblx0XHRcdEAuX21vdmVDYXJvdXNlbCggdG90YWxJbmRleCApXG5cdFx0ZWxzZVxuXHRcdFx0QGVtaXQoXCJsZWZ0T3V0XCIpXG5cdFx0QGxhc3RIaWdobGlnaHQgPSB0b3RhbEluZGV4XG5cdFxuXHRtb3ZlVXA6ICgpID0+XG5cdFx0QGVtaXQoXCJ1cE91dFwiKVxuXG5cdG1vdmVEb3duOiAoKSA9PlxuXHRcdEBlbWl0KFwiZG93bk91dFwiKVxuXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyBJbml0XG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XG5cdFxuXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyBEZWZpbml0aW9uc1xuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0IyBAZGVmaW5lICd0aWxlV2lkdGgnLFxuXHQjIFx0Z2V0OiAtPiBALnNlbGVjdCgwKS53aWR0aCBpZiBALnNlbGVjdCgpP1xuXHQjIFx0c2V0OiAoIHZhbHVlICkgLT5cblx0IyBcdFx0cmV0dXJuIGlmIEBfX2luc3RhbmNpbmdcblx0IyBcdFx0QF9zZXRUaWxlV2lkdGgoIHZhbHVlICkgaWYgQD9cblx0IyBAZGVmaW5lICd0aWxlSGVpZ2h0Jyxcblx0IyBcdGdldDogLT4gQC5zZWxlY3QoMCkuaGVpZ2h0IGlmIEAuc2VsZWN0KDApP1xuXHQjIFx0c2V0OiAoIHZhbHVlICkgLT5cblx0IyBcdFx0cmV0dXJuIGlmIEBfX2NvbnN0cnVjdGlvblxuXHQjIFx0XHRALl91cGRhdGVIZWlnaHQodmFsdWUpXG5cdEBkZWZpbmUgJ251bWJlck9mVGlsZXMnLFxuXHRcdGdldDogLT4gQC5jaGlsZHJlbi5sZW5ndGhcblx0XHRzZXQ6ICggdmFsdWUgKSAtPlxuXHRcdFx0cmV0dXJuIGlmIEBfX2NvbnN0cnVjdGlvblxuXHRcdFx0QF9zZXROdW1iZXJPZlRpbGVzKCB2YWx1ZSApXG5cdFxuXHQjIEBkZWZpbmUgJ3dpZHRoJyxcblx0IyBcdGdldDogLT4gQF93aWR0aFxuXHQjIFx0c2V0OiAoIHZhbHVlICkgLT4gQF91cGRhdGVXaWR0aCBpZiBAP1xuXG5cdGRlbGV0ZSBAX19pbnN0YW5jaW5nIiwieyBOYXZpZ2FibGVzIH0gPSByZXF1aXJlIFwiTmF2aWdhYmxlc1wiXG50dlV0aWxzID0gcmVxdWlyZSBcInR2VXRpbHNcIlxuXG5jbGFzcyBleHBvcnRzLkJ1dHRvbnMgZXh0ZW5kcyBOYXZpZ2FibGVzXG5cdGNvbnN0cnVjdG9yOiAoIG9wdGlvbnMgPXt9ICkgLT5cblx0XHRfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRoZWlnaHQ6IDQ2XG5cdFx0XHRib3JkZXJSYWRpdXM6IDNcblx0XHRcdGJ1dHRvbldpZHRoOiAyMDBcblx0XHRcdGdhcHM6IDE0XG5cdFx0XHRpdGVtczogW1wiQnV0dG9uIDFcIiwgXCJCdXR0b24gMlwiLCBcIkJ1dHRvbiAzXCJdXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdFxuXHRcdF8uYXNzaWduIEAsXG5cdFx0XHRidXR0b25XaWR0aDogb3B0aW9ucy5idXR0b25XaWR0aFxuXHRcdFx0Z2Fwczogb3B0aW9ucy5nYXBzXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiXCJcblxuXHRcdGZvciBidXR0b25UZXh0LCBpIGluIG9wdGlvbnMuaXRlbXNcblx0XHRcdEBidXR0b25Cb3JkZXIgPSBuZXcgTGF5ZXJcblx0XHRcdFx0Ym9yZGVyQ29sb3I6IFwiIzlDQUFCQ1wiXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRcdFx0XHRoZWlnaHQ6IDQ2XG5cdFx0XHRcdGJvcmRlclJhZGl1czogM1xuXHRcdFx0XHRib3JkZXJXaWR0aDogMVxuXHRcdFx0XHR3aWR0aDogQGJ1dHRvbldpZHRoXG5cdFx0XHRcdHg6IChAYnV0dG9uV2lkdGgrQGdhcHMpKmlcblx0XHRcdFx0cGFyZW50OiBAXG5cblx0XHRcdGJ1dHRvblRleHQgPSBuZXcgVGV4dExheWVyXG5cdFx0XHRcdHBhcmVudDogQGJ1dHRvbkJvcmRlclxuXHRcdFx0XHR0ZXh0OiBidXR0b25UZXh0XG5cdFx0XHRcdGNvbG9yOiB0dlV0aWxzLndoaXRlXG5cdFx0XHRcdGZvbnRGYW1pbHk6IFwiQXZlbmlyLWxpZ2h0XCJcblx0XHRcdFx0Zm9udFNpemU6IDIwXG5cdFx0XHRcdGxldHRlclNwYWNpbmc6IDAuM1xuXHRcdFx0XHR5OiBBbGlnbi5jZW50ZXIoMilcblx0XHRcdFx0eDogQWxpZ24uY2VudGVyKClcblxuXHRcdEBoaWdobGlnaHRMYXllciA9IG5ldyBMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIlwiXG5cdFx0QGxhc3RIaWdobGlnaHQgPSAwXG5cdFxuXHRoaWdobGlnaHQ6ICggbmV3SW5kZXggKSAtPlxuXHRcdEBjaGlsZHJlblsgbmV3SW5kZXggXS5iYWNrZ3JvdW5kQ29sb3IgPSB0dlV0aWxzLmRhcmtCbHVlXG5cdFx0QGxhc3RIaWdobGlnaHQgPSBuZXdJbmRleFxuXHRyZW1vdmVIaWdobGlnaHQ6ICgpIC0+XG5cdFx0QGNoaWxkcmVuWyBAbGFzdEhpZ2hsaWdodCBdLmJhY2tncm91bmRDb2xvciA9IFwiXCJcblx0bW92ZVJpZ2h0OiAoKSA9PlxuXHRcdGlmIEBsYXN0SGlnaGxpZ2h0IDwgQGNoaWxkcmVuLmxlbmd0aC0xXG5cdFx0XHRALnJlbW92ZUhpZ2hsaWdodCgpXG5cdFx0XHRALmhpZ2hsaWdodChAbGFzdEhpZ2hsaWdodCsxKVxuXHRcdGVsc2UgQGVtaXQoXCJyaWdodE91dFwiKVxuXHRtb3ZlTGVmdDogKCkgPT5cblx0XHRpZiBAbGFzdEhpZ2hsaWdodCA+IDBcblx0XHRcdEAucmVtb3ZlSGlnaGxpZ2h0KClcblx0XHRcdEAuaGlnaGxpZ2h0KEBsYXN0SGlnaGxpZ2h0LTEpXG5cdFx0ZWxzZSBAZW1pdChcImxlZnRPdXRcIikiLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQVlBQTtBREFBLElBQUEsbUJBQUE7RUFBQTs7OztBQUFFLGFBQWUsT0FBQSxDQUFRLFlBQVI7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
