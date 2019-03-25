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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2V4YW1wbGVzL3Byb2plY3QtZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy90dlV0aWxzLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2V4YW1wbGVzL3Byb2plY3QtZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9tb3JldXRpbHMuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc2ZyYXNlci9kZXYvZnJhbWVyL1RWLVByb3RvdHlwaW5nLVRvb2xraXQvZXhhbXBsZXMvcHJvamVjdC1leGFtcGxlLmZyYW1lci9tb2R1bGVzL1RWS2l0LmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2V4YW1wbGVzL3Byb2plY3QtZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9Qcm9ncmFtbWVUaWxlLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2V4YW1wbGVzL3Byb2plY3QtZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9OYXZpZ2FibGVzLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2V4YW1wbGVzL3Byb2plY3QtZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9NZW51LmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2V4YW1wbGVzL3Byb2plY3QtZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9LZXlib2FyZC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9zZnJhc2VyL2Rldi9mcmFtZXIvVFYtUHJvdG90eXBpbmctVG9vbGtpdC9leGFtcGxlcy9wcm9qZWN0LWV4YW1wbGUuZnJhbWVyL21vZHVsZXMvSGlnaGxpZ2h0LmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2V4YW1wbGVzL3Byb2plY3QtZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9HcmlkLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2V4YW1wbGVzL3Byb2plY3QtZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9DYXJvdXNlbC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9zZnJhc2VyL2Rldi9mcmFtZXIvVFYtUHJvdG90eXBpbmctVG9vbGtpdC9leGFtcGxlcy9wcm9qZWN0LWV4YW1wbGUuZnJhbWVyL21vZHVsZXMvQnV0dG9ucy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuIyA9PT09PT09PT09PT09PT09PT09PT09PT1cbiMgTGlzdCBvZiBkZXNpcmVkIGhlbHBlcnNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09XG4jICogXG5cbiMgQ29sb3Vyc1xuZXhwb3J0cy5ibHVlID0gXCIjMUQ1QUQwXCJcbmV4cG9ydHMuZGFya0JsdWUgPSBcIiMwRjUzOTFcIlxuZXhwb3J0cy53aGl0ZSA9IFwiI2ZmZlwiXG5leHBvcnRzLmRhcmtHcmV5ID0gXCIjM0EzQTNBXCJcblxuZXhwb3J0cy5saXZlRmVlZCA9ICggaWQgKSAtPlxuXHRjaGFubmVsID0gW1wiaHR0cDovL2EuZmlsZXMuYmJjaS5jby51ay9tZWRpYS9saXZlL21hbmlmZXN0by9hdWRpb192aWRlby9zaW11bGNhc3QvaGxzL3VrL2Ficl9oZHR2L2FrL2JiY19vbmVfaGQubTN1OFwiLFwiaHR0cDovL2EuZmlsZXMuYmJjaS5jby51ay9tZWRpYS9saXZlL21hbmlmZXN0by9hdWRpb192aWRlby9zaW11bGNhc3QvaGxzL3VrL2Ficl9oZHR2L2FrL2JiY190d29faGQubTN1OFwiLFwiaHR0cDovL2EuZmlsZXMuYmJjaS5jby51ay9tZWRpYS9saXZlL21hbmlmZXN0by9hdWRpb192aWRlby9zaW11bGNhc3QvaGxzL3VrL2Ficl9oZHR2L2FrL2JiY19mb3VyX2hkLm0zdThcIixcImh0dHA6Ly9hLmZpbGVzLmJiY2kuY28udWsvbWVkaWEvbGl2ZS9tYW5pZmVzdG8vYXVkaW9fdmlkZW8vc2ltdWxjYXN0L2hscy91ay9hYnJfaGR0di9hay9jYmVlYmllc19oZC5tM3U4XCIsXCJodHRwOi8vYS5maWxlcy5iYmNpLmNvLnVrL21lZGlhL2xpdmUvbWFuaWZlc3RvL2F1ZGlvX3ZpZGVvL3NpbXVsY2FzdC9obHMvdWsvYWJyX2hkdHYvYWsvYmJjX25ld3NfY2hhbm5lbF9oZC5tM3U4XCIsIFwiaHR0cDovL2EuZmlsZXMuYmJjaS5jby51ay9tZWRpYS9saXZlL21hbmlmZXN0by9hdWRpb192aWRlby9zaW11bGNhc3QvaGxzL3VrL2Ficl9oZHR2L2FrL2JiY19vbmVfc2NvdGxhbmRfaGQubTN1OFwiXVxuXHRpZiBpZCA9PSB1bmRlZmluZWQgdGhlbiBpZCA9IDBcblx0d2luZG93W1wibGl2ZUZlZWRcIl0gPSBuZXcgVmlkZW9MYXllclxuXHRcdG5hbWU6IFwibGl2ZUZlZWRcIlxuXHRcdHZpZGVvOiBpZiB0eXBlb2YgaWQgPT0gJ251bWJlcicgdGhlbiBjaGFubmVsW2lkXSBlbHNlIGlkXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIlwiXG5cdFx0c2l6ZTogU2NyZWVuLnNpemVcblx0bGl2ZUZlZWQucGxheWVyLnBsYXkoKVxuXHRsaXZlRmVlZC5wbGF5ZXIudm9sdW1lID0gMFxuXG5leHBvcnRzLmJpZ0J1Y2sgPSAtPlxuXHR3aW5kb3dbXCJiaWdCdWNrXCJdID0gbmV3IFZpZGVvTGF5ZXJcblx0XHR2aWRlbzogXCJodHRwOi8vbXVsdGlwbGF0Zm9ybS1mLmFrYW1haWhkLm5ldC9pL211bHRpL3dpbGwvYnVubnkvYmlnX2J1Y2tfYnVubnlfLDY0MHgzNjBfNDAwLDY0MHgzNjBfNzAwLDY0MHgzNjBfMTAwMCw5NTB4NTQwXzE1MDAsLmY0di5jc21pbC9pbmRleF8zX2F2Lm0zdThcIlxuXHRcdHNpemU6IFNjcmVlbi5zaXplXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIlwiXG5cdGJpZ0J1Y2sucGxheWVyLnBsYXkoKVxuXHRiaWdCdWNrLnBsYXllci52b2x1bWUgPSAwXG5cblxuIyBGcmFtZXIgdHJ1bmNhdGVzIG9uIHdvcmRzIGJ5IGRlZmF1bHQuIFRoaXMgZm9yY2VzIEZyYW1lciB0byB0cnVuY2F0ZSBpbmRpdmlkdWFsIGNoYXJhY3RlcnMuXG4jIFlvdSBjYW4gcGFzcyBhbiBpbmRpdmlkdWFsIGxheWVyIG9yIGFuIGFycmF5IG9mIGxheWVycy5cbmV4cG9ydHMuYnJlYWtMZXR0ZXIgPSAoIGxheWVyICkgLT5cblx0aWYgbGF5ZXIgaW5zdGFuY2VvZiBPYmplY3Rcblx0XHRmb3IgY2hpbGQsIGkgaW4gbGF5ZXJcblx0XHRcdGNoaWxkLnN0eWxlID0gXG5cdFx0XHRcdFwid29yZC1icmVha1wiIDogXCJicmVhay1hbGxcIlxuXHRlbHNlXG5cdFx0bGF5ZXIuc3R5bGUgPSBcblx0XHRcdFwid29yZC1icmVha1wiIDogXCJicmVhay1hbGxcIlxuXG5leHBvcnRzLmh0bWxFbnRpdGllcyA9IChzdHIpIC0+XG5cdHJldHVybiBzdHIucmVwbGFjZShcIiZhbXA7XCIsICcmJykucmVwbGFjZShcIiZsdDtcIiwgXCI8XCIpLnJlcGxhY2UoXCImZ3Q7XCIsIFwiPlwiKS5yZXBsYWNlKFwiJnF1b3Q7XCIsICdcIicpLnJlcGxhY2UoXCImYXBvcztcIiwgXCInXCIpLnJlcGxhY2UoXCImY2VudDtcIiwgXCLColwiKS5yZXBsYWNlKFwiJnBvdW5kO1wiLCBcIsKjXCIpLnJlcGxhY2UoXCImeWVuO1wiLCBcIsKlXCIpLnJlcGxhY2UoXCImZXVybztcIiwgXCLigqxcIikucmVwbGFjZShcImNvcHlyaWdodFwiLCBcIsKpXCIpLnJlcGxhY2UoXCImcmVnO1wiLCBcIsKuXCIpXG5cbmV4cG9ydHMuZmluZEluZGV4ID0gKGxheWVyKSAtPlxuXHRmb3IgY2hpbGQsIGkgaW4gbGF5ZXIucGFyZW50LmNoaWxkcmVuXG5cdFx0aWYgbGF5ZXIgPT0gY2hpbGRcblx0XHRcdHJldHVybiBpXG5cbmV4cG9ydHMuaFJ1bGUgPSAocGl4ZWxOdW0sIGNvbG9yLCBvcGFjKSAtPlxuXHRuZXcgTGF5ZXJcblx0XHRuYW1lOiBcIi5cIlxuXHRcdHk6IHBpeGVsTnVtXG5cdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdGhlaWdodDogMVxuXHRcdGJhY2tncm91bmRDb2xvcjogaWYgY29sb3I/IHRoZW4gY29sb3IgZWxzZSBcInJlZFwiXG5cdFx0b3BhY2l0eTogaWYgb3BhYz8gdGhlbiBvcGFjIGVsc2UgMC41XG5cbmV4cG9ydHMudlJ1bGUgPSAocGl4ZWxOdW0sIGNvbG9yLCBvcGFjKSAtPlxuXHRuZXcgTGF5ZXJcblx0XHRuYW1lOiBcIi5cIlxuXHRcdHg6IHBpeGVsTnVtXG5cdFx0d2lkdGg6IDFcblx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGlmIGNvbG9yPyB0aGVuIGNvbG9yIGVsc2UgXCJyZWRcIlxuXHRcdG9wYWNpdHk6IGlmIG9wYWM/IHRoZW4gb3BhYyBlbHNlIDAuNVxuXG5leHBvcnRzLmhHcmlkID0gKHhHYXAsIGNvbG9yLCBvcGFjKSAtPlxuXHRudW1iZXJPZkxpbmVzID0gU2NyZWVuLmhlaWdodCAvIHhHYXBcblx0Zm9yIGkgaW4gWzAuLm51bWJlck9mTGluZXNdXG5cdFx0QC5oUnVsZShpKnhHYXAsIGNvbG9yLCBvcGFjKVxuXG5leHBvcnRzLnZHcmlkID0gKHlHYXAsIGNvbG9yLCBvcGFjKSAtPlxuXHRudW1iZXJPZkxpbmVzID0gU2NyZWVuLndpZHRoIC8geUdhcFxuXHRmb3IgaSBpbiBbMC4ubnVtYmVyT2ZMaW5lc11cblx0XHRALnZSdWxlKGkqeUdhcCwgY29sb3IsIG9wYWMpXG5cbmV4cG9ydHMuY29udmVydFRvTWlucyA9ICggc2VjcyApIC0+XG5cdHJldHVybiBzZWNzKjYwIiwiIyBBIGNvbGxlY3Rpb24gZm9yIGhlbHBlciBtZXRob2RzLlxuI1xuIyBAYXV0aG9yIHN0ZXZlcnVpem9rXG5cblxuIyMjXG5QaW4gYSBsYXllciB0byBhbm90aGVyIGxheWVyLiBXaGVuIHRoZSBzZWNvbmQgbGF5ZXIgbW92ZXMsIHRoZSBmaXJzdCBvbmUgd2lsbCB0b28uXG5cbkBwYXJhbSB7TGF5ZXJ9IGxheWVyIFRoZSBsYXllciB0byBwaW4uXG5AcGFyYW0ge0xheWVyfSB0YXJnZXQgVGhlIGxheWVyIHRvIHBpbiB0by4gXG5AcGFyYW0gey4uLlN0cmluZ30gZGlyZWN0aW9ucyBXaGljaCBzaWRlcyBvZiB0aGUgbGF5ZXIgdG8gcGluIHRvLlxuXG5cdFV0aWxzLnBpbihsYXllckEsIGxheWVyQiwgJ2xlZnQnKVxuXG4jIyNcblV0aWxzLnBpbiA9IChsYXllciwgdGFyZ2V0LCBkaXJlY3Rpb25zLi4uKSAtPlxuXHRpZiBkaXJlY3Rpb25zLmxlbmd0aCA+IDIgXG5cdFx0dGhyb3cgJ1V0aWxzLnBpbiBjYW4gb25seSB0YWtlIHR3byBkaXJlY3Rpb24gYXJndW1lbnRzIChlLmcuIFwibGVmdFwiLCBcInRvcFwiKS4gQW55IG1vcmUgd291bGQgY29uZmxpY3QhJ1xuXHRcblx0Zm9yIGRpcmVjdGlvbiBpbiBkaXJlY3Rpb25zXG5cdFx0ZG8gKGxheWVyLCB0YXJnZXQsIGRpcmVjdGlvbikgLT5cblx0XHRcdHN3aXRjaCBkaXJlY3Rpb25cblx0XHRcdFx0d2hlbiBcImxlZnRcIlxuXHRcdFx0XHRcdHByb3BzID0gWyd4J11cblx0XHRcdFx0XHRsUHJvcCA9ICdtYXhYJ1xuXHRcdFx0XHRcdGRpc3RhbmNlID0gdGFyZ2V0LnggLSAobGF5ZXIubWF4WClcblx0XHRcdFx0XHRnZXREaWZmZXJlbmNlID0gLT4gdGFyZ2V0LnggLSBkaXN0YW5jZVxuXHRcdFx0XHR3aGVuIFwicmlnaHRcIlxuXHRcdFx0XHRcdHByb3BzID0gWyd4JywgJ3dpZHRoJ11cblx0XHRcdFx0XHRsUHJvcCA9ICd4J1xuXHRcdFx0XHRcdGRpc3RhbmNlID0gbGF5ZXIueCAtICh0YXJnZXQubWF4WClcblx0XHRcdFx0XHRnZXREaWZmZXJlbmNlID0gLT4gdGFyZ2V0Lm1heFggKyBkaXN0YW5jZVxuXHRcdFx0XHR3aGVuIFwidG9wXCJcblx0XHRcdFx0XHRwcm9wcyA9IFsneSddXG5cdFx0XHRcdFx0bFByb3AgPSAnbWF4WSdcblx0XHRcdFx0XHRkaXN0YW5jZSA9IHRhcmdldC55IC0gKGxheWVyLm1heFkpXG5cdFx0XHRcdFx0Z2V0RGlmZmVyZW5jZSA9IC0+IHRhcmdldC55IC0gZGlzdGFuY2Vcblx0XHRcdFx0d2hlbiBcImJvdHRvbVwiXG5cdFx0XHRcdFx0cHJvcHMgPSBbJ3knLCAnaGVpZ2h0J11cblx0XHRcdFx0XHRsUHJvcCA9ICd5J1xuXHRcdFx0XHRcdGRpc3RhbmNlID0gbGF5ZXIueSAtICh0YXJnZXQubWF4WSlcblx0XHRcdFx0XHRnZXREaWZmZXJlbmNlID0gLT4gdGFyZ2V0Lm1heFkgKyBkaXN0YW5jZVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dGhyb3cgJ1V0aWxzLnBpbiAtIGRpcmVjdGlvbnMgY2FuIG9ubHkgYmUgdG9wLCByaWdodCwgYm90dG9tIG9yIGxlZnQuJ1xuXHRcdFx0XG5cdFx0XHRmb3IgcHJvcCBpbiBwcm9wc1xuXHRcdFx0XHRzZXRQaW4gPVxuXHRcdFx0XHRcdHRhcmdldExheWVyOiB0YXJnZXRcblx0XHRcdFx0XHRkaXJlY3Rpb246IGRpcmVjdGlvblxuXHRcdFx0XHRcdGV2ZW50OiBcImNoYW5nZToje3Byb3B9XCJcblx0XHRcdFx0XHRmdW5jOiAtPiBsYXllcltsUHJvcF0gPSBnZXREaWZmZXJlbmNlKClcblx0XHRcdFxuXHRcdFx0XHRsYXllci5waW5zID89IFtdXG5cdFx0XHRcdGxheWVyLnBpbnMucHVzaChzZXRQaW4pXG5cdFx0XHRcdFxuXHRcdFx0XHR0YXJnZXQub24oc2V0UGluLmV2ZW50LCBzZXRQaW4uZnVuYylcblx0XG5cbiMjI1xuUmVtb3ZlIGFsbCBvZiBhIGxheWVyJ3MgcGlucywgb3IgcGlucyBmcm9tIGEgY2VydGFpbiB0YXJnZXQgbGF5ZXIgYW5kL29yIGRpcmVjdGlvbi5cblxuQHBhcmFtIHtMYXllcn0gbGF5ZXIgVGhlIGxheWVyIHRvIHVucGluLlxuQHBhcmFtIHtMYXllcn0gW3RhcmdldF0gVGhlIGxheWVyIHRvIHVucGluIGZyb20uIFxuQHBhcmFtIHsuLi5TdHJpbmd9IFtkaXJlY3Rpb25zXSBUaGUgZGlyZWN0aW9ucyB0byB1bnBpbi5cblxuXHRVdGlscy51bnBpbihsYXllckEpXG5cbiMjI1xuVXRpbHMudW5waW4gPSAobGF5ZXIsIHRhcmdldCwgZGlyZWN0aW9uKSAtPlxuXHRcblx0c2V0UGlucyA9IF8uZmlsdGVyIGxheWVyLnBpbnMsIChwKSAtPlxuXHRcdGlzTGF5ZXIgPSBpZiB0YXJnZXQ/IHRoZW4gcC50YXJnZXQgaXMgdGFyZ2V0IGVsc2UgdHJ1ZVxuXHRcdGlzRGlyZWN0aW9uID0gaWYgZGlyZWN0aW9uPyB0aGVuIHAuZGlyZWN0aW9uIGlzIGRpcmVjdGlvbiBlbHNlIHRydWVcblx0XHRcblx0XHRyZXR1cm4gaXNMYXllciBhbmQgaXNEaXJlY3Rpb25cblx0XG5cdGZvciBzZXRQaW4gaW4gc2V0UGluc1xuXHRcdHNldFBpbi50YXJnZXQub2ZmKHNldFBpbi5ldmVudCwgc2V0UGluLmZ1bmMpXG5cblxuIyMjXG5QaW4gbGF5ZXIgdG8gYW5vdGhlciBsYXllciwgYmFzZWQgb24gdGhlIGZpcnN0IGxheWVyJ3Mgb3JpZ2luLlxuXG5AcGFyYW0ge0xheWVyfSBsYXllciBUaGUgbGF5ZXIgdG8gcGluLlxuQHBhcmFtIHtMYXllcn0gW3RhcmdldF0gVGhlIGxheWVyIHRvIHBpbiB0by4gXG5AcGFyYW0ge0Jvb2xlYW59IFt1bmRvXSBSZW1vdmUsIHJhdGhlciB0aGFuIGNyZWF0ZSwgdGhpcyBwaW4uIFxuXG5cdFV0aWxzLnBpbk9yaWdpbihsYXllckEsIGxheWVyQilcblxuIyMjXG5VdGlscy5waW5PcmlnaW4gPSAobGF5ZXIsIHRhcmdldCwgdW5kbyA9IGZhbHNlKSAtPlxuXHRpZiB1bmRvXG5cdFx0dGFyZ2V0Lm9mZiBcImNoYW5nZTpzaXplXCIsIGxheWVyLnNldFBvc2l0aW9uIFxuXHRcdHJldHVyblxuXG5cdGxheWVyLnNldFBvc2l0aW9uID0gLT5cblx0XHRsYXllci54ID0gKHRhcmdldC53aWR0aCAtIGxheWVyLndpZHRoKSAqIGxheWVyLm9yaWdpblhcblx0XHRsYXllci55ID0gKHRhcmdldC5oZWlnaHQgLSBsYXllci5oZWlnaHQpICogbGF5ZXIub3JpZ2luWVxuXHRcblx0bGF5ZXIuc2V0UG9zaXRpb24oKVxuXHRcblx0dGFyZ2V0Lm9uIFwiY2hhbmdlOnNpemVcIiwgbGF5ZXIuc2V0UG9zaXRpb25cblxuXG4jIyNcblBpbiBsYXllciB0byBhbm90aGVyIGxheWVyLCBiYXNlZCBvbiB0aGUgZmlyc3QgbGF5ZXIncyBvcmlnaW5YLlxuXG5AcGFyYW0ge0xheWVyfSBsYXllciBUaGUgbGF5ZXIgdG8gcGluLlxuQHBhcmFtIHtMYXllcn0gW3RhcmdldF0gVGhlIGxheWVyIHRvIHBpbiB0by4gXG5AcGFyYW0ge0Jvb2xlYW59IFt1bmRvXSBSZW1vdmUsIHJhdGhlciB0aGFuIGNyZWF0ZSwgdGhpcyBwaW4uIFxuXG5cdFV0aWxzLnBpbk9yaWdpblgobGF5ZXJBLCBsYXllckIpXG5cbiMjI1xuVXRpbHMucGluT3JpZ2luWCA9IChsYXllciwgdGFyZ2V0LCB1bmRvID0gZmFsc2UpIC0+XG5cdGlmIHVuZG9cblx0XHR0YXJnZXQub2ZmIFwiY2hhbmdlOnNpemVcIiwgbGF5ZXIuc2V0UG9zaXRpb24gXG5cdFx0cmV0dXJuXG5cblx0bGF5ZXIuc2V0UG9zaXRpb24gPSAtPlxuXHRcdGxheWVyLnggPSAodGFyZ2V0LndpZHRoIC0gbGF5ZXIud2lkdGgpICogbGF5ZXIub3JpZ2luWFxuXHRcblx0bGF5ZXIuc2V0UG9zaXRpb24oKVxuXHRcblx0dGFyZ2V0Lm9uIFwiY2hhbmdlOnNpemVcIiwgbGF5ZXIuc2V0UG9zaXRpb25cblxuXG4jIyNcblBpbiBsYXllciB0byBhbm90aGVyIGxheWVyLCBiYXNlZCBvbiB0aGUgZmlyc3QgbGF5ZXIncyBvcmlnaW5ZLlxuXG5AcGFyYW0ge0xheWVyfSBsYXllciBUaGUgbGF5ZXIgdG8gcGluLlxuQHBhcmFtIHtMYXllcn0gW3RhcmdldF0gVGhlIGxheWVyIHRvIHBpbiB0by4gXG5AcGFyYW0ge0Jvb2xlYW59IFt1bmRvXSBSZW1vdmUsIHJhdGhlciB0aGFuIGNyZWF0ZSwgdGhpcyBwaW4uIFxuXG5cdFV0aWxzLnBpbk9yaWdpblkobGF5ZXJBLCBsYXllckIpXG5cbiMjI1xuVXRpbHMucGluT3JpZ2luWSA9IChsYXllciwgdGFyZ2V0LCB1bmRvID0gZmFsc2UpIC0+XG5cdGlmIHVuZG9cblx0XHR0YXJnZXQub2ZmIFwiY2hhbmdlOnNpemVcIiwgbGF5ZXIuc2V0UG9zaXRpb24gXG5cdFx0cmV0dXJuXG5cblx0bGF5ZXIuc2V0UG9zaXRpb24gPSAtPlxuXHRcdGxheWVyLnkgPSAodGFyZ2V0LmhlaWdodCAtIGxheWVyLmhlaWdodCkgKiBsYXllci5vcmlnaW5ZXG5cdFxuXHRsYXllci5zZXRQb3NpdGlvbigpXG5cdFxuXHR0YXJnZXQub24gXCJjaGFuZ2U6c2l6ZVwiLCBsYXllci5zZXRQb3NpdGlvblxuXG5cbiMjI1xuU2V0IGEgbGF5ZXIncyBjb250cmFpbnRzIHRvIGl0cyBwYXJlbnRcblxuQHBhcmFtIHtMYXllcn0gbGF5ZXIgVGhlIGxheWVyIHRvIGNvbnN0cmFpbi5cbkBwYXJhbSB7Li4uU3RyaW5nfSBvcHRpb25zIFRoZSBjb25zdHJhaW50IG9wdGlvbnMgdG8gdXNlLlxuXG5WYWxpZCBvcHRpb25zIGFyZTogJ2xlZnQnLCAndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdoZWlnaHQnLCAnd2lkdGgnLCBhbmQgJ2FzcGVjdFJhdGlvJy5cblxuXHRVdGlscy5jb25zdHJhaW4obGF5ZXIsICdsZWZ0JywgJ3RvcCcsICdhcGVjdFJhdGlvJylcblxuIyMjXG5VdGlscy5jb25zdHJhaW4gPSAobGF5ZXIsIG9wdGlvbnMuLi4pIC0+XG5cdGlmIG5vdCBsYXllci5wYXJlbnQ/IHRoZW4gdGhyb3cgJ1V0aWxzLmNvbnN0cmFpbiByZXF1aXJlcyBhIGxheWVyIHdpdGggYSBwYXJlbnQuJ1xuXHRcblx0b3B0cyA9XG5cdFx0bGVmdDogZmFsc2UsIFxuXHRcdHRvcDogZmFsc2UsIFxuXHRcdHJpZ2h0OiBmYWxzZSwgXG5cdFx0Ym90dG9tOiBmYWxzZSxcblx0XHRoZWlnaHQ6IGZhbHNlXG5cdFx0d2lkdGg6IGZhbHNlXG5cdFx0YXNwZWN0UmF0aW86IGZhbHNlXG5cblx0Zm9yIG9wdCBpbiBvcHRpb25zXG5cdFx0b3B0c1tvcHRdID0gdHJ1ZVxuXHRcblx0dmFsdWVzID0gXG5cdFx0bGVmdDogaWYgb3B0cy5sZWZ0IHRoZW4gbGF5ZXIueCBlbHNlIG51bGxcblx0XHRoZWlnaHQ6IGxheWVyLmhlaWdodFxuXHRcdGNlbnRlckFuY2hvclg6IGxheWVyLm1pZFggLyBsYXllci5wYXJlbnQ/LndpZHRoXG5cdFx0d2lkdGg6IGxheWVyLndpZHRoXG5cdFx0cmlnaHQ6IGlmIG9wdHMucmlnaHQgdGhlbiBsYXllci5wYXJlbnQ/LndpZHRoIC0gbGF5ZXIubWF4WCBlbHNlIG51bGxcblx0XHR0b3A6IGlmIG9wdHMudG9wIHRoZW4gbGF5ZXIueSBlbHNlIG51bGxcblx0XHRjZW50ZXJBbmNob3JZOiBsYXllci5taWRZIC8gbGF5ZXIucGFyZW50Py5oZWlnaHRcblx0XHRib3R0b206IGlmIG9wdHMuYm90dG9tIHRoZW4gbGF5ZXIucGFyZW50Py5oZWlnaHQgLSBsYXllci5tYXhZIGVsc2UgbnVsbFxuXHRcdHdpZHRoRmFjdG9yOiBudWxsXG5cdFx0aGVpZ2h0RmFjdG9yOiBudWxsXG5cdFx0YXNwZWN0UmF0aW9Mb2NrZWQ6IG9wdHMuYXNwZWN0UmF0aW9cblx0XG5cdHVubGVzcyBvcHRzLnRvcCBhbmQgb3B0cy5ib3R0b21cblx0XHRpZiBvcHRzLmhlaWdodFxuXHRcdFx0dmFsdWVzLmhlaWdodEZhY3RvciA9IGxheWVyLmhlaWdodCAvIGxheWVyLnBhcmVudD8uaGVpZ2h0XG5cdFx0XHRcblx0dW5sZXNzIG9wdHMubGVmdCBhbmQgb3B0cy5yaWdodCBcblx0XHRpZiBvcHRzLndpZHRoXG5cdFx0XHR2YWx1ZXMud2lkdGhGYWN0b3IgPSBsYXllci53aWR0aCAvIGxheWVyLnBhcmVudD8ud2lkdGhcblx0XG5cdGxheWVyLmNvbnN0cmFpbnRWYWx1ZXMgPSB2YWx1ZXNcblxuXG4jIyNcbkltbWVkaWF0ZWx5IGV4ZWN1dGUgYSBmdW5jdGlvbiB0aGF0IGlzIGJvdW5kIHRvIHRoZSB0YXJnZXQuXG5cbkBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBiaW5kIHRoZSBjYWxsYmFjayB0by5cbkBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byBydW4uXG5cblx0VXRpbHMuYmluZChteUxheWVyLCAtPiB0aGlzLm5hbWUgPSBcIk15IExheWVyXCIpXG5cbiMjI1xuVXRpbHMuYmluZCA9IChvYmplY3QsIGNhbGxiYWNrKSAtPlxuXHRkbyBfLmJpbmQoY2FsbGJhY2ssIG9iamVjdClcblxuXG4jIyNcbkFsaWFzIGZvciBVdGlscy5iaW5kLlxuIyMjXG5VdGlscy5idWlsZCA9IChvYmplY3QsIGNhbGxiYWNrKSAtPiBAYmluZChvYmplY3QsIGNhbGxiYWNrKVxuXG5cbiMjI1xuRGVmaW5lIGEgcHJvcGVydHkgb24gYSBMYXllciB0aGF0IHdpbGwgZW1pdCBhIGNoYW5nZSBldmVudCB3aGVuIHRoYXQgcHJvcGVydHkgY2hhbmdlcy4gQWxzbywgb3B0aW9uYWxseSBnaXZlIHRoZSBwcm9wZXJ0eSBhbiBpbml0aWFsIHZhbHVlIGFuZCBhIGNhbGxiYWNrIHRvIHJ1biB3aGVuIHRoZSBwcm9wZXJ0eSBjaGFuZ2VzLlxuXG5AcGFyYW0ge0xheWVyfSBsYXllciBUaGUgbGF5ZXIgb24gd2hpY2ggdG8gZGVmaW5lIHRoZSBwcm9wZXJ0eS5cbkBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkuXG5AcGFyYW0ge09iamVjdH0gW3ZhbHVlXSBUaGUgaW5pdGlhbCB2YWx1ZSBvZiB0aGUgcHJvcGVydHkuXG5AcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIFRoZSBjYWxsYmFjayB0byBydW4gd2hlbiB0aGlzIHByb3BlcnR5IGNoYW5nZXMuIEV4ZWN1dGVkIHdpdGggdHdvIGFyZ3VtZW50czogdGhlIHByb3BlcnR5J3MgbmV3IHZhbHVlIGFuZCB0aGUgTGF5ZXIgaXRzZWxmLlxuQHBhcmFtIHtGdW5jdGlvbn0gW3ZhbGlkYXRpb25dIEEgZnVuY3Rpb24gdG8gdmFsaWRhdGUgdGhlIHByb3BlcnR5J3MgbmV3IHZhbHVlLlxuQHBhcmFtIHtTdHJpbmd9IFtlcnJvcl0gQW4gZXJyb3IgdG8gdGhyb3cgaWYgdGhlIHZhbGlkYXRpb24gZnVuY3Rpb24gcmV0dXJuZWQgZmFsc2UuXG5cblx0VXRpbHMuZGVmaW5lKG15TGF5ZXIsIFwidG9nZ2xlZFwiKVxuXHRVdGlscy5kZWZpbmUobXlMYXllciwgXCJ0b2dnbGVkXCIsIGZhbHNlKVxuXHRVdGlscy5kZWZpbmUobXlMYXllciwgXCJ0b2dnbGVkXCIsIGZhbHNlLCBteUxheWVyLnNob3dUb2dnbGVkKVxuXHRVdGlscy5kZWZpbmUobXlMYXllciwgXCJ0b2dnbGVkXCIsIGZhbHNlLCBudWxsLCBfLmlzQm9vbGVhbiwgXCJMYXllci50b2dnbGVkIG11c3QgYmUgdHJ1ZSBvciBmYWxzZS5cIilcblxuIyMjXG5VdGlscy5kZWZpbmUgPSAobGF5ZXIsIHByb3BlcnR5LCB2YWx1ZSwgY2FsbGJhY2ssIHZhbGlkYXRpb24sIGVycm9yKSAtPlxuXHR2YWxpZGF0aW9uID89IC0+IHRydWVcblx0ZXJyb3IgPz0gXCJMYXllciAje2xheWVyLmlkfSdzIHByb3BlcnR5ICcje3Byb3BlcnR5fScgd2FzIGdpdmVuIHRoZSB3cm9uZyB2YWx1ZSB0eXBlLlwiXG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkgbGF5ZXIsXG5cdFx0cHJvcGVydHksXG5cdFx0Z2V0OiAtPiByZXR1cm4gbGF5ZXJbXCJfI3twcm9wZXJ0eX1cIl1cblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdGlmIHZhbHVlP1xuXHRcdFx0XHRpZiBub3QgdmFsaWRhdGlvbih2YWx1ZSkgdGhlbiB0aHJvdyBlcnJvclxuXHRcdFx0XHRyZXR1cm4gaWYgdmFsdWUgaXMgbGF5ZXJbXCJfI3twcm9wZXJ0eX1cIl1cblxuXHRcdFx0bGF5ZXJbXCJfI3twcm9wZXJ0eX1cIl0gPSB2YWx1ZVxuXHRcdFx0bGF5ZXIuZW1pdChcImNoYW5nZToje3Byb3BlcnR5fVwiLCB2YWx1ZSwgbGF5ZXIpXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlXG5cdFx0XHRcblx0aWYgY2FsbGJhY2s/IGFuZCB0eXBlb2YgY2FsbGJhY2sgaXMgJ2Z1bmN0aW9uJ1xuXHRcdGxheWVyLm9uKFwiY2hhbmdlOiN7cHJvcGVydHl9XCIsIGNhbGxiYWNrKVxuXHRcblx0bGF5ZXJbcHJvcGVydHldID0gdmFsdWVcblxuIyMjXG5TZXQgYWxsIGxheWVycyBpbiBhbiBhcnJheSB0byB0aGUgc2FtZSBwcm9wZXJ0eSBvciBwcm9wZXJ0aWVzLlxuXG5AcGFyYW0ge0FycmF5fSBsYXllcnMgVGhlIGFycmF5IG9mIGxheWVycyB0byBhbGlnbi5cbkBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBwcm9wZXJ0aWVzIHRvIHNldC5cbkBwYXJhbSB7Qm9vbGVhbn0gW21pbmltdW1dIFdoZXRoZXIgdG8gdXNlIGF2ZXJhZ2UgdmFsdWVzIG9yIG1pbmltdW0gdmFsdWVzIGZvciBtaWRkbGUgLyBjZW50ZXIuXG5AcGFyYW0ge0Jvb2xlYW59IFthbmltYXRlXSBXaGV0aGVyIHRvIGFuaW1hdGUgdG8gdGhlIG5ldyBwcm9wZXJ0eS5cbkBwYXJhbSB7T2JqZWN0fSBbYW5pbWF0aW9uT3B0aW9uc10gVGhlIGFuaW1hdGlvbiBvcHRpb25zIHRvIHVzZS5cblxuXHRVdGlscy5hbGlnbiBbbGF5ZXJBLCBsYXllckJdLFxuXHRcdHg6IDIwMFxuXG5cdFV0aWxzLmFsaWduIFtsYXllckEsIGxheWVyQl0sXG5cdFx0eDogMjAwXG5cdFx0dHJ1ZVxuXHRcdHRpbWU6IC41XG4jIyNcblV0aWxzLmFsaWduID0gKGxheWVycyA9IFtdLCBkaXJlY3Rpb24sIG1pbmltdW0gPSB0cnVlLCBhbmltYXRlLCBhbmltYXRpb25PcHRpb25zID0ge30pIC0+IFxuXHRtaW5YID0gXy5taW5CeShsYXllcnMsICd4JykueFxuXHRtYXhYID0gXy5tYXhCeShsYXllcnMsICdtYXhYJykubWF4WFxuXHRtaW5ZID0gXy5taW5CeShsYXllcnMsICd5JykueVxuXHRtYXhZID0gXy5tYXhCeShsYXllcnMsICdtYXhZJykubWF4WVxuXG5cblx0b3B0aW9ucyA9IHN3aXRjaCBkaXJlY3Rpb25cblx0XHR3aGVuIFwidG9wXCIgdGhlbiB7eTogbWluWX1cblx0XHR3aGVuIFwibWlkZGxlXCJcblx0XHRcdGlmIG1pbmltdW1cblx0XHRcdFx0e21pZFk6IF8ubWluQnkobGF5ZXJzLCAneScpLm1pZFl9XG5cdFx0XHRlbHNlIFxuXHRcdFx0XHR7bWlkWTogKG1heFkgLSBtaW5ZKS8yICsgbWluWX1cblx0XHR3aGVuIFwiYm90dG9tXCIgdGhlbiB7bWF4WTogbWF4WX1cblx0XHR3aGVuIFwibGVmdFwiIHRoZW4ge3g6IG1pbll9XG5cdFx0d2hlbiBcImNlbnRlclwiXG5cdFx0XHRpZiBtaW5pbXVtIFxuXHRcdFx0XHR7bWlkWDogXy5taW5CeShsYXllcnMsICd4JykubWlkWH1cblx0XHRcdGVsc2Vcblx0XHRcdFx0e21pZFg6IChtYXhYIC0gbWluWCkvMiArIG1pblh9XG5cdFx0d2hlbiBcInJpZ2h0XCIgdGhlbiB7bWF4WDogbWF4WH1cblx0XHRlbHNlIHt9XG5cblx0Zm9yIGxheWVyLCBpIGluIGxheWVyc1xuXHRcdGlmIGFuaW1hdGVcblx0XHRcdGxheWVyLmFuaW1hdGUgb3B0aW9ucywgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdGVsc2Vcblx0XHRcdF8uYXNzaWduIGxheWVyLCBvcHRpb25zXG5cbiMjI1xuRGlzdHJpYnV0ZSBhbiBhcnJheSBvZiBsYXllcnMgYmV0d2VlbiB0d28gdmFsdWVzLlxuXG5AcGFyYW0ge0FycmF5fSBsYXllcnMgVGhlIGFycmF5IG9mIGxheWVycyB0byBkaXN0cmlidXRlLlxuQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5IFRoZSBwcm9wZXJ0eSB0byBkaXN0cmlidXRlLlxuQHBhcmFtIHtPYmplY3R9IFtzdGFydF0gVGhlIHZhbHVlIHRvIHN0YXJ0IGZyb20uIEJ5IGRlZmF1bHQsIHRoZSBsb3dlc3QgdmFsdWUgb2YgdGhlIGdpdmVuIHByb3BlcnR5IGFtb25nIHRoZSBsYXllcnMgYXJyYXkuXG5AcGFyYW0ge09iamVjdH0gW2VuZF0gVGhlIHZhbHVlIHRvIGRpc3RyaWJ1dGUgdG8uIEJ5IGRlZmF1bHQsIHRoZSBoaWdoZXN0IHZhbHVlIG9mIHRoZSBnaXZlbiBwcm9wZXJ0eSBhbW9uZyB0aGUgbGF5ZXJzIGFycmF5LlxuQHBhcmFtIHtCb29sZWFufSBbYW5pbWF0ZV0gV2hldGhlciB0byBhbmltYXRlIHRvIHRoZSBuZXcgcHJvcGVydHkuXG5AcGFyYW0ge09iamVjdH0gW2FuaW1hdGlvbk9wdGlvbnNdIFRoZSBhbmltYXRpb24gb3B0aW9ucyB0byB1c2UuXG5cblx0VXRpbHMuYWxpZ24gW2xheWVyQSwgbGF5ZXJCXSwgJ3gnXG5cblx0VXRpbHMuYWxpZ24gW2xheWVyQSwgbGF5ZXJCXSwgJ3gnLCAzMiwgMjAwXG5cblx0VXRpbHMuYWxpZ24gW2xheWVyQSwgbGF5ZXJCXSwgJ3gnLCAzMiwgMjAwLCB0cnVlLCB7dGltZTogLjV9XG5cbkFsc28gd29ya3Mgd2l0aCAnaG9yaXpvbnRhbCcgYW5kICd2ZXJ0aWNhbCcsIChhbGlhcyB0byAnbWlkWCcgYW5kICdtaWRZJykuXG5cblx0VXRpbHMuYWxpZ24gW2xheWVyQSwgbGF5ZXJCXSwgJ2hvcml6b250YWwnXG5cbiMjI1xuVXRpbHMuZGlzdHJpYnV0ZSA9IChsYXllcnMgPSBbXSwgcHJvcGVydHksIHN0YXJ0LCBlbmQsIGFuaW1hdGUgPSBmYWxzZSwgYW5pbWF0aW9uT3B0aW9ucyA9IHt9KSAtPlxuXHRcblx0cHJvcGVydHkgPSAnbWlkWCcgaWYgcHJvcGVydHkgaXMgJ2hvcml6b250YWwnXG5cdHByb3BlcnR5ID0gJ21pZFknIGlmIHByb3BlcnR5IGlzICd2ZXJ0aWNhbCdcblxuXHRsYXllcnMgPSBfLnNvcnRCeShsYXllcnMsIFtwcm9wZXJ0eV0pXG5cblx0aWYgXy5pc1VuZGVmaW5lZChzdGFydCkgb3IgdHlwZW9mIHN0YXJ0IGlzICdib29sZWFuJ1xuXHRcdGFuaW1hdGUgPSBzdGFydCA/IGZhbHNlXG5cdFx0YW5pbWF0aW9uT3B0aW9ucyA9IGVuZCA/IHt9XG5cdFx0c3RhcnQgPSBsYXllcnNbMF1bcHJvcGVydHldXG5cdFx0ZW5kID0gXy5sYXN0KGxheWVycylbcHJvcGVydHldXG5cblx0ZGlzdGFuY2UgPSAoZW5kIC0gc3RhcnQpIC8gKGxheWVycy5sZW5ndGggLSAxKVxuXG5cdHZhbHVlcyA9IGxheWVycy5tYXAgKGxheWVyLCBpKSAtPlxuXHRcdHJldHVybiB7XCIje3Byb3BlcnR5fVwiOiBzdGFydCArIChkaXN0YW5jZSAqIGkpfVxuXHRcblx0Zm9yIGxheWVyLCBpIGluIGxheWVyc1xuXHRcdGlmIGFuaW1hdGVcblx0XHRcdGxheWVyLmFuaW1hdGUgdmFsdWVzW2ldLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRjb250aW51ZVxuXHRcdFxuXHRcdF8uYXNzaWduIGxheWVyLCB2YWx1ZXNbaV1cblxuIyMjXG5TdGFjayBsYXllcnMuXG5cbkBwYXJhbSB7QXJyYXl9IGxheWVycyBUaGUgYXJyYXkgb2YgbGF5ZXJzIHRvIG9mZnNldC5cbkBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSBUaGUgZGlzdGFuY2UgYmV0d2VlbiBlYWNoIGxheWVyLlxuQHBhcmFtIHtTdHJpbmd9IGF4aXMgV2hldGhlciB0byBzdGFjayBvbiB0aGUgeCBvciB5IGF4aXMuXG5AcGFyYW0ge0Jvb2xlYW59IFthbmltYXRlXSBXaGV0aGVyIHRvIGFuaW1hdGUgbGF5ZXJzIHRvIHRoZSBuZXcgcG9zaXRpb24uXG5AcGFyYW0ge09iamVjdH0gW2FuaW1hdGlvbk9wdGlvbnNdIFRoZSBhbmltYXRpb24gb3B0aW9ucyB0byB1c2UuXG5cbiMjI1xuVXRpbHMuc3RhY2sgPSAobGF5ZXJzID0gW10sIGRpc3RhbmNlID0gMCwgYXhpcyA9IFwidmVydGljYWxcIiwgYW5pbWF0ZSA9IGZhbHNlLCBhbmltYXRpb25PcHRpb25zID0ge30pIC0+XG5cdHJldHVybiBpZiBsYXllcnMubGVuZ3RoIDw9IDFcblxuXHRpZiBheGlzIGlzIFwidmVydGljYWxcIiBvciBheGlzIGlzIFwieVwiXG5cdFx0VXRpbHMub2Zmc2V0WShsYXllcnMsIGRpc3RhbmNlLCBhbmltYXRlLCBhbmltYXRpb25PcHRpb25zKVxuXHRlbHNlIGlmIGF4aXMgaXMgXCJob3Jpem9udGFsXCIgb3IgYXhpcyBpcyBcInhcIlxuXHRcdFV0aWxzLm9mZnNldFgobGF5ZXJzLCBkaXN0YW5jZSwgYW5pbWF0ZSwgYW5pbWF0aW9uT3B0aW9ucylcblxuXHRyZXR1cm4gbGF5ZXJzXG5cblxuIyMjXG5PZmZzZXQgYW4gYXJyYXkgb2YgbGF5ZXJzIHZlcnRpY2FsbHkuXG5cbkBwYXJhbSB7QXJyYXl9IGxheWVycyBUaGUgYXJyYXkgb2YgbGF5ZXJzIHRvIG9mZnNldC5cbkBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSBUaGUgZGlzdGFuY2UgYmV0d2VlbiBlYWNoIGxheWVyLlxuQHBhcmFtIHtCb29sZWFufSBbYW5pbWF0ZV0gV2hldGhlciB0byBhbmltYXRlIGxheWVycyB0byB0aGUgbmV3IHBvc2l0aW9uLlxuQHBhcmFtIHtPYmplY3R9IFthbmltYXRpb25PcHRpb25zXSBUaGUgYW5pbWF0aW9uIG9wdGlvbnMgdG8gdXNlLlxuXG5cdFV0aWxzLmFsaWduIFtsYXllckEsIGxheWVyQl0sXG5cdFx0eDogMjAwXG5cblx0VXRpbHMuYWxpZ24gW2xheWVyQSwgbGF5ZXJCXSxcblx0XHR4OiAyMDBcblx0XHR0cnVlXG5cdFx0dGltZTogLjVcbiMjI1xuVXRpbHMub2Zmc2V0WSA9IChsYXllcnMgPSBbXSwgZGlzdGFuY2UgPSAwLCBhbmltYXRlID0gZmFsc2UsIGFuaW1hdGlvbk9wdGlvbnMgPSB7fSkgLT4gXG5cdHJldHVybiBpZiBsYXllcnMubGVuZ3RoIDw9IDFcblxuXHRzdGFydFkgPSBsYXllcnNbMF0ueVxuXHR2YWx1ZXMgPSBbXVxuXHR2YWx1ZXMgPSBsYXllcnMubWFwIChsYXllciwgaSkgLT5cblx0XHR2ID0ge3k6IHN0YXJ0WX1cblx0XHRzdGFydFkgKz0gbGF5ZXIuaGVpZ2h0ICsgZGlzdGFuY2Vcblx0XHRyZXR1cm4gdlxuXHRcdFxuXHRmb3IgbGF5ZXIsIGkgaW4gbGF5ZXJzXG5cdFx0aWYgYW5pbWF0ZVxuXHRcdFx0bGF5ZXIuYW5pbWF0ZSB2YWx1ZXNbaV0sIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRlbHNlXG5cdFx0XHRfLmFzc2lnbiBsYXllciwgdmFsdWVzW2ldXG5cblx0cmV0dXJuIGxheWVyc1xuXG4jIyNcbk9mZnNldCBhbiBhcnJheSBvZiBsYXllcnMgaG9yaXpvbnRhbGx5LlxuXG5AcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgb2YgbGF5ZXJzIHRvIG9mZnNldC5cbkBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSBUaGUgZGlzdGFuY2UgYmV0d2VlbiBlYWNoIGxheWVyLlxuQHBhcmFtIHtCb29sZWFufSBbYW5pbWF0ZV0gV2hldGhlciB0byBhbmltYXRlIGxheWVycyB0byB0aGUgbmV3IHBvc2l0aW9uLlxuQHBhcmFtIHtPYmplY3R9IFthbmltYXRpb25PcHRpb25zXSBUaGUgYW5pbWF0aW9uIG9wdGlvbnMgdG8gdXNlLlxuXG5cdFV0aWxzLmFsaWduIFtsYXllckEsIGxheWVyQl0sXG5cdFx0eDogMjAwXG5cblx0VXRpbHMuYWxpZ24gW2xheWVyQSwgbGF5ZXJCXSxcblx0XHR4OiAyMDBcblx0XHR0cnVlXG5cdFx0dGltZTogLjVcbiMjI1xuVXRpbHMub2Zmc2V0WCA9IChsYXllcnMgPSBbXSwgZGlzdGFuY2UgPSAwLCBhbmltYXRlID0gZmFsc2UsIGFuaW1hdGlvbk9wdGlvbnMgPSB7fSkgLT4gXG5cdHJldHVybiBpZiBsYXllcnMubGVuZ3RoIDw9IDFcblxuXHRzdGFydFggPSBsYXllcnNbMF0ueFxuXHR2YWx1ZXMgPSBbXVxuXHR2YWx1ZXMgPSBsYXllcnMubWFwIChsYXllciwgaSkgLT5cblx0XHR2ID0ge3g6IHN0YXJ0WH1cblx0XHRzdGFydFggKz0gbGF5ZXIud2lkdGggKyBkaXN0YW5jZVxuXHRcdHJldHVybiB2XG5cdFx0XG5cdGZvciBsYXllciwgaSBpbiBsYXllcnNcblx0XHRpZiBhbmltYXRlXG5cdFx0XHRsYXllci5hbmltYXRlIHZhbHVlc1tpXSwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdGVsc2Vcblx0XHRcdF8uYXNzaWduIGxheWVyLCB2YWx1ZXNbaV1cblxuXHRyZXR1cm4gbGF5ZXJzXG5cbiMgQ3JlYXRlIGEgdGltZXIgaW5zdGFuY2UgdG8gc2ltcGxpZnkgaW50ZXJ2YWxzLlxuIyBUaGFua3MgdG8gaHR0cHM6Ly9naXRodWIuY29tL21hcmNrcmVubi5cbiNcbiMgQGV4YW1wbGVcbiNcbiMgdGltZXIgPSBuZXcgVXRpbHMudGltZXIoMSwgLT4gcHJpbnQgJ2hlbGxvIHdvcmxkIScpXG4jIFV0aWxzLmRlbGF5IDUsIC0+IHRpbWVyLnBhdXNlKClcbiMgVXRpbHMuZGVsYXkgOCwgLT4gdGltZXIucmVzdW1lKClcbiMgVXRpbHMuZGVsYXkgMTAsIC0+IHRpbWVyLnJlc3RhcnQoKVxuI1xuVXRpbHMuVGltZXIgPSBjbGFzcyBUaW1lclxuXHRjb25zdHJ1Y3RvcjogKHRpbWUsIGYpIC0+XG5cdFx0QHBhdXNlZCA9IGZhbHNlXG5cdFx0QHNhdmVUaW1lID0gbnVsbFxuXHRcdEBzYXZlRnVuY3Rpb24gPSBudWxsXG5cblx0XHRpZiB0aW1lPyBhbmQgZj9cblx0XHRcdEBzdGFydCh0aW1lLCBmKVxuXHRcblx0c3RhcnQ6ICh0aW1lLCBmKSA9PlxuXHRcdEBzYXZlVGltZSA9IHRpbWVcblx0XHRAc2F2ZUZ1bmN0aW9uID0gZlxuXG5cdFx0ZigpXG5cdFx0cHJveHkgPSA9PiBmKCkgdW5sZXNzIEBwYXVzZWRcblx0XHR1bmxlc3MgQHBhdXNlZFxuXHRcdFx0QF9pZCA9IHRpbWVyID0gVXRpbHMuaW50ZXJ2YWwodGltZSwgcHJveHkpXG5cdFx0ZWxzZSByZXR1cm5cblx0XG5cdHBhdXNlOiAgID0+IEBwYXVzZWQgPSB0cnVlXG5cdHJlc3VtZTogID0+IEBwYXVzZWQgPSBmYWxzZVxuXHRyZXNldDogICA9PiBjbGVhckludGVydmFsKEBfaWQpXG5cdHJlc3RhcnQ6ID0+IFxuXHRcdGNsZWFySW50ZXJ2YWwoQF9pZClcblx0XHRVdGlscy5kZWxheSAwLCA9PiBAc3RhcnQoQHNhdmVUaW1lLCBAc2F2ZUZ1bmN0aW9uKVxuXG5cbiMjI1xuQSBjbGFzcyB0byBtYW5hZ2Ugc3RhdGVzIG9mIG11bHRpcGxlIFRleHRMYXllcnMsIHdoaWNoIFwib2JzZXJ2ZVwiIHRoZSBzdGF0ZS4gXG5XaGVuIHRoZSBzdGF0ZSBjaGFuZ2VzLCB0aGUgU3RhdGVNYW5hZ2VyIHdpbGwgdXBkYXRlIGFsbCBcIm9ic2VydmVyXCIgVGV4dExheWVycyxcbmFwcGx5aW5nIHRoZSBuZXcgc3RhdGUgdG8gZWFjaCBUZXh0TGF5ZXIncyB0ZW1wbGF0ZSBwcm9wZXJ0eS5cblxuQHBhcmFtIHtBcnJheX0gW2xheWVyc10gVGhlIGxheWVycyB0byBvYnNlcnZlIHRoZSBzdGF0ZS5cbkBwYXJhbSB7T2JqZWN0fSBbc3RhdGVdIFRoZSBpbml0aWFsIHN0YXRlLlxuXG5cdHN0YXRlTWdyID0gbmV3IFV0aWxzLlN0YXRlTWFuYWdlciwgbXlMYXllcnNcblx0XHRmaXJzdE5hbWU6IFwiRGF2aWRcIlxuXHRcdGxhc3ROYW1lOiBcIkF0dGVuYm9yb3VnaFwiXG5cblx0c3RhdGVNZ3Iuc2V0U3RhdGVcblx0XHRmaXJzdE5hbWU6IFwiU2lyIERhdmlkXCJcblxuIyMjXG5VdGlscy5TdGF0ZU1hbmFnZXIgPSBjbGFzcyBTdGF0ZU1hbmFnZXJcblx0Y29uc3RydWN0b3I6IChsYXllcnMgPSBbXSwgc3RhdGUgPSB7fSkgLT5cblx0XHRcblx0XHRAX3N0YXRlID0gc3RhdGVcblx0XHRAX29ic2VydmVycyA9IGxheWVyc1xuXHRcdFxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBALFxuXHRcdFx0XCJvYnNlcnZlcnNcIixcblx0XHRcdGdldDogLT4gcmV0dXJuIEBfb2JzZXJ2ZXJzXG5cdFx0XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5IEAsXG5cdFx0XHRcInN0YXRlXCIsXG5cdFx0XHRnZXQ6IC0+IHJldHVybiBAX3N0YXRlXG5cdFx0XHRzZXQ6IChvYmopIC0+XG5cdFx0XHRcdGlmIHR5cGVvZiBvYmogaXNudCBcIm9iamVjdFwiXG5cdFx0XHRcdFx0dGhyb3cgXCJTdGF0ZSBtdXN0IGJlIGFuIG9iamVjdC5cIlxuXHRcdFx0XHRcblx0XHRcdFx0QHNldFN0YXRlKG9iailcblxuXHRcdEBfdXBkYXRlU3RhdGUoKVxuXG5cdF91cGRhdGVTdGF0ZTogPT5cblx0XHRAb2JzZXJ2ZXJzLmZvckVhY2ggKGxheWVyKSA9PlxuXHRcdFx0bGF5ZXIudGVtcGxhdGUgPSBAc3RhdGVcblx0XG5cdGFkZE9ic2VydmVyOiAobGF5ZXIpIC0+XG5cdFx0QF9vYnNlcnZlcnMucHVzaChsYXllcilcblx0XHRsYXllci50ZW1wbGF0ZSA9IEBzdGF0ZVxuXHRcdFxuXHRyZW1vdmVPYnNlcnZlcjogKGxheWVyKSAtPlxuXHRcdF8ucHVsbChAX29ic2VydmVycywgbGF5ZXIpXG5cdFxuXHRzZXRTdGF0ZTogKG9wdGlvbnMgPSB7fSkgLT4gXG5cdFx0Xy5tZXJnZShAX3N0YXRlLCBvcHRpb25zKVxuXHRcdEBfdXBkYXRlU3RhdGUoKVxuXHRcdFxuXHRcdHJldHVybiBAX3N0YXRlXG5cbiMgYXJyYW5nZSBsYXllcnMgaW4gYW4gYXJyYXkgaW50byBhIGdyaWQsIHVzaW5nIGEgc2V0IG51bWJlciBvZiBjb2x1bW5zIGFuZCByb3cvY29sdW1uIG1hcmdpbnNcbiMgQGV4YW1wbGUgICAgVXRpbHMuZ3JpZChsYXllcnMsIDQpXG5VdGlscy5ncmlkID0gKGFycmF5ID0gW10sIGNvbHMgPSA0LCByb3dNYXJnaW4gPSAxNiwgY29sTWFyZ2luKSAtPlxuXHRcblx0ZyA9XG5cdFx0eDogYXJyYXlbMF0ueFxuXHRcdHk6IGFycmF5WzBdLnlcblx0XHRjb2xzOiBjb2xzXG5cdFx0aGVpZ2h0OiBfLm1heEJ5KGFycmF5LCAnaGVpZ2h0Jyk/LmhlaWdodFxuXHRcdHdpZHRoOiBfLm1heEJ5KGFycmF5LCAnd2lkdGgnKT8ud2lkdGhcblx0XHRyb3dNYXJnaW46IHJvd01hcmdpbiA/IDBcblx0XHRjb2x1bW5NYXJnaW46IGNvbE1hcmdpbiA/IHJvd01hcmdpbiA/IDBcblx0XHRyb3dzOiBbXVxuXHRcdGNvbHVtbnM6IFtdXG5cdFx0bGF5ZXJzOiBbXVxuXG5cdFx0YXBwbHk6IChmdW5jKSAtPlxuXHRcdFx0Zm9yIGxheWVyIGluIEBsYXllcnNcblx0XHRcdFx0VXRpbHMuYnVpbGQobGF5ZXIsIGZ1bmMpXG5cblx0XHQjIGdldCBhIHNwZWNpZmllZCBjb2x1bW5cblx0XHRnZXRDb2x1bW46IChsYXllcikgLT4gXG5cdFx0XHRyZXR1cm4gQGNvbHVtbnMuaW5kZXhPZihfLmZpbmQoQGNvbHVtbnMsIChjKSAtPiBfLmluY2x1ZGVzKGMsIGxheWVyKSkpXG5cblx0XHQjIGdldCBhIHNwZWNpZmllZCByb3dcblx0XHRnZXRSb3c6IChsYXllcikgLT4gXG5cdFx0XHRyZXR1cm4gQHJvd3MuaW5kZXhPZihfLmZpbmQoQHJvd3MsIChyKSAtPiBfLmluY2x1ZGVzKHIsIGxheWVyKSkpXG5cblx0XHQjIGdldCBhIGxheWVyIGF0IGEgc3BlY2lmaWVkIGdyaWQgcG9zaXRpb25zXG5cdFx0Z2V0TGF5ZXI6IChyb3csIGNvbCkgLT4gXG5cdFx0XHRyZXR1cm4gQHJvd3Nbcm93XVtjb2xdXG5cblx0XHQjIHJldHVybiBhIHJhbmRvbSBsYXllciBmcm9tIHRoZSBncmlkXG5cdFx0Z2V0UmFuZG9tOiAtPiBcblx0XHRcdHJldHVybiBfLnNhbXBsZShfLnNhbXBsZShAcm93cykpXG5cblx0XHQjIGFkZCBhIG5ldyBsYXllciB0byB0aGUgZ3JpZCwgb3B0aW9uYWxseSBhdCBhIHNwZWNpZmllZCBwb3NpdGlvblxuXHRcdGFkZDogKGxheWVyLCBpID0gQGxheWVycy5sZW5ndGgsIGFuaW1hdGUgPSBmYWxzZSkgLT5cblxuXHRcdFx0aWYgbm90IGxheWVyP1xuXHRcdFx0XHRsYXllciA9IEBsYXllcnNbMF0uY29weVNpbmdsZSgpXG5cdFx0XHRcblx0XHRcdGxheWVyLnBhcmVudCA9IEBsYXllcnNbMF0ucGFyZW50XG5cblx0XHRcdEBsYXllcnMuc3BsaWNlKGksIDAsIGxheWVyKVxuXHRcdFx0XG5cdFx0XHRAX3JlZnJlc2goQGxheWVycywgYW5pbWF0ZSlcblxuXHRcdFx0cmV0dXJuIGxheWVyXG5cdFx0XG5cdFx0IyByZW1vdmUgYSBsYXllciBmcm9tIHRoZSBncmlkXG5cdFx0cmVtb3ZlOiAobGF5ZXIsIGFuaW1hdGUpIC0+XG5cdFx0XHRAX3JlZnJlc2goXy53aXRob3V0KEBsYXllcnMsIGxheWVyKSwgYW5pbWF0ZSlcblx0XHRcdGxheWVyLmRlc3Ryb3koKVxuXG5cdFx0XHRyZXR1cm4gQFxuXG5cdFx0IyBjbGVhciBhbmQgcmUtZmlsbCBhcnJheXMsIHRoZW4gYnVpbGRcblx0XHRfcmVmcmVzaDogKGxheWVycywgYW5pbWF0ZSkgLT5cblx0XHRcdEByb3dzID0gW11cblx0XHRcdEBjb2x1bW5zID0gW11cblx0XHRcdEBsYXllcnMgPSBsYXllcnNcblxuXHRcdFx0QF9idWlsZChhbmltYXRlKVxuXG5cdFx0IyBwdXQgdG9nZXRoZXIgdGhlIGdyaWRcblx0XHRfYnVpbGQ6IChhbmltYXRlID0gZmFsc2UpIC0+XG5cdFx0XHRmb3IgbGF5ZXIsIGkgaW4gQGxheWVyc1xuXHRcdFx0XHRjb2wgPSBpICUgY29sc1xuXHRcdFx0XHRyb3cgPSBNYXRoLmZsb29yKGkgLyBjb2xzKVxuXHRcdFx0XHRcblx0XHRcdFx0QHJvd3Nbcm93XSA/PSBbXSBcblx0XHRcdFx0QHJvd3Nbcm93XS5wdXNoKGxheWVyKVxuXHRcdFx0XHRcblx0XHRcdFx0QGNvbHVtbnNbY29sXSA/PSBbXVxuXHRcdFx0XHRAY29sdW1uc1tjb2xdLnB1c2gobGF5ZXIpXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiBhbmltYXRlXG5cdFx0XHRcdFx0bGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRcdFx0eDogQHggKyAoY29sICogKEB3aWR0aCArIEBjb2x1bW5NYXJnaW4pKVxuXHRcdFx0XHRcdFx0eTogQHkgKyAocm93ICogKEBoZWlnaHQgKyBAcm93TWFyZ2luKSlcblx0XHRcdFx0XHRjb250aW51ZVxuXG5cdFx0XHRcdF8uYXNzaWduIGxheWVyLFxuXHRcdFx0XHRcdHg6IEB4ICsgKGNvbCAqIChAd2lkdGggKyBAY29sdW1uTWFyZ2luKSlcblx0XHRcdFx0XHR5OiBAeSArIChyb3cgKiAoQGhlaWdodCArIEByb3dNYXJnaW4pKVxuXHRcblx0Zy5fcmVmcmVzaChhcnJheSlcblxuXHRyZXR1cm4gZ1xuXG5cbiMgbWFrZSBhIGdyaWQgb3V0IG9mIGEgbGF5ZXIsIGNvcHlpbmcgdGhlIGxheWVyIHRvIGZpbGwgcm93c1xuIyBAZXhhbXBsZSAgICBVdGlscy5tYWtlR3JpZChsYXllciwgMiwgNCwgOCwgOClcblV0aWxzLm1ha2VHcmlkID0gKGxheWVyLCBjb2xzID0gNCwgcm93cyA9IDEsIHJvd01hcmdpbiwgY29sTWFyZ2luKSAtPlxuXHRsYXllcnMgPSBbbGF5ZXJdXG5cdFxuXHRmb3IgaSBpbiBfLnJhbmdlKChjb2xzICogcm93cykgLSAxKVxuXHRcdGxheWVyc1tpICsgMV0gPSBsYXllci5jb3B5KClcblx0XHRsYXllcnNbaSArIDFdLnBhcmVudCA9IGxheWVyLnBhcmVudFxuXHRcdFxuXHRnID0gVXRpbHMuZ3JpZChsYXllcnMsIGNvbHMsIHJvd01hcmdpbiwgY29sTWFyZ2luKVxuXHRcblx0cmV0dXJuIGdcblxuXG5cbiMjI1xuQ2hhbmdlIGEgbGF5ZXIncyBzaXplIHRvIGZpdCBhcm91bmQgdGhlIGxheWVyJ3MgY2hpbGRyZW4uXG5cbkBwYXJhbSB7TGF5ZXJ9IGxheWVyIFRoZSBwYXJlbnQgbGF5ZXIgdG8gY2hhbmdlLm9zaXRpb24uXG5AcGFyYW0ge09iamVjdH0gW3BhZGRpbmddIFRoZSBwYWRkaW5nIHRvIHVzZSBmb3IgdGhlIGh1Zy5cblxuXHRVdGlscy5odWcobGF5ZXJBKVxuXG5cdFV0aWxzLmh1ZyhsYXllckEsIDMyKVxuXG5cdFV0aWxzLmh1ZyhsYXllckEsIHt0b3A6IDE2LCBib3R0b206IDI0fSlcbiMjI1xuVXRpbHMuaHVnID0gKGxheWVyLCBwYWRkaW5nKSAtPlxuXG5cdGRlZiA9IDBcblx0ZGVmU3RhY2sgPSB1bmRlZmluZWRcblxuXHRpZiB0eXBlb2YgcGFkZGluZyBpcyBcIm51bWJlclwiIFxuXHRcdGRlZiA9IHBhZGRpbmdcblx0XHRkZWZTdGFjayA9IHBhZGRpbmdcblx0XHRwYWRkaW5nID0ge31cblxuXHRfLmRlZmF1bHRzIHBhZGRpbmcsXG5cdFx0dG9wOiBkZWZcblx0XHRib3R0b206IGRlZlxuXHRcdGxlZnQ6IGRlZlxuXHRcdHJpZ2h0OiBkZWZcblx0XHRzdGFjazogZGVmU3RhY2tcblxuXHRVdGlscy5iaW5kIGxheWVyLCAtPlxuXHRcdGZvciBjaGlsZCwgaSBpbiBAY2hpbGRyZW5cblxuXHRcdFx0Y2hpbGQueSArPSBAcGFkZGluZy50b3BcblxuXHRcdFx0Y2hpbGQueCArPSBAcGFkZGluZy5sZWZ0XG5cblx0XHRcdGlmIEBwYWRkaW5nLnJpZ2h0PyA+IDBcblx0XHRcdFx0QHdpZHRoID0gXy5tYXhCeShAY2hpbGRyZW4sICdtYXhZJyk/Lm1heFkgKyBAcGFkZGluZy5yaWdodFxuXG5cdFx0aWYgQHBhZGRpbmcuc3RhY2s/ID49IDBcblx0XHRcdFV0aWxzLm9mZnNldFkoQGNoaWxkcmVuLCBAcGFkZGluZy5zdGFjaylcblx0XHRcdFV0aWxzLmRlbGF5IDAsID0+XG5cdFx0XHRcdFV0aWxzLmNvbnRhaW4oQCwgZmFsc2UsIEBwYWRkaW5nLnJpZ2h0LCBAcGFkZGluZy5ib3R0b20pXG5cdFx0XHRyZXR1cm5cblxuXHRcdFV0aWxzLmNvbnRhaW4oQCwgZmFsc2UsIEBwYWRkaW5nLnJpZ2h0LCBAcGFkZGluZy5ib3R0b20pXG5cblxuIyMjXG5JbmNyZWFzZSBvciBkZWNyZWFzZSBhIGxheWVyJ3Mgc2l6ZSB0byBjb250YWluIGl0cyBsYXllcidzIGNoaWxkcmVuLlxuXG5AcGFyYW0ge0xheWVyfSBsYXllciBUaGUgcGFyZW50IGxheWVyIHRvIGNoYW5nZSBzaXplLlxuQHBhcmFtIHtCb29sZWFufSBmaXQgV2hldGhlciB0byBsaW1pdCBzaXplIGNoYW5nZSB0byBpbmNyZWFzZSBvbmx5LlxuQHBhcmFtIHtOdW1iZXJ9IHBhZGRpbmdYIEV4dHJhIHNwYWNlIHRvIGFkZCB0byB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgbmV3IHNpemUuXG5AcGFyYW0ge051bWJlcn0gcGFkZGluZ1kgRXh0cmEgc3BhY2UgdG8gYWRkIHRvIHRoZSBib3R0b20gb2YgdGhlIG5ldyBzaXplLlxuXG5cdFV0aWxzLmNvbnRhaW4obGF5ZXJBKVxuIyMjXG5VdGlscy5jb250YWluID0gKGxheWVyLCBmaXQgPSBmYWxzZSwgcGFkZGluZ1ggPSAwLCBwYWRkaW5nWSA9IDApIC0+XG5cdHJldHVybiBpZiBsYXllci5jaGlsZHJlbi5sZW5ndGggaXMgMFxuXG5cdG1heENoaWxkWCA9IF8ubWF4QnkobGF5ZXIuY2hpbGRyZW4sICdtYXhYJyk/Lm1heFggKyBwYWRkaW5nWFxuXHRtYXhDaGlsZFkgPSBfLm1heEJ5KGxheWVyLmNoaWxkcmVuLCAnbWF4WScpPy5tYXhZICsgcGFkZGluZ1lcblxuXHRpZiBmaXRcblx0XHRsYXllci5wcm9wcyA9IFxuXHRcdFx0d2lkdGg6IE1hdGgubWF4KGxheWVyLndpZHRoLCBtYXhDaGlsZFgpXG5cdFx0XHRoZWlnaHQ6IE1hdGgubWF4KGxheWVyLmhlaWdodCwgbWF4Q2hpbGRZKVxuXHRcdHJldHVybiBcblxuXHRsYXllci5wcm9wcyA9IFxuXHRcdHdpZHRoOiBtYXhDaGlsZFhcblx0XHRoZWlnaHQ6IG1heENoaWxkWVxuXG5cdHJldHVybiBsYXllclxuXG4jIGdldCBhIHN0YXR1cyBjb2xvciBiYXNlZCBvbiBhIHN0YW5kYXJkIGRldmlhdGlvblxuIyBAZXhhbXBsZSAgICBVdGlscy5nZXRTdGF0dXNDb2xvciguMDQsIGZhbHNlKVxuVXRpbHMuZ2V0U3RhdHVzQ29sb3IgPSAoZGV2LCBsb3dlckJldHRlciA9IGZhbHNlKSAtPlxuXHRcblx0Y29sb3JzID0gWycjZWM0NzQxJywgJyNmNDg4NDcnLCAnI2ZmYzg0YScsICcjYTdjNTRiJywgJyM0ZmJmNGYnXVxuXHRcblx0aWYgbG93ZXJCZXR0ZXIgdGhlbiBkZXYgPSAtZGV2XG5cdFxuXHRjb2xvciA9IFV0aWxzLm1vZHVsYXRlKGRldiwgWy0uMSwgMC4xXSwgWzAsIGNvbG9ycy5sZW5ndGggLSAxXSwgZmFsc2UpXG5cdFxuXHRyZXR1cm4gY29sb3JzW2NvbG9yLnRvRml4ZWQoKV1cblxuXG4jIENoYWluIGFuIGFycmF5IG9mIGFuaW1hdGlvbnMsIG9wdGlvbmFsbHkgbG9vcGluZyB0aGVtXG4jIEBleGFtcGxlICAgIFV0aWxzLmNoYWluQW5pbWF0aW9ucyhbYXJyYXlPZkFuaW1hdGlvbnNdLCBmYWxzZSlcblV0aWxzLmNoYWluQW5pbWF0aW9ucyA9IChhbmltYXRpb25zLi4uKSAtPlxuXHRsb29waW5nID0gdHJ1ZVxuXHRcblx0aWYgdHlwZW9mIF8ubGFzdChhbmltYXRpb25zKSBpcyBcImJvb2xlYW5cIlxuXHRcdGxvb3BpbmcgPSBhbmltYXRpb25zLnBvcCgpXG5cdFxuXHRqID0gYW5pbWF0aW9ucy5sZW5ndGggLSAxXG5cdGZvciBhbmltLCBpIGluIGFuaW1hdGlvbnNcblx0XHRkbyAoaSwgYW5pbWF0aW9ucykgLT5cblx0XHRcdGlmIGFuaW0gaXMgYW5pbWF0aW9uc1tqXSBhbmQgbG9vcGluZ1xuXHRcdFx0XHRhbmltLm9uQW5pbWF0aW9uRW5kIC0+XG5cdFx0XHRcdFx0YW5pbWF0aW9uc1swXT8ucmVzZXQoKVxuXHRcdFx0XHRcdFV0aWxzLmRlbGF5IDAsIC0+IGFuaW1hdGlvbnNbMF0/LnN0YXJ0KClcblx0XHRcdFxuXHRcdFx0YW5pbS5vbkFuaW1hdGlvbkVuZCAtPlxuXHRcdFx0XHRhbmltYXRpb25zW2kgKyAxXT8ucmVzdGFydCgpXG5cdFx0XG5cdFV0aWxzLmRlbGF5IDAsIC0+IGFuaW1hdGlvbnNbMF0ucmVzdGFydCgpXG5cblxuIyBDaGVjayB3aGV0aGVyIGEgcG9pbnQgZXhpc3RzIHdpdGhpbiBhIHBvbHlnb24sIGRlZmluZWQgYnkgYW4gYXJyYXkgb2YgcG9pbnRzXG4jIE5vdGU6IHRoaXMgcmVwbGFjZXMgRnJhbWVyJ3MgZXhpc3RpbmcgKGJ1dCBicm9rZW4pIFV0aWxzLnBvaW50SW5Qb2x5Z29uIG1ldGhvZC5cbiMgQGV4YW1wbGVcdFV0aWxzLnBvaW50SW5Qb2xneWdvbih7eDogMiwgeTogMTJ9LCBbXSlcblV0aWxzLnBvaW50SW5Qb2x5Z29uID0gKHBvaW50LCB2cyA9IFtdKSAtPlxuXG5cdGlmIHZzWzBdLng/IHRoZW4gdnMgPSBfLm1hcCB2cywgKHApIC0+IFtwLngsIHAueV1cblxuXHQjIGRldGVybWluZSB3aGV0aGVyIHRvIGFuYWx5emUgcG9pbnRzIGluIGNvdW50ZXJjbG9ja3dpc2Ugb3JkZXJcblx0Y2N3ID0gKEEsQixDKSAtPiByZXR1cm4gKENbMV0tQVsxXSkqKEJbMF0tQVswXSkgPiAoQlsxXS1BWzFdKSooQ1swXS1BWzBdKVxuXG5cdCMgZGV0ZXJtaW5lIHdoZXRoZXIgdHdvIGxpbmVzIGludGVyc2VjdFxuXHRpbnRlcnNlY3QgPSAoQSxCLEMsRCkgLT4gcmV0dXJuIChjY3coQSxDLEQpIGlzbnQgY2N3KEIsQyxEKSkgYW5kIChjY3coQSxCLEMpIGlzbnQgY2N3KEEsQixEKSlcblx0XG5cdGluc2lkZSA9IGZhbHNlXG5cdGkgPSAwXG5cdGogPSB2cy5sZW5ndGggLSAxXG5cdFxuXHR3aGlsZSBpIDwgdnMubGVuZ3RoXG5cdFxuXHRcdGlmIGludGVyc2VjdChbLTk5OTk5OSwgcG9pbnQueV0sIFtwb2ludC54LCBwb2ludC55XSwgdnNbaV0sIHZzW2pdKVxuXHRcdFx0aW5zaWRlID0gIWluc2lkZVxuXHRcdGogPSBpKytcblx0XG5cdHJldHVybiBpbnNpZGVcblxuIyBDaGVja3Mgd2hldGhlciBhIHBvaW50IGlzIHdpdGhpbiBhIExheWVyJ3MgZnJhbWUuIFdvcmtzIGJlc3Qgd2l0aCBldmVudC5jb250ZXh0UG9pbnQhXG4jXG4jIEBleGFtcGxlXHRcbiNcbiMgbGF5ZXIub25Nb3VzZU1vdmUgKGV2ZW50KSAtPiBcbiNcdGZvciBidXR0b25MYXllciBpbiBidXR0b25MYXllcnNcbiNcdFx0cHJpbnQgVXRpbHMucG9pbnRJbkxheWVyKGJ1dHRvbkxheWVyKVxuI1xuVXRpbHMucG9pbnRJbkxheWVyID0gKHBvaW50LCBsYXllcikgLT5cblx0cmV0dXJuIFV0aWxzLnBvaW50SW5Qb2x5Z29uKHBvaW50LCBVdGlscy5wb2ludHNGcm9tRnJhbWUobGF5ZXIpKVxuXG5cbiMgR2V0IHRoZSBsYXllciB1bmRlciBhIHNjcmVlbiBwb2ludC4gSWYgbXVsdGlwbGUgbGF5ZXJzIG92ZXJsYXAsIGxheWVycyBvdmVybGFwcGVkXG4jIGJ5IHRoZWlyIGNoaWxkcmVuIHdpbGwgYmUgaWdub3JlZCwgYW5kIHRoZSBsYXllciB3aXRoIHRoZSBoaWdoZXN0IGluZGV4IHdpbGwgYmVcbiMgcmV0dXJuZWQuIFdvcmtzIGJlc3Qgd2l0aCBldmVudC5jb250ZXh0UG9pbnQhXG4jXG4jIEBleGFtcGxlXHRcbiNcbiMgbXlMYXllci5vbk1vdXNlTW92ZSAoZXZlbnQpIC0+IFxuI1x0cHJpbnQgVXRpbHMuZ2V0TGF5ZXJBdFBvaW50KGV2ZW50LmNvbnRleHRQb2ludClcbiNcblV0aWxzLmdldExheWVyQXRQb2ludCA9IChwb2ludCwgYXJyYXkgPSBGcmFtZXIuQ3VycmVudENvbnRleHQuX2xheWVycykgLT5cblx0dW5kZXIgPSBVdGlscy5nZXRMYXllcnNBdFBvaW50KGV2ZW50LnBvaW50LCBhcnJheSlcblx0XG5cdHZhbGlkID0gW11cblxuXHRmb3IgbGF5ZXIgaW4gdW5kZXJcblx0XHRpZiBfLmludGVyc2VjdGlvbih1bmRlciwgbGF5ZXIuY2hpbGRyZW4pLmxlbmd0aCA+IDBcblx0XHRcdGNvbnRpbnVlXG5cdFx0dmFsaWQucHVzaChsYXllcilcblxuXHRyZXR1cm4gXy5tYXhCeSh2YWxpZCwgJ2luZGV4JykgPyBudWxsXG5cbiMgR2V0IGFuIGFycmF5IG9mIGFsbCBsYXllcnMgdW5kZXIgYSBzY3JlZW4gcG9pbnQuIEJ5IGRlZmF1bHQsIGl0IHdpbGwgY2hlY2sgXG4jIGFsbCBsYXllcnMgaW4gdGhlIGN1cnJlbnQgRnJhbWVyIGNvbnRleHQ7IGJ1dCB5b3UgY2FuIHNwZWNpZnkgeW91ciBvd24gYXJyYXkgb2ZcbiMgbGF5ZXJzIGluc3RlYWQuIFdvcmtzIGJlc3Qgd2l0aCBldmVudC5jb250ZXh0UG9pbnQhXG4jXG4jIEBleGFtcGxlXHRcbiNcbiMgbXlMYXllci5vbk1vdXNlTW92ZSAoZXZlbnQpIC0+IFxuI1x0cHJpbnQgVXRpbHMuZ2V0TGF5ZXJzQXRQb2ludChldmVudC5jb250ZXh0UG9pbnQpXG4jXG5VdGlscy5nZXRMYXllcnNBdFBvaW50ID0gKHBvaW50LCBhcnJheSA9IEZyYW1lci5DdXJyZW50Q29udGV4dC5fbGF5ZXJzKSAtPlxuXHRcblx0bGF5ZXJzID0gW11cblx0XG5cdGZvciBsYXllciwgaSBpbiBhcnJheVxuXHRcdGlmIFV0aWxzLnBvaW50SW5Qb2x5Z29uKHBvaW50LCBVdGlscy5wb2ludHNGcm9tRnJhbWUobGF5ZXIpKVxuXHRcdFx0bGF5ZXJzLnB1c2gobGF5ZXIpXG5cdFx0XHRcblx0cmV0dXJuIGxheWVyc1xuXG4jIFRyeSB0byBmaW5kIHRoZSBsYXllciB0aGF0IG93bnMgYSBnaXZlbiBIVE1MIGVsZW1lbnQuIEJ5IGRlZmF1bHQsIGl0IHdpbGwgY2hlY2sgXG4jIGFsbCBsYXllcnMgaW4gdGhlIGN1cnJlbnQgRnJhbWVyIGNvbnRleHQ7IGJ1dCB5b3UgY2FuIHNwZWNpZnkgeW91ciBvd24gYXJyYXkgb2ZcbiMgbGF5ZXJzIGluc3RlYWQuXG4jXG4jIEBleGFtcGxlXHRcbiNcbiMgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlbW92ZVwiLCAoZXZlbnQpIC0+IFxuI1x0cHJpbnQgVXRpbHMuZ2V0TGF5ZXJGcm9tRWxlbWVudChldmVudC50YXJnZXQpXG4jXG5VdGlscy5nZXRMYXllckZyb21FbGVtZW50ID0gKGVsZW1lbnQsIGFycmF5ID0gRnJhbWVyLkN1cnJlbnRDb250ZXh0Ll9sYXllcnMpID0+XG5cdHJldHVybiBpZiBub3QgZWxlbWVudFxuXHRcblx0ZmluZExheWVyRWxlbWVudCA9IChlbGVtZW50KSAtPlxuXHRcdHJldHVybiBpZiBub3QgZWxlbWVudD8uY2xhc3NMaXN0XG5cdFx0XG5cdFx0aWYgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZyYW1lckxheWVyJylcblx0XHRcdHJldHVybiBlbGVtZW50XG5cdFx0XHRcblx0XHRmaW5kTGF5ZXJFbGVtZW50KGVsZW1lbnQucGFyZW50Tm9kZSlcblx0XG5cdGxheWVyRWxlbWVudCA9IGZpbmRMYXllckVsZW1lbnQoZWxlbWVudClcblx0cmV0dXJuIF8uZmluZChhcnJheSwgKGwpIC0+IGwuX2VsZW1lbnQgaXMgbGF5ZXJFbGVtZW50KSA/IG51bGxcblxuIyBHZXQgYW4gb3JkaW5hbCBmb3IgYSBkYXRlXG4jXG4jIEBleGFtcGxlXHRcbiNcbiMgbnVtID0gMlxuIyBkYXRlLnRleHQgPSBudW0gKyBVdGlscy5nZXRPcmRpbmFsKG51bSlcbiNcblV0aWxzLmdldE9yZGluYWwgPSAobnVtYmVyKSAtPlxuXHRzd2l0Y2ggbnVtYmVyICUgMTBcdFxuXHRcdHdoZW4gMSB0aGVuIHJldHVybiAnc3QnXHRcblx0XHR3aGVuIDIgdGhlbiByZXR1cm4gJ25kJ1x0XG5cdFx0d2hlbiAzIHRoZW4gcmV0dXJuICdyZCdcdFxuXHRcdGVsc2UgcmV0dXJuICd0aCdcblxuIyBDb252ZXJ0IGEgbnVtYmVyIHRvIHRoZSByaWdodCBudW1iZXIgb2YgcGl4ZWxzLlxuI1xuIyBAZXhhbXBsZVx0XG4jXG4jIGxheWVyLl9lbGVtZW50LnN0eWxlLmJvcmRlcldpZHRoID0gVXRpbHMucHgoNClcbiNcblV0aWxzLnB4ID0gKG51bSkgLT5cblx0cmV0dXJuIChudW0gKiBGcmFtZXIuRGV2aWNlLmNvbnRleHQuc2NhbGUpICsgJ3B4J1xuXG4jIExpbmsgbGF5ZXJCJ3MgcHJvcGVydHkgdG8gYWx3YXlzIG1hdGNoIGxheWVyQSdzIHByb3BlcnR5LlxuI1xuIyBAZXhhbXBsZVx0XG4jXG4jIFV0aWxzLmxpbmtQcm9wZXJ0aWVzKGxheWVyQSwgbGF5ZXJCLCAneCcpXG4jXG5VdGlscy5saW5rUHJvcGVydGllcyA9IChsYXllckEsIGxheWVyQiwgcHJvcHMuLi4pIC0+XG5cdHByb3BzLmZvckVhY2ggKHByb3ApIC0+XG5cdFx0dXBkYXRlID0gLT4gbGF5ZXJCW3Byb3BdID0gbGF5ZXJBW3Byb3BdXG5cdFx0bGF5ZXJBLm9uIFwiY2hhbmdlOiN7cHJvcH1cIiwgdXBkYXRlXG5cdFx0dXBkYXRlKClcblxuXG5cblxuXG4jIENvcHkgdGV4dCB0byB0aGUgY2xpcGJvYXJkLlxuI1xuIyBAZXhhbXBsZVxuIyBVdGlscy5jb3B5VGV4dFRvQ2xpcGJvYXJkKG15VGV4dExheWVyLnRleHQpXG4jXG5VdGlscy5jb3B5VGV4dFRvQ2xpcGJvYXJkID0gKHRleHQpIC0+XG5cdGNvcHlFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcInRleHRhcmVhXCJcblx0Y29weUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDBcblxuXHRjdHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZnJhbWVyQ29udGV4dFwiKVswXVxuXHRjdHguYXBwZW5kQ2hpbGQoY29weUVsZW1lbnQpXG5cblx0Y29weUVsZW1lbnQudmFsdWUgPSB0ZXh0XG5cdGNvcHlFbGVtZW50LnNlbGVjdCgpXG5cdGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jylcblx0Y29weUVsZW1lbnQuYmx1cigpXG5cblx0Y3R4LnJlbW92ZUNoaWxkKGNvcHlFbGVtZW50KVxuXG4jIFJ1biBhIFVSTCB0aHJvdWdoIEZyYW1lcidzIENPUlNwcm94eSwgdG8gcHJldmVudCBjcm9zcy1vcmlnaW4gaXNzdWVzLlxuIyBUaGFua3MgdG8gQG1hcmNrcmVubjogaHR0cHM6Ly9nb28uZ2wvVWhGdzl5XG4jXG4jIEBleGFtcGxlXG4jIGZldGNoKFV0aWxzLkNPUlNwcm94eSh1cmwpKS50aGVuKGNhbGxiYWNrKVxuI1xuVXRpbHMuQ09SU3Byb3h5ID0gKHVybCkgLT5cblxuXHQjIERldGVjdCBsb2NhbCBJUHY0L0l2UDYgYWRkcmVzc2VzXG5cdCMgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzExMzI3MzQ1XG5cdHJlZ2V4cCA9IC8oXjEyN1xcLil8KF4xOTJcXC4xNjhcXC4pfCheMTBcXC4pfCheMTcyXFwuMVs2LTldXFwuKXwoXjE3MlxcLjJbMC05XVxcLil8KF4xNzJcXC4zWzAtMV1cXC4pfCheOjoxJCl8KF5bZkZdW2NDZERdKS9cblxuXHRpZiByZWdleHAudGVzdCh3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpXG5cdFx0cmV0dXJuIFwiaHR0cDovLyN7d2luZG93LmxvY2F0aW9uLmhvc3R9L19zZXJ2ZXIvcHJveHkvI3t1cmx9XCJcblx0XG5cdHJldHVybiBcImh0dHBzOi8vY29ycy1hbnl3aGVyZS5oZXJva3VhcHAuY29tLyN7dXJsfVwiXG5cbiMgU2V0IHRoZSBhdHRyaWJ1dGVzIG9mIGEgRE9NIGVsZW1lbnQuXG4jXG4jIEBleGFtcGxlXG4jIFV0aWxzLnNldEF0dHJpYnV0ZXMgbXlIVE1MSW5wdXQsIHthdXRvY29ycmVjdDogJ29mZid9XG4jXG5VdGlscy5zZXRBdHRyaWJ1dGVzID0gKGVsZW1lbnQsIGF0dHJpYnV0ZXMgPSB7fSkgLT5cblx0Zm9yIGtleSwgdmFsdWUgb2YgYXR0cmlidXRlc1xuXHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpXG5cbiMgVXNlIGlubGluZSBzdHlsZXMgd2l0aCBhIFRleHRMYXllci5cbiNcbiMgQGV4YW1wbGVcbiMgbXlUZXh0TGF5ZXIudGV4dCA9IFwiVGhpcyBpcyBhICoqYm9sZCoqIHN0YXRlbWVudC5cIlxuIyBVdGlscy50b01hcmtkb3duKG15VGV4dExheWVyKVxuI1xuVXRpbHMudG9NYXJrZG93biA9ICh0ZXh0TGF5ZXIpIC0+XG5cdFxuXHRpZiBub3QgdGV4dExheWVyIGluc3RhbmNlb2YgVGV4dExheWVyXG5cdFx0dGhyb3cgXCJVdGlscy50b01hcmtkb3duIG9ubHkgd29ya3Mgd2l0aCBUZXh0TGF5ZXJzLlwiXG5cblx0bG9vcFN0cmluZyA9IChzdHJpbmcsIHJlZykgLT5cblx0XHRpZiBub3Qgc3RyaW5nLm1hdGNoKHJlZ1swXSlcblx0XHRcdHJldHVybiBzdHJpbmcgXG5cblx0XHRsb29wU3RyaW5nKHN0cmluZy5yZXBsYWNlKHJlZ1swXSwgcmVnWzFdKSwgcmVnKVxuXG5cdHJlZ2V4ZXMgPSBbXG5cdFx0Wy9cXFsoW15cXFtdKylcXF1cXCgoW15cXCldKylcXCkvLCAnPGEgaHJlZj1cXCckMlxcJz4kMTwvYT4nXVxuXHRcdFsvKFxcKlxcKnxfXykoLio/KVxcMS8sICc8Yj4kMjwvYj4nXVxuXHRcdFsvKFxcKnxfKSguKj8pXFwxLywgJzxpPiQyPC9pPiddXG5cdFx0Wy9cXH5cXH4oLio/KVxcflxcfi8sICc8ZGVsPiQxPC9kZWw+J11cblx0XHRbL2AoLio/KWAvLCAnPGNvZGU+JDE8L2NvZGU+J11cblx0XHRdXG5cblx0Zm9yIGVsIGluIHRleHRMYXllci5fZWxlbWVudC5jaGlsZHJlblsxXS5jaGlsZE5vZGVzXG5cdFx0ZWwuY2hpbGROb2Rlc1swXS5pbm5lckhUTUwgPSBfLnJlZHVjZShyZWdleGVzLCBsb29wU3RyaW5nLCBlbC5jaGlsZE5vZGVzWzBdLmlubmVySFRNTClcblx0XG5cdGRvIF8uYmluZCggLT5cblx0XHRmb3JjZVJlbmRlciA9IGZhbHNlXG5cdFx0QF91cGRhdGVIVE1MU2NhbGUoKVxuXHRcdGlmIG5vdCBAYXV0b1NpemVcblx0XHRcdGlmIEB3aWR0aCA8IEBfZWxlbWVudEhUTUwuY2xpZW50V2lkdGggb3IgQGhlaWdodCA8IEBfZWxlbWVudEhUTUwuY2xpZW50SGVpZ2h0XG5cdFx0XHRcdEBjbGlwID0gdHJ1ZVxuXHRcdHJldHVybiB1bmxlc3MgZm9yY2VSZW5kZXIgb3IgQGF1dG9IZWlnaHQgb3IgQGF1dG9XaWR0aCBvciBAdGV4dE92ZXJmbG93IGlzbnQgbnVsbFxuXHRcdHBhcmVudFdpZHRoID0gaWYgQHBhcmVudD8gdGhlbiBAcGFyZW50LndpZHRoIGVsc2UgU2NyZWVuLndpZHRoXG5cdFx0Y29uc3RyYWluZWRXaWR0aCA9IGlmIEBhdXRvV2lkdGggdGhlbiBwYXJlbnRXaWR0aCBlbHNlIEBzaXplLndpZHRoXG5cdFx0cGFkZGluZyA9IFV0aWxzLnJlY3RaZXJvKFV0aWxzLnBhcnNlUmVjdChAcGFkZGluZykpXG5cdFx0Y29uc3RyYWluZWRXaWR0aCAtPSAocGFkZGluZy5sZWZ0ICsgcGFkZGluZy5yaWdodClcblx0XHRpZiBAYXV0b0hlaWdodFxuXHRcdFx0Y29uc3RyYWluZWRIZWlnaHQgPSBudWxsXG5cdFx0ZWxzZVxuXHRcdFx0Y29uc3RyYWluZWRIZWlnaHQgPSBAc2l6ZS5oZWlnaHQgLSAocGFkZGluZy50b3AgKyBwYWRkaW5nLmJvdHRvbSlcblx0XHRjb25zdHJhaW50cyA9XG5cdFx0XHR3aWR0aDogY29uc3RyYWluZWRXaWR0aFxuXHRcdFx0aGVpZ2h0OiBjb25zdHJhaW5lZEhlaWdodFxuXHRcdFx0bXVsdGlwbGllcjogQGNvbnRleHQucGl4ZWxNdWx0aXBsaWVyXG5cblx0XHRjYWxjdWxhdGVkU2l6ZSA9IEBfc3R5bGVkVGV4dC5tZWFzdXJlIGNvbnN0cmFpbnRzXG5cdFx0QGRpc2FibGVBdXRvc2l6ZVVwZGF0aW5nID0gdHJ1ZVxuXHRcdGlmIGNhbGN1bGF0ZWRTaXplLndpZHRoP1xuXHRcdFx0QHdpZHRoID0gY2FsY3VsYXRlZFNpemUud2lkdGggKyBwYWRkaW5nLmxlZnQgKyBwYWRkaW5nLnJpZ2h0XG5cdFx0aWYgY2FsY3VsYXRlZFNpemUuaGVpZ2h0P1xuXHRcdFx0QGhlaWdodCA9IGNhbGN1bGF0ZWRTaXplLmhlaWdodCArIHBhZGRpbmcudG9wICsgcGFkZGluZy5ib3R0b21cblx0XHRAZGlzYWJsZUF1dG9zaXplVXBkYXRpbmcgPSBmYWxzZVxuXHQsIHRleHRMYXllcilcblx0XHRcblx0dGV4dExheWVyLmVtaXQgXCJjaGFuZ2U6dGV4dFwiLCB0ZXh0TGF5ZXIudGV4dCwgdGV4dExheWVyXG5cbiMgTWFrZSBhbiBhc3luY3Jvbm91cyByZXF1ZXN0XG4jXG4jIEBleGFtcGxlIEZldGNoIGFuZCByZXR1cm4gYSBSZXNwb25zZSBvYmplY3QuXG4jXHRVdGlscy5mZXRjaCAnaHR0cDovL2V4YW1wbGUuY29tL2Fuc3dlcicsIChkKSAtPiBwcmludCBkXG4jXG4jIEBwYXJhbSBbU3RyaW5nXSB1cmwgdGhlIHVybCB0byBmZXRjaCwgcmV0dXJucyBhIFJlc3BvbnNlXG4jIEBwYXJhbSBbRnVuY3Rpb25dIGNhbGxiYWNrIHRoZSBjYWxsYmFjayB0byBydW4gd2l0aCB0aGUgcmV0dXJuZWQgZGF0YVxuI1xuVXRpbHMuZmV0Y2ggPSAodXJsLCBjYWxsYmFjaykgLT5cblx0dW5sZXNzIHVybC5pbmNsdWRlcyAnY29ycy1hbnl3aGVyZSdcblx0XHR1cmwgPSBVdGlscy5DT1JTcHJveHkodXJsKVxuXHRcblx0ZmV0Y2godXJsLCB7J21ldGhvZCc6ICdHRVQnLCAnbW9kZSc6ICdjb3JzJ30pLnRoZW4oIGNhbGxiYWNrIClcblxuXG4jIE1ha2UgYW4gYXN5bmNyb25vdXMgcmVxdWVzdCBhbmQgcmV0dXJuIEpTT04uXG4jXG4jIEBleGFtcGxlIEZldGNoIGFuZCByZXR1cm4gYSBKU09OIG9iamVjdC5cbiNcdFV0aWxzLmZldGNoSlNPTiAnaHR0cDovL2V4YW1wbGUuY29tL2Fuc3dlcicsIChkKSAtPiBwcmludCBkXG4jXG4jIEBwYXJhbSBbU3RyaW5nXSB1cmwgdGhlIHVybCB0byBmZXRjaCwgcmV0dXJucyBKU09OIG9iamVjdFxuIyBAcGFyYW0gW0Z1bmN0aW9uXSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgdG8gcnVuIHdpdGggdGhlIHJldHVybmVkIGRhdGFcbiNcblV0aWxzLmZldGNoSlNPTiA9ICh1cmwsIGNhbGxiYWNrKSAtPlxuXHR1bmxlc3MgdXJsLmluY2x1ZGVzICdjb3JzLWFueXdoZXJlJ1xuXHRcdHVybCA9IFV0aWxzLkNPUlNwcm94eSh1cmwpXG5cdFxuXHRmZXRjaCh1cmwsIHsnbWV0aG9kJzogJ0dFVCcsICdtb2RlJzogJ2NvcnMnfSkudGhlbiggXG5cdFx0KHIpIC0+IHIuanNvbigpLnRoZW4oIGNhbGxiYWNrIClcblx0XHQpXG5cblxuIyBSZXR1cm4gYSByYW5kb20gdGV4dCBzdHJpbmcuXG4jXG4jIEBleGFtcGxlIEdlbmVyYXRlIHBsYWluIHRleHQuXG4jXHRVdGlscy5yYW5kb21UZXh0KDQpIFxuI1x0wrsgXCJhdXQgZXhwZWRpdGEgYXV0IGZ1Z2l0XCJcbiNcbiMgQGV4YW1wbGUgR2VuZXJhdGUgc2VudGVuY2VzLlxuI1x0VXRpbHMucmFuZG9tVGV4dCg0LCB0cnVlKVxuI1x0wrsgXCJTb2x1dGEgZG9sb3IgdGVtcG9yZSBwYXJpYXR1ci5cIlxuI1xuIyBAIHBhcmFtIFtJbnRlZ2VyXSB3b3JkcyBUaGUgbnVtYmVyIG9mIHdvcmRzIHRvIHJldHVyblxuIyBAIHBhcmFtIFtCb29sZWFuXSBbc2VudGVuY2VzXSBXaGV0aGVyIHRvIHNwbGl0IHRoZSB3b3JkcyBpbnRvIHNlbnRlbmNlc1xuIyBAIHBhcmFtIFtCb29sZWFuXSBbcGFyYWdyYXBoc10gV2hldGhlciB0byBzcGxpdCB0aGUgd29yZHMgaW50byBwYXJhZ3JhcGhzXG4jXG5VdGlscy5yYW5kb21UZXh0ID0gKHdvcmRzID0gMTIsIHNlbnRlbmNlcyA9IGZhbHNlLCBwYXJhZ3JhcGhzID0gZmFsc2UpIC0+XG5cdHRleHQgPSBBcnJheS5mcm9tKHtsZW5ndGg6IHdvcmRzfSwgLT4gXy5zYW1wbGUobG9yZW1Tb3VyY2UpKVxuXG5cdHVubGVzcyBzZW50ZW5jZXMgXG5cdFx0cmV0dXJuIHRleHQuam9pbignICcpXG5cblx0aWYgd29yZHMgPD0gM1xuXHRcdHJldHVybiBfLmNhcGl0YWxpemUoIF8uc2FtcGxlU2l6ZSh0ZXh0LCAzKS5qb2luKCcgJykgKSArICcuJ1xuXG5cdCMgbWFrZSBzZW50ZW5jZXNcblxuXHRzZW50ZW5jZXMgPSBbXVxuXG5cdHdoaWxlIHRleHQubGVuZ3RoID4gMFxuXHRcdGlmIHRleHQubGVuZ3RoIDw9IDNcblx0XHRcdF8uc2FtcGxlKHNlbnRlbmNlcykucHVzaCh0ZXh0LnBvcCgpKVxuXHRcdFx0Y29udGludWUgXG5cblx0XHRsZW5ndGggPSBfLmNsYW1wKF8ucmFuZG9tKDMsIDYpLCAwLCB0ZXh0Lmxlbmd0aClcblx0XHRzZW50ZW5jZXMucHVzaChfLnB1bGxBdCh0ZXh0LCBbMC4uLmxlbmd0aF0pKVxuXG5cdGlmIHNlbnRlbmNlcy5sZW5ndGggPCAzXG5cdFx0cGFyYWdyYXBocyA9IGZhbHNlXG5cdFxuXHR1bmxlc3MgcGFyYWdyYXBoc1xuXHRcdHJldHVybiBzZW50ZW5jZXMubWFwKCAoYSkgLT5cblx0XHRcdF8uY2FwaXRhbGl6ZSggYS5qb2luKCcgJykgKSArICcuJ1xuXHRcdFx0KS5qb2luKCcgJylcblxuXHQjIG1ha2UgcGFyYWdyYXBoc1xuXG5cdHBhcmFncmFwaHMgPSBbXVxuXG5cdHdoaWxlIHNlbnRlbmNlcy5sZW5ndGggPiAwXG5cdFx0aWYgc2VudGVuY2VzLmxlbmd0aCA8PSAzIGFuZCBwYXJhZ3JhcGhzLmxlbmd0aCA+IDBcblx0XHRcdF8uc2FtcGxlKHBhcmFncmFwaHMpLnB1c2goc2VudGVuY2VzLnBvcCgpKVxuXHRcdFx0Y29udGludWUgXG5cblx0XHRsZW5ndGggPSBfLmNsYW1wKF8ucmFuZG9tKDMsIDYpLCAwLCBzZW50ZW5jZXMubGVuZ3RoKVxuXHRcdHBhcmFncmFwaHMucHVzaChfLnB1bGxBdChzZW50ZW5jZXMsIFswLi4ubGVuZ3RoXSkpXG5cblx0IyBNYWtlIHRleHRcblxuXHR0ZXh0ID0gJydcblxuXHRmb3IgcGFyYWdyYXBoIGluIHBhcmFncmFwaHNcblx0XHR0ZXh0ICs9IF8ucmVkdWNlKFxuXHRcdFx0cGFyYWdyYXBoLFxuXHRcdFx0KHN0cmluZywgc2VudGVuY2UpIC0+XG5cdFx0XHRcdHN0cmluZyArPSBfLmNhcGl0YWxpemUoIHNlbnRlbmNlLmpvaW4oJyAnKSApICsgJy4gJ1xuXHRcdFx0JycpLnRyaW0oKSArICdcXG5cXG4nXG5cblx0cmV0dXJuIHRleHQudHJpbSgpXG5cbiMgQ2hlY2sgd2hldGhlciBhIHN0cmluZyBpcyBhIHZhbGlkIGVtYWlsLlxuI1xuIyBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gY2hlY2suXG5VdGlscy5pc0VtYWlsID0gKHN0cmluZykgLT5cbiAgICByZXR1cm4gc3RyaW5nLnRvTG93ZXJDYXNlKCkubWF0Y2goL14oKFtePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSsoXFwuW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKykqKXwoXCIuK1wiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XSl8KChbYS16QS1aXFwtMC05XStcXC4pK1thLXpBLVpdezIsfSkpJC8pXG5cblxuIyBTb3VyY2Ugd29yZHMgZm9yIFV0aWxzLnJhbmRvbVRleHQoKVxuI1xubG9yZW1Tb3VyY2UgPSBbXCJhbGlhc1wiLCBcImNvbnNlcXVhdHVyXCIsIFwiYXV0XCIsIFwicGVyZmVyZW5kaXNcIiwgXCJzaXRcIixcblwidm9sdXB0YXRlbVwiLCBcImFjY3VzYW50aXVtXCIsIFwiZG9sb3JlbXF1ZVwiLCBcImFwZXJpYW1cIiwgXCJlYXF1ZVwiLCBcImlwc2FcIiwgXCJxdWFlXCIsXG5cImFiXCIsIFwiaWxsb1wiLCBcImludmVudG9yZVwiLCBcInZlcml0YXRpc1wiLCBcImV0XCIsIFwicXVhc2lcIiwgXCJhcmNoaXRlY3RvXCIsIFwiYmVhdGFlXCIsXG5cInZpdGFlXCIsIFwiZGljdGFcIiwgXCJzdW50XCIsIFwiZXhwbGljYWJvXCIsIFwiYXNwZXJuYXR1clwiLCBcImF1dFwiLCBcIm9kaXRcIiwgXCJhdXRcIixcblwiZnVnaXRcIiwgXCJzZWRcIiwgXCJxdWlhXCIsIFwiY29uc2VxdXVudHVyXCIsIFwibWFnbmlcIiwgXCJkb2xvcmVzXCIsIFwiZW9zXCIsIFwicXVpXCIsXG5cInJhdGlvbmVcIiwgXCJ2b2x1cHRhdGVtXCIsIFwic2VxdWlcIiwgXCJuZXNjaXVudFwiLCBcIm5lcXVlXCIsIFwiZG9sb3JlbVwiLCBcImlwc3VtXCIsXG5cInF1aWFcIiwgXCJkb2xvclwiLCBcInNpdFwiLCBcImFtZXRcIiwgXCJjb25zZWN0ZXR1clwiLCBcImFkaXBpc2NpXCIsIFwidmVsaXRcIiwgXCJzZWRcIixcblwicXVpYVwiLCBcIm5vblwiLCBcIm51bXF1YW1cIiwgXCJlaXVzXCIsIFwibW9kaVwiLCBcInRlbXBvcmFcIiwgXCJpbmNpZHVudFwiLCBcInV0XCIsIFwibGFib3JlXCIsXG5cImV0XCIsIFwiZG9sb3JlXCIsIFwibWFnbmFtXCIsIFwiYWxpcXVhbVwiLCBcInF1YWVyYXRcIiwgXCJ2b2x1cHRhdGVtXCIsIFwidXRcIiwgXCJlbmltXCIsXG5cImFkXCIsIFwibWluaW1hXCIsIFwidmVuaWFtXCIsIFwicXVpc1wiLCBcIm5vc3RydW1cIiwgXCJleGVyY2l0YXRpb25lbVwiLCBcInVsbGFtXCIsXG5cImNvcnBvcmlzXCIsIFwibmVtb1wiLCBcImVuaW1cIiwgXCJpcHNhbVwiLCBcInZvbHVwdGF0ZW1cIiwgXCJxdWlhXCIsIFwidm9sdXB0YXNcIiwgXCJzaXRcIixcblwic3VzY2lwaXRcIiwgXCJsYWJvcmlvc2FtXCIsIFwibmlzaVwiLCBcInV0XCIsIFwiYWxpcXVpZFwiLCBcImV4XCIsIFwiZWFcIiwgXCJjb21tb2RpXCIsXG5cImNvbnNlcXVhdHVyXCIsIFwicXVpc1wiLCBcImF1dGVtXCIsIFwidmVsXCIsIFwiZXVtXCIsIFwiaXVyZVwiLCBcInJlcHJlaGVuZGVyaXRcIiwgXCJxdWlcIixcblwiaW5cIiwgXCJlYVwiLCBcInZvbHVwdGF0ZVwiLCBcInZlbGl0XCIsIFwiZXNzZVwiLCBcInF1YW1cIiwgXCJuaWhpbFwiLCBcIm1vbGVzdGlhZVwiLCBcImV0XCIsXG5cIml1c3RvXCIsIFwib2Rpb1wiLCBcImRpZ25pc3NpbW9zXCIsIFwiZHVjaW11c1wiLCBcInF1aVwiLCBcImJsYW5kaXRpaXNcIiwgXCJwcmFlc2VudGl1bVwiLFxuXCJsYXVkYW50aXVtXCIsIFwidG90YW1cIiwgXCJyZW1cIiwgXCJ2b2x1cHRhdHVtXCIsIFwiZGVsZW5pdGlcIiwgXCJhdHF1ZVwiLCBcImNvcnJ1cHRpXCIsXG5cInF1b3NcIiwgXCJkb2xvcmVzXCIsIFwiZXRcIiwgXCJxdWFzXCIsIFwibW9sZXN0aWFzXCIsIFwiZXhjZXB0dXJpXCIsIFwic2ludFwiLCBcIm9jY2FlY2F0aVwiLFxuXCJjdXBpZGl0YXRlXCIsIFwibm9uXCIsIFwicHJvdmlkZW50XCIsIFwic2VkXCIsIFwidXRcIiwgXCJwZXJzcGljaWF0aXNcIiwgXCJ1bmRlXCIsIFwib21uaXNcIixcblwiaXN0ZVwiLCBcIm5hdHVzXCIsIFwiZXJyb3JcIiwgXCJzaW1pbGlxdWVcIiwgXCJzdW50XCIsIFwiaW5cIiwgXCJjdWxwYVwiLCBcInF1aVwiLCBcIm9mZmljaWFcIixcblwiZGVzZXJ1bnRcIiwgXCJtb2xsaXRpYVwiLCBcImFuaW1pXCIsIFwiaWRcIiwgXCJlc3RcIiwgXCJsYWJvcnVtXCIsIFwiZXRcIiwgXCJkb2xvcnVtXCIsXG5cImZ1Z2FcIiwgXCJldFwiLCBcImhhcnVtXCIsIFwicXVpZGVtXCIsIFwicmVydW1cIiwgXCJmYWNpbGlzXCIsIFwiZXN0XCIsIFwiZXRcIiwgXCJleHBlZGl0YVwiLFxuXCJkaXN0aW5jdGlvXCIsIFwibmFtXCIsIFwibGliZXJvXCIsIFwidGVtcG9yZVwiLCBcImN1bVwiLCBcInNvbHV0YVwiLCBcIm5vYmlzXCIsIFwiZXN0XCIsXG5cImVsaWdlbmRpXCIsIFwib3B0aW9cIiwgXCJjdW1xdWVcIiwgXCJuaWhpbFwiLCBcImltcGVkaXRcIiwgXCJxdW9cIiwgXCJwb3Jyb1wiLCBcInF1aXNxdWFtXCIsXG5cImVzdFwiLCBcInF1aVwiLCBcIm1pbnVzXCIsIFwiaWRcIiwgXCJxdW9kXCIsIFwibWF4aW1lXCIsIFwicGxhY2VhdFwiLCBcImZhY2VyZVwiLCBcInBvc3NpbXVzXCIsXG5cIm9tbmlzXCIsIFwidm9sdXB0YXNcIiwgXCJhc3N1bWVuZGFcIiwgXCJlc3RcIiwgXCJvbW5pc1wiLCBcImRvbG9yXCIsIFwicmVwZWxsZW5kdXNcIixcblwidGVtcG9yaWJ1c1wiLCBcImF1dGVtXCIsIFwicXVpYnVzZGFtXCIsIFwiZXRcIiwgXCJhdXRcIiwgXCJjb25zZXF1YXR1clwiLCBcInZlbFwiLCBcImlsbHVtXCIsXG5cInF1aVwiLCBcImRvbG9yZW1cIiwgXCJldW1cIiwgXCJmdWdpYXRcIiwgXCJxdW9cIiwgXCJ2b2x1cHRhc1wiLCBcIm51bGxhXCIsIFwicGFyaWF0dXJcIiwgXCJhdFwiLFxuXCJ2ZXJvXCIsIFwiZW9zXCIsIFwiZXRcIiwgXCJhY2N1c2FtdXNcIiwgXCJvZmZpY2lpc1wiLCBcImRlYml0aXNcIiwgXCJhdXRcIiwgXCJyZXJ1bVwiLFxuXCJuZWNlc3NpdGF0aWJ1c1wiLCBcInNhZXBlXCIsIFwiZXZlbmlldFwiLCBcInV0XCIsIFwiZXRcIiwgXCJ2b2x1cHRhdGVzXCIsIFwicmVwdWRpYW5kYWVcIixcblwic2ludFwiLCBcImV0XCIsIFwibW9sZXN0aWFlXCIsIFwibm9uXCIsIFwicmVjdXNhbmRhZVwiLCBcIml0YXF1ZVwiLCBcImVhcnVtXCIsIFwicmVydW1cIixcblwiaGljXCIsIFwidGVuZXR1clwiLCBcImFcIiwgXCJzYXBpZW50ZVwiLCBcImRlbGVjdHVzXCIsIFwidXRcIiwgXCJhdXRcIiwgXCJyZWljaWVuZGlzXCIsXG5cInZvbHVwdGF0aWJ1c1wiLCBcIm1haW9yZXNcIiwgXCJkb2xvcmlidXNcIiwgXCJhc3BlcmlvcmVzXCIsIFwicmVwZWxsYXRcIl0iLCIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uXG4jIFRWS2l0ID0gcmVxdWlyZSBcIlRWS2l0XCJcblxucmVxdWlyZSBcIm1vcmV1dGlsc1wiXG5cbkZyYW1lci5EZWZhdWx0cy5BbmltYXRpb24gPVxuICAgIHRpbWU6IDAuM1xuXG5DYW52YXMuYmFja2dyb3VuZENvbG9yID0gJyMxZjFmMWYnXG5cbnR2VXRpbHMgPSByZXF1aXJlIFwidHZVdGlsc1wiXG53aW5kb3cudHZVdGlscyA9IHR2VXRpbHNcblxueyBQcm9ncmFtbWVUaWxlIH0gPSByZXF1aXJlIFwiUHJvZ3JhbW1lVGlsZVwiXG57IE5hdmlnYWJsZXMgfSA9IHJlcXVpcmUgXCJOYXZpZ2FibGVzXCJcbnsgTWVudSB9ID0gcmVxdWlyZSBcIk1lbnVcIlxueyBDYXJvdXNlbCB9ID0gcmVxdWlyZSBcIkNhcm91c2VsXCJcbnsgR3JpZCB9ID0gcmVxdWlyZSBcIkdyaWRcIlxueyBIaWdobGlnaHQgfSA9IHJlcXVpcmUgXCJIaWdobGlnaHRcIlxueyBCdXR0b25zIH0gPSByZXF1aXJlIFwiQnV0dG9uc1wiXG5cbndpbmRvdy5Qcm9ncmFtbWVUaWxlID0gUHJvZ3JhbW1lVGlsZVxud2luZG93Lk1lbnUgPSBNZW51XG53aW5kb3cuQ2Fyb3VzZWwgPSBDYXJvdXNlbFxud2luZG93LkdyaWQgPSBHcmlkXG53aW5kb3cuSGlnaGxpZ2h0ID0gSGlnaGxpZ2h0XG53aW5kb3cuQnV0dG9ucyA9IEJ1dHRvbnNcbndpbmRvdy5OYXZpZ2FibGVzID0gTmF2aWdhYmxlcyIsInR2VXRpbHMgPSByZXF1aXJlIFwidHZVdGlsc1wiXG5jbGFzcyBleHBvcnRzLlByb2dyYW1tZVRpbGUgZXh0ZW5kcyBMYXllclxuXG5cdGNvbnN0cnVjdG9yOiAoIG9wdGlvbnM9e30gKSAtPlxuXG5cdFx0IyBwcmludCBcImNvbnN0cnVjdG9yLXN0YXJ0XCJcblx0XHRAX19jb25zdHJ1Y3Rpb24gPSB0cnVlXG5cdFx0QF9faW5zdGFuY2luZyA9IHRydWVcblxuXHRcdF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdG5hbWU6IFwiUHJvZ3JhbW1lIFRpbGVcIlxuXHRcdFx0d2lkdGg6IDI4MFxuXHRcdFx0aGVpZ2h0OiAxNTdcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRcdFx0dGl0bGU6IFwiTWlkc29tZXIgTXVyZGVyc1wiXG5cdFx0XHRsYWJlbDogXCJcIlxuXHRcdFx0c3lub3BzaXM6IFwiT25jZSB1cG9uIGEgdGltZSBhIGRyYWdvbiBlbnRlcmVkIGEgZGFuY2UgY29tcGV0aXRpb24gYW5kIGhlIHdhcyByYXRoZXIgZ29vZCBhdCBpdC4gSGUgd2FzIGEgZGFuY2luZyBkcmFnb24gb2YgZ3JlYXQgaW1wb3J0LlwiXG5cdFx0XHRsYWJlbENvbG9yOiBcIiM4Mzg1OEFcIlxuXHRcdFx0dGhpcmRMaW5lOiBcIlNlcmllcyAxLCBFcGlzb2RlIDFcIlxuXHRcdFx0ZG9nOiBcIlwiXG5cdFx0XHRyZWNvcmRlZDogZmFsc2Vcblx0XHRcdHdhdGNobGlzdDogZmFsc2Vcblx0XHRcdGdob3N0OiBmYWxzZVxuXHRcdFx0bGluZWFyOiBmYWxzZVxuXHRcdFx0b25EZW1hbmQ6IHRydWVcblx0XHRcdHBsYXlhYmxlOiBmYWxzZVxuXG5cdFx0IyBwcmludCBcImNvbnN0cnVjdG9yLWVuZFwiXG5cdFx0bGFiZWxUZXh0ID0gb3B0aW9ucy5sYWJlbFxuXHRcdG9wdGlvbnMubGFiZWwgPSB1bmRlZmluZWRcblx0XHRzdXBlciBvcHRpb25zXG5cblxuXHRcdCMgcHJpbnQgb3B0aW9ucy5oZWlnaHRcblx0XHRfLmFzc2lnbiBALFxuXHRcdFx0Y2xpcDogdHJ1ZVxuXHRcdFx0aGVpZ2h0OiBvcHRpb25zLmhlaWdodFxuXG5cdFx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdCMgTGF5ZXJzXG5cdFx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0aWYgQG9uRGVtYW5kID09IHRydWUgb3IgQGxpbmVhciA9PSB0cnVlIHRoZW4gQHBsYXlhYmxlID0gdHJ1ZVxuXHRcdEBncmFkaWVudExheWVyID0gbmV3IExheWVyXG5cdFx0XHRwYXJlbnQ6IEBcblx0XHRcdG5hbWU6J2dyYWRpZW50J1xuXHRcdFx0d2lkdGg6IG9wdGlvbnMud2lkdGgsIGhlaWdodDogQC5oZWlnaHQrMjVcblx0XHRcdHg6IDAsIHk6IDAsIGluZGV4OiAwXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiXCJcblx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcImJhY2tncm91bmQtaW1hZ2VcIjpcImxpbmVhci1ncmFkaWVudCgtMTgwZGVnLCByZ2JhKDAsMCwwLDAuMzApIDAlLCByZ2JhKDAsMCwwLDAuMzApIDM1JSwgcmdiYSgwLDAsMCwwLjkwKSA2MCUpXCJcblxuXHRcdEB0ZXh0Q29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0XHRwYXJlbnQ6IEAsIG5hbWU6ICd0ZXh0Q29udGFpbmVyJ1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXG5cdFx0XHR4OiAxMCwgeTogb3B0aW9ucy5oZWlnaHQtNTQsIGhlaWdodDogNzAsIGluZGV4OiAxXG5cblx0XHRAdGl0bGVMYXllciA9IG5ldyBUZXh0TGF5ZXJcblx0XHRcdHBhcmVudDogQHRleHRDb250YWluZXIsIG5hbWU6ICd0aXRsZUxheWVyJ1xuXHRcdFx0dGV4dDogb3B0aW9ucy50aXRsZVxuXHRcdFx0Zm9udEZhbWlseTogJ0F2ZW5pcicsIGZvbnRTaXplOiAyMiwgY29sb3I6ICcjRUJFQkVCJ1xuXHRcdFx0eTogMjEsIGluZGV4OiAxXG5cdFx0XHRoZWlnaHQ6IDI2LCB3aWR0aDogaWYgb3B0aW9ucy5wbGF5YWJsZSA9PSBmYWxzZSB0aGVuIEAud2lkdGgtMjAgZWxzZSBALndpZHRoLTQwXG5cdFx0XHR4OiBpZiBvcHRpb25zLnBsYXlhYmxlID09IGZhbHNlIHRoZW4gMCBlbHNlIDI2XG5cdFx0XHR0cnVuY2F0ZTogdHJ1ZVxuXG5cdFx0QGxhYmVsTGF5ZXIgPSBuZXcgVGV4dExheWVyXG5cdFx0XHRwYXJlbnQ6IEB0ZXh0Q29udGFpbmVyXG5cdFx0XHRuYW1lOiAnbGFiZWxMYXllcidcblx0XHRcdHRleHQ6IGxhYmVsVGV4dFxuXHRcdFx0Zm9udEZhbWlseTogJ0F2ZW5pci1CbGFjaydcblx0XHRcdGZvbnRTaXplOiAxNlxuXHRcdFx0dGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZSdcblx0XHRcdGNvbG9yOiBvcHRpb25zLmxhYmVsQ29sb3Jcblx0XHRcdGxldHRlclNwYWNpbmc6IDAuMjRcblx0XHRcdGhlaWdodDogMTgsIHdpZHRoOiBALndpZHRoLTIwLCBpbmRleDogMVxuXHRcdFx0dHJ1bmNhdGU6IHRydWVcblxuXHRcdEB0aGlyZExpbmVMYXllciA9IG5ldyBUZXh0TGF5ZXJcblx0XHRcdHBhcmVudDogQCwgbmFtZTondGhpcmRMaW5lTGF5ZXInXG5cdFx0XHRmb250RmFtaWx5OiAnQXZlbmlyLUJsYWNrJywgZm9udFNpemU6IDE2LCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJywgY29sb3I6ICcjQjZCOUJGJ1xuXHRcdFx0eTogQC5oZWlnaHQsIHg6IDEwLCBpbmRleDogMVxuXHRcdFx0aGVpZ2h0OiAxOCwgd2lkdGg6IEAud2lkdGgtMjBcblx0XHRcdHRleHQ6IG9wdGlvbnMudGhpcmRMaW5lXG5cdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHR0cnVuY2F0ZTogdHJ1ZVxuXG5cdFx0QGRvZ0ltYWdlTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHBhcmVudDogQCwgbmFtZTogJ2RvZydcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJydcblx0XHRcdHk6IDEwLCBtYXhYOiBALndpZHRoLTEwXG5cdFx0XHRoZWlnaHQ6IDMwLCB3aWR0aDogMTAwXG5cdFx0XHRodG1sOiBcIlwiXCI8aW1nIHN0eWxlID0gXCJmbG9hdDpyaWdodDttYXgtd2lkdGg6MTAwJTttYXgtaGVpZ2h0OjEwMCU7XCIgc3JjID0gJyN7b3B0aW9ucy5kb2d9Jz5cIlwiXCJcblx0XHRcdG9wYWNpdHk6IDBcblxuXHRcdEBhcHBlYXIgPSBuZXcgQW5pbWF0aW9uIEAsXG5cdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGRpc2FwcGVhciA9IG5ldyBBbmltYXRpb24gQCxcblx0XHRcdG9wYWNpdHk6IDBcblxuXHRcdHRleHRMYXllcnMgPSBbQHRpdGxlTGF5ZXIsIEBsYWJlbExheWVyLCBAdGhpcmRMaW5lTGF5ZXJdXG5cdFx0dHZVdGlscy5icmVha0xldHRlcih0ZXh0TGF5ZXJzKVxuXG5cdFx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdCMgSGlnaGxpZ2h0IEFuaW1hdGlvbnNcblx0XHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0XHQjIEhpZ2hsaWdodFxuXHRcdEB1cGRhdGVIaWdobGlnaHRBbmltYXRpb25zID0gLT5cblx0XHRcdEBfY29udGFpbmVySGlnaGxpZ2h0ID0gbmV3IEFuaW1hdGlvbiBAdGV4dENvbnRhaW5lciwgI1RpdGxlICYgbGFiZWxcblx0XHRcdFx0XHR5OiBALmhlaWdodC03NFxuXHRcdFx0XHRcdG9wdGlvbnM6XG5cdFx0XHRcdFx0XHRkZWxheTogMVxuXHRcdFx0XHRcdFx0dGltZTogMC41XG5cdFx0XHRAX3RoaXJkTGluZUhpZ2hsaWdodCA9IG5ldyBBbmltYXRpb24gQHRoaXJkTGluZUxheWVyLCAjdGhpcmRMaW5lXG5cdFx0XHRcdHk6IEAuaGVpZ2h0LTI0XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0b3B0aW9uczpcblx0XHRcdFx0XHRkZWxheTogMVxuXHRcdFx0XHRcdHRpbWU6IDAuNFxuXHRcdFx0XHRcdGN1cnZlOiBcImVhc2Utb3V0XCJcblx0XHRcdEBfZ3JhZGllbnRIaWdobGlnaHQgPSBuZXcgQW5pbWF0aW9uIEBncmFkaWVudExheWVyLCAjR3JhZGllbnRcblx0XHRcdFx0eTogQWxpZ24uYm90dG9tKClcblx0XHRcdFx0b3B0aW9uczpcblx0XHRcdFx0XHRkZWxheTogMVxuXHRcdFx0XHRcdHRpbWU6IDAuNFxuXG5cdFx0QHVwZGF0ZVJlbW92ZUhpZ2hsaWdodEFuaW1hdGlvbnMgPSAtPlxuXHRcdFx0QF9jb250YWluZXJSZW1vdmVIaWdobGlnaHQgPSBuZXcgQW5pbWF0aW9uIEB0ZXh0Q29udGFpbmVyLCAjVGl0bGUgJiBsYWJlbFxuXHRcdFx0XHR5OiBALmhlaWdodC01NFxuXHRcdFx0XHRvcHRpb25zOlxuXHRcdFx0XHRcdHRpbWU6IDAuNVxuXHRcdFx0QF90aGlyZExpbmVSZW1vdmVIaWdobGlnaHQgPSBuZXcgQW5pbWF0aW9uIEB0aGlyZExpbmVMYXllciwgI3RoaXJkTGluZVxuXHRcdFx0XHR5OiBALmhlaWdodFxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdG9wdGlvbnM6XG5cdFx0XHRcdFx0dGltZTogMC40XG5cdFx0XHRcdFx0Y3VydmU6IFwiZWFzZS1vdXRcIlxuXHRcdFx0QF9ncmFkaWVudFJlbW92ZUhpZ2hsaWdodCA9IG5ldyBBbmltYXRpb24gQGdyYWRpZW50TGF5ZXIsICNHcmFkaWVudFxuXHRcdFx0XHRtYXhZOiBALm1heFkrMjVcblx0XHRcdFx0b3B0aW9uczpcblx0XHRcdFx0XHR0aW1lOiAwLjRcblxuXHRcdEB1cGRhdGVIaWdobGlnaHRBbmltYXRpb25zKClcblx0XHRAdXBkYXRlUmVtb3ZlSGlnaGxpZ2h0QW5pbWF0aW9ucygpXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyBFdmVudHNcblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdGRlbGV0ZSBAX19jb25zdHJ1Y3Rpb25cblxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgUHVibGljIE1ldGhvZHNcblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdGhpZ2hsaWdodDogKCkgLT5cblx0XHRAX2NvbnRhaW5lclJlbW92ZUhpZ2hsaWdodC5zdG9wKClcblx0XHRAX3RoaXJkTGluZVJlbW92ZUhpZ2hsaWdodC5zdG9wKClcblx0XHRAX2dyYWRpZW50UmVtb3ZlSGlnaGxpZ2h0LnN0b3AoKVxuXG5cdFx0QF9jb250YWluZXJIaWdobGlnaHQuc3RhcnQoKVxuXHRcdEBfdGhpcmRMaW5lSGlnaGxpZ2h0LnN0YXJ0KClcblx0XHRAX2dyYWRpZW50SGlnaGxpZ2h0LnN0YXJ0KClcblxuXHRyZW1vdmVIaWdobGlnaHQ6ICgpIC0+XG5cdFx0QF9jb250YWluZXJIaWdobGlnaHQuc3RvcCgpXG5cdFx0QF90aGlyZExpbmVIaWdobGlnaHQuc3RvcCgpXG5cdFx0QF9ncmFkaWVudEhpZ2hsaWdodC5zdG9wKClcblxuXHRcdEBfY29udGFpbmVyUmVtb3ZlSGlnaGxpZ2h0LnN0YXJ0KClcblx0XHRAX3RoaXJkTGluZVJlbW92ZUhpZ2hsaWdodC5zdGFydCgpXG5cdFx0QF9ncmFkaWVudFJlbW92ZUhpZ2hsaWdodC5zdGFydCgpXG5cblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIFByaXZhdGUgTWV0aG9kc1xuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0X3VwZGF0ZUhlaWdodDogKCB2YWx1ZSApIC0+XG5cdFx0QC5oZWlnaHQgPSB2YWx1ZVxuXHRcdEBncmFkaWVudExheWVyLm1heFkgPSB2YWx1ZSsyNVxuXHRcdEB0aGlyZExpbmVMYXllci55ID0gQC5oZWlnaHRcblx0XHRAdGV4dENvbnRhaW5lci55ID0gQC5oZWlnaHQtNTRcblxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgRGVmaW5pdGlvbnNcblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdCMgcHJpbnQgXCJzdGFydCBkZWZpbml0aW9uc1wiXG5cdEBkZWZpbmUgXCJ0aXRsZVwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEB0aXRsZUxheWVyLnRleHRcblx0XHRzZXQ6ICggdmFsdWUgKSAtPiBAdGl0bGVMYXllci50ZXh0ID0gdmFsdWUgaWYgQHRpdGxlTGF5ZXI/XG5cblx0QGRlZmluZSBcImxhYmVsXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQGxhYmVsTGF5ZXIudGV4dCBpZiBAbGFiZWxMYXllcj9cblx0XHQjIE5vdCBzdXJlIHdoeSB0aGlzIGlzIGhhcHBlbmluZyBidXQgSSB0aGluayB0aGUgTGF5ZXIgY2xhc3MgaXMgY2FwdHVyaW5nXG5cdFx0IyBsYWJlbCBhbmQgY2F1c2luZyBpdCB0byBjYWxsIHRoZSBnZXR0ZXIgYmVmb3JlIGxhYmVsTGF5ZXIgZXhpc3RzLlxuXHRcdHNldDogKCB2YWx1ZSApIC0+IEBsYWJlbExheWVyLnRleHQgPSB2YWx1ZSBpZiBAbGFiZWxMYXllcj9cblxuXHRAZGVmaW5lIFwidGhpcmRMaW5lXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQHRoaXJkTGluZUxheWVyLnRleHRcblx0XHRzZXQ6ICggdmFsdWUgKSAtPiBAdGhpcmRMaW5lTGF5ZXIudGV4dCA9IHZhbHVlIGlmIEB0aGlyZExpbmVMYXllcj9cblxuXHRAZGVmaW5lIFwibGFiZWxDb2xvclwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBsYWJlbExheWVyLmNvbG9yXG5cdFx0c2V0OiAoIHZhbHVlICkgLT4gQGxhYmVsTGF5ZXIuY29sb3IgPSB2YWx1ZSBpZiBAbGFiZWxMYXllcj9cblxuXHRkZWxldGUgQF9faW5zdGFuY2luZ1xuXHQjIHByaW50IFwiZW5kIGRlZmluaXRpb25zXCIiLCJjbGFzcyBleHBvcnRzLk5hdmlnYWJsZXMgZXh0ZW5kcyBMYXllclxuICAgIGNvbnN0cnVjdG9yOiAoIG9wdGlvbnM9e30gKSAtPlxuICAgICAgICBAX19jb25zdHJ1Y3Rpb24gPSB0cnVlXG4gICAgICAgIF8uYXNzaWduIG9wdGlvbnMsXG4gICAgICAgICAgICBhY3RpdmU6IGZhbHNlXG4gICAgICAgICAgICBsYXN0SGlnaGxpZ2h0OiB1bmRlZmluZWRcbiAgICAgICAgICAgIGhpZ2hsaWdodExheWVyOiB1bmRlZmluZWRcbiAgICAgICAgc3VwZXIgb3B0aW9uc1xuXG4gICAgICAgIF8uYXNzaWduIEAsXG4gICAgICAgICAgICBvdXRMZWZ0OiB1bmRlZmluZWRcblx0XHRcbiAgICAgICAgaWYgd2luZG93W1wibmF2aWdhYmxlc0FycmF5XCJdPyA9PSBmYWxzZVxuICAgICAgICAgICAgd2luZG93W1wibmF2aWdhYmxlc0FycmF5XCJdID0gW11cbiAgICAgICAgbmF2aWdhYmxlc0FycmF5LnB1c2goQClcblxuICAgICAgICBAdXBPdXRCZWhhdmlvdXIgPSBcIlwiXG4gICAgICAgIEBkb3duT3V0QmVoYXZpb3VyID0gXCJcIlxuICAgICAgICBAbGVmdE91dEJlaGF2aW91ciA9IFwiXCJcbiAgICAgICAgQHJpZ2h0T3V0QmVoYXZpb3VyID0gXCJcIlxuXG4gICAgICAgIEBvbiBcInVwT3V0XCIsICgpIC0+XG4gICAgICAgICAgICBAdXBPdXRCZWhhdmlvdXIoKSBpZiBAdXBPdXRCZWhhdmlvdXIgIT0gXCJcIlxuICAgICAgICBAb24gXCJyaWdodE91dFwiLCAoKSAtPlxuICAgICAgICAgICAgQHJpZ2h0T3V0QmVoYXZpb3VyKCkgaWYgQHJpZ2h0T3V0QmVoYXZpb3VyICE9IFwiXCJcbiAgICAgICAgQG9uIFwiZG93bk91dFwiLCAoKSAtPlxuICAgICAgICAgICAgQGRvd25PdXRCZWhhdmlvdXIoKSBpZiBAZG93bk91dEJlaGF2aW91ciAhPSBcIlwiXG4gICAgICAgIEBvbiBcImxlZnRPdXRcIiwgKCkgLT5cbiAgICAgICAgICAgIEBsZWZ0T3V0QmVoYXZpb3VyKCkgaWYgQGxlZnRPdXRCZWhhdmlvdXIgIT0gXCJcIlxuICAgIFxuICAgIF9hc3NpZ25IaWdobGlnaHQ6ICggbGF5ZXIgKSAtPlxuICAgICAgICBAaGlnaGxpZ2h0TGF5ZXIgPSBsYXllclxuXG4gICAgb25VcE91dDogKCBiZWhhdmlvdXIgKSAtPlxuICAgICAgICBAdXBPdXRCZWhhdmlvdXIgPSBiZWhhdmlvdXJcbiAgICBvblJpZ2h0T3V0OiAoIGJlaGF2aW91ciApIC0+XG4gICAgICAgIEByaWdodE91dEJlaGF2aW91ciA9IGJlaGF2aW91clxuICAgIG9uRG93bk91dDogKCBiZWhhdmlvdXIgKSAtPlxuICAgICAgICBAZG93bk91dEJlaGF2aW91ciA9IGJlaGF2aW91clxuICAgIG9uTGVmdE91dDogKCBiZWhhdmlvdXIgKSAtPlxuICAgICAgICBAbGVmdE91dEJlaGF2aW91ciA9IGJlaGF2aW91clxuXG5cbiAgICBAZGVmaW5lIFwiaGlnaGxpZ2h0XCIsXG4gICAgICAgIGdldDogLT4gcmV0dXJuIEBfaGlnaGxpZ2h0XG4gICAgICAgIHNldDogKCB2YWx1ZSApIC0+XG4gICAgICAgICAgICBAX2hpZ2hsaWdodCA9IHZhbHVlXG4gICAgXG4gICAgQGRlZmluZSBcInVwT3V0XCIsXG4gICAgICAgIGdldDogLT4gcmV0dXJuIEBfb3V0VXBcbiAgICAgICAgc2V0OiAoIHZhbHVlICkgLT5cbiAgICAgICAgICAgIHJldHVybiBpZiBAX19jb25zdHJ1Y3Rpb25cbiAgICAgICAgICAgIG5ld0JlaGF2aW91ciA9IHZhbHVlXG4gICAgICAgICAgICBAdXBPdXRCZWhhdmlvdXIgPSB2YWx1ZVxuICAgIEBkZWZpbmUgXCJyaWdodE91dFwiLFxuICAgICAgICBnZXQ6IC0+IHJldHVybiBAX291dHJpZ2h0XG4gICAgICAgIHNldDogKCB2YWx1ZSApIC0+XG4gICAgICAgICAgICByZXR1cm4gaWYgQF9fY29uc3RydWN0aW9uXG4gICAgICAgICAgICBuZXdCZWhhdmlvdXIgPSB2YWx1ZVxuICAgICAgICAgICAgQHJpZ2h0T3V0QmVoYXZpb3VyID0gdmFsdWVcbiAgICBAZGVmaW5lIFwiZG93bk91dFwiLFxuICAgICAgICBnZXQ6IC0+IHJldHVybiBAX291dERvd25cbiAgICAgICAgc2V0OiAoIHZhbHVlICkgLT5cbiAgICAgICAgICAgIHJldHVybiBpZiBAX19jb25zdHJ1Y3Rpb25cbiAgICAgICAgICAgIG5ld0JlaGF2aW91ciA9IHZhbHVlXG4gICAgICAgICAgICBAZG93bk91dEJlaGF2aW91ciA9IHZhbHVlXG4gICAgQGRlZmluZSBcImxlZnRPdXRcIixcbiAgICAgICAgZ2V0OiAtPiByZXR1cm4gQF9vdXRsZWZ0XG4gICAgICAgIHNldDogKCB2YWx1ZSApIC0+XG4gICAgICAgICAgICByZXR1cm4gaWYgQF9fY29uc3RydWN0aW9uXG4gICAgICAgICAgICBuZXdCZWhhdmlvdXIgPSB2YWx1ZVxuICAgICAgICAgICAgQGxlZnRPdXRCZWhhdmlvdXIgPSB2YWx1ZSIsInR2VXRpbHMgPSByZXF1aXJlIFwidHZVdGlsc1wiXG57IE5hdmlnYWJsZXMgfSA9IHJlcXVpcmUgXCJOYXZpZ2FibGVzXCJcblxuY2xhc3MgZXhwb3J0cy5NZW51IGV4dGVuZHMgTmF2aWdhYmxlc1xuXG5cdGNvbnN0cnVjdG9yOiAoIG9wdGlvbnM9e30gKSAtPlxuXG5cdFx0QF9fY29uc3RydWN0aW9uID0gdHJ1ZVxuXHRcdEBfX2luc3RhbmNpbmcgPSB0cnVlXG5cblx0XHRfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRtZW51SXRlbXM6IFsnTWVudSBPbmUnLCAnTWVudSBUd28nLCAnTWVudSBUaHJlZSddXG5cdFx0XHRjb250ZW50OiBbbGF5ZXJPbmUsIGxheWVyVHdvLCBsYXllclRocmVlXVxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAnJ1xuXHRcdHN1cGVyIG9wdGlvbnNcblxuXHRcdGRlbGV0ZSBAX19jb25zdHJ1Y3Rpb25cblxuXHRcdCMgcHJpbnQgb3B0aW9uc1xuXG5cdFx0bWVudU5hbWVzID0gb3B0aW9ucy5tZW51SXRlbXNcblx0XHRmb3IgbmFtZXMsIGkgaW4gbWVudU5hbWVzXG5cdFx0XHRpZiBuYW1lcyBpbnN0YW5jZW9mIExheWVyXG5cdFx0XHRcdG1lbnVMYXllciA9IG5hbWVzXG5cdFx0XHRcdG1lbnVMYXllci55ID0gNlxuXHRcdFx0XHRtZW51TGF5ZXIueCA9IC0yXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG1lbnVMYXllciA9IG5ldyBUZXh0TGF5ZXJcblx0XHRcdFx0QGhpZ2hsaWdodFkgPSBALnNjcmVlbkZyYW1lLnkgKyBtZW51TGF5ZXIuaGVpZ2h0LTVcblx0XHRcdF8uYXNzaWduIG1lbnVMYXllcixcblx0XHRcdFx0cGFyZW50OiBAXG5cdFx0XHRcdHRleHQ6IG5hbWVzXG5cdFx0XHRcdGNvbG9yOiBcIiNlYmViZWJcIlxuXHRcdFx0XHRmb250RmFtaWx5OiBcIkF2ZW5pci1saWdodFwiXG5cdFx0XHRcdGZvbnRTaXplOiAzMFxuXHRcdFx0XHRsZXR0ZXJTcGFjaW5nOiAwLjNcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIlwiXG5cdFx0XHRcdHg6IGlmIEAuY2hpbGRyZW5baS0xXT8gdGhlbiBALmNoaWxkcmVuW2ktMV0ubWF4WCArIDM5IGVsc2UgMFxuXHRcdFx0XHRjdXN0b206XG5cdFx0XHRcdFx0bWVudUNvbnRlbnQ6IG9wdGlvbnMuY29udGVudFtpXVxuXG5cdFx0XHQjIG1lbnVMYXllci5hZGRDaGlsZChvcHRpb25zLmNvbnRlbnRbaV0pIGlmIG9wdGlvbnMuY29udGVudFtpXT9cblx0XHRcdG9wdGlvbnMubWVudUl0ZW1zW2ldID0gbWVudUxheWVyXG5cdFx0XHRAaGlnaGxpZ2h0SW5kZXggPSAwXG5cblx0IyBwcmludCAnMSdcblx0QGRlZmluZSAnbWVudUl0ZW1zJyxcblx0XHRnZXQ6IC0+XHRyZXR1cm4gQC5jaGlsZHJlblxuXHRcdHNldDogKCB2YWx1ZSApIC0+XG5cdFx0XHRyZXR1cm4gaWYgQF9fY29uc3RydWN0aW9uXG5cdFx0XHRAbWVudUl0ZW1zID0gdmFsdWVcblxuXHRAZGVmaW5lICdjb250ZW50Jyxcblx0XHRnZXQ6IC0+IEBfZ2V0Q29udGVudCgpXG5cdFx0c2V0OiAoIHZhbHVlICkgLT4gaWYgQF9fY29uc3RydWN0aW9uPyB0aGVuIEBfc2V0Q29udGVudCggdmFsdWUgKVxuXG5cdGxheWVyT25lID0gbmV3IFRleHRMYXllclxuXHRcdG5hbWU6IFwiLlwiLCB5OiAxMDAsIHZpc2libGU6IGZhbHNlLCBiYWNrZ3JvdW5kQ29sb3I6IFwicmVkXCIsIHRleHQ6IFwiRGVmaW5lIHdpdGggYW4gYXJyYXkgaW4gTWVudS5jdXN0b20uY29udGVudFwiLCBjb2xvcjogXCJ3aGl0ZVwiXG5cdGxheWVyVHdvID0gbmV3IFRleHRMYXllclxuXHRcdG5hbWU6IFwiLlwiLCB5OiAxMDAsIHZpc2libGU6IGZhbHNlLCBiYWNrZ3JvdW5kQ29sb3I6IFwiYmx1ZVwiLCB0ZXh0OiBcIkRlZmluZSB3aXRoIGFuIGFycmF5IGluIE1lbnUuY3VzdG9tLmNvbnRlbnRcIiwgY29sb3I6IFwid2hpdGVcIlxuXHRsYXllclRocmVlID0gbmV3IFRleHRMYXllclxuXHRcdG5hbWU6IFwiLlwiLCB5OiAxMDAsIHZpc2libGU6IGZhbHNlLCBiYWNrZ3JvdW5kQ29sb3I6IFwiZ3JlZW5cIiwgdGV4dDogXCJEZWZpbmUgd2l0aCBhbiBhcnJheSBpbiBNZW51LmN1c3RvbS5jb250ZW50XCIsIGNvbG9yOiBcIndoaXRlXCJcblxuXHRfZ2V0Q29udGVudDogLT5cblx0XHRfY29udGVudCA9IFtdXG5cdFx0Zm9yIGNoaWxkIGluIEAuY2hpbGRyZW5cblx0XHRcdF9jb250ZW50LnB1c2goY2hpbGQuY3VzdG9tLm1lbnVDb250ZW50KVxuXHRcdHJldHVybiBfY29udGVudFxuXG5cdF9zZXRDb250ZW50OiAoIHZhbHVlICkgLT5cblx0XHRmb3IgY2hpbGQsIGkgaW4gQC5jaGlsZHJlblxuXHRcdFx0Y2hpbGQuY3VzdG9tLm1lbnVDb250ZW50LmRlc3Ryb3koKVxuXHRcdFx0Y2hpbGQuY3VzdG9tLm1lbnVDb250ZW50ID0gdmFsdWVbaV1cblx0XHRcdCMgY2hpbGQuYWRkQ2hpbGQoY2hpbGQuY3VzdG9tLm1lbnVDb250ZW50KVxuXG5cdF9tb3ZlSGlnaGxpZ2h0OiAoKSAtPlxuXHRcdEBoaWdobGlnaHRMYXllci5jdXJyZW50Q29udGV4dCA9IEBcblxuXHRfc2V0SW5kZXg6ICggaGlnaGxpZ2h0ZWRNZW51SW5kZXggKSAtPlxuXHRcdGlmIGhpZ2hsaWdodGVkTWVudUluZGV4ID09IHVuZGVmaW5lZFxuXHRcdFx0aGlnaGxpZ2h0ZWRNZW51SW5kZXggPSAwXG5cdFx0cmV0dXJuIGhpZ2hsaWdodGVkTWVudUluZGV4XG5cblx0cmVtb3ZlSGlnaGxpZ2h0OiAoKSAtPlxuXHRcdGZvciBjaGlsZCwgaSBpbiBALmNoaWxkcmVuXG5cdFx0XHRpZiBpID09IEBoaWdobGlnaHRJbmRleFxuXHRcdFx0XHRjaGlsZC5hbmltYXRlXG5cdFx0XHRcdFx0Y29sb3I6IHR2VXRpbHMud2hpdGVcblx0XHRcdGVsc2Vcblx0XHRcdFx0Y2hpbGQuYW5pbWF0ZVxuXHRcdFx0XHRcdGNvbG9yOiB0dlV0aWxzLmRhcmtHcmV5XG5cdFx0QC5oaWdobGlnaHRMYXllci5hbmltYXRlXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IHR2VXRpbHMud2hpdGVcblx0XHRmb3IgY2hpbGQgaW4gQC5oaWdobGlnaHRMYXllci5jaGlsZHJlblxuXHRcdFx0Y2hpbGQudmlzaWJsZSA9IGZhbHNlXG5cdFx0QC5oaWdobGlnaHRMYXllci52aXNpYmxlID0gdHJ1ZVxuXG5cblx0aGlnaGxpZ2h0OiAoIGhpZ2hsaWdodGVkTWVudUluZGV4ICkgLT5cblx0XHRpZiBoaWdobGlnaHRlZE1lbnVJbmRleCA9PSB1bmRlZmluZWQgdGhlbiBoaWdobGlnaHRlZE1lbnVJbmRleCA9IDBcblx0XHRpZiBALmNoaWxkcmVuP1xuXHRcdFx0Zm9yIGNoaWxkLCBpIGluIEAuY2hpbGRyZW5cblx0XHRcdFx0aWYgaSA9PSBoaWdobGlnaHRlZE1lbnVJbmRleFxuXHRcdFx0XHRcdGNoaWxkLmFuaW1hdGVcblx0XHRcdFx0XHRcdGNvbG9yOiB0dlV0aWxzLmJsdWVcblxuXHRcdFx0XHRcdGlmIGNoaWxkLmN1c3RvbS5tZW51Q29udGVudD9cblx0XHRcdFx0XHRcdGNoaWxkLmN1c3RvbS5tZW51Q29udGVudC52aXNpYmxlID0gdHJ1ZVxuXG5cdFx0XHRcdFx0aWYgQGhpZ2hsaWdodExheWVyP1xuXHRcdFx0XHRcdFx0Xy5hc3NpZ24gQGhpZ2hsaWdodExheWVyLFxuXHRcdFx0XHRcdFx0XHR3aWR0aDogMFxuXHRcdFx0XHRcdFx0XHR5OiBAaGlnaGxpZ2h0WVxuXHRcdFx0XHRcdFx0XHR4OiBjaGlsZC5zY3JlZW5GcmFtZS54ICsgY2hpbGQud2lkdGgvMlxuXHRcdFx0XHRcdFx0QGhpZ2hsaWdodExheWVyLmNoaWxkcmVuWzBdLndpZHRoID0gMFxuXHRcdFx0XHRcdFx0QGhpZ2hsaWdodExheWVyLmNoaWxkcmVuWzBdLmFuaW1hdGVcblx0XHRcdFx0XHRcdFx0d2lkdGg6IGNoaWxkLndpZHRoKzEwXG5cdFx0XHRcdFx0XHRAaGlnaGxpZ2h0TGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRcdFx0XHR3aWR0aDogY2hpbGQud2lkdGhcblx0XHRcdFx0XHRcdFx0eDogY2hpbGQuc2NyZWVuRnJhbWUueFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0Y2hpbGQuYW5pbWF0ZVxuXHRcdFx0XHRcdFx0Y29sb3I6IHR2VXRpbHMud2hpdGVcblxuXHRcdFx0XHRcdGlmIGNoaWxkLmN1c3RvbS5tZW51Q29udGVudD9cblx0XHRcdFx0XHRcdGNoaWxkLmN1c3RvbS5tZW51Q29udGVudC52aXNpYmxlID0gZmFsc2Vcblx0XHRcdEAuaGlnaGxpZ2h0TGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IHR2VXRpbHMuYmx1ZVxuXHRcdFx0Zm9yIGNoaWxkIGluIEAuaGlnaGxpZ2h0TGF5ZXIuY2hpbGRyZW5cblx0XHRcdFx0Y2hpbGQudmlzaWJsZSA9IHRydWVcblxuXHRcdFx0QGhpZ2hsaWdodEluZGV4ID0gaGlnaGxpZ2h0ZWRNZW51SW5kZXhcblx0XHRcdEBsYXN0SGlnaGxpZ2h0ID0gaGlnaGxpZ2h0ZWRNZW51SW5kZXhcblxuXHRtb3ZlUmlnaHQ6ICgpID0+XG5cdFx0aWYgQGhpZ2hsaWdodEluZGV4KzEgPCBALm1lbnVJdGVtcy5sZW5ndGhcblx0XHRcdEAuaGlnaGxpZ2h0KCBAaGlnaGxpZ2h0SW5kZXgrMSApXG5cdFx0ZWxzZSBAZW1pdChcInJpZ2h0T3V0XCIpXG5cdFx0QGxhc3RIaWdobGlnaHQgPSBAaGlnaGxpZ2h0SW5kZXhcblxuXHRtb3ZlTGVmdDogKCkgPT5cblx0XHRpZiBAaGlnaGxpZ2h0SW5kZXggPiAwXG5cdFx0XHRALmhpZ2hsaWdodCggQGhpZ2hsaWdodEluZGV4LTEgKVxuXHRcdGVsc2UgQGVtaXQoXCJsZWZ0T3V0XCIpXG5cdFx0QGxhc3RIaWdobGlnaHQgPSBAaGlnaGxpZ2h0SW5kZXhcblxuXHRtb3ZlVXA6ICgpID0+XG5cdFx0QGVtaXQoXCJ1cE91dFwiKVxuXG5cdG1vdmVEb3duOiAoKSA9PlxuXHRcdEBlbWl0KFwiZG93bk91dFwiKVxuXHQjID09PT09PT09PT09PT09PT09PT09PVxuXHQjIEluaXQiLCIjIEtleXNcbmV4cG9ydHMuYmFja3NwYWNlID0gOFxuZXhwb3J0cy50YWIgPSA5XG5leHBvcnRzLmVudGVyID0gMTNcbmV4cG9ydHMuc2hpZnQgPSAxNlxuZXhwb3J0cy5jdHJsID0gMTdcbmV4cG9ydHMuYWx0ID0gMThcblxuZXhwb3J0cy5jYXBzID0gMjBcbmV4cG9ydHMuZXNjYXBlID0gMjdcbmV4cG9ydHMucGFnZVVwID0gMzNcbmV4cG9ydHMucGFnZURvd24gPSAzNFxuXG5leHBvcnRzLmxlZnQgPSAzN1xuZXhwb3J0cy51cCA9IDM4XG5leHBvcnRzLnJpZ2h0ID0gMzlcbmV4cG9ydHMuZG93biA9IDQwXG5leHBvcnRzLmRlbGV0ZSA9IDQ2XG5cbmV4cG9ydHMuemVybyA9IDQ4XG5leHBvcnRzLm9uZSA9IDQ5XG5leHBvcnRzLnR3byA9IDUwXG5leHBvcnRzLnRocmVlID0gNTFcbmV4cG9ydHMuZm91ciA9IDUyXG5leHBvcnRzLmZpdmUgPSA1M1xuZXhwb3J0cy5zaXggPSA1NFxuZXhwb3J0cy5zZXZlbiA9IDU1XG5leHBvcnRzLmVpZ2h0ID0gNTZcbmV4cG9ydHMubmluZSA9IDU3XG5cbmV4cG9ydHMuYSA9IDY1XG5leHBvcnRzLmIgPSA2NlxuZXhwb3J0cy5jID0gNjdcbmV4cG9ydHMuZCA9IDY4XG5leHBvcnRzLmUgPSA2OVxuZXhwb3J0cy5mID0gNzBcbmV4cG9ydHMuZyA9IDcxXG5leHBvcnRzLmggPSA3MlxuZXhwb3J0cy5pID0gNzNcbmV4cG9ydHMuaiA9IDc0XG5leHBvcnRzLmsgPSA3NVxuZXhwb3J0cy5sID0gNzZcbmV4cG9ydHMubSA9IDc3XG5leHBvcnRzLm4gPSA3OFxuZXhwb3J0cy5vID0gNzlcbmV4cG9ydHMucCA9IDgwXG5leHBvcnRzLnEgPSA4MVxuZXhwb3J0cy5yID0gODJcbmV4cG9ydHMucyA9IDgzXG5leHBvcnRzLnQgPSA4NFxuZXhwb3J0cy51ID0gODVcbmV4cG9ydHMudiA9IDg2XG5leHBvcnRzLncgPSA4N1xuZXhwb3J0cy54ID0gODhcbmV4cG9ydHMueSA9IDg5XG5leHBvcnRzLnogPSA5MFxuXG5leHBvcnRzLm51bVplcm8gPSA5NlxuZXhwb3J0cy5udW1PbmUgPSA5N1xuZXhwb3J0cy5udW1Ud28gPSA5OFxuZXhwb3J0cy5udW1UaHJlZSA9IDk5XG5leHBvcnRzLm51bUZvdXIgPSAxMDBcbmV4cG9ydHMubnVtRml2ZSA9IDEwMVxuZXhwb3J0cy5udW1TaXggPSAxMDJcbmV4cG9ydHMubnVtU2V2ZW4gPSAxMDNcbmV4cG9ydHMubnVtRWlnaHQgPSAxMDRcbmV4cG9ydHMubnVtTmluZSA9IDEwNVxuXG5leHBvcnRzLmZPbmUgPSAxMTJcbmV4cG9ydHMuZlR3byA9IDExM1xuZXhwb3J0cy5mVGhyZWUgPSAxMTRcbmV4cG9ydHMuZkZvdXIgPSAxMTVcbmV4cG9ydHMuZkZpdmUgPSAxMTZcbmV4cG9ydHMuZlNpeCA9IDExN1xuZXhwb3J0cy5mU2V2ZW4gPSAxMThcbmV4cG9ydHMuZkVpZ2h0ID0gMTE5XG5leHBvcnRzLmZOaW5lID0gMTIwXG5leHBvcnRzLmZUZW4gPSAxMjFcblxuZXhwb3J0cy5zZW1pQ29sb24gPSAxODZcbmV4cG9ydHMuZXF1YWxTaWduID0gMTg3XG5leHBvcnRzLmNvbW1hID0gMTg4XG5leHBvcnRzLmRhc2ggPSAxODlcbmV4cG9ydHMucGVyaW9kID0gMTkwXG5leHBvcnRzLmZvcndhcmRTbGFzaCA9IDE5MVxuZXhwb3J0cy5vcGVuQnJhY2tldCA9IDIxOVxuZXhwb3J0cy5iYWNrU2xhc2ggPSAyMjBcbmV4cG9ydHMuY2xvc2VCcmFja2V0ID0gMjIxXG5leHBvcnRzLnNpbmdsZVF1b3RlID0gMjIyXG5cbmtleU1hcCA9IHt9XG5cbmV4cG9ydHMub25LZXkgPSAoa2V5LCBoYW5kbGVyLCB0aHJvdHRsZVRpbWUpIC0+XG4gICAgaWYgaGFuZGxlciAhPSB1bmRlZmluZWRcbiAgICAgICAga2V5TWFwW2tleV0gPSBVdGlscy50aHJvdHRsZSB0aHJvdHRsZVRpbWUsIGhhbmRsZXJcbiAgICBlbHNlXG4gICAgICAgIGtleU1hcFtrZXldID0gXCJcIlxuXG5leHBvcnRzLm9mZktleSA9IChrZXkpIC0+XG4gICAgZGVsZXRlIGtleU1hcFtrZXldXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyICdrZXlkb3duJywgKGV2ZW50KSAtPlxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVyID0ga2V5TWFwW2V2ZW50LmtleUNvZGVdXG4gICAgaWYgKGhhbmRsZXIpXG4gICAgICAgIGhhbmRsZXIoKSIsInR2VXRpbHMgPSByZXF1aXJlIFwidHZVdGlsc1wiXG5rID0gcmVxdWlyZSBcIktleWJvYXJkXCJcbmNsYXNzIGV4cG9ydHMuSGlnaGxpZ2h0IGV4dGVuZHMgTGF5ZXJcbiAgICBjb25zdHJ1Y3RvcjogKCBvcHRpb25zPXt9ICkgLT5cblxuICAgICAgICBfLmRlZmF1bHRzIEAsXG4gICAgICAgICAgICBmaXJzdEhpZ2hsaWdodDogXCJcIlxuICAgICAgICBzdXBlciBvcHRpb25zXG5cbiAgICAgICAgXy5hc3NpZ24gQCxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJcIlxuICAgICAgICAgICAgaW5pdDogZmFsc2VcblxuICAgICAgICBAY3VycmVudENvbnRleHQgPSBAZmlyc3RIaWdobGlnaHRcbiAgICAgICAgaWYgbmF2aWdhYmxlc0FycmF5P1xuICAgICAgICAgICAgaWYgQGN1cnJlbnRDb250ZXh0ID09IFwiXCJcbiAgICAgICAgICAgICAgICBuYXZpZ2FibGVzQXJyYXlbMF1cbiAgICAgICAgICAgICAgICBAY3VycmVudENvbnRleHQgPSBuYXZpZ2FibGVzQXJyYXlbMF1cbiAgICAgICAgICAgIGZvciBuYXYgaW4gbmF2aWdhYmxlc0FycmF5XG4gICAgICAgICAgICAgICAgaWYgbmF2IGluc3RhbmNlb2YgTWVudVxuICAgICAgICAgICAgICAgICAgICBuYXYuaGlnaGxpZ2h0TGF5ZXIgPSBuYXYuX2Fzc2lnbkhpZ2hsaWdodCggQC5fY3JlYXRlTWVudUhpZ2hsaWdodCggbmF2ICkgKVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgbmF2IGluc3RhbmNlb2YgQ2Fyb3VzZWwgb3IgbmF2IGluc3RhbmNlb2YgR3JpZFxuICAgICAgICAgICAgICAgICAgICBuYXYuaGlnaGxpZ2h0TGF5ZXIgPSBuYXYuX2Fzc2lnbkhpZ2hsaWdodCggQC5fY3JlYXRlVGlsZUhpZ2hsaWdodCgpIClcbiAgICAgICAgICAgICAgICBlbHNlIGlmIG5hdiBpbnN0YW5jZW9mIE5hdmlnYWJsZXNcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGF0J3MgZmluZSwgdGhpcyBpcyBhIGN1c3RvbSBlbGVtZW50IGFuZCBjYW4gbWFrZSBpdCdzIG93biBoaWdobGlnaHQgc3RhdGUuXCIpXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBuYXYuaGlnaGxpZ2h0P1xuICAgICAgICAgICAgICAgICAgICBuYXYuaGlnaGxpZ2h0KDApXG4gICAgICAgICAgICAgICAgZWxzZSB0aHJvdyBcIkFsbCBOYXZpZ2FibGVzIG11c3QgaGF2ZSBhIC5oaWdobGlnaHQoKSBmdW5jdGlvbiBhbmQgYSAucmVtb3ZlSGlnaGxpZ2h0KCkgZnVuY3Rpb24uXCJcblxuICAgICAgICAjwqBQbGFjZSBpbiByZXNldCBjb250ZXh0IG1ldGhvZFxuICAgICAgICBALnNldENvbnRleHQoIG5hdmlnYWJsZXNBcnJheVswXSApO1xuXG4gICAgX2NyZWF0ZU1lbnVIaWdobGlnaHQ6ICggbmF2ICkgLT5cbiAgICAgICAgQG1lbnVIaWdobGlnaHQgPSBuZXcgTGF5ZXJcbiAgICAgICAgICAgIHBhcmVudDogQFxuICAgICAgICAgICAgeTogbmF2LmhpZ2hsaWdodFlcbiAgICAgICAgICAgIHg6IG5hdi5jaGlsZHJlbltuYXYuaGlnaGxpZ2h0SW5kZXhdLnNjcmVlbkZyYW1lLnhcbiAgICAgICAgICAgIGhlaWdodDogMlxuICAgICAgICAgICAgd2lkdGg6IG5hdi5jaGlsZHJlblswXS53aWR0aCsxMFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0dlV0aWxzLmJsdWVcbiAgICAgICAgbWVudUhpZ2hsaWdodEdsb3cgPSBuZXcgTGF5ZXJcbiAgICAgICAgICAgIHBhcmVudDogQG1lbnVIaWdobGlnaHRcbiAgICAgICAgICAgIGhlaWdodDogNFxuICAgICAgICAgICAgeDogLTVcbiAgICAgICAgICAgIHk6IC0xXG4gICAgICAgICAgICBibHVyOiA3XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHR2VXRpbHMuYmx1ZVxuICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICBtZW51SGlnaGxpZ2h0R2xvdy5icmluZ1RvRnJvbnQoKVxuXG4gICAgICAgIG1lbnVIaWdobGlnaHRQdWxzZSA9IG5ldyBBbmltYXRpb25cbiAgICAgICAgICAgIGxheWVyOiBtZW51SGlnaGxpZ2h0R2xvd1xuICAgICAgICAgICAgcHJvcGVydGllczpcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICB0aW1lOiAyXG4gICAgICAgICAgICBjdXJ2ZTogXCJlYXNlLWluLW91dFwiXG5cbiAgICAgICAgbWVudUhpZ2hsaWdodFB1bHNlRmFkZSA9IG5ldyBBbmltYXRpb25cbiAgICAgICAgICAgIGxheWVyOiBtZW51SGlnaGxpZ2h0R2xvd1xuICAgICAgICAgICAgcHJvcGVydGllczpcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgICAgICB0aW1lOiAyXG4gICAgICAgICAgICBjdXJ2ZTogXCJlYXNlLWluLW91dFwiXG5cbiAgICAgICAgbWVudUhpZ2hsaWdodFB1bHNlLm9uKEV2ZW50cy5BbmltYXRpb25FbmQsIG1lbnVIaWdobGlnaHRQdWxzZUZhZGUuc3RhcnQpXG4gICAgICAgIG1lbnVIaWdobGlnaHRQdWxzZUZhZGUub24oRXZlbnRzLkFuaW1hdGlvbkVuZCwgbWVudUhpZ2hsaWdodFB1bHNlLnN0YXJ0KVxuICAgICAgICBtZW51SGlnaGxpZ2h0UHVsc2Uuc3RhcnQoKVxuICAgICAgICBtZW51SGlnaGxpZ2h0R2xvdy5ibHVyID0gN1xuXG4gICAgICAgIHJldHVybiBAbWVudUhpZ2hsaWdodFxuXG4gICAgX2NyZWF0ZVRpbGVIaWdobGlnaHQ6ICgpIC0+XG4gICAgICAgIEB0aWxlSGlnaGxpZ2h0ID0gbmV3IExheWVyXG4gICAgICAgICAgICBwYXJlbnQ6IEBcbiAgICAgICAgICAgIHdpZHRoOiAyMzBcbiAgICAgICAgICAgIGhlaWdodDogMTI5XG4gICAgICAgICAgICBib3JkZXJXaWR0aDogMlxuICAgICAgICAgICAgYm9yZGVyQ29sb3I6IHR2VXRpbHMuYmx1ZVxuICAgICAgICBAdGlsZUhpZ2hsaWdodC5zdHlsZS5iYWNrZ3JvdW5kID0gXCJcIlxuXG4gICAgICAgIHRpbGVHbG93ID0gQHRpbGVIaWdobGlnaHQuY29weSgpXG4gICAgICAgIF8uYXNzaWduIHRpbGVHbG93LFxuICAgICAgICAgICAgcGFyZW50OiBAdGlsZUhpZ2hsaWdodFxuICAgICAgICAgICAgc3R5bGU6IFwiYmFja2dyb3VuZFwiOlwiXCJcbiAgICAgICAgICAgIGJvcmRlcldpZHRoOiA1XG4gICAgICAgICAgICBibHVyOiA2XG4gICAgICAgICAgICBvcGFjaXR5OiAwXG5cbiAgICAgICAgQHRpbGVIaWdobGlnaHRQdWxzZSA9IG5ldyBBbmltYXRpb24gdGlsZUdsb3csXG4gICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICBvcHRpb25zOlxuICAgICAgICAgICAgICAgIHRpbWU6IDNcbiAgICAgICAgICAgICAgICBjdXJ2ZTogJ2Vhc2UtaW4tb3V0J1xuXG4gICAgICAgIEB0aWxlSGlnaGxpZ2h0UHVsc2VGYWRlID0gQHRpbGVIaWdobGlnaHRQdWxzZS5yZXZlcnNlKClcbiAgICAgICAgQHRpbGVIaWdobGlnaHRQdWxzZS5vcHRpb25zLmRlbGF5ID0gMVxuXG4gICAgICAgIEB0aWxlSGlnaGxpZ2h0UHVsc2Uub24oRXZlbnRzLkFuaW1hdGlvbkVuZCwgQHRpbGVIaWdobGlnaHRQdWxzZUZhZGUuc3RhcnQpXG4gICAgICAgIEB0aWxlSGlnaGxpZ2h0UHVsc2VGYWRlLm9uKEV2ZW50cy5BbmltYXRpb25FbmQsIEB0aWxlSGlnaGxpZ2h0UHVsc2Uuc3RhcnQpXG4gICAgICAgIEB0aWxlSGlnaGxpZ2h0UHVsc2Uuc3RhcnQoKVxuXG4gICAgICAgIHJldHVybiBAdGlsZUhpZ2hsaWdodFxuXG4gICAgc2V0Q29udGV4dDogKCBuZXdDb250ZXh0ICkgLT5cbiAgICAgICAgZm9yIG5hdiBpbiBuYXZpZ2FibGVzQXJyYXlcbiAgICAgICAgICAgIGlmIG5hdiAhPSBuZXdDb250ZXh0XG4gICAgICAgICAgICAgICAgbmF2LnJlbW92ZUhpZ2hsaWdodCgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbmF2LmhpZ2hsaWdodChuYXYubGFzdEhpZ2hsaWdodClcbiAgICAgICAgICAgICAgICBALmN1cnJlbnRDb250ZXh0ID0gbmF2XG5cbiAgICAgICAgaWYgbmV3Q29udGV4dC5tb3ZlVXA/ID09IGZhbHNlIHRoZW4gbmV3Q29udGV4dC5tb3ZlVXAgPSAtPiBuZXdDb250ZXh0LmVtaXQoXCJ1cE91dFwiKVxuICAgICAgICBpZiBuZXdDb250ZXh0Lm1vdmVSaWdodD8gPT0gZmFsc2UgdGhlbiBuZXdDb250ZXh0Lm1vdmVSaWdodCA9IC0+IG5ld0NvbnRleHQuZW1pdChcInJpZ2h0T3V0XCIpXG4gICAgICAgIGlmIG5ld0NvbnRleHQubW92ZURvd24/ID09IGZhbHNlIHRoZW4gbmV3Q29udGV4dC5tb3ZlRG93biA9IC0+IG5ld0NvbnRleHQuZW1pdChcImRvd25PdXRcIilcbiAgICAgICAgaWYgbmV3Q29udGV4dC5tb3ZlTGVmdD8gPT0gZmFsc2UgdGhlbiBuZXdDb250ZXh0Lm1vdmVMZWZ0ID0gLT4gbmV3Q29udGV4dC5lbWl0KFwibGVmdE91dFwiKVxuXG4gICAgICAgIGsub25LZXkoIGsucmlnaHQsIG5ld0NvbnRleHQubW92ZVJpZ2h0IClcbiAgICAgICAgay5vbktleSggay5sZWZ0LCBuZXdDb250ZXh0Lm1vdmVMZWZ0IClcbiAgICAgICAgay5vbktleSggay51cCwgbmV3Q29udGV4dC5tb3ZlVXAgKVxuICAgICAgICBrLm9uS2V5KCBrLmRvd24sIG5ld0NvbnRleHQubW92ZURvd24gKVxuXG4gICAgcmVtb3ZlSGlnaGxpZ2h0OiAoKSAtPlxuICAgICAgICBmb3IgbmF2IGluIG5hdmlnYWJsZXNBcnJheVxuICAgICAgICAgICAgbmF2LnJlbW92ZUhpZ2hsaWdodCgpXG4gICAgICAgICAgICBuYXYuaGlnaGxpZ2h0TGF5ZXIudmlzaWJsZSA9IGZhbHNlIGlmIG5hdi5oaWdobGlnaHRMYXllcj9cbiAgICAgICAgICAgIGsub25LZXkoIGsucmlnaHQsIHVuZGVmaW5lZCApXG4gICAgICAgICAgICBrLm9uS2V5KCBrLmxlZnQsIHVuZGVmaW5lZCApXG4gICAgICAgICAgICBrLm9uS2V5KCBrLnVwLCB1bmRlZmluZWQgKVxuICAgICAgICAgICAgay5vbktleSggay5kb3duLCB1bmRlZmluZWQgKSIsInsgUHJvZ3JhbW1lVGlsZSB9ID0gcmVxdWlyZSBcIlByb2dyYW1tZVRpbGVcIlxueyBOYXZpZ2FibGVzIH0gPSByZXF1aXJlIFwiTmF2aWdhYmxlc1wiXG5cbmNsYXNzIGV4cG9ydHMuR3JpZCBleHRlbmRzIE5hdmlnYWJsZXNcblx0Y29uc3RydWN0b3I6ICggb3B0aW9ucz17fSApIC0+XG5cdFx0QF9fY29uc3RydWN0aW9uID0gdHJ1ZVxuXHRcdEBfX2luc3RhbmNpbmcgPSB0cnVlXG5cdFx0Xy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0dGlsZVdpZHRoOiAyMzBcblx0XHRcdHRpbGVIZWlnaHQ6IDEyOVxuXHRcdFx0Z2FwczogOFxuXHRcdFx0bnVtYmVyT2ZUaWxlczogMzBcblx0XHRcdHRpbGVMYWJlbDogJ09uIE5vdydcblx0XHRcdGNvbHVtbnM6IDRcblx0XHRcdGRlYnVnOiBmYWxzZVxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRkZWxldGUgQF9fY29uc3RydWN0aW9uXG5cblx0XHRfLmFzc2lnbiBALFxuXHRcdFx0dGlsZVdpZHRoOiBvcHRpb25zLnRpbGVXaWR0aFxuXHRcdFx0dGlsZUhlaWdodDogb3B0aW9ucy50aWxlSGVpZ2h0XG5cdFx0XHRnYXBzOiBvcHRpb25zLmdhcHNcblx0XHRcdGNvbHVtbnM6IG9wdGlvbnMuY29sdW1uc1xuXHRcdFx0bnVtYmVyT2ZUaWxlczogb3B0aW9ucy5udW1iZXJPZlRpbGVzXG5cblx0XHRAZGVidWcgPSBvcHRpb25zLmRlYnVnXG5cdFx0I1NhZmUgem9uZVxuXHRcdEBmaXJzdFBvc2l0aW9uID0gb3B0aW9ucy54XG5cdFx0QGdhcHMgPSBvcHRpb25zLmdhcHNcblx0XHRAeFBvcyA9IDFcblx0XHRAeVBvcyA9IDFcblx0XHRAZXZlbnRzID0gW11cblxuXHRcdCMgZm9yIGkgaW4gWzAuLi5AbnVtYmVyT2ZUaWxlc11cblx0XHQjIFx0Y29uc29sZS5sb2coIFwiYWRkZWRcIiApXG5cdFx0IyBcdEBhZGRUaWxlKClcblx0XHRcblx0XHQjIEBfdXBkYXRlV2lkdGgoKVxuXHRcdCMgQF91cGRhdGVIZWlnaHQoIG9wdGlvbnMudGlsZUhlaWdodCApXG5cblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIFByaXZhdGUgTWV0aG9kc1xuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0IyBfdXBkYXRlSGVpZ2h0OiAoIHZhbHVlICkgLT5cblx0IyBcdEAuaGVpZ2h0ID0gdmFsdWVcblxuXHQjIF91cGRhdGVXaWR0aDogKCkgLT5cblx0IyBcdEAud2lkdGggPSAoQC50aWxlV2lkdGgrQC5nYXBzKSpALm51bWJlck9mVGlsZXMgaWYgQD9cblx0XG5cdCMgX3NldFRpbGVXaWR0aDogKCB2YWx1ZSApIC0+XG5cdCMgXHRmb3IgdGlsZSwgaSBpbiBALmNoaWxkcmVuXG5cdCMgXHRcdHRpbGUueCA9ICh2YWx1ZStAZ2FwcykgKiBpXG5cdCMgXHRcdHRpbGUud2lkdGggPSB2YWx1ZVxuXG5cdCMgX2FwcGx5VG9BbGxUaWxlczogKCB0YXNrLCB2YWx1ZSApIC0+XG5cdCMgXHRmb3IgdGlsZSwgaSBpbiBALmNoaWxkcmVuXG5cdCMgXHRcdGlmIHZhbHVlP1xuXHQjIFx0XHRcdHRhc2soIHRpbGUsIHZhbHVlIClcblx0IyBcdFx0ZWxzZVxuXHQjIFx0XHRcdHRhc2soIHRpbGUgKVxuXHRcblx0X3NldE51bWJlck9mVGlsZXM6ICggdGlsZXNObyApIC0+XG5cdFx0dGlsZURlbHRhID0gLShAbnVtYmVyT2ZUaWxlcyAtIHRpbGVzTm8pXG5cdFx0aWYgdGlsZURlbHRhID4gMFxuXHRcdFx0Zm9yIGkgaW4gWzAuLi50aWxlRGVsdGFdXG5cdFx0XHRcdEBhZGRUaWxlKClcblx0XHRlbHNlIGlmIHRpbGVEZWx0YSA8IDBcblx0XHRcdEByZW1vdmVUaWxlcyggLXRpbGVEZWx0YSApXG5cblx0X2FwcGx5RGF0YTogKCBkYXRhQXJyYXkgKSAtPlxuXHRcdGlmIEBkZWJ1ZyA9PSBmYWxzZVxuXHRcdFx0Zm9yIHRpbGUsIGkgaW4gQC5jaGlsZHJlblxuXHRcdFx0XHRpZiBkYXRhQXJyYXlbaV0/XG5cdFx0XHRcdFx0dGlsZS50aXRsZSA9IHR2VXRpbHMuaHRtbEVudGl0aWVzKCBkYXRhQXJyYXlbaV0udGl0bGUgKVxuXHRcdFx0XHRcdHRpbGUuaW1hZ2UgPSB0dlV0aWxzLmh0bWxFbnRpdGllcyggZGF0YUFycmF5W2ldLmltYWdlIClcblx0XHRcdFx0XHR0aWxlLmxhYmVsID0gdHZVdGlscy5odG1sRW50aXRpZXMoIGRhdGFBcnJheVtpXS5sYWJlbCApXG5cdFx0XHRcdFx0dGlsZS50aGlyZExpbmUgPSB0dlV0aWxzLmh0bWxFbnRpdGllcyggZGF0YUFycmF5W2ldLnRoaXJkTGluZSApXG5cdFx0ZWxzZSByZXR1cm5cblx0XG5cdF9sb2FkRXZlbnRzOiAoIGZlZWQgKSAtPlxuXHRcdGZvciBldmVudCwgaSBpbiBmZWVkLml0ZW1zXG5cdFx0XHRldmVudCA9IHtcblx0XHRcdFx0dGl0bGU6IGlmIGV2ZW50LmJyYW5kU3VtbWFyeT8gdGhlbiBldmVudC5icmFuZFN1bW1hcnkudGl0bGUgZWxzZSBldmVudC50aXRsZVxuXHRcdFx0XHRpbWFnZTogdHZVdGlscy5maW5kSW1hZ2VCeUlEKGV2ZW50LmlkKVxuXHRcdFx0XHR0aGlyZExpbmU6IGlmIGV2ZW50LnNlcmllc1N1bW1hcnk/IHRoZW4gZXZlbnQuc2VyaWVzU3VtbWFyeS50aXRsZSArIFwiLCBcIiArIGV2ZW50LnRpdGxlIGVsc2UgZXZlbnQuc2hvcnRTeW5vcHNpc1xuXHRcdFx0XHRsYWJlbDogaWYgZXZlbnQub25EZW1hbmRTdW1tYXJ5PyB0aGVuIHR2VXRpbHMuZW50aXRsZW1lbnRGaW5kZXIoZXZlbnQub25EZW1hbmRTdW1tYXJ5KSBlbHNlIFwiXCJcblx0XHRcdH1cblx0XHRcdEBldmVudHNbaV0gPSAoIGV2ZW50IClcblxuXHQjIF9tb3ZlSGlnaGxpZ2h0OiAoIGNoaWxkSW5kZXggKSA9PlxuXHQjIFx0aWYgQGhpZ2hsaWdodExheWVyPyA9PSBmYWxzZVxuXHQjIFx0XHRyZXR1cm5cblx0IyBcdHhQb3MgPSBjaGlsZEluZGV4KiggQGdhcHMrQHRpbGVXaWR0aCApICsgQGZpcnN0UG9zaXRpb25cblx0IyBcdGlmIEBoaWdobGlnaHRMYXllci5zY3JlZW5GcmFtZS55ID09IEAuc2NyZWVuRnJhbWUueVxuXHQjIFx0XHRAaGlnaGxpZ2h0TGF5ZXIuYW5pbWF0ZVxuXHQjIFx0XHRcdHg6IHhQb3MgXG5cdCMgXHRlbHNlXG5cdCMgXHRcdEBoaWdobGlnaHRMYXllci54ID0geFBvcyBcblx0IyBcdFx0QGhpZ2hsaWdodExheWVyLnkgPSBALnNjcmVlbkZyYW1lLnlcblxuXHQjIFx0QGZvY3VzSW5kZXggPSBjaGlsZEluZGV4XG5cdFxuXHQjIF9tb3ZlQ2Fyb3VzZWw6ICggdGlsZUluZGV4ICkgLT5cblx0IyBcdGlmIEBoaWdobGlnaHRMYXllcj8gPT0gZmFsc2Vcblx0IyBcdFx0cmV0dXJuXG5cdCMgXHRjYXJvdXNlbExlZnQuc3RvcCgpIGlmIGNhcm91c2VsTGVmdD9cblx0IyBcdGNhcm91c2VsTGVmdCA9IG5ldyBBbmltYXRpb24gQCxcblx0IyBcdFx0eDogLSgoQHRpbGVXaWR0aCtAZ2FwcykqQGNhcm91c2VsSW5kZXgpICsgQGZpcnN0UG9zaXRpb25cblx0IyBcdGNhcm91c2VsTGVmdC5zdGFydCgpXG5cdCMgXHRALnNlbGVjdCh0aWxlSW5kZXgpLmhpZ2hsaWdodCgpXG5cblx0IyAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgIyBQdWJsaWMgTWV0aG9kc1xuXHQjICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRhZGRUaWxlOiAoIHRpbGUgKSA9PlxuXHRcdGNvbnNvbGUubG9nKCBAIClcblx0XHRsYXN0VGlsZUluZGV4ID0gQC5jaGlsZHJlbi5sZW5ndGhcblx0XHRyb3dObyA9IE1hdGguZmxvb3IobGFzdFRpbGVJbmRleC9AY29sdW1ucykgIyByb3dOdW1iZXJcblx0XHRmdWxsVGlsZVdpZHRoID0gQHRpbGVXaWR0aCtAZ2Fwc1xuXHRcdEB3aWR0aCA9IGZ1bGxUaWxlV2lkdGggKiBAY29sdW1uc1xuXHRcdHhQb3NpdGlvbiA9IGZ1bGxUaWxlV2lkdGgqbGFzdFRpbGVJbmRleCAtIEB3aWR0aCpyb3dOb1xuXHRcdHlQb3NpdGlvbiA9IHJvd05vKihAdGlsZUhlaWdodCtAZ2Fwcylcblx0XHRpZiB0aWxlID09IHVuZGVmaW5lZFxuXHRcdFx0dGlsZSA9IG5ldyBQcm9ncmFtbWVUaWxlXG5cdFx0XHRcdHBhcmVudDogQFxuXHRcdFx0XHR3aWR0aDogQHRpbGVXaWR0aFxuXHRcdFx0XHRoZWlnaHQ6IEB0aWxlSGVpZ2h0XG5cdFx0XHRcdG1ldGE6IEBtZXRhXG5cdFx0XHRcdGltYWdlOiBAaW1hZ2Vcblx0XHRcdFx0dGl0bGU6IEB0aXRsZVxuXHRcdFx0XHR0aGlyZExpbmU6IEB0aGlyZExpbmVcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0dGlsZS54ID0geFBvc2l0aW9uXG5cdFx0XHR0aWxlLnkgPSB5UG9zaXRpb25cblx0XHRcdGZvciB0aWxlcywgaSBpbiBALmNoaWxkcmVuXG5cdFx0XHRcdHRpbGVzLmRpc2FwcGVhci5zdG9wKClcblx0XHRcdFx0dGlsZXMuYXBwZWFyLnN0YXJ0KClcblx0XHRcdHRpbGUudGlsZUFuaW1hdGlvbiA9IHRpbGUuYW5pbWF0ZVxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFxuXHQjIHJlbW92ZVRpbGVzOiAoIG51bWJlck9mVGlsZXMgKSA9PlxuXHQjIFx0Zm9yIGkgaW4gWzAuLi5udW1iZXJPZlRpbGVzXVxuXHQjIFx0XHRsYXN0VGlsZUluZGV4ID0gQC5jaGlsZHJlbi5sZW5ndGgtMVxuXHQjIFx0XHRALmNoaWxkcmVuW2xhc3RUaWxlSW5kZXhdLm9wYWNpdHkgPSAwXG5cdCMgXHRcdEAuY2hpbGRyZW5bbGFzdFRpbGVJbmRleF0uZGVzdHJveSgpXG5cblx0IyBzZWxlY3Q6ICggeFBvcywgeVBvcyApIC0+XG5cdCMgXHRyZXR1cm4gQGNoaWxkcmVuWyh4UG9zKnlQb3MpLTFdXG5cdFxuXHRoaWdobGlnaHQ6ICggeFBvcywgeVBvcyApIC0+XG5cdFx0IyBpZiBAaGlnaGxpZ2h0TGF5ZXI/XG5cdFx0IyBcdEAuc2VsZWN0KCB0aWxlSW5kZXggKS5oaWdobGlnaHQoKVxuXHRcdCMgXHRAaGlnaGxpZ2h0TGF5ZXIuaGVpZ2h0ID0gQC50aWxlSGVpZ2h0XG5cdFx0IyBcdEBoaWdobGlnaHRMYXllci53aWR0aCA9IEAudGlsZVdpZHRoXG5cdFx0IyBcdGZvciBjaGlsZCwgaSBpbiBAaGlnaGxpZ2h0TGF5ZXIuY2hpbGRyZW5cblx0XHQjIFx0XHRjaGlsZC5oZWlnaHQgPSBALnRpbGVIZWlnaHRcblx0XHQjIFx0XHRjaGlsZC53aWR0aCA9IEAudGlsZVdpZHRoXG5cdFx0IyBcdEAuX21vdmVIaWdobGlnaHQoIEBmb2N1c0luZGV4IClcblx0XHQjIFx0QGhpZ2hsaWdodExheWVyLnZpc2libGUgPSB0cnVlXG5cdFx0Y29uc29sZS5sb2coXCJoaWdobGlnaHQgXCIgKyB4UG9zICsgXCIgfCBcIiArIHlQb3MpXG5cdFxuXHRyZW1vdmVIaWdobGlnaHQ6ICgpIC0+XG5cdFx0IyBALnNlbGVjdChAbGFzdEhpZ2hsaWdodCkucmVtb3ZlSGlnaGxpZ2h0KClcblx0XHQjIEBoaWdobGlnaHRMYXllci52aXNpYmxlID0gZmFsc2VcbiAgICAgICAgY29uc29sZS5sb2coXCJyZW1vdmUgaGlnaGxpZ2h0XCIpXG5cblx0IyBtb3ZlUmlnaHQ6ID0+XG5cdCMgXHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXgrQGNhcm91c2VsSW5kZXhcblx0IyBcdGlmIEBmb2N1c0luZGV4IDwgQHJpZ2h0UGFnZUJvdW5kYXJ5IG9yIFxuXHQjIFx0dG90YWxJbmRleCA9PSBAbnVtYmVyT2ZUaWxlcy0yXG5cdCMgXHRcdEAuc2VsZWN0KCB0b3RhbEluZGV4ICkucmVtb3ZlSGlnaGxpZ2h0KClcblx0IyBcdFx0QGZvY3VzSW5kZXgrK1xuXHQjIFx0XHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXggKyBAY2Fyb3VzZWxJbmRleFxuXHQjIFx0XHRALmhpZ2hsaWdodCggdG90YWxJbmRleCApXG5cdCMgXHRlbHNlIGlmIEBmb2N1c0luZGV4ID49IEByaWdodFBhZ2VCb3VuZGFyeSBhbmQgdG90YWxJbmRleCA8IEBudW1iZXJPZlRpbGVzLTJcblx0IyBcdFx0QC5zZWxlY3QodG90YWxJbmRleCkucmVtb3ZlSGlnaGxpZ2h0KClcblx0IyBcdFx0QGNhcm91c2VsSW5kZXgrK1xuXHQjIFx0XHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXgrQGNhcm91c2VsSW5kZXhcblx0IyBcdFx0QC5fbW92ZUNhcm91c2VsKCB0b3RhbEluZGV4IClcblx0IyBcdGVsc2UgQGVtaXQoXCJyaWdodE91dFwiKVxuXHQjIFx0QGxhc3RIaWdobGlnaHQgPSB0b3RhbEluZGV4XG5cdFxuXHQjIG1vdmVMZWZ0OiA9PlxuXHQjIFx0dG90YWxJbmRleCA9IEBmb2N1c0luZGV4K0BjYXJvdXNlbEluZGV4XG5cdCMgXHRpZiBAZm9jdXNJbmRleCA+IEBsZWZ0UGFnZUJvdW5kYXJ5IG9yIFxuXHQjIFx0dG90YWxJbmRleCA9PSAxXG5cdCMgXHRcdEAuc2VsZWN0KCB0b3RhbEluZGV4ICkucmVtb3ZlSGlnaGxpZ2h0KClcblx0IyBcdFx0QGZvY3VzSW5kZXgtLVxuXHQjIFx0XHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXggKyBAY2Fyb3VzZWxJbmRleFxuXHQjIFx0XHRALmhpZ2hsaWdodCggdG90YWxJbmRleCApXG5cdCMgXHRlbHNlIGlmIEBmb2N1c0luZGV4ID49IEBsZWZ0UGFnZUJvdW5kYXJ5IGFuZCB0b3RhbEluZGV4ID4gMVxuXHQjIFx0XHRALnNlbGVjdCggdG90YWxJbmRleCApLnJlbW92ZUhpZ2hsaWdodCgpXG5cdCMgXHRcdEBjYXJvdXNlbEluZGV4LS1cblx0IyBcdFx0dG90YWxJbmRleCA9IEBmb2N1c0luZGV4K0BjYXJvdXNlbEluZGV4XG5cdCMgXHRcdEAuX21vdmVDYXJvdXNlbCggdG90YWxJbmRleCApXG5cdCMgXHRlbHNlIEBlbWl0KFwibGVmdE91dFwiKVxuXHQjIFx0QGxhc3RIaWdobGlnaHQgPSB0b3RhbEluZGV4XG5cdFxuXHQjIG1vdmVVcDogKCkgPT5cblx0IyBcdEBlbWl0KFwidXBPdXRcIilcblxuXHQjIG1vdmVEb3duOiAoKSA9PlxuXHQjIFx0QGVtaXQoXCJkb3duT3V0XCIpXG5cblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIEluaXRcblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcblx0XG5cblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIERlZmluaXRpb25zXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHQjIEBkZWZpbmUgJ3RpbGVXaWR0aCcsXG5cdCMgXHRnZXQ6IC0+IEAuc2VsZWN0KDApLndpZHRoIGlmIEAuc2VsZWN0KCk/XG5cdCMgXHRzZXQ6ICggdmFsdWUgKSAtPlxuXHQjIFx0XHRyZXR1cm4gaWYgQF9faW5zdGFuY2luZ1xuXHQjIFx0XHRAX3NldFRpbGVXaWR0aCggdmFsdWUgKSBpZiBAP1xuXHQjIEBkZWZpbmUgJ3RpbGVIZWlnaHQnLFxuXHQjIFx0Z2V0OiAtPiBALnNlbGVjdCgwKS5oZWlnaHQgaWYgQC5zZWxlY3QoMCk/XG5cdCMgXHRzZXQ6ICggdmFsdWUgKSAtPlxuXHQjIFx0XHRyZXR1cm4gaWYgQF9fY29uc3RydWN0aW9uXG5cdCMgXHRcdEAuX3VwZGF0ZUhlaWdodCh2YWx1ZSlcblx0QGRlZmluZSAnbnVtYmVyT2ZUaWxlcycsXG5cdFx0Z2V0OiAtPiBALmNoaWxkcmVuLmxlbmd0aFxuXHRcdHNldDogKCB2YWx1ZSApIC0+XG5cdFx0XHRyZXR1cm4gaWYgQF9fY29uc3RydWN0aW9uXG5cdFx0XHRAX3NldE51bWJlck9mVGlsZXMoIHZhbHVlIClcblx0XG5cdCMgQGRlZmluZSAnd2lkdGgnLFxuXHQjIFx0Z2V0OiAtPiBAX3dpZHRoXG5cdCMgXHRzZXQ6ICggdmFsdWUgKSAtPiBAX3VwZGF0ZVdpZHRoIGlmIEA/XG5cblx0ZGVsZXRlIEBfX2luc3RhbmNpbmciLCJ7IFByb2dyYW1tZVRpbGUgfSA9IHJlcXVpcmUgXCJQcm9ncmFtbWVUaWxlXCJcbnsgTmF2aWdhYmxlcyB9ID0gcmVxdWlyZSBcIk5hdmlnYWJsZXNcIlxuXG5jbGFzcyBleHBvcnRzLkNhcm91c2VsIGV4dGVuZHMgTmF2aWdhYmxlc1xuXHRjb25zdHJ1Y3RvcjogKCBvcHRpb25zPXt9ICkgLT5cblx0XHRAX19jb25zdHJ1Y3Rpb24gPSB0cnVlXG5cdFx0QF9faW5zdGFuY2luZyA9IHRydWVcblx0XHRfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHR0aWxlV2lkdGg6IDI4MFxuXHRcdFx0dGlsZUhlaWdodDogMTU3XG5cdFx0XHRoZWlnaHQ6IG9wdGlvbnMudGlsZUhlaWdodFxuXHRcdFx0Z2FwczogOFxuXHRcdFx0bnVtYmVyT2ZUaWxlczogNVxuXHRcdFx0dGlsZUxhYmVsOiAnT24gTm93J1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXG5cdFx0XHRkZWJ1ZzogZmFsc2Vcblx0XHRzdXBlciBvcHRpb25zXG5cdFx0ZGVsZXRlIEBfX2NvbnN0cnVjdGlvblxuXG5cdFx0Xy5hc3NpZ24gQCxcblx0XHRcdGhlaWdodDogb3B0aW9ucy50aWxlSGVpZ2h0XG5cdFx0XHR0aWxlV2lkdGg6IG9wdGlvbnMudGlsZVdpZHRoXG5cdFx0XHR0aWxlSGVpZ2h0OiBvcHRpb25zLnRpbGVIZWlnaHRcblx0XHRcdGdhcHM6IG9wdGlvbnMuZ2Fwc1xuXHRcdFx0Zm9jdXNJbmRleDogMFxuXHRcdFx0Y2Fyb3VzZWxJbmRleDogMFxuXHRcdFxuXHRcdEBkZWJ1ZyA9IG9wdGlvbnMuZGVidWdcblx0XHQjU2FmZSB6b25lXG5cdFx0QGZpcnN0UG9zaXRpb24gPSBvcHRpb25zLnhcblx0XHRAZnVsbFRpbGVzVmlzaWJsZSA9IF8uZmxvb3IoIFNjcmVlbi53aWR0aCAvIChvcHRpb25zLnRpbGVXaWR0aCtvcHRpb25zLmdhcHMpIClcblx0XHRAcmlnaHRQYWdlQm91bmRhcnkgPSBAZnVsbFRpbGVzVmlzaWJsZSAtIDEgLSAxICNBY2NvdW50aW5nIGZvciAwXG5cdFx0QGxlZnRQYWdlQm91bmRhcnkgPSAxXG5cdFx0QGdhcHMgPSBvcHRpb25zLmdhcHNcblx0XHRAbGFzdEhpZ2hsaWdodCA9IDBcblx0XHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdCMgTGF5ZXJzXG5cdFx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRcblx0XHRAZXZlbnRzID0gW11cblx0XHRmb3IgaSBpbiBbMC4uLm9wdGlvbnMubnVtYmVyT2ZUaWxlc11cblx0XHRcdEBhZGRUaWxlKClcblx0XHRcblx0XHRAX3VwZGF0ZVdpZHRoKClcblx0XHRAX3VwZGF0ZUhlaWdodCggb3B0aW9ucy50aWxlSGVpZ2h0IClcblxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgRXZlbnRzXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRcdEBvbiBcImNoYW5nZTp3aWR0aFwiLCBAX3VwZGF0ZVdpZHRoXG5cdFx0QG9uIFwiY2hhbmdlOmhlaWdodFwiLCBAX3VwZGF0ZUhlaWdodFxuXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyBQcml2YXRlIE1ldGhvZHNcblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdF91cGRhdGVIZWlnaHQ6ICggdmFsdWUgKSAtPlxuXHRcdEAuaGVpZ2h0ID0gdmFsdWVcblx0XHRmb3IgY2hpbGQgaW4gQC5jaGlsZHJlblxuXHRcdFx0Y2hpbGQuaGVpZ2h0ID0gdmFsdWVcblxuXHRfdXBkYXRlV2lkdGg6ICgpIC0+XG5cdFx0QC53aWR0aCA9IChALnRpbGVXaWR0aCtALmdhcHMpKkAubnVtYmVyT2ZUaWxlcyBpZiBAP1xuXHRcblx0X3NldFRpbGVXaWR0aDogKCB2YWx1ZSApIC0+XG5cdFx0Zm9yIHRpbGUsIGkgaW4gQC5jaGlsZHJlblxuXHRcdFx0dGlsZS54ID0gKHZhbHVlK0BnYXBzKSAqIGlcblx0XHRcdHRpbGUud2lkdGggPSB2YWx1ZVxuXG5cdF9hcHBseVRvQWxsVGlsZXM6ICggdGFzaywgdmFsdWUgKSAtPlxuXHRcdGZvciB0aWxlLCBpIGluIEAuY2hpbGRyZW5cblx0XHRcdGlmIHZhbHVlP1xuXHRcdFx0XHR0YXNrKCB0aWxlLCB2YWx1ZSApXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRhc2soIHRpbGUgKVxuXHRcblx0X3NldE51bWJlck9mVGlsZXM6ICggdGlsZXNObyApIC0+XG5cdFx0dGlsZURlbHRhID0gLShAbnVtYmVyT2ZUaWxlcyAtIHRpbGVzTm8pXG5cdFx0aWYgdGlsZURlbHRhID4gMFxuXHRcdFx0Zm9yIGkgaW4gWzAuLi50aWxlRGVsdGFdXG5cdFx0XHRcdEBhZGRUaWxlKClcblx0XHRlbHNlIGlmIHRpbGVEZWx0YSA8IDBcblx0XHRcdEByZW1vdmVUaWxlcyggLXRpbGVEZWx0YSApXG5cblx0X2FwcGx5RGF0YTogKCBkYXRhQXJyYXkgKSAtPlxuXHRcdGlmIEBkZWJ1ZyA9PSBmYWxzZVxuXHRcdFx0Zm9yIHRpbGUsIGkgaW4gQC5jaGlsZHJlblxuXHRcdFx0XHRpZiBkYXRhQXJyYXlbaV0/XG5cdFx0XHRcdFx0dGlsZS50aXRsZSA9IHR2VXRpbHMuaHRtbEVudGl0aWVzKCBkYXRhQXJyYXlbaV0udGl0bGUgKVxuXHRcdFx0XHRcdHRpbGUuaW1hZ2UgPSB0dlV0aWxzLmh0bWxFbnRpdGllcyggZGF0YUFycmF5W2ldLmltYWdlIClcblx0XHRcdFx0XHR0aWxlLmxhYmVsID0gdHZVdGlscy5odG1sRW50aXRpZXMoIGRhdGFBcnJheVtpXS5sYWJlbCApXG5cdFx0XHRcdFx0dGlsZS50aGlyZExpbmUgPSB0dlV0aWxzLmh0bWxFbnRpdGllcyggZGF0YUFycmF5W2ldLnRoaXJkTGluZSApXG5cdFx0ZWxzZSByZXR1cm5cblx0XG5cdF9sb2FkRXZlbnRzOiAoIGZlZWQgKSAtPlxuXHRcdGZvciBldmVudCwgaSBpbiBmZWVkLml0ZW1zXG5cdFx0XHRldmVudCA9IHtcblx0XHRcdFx0dGl0bGU6IGlmIGV2ZW50LmJyYW5kU3VtbWFyeT8gdGhlbiBldmVudC5icmFuZFN1bW1hcnkudGl0bGUgZWxzZSBldmVudC50aXRsZVxuXHRcdFx0XHRpbWFnZTogdHZVdGlscy5maW5kSW1hZ2VCeUlEKGV2ZW50LmlkKVxuXHRcdFx0XHR0aGlyZExpbmU6IGlmIGV2ZW50LnNlcmllc1N1bW1hcnk/IHRoZW4gZXZlbnQuc2VyaWVzU3VtbWFyeS50aXRsZSArIFwiLCBcIiArIGV2ZW50LnRpdGxlIGVsc2UgZXZlbnQuc2hvcnRTeW5vcHNpc1xuXHRcdFx0XHRsYWJlbDogaWYgZXZlbnQub25EZW1hbmRTdW1tYXJ5PyB0aGVuIHR2VXRpbHMuZW50aXRsZW1lbnRGaW5kZXIoZXZlbnQub25EZW1hbmRTdW1tYXJ5KSBlbHNlIFwiXCJcblx0XHRcdH1cblx0XHRcdEBldmVudHNbaV0gPSAoIGV2ZW50IClcblxuXHRfbW92ZUhpZ2hsaWdodDogKCBjaGlsZEluZGV4ICkgPT5cblx0XHRpZiBAaGlnaGxpZ2h0TGF5ZXI/ID09IGZhbHNlXG5cdFx0XHRyZXR1cm5cblx0XHRpZiBAZmlyc3RQb3NpdGlvbj8gdGhlbiBleHRyYSA9IEBmaXJzdFBvc2l0aW9uIGVsc2UgZXh0cmEgPSAwXG5cdFx0eFBvcyA9IGNoaWxkSW5kZXgqKCBAZ2FwcytAdGlsZVdpZHRoICkgKyBleHRyYVxuXHRcdGlmIEBoaWdobGlnaHRMYXllci5zY3JlZW5GcmFtZS55ID09IEAuc2NyZWVuRnJhbWUueVxuXHRcdFx0QGhpZ2hsaWdodExheWVyLmFuaW1hdGVcblx0XHRcdFx0eDogeFBvcyBcblx0XHRlbHNlXG5cdFx0XHRAaGlnaGxpZ2h0TGF5ZXIueCA9IHhQb3MgXG5cdFx0XHRAaGlnaGxpZ2h0TGF5ZXIueSA9IEAuc2NyZWVuRnJhbWUueVxuXG5cdFx0QGZvY3VzSW5kZXggPSBjaGlsZEluZGV4XG5cdFxuXHRfbW92ZUNhcm91c2VsOiAoIHRpbGVJbmRleCApIC0+XG5cdFx0aWYgQGhpZ2hsaWdodExheWVyPyA9PSBmYWxzZVxuXHRcdFx0cmV0dXJuXG5cdFx0Y2Fyb3VzZWxMZWZ0LnN0b3AoKSBpZiBjYXJvdXNlbExlZnQ/XG5cdFx0Y2Fyb3VzZWxMZWZ0ID0gbmV3IEFuaW1hdGlvbiBALFxuXHRcdFx0eDogLSgoQHRpbGVXaWR0aCtAZ2FwcykqQGNhcm91c2VsSW5kZXgpICsgQGZpcnN0UG9zaXRpb25cblx0XHRjYXJvdXNlbExlZnQuc3RhcnQoKVxuXHRcdEAuc2VsZWN0KHRpbGVJbmRleCkuaGlnaGxpZ2h0KClcblxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgUHVibGljIE1ldGhvZHNcblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdGFkZFRpbGU6ICggdGlsZSApID0+XG5cdFx0bGFzdFRpbGVJbmRleCA9IEAuY2hpbGRyZW4ubGVuZ3RoXG5cdFx0eFBvc2l0aW9uID0gKCBAdGlsZVdpZHRoICsgQGdhcHMgKSAqIGxhc3RUaWxlSW5kZXhcblx0XHRpZiB0aWxlID09IHVuZGVmaW5lZFxuXHRcdFx0dGlsZSA9IG5ldyBQcm9ncmFtbWVUaWxlXG5cdFx0XHRcdHBhcmVudDogQFxuXHRcdFx0XHQjIG5hbWU6IFwiLlwiXG5cdFx0XHRcdHg6IGlmIHhQb3NpdGlvbiA9PSB1bmRlZmluZWQgdGhlbiAwIGVsc2UgeFBvc2l0aW9uXG5cdFx0XHRcdHdpZHRoOiBAdGlsZVdpZHRoXG5cdFx0XHRcdGhlaWdodDogQHRpbGVIZWlnaHRcblx0XHRcdFx0bWV0YTogQG1ldGFcblx0XHRcdFx0aW1hZ2U6IEBpbWFnZVxuXHRcdFx0XHR0aXRsZTogQHRpdGxlXG5cdFx0XHRcdHRoaXJkTGluZTogQHRoaXJkTGluZVxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cblx0XHRcdGZvciB0aWxlcywgaSBpbiBALmNoaWxkcmVuXG5cdFx0XHRcdHRpbGVzLmRpc2FwcGVhci5zdG9wKClcblx0XHRcdFx0dGlsZXMuYXBwZWFyLnN0YXJ0KClcblxuXHRcdFx0dGlsZS50aWxlQW5pbWF0aW9uID0gdGlsZS5hbmltYXRlXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XG5cdHJlbW92ZVRpbGVzOiAoIG51bWJlck9mVGlsZXMgKSA9PlxuXHRcdGZvciBpIGluIFswLi4ubnVtYmVyT2ZUaWxlc11cblx0XHRcdGxhc3RUaWxlSW5kZXggPSBALmNoaWxkcmVuLmxlbmd0aC0xXG5cdFx0XHRALmNoaWxkcmVuW2xhc3RUaWxlSW5kZXhdLm9wYWNpdHkgPSAwXG5cdFx0XHRALmNoaWxkcmVuW2xhc3RUaWxlSW5kZXhdLmRlc3Ryb3koKVxuXG5cdHNlbGVjdDogKCBpbmRleCApIC0+XG5cdFx0cmV0dXJuIEBjaGlsZHJlbltpbmRleF1cblx0XG5cdGhpZ2hsaWdodDogKCB0aWxlSW5kZXggKSAtPlxuXHRcdGlmIEBoaWdobGlnaHRMYXllcj9cblx0XHRcdEAuc2VsZWN0KCB0aWxlSW5kZXggKS5oaWdobGlnaHQoKVxuXHRcdFx0QGhpZ2hsaWdodExheWVyLmhlaWdodCA9IEAudGlsZUhlaWdodFxuXHRcdFx0QGhpZ2hsaWdodExheWVyLndpZHRoID0gQC50aWxlV2lkdGhcblx0XHRcdGZvciBjaGlsZCwgaSBpbiBAaGlnaGxpZ2h0TGF5ZXIuY2hpbGRyZW5cblx0XHRcdFx0Y2hpbGQuaGVpZ2h0ID0gQC50aWxlSGVpZ2h0XG5cdFx0XHRcdGNoaWxkLndpZHRoID0gQC50aWxlV2lkdGhcblx0XHRcdEAuX21vdmVIaWdobGlnaHQoIEBmb2N1c0luZGV4IClcblx0XHRcdEBoaWdobGlnaHRMYXllci52aXNpYmxlID0gdHJ1ZVxuXHRcblx0cmVtb3ZlSGlnaGxpZ2h0OiAoKSAtPlxuXHRcdEAuc2VsZWN0KEBsYXN0SGlnaGxpZ2h0KS5yZW1vdmVIaWdobGlnaHQoKVxuXHRcdEBoaWdobGlnaHRMYXllci52aXNpYmxlID0gZmFsc2VcblxuXHRtb3ZlUmlnaHQ6ID0+XG5cdFx0dG90YWxJbmRleCA9IEBmb2N1c0luZGV4K0BjYXJvdXNlbEluZGV4XG5cdFx0aWYgQGZvY3VzSW5kZXggPCBAcmlnaHRQYWdlQm91bmRhcnkgb3IgXG5cdFx0dG90YWxJbmRleCA9PSBAbnVtYmVyT2ZUaWxlcy0yXG5cdFx0XHRALnNlbGVjdCggdG90YWxJbmRleCApLnJlbW92ZUhpZ2hsaWdodCgpXG5cdFx0XHRAZm9jdXNJbmRleCsrXG5cdFx0XHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXggKyBAY2Fyb3VzZWxJbmRleFxuXHRcdFx0QC5oaWdobGlnaHQoIHRvdGFsSW5kZXggKVxuXHRcdGVsc2UgaWYgQGZvY3VzSW5kZXggPj0gQHJpZ2h0UGFnZUJvdW5kYXJ5IGFuZCB0b3RhbEluZGV4IDwgQG51bWJlck9mVGlsZXMtMlxuXHRcdFx0QC5zZWxlY3QodG90YWxJbmRleCkucmVtb3ZlSGlnaGxpZ2h0KClcblx0XHRcdEBjYXJvdXNlbEluZGV4Kytcblx0XHRcdHRvdGFsSW5kZXggPSBAZm9jdXNJbmRleCtAY2Fyb3VzZWxJbmRleFxuXHRcdFx0QC5fbW92ZUNhcm91c2VsKCB0b3RhbEluZGV4IClcblx0XHRlbHNlIEBlbWl0KFwicmlnaHRPdXRcIilcblx0XHRAbGFzdEhpZ2hsaWdodCA9IHRvdGFsSW5kZXhcblx0XG5cdG1vdmVMZWZ0OiA9PlxuXHRcdHRvdGFsSW5kZXggPSBAZm9jdXNJbmRleCtAY2Fyb3VzZWxJbmRleFxuXHRcdGlmIEBmb2N1c0luZGV4ID4gQGxlZnRQYWdlQm91bmRhcnkgb3IgXG5cdFx0dG90YWxJbmRleCA9PSAxXG5cdFx0XHRALnNlbGVjdCggdG90YWxJbmRleCApLnJlbW92ZUhpZ2hsaWdodCgpXG5cdFx0XHRAZm9jdXNJbmRleC0tXG5cdFx0XHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXggKyBAY2Fyb3VzZWxJbmRleFxuXHRcdFx0QC5oaWdobGlnaHQoIHRvdGFsSW5kZXggKVxuXHRcdGVsc2UgaWYgQGZvY3VzSW5kZXggPj0gQGxlZnRQYWdlQm91bmRhcnkgYW5kIHRvdGFsSW5kZXggPiAxXG5cdFx0XHRALnNlbGVjdCh0b3RhbEluZGV4KS5yZW1vdmVIaWdobGlnaHQoKVxuXHRcdFx0QGNhcm91c2VsSW5kZXgtLVxuXHRcdFx0dG90YWxJbmRleCA9IEBmb2N1c0luZGV4K0BjYXJvdXNlbEluZGV4XG5cdFx0XHRALl9tb3ZlQ2Fyb3VzZWwoIHRvdGFsSW5kZXggKVxuXHRcdGVsc2Vcblx0XHRcdEBlbWl0KFwibGVmdE91dFwiKVxuXHRcdEBsYXN0SGlnaGxpZ2h0ID0gdG90YWxJbmRleFxuXHRcblx0bW92ZVVwOiAoKSA9PlxuXHRcdEBlbWl0KFwidXBPdXRcIilcblxuXHRtb3ZlRG93bjogKCkgPT5cblx0XHRAZW1pdChcImRvd25PdXRcIilcblxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgSW5pdFxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFxuXHRcblxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgRGVmaW5pdGlvbnNcblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdCMgQGRlZmluZSAndGlsZVdpZHRoJyxcblx0IyBcdGdldDogLT4gQC5zZWxlY3QoMCkud2lkdGggaWYgQC5zZWxlY3QoKT9cblx0IyBcdHNldDogKCB2YWx1ZSApIC0+XG5cdCMgXHRcdHJldHVybiBpZiBAX19pbnN0YW5jaW5nXG5cdCMgXHRcdEBfc2V0VGlsZVdpZHRoKCB2YWx1ZSApIGlmIEA/XG5cdCMgQGRlZmluZSAndGlsZUhlaWdodCcsXG5cdCMgXHRnZXQ6IC0+IEAuc2VsZWN0KDApLmhlaWdodCBpZiBALnNlbGVjdCgwKT9cblx0IyBcdHNldDogKCB2YWx1ZSApIC0+XG5cdCMgXHRcdHJldHVybiBpZiBAX19jb25zdHJ1Y3Rpb25cblx0IyBcdFx0QC5fdXBkYXRlSGVpZ2h0KHZhbHVlKVxuXHRAZGVmaW5lICdudW1iZXJPZlRpbGVzJyxcblx0XHRnZXQ6IC0+IEAuY2hpbGRyZW4ubGVuZ3RoXG5cdFx0c2V0OiAoIHZhbHVlICkgLT5cblx0XHRcdHJldHVybiBpZiBAX19jb25zdHJ1Y3Rpb25cblx0XHRcdEBfc2V0TnVtYmVyT2ZUaWxlcyggdmFsdWUgKVxuXHRcblx0IyBAZGVmaW5lICd3aWR0aCcsXG5cdCMgXHRnZXQ6IC0+IEBfd2lkdGhcblx0IyBcdHNldDogKCB2YWx1ZSApIC0+IEBfdXBkYXRlV2lkdGggaWYgQD9cblxuXHRkZWxldGUgQF9faW5zdGFuY2luZyIsInsgTmF2aWdhYmxlcyB9ID0gcmVxdWlyZSBcIk5hdmlnYWJsZXNcIlxudHZVdGlscyA9IHJlcXVpcmUgXCJ0dlV0aWxzXCJcblxuY2xhc3MgZXhwb3J0cy5CdXR0b25zIGV4dGVuZHMgTmF2aWdhYmxlc1xuXHRjb25zdHJ1Y3RvcjogKCBvcHRpb25zID17fSApIC0+XG5cdFx0Xy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0aGVpZ2h0OiA0NlxuXHRcdFx0Ym9yZGVyUmFkaXVzOiAzXG5cdFx0XHRidXR0b25XaWR0aDogMjAwXG5cdFx0XHRnYXBzOiAxNFxuXHRcdFx0aXRlbXM6IFtcIkJ1dHRvbiAxXCIsIFwiQnV0dG9uIDJcIiwgXCJCdXR0b24gM1wiXVxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRcblx0XHRfLmFzc2lnbiBALFxuXHRcdFx0YnV0dG9uV2lkdGg6IG9wdGlvbnMuYnV0dG9uV2lkdGhcblx0XHRcdGdhcHM6IG9wdGlvbnMuZ2Fwc1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIlwiXG5cblx0XHRmb3IgYnV0dG9uVGV4dCwgaSBpbiBvcHRpb25zLml0ZW1zXG5cdFx0XHRAYnV0dG9uQm9yZGVyID0gbmV3IExheWVyXG5cdFx0XHRcdGJvcmRlckNvbG9yOiBcIiM5Q0FBQkNcIlxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiXCJcblx0XHRcdFx0aGVpZ2h0OiA0NlxuXHRcdFx0XHRib3JkZXJSYWRpdXM6IDNcblx0XHRcdFx0Ym9yZGVyV2lkdGg6IDFcblx0XHRcdFx0d2lkdGg6IEBidXR0b25XaWR0aFxuXHRcdFx0XHR4OiAoQGJ1dHRvbldpZHRoK0BnYXBzKSppXG5cdFx0XHRcdHBhcmVudDogQFxuXG5cdFx0XHRidXR0b25UZXh0ID0gbmV3IFRleHRMYXllclxuXHRcdFx0XHRwYXJlbnQ6IEBidXR0b25Cb3JkZXJcblx0XHRcdFx0dGV4dDogYnV0dG9uVGV4dFxuXHRcdFx0XHRjb2xvcjogdHZVdGlscy53aGl0ZVxuXHRcdFx0XHRmb250RmFtaWx5OiBcIkF2ZW5pci1saWdodFwiXG5cdFx0XHRcdGZvbnRTaXplOiAyMFxuXHRcdFx0XHRsZXR0ZXJTcGFjaW5nOiAwLjNcblx0XHRcdFx0eTogQWxpZ24uY2VudGVyKDIpXG5cdFx0XHRcdHg6IEFsaWduLmNlbnRlcigpXG5cblx0XHRAaGlnaGxpZ2h0TGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRcdEBsYXN0SGlnaGxpZ2h0ID0gMFxuXHRcblx0aGlnaGxpZ2h0OiAoIG5ld0luZGV4ICkgLT5cblx0XHRAY2hpbGRyZW5bIG5ld0luZGV4IF0uYmFja2dyb3VuZENvbG9yID0gdHZVdGlscy5kYXJrQmx1ZVxuXHRcdEBsYXN0SGlnaGxpZ2h0ID0gbmV3SW5kZXhcblx0cmVtb3ZlSGlnaGxpZ2h0OiAoKSAtPlxuXHRcdEBjaGlsZHJlblsgQGxhc3RIaWdobGlnaHQgXS5iYWNrZ3JvdW5kQ29sb3IgPSBcIlwiXG5cdG1vdmVSaWdodDogKCkgPT5cblx0XHRpZiBAbGFzdEhpZ2hsaWdodCA8IEBjaGlsZHJlbi5sZW5ndGgtMVxuXHRcdFx0QC5yZW1vdmVIaWdobGlnaHQoKVxuXHRcdFx0QC5oaWdobGlnaHQoQGxhc3RIaWdobGlnaHQrMSlcblx0XHRlbHNlIEBlbWl0KFwicmlnaHRPdXRcIilcblx0bW92ZUxlZnQ6ICgpID0+XG5cdFx0aWYgQGxhc3RIaWdobGlnaHQgPiAwXG5cdFx0XHRALnJlbW92ZUhpZ2hsaWdodCgpXG5cdFx0XHRALmhpZ2hsaWdodChAbGFzdEhpZ2hsaWdodC0xKVxuXHRcdGVsc2UgQGVtaXQoXCJsZWZ0T3V0XCIpIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFXQUE7QURBQSxJQUFBLG1CQUFBO0VBQUE7Ozs7QUFBRSxhQUFlLE9BQUEsQ0FBUSxZQUFSOztBQUNqQixPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVI7O0FBRUosT0FBTyxDQUFDOzs7RUFDQSxpQkFBRSxPQUFGO0FBQ1osUUFBQTs7TUFEYyxVQUFTOzs7O0lBQ3ZCLENBQUMsQ0FBQyxRQUFGLENBQVcsT0FBWCxFQUNDO01BQUEsTUFBQSxFQUFRLEVBQVI7TUFDQSxZQUFBLEVBQWMsQ0FEZDtNQUVBLFdBQUEsRUFBYSxHQUZiO01BR0EsSUFBQSxFQUFNLEVBSE47TUFJQSxLQUFBLEVBQU8sQ0FBQyxVQUFELEVBQWEsVUFBYixFQUF5QixVQUF6QixDQUpQO0tBREQ7SUFNQSx5Q0FBTSxPQUFOO0lBRUEsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQ0M7TUFBQSxXQUFBLEVBQWEsT0FBTyxDQUFDLFdBQXJCO01BQ0EsSUFBQSxFQUFNLE9BQU8sQ0FBQyxJQURkO01BRUEsZUFBQSxFQUFpQixFQUZqQjtLQUREO0FBS0E7QUFBQSxTQUFBLDZDQUFBOztNQUNDLElBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsS0FBQSxD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
