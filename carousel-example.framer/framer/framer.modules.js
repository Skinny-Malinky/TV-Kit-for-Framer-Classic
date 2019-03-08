require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Buttons":[function(require,module,exports){
var Navigables, strUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Navigables = require("Navigables").Navigables;

strUtils = require("strUtils");

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
        color: strUtils.white,
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
    this.children[newIndex].backgroundColor = strUtils.darkBlue;
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


},{"Navigables":"Navigables","strUtils":"strUtils"}],"Carousel":[function(require,module,exports){
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
          tile.title = strUtils.htmlEntities(dataArray[i].title);
          tile.image = strUtils.htmlEntities(dataArray[i].image);
          tile.label = strUtils.htmlEntities(dataArray[i].label);
          results.push(tile.thirdLine = strUtils.htmlEntities(dataArray[i].thirdLine));
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
        image: strUtils.findImageByID(event.id),
        thirdLine: event.seriesSummary != null ? event.seriesSummary.title + ", " + event.title : event.shortSynopsis,
        label: event.onDemandSummary != null ? strUtils.entitlementFinder(event.onDemandSummary) : ""
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
          tile.title = strUtils.htmlEntities(dataArray[i].title);
          tile.image = strUtils.htmlEntities(dataArray[i].image);
          tile.label = strUtils.htmlEntities(dataArray[i].label);
          results.push(tile.thirdLine = strUtils.htmlEntities(dataArray[i].thirdLine));
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
        image: strUtils.findImageByID(event.id),
        thirdLine: event.seriesSummary != null ? event.seriesSummary.title + ", " + event.title : event.shortSynopsis,
        label: event.onDemandSummary != null ? strUtils.entitlementFinder(event.onDemandSummary) : ""
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
var k, strUtils,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

strUtils = require("strUtils");

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
      backgroundColor: strUtils.blue
    });
    menuHighlightGlow = new Layer({
      parent: this.menuHighlight,
      height: 4,
      x: -5,
      y: -1,
      blur: 7,
      backgroundColor: strUtils.blue,
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
      borderColor: strUtils.blue
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


},{"Keyboard":"Keyboard","strUtils":"strUtils"}],"Keyboard":[function(require,module,exports){
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
var Navigables, strUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

strUtils = require("strUtils");

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
          color: strUtils.white
        });
      } else {
        child.animate({
          color: strUtils.darkGrey
        });
      }
    }
    this.highlightLayer.animate({
      backgroundColor: strUtils.white
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
            color: strUtils.blue
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
            color: strUtils.white
          });
          if (child.custom.menuContent != null) {
            child.custom.menuContent.visible = false;
          }
        }
      }
      this.highlightLayer.animate({
        backgroundColor: strUtils.blue
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


},{"Navigables":"Navigables","strUtils":"strUtils"}],"Navigables":[function(require,module,exports){
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
var strUtils,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

strUtils = require("strUtils");

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
    strUtils.breakLetter(textLayers);
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


},{"strUtils":"strUtils"}],"TVKit":[function(require,module,exports){
var Buttons, Carousel, Grid, Highlight, Menu, Navigables, ProgrammeTile, strUtils;

require("moreutils");

Framer.Defaults.Animation = {
  time: 0.3
};

Canvas.backgroundColor = '#1f1f1f';

strUtils = require("strUtils");

window.strUtils = strUtils;

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


},{"Buttons":"Buttons","Carousel":"Carousel","Grid":"Grid","Highlight":"Highlight","Menu":"Menu","Navigables":"Navigables","ProgrammeTile":"ProgrammeTile","moreutils":"moreutils","strUtils":"strUtils"}],"moreutils":[function(require,module,exports){

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


},{}],"strUtils":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2Nhcm91c2VsLWV4YW1wbGUuZnJhbWVyL21vZHVsZXMvc3RyVXRpbHMuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc2ZyYXNlci9kZXYvZnJhbWVyL1RWLVByb3RvdHlwaW5nLVRvb2xraXQvY2Fyb3VzZWwtZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9tb3JldXRpbHMuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc2ZyYXNlci9kZXYvZnJhbWVyL1RWLVByb3RvdHlwaW5nLVRvb2xraXQvY2Fyb3VzZWwtZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9UVktpdC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9zZnJhc2VyL2Rldi9mcmFtZXIvVFYtUHJvdG90eXBpbmctVG9vbGtpdC9jYXJvdXNlbC1leGFtcGxlLmZyYW1lci9tb2R1bGVzL1Byb2dyYW1tZVRpbGUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc2ZyYXNlci9kZXYvZnJhbWVyL1RWLVByb3RvdHlwaW5nLVRvb2xraXQvY2Fyb3VzZWwtZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9OYXZpZ2FibGVzLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2Nhcm91c2VsLWV4YW1wbGUuZnJhbWVyL21vZHVsZXMvTWVudS5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9zZnJhc2VyL2Rldi9mcmFtZXIvVFYtUHJvdG90eXBpbmctVG9vbGtpdC9jYXJvdXNlbC1leGFtcGxlLmZyYW1lci9tb2R1bGVzL0tleWJvYXJkLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2Nhcm91c2VsLWV4YW1wbGUuZnJhbWVyL21vZHVsZXMvSGlnaGxpZ2h0LmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2Nhcm91c2VsLWV4YW1wbGUuZnJhbWVyL21vZHVsZXMvR3JpZC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9zZnJhc2VyL2Rldi9mcmFtZXIvVFYtUHJvdG90eXBpbmctVG9vbGtpdC9jYXJvdXNlbC1leGFtcGxlLmZyYW1lci9tb2R1bGVzL0Nhcm91c2VsLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NmcmFzZXIvZGV2L2ZyYW1lci9UVi1Qcm90b3R5cGluZy1Ub29sa2l0L2Nhcm91c2VsLWV4YW1wbGUuZnJhbWVyL21vZHVsZXMvQnV0dG9ucy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09XG4jIExpc3Qgb2YgZGVzaXJlZCBoZWxwZXJzXG4jID09PT09PT09PT09PT09PT09PT09PT09PVxuIyAqIFxuXG4jIENvbG91cnNcbmV4cG9ydHMuYmx1ZSA9IFwiIzFENUFEMFwiXG5leHBvcnRzLmRhcmtCbHVlID0gXCIjMEY1MzkxXCJcbmV4cG9ydHMud2hpdGUgPSBcIiNmZmZcIlxuZXhwb3J0cy5kYXJrR3JleSA9IFwiIzNBM0EzQVwiXG5cbmV4cG9ydHMubGl2ZUZlZWQgPSAoIGlkICkgLT5cblx0Y2hhbm5lbCA9IFtcImh0dHA6Ly9hLmZpbGVzLmJiY2kuY28udWsvbWVkaWEvbGl2ZS9tYW5pZmVzdG8vYXVkaW9fdmlkZW8vc2ltdWxjYXN0L2hscy91ay9hYnJfaGR0di9hay9iYmNfb25lX2hkLm0zdThcIixcImh0dHA6Ly9hLmZpbGVzLmJiY2kuY28udWsvbWVkaWEvbGl2ZS9tYW5pZmVzdG8vYXVkaW9fdmlkZW8vc2ltdWxjYXN0L2hscy91ay9hYnJfaGR0di9hay9iYmNfdHdvX2hkLm0zdThcIixcImh0dHA6Ly9hLmZpbGVzLmJiY2kuY28udWsvbWVkaWEvbGl2ZS9tYW5pZmVzdG8vYXVkaW9fdmlkZW8vc2ltdWxjYXN0L2hscy91ay9hYnJfaGR0di9hay9iYmNfZm91cl9oZC5tM3U4XCIsXCJodHRwOi8vYS5maWxlcy5iYmNpLmNvLnVrL21lZGlhL2xpdmUvbWFuaWZlc3RvL2F1ZGlvX3ZpZGVvL3NpbXVsY2FzdC9obHMvdWsvYWJyX2hkdHYvYWsvY2JlZWJpZXNfaGQubTN1OFwiLFwiaHR0cDovL2EuZmlsZXMuYmJjaS5jby51ay9tZWRpYS9saXZlL21hbmlmZXN0by9hdWRpb192aWRlby9zaW11bGNhc3QvaGxzL3VrL2Ficl9oZHR2L2FrL2JiY19uZXdzX2NoYW5uZWxfaGQubTN1OFwiLCBcImh0dHA6Ly9hLmZpbGVzLmJiY2kuY28udWsvbWVkaWEvbGl2ZS9tYW5pZmVzdG8vYXVkaW9fdmlkZW8vc2ltdWxjYXN0L2hscy91ay9hYnJfaGR0di9hay9iYmNfb25lX3Njb3RsYW5kX2hkLm0zdThcIl1cblx0aWYgaWQgPT0gdW5kZWZpbmVkIHRoZW4gaWQgPSAwXG5cdHdpbmRvd1tcImxpdmVGZWVkXCJdID0gbmV3IFZpZGVvTGF5ZXJcblx0XHRuYW1lOiBcImxpdmVGZWVkXCJcblx0XHR2aWRlbzogaWYgdHlwZW9mIGlkID09ICdudW1iZXInIHRoZW4gY2hhbm5lbFtpZF0gZWxzZSBpZFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRcdHNpemU6IFNjcmVlbi5zaXplXG5cdGxpdmVGZWVkLnBsYXllci5wbGF5KClcblx0bGl2ZUZlZWQucGxheWVyLnZvbHVtZSA9IDBcblxuZXhwb3J0cy5iaWdCdWNrID0gLT5cblx0d2luZG93W1wiYmlnQnVja1wiXSA9IG5ldyBWaWRlb0xheWVyXG5cdFx0dmlkZW86IFwiaHR0cDovL211bHRpcGxhdGZvcm0tZi5ha2FtYWloZC5uZXQvaS9tdWx0aS93aWxsL2J1bm55L2JpZ19idWNrX2J1bm55Xyw2NDB4MzYwXzQwMCw2NDB4MzYwXzcwMCw2NDB4MzYwXzEwMDAsOTUweDU0MF8xNTAwLC5mNHYuY3NtaWwvaW5kZXhfM19hdi5tM3U4XCJcblx0XHRzaXplOiBTY3JlZW4uc2l6ZVxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRiaWdCdWNrLnBsYXllci5wbGF5KClcblx0YmlnQnVjay5wbGF5ZXIudm9sdW1lID0gMFxuXG5cbiMgRnJhbWVyIHRydW5jYXRlcyBvbiB3b3JkcyBieSBkZWZhdWx0LiBUaGlzIGZvcmNlcyBGcmFtZXIgdG8gdHJ1bmNhdGUgaW5kaXZpZHVhbCBjaGFyYWN0ZXJzLlxuIyBZb3UgY2FuIHBhc3MgYW4gaW5kaXZpZHVhbCBsYXllciBvciBhbiBhcnJheSBvZiBsYXllcnMuXG5leHBvcnRzLmJyZWFrTGV0dGVyID0gKCBsYXllciApIC0+XG5cdGlmIGxheWVyIGluc3RhbmNlb2YgT2JqZWN0XG5cdFx0Zm9yIGNoaWxkLCBpIGluIGxheWVyXG5cdFx0XHRjaGlsZC5zdHlsZSA9IFxuXHRcdFx0XHRcIndvcmQtYnJlYWtcIiA6IFwiYnJlYWstYWxsXCJcblx0ZWxzZVxuXHRcdGxheWVyLnN0eWxlID0gXG5cdFx0XHRcIndvcmQtYnJlYWtcIiA6IFwiYnJlYWstYWxsXCJcblxuZXhwb3J0cy5odG1sRW50aXRpZXMgPSAoc3RyKSAtPlxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoXCImYW1wO1wiLCAnJicpLnJlcGxhY2UoXCImbHQ7XCIsIFwiPFwiKS5yZXBsYWNlKFwiJmd0O1wiLCBcIj5cIikucmVwbGFjZShcIiZxdW90O1wiLCAnXCInKS5yZXBsYWNlKFwiJmFwb3M7XCIsIFwiJ1wiKS5yZXBsYWNlKFwiJmNlbnQ7XCIsIFwiwqJcIikucmVwbGFjZShcIiZwb3VuZDtcIiwgXCLCo1wiKS5yZXBsYWNlKFwiJnllbjtcIiwgXCLCpVwiKS5yZXBsYWNlKFwiJmV1cm87XCIsIFwi4oKsXCIpLnJlcGxhY2UoXCJjb3B5cmlnaHRcIiwgXCLCqVwiKS5yZXBsYWNlKFwiJnJlZztcIiwgXCLCrlwiKVxuXG5leHBvcnRzLmZpbmRJbmRleCA9IChsYXllcikgLT5cblx0Zm9yIGNoaWxkLCBpIGluIGxheWVyLnBhcmVudC5jaGlsZHJlblxuXHRcdGlmIGxheWVyID09IGNoaWxkXG5cdFx0XHRyZXR1cm4gaVxuXG5leHBvcnRzLmhSdWxlID0gKHBpeGVsTnVtLCBjb2xvciwgb3BhYykgLT5cblx0bmV3IExheWVyXG5cdFx0bmFtZTogXCIuXCJcblx0XHR5OiBwaXhlbE51bVxuXHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRoZWlnaHQ6IDFcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGlmIGNvbG9yPyB0aGVuIGNvbG9yIGVsc2UgXCJyZWRcIlxuXHRcdG9wYWNpdHk6IGlmIG9wYWM/IHRoZW4gb3BhYyBlbHNlIDAuNVxuXG5leHBvcnRzLnZSdWxlID0gKHBpeGVsTnVtLCBjb2xvciwgb3BhYykgLT5cblx0bmV3IExheWVyXG5cdFx0bmFtZTogXCIuXCJcblx0XHR4OiBwaXhlbE51bVxuXHRcdHdpZHRoOiAxXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBpZiBjb2xvcj8gdGhlbiBjb2xvciBlbHNlIFwicmVkXCJcblx0XHRvcGFjaXR5OiBpZiBvcGFjPyB0aGVuIG9wYWMgZWxzZSAwLjVcblxuZXhwb3J0cy5oR3JpZCA9ICh4R2FwLCBjb2xvciwgb3BhYykgLT5cblx0bnVtYmVyT2ZMaW5lcyA9IFNjcmVlbi5oZWlnaHQgLyB4R2FwXG5cdGZvciBpIGluIFswLi5udW1iZXJPZkxpbmVzXVxuXHRcdEAuaFJ1bGUoaSp4R2FwLCBjb2xvciwgb3BhYylcblxuZXhwb3J0cy52R3JpZCA9ICh5R2FwLCBjb2xvciwgb3BhYykgLT5cblx0bnVtYmVyT2ZMaW5lcyA9IFNjcmVlbi53aWR0aCAvIHlHYXBcblx0Zm9yIGkgaW4gWzAuLm51bWJlck9mTGluZXNdXG5cdFx0QC52UnVsZShpKnlHYXAsIGNvbG9yLCBvcGFjKVxuXG5leHBvcnRzLmNvbnZlcnRUb01pbnMgPSAoIHNlY3MgKSAtPlxuXHRyZXR1cm4gc2Vjcyo2MCIsIiMgQSBjb2xsZWN0aW9uIGZvciBoZWxwZXIgbWV0aG9kcy5cbiNcbiMgQGF1dGhvciBzdGV2ZXJ1aXpva1xuXG5cbiMjI1xuUGluIGEgbGF5ZXIgdG8gYW5vdGhlciBsYXllci4gV2hlbiB0aGUgc2Vjb25kIGxheWVyIG1vdmVzLCB0aGUgZmlyc3Qgb25lIHdpbGwgdG9vLlxuXG5AcGFyYW0ge0xheWVyfSBsYXllciBUaGUgbGF5ZXIgdG8gcGluLlxuQHBhcmFtIHtMYXllcn0gdGFyZ2V0IFRoZSBsYXllciB0byBwaW4gdG8uIFxuQHBhcmFtIHsuLi5TdHJpbmd9IGRpcmVjdGlvbnMgV2hpY2ggc2lkZXMgb2YgdGhlIGxheWVyIHRvIHBpbiB0by5cblxuXHRVdGlscy5waW4obGF5ZXJBLCBsYXllckIsICdsZWZ0JylcblxuIyMjXG5VdGlscy5waW4gPSAobGF5ZXIsIHRhcmdldCwgZGlyZWN0aW9ucy4uLikgLT5cblx0aWYgZGlyZWN0aW9ucy5sZW5ndGggPiAyIFxuXHRcdHRocm93ICdVdGlscy5waW4gY2FuIG9ubHkgdGFrZSB0d28gZGlyZWN0aW9uIGFyZ3VtZW50cyAoZS5nLiBcImxlZnRcIiwgXCJ0b3BcIikuIEFueSBtb3JlIHdvdWxkIGNvbmZsaWN0ISdcblx0XG5cdGZvciBkaXJlY3Rpb24gaW4gZGlyZWN0aW9uc1xuXHRcdGRvIChsYXllciwgdGFyZ2V0LCBkaXJlY3Rpb24pIC0+XG5cdFx0XHRzd2l0Y2ggZGlyZWN0aW9uXG5cdFx0XHRcdHdoZW4gXCJsZWZ0XCJcblx0XHRcdFx0XHRwcm9wcyA9IFsneCddXG5cdFx0XHRcdFx0bFByb3AgPSAnbWF4WCdcblx0XHRcdFx0XHRkaXN0YW5jZSA9IHRhcmdldC54IC0gKGxheWVyLm1heFgpXG5cdFx0XHRcdFx0Z2V0RGlmZmVyZW5jZSA9IC0+IHRhcmdldC54IC0gZGlzdGFuY2Vcblx0XHRcdFx0d2hlbiBcInJpZ2h0XCJcblx0XHRcdFx0XHRwcm9wcyA9IFsneCcsICd3aWR0aCddXG5cdFx0XHRcdFx0bFByb3AgPSAneCdcblx0XHRcdFx0XHRkaXN0YW5jZSA9IGxheWVyLnggLSAodGFyZ2V0Lm1heFgpXG5cdFx0XHRcdFx0Z2V0RGlmZmVyZW5jZSA9IC0+IHRhcmdldC5tYXhYICsgZGlzdGFuY2Vcblx0XHRcdFx0d2hlbiBcInRvcFwiXG5cdFx0XHRcdFx0cHJvcHMgPSBbJ3knXVxuXHRcdFx0XHRcdGxQcm9wID0gJ21heFknXG5cdFx0XHRcdFx0ZGlzdGFuY2UgPSB0YXJnZXQueSAtIChsYXllci5tYXhZKVxuXHRcdFx0XHRcdGdldERpZmZlcmVuY2UgPSAtPiB0YXJnZXQueSAtIGRpc3RhbmNlXG5cdFx0XHRcdHdoZW4gXCJib3R0b21cIlxuXHRcdFx0XHRcdHByb3BzID0gWyd5JywgJ2hlaWdodCddXG5cdFx0XHRcdFx0bFByb3AgPSAneSdcblx0XHRcdFx0XHRkaXN0YW5jZSA9IGxheWVyLnkgLSAodGFyZ2V0Lm1heFkpXG5cdFx0XHRcdFx0Z2V0RGlmZmVyZW5jZSA9IC0+IHRhcmdldC5tYXhZICsgZGlzdGFuY2Vcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHRocm93ICdVdGlscy5waW4gLSBkaXJlY3Rpb25zIGNhbiBvbmx5IGJlIHRvcCwgcmlnaHQsIGJvdHRvbSBvciBsZWZ0Lidcblx0XHRcdFxuXHRcdFx0Zm9yIHByb3AgaW4gcHJvcHNcblx0XHRcdFx0c2V0UGluID1cblx0XHRcdFx0XHR0YXJnZXRMYXllcjogdGFyZ2V0XG5cdFx0XHRcdFx0ZGlyZWN0aW9uOiBkaXJlY3Rpb25cblx0XHRcdFx0XHRldmVudDogXCJjaGFuZ2U6I3twcm9wfVwiXG5cdFx0XHRcdFx0ZnVuYzogLT4gbGF5ZXJbbFByb3BdID0gZ2V0RGlmZmVyZW5jZSgpXG5cdFx0XHRcblx0XHRcdFx0bGF5ZXIucGlucyA/PSBbXVxuXHRcdFx0XHRsYXllci5waW5zLnB1c2goc2V0UGluKVxuXHRcdFx0XHRcblx0XHRcdFx0dGFyZ2V0Lm9uKHNldFBpbi5ldmVudCwgc2V0UGluLmZ1bmMpXG5cdFxuXG4jIyNcblJlbW92ZSBhbGwgb2YgYSBsYXllcidzIHBpbnMsIG9yIHBpbnMgZnJvbSBhIGNlcnRhaW4gdGFyZ2V0IGxheWVyIGFuZC9vciBkaXJlY3Rpb24uXG5cbkBwYXJhbSB7TGF5ZXJ9IGxheWVyIFRoZSBsYXllciB0byB1bnBpbi5cbkBwYXJhbSB7TGF5ZXJ9IFt0YXJnZXRdIFRoZSBsYXllciB0byB1bnBpbiBmcm9tLiBcbkBwYXJhbSB7Li4uU3RyaW5nfSBbZGlyZWN0aW9uc10gVGhlIGRpcmVjdGlvbnMgdG8gdW5waW4uXG5cblx0VXRpbHMudW5waW4obGF5ZXJBKVxuXG4jIyNcblV0aWxzLnVucGluID0gKGxheWVyLCB0YXJnZXQsIGRpcmVjdGlvbikgLT5cblx0XG5cdHNldFBpbnMgPSBfLmZpbHRlciBsYXllci5waW5zLCAocCkgLT5cblx0XHRpc0xheWVyID0gaWYgdGFyZ2V0PyB0aGVuIHAudGFyZ2V0IGlzIHRhcmdldCBlbHNlIHRydWVcblx0XHRpc0RpcmVjdGlvbiA9IGlmIGRpcmVjdGlvbj8gdGhlbiBwLmRpcmVjdGlvbiBpcyBkaXJlY3Rpb24gZWxzZSB0cnVlXG5cdFx0XG5cdFx0cmV0dXJuIGlzTGF5ZXIgYW5kIGlzRGlyZWN0aW9uXG5cdFxuXHRmb3Igc2V0UGluIGluIHNldFBpbnNcblx0XHRzZXRQaW4udGFyZ2V0Lm9mZihzZXRQaW4uZXZlbnQsIHNldFBpbi5mdW5jKVxuXG5cbiMjI1xuUGluIGxheWVyIHRvIGFub3RoZXIgbGF5ZXIsIGJhc2VkIG9uIHRoZSBmaXJzdCBsYXllcidzIG9yaWdpbi5cblxuQHBhcmFtIHtMYXllcn0gbGF5ZXIgVGhlIGxheWVyIHRvIHBpbi5cbkBwYXJhbSB7TGF5ZXJ9IFt0YXJnZXRdIFRoZSBsYXllciB0byBwaW4gdG8uIFxuQHBhcmFtIHtCb29sZWFufSBbdW5kb10gUmVtb3ZlLCByYXRoZXIgdGhhbiBjcmVhdGUsIHRoaXMgcGluLiBcblxuXHRVdGlscy5waW5PcmlnaW4obGF5ZXJBLCBsYXllckIpXG5cbiMjI1xuVXRpbHMucGluT3JpZ2luID0gKGxheWVyLCB0YXJnZXQsIHVuZG8gPSBmYWxzZSkgLT5cblx0aWYgdW5kb1xuXHRcdHRhcmdldC5vZmYgXCJjaGFuZ2U6c2l6ZVwiLCBsYXllci5zZXRQb3NpdGlvbiBcblx0XHRyZXR1cm5cblxuXHRsYXllci5zZXRQb3NpdGlvbiA9IC0+XG5cdFx0bGF5ZXIueCA9ICh0YXJnZXQud2lkdGggLSBsYXllci53aWR0aCkgKiBsYXllci5vcmlnaW5YXG5cdFx0bGF5ZXIueSA9ICh0YXJnZXQuaGVpZ2h0IC0gbGF5ZXIuaGVpZ2h0KSAqIGxheWVyLm9yaWdpbllcblx0XG5cdGxheWVyLnNldFBvc2l0aW9uKClcblx0XG5cdHRhcmdldC5vbiBcImNoYW5nZTpzaXplXCIsIGxheWVyLnNldFBvc2l0aW9uXG5cblxuIyMjXG5QaW4gbGF5ZXIgdG8gYW5vdGhlciBsYXllciwgYmFzZWQgb24gdGhlIGZpcnN0IGxheWVyJ3Mgb3JpZ2luWC5cblxuQHBhcmFtIHtMYXllcn0gbGF5ZXIgVGhlIGxheWVyIHRvIHBpbi5cbkBwYXJhbSB7TGF5ZXJ9IFt0YXJnZXRdIFRoZSBsYXllciB0byBwaW4gdG8uIFxuQHBhcmFtIHtCb29sZWFufSBbdW5kb10gUmVtb3ZlLCByYXRoZXIgdGhhbiBjcmVhdGUsIHRoaXMgcGluLiBcblxuXHRVdGlscy5waW5PcmlnaW5YKGxheWVyQSwgbGF5ZXJCKVxuXG4jIyNcblV0aWxzLnBpbk9yaWdpblggPSAobGF5ZXIsIHRhcmdldCwgdW5kbyA9IGZhbHNlKSAtPlxuXHRpZiB1bmRvXG5cdFx0dGFyZ2V0Lm9mZiBcImNoYW5nZTpzaXplXCIsIGxheWVyLnNldFBvc2l0aW9uIFxuXHRcdHJldHVyblxuXG5cdGxheWVyLnNldFBvc2l0aW9uID0gLT5cblx0XHRsYXllci54ID0gKHRhcmdldC53aWR0aCAtIGxheWVyLndpZHRoKSAqIGxheWVyLm9yaWdpblhcblx0XG5cdGxheWVyLnNldFBvc2l0aW9uKClcblx0XG5cdHRhcmdldC5vbiBcImNoYW5nZTpzaXplXCIsIGxheWVyLnNldFBvc2l0aW9uXG5cblxuIyMjXG5QaW4gbGF5ZXIgdG8gYW5vdGhlciBsYXllciwgYmFzZWQgb24gdGhlIGZpcnN0IGxheWVyJ3Mgb3JpZ2luWS5cblxuQHBhcmFtIHtMYXllcn0gbGF5ZXIgVGhlIGxheWVyIHRvIHBpbi5cbkBwYXJhbSB7TGF5ZXJ9IFt0YXJnZXRdIFRoZSBsYXllciB0byBwaW4gdG8uIFxuQHBhcmFtIHtCb29sZWFufSBbdW5kb10gUmVtb3ZlLCByYXRoZXIgdGhhbiBjcmVhdGUsIHRoaXMgcGluLiBcblxuXHRVdGlscy5waW5PcmlnaW5ZKGxheWVyQSwgbGF5ZXJCKVxuXG4jIyNcblV0aWxzLnBpbk9yaWdpblkgPSAobGF5ZXIsIHRhcmdldCwgdW5kbyA9IGZhbHNlKSAtPlxuXHRpZiB1bmRvXG5cdFx0dGFyZ2V0Lm9mZiBcImNoYW5nZTpzaXplXCIsIGxheWVyLnNldFBvc2l0aW9uIFxuXHRcdHJldHVyblxuXG5cdGxheWVyLnNldFBvc2l0aW9uID0gLT5cblx0XHRsYXllci55ID0gKHRhcmdldC5oZWlnaHQgLSBsYXllci5oZWlnaHQpICogbGF5ZXIub3JpZ2luWVxuXHRcblx0bGF5ZXIuc2V0UG9zaXRpb24oKVxuXHRcblx0dGFyZ2V0Lm9uIFwiY2hhbmdlOnNpemVcIiwgbGF5ZXIuc2V0UG9zaXRpb25cblxuXG4jIyNcblNldCBhIGxheWVyJ3MgY29udHJhaW50cyB0byBpdHMgcGFyZW50XG5cbkBwYXJhbSB7TGF5ZXJ9IGxheWVyIFRoZSBsYXllciB0byBjb25zdHJhaW4uXG5AcGFyYW0gey4uLlN0cmluZ30gb3B0aW9ucyBUaGUgY29uc3RyYWludCBvcHRpb25zIHRvIHVzZS5cblxuVmFsaWQgb3B0aW9ucyBhcmU6ICdsZWZ0JywgJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnaGVpZ2h0JywgJ3dpZHRoJywgYW5kICdhc3BlY3RSYXRpbycuXG5cblx0VXRpbHMuY29uc3RyYWluKGxheWVyLCAnbGVmdCcsICd0b3AnLCAnYXBlY3RSYXRpbycpXG5cbiMjI1xuVXRpbHMuY29uc3RyYWluID0gKGxheWVyLCBvcHRpb25zLi4uKSAtPlxuXHRpZiBub3QgbGF5ZXIucGFyZW50PyB0aGVuIHRocm93ICdVdGlscy5jb25zdHJhaW4gcmVxdWlyZXMgYSBsYXllciB3aXRoIGEgcGFyZW50Lidcblx0XG5cdG9wdHMgPVxuXHRcdGxlZnQ6IGZhbHNlLCBcblx0XHR0b3A6IGZhbHNlLCBcblx0XHRyaWdodDogZmFsc2UsIFxuXHRcdGJvdHRvbTogZmFsc2UsXG5cdFx0aGVpZ2h0OiBmYWxzZVxuXHRcdHdpZHRoOiBmYWxzZVxuXHRcdGFzcGVjdFJhdGlvOiBmYWxzZVxuXG5cdGZvciBvcHQgaW4gb3B0aW9uc1xuXHRcdG9wdHNbb3B0XSA9IHRydWVcblx0XG5cdHZhbHVlcyA9IFxuXHRcdGxlZnQ6IGlmIG9wdHMubGVmdCB0aGVuIGxheWVyLnggZWxzZSBudWxsXG5cdFx0aGVpZ2h0OiBsYXllci5oZWlnaHRcblx0XHRjZW50ZXJBbmNob3JYOiBsYXllci5taWRYIC8gbGF5ZXIucGFyZW50Py53aWR0aFxuXHRcdHdpZHRoOiBsYXllci53aWR0aFxuXHRcdHJpZ2h0OiBpZiBvcHRzLnJpZ2h0IHRoZW4gbGF5ZXIucGFyZW50Py53aWR0aCAtIGxheWVyLm1heFggZWxzZSBudWxsXG5cdFx0dG9wOiBpZiBvcHRzLnRvcCB0aGVuIGxheWVyLnkgZWxzZSBudWxsXG5cdFx0Y2VudGVyQW5jaG9yWTogbGF5ZXIubWlkWSAvIGxheWVyLnBhcmVudD8uaGVpZ2h0XG5cdFx0Ym90dG9tOiBpZiBvcHRzLmJvdHRvbSB0aGVuIGxheWVyLnBhcmVudD8uaGVpZ2h0IC0gbGF5ZXIubWF4WSBlbHNlIG51bGxcblx0XHR3aWR0aEZhY3RvcjogbnVsbFxuXHRcdGhlaWdodEZhY3RvcjogbnVsbFxuXHRcdGFzcGVjdFJhdGlvTG9ja2VkOiBvcHRzLmFzcGVjdFJhdGlvXG5cdFxuXHR1bmxlc3Mgb3B0cy50b3AgYW5kIG9wdHMuYm90dG9tXG5cdFx0aWYgb3B0cy5oZWlnaHRcblx0XHRcdHZhbHVlcy5oZWlnaHRGYWN0b3IgPSBsYXllci5oZWlnaHQgLyBsYXllci5wYXJlbnQ/LmhlaWdodFxuXHRcdFx0XG5cdHVubGVzcyBvcHRzLmxlZnQgYW5kIG9wdHMucmlnaHQgXG5cdFx0aWYgb3B0cy53aWR0aFxuXHRcdFx0dmFsdWVzLndpZHRoRmFjdG9yID0gbGF5ZXIud2lkdGggLyBsYXllci5wYXJlbnQ/LndpZHRoXG5cdFxuXHRsYXllci5jb25zdHJhaW50VmFsdWVzID0gdmFsdWVzXG5cblxuIyMjXG5JbW1lZGlhdGVseSBleGVjdXRlIGEgZnVuY3Rpb24gdGhhdCBpcyBib3VuZCB0byB0aGUgdGFyZ2V0LlxuXG5AcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gYmluZCB0aGUgY2FsbGJhY2sgdG8uXG5AcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gcnVuLlxuXG5cdFV0aWxzLmJpbmQobXlMYXllciwgLT4gdGhpcy5uYW1lID0gXCJNeSBMYXllclwiKVxuXG4jIyNcblV0aWxzLmJpbmQgPSAob2JqZWN0LCBjYWxsYmFjaykgLT5cblx0ZG8gXy5iaW5kKGNhbGxiYWNrLCBvYmplY3QpXG5cblxuIyMjXG5BbGlhcyBmb3IgVXRpbHMuYmluZC5cbiMjI1xuVXRpbHMuYnVpbGQgPSAob2JqZWN0LCBjYWxsYmFjaykgLT4gQGJpbmQob2JqZWN0LCBjYWxsYmFjaylcblxuXG4jIyNcbkRlZmluZSBhIHByb3BlcnR5IG9uIGEgTGF5ZXIgdGhhdCB3aWxsIGVtaXQgYSBjaGFuZ2UgZXZlbnQgd2hlbiB0aGF0IHByb3BlcnR5IGNoYW5nZXMuIEFsc28sIG9wdGlvbmFsbHkgZ2l2ZSB0aGUgcHJvcGVydHkgYW4gaW5pdGlhbCB2YWx1ZSBhbmQgYSBjYWxsYmFjayB0byBydW4gd2hlbiB0aGUgcHJvcGVydHkgY2hhbmdlcy5cblxuQHBhcmFtIHtMYXllcn0gbGF5ZXIgVGhlIGxheWVyIG9uIHdoaWNoIHRvIGRlZmluZSB0aGUgcHJvcGVydHkuXG5AcGFyYW0ge1N0cmluZ30gcHJvcGVydHkgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5LlxuQHBhcmFtIHtPYmplY3R9IFt2YWx1ZV0gVGhlIGluaXRpYWwgdmFsdWUgb2YgdGhlIHByb3BlcnR5LlxuQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSBUaGUgY2FsbGJhY2sgdG8gcnVuIHdoZW4gdGhpcyBwcm9wZXJ0eSBjaGFuZ2VzLiBFeGVjdXRlZCB3aXRoIHR3byBhcmd1bWVudHM6IHRoZSBwcm9wZXJ0eSdzIG5ldyB2YWx1ZSBhbmQgdGhlIExheWVyIGl0c2VsZi5cbkBwYXJhbSB7RnVuY3Rpb259IFt2YWxpZGF0aW9uXSBBIGZ1bmN0aW9uIHRvIHZhbGlkYXRlIHRoZSBwcm9wZXJ0eSdzIG5ldyB2YWx1ZS5cbkBwYXJhbSB7U3RyaW5nfSBbZXJyb3JdIEFuIGVycm9yIHRvIHRocm93IGlmIHRoZSB2YWxpZGF0aW9uIGZ1bmN0aW9uIHJldHVybmVkIGZhbHNlLlxuXG5cdFV0aWxzLmRlZmluZShteUxheWVyLCBcInRvZ2dsZWRcIilcblx0VXRpbHMuZGVmaW5lKG15TGF5ZXIsIFwidG9nZ2xlZFwiLCBmYWxzZSlcblx0VXRpbHMuZGVmaW5lKG15TGF5ZXIsIFwidG9nZ2xlZFwiLCBmYWxzZSwgbXlMYXllci5zaG93VG9nZ2xlZClcblx0VXRpbHMuZGVmaW5lKG15TGF5ZXIsIFwidG9nZ2xlZFwiLCBmYWxzZSwgbnVsbCwgXy5pc0Jvb2xlYW4sIFwiTGF5ZXIudG9nZ2xlZCBtdXN0IGJlIHRydWUgb3IgZmFsc2UuXCIpXG5cbiMjI1xuVXRpbHMuZGVmaW5lID0gKGxheWVyLCBwcm9wZXJ0eSwgdmFsdWUsIGNhbGxiYWNrLCB2YWxpZGF0aW9uLCBlcnJvcikgLT5cblx0dmFsaWRhdGlvbiA/PSAtPiB0cnVlXG5cdGVycm9yID89IFwiTGF5ZXIgI3tsYXllci5pZH0ncyBwcm9wZXJ0eSAnI3twcm9wZXJ0eX0nIHdhcyBnaXZlbiB0aGUgd3JvbmcgdmFsdWUgdHlwZS5cIlxuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5IGxheWVyLFxuXHRcdHByb3BlcnR5LFxuXHRcdGdldDogLT4gcmV0dXJuIGxheWVyW1wiXyN7cHJvcGVydHl9XCJdXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRpZiB2YWx1ZT9cblx0XHRcdFx0aWYgbm90IHZhbGlkYXRpb24odmFsdWUpIHRoZW4gdGhyb3cgZXJyb3Jcblx0XHRcdFx0cmV0dXJuIGlmIHZhbHVlIGlzIGxheWVyW1wiXyN7cHJvcGVydHl9XCJdXG5cblx0XHRcdGxheWVyW1wiXyN7cHJvcGVydHl9XCJdID0gdmFsdWVcblx0XHRcdGxheWVyLmVtaXQoXCJjaGFuZ2U6I3twcm9wZXJ0eX1cIiwgdmFsdWUsIGxheWVyKVxuXHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHRcdFx0XG5cdGlmIGNhbGxiYWNrPyBhbmQgdHlwZW9mIGNhbGxiYWNrIGlzICdmdW5jdGlvbidcblx0XHRsYXllci5vbihcImNoYW5nZToje3Byb3BlcnR5fVwiLCBjYWxsYmFjaylcblx0XG5cdGxheWVyW3Byb3BlcnR5XSA9IHZhbHVlXG5cbiMjI1xuU2V0IGFsbCBsYXllcnMgaW4gYW4gYXJyYXkgdG8gdGhlIHNhbWUgcHJvcGVydHkgb3IgcHJvcGVydGllcy5cblxuQHBhcmFtIHtBcnJheX0gbGF5ZXJzIFRoZSBhcnJheSBvZiBsYXllcnMgdG8gYWxpZ24uXG5AcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgcHJvcGVydGllcyB0byBzZXQuXG5AcGFyYW0ge0Jvb2xlYW59IFttaW5pbXVtXSBXaGV0aGVyIHRvIHVzZSBhdmVyYWdlIHZhbHVlcyBvciBtaW5pbXVtIHZhbHVlcyBmb3IgbWlkZGxlIC8gY2VudGVyLlxuQHBhcmFtIHtCb29sZWFufSBbYW5pbWF0ZV0gV2hldGhlciB0byBhbmltYXRlIHRvIHRoZSBuZXcgcHJvcGVydHkuXG5AcGFyYW0ge09iamVjdH0gW2FuaW1hdGlvbk9wdGlvbnNdIFRoZSBhbmltYXRpb24gb3B0aW9ucyB0byB1c2UuXG5cblx0VXRpbHMuYWxpZ24gW2xheWVyQSwgbGF5ZXJCXSxcblx0XHR4OiAyMDBcblxuXHRVdGlscy5hbGlnbiBbbGF5ZXJBLCBsYXllckJdLFxuXHRcdHg6IDIwMFxuXHRcdHRydWVcblx0XHR0aW1lOiAuNVxuIyMjXG5VdGlscy5hbGlnbiA9IChsYXllcnMgPSBbXSwgZGlyZWN0aW9uLCBtaW5pbXVtID0gdHJ1ZSwgYW5pbWF0ZSwgYW5pbWF0aW9uT3B0aW9ucyA9IHt9KSAtPiBcblx0bWluWCA9IF8ubWluQnkobGF5ZXJzLCAneCcpLnhcblx0bWF4WCA9IF8ubWF4QnkobGF5ZXJzLCAnbWF4WCcpLm1heFhcblx0bWluWSA9IF8ubWluQnkobGF5ZXJzLCAneScpLnlcblx0bWF4WSA9IF8ubWF4QnkobGF5ZXJzLCAnbWF4WScpLm1heFlcblxuXG5cdG9wdGlvbnMgPSBzd2l0Y2ggZGlyZWN0aW9uXG5cdFx0d2hlbiBcInRvcFwiIHRoZW4ge3k6IG1pbll9XG5cdFx0d2hlbiBcIm1pZGRsZVwiXG5cdFx0XHRpZiBtaW5pbXVtXG5cdFx0XHRcdHttaWRZOiBfLm1pbkJ5KGxheWVycywgJ3knKS5taWRZfVxuXHRcdFx0ZWxzZSBcblx0XHRcdFx0e21pZFk6IChtYXhZIC0gbWluWSkvMiArIG1pbll9XG5cdFx0d2hlbiBcImJvdHRvbVwiIHRoZW4ge21heFk6IG1heFl9XG5cdFx0d2hlbiBcImxlZnRcIiB0aGVuIHt4OiBtaW5ZfVxuXHRcdHdoZW4gXCJjZW50ZXJcIlxuXHRcdFx0aWYgbWluaW11bSBcblx0XHRcdFx0e21pZFg6IF8ubWluQnkobGF5ZXJzLCAneCcpLm1pZFh9XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHttaWRYOiAobWF4WCAtIG1pblgpLzIgKyBtaW5YfVxuXHRcdHdoZW4gXCJyaWdodFwiIHRoZW4ge21heFg6IG1heFh9XG5cdFx0ZWxzZSB7fVxuXG5cdGZvciBsYXllciwgaSBpbiBsYXllcnNcblx0XHRpZiBhbmltYXRlXG5cdFx0XHRsYXllci5hbmltYXRlIG9wdGlvbnMsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRlbHNlXG5cdFx0XHRfLmFzc2lnbiBsYXllciwgb3B0aW9uc1xuXG4jIyNcbkRpc3RyaWJ1dGUgYW4gYXJyYXkgb2YgbGF5ZXJzIGJldHdlZW4gdHdvIHZhbHVlcy5cblxuQHBhcmFtIHtBcnJheX0gbGF5ZXJzIFRoZSBhcnJheSBvZiBsYXllcnMgdG8gZGlzdHJpYnV0ZS5cbkBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eSBUaGUgcHJvcGVydHkgdG8gZGlzdHJpYnV0ZS5cbkBwYXJhbSB7T2JqZWN0fSBbc3RhcnRdIFRoZSB2YWx1ZSB0byBzdGFydCBmcm9tLiBCeSBkZWZhdWx0LCB0aGUgbG93ZXN0IHZhbHVlIG9mIHRoZSBnaXZlbiBwcm9wZXJ0eSBhbW9uZyB0aGUgbGF5ZXJzIGFycmF5LlxuQHBhcmFtIHtPYmplY3R9IFtlbmRdIFRoZSB2YWx1ZSB0byBkaXN0cmlidXRlIHRvLiBCeSBkZWZhdWx0LCB0aGUgaGlnaGVzdCB2YWx1ZSBvZiB0aGUgZ2l2ZW4gcHJvcGVydHkgYW1vbmcgdGhlIGxheWVycyBhcnJheS5cbkBwYXJhbSB7Qm9vbGVhbn0gW2FuaW1hdGVdIFdoZXRoZXIgdG8gYW5pbWF0ZSB0byB0aGUgbmV3IHByb3BlcnR5LlxuQHBhcmFtIHtPYmplY3R9IFthbmltYXRpb25PcHRpb25zXSBUaGUgYW5pbWF0aW9uIG9wdGlvbnMgdG8gdXNlLlxuXG5cdFV0aWxzLmFsaWduIFtsYXllckEsIGxheWVyQl0sICd4J1xuXG5cdFV0aWxzLmFsaWduIFtsYXllckEsIGxheWVyQl0sICd4JywgMzIsIDIwMFxuXG5cdFV0aWxzLmFsaWduIFtsYXllckEsIGxheWVyQl0sICd4JywgMzIsIDIwMCwgdHJ1ZSwge3RpbWU6IC41fVxuXG5BbHNvIHdvcmtzIHdpdGggJ2hvcml6b250YWwnIGFuZCAndmVydGljYWwnLCAoYWxpYXMgdG8gJ21pZFgnIGFuZCAnbWlkWScpLlxuXG5cdFV0aWxzLmFsaWduIFtsYXllckEsIGxheWVyQl0sICdob3Jpem9udGFsJ1xuXG4jIyNcblV0aWxzLmRpc3RyaWJ1dGUgPSAobGF5ZXJzID0gW10sIHByb3BlcnR5LCBzdGFydCwgZW5kLCBhbmltYXRlID0gZmFsc2UsIGFuaW1hdGlvbk9wdGlvbnMgPSB7fSkgLT5cblx0XG5cdHByb3BlcnR5ID0gJ21pZFgnIGlmIHByb3BlcnR5IGlzICdob3Jpem9udGFsJ1xuXHRwcm9wZXJ0eSA9ICdtaWRZJyBpZiBwcm9wZXJ0eSBpcyAndmVydGljYWwnXG5cblx0bGF5ZXJzID0gXy5zb3J0QnkobGF5ZXJzLCBbcHJvcGVydHldKVxuXG5cdGlmIF8uaXNVbmRlZmluZWQoc3RhcnQpIG9yIHR5cGVvZiBzdGFydCBpcyAnYm9vbGVhbidcblx0XHRhbmltYXRlID0gc3RhcnQgPyBmYWxzZVxuXHRcdGFuaW1hdGlvbk9wdGlvbnMgPSBlbmQgPyB7fVxuXHRcdHN0YXJ0ID0gbGF5ZXJzWzBdW3Byb3BlcnR5XVxuXHRcdGVuZCA9IF8ubGFzdChsYXllcnMpW3Byb3BlcnR5XVxuXG5cdGRpc3RhbmNlID0gKGVuZCAtIHN0YXJ0KSAvIChsYXllcnMubGVuZ3RoIC0gMSlcblxuXHR2YWx1ZXMgPSBsYXllcnMubWFwIChsYXllciwgaSkgLT5cblx0XHRyZXR1cm4ge1wiI3twcm9wZXJ0eX1cIjogc3RhcnQgKyAoZGlzdGFuY2UgKiBpKX1cblx0XG5cdGZvciBsYXllciwgaSBpbiBsYXllcnNcblx0XHRpZiBhbmltYXRlXG5cdFx0XHRsYXllci5hbmltYXRlIHZhbHVlc1tpXSwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0Y29udGludWVcblx0XHRcblx0XHRfLmFzc2lnbiBsYXllciwgdmFsdWVzW2ldXG5cbiMjI1xuU3RhY2sgbGF5ZXJzLlxuXG5AcGFyYW0ge0FycmF5fSBsYXllcnMgVGhlIGFycmF5IG9mIGxheWVycyB0byBvZmZzZXQuXG5AcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgVGhlIGRpc3RhbmNlIGJldHdlZW4gZWFjaCBsYXllci5cbkBwYXJhbSB7U3RyaW5nfSBheGlzIFdoZXRoZXIgdG8gc3RhY2sgb24gdGhlIHggb3IgeSBheGlzLlxuQHBhcmFtIHtCb29sZWFufSBbYW5pbWF0ZV0gV2hldGhlciB0byBhbmltYXRlIGxheWVycyB0byB0aGUgbmV3IHBvc2l0aW9uLlxuQHBhcmFtIHtPYmplY3R9IFthbmltYXRpb25PcHRpb25zXSBUaGUgYW5pbWF0aW9uIG9wdGlvbnMgdG8gdXNlLlxuXG4jIyNcblV0aWxzLnN0YWNrID0gKGxheWVycyA9IFtdLCBkaXN0YW5jZSA9IDAsIGF4aXMgPSBcInZlcnRpY2FsXCIsIGFuaW1hdGUgPSBmYWxzZSwgYW5pbWF0aW9uT3B0aW9ucyA9IHt9KSAtPlxuXHRyZXR1cm4gaWYgbGF5ZXJzLmxlbmd0aCA8PSAxXG5cblx0aWYgYXhpcyBpcyBcInZlcnRpY2FsXCIgb3IgYXhpcyBpcyBcInlcIlxuXHRcdFV0aWxzLm9mZnNldFkobGF5ZXJzLCBkaXN0YW5jZSwgYW5pbWF0ZSwgYW5pbWF0aW9uT3B0aW9ucylcblx0ZWxzZSBpZiBheGlzIGlzIFwiaG9yaXpvbnRhbFwiIG9yIGF4aXMgaXMgXCJ4XCJcblx0XHRVdGlscy5vZmZzZXRYKGxheWVycywgZGlzdGFuY2UsIGFuaW1hdGUsIGFuaW1hdGlvbk9wdGlvbnMpXG5cblx0cmV0dXJuIGxheWVyc1xuXG5cbiMjI1xuT2Zmc2V0IGFuIGFycmF5IG9mIGxheWVycyB2ZXJ0aWNhbGx5LlxuXG5AcGFyYW0ge0FycmF5fSBsYXllcnMgVGhlIGFycmF5IG9mIGxheWVycyB0byBvZmZzZXQuXG5AcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgVGhlIGRpc3RhbmNlIGJldHdlZW4gZWFjaCBsYXllci5cbkBwYXJhbSB7Qm9vbGVhbn0gW2FuaW1hdGVdIFdoZXRoZXIgdG8gYW5pbWF0ZSBsYXllcnMgdG8gdGhlIG5ldyBwb3NpdGlvbi5cbkBwYXJhbSB7T2JqZWN0fSBbYW5pbWF0aW9uT3B0aW9uc10gVGhlIGFuaW1hdGlvbiBvcHRpb25zIHRvIHVzZS5cblxuXHRVdGlscy5hbGlnbiBbbGF5ZXJBLCBsYXllckJdLFxuXHRcdHg6IDIwMFxuXG5cdFV0aWxzLmFsaWduIFtsYXllckEsIGxheWVyQl0sXG5cdFx0eDogMjAwXG5cdFx0dHJ1ZVxuXHRcdHRpbWU6IC41XG4jIyNcblV0aWxzLm9mZnNldFkgPSAobGF5ZXJzID0gW10sIGRpc3RhbmNlID0gMCwgYW5pbWF0ZSA9IGZhbHNlLCBhbmltYXRpb25PcHRpb25zID0ge30pIC0+IFxuXHRyZXR1cm4gaWYgbGF5ZXJzLmxlbmd0aCA8PSAxXG5cblx0c3RhcnRZID0gbGF5ZXJzWzBdLnlcblx0dmFsdWVzID0gW11cblx0dmFsdWVzID0gbGF5ZXJzLm1hcCAobGF5ZXIsIGkpIC0+XG5cdFx0diA9IHt5OiBzdGFydFl9XG5cdFx0c3RhcnRZICs9IGxheWVyLmhlaWdodCArIGRpc3RhbmNlXG5cdFx0cmV0dXJuIHZcblx0XHRcblx0Zm9yIGxheWVyLCBpIGluIGxheWVyc1xuXHRcdGlmIGFuaW1hdGVcblx0XHRcdGxheWVyLmFuaW1hdGUgdmFsdWVzW2ldLCBhbmltYXRpb25PcHRpb25zXG5cdFx0ZWxzZVxuXHRcdFx0Xy5hc3NpZ24gbGF5ZXIsIHZhbHVlc1tpXVxuXG5cdHJldHVybiBsYXllcnNcblxuIyMjXG5PZmZzZXQgYW4gYXJyYXkgb2YgbGF5ZXJzIGhvcml6b250YWxseS5cblxuQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IG9mIGxheWVycyB0byBvZmZzZXQuXG5AcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgVGhlIGRpc3RhbmNlIGJldHdlZW4gZWFjaCBsYXllci5cbkBwYXJhbSB7Qm9vbGVhbn0gW2FuaW1hdGVdIFdoZXRoZXIgdG8gYW5pbWF0ZSBsYXllcnMgdG8gdGhlIG5ldyBwb3NpdGlvbi5cbkBwYXJhbSB7T2JqZWN0fSBbYW5pbWF0aW9uT3B0aW9uc10gVGhlIGFuaW1hdGlvbiBvcHRpb25zIHRvIHVzZS5cblxuXHRVdGlscy5hbGlnbiBbbGF5ZXJBLCBsYXllckJdLFxuXHRcdHg6IDIwMFxuXG5cdFV0aWxzLmFsaWduIFtsYXllckEsIGxheWVyQl0sXG5cdFx0eDogMjAwXG5cdFx0dHJ1ZVxuXHRcdHRpbWU6IC41XG4jIyNcblV0aWxzLm9mZnNldFggPSAobGF5ZXJzID0gW10sIGRpc3RhbmNlID0gMCwgYW5pbWF0ZSA9IGZhbHNlLCBhbmltYXRpb25PcHRpb25zID0ge30pIC0+IFxuXHRyZXR1cm4gaWYgbGF5ZXJzLmxlbmd0aCA8PSAxXG5cblx0c3RhcnRYID0gbGF5ZXJzWzBdLnhcblx0dmFsdWVzID0gW11cblx0dmFsdWVzID0gbGF5ZXJzLm1hcCAobGF5ZXIsIGkpIC0+XG5cdFx0diA9IHt4OiBzdGFydFh9XG5cdFx0c3RhcnRYICs9IGxheWVyLndpZHRoICsgZGlzdGFuY2Vcblx0XHRyZXR1cm4gdlxuXHRcdFxuXHRmb3IgbGF5ZXIsIGkgaW4gbGF5ZXJzXG5cdFx0aWYgYW5pbWF0ZVxuXHRcdFx0bGF5ZXIuYW5pbWF0ZSB2YWx1ZXNbaV0sIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRlbHNlXG5cdFx0XHRfLmFzc2lnbiBsYXllciwgdmFsdWVzW2ldXG5cblx0cmV0dXJuIGxheWVyc1xuXG4jIENyZWF0ZSBhIHRpbWVyIGluc3RhbmNlIHRvIHNpbXBsaWZ5IGludGVydmFscy5cbiMgVGhhbmtzIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJja3Jlbm4uXG4jXG4jIEBleGFtcGxlXG4jXG4jIHRpbWVyID0gbmV3IFV0aWxzLnRpbWVyKDEsIC0+IHByaW50ICdoZWxsbyB3b3JsZCEnKVxuIyBVdGlscy5kZWxheSA1LCAtPiB0aW1lci5wYXVzZSgpXG4jIFV0aWxzLmRlbGF5IDgsIC0+IHRpbWVyLnJlc3VtZSgpXG4jIFV0aWxzLmRlbGF5IDEwLCAtPiB0aW1lci5yZXN0YXJ0KClcbiNcblV0aWxzLlRpbWVyID0gY2xhc3MgVGltZXJcblx0Y29uc3RydWN0b3I6ICh0aW1lLCBmKSAtPlxuXHRcdEBwYXVzZWQgPSBmYWxzZVxuXHRcdEBzYXZlVGltZSA9IG51bGxcblx0XHRAc2F2ZUZ1bmN0aW9uID0gbnVsbFxuXG5cdFx0aWYgdGltZT8gYW5kIGY/XG5cdFx0XHRAc3RhcnQodGltZSwgZilcblx0XG5cdHN0YXJ0OiAodGltZSwgZikgPT5cblx0XHRAc2F2ZVRpbWUgPSB0aW1lXG5cdFx0QHNhdmVGdW5jdGlvbiA9IGZcblxuXHRcdGYoKVxuXHRcdHByb3h5ID0gPT4gZigpIHVubGVzcyBAcGF1c2VkXG5cdFx0dW5sZXNzIEBwYXVzZWRcblx0XHRcdEBfaWQgPSB0aW1lciA9IFV0aWxzLmludGVydmFsKHRpbWUsIHByb3h5KVxuXHRcdGVsc2UgcmV0dXJuXG5cdFxuXHRwYXVzZTogICA9PiBAcGF1c2VkID0gdHJ1ZVxuXHRyZXN1bWU6ICA9PiBAcGF1c2VkID0gZmFsc2Vcblx0cmVzZXQ6ICAgPT4gY2xlYXJJbnRlcnZhbChAX2lkKVxuXHRyZXN0YXJ0OiA9PiBcblx0XHRjbGVhckludGVydmFsKEBfaWQpXG5cdFx0VXRpbHMuZGVsYXkgMCwgPT4gQHN0YXJ0KEBzYXZlVGltZSwgQHNhdmVGdW5jdGlvbilcblxuXG4jIyNcbkEgY2xhc3MgdG8gbWFuYWdlIHN0YXRlcyBvZiBtdWx0aXBsZSBUZXh0TGF5ZXJzLCB3aGljaCBcIm9ic2VydmVcIiB0aGUgc3RhdGUuIFxuV2hlbiB0aGUgc3RhdGUgY2hhbmdlcywgdGhlIFN0YXRlTWFuYWdlciB3aWxsIHVwZGF0ZSBhbGwgXCJvYnNlcnZlclwiIFRleHRMYXllcnMsXG5hcHBseWluZyB0aGUgbmV3IHN0YXRlIHRvIGVhY2ggVGV4dExheWVyJ3MgdGVtcGxhdGUgcHJvcGVydHkuXG5cbkBwYXJhbSB7QXJyYXl9IFtsYXllcnNdIFRoZSBsYXllcnMgdG8gb2JzZXJ2ZSB0aGUgc3RhdGUuXG5AcGFyYW0ge09iamVjdH0gW3N0YXRlXSBUaGUgaW5pdGlhbCBzdGF0ZS5cblxuXHRzdGF0ZU1nciA9IG5ldyBVdGlscy5TdGF0ZU1hbmFnZXIsIG15TGF5ZXJzXG5cdFx0Zmlyc3ROYW1lOiBcIkRhdmlkXCJcblx0XHRsYXN0TmFtZTogXCJBdHRlbmJvcm91Z2hcIlxuXG5cdHN0YXRlTWdyLnNldFN0YXRlXG5cdFx0Zmlyc3ROYW1lOiBcIlNpciBEYXZpZFwiXG5cbiMjI1xuVXRpbHMuU3RhdGVNYW5hZ2VyID0gY2xhc3MgU3RhdGVNYW5hZ2VyXG5cdGNvbnN0cnVjdG9yOiAobGF5ZXJzID0gW10sIHN0YXRlID0ge30pIC0+XG5cdFx0XG5cdFx0QF9zdGF0ZSA9IHN0YXRlXG5cdFx0QF9vYnNlcnZlcnMgPSBsYXllcnNcblx0XHRcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkgQCxcblx0XHRcdFwib2JzZXJ2ZXJzXCIsXG5cdFx0XHRnZXQ6IC0+IHJldHVybiBAX29ic2VydmVyc1xuXHRcdFxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBALFxuXHRcdFx0XCJzdGF0ZVwiLFxuXHRcdFx0Z2V0OiAtPiByZXR1cm4gQF9zdGF0ZVxuXHRcdFx0c2V0OiAob2JqKSAtPlxuXHRcdFx0XHRpZiB0eXBlb2Ygb2JqIGlzbnQgXCJvYmplY3RcIlxuXHRcdFx0XHRcdHRocm93IFwiU3RhdGUgbXVzdCBiZSBhbiBvYmplY3QuXCJcblx0XHRcdFx0XG5cdFx0XHRcdEBzZXRTdGF0ZShvYmopXG5cblx0XHRAX3VwZGF0ZVN0YXRlKClcblxuXHRfdXBkYXRlU3RhdGU6ID0+XG5cdFx0QG9ic2VydmVycy5mb3JFYWNoIChsYXllcikgPT5cblx0XHRcdGxheWVyLnRlbXBsYXRlID0gQHN0YXRlXG5cdFxuXHRhZGRPYnNlcnZlcjogKGxheWVyKSAtPlxuXHRcdEBfb2JzZXJ2ZXJzLnB1c2gobGF5ZXIpXG5cdFx0bGF5ZXIudGVtcGxhdGUgPSBAc3RhdGVcblx0XHRcblx0cmVtb3ZlT2JzZXJ2ZXI6IChsYXllcikgLT5cblx0XHRfLnB1bGwoQF9vYnNlcnZlcnMsIGxheWVyKVxuXHRcblx0c2V0U3RhdGU6IChvcHRpb25zID0ge30pIC0+IFxuXHRcdF8ubWVyZ2UoQF9zdGF0ZSwgb3B0aW9ucylcblx0XHRAX3VwZGF0ZVN0YXRlKClcblx0XHRcblx0XHRyZXR1cm4gQF9zdGF0ZVxuXG4jIGFycmFuZ2UgbGF5ZXJzIGluIGFuIGFycmF5IGludG8gYSBncmlkLCB1c2luZyBhIHNldCBudW1iZXIgb2YgY29sdW1ucyBhbmQgcm93L2NvbHVtbiBtYXJnaW5zXG4jIEBleGFtcGxlICAgIFV0aWxzLmdyaWQobGF5ZXJzLCA0KVxuVXRpbHMuZ3JpZCA9IChhcnJheSA9IFtdLCBjb2xzID0gNCwgcm93TWFyZ2luID0gMTYsIGNvbE1hcmdpbikgLT5cblx0XG5cdGcgPVxuXHRcdHg6IGFycmF5WzBdLnhcblx0XHR5OiBhcnJheVswXS55XG5cdFx0Y29sczogY29sc1xuXHRcdGhlaWdodDogXy5tYXhCeShhcnJheSwgJ2hlaWdodCcpPy5oZWlnaHRcblx0XHR3aWR0aDogXy5tYXhCeShhcnJheSwgJ3dpZHRoJyk/LndpZHRoXG5cdFx0cm93TWFyZ2luOiByb3dNYXJnaW4gPyAwXG5cdFx0Y29sdW1uTWFyZ2luOiBjb2xNYXJnaW4gPyByb3dNYXJnaW4gPyAwXG5cdFx0cm93czogW11cblx0XHRjb2x1bW5zOiBbXVxuXHRcdGxheWVyczogW11cblxuXHRcdGFwcGx5OiAoZnVuYykgLT5cblx0XHRcdGZvciBsYXllciBpbiBAbGF5ZXJzXG5cdFx0XHRcdFV0aWxzLmJ1aWxkKGxheWVyLCBmdW5jKVxuXG5cdFx0IyBnZXQgYSBzcGVjaWZpZWQgY29sdW1uXG5cdFx0Z2V0Q29sdW1uOiAobGF5ZXIpIC0+IFxuXHRcdFx0cmV0dXJuIEBjb2x1bW5zLmluZGV4T2YoXy5maW5kKEBjb2x1bW5zLCAoYykgLT4gXy5pbmNsdWRlcyhjLCBsYXllcikpKVxuXG5cdFx0IyBnZXQgYSBzcGVjaWZpZWQgcm93XG5cdFx0Z2V0Um93OiAobGF5ZXIpIC0+IFxuXHRcdFx0cmV0dXJuIEByb3dzLmluZGV4T2YoXy5maW5kKEByb3dzLCAocikgLT4gXy5pbmNsdWRlcyhyLCBsYXllcikpKVxuXG5cdFx0IyBnZXQgYSBsYXllciBhdCBhIHNwZWNpZmllZCBncmlkIHBvc2l0aW9uc1xuXHRcdGdldExheWVyOiAocm93LCBjb2wpIC0+IFxuXHRcdFx0cmV0dXJuIEByb3dzW3Jvd11bY29sXVxuXG5cdFx0IyByZXR1cm4gYSByYW5kb20gbGF5ZXIgZnJvbSB0aGUgZ3JpZFxuXHRcdGdldFJhbmRvbTogLT4gXG5cdFx0XHRyZXR1cm4gXy5zYW1wbGUoXy5zYW1wbGUoQHJvd3MpKVxuXG5cdFx0IyBhZGQgYSBuZXcgbGF5ZXIgdG8gdGhlIGdyaWQsIG9wdGlvbmFsbHkgYXQgYSBzcGVjaWZpZWQgcG9zaXRpb25cblx0XHRhZGQ6IChsYXllciwgaSA9IEBsYXllcnMubGVuZ3RoLCBhbmltYXRlID0gZmFsc2UpIC0+XG5cblx0XHRcdGlmIG5vdCBsYXllcj9cblx0XHRcdFx0bGF5ZXIgPSBAbGF5ZXJzWzBdLmNvcHlTaW5nbGUoKVxuXHRcdFx0XG5cdFx0XHRsYXllci5wYXJlbnQgPSBAbGF5ZXJzWzBdLnBhcmVudFxuXG5cdFx0XHRAbGF5ZXJzLnNwbGljZShpLCAwLCBsYXllcilcblx0XHRcdFxuXHRcdFx0QF9yZWZyZXNoKEBsYXllcnMsIGFuaW1hdGUpXG5cblx0XHRcdHJldHVybiBsYXllclxuXHRcdFxuXHRcdCMgcmVtb3ZlIGEgbGF5ZXIgZnJvbSB0aGUgZ3JpZFxuXHRcdHJlbW92ZTogKGxheWVyLCBhbmltYXRlKSAtPlxuXHRcdFx0QF9yZWZyZXNoKF8ud2l0aG91dChAbGF5ZXJzLCBsYXllciksIGFuaW1hdGUpXG5cdFx0XHRsYXllci5kZXN0cm95KClcblxuXHRcdFx0cmV0dXJuIEBcblxuXHRcdCMgY2xlYXIgYW5kIHJlLWZpbGwgYXJyYXlzLCB0aGVuIGJ1aWxkXG5cdFx0X3JlZnJlc2g6IChsYXllcnMsIGFuaW1hdGUpIC0+XG5cdFx0XHRAcm93cyA9IFtdXG5cdFx0XHRAY29sdW1ucyA9IFtdXG5cdFx0XHRAbGF5ZXJzID0gbGF5ZXJzXG5cblx0XHRcdEBfYnVpbGQoYW5pbWF0ZSlcblxuXHRcdCMgcHV0IHRvZ2V0aGVyIHRoZSBncmlkXG5cdFx0X2J1aWxkOiAoYW5pbWF0ZSA9IGZhbHNlKSAtPlxuXHRcdFx0Zm9yIGxheWVyLCBpIGluIEBsYXllcnNcblx0XHRcdFx0Y29sID0gaSAlIGNvbHNcblx0XHRcdFx0cm93ID0gTWF0aC5mbG9vcihpIC8gY29scylcblx0XHRcdFx0XG5cdFx0XHRcdEByb3dzW3Jvd10gPz0gW10gXG5cdFx0XHRcdEByb3dzW3Jvd10ucHVzaChsYXllcilcblx0XHRcdFx0XG5cdFx0XHRcdEBjb2x1bW5zW2NvbF0gPz0gW11cblx0XHRcdFx0QGNvbHVtbnNbY29sXS5wdXNoKGxheWVyKVxuXHRcdFx0XHRcblx0XHRcdFx0aWYgYW5pbWF0ZVxuXHRcdFx0XHRcdGxheWVyLmFuaW1hdGVcblx0XHRcdFx0XHRcdHg6IEB4ICsgKGNvbCAqIChAd2lkdGggKyBAY29sdW1uTWFyZ2luKSlcblx0XHRcdFx0XHRcdHk6IEB5ICsgKHJvdyAqIChAaGVpZ2h0ICsgQHJvd01hcmdpbikpXG5cdFx0XHRcdFx0Y29udGludWVcblxuXHRcdFx0XHRfLmFzc2lnbiBsYXllcixcblx0XHRcdFx0XHR4OiBAeCArIChjb2wgKiAoQHdpZHRoICsgQGNvbHVtbk1hcmdpbikpXG5cdFx0XHRcdFx0eTogQHkgKyAocm93ICogKEBoZWlnaHQgKyBAcm93TWFyZ2luKSlcblx0XG5cdGcuX3JlZnJlc2goYXJyYXkpXG5cblx0cmV0dXJuIGdcblxuXG4jIG1ha2UgYSBncmlkIG91dCBvZiBhIGxheWVyLCBjb3B5aW5nIHRoZSBsYXllciB0byBmaWxsIHJvd3NcbiMgQGV4YW1wbGUgICAgVXRpbHMubWFrZUdyaWQobGF5ZXIsIDIsIDQsIDgsIDgpXG5VdGlscy5tYWtlR3JpZCA9IChsYXllciwgY29scyA9IDQsIHJvd3MgPSAxLCByb3dNYXJnaW4sIGNvbE1hcmdpbikgLT5cblx0bGF5ZXJzID0gW2xheWVyXVxuXHRcblx0Zm9yIGkgaW4gXy5yYW5nZSgoY29scyAqIHJvd3MpIC0gMSlcblx0XHRsYXllcnNbaSArIDFdID0gbGF5ZXIuY29weSgpXG5cdFx0bGF5ZXJzW2kgKyAxXS5wYXJlbnQgPSBsYXllci5wYXJlbnRcblx0XHRcblx0ZyA9IFV0aWxzLmdyaWQobGF5ZXJzLCBjb2xzLCByb3dNYXJnaW4sIGNvbE1hcmdpbilcblx0XG5cdHJldHVybiBnXG5cblxuXG4jIyNcbkNoYW5nZSBhIGxheWVyJ3Mgc2l6ZSB0byBmaXQgYXJvdW5kIHRoZSBsYXllcidzIGNoaWxkcmVuLlxuXG5AcGFyYW0ge0xheWVyfSBsYXllciBUaGUgcGFyZW50IGxheWVyIHRvIGNoYW5nZS5vc2l0aW9uLlxuQHBhcmFtIHtPYmplY3R9IFtwYWRkaW5nXSBUaGUgcGFkZGluZyB0byB1c2UgZm9yIHRoZSBodWcuXG5cblx0VXRpbHMuaHVnKGxheWVyQSlcblxuXHRVdGlscy5odWcobGF5ZXJBLCAzMilcblxuXHRVdGlscy5odWcobGF5ZXJBLCB7dG9wOiAxNiwgYm90dG9tOiAyNH0pXG4jIyNcblV0aWxzLmh1ZyA9IChsYXllciwgcGFkZGluZykgLT5cblxuXHRkZWYgPSAwXG5cdGRlZlN0YWNrID0gdW5kZWZpbmVkXG5cblx0aWYgdHlwZW9mIHBhZGRpbmcgaXMgXCJudW1iZXJcIiBcblx0XHRkZWYgPSBwYWRkaW5nXG5cdFx0ZGVmU3RhY2sgPSBwYWRkaW5nXG5cdFx0cGFkZGluZyA9IHt9XG5cblx0Xy5kZWZhdWx0cyBwYWRkaW5nLFxuXHRcdHRvcDogZGVmXG5cdFx0Ym90dG9tOiBkZWZcblx0XHRsZWZ0OiBkZWZcblx0XHRyaWdodDogZGVmXG5cdFx0c3RhY2s6IGRlZlN0YWNrXG5cblx0VXRpbHMuYmluZCBsYXllciwgLT5cblx0XHRmb3IgY2hpbGQsIGkgaW4gQGNoaWxkcmVuXG5cblx0XHRcdGNoaWxkLnkgKz0gQHBhZGRpbmcudG9wXG5cblx0XHRcdGNoaWxkLnggKz0gQHBhZGRpbmcubGVmdFxuXG5cdFx0XHRpZiBAcGFkZGluZy5yaWdodD8gPiAwXG5cdFx0XHRcdEB3aWR0aCA9IF8ubWF4QnkoQGNoaWxkcmVuLCAnbWF4WScpPy5tYXhZICsgQHBhZGRpbmcucmlnaHRcblxuXHRcdGlmIEBwYWRkaW5nLnN0YWNrPyA+PSAwXG5cdFx0XHRVdGlscy5vZmZzZXRZKEBjaGlsZHJlbiwgQHBhZGRpbmcuc3RhY2spXG5cdFx0XHRVdGlscy5kZWxheSAwLCA9PlxuXHRcdFx0XHRVdGlscy5jb250YWluKEAsIGZhbHNlLCBAcGFkZGluZy5yaWdodCwgQHBhZGRpbmcuYm90dG9tKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRVdGlscy5jb250YWluKEAsIGZhbHNlLCBAcGFkZGluZy5yaWdodCwgQHBhZGRpbmcuYm90dG9tKVxuXG5cbiMjI1xuSW5jcmVhc2Ugb3IgZGVjcmVhc2UgYSBsYXllcidzIHNpemUgdG8gY29udGFpbiBpdHMgbGF5ZXIncyBjaGlsZHJlbi5cblxuQHBhcmFtIHtMYXllcn0gbGF5ZXIgVGhlIHBhcmVudCBsYXllciB0byBjaGFuZ2Ugc2l6ZS5cbkBwYXJhbSB7Qm9vbGVhbn0gZml0IFdoZXRoZXIgdG8gbGltaXQgc2l6ZSBjaGFuZ2UgdG8gaW5jcmVhc2Ugb25seS5cbkBwYXJhbSB7TnVtYmVyfSBwYWRkaW5nWCBFeHRyYSBzcGFjZSB0byBhZGQgdG8gdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIG5ldyBzaXplLlxuQHBhcmFtIHtOdW1iZXJ9IHBhZGRpbmdZIEV4dHJhIHNwYWNlIHRvIGFkZCB0byB0aGUgYm90dG9tIG9mIHRoZSBuZXcgc2l6ZS5cblxuXHRVdGlscy5jb250YWluKGxheWVyQSlcbiMjI1xuVXRpbHMuY29udGFpbiA9IChsYXllciwgZml0ID0gZmFsc2UsIHBhZGRpbmdYID0gMCwgcGFkZGluZ1kgPSAwKSAtPlxuXHRyZXR1cm4gaWYgbGF5ZXIuY2hpbGRyZW4ubGVuZ3RoIGlzIDBcblxuXHRtYXhDaGlsZFggPSBfLm1heEJ5KGxheWVyLmNoaWxkcmVuLCAnbWF4WCcpPy5tYXhYICsgcGFkZGluZ1hcblx0bWF4Q2hpbGRZID0gXy5tYXhCeShsYXllci5jaGlsZHJlbiwgJ21heFknKT8ubWF4WSArIHBhZGRpbmdZXG5cblx0aWYgZml0XG5cdFx0bGF5ZXIucHJvcHMgPSBcblx0XHRcdHdpZHRoOiBNYXRoLm1heChsYXllci53aWR0aCwgbWF4Q2hpbGRYKVxuXHRcdFx0aGVpZ2h0OiBNYXRoLm1heChsYXllci5oZWlnaHQsIG1heENoaWxkWSlcblx0XHRyZXR1cm4gXG5cblx0bGF5ZXIucHJvcHMgPSBcblx0XHR3aWR0aDogbWF4Q2hpbGRYXG5cdFx0aGVpZ2h0OiBtYXhDaGlsZFlcblxuXHRyZXR1cm4gbGF5ZXJcblxuIyBnZXQgYSBzdGF0dXMgY29sb3IgYmFzZWQgb24gYSBzdGFuZGFyZCBkZXZpYXRpb25cbiMgQGV4YW1wbGUgICAgVXRpbHMuZ2V0U3RhdHVzQ29sb3IoLjA0LCBmYWxzZSlcblV0aWxzLmdldFN0YXR1c0NvbG9yID0gKGRldiwgbG93ZXJCZXR0ZXIgPSBmYWxzZSkgLT5cblx0XG5cdGNvbG9ycyA9IFsnI2VjNDc0MScsICcjZjQ4ODQ3JywgJyNmZmM4NGEnLCAnI2E3YzU0YicsICcjNGZiZjRmJ11cblx0XG5cdGlmIGxvd2VyQmV0dGVyIHRoZW4gZGV2ID0gLWRldlxuXHRcblx0Y29sb3IgPSBVdGlscy5tb2R1bGF0ZShkZXYsIFstLjEsIDAuMV0sIFswLCBjb2xvcnMubGVuZ3RoIC0gMV0sIGZhbHNlKVxuXHRcblx0cmV0dXJuIGNvbG9yc1tjb2xvci50b0ZpeGVkKCldXG5cblxuIyBDaGFpbiBhbiBhcnJheSBvZiBhbmltYXRpb25zLCBvcHRpb25hbGx5IGxvb3BpbmcgdGhlbVxuIyBAZXhhbXBsZSAgICBVdGlscy5jaGFpbkFuaW1hdGlvbnMoW2FycmF5T2ZBbmltYXRpb25zXSwgZmFsc2UpXG5VdGlscy5jaGFpbkFuaW1hdGlvbnMgPSAoYW5pbWF0aW9ucy4uLikgLT5cblx0bG9vcGluZyA9IHRydWVcblx0XG5cdGlmIHR5cGVvZiBfLmxhc3QoYW5pbWF0aW9ucykgaXMgXCJib29sZWFuXCJcblx0XHRsb29waW5nID0gYW5pbWF0aW9ucy5wb3AoKVxuXHRcblx0aiA9IGFuaW1hdGlvbnMubGVuZ3RoIC0gMVxuXHRmb3IgYW5pbSwgaSBpbiBhbmltYXRpb25zXG5cdFx0ZG8gKGksIGFuaW1hdGlvbnMpIC0+XG5cdFx0XHRpZiBhbmltIGlzIGFuaW1hdGlvbnNbal0gYW5kIGxvb3Bpbmdcblx0XHRcdFx0YW5pbS5vbkFuaW1hdGlvbkVuZCAtPlxuXHRcdFx0XHRcdGFuaW1hdGlvbnNbMF0/LnJlc2V0KClcblx0XHRcdFx0XHRVdGlscy5kZWxheSAwLCAtPiBhbmltYXRpb25zWzBdPy5zdGFydCgpXG5cdFx0XHRcblx0XHRcdGFuaW0ub25BbmltYXRpb25FbmQgLT5cblx0XHRcdFx0YW5pbWF0aW9uc1tpICsgMV0/LnJlc3RhcnQoKVxuXHRcdFxuXHRVdGlscy5kZWxheSAwLCAtPiBhbmltYXRpb25zWzBdLnJlc3RhcnQoKVxuXG5cbiMgQ2hlY2sgd2hldGhlciBhIHBvaW50IGV4aXN0cyB3aXRoaW4gYSBwb2x5Z29uLCBkZWZpbmVkIGJ5IGFuIGFycmF5IG9mIHBvaW50c1xuIyBOb3RlOiB0aGlzIHJlcGxhY2VzIEZyYW1lcidzIGV4aXN0aW5nIChidXQgYnJva2VuKSBVdGlscy5wb2ludEluUG9seWdvbiBtZXRob2QuXG4jIEBleGFtcGxlXHRVdGlscy5wb2ludEluUG9sZ3lnb24oe3g6IDIsIHk6IDEyfSwgW10pXG5VdGlscy5wb2ludEluUG9seWdvbiA9IChwb2ludCwgdnMgPSBbXSkgLT5cblxuXHRpZiB2c1swXS54PyB0aGVuIHZzID0gXy5tYXAgdnMsIChwKSAtPiBbcC54LCBwLnldXG5cblx0IyBkZXRlcm1pbmUgd2hldGhlciB0byBhbmFseXplIHBvaW50cyBpbiBjb3VudGVyY2xvY2t3aXNlIG9yZGVyXG5cdGNjdyA9IChBLEIsQykgLT4gcmV0dXJuIChDWzFdLUFbMV0pKihCWzBdLUFbMF0pID4gKEJbMV0tQVsxXSkqKENbMF0tQVswXSlcblxuXHQjIGRldGVybWluZSB3aGV0aGVyIHR3byBsaW5lcyBpbnRlcnNlY3Rcblx0aW50ZXJzZWN0ID0gKEEsQixDLEQpIC0+IHJldHVybiAoY2N3KEEsQyxEKSBpc250IGNjdyhCLEMsRCkpIGFuZCAoY2N3KEEsQixDKSBpc250IGNjdyhBLEIsRCkpXG5cdFxuXHRpbnNpZGUgPSBmYWxzZVxuXHRpID0gMFxuXHRqID0gdnMubGVuZ3RoIC0gMVxuXHRcblx0d2hpbGUgaSA8IHZzLmxlbmd0aFxuXHRcblx0XHRpZiBpbnRlcnNlY3QoWy05OTk5OTksIHBvaW50LnldLCBbcG9pbnQueCwgcG9pbnQueV0sIHZzW2ldLCB2c1tqXSlcblx0XHRcdGluc2lkZSA9ICFpbnNpZGVcblx0XHRqID0gaSsrXG5cdFxuXHRyZXR1cm4gaW5zaWRlXG5cbiMgQ2hlY2tzIHdoZXRoZXIgYSBwb2ludCBpcyB3aXRoaW4gYSBMYXllcidzIGZyYW1lLiBXb3JrcyBiZXN0IHdpdGggZXZlbnQuY29udGV4dFBvaW50IVxuI1xuIyBAZXhhbXBsZVx0XG4jXG4jIGxheWVyLm9uTW91c2VNb3ZlIChldmVudCkgLT4gXG4jXHRmb3IgYnV0dG9uTGF5ZXIgaW4gYnV0dG9uTGF5ZXJzXG4jXHRcdHByaW50IFV0aWxzLnBvaW50SW5MYXllcihidXR0b25MYXllcilcbiNcblV0aWxzLnBvaW50SW5MYXllciA9IChwb2ludCwgbGF5ZXIpIC0+XG5cdHJldHVybiBVdGlscy5wb2ludEluUG9seWdvbihwb2ludCwgVXRpbHMucG9pbnRzRnJvbUZyYW1lKGxheWVyKSlcblxuXG4jIEdldCB0aGUgbGF5ZXIgdW5kZXIgYSBzY3JlZW4gcG9pbnQuIElmIG11bHRpcGxlIGxheWVycyBvdmVybGFwLCBsYXllcnMgb3ZlcmxhcHBlZFxuIyBieSB0aGVpciBjaGlsZHJlbiB3aWxsIGJlIGlnbm9yZWQsIGFuZCB0aGUgbGF5ZXIgd2l0aCB0aGUgaGlnaGVzdCBpbmRleCB3aWxsIGJlXG4jIHJldHVybmVkLiBXb3JrcyBiZXN0IHdpdGggZXZlbnQuY29udGV4dFBvaW50IVxuI1xuIyBAZXhhbXBsZVx0XG4jXG4jIG15TGF5ZXIub25Nb3VzZU1vdmUgKGV2ZW50KSAtPiBcbiNcdHByaW50IFV0aWxzLmdldExheWVyQXRQb2ludChldmVudC5jb250ZXh0UG9pbnQpXG4jXG5VdGlscy5nZXRMYXllckF0UG9pbnQgPSAocG9pbnQsIGFycmF5ID0gRnJhbWVyLkN1cnJlbnRDb250ZXh0Ll9sYXllcnMpIC0+XG5cdHVuZGVyID0gVXRpbHMuZ2V0TGF5ZXJzQXRQb2ludChldmVudC5wb2ludCwgYXJyYXkpXG5cdFxuXHR2YWxpZCA9IFtdXG5cblx0Zm9yIGxheWVyIGluIHVuZGVyXG5cdFx0aWYgXy5pbnRlcnNlY3Rpb24odW5kZXIsIGxheWVyLmNoaWxkcmVuKS5sZW5ndGggPiAwXG5cdFx0XHRjb250aW51ZVxuXHRcdHZhbGlkLnB1c2gobGF5ZXIpXG5cblx0cmV0dXJuIF8ubWF4QnkodmFsaWQsICdpbmRleCcpID8gbnVsbFxuXG4jIEdldCBhbiBhcnJheSBvZiBhbGwgbGF5ZXJzIHVuZGVyIGEgc2NyZWVuIHBvaW50LiBCeSBkZWZhdWx0LCBpdCB3aWxsIGNoZWNrIFxuIyBhbGwgbGF5ZXJzIGluIHRoZSBjdXJyZW50IEZyYW1lciBjb250ZXh0OyBidXQgeW91IGNhbiBzcGVjaWZ5IHlvdXIgb3duIGFycmF5IG9mXG4jIGxheWVycyBpbnN0ZWFkLiBXb3JrcyBiZXN0IHdpdGggZXZlbnQuY29udGV4dFBvaW50IVxuI1xuIyBAZXhhbXBsZVx0XG4jXG4jIG15TGF5ZXIub25Nb3VzZU1vdmUgKGV2ZW50KSAtPiBcbiNcdHByaW50IFV0aWxzLmdldExheWVyc0F0UG9pbnQoZXZlbnQuY29udGV4dFBvaW50KVxuI1xuVXRpbHMuZ2V0TGF5ZXJzQXRQb2ludCA9IChwb2ludCwgYXJyYXkgPSBGcmFtZXIuQ3VycmVudENvbnRleHQuX2xheWVycykgLT5cblx0XG5cdGxheWVycyA9IFtdXG5cdFxuXHRmb3IgbGF5ZXIsIGkgaW4gYXJyYXlcblx0XHRpZiBVdGlscy5wb2ludEluUG9seWdvbihwb2ludCwgVXRpbHMucG9pbnRzRnJvbUZyYW1lKGxheWVyKSlcblx0XHRcdGxheWVycy5wdXNoKGxheWVyKVxuXHRcdFx0XG5cdHJldHVybiBsYXllcnNcblxuIyBUcnkgdG8gZmluZCB0aGUgbGF5ZXIgdGhhdCBvd25zIGEgZ2l2ZW4gSFRNTCBlbGVtZW50LiBCeSBkZWZhdWx0LCBpdCB3aWxsIGNoZWNrIFxuIyBhbGwgbGF5ZXJzIGluIHRoZSBjdXJyZW50IEZyYW1lciBjb250ZXh0OyBidXQgeW91IGNhbiBzcGVjaWZ5IHlvdXIgb3duIGFycmF5IG9mXG4jIGxheWVycyBpbnN0ZWFkLlxuI1xuIyBAZXhhbXBsZVx0XG4jXG4jIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZW1vdmVcIiwgKGV2ZW50KSAtPiBcbiNcdHByaW50IFV0aWxzLmdldExheWVyRnJvbUVsZW1lbnQoZXZlbnQudGFyZ2V0KVxuI1xuVXRpbHMuZ2V0TGF5ZXJGcm9tRWxlbWVudCA9IChlbGVtZW50LCBhcnJheSA9IEZyYW1lci5DdXJyZW50Q29udGV4dC5fbGF5ZXJzKSA9PlxuXHRyZXR1cm4gaWYgbm90IGVsZW1lbnRcblx0XG5cdGZpbmRMYXllckVsZW1lbnQgPSAoZWxlbWVudCkgLT5cblx0XHRyZXR1cm4gaWYgbm90IGVsZW1lbnQ/LmNsYXNzTGlzdFxuXHRcdFxuXHRcdGlmIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmcmFtZXJMYXllcicpXG5cdFx0XHRyZXR1cm4gZWxlbWVudFxuXHRcdFx0XG5cdFx0ZmluZExheWVyRWxlbWVudChlbGVtZW50LnBhcmVudE5vZGUpXG5cdFxuXHRsYXllckVsZW1lbnQgPSBmaW5kTGF5ZXJFbGVtZW50KGVsZW1lbnQpXG5cdHJldHVybiBfLmZpbmQoYXJyYXksIChsKSAtPiBsLl9lbGVtZW50IGlzIGxheWVyRWxlbWVudCkgPyBudWxsXG5cbiMgR2V0IGFuIG9yZGluYWwgZm9yIGEgZGF0ZVxuI1xuIyBAZXhhbXBsZVx0XG4jXG4jIG51bSA9IDJcbiMgZGF0ZS50ZXh0ID0gbnVtICsgVXRpbHMuZ2V0T3JkaW5hbChudW0pXG4jXG5VdGlscy5nZXRPcmRpbmFsID0gKG51bWJlcikgLT5cblx0c3dpdGNoIG51bWJlciAlIDEwXHRcblx0XHR3aGVuIDEgdGhlbiByZXR1cm4gJ3N0J1x0XG5cdFx0d2hlbiAyIHRoZW4gcmV0dXJuICduZCdcdFxuXHRcdHdoZW4gMyB0aGVuIHJldHVybiAncmQnXHRcblx0XHRlbHNlIHJldHVybiAndGgnXG5cbiMgQ29udmVydCBhIG51bWJlciB0byB0aGUgcmlnaHQgbnVtYmVyIG9mIHBpeGVscy5cbiNcbiMgQGV4YW1wbGVcdFxuI1xuIyBsYXllci5fZWxlbWVudC5zdHlsZS5ib3JkZXJXaWR0aCA9IFV0aWxzLnB4KDQpXG4jXG5VdGlscy5weCA9IChudW0pIC0+XG5cdHJldHVybiAobnVtICogRnJhbWVyLkRldmljZS5jb250ZXh0LnNjYWxlKSArICdweCdcblxuIyBMaW5rIGxheWVyQidzIHByb3BlcnR5IHRvIGFsd2F5cyBtYXRjaCBsYXllckEncyBwcm9wZXJ0eS5cbiNcbiMgQGV4YW1wbGVcdFxuI1xuIyBVdGlscy5saW5rUHJvcGVydGllcyhsYXllckEsIGxheWVyQiwgJ3gnKVxuI1xuVXRpbHMubGlua1Byb3BlcnRpZXMgPSAobGF5ZXJBLCBsYXllckIsIHByb3BzLi4uKSAtPlxuXHRwcm9wcy5mb3JFYWNoIChwcm9wKSAtPlxuXHRcdHVwZGF0ZSA9IC0+IGxheWVyQltwcm9wXSA9IGxheWVyQVtwcm9wXVxuXHRcdGxheWVyQS5vbiBcImNoYW5nZToje3Byb3B9XCIsIHVwZGF0ZVxuXHRcdHVwZGF0ZSgpXG5cblxuXG5cblxuIyBDb3B5IHRleHQgdG8gdGhlIGNsaXBib2FyZC5cbiNcbiMgQGV4YW1wbGVcbiMgVXRpbHMuY29weVRleHRUb0NsaXBib2FyZChteVRleHRMYXllci50ZXh0KVxuI1xuVXRpbHMuY29weVRleHRUb0NsaXBib2FyZCA9ICh0ZXh0KSAtPlxuXHRjb3B5RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgXCJ0ZXh0YXJlYVwiXG5cdGNvcHlFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwXG5cblx0Y3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZyYW1lckNvbnRleHRcIilbMF1cblx0Y3R4LmFwcGVuZENoaWxkKGNvcHlFbGVtZW50KVxuXG5cdGNvcHlFbGVtZW50LnZhbHVlID0gdGV4dFxuXHRjb3B5RWxlbWVudC5zZWxlY3QoKVxuXHRkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpXG5cdGNvcHlFbGVtZW50LmJsdXIoKVxuXG5cdGN0eC5yZW1vdmVDaGlsZChjb3B5RWxlbWVudClcblxuIyBSdW4gYSBVUkwgdGhyb3VnaCBGcmFtZXIncyBDT1JTcHJveHksIHRvIHByZXZlbnQgY3Jvc3Mtb3JpZ2luIGlzc3Vlcy5cbiMgVGhhbmtzIHRvIEBtYXJja3Jlbm46IGh0dHBzOi8vZ29vLmdsL1VoRnc5eVxuI1xuIyBAZXhhbXBsZVxuIyBmZXRjaChVdGlscy5DT1JTcHJveHkodXJsKSkudGhlbihjYWxsYmFjaylcbiNcblV0aWxzLkNPUlNwcm94eSA9ICh1cmwpIC0+XG5cblx0IyBEZXRlY3QgbG9jYWwgSVB2NC9JdlA2IGFkZHJlc3Nlc1xuXHQjIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMTMyNzM0NVxuXHRyZWdleHAgPSAvKF4xMjdcXC4pfCheMTkyXFwuMTY4XFwuKXwoXjEwXFwuKXwoXjE3MlxcLjFbNi05XVxcLil8KF4xNzJcXC4yWzAtOV1cXC4pfCheMTcyXFwuM1swLTFdXFwuKXwoXjo6MSQpfCheW2ZGXVtjQ2REXSkvXG5cblx0aWYgcmVnZXhwLnRlc3Qod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKVxuXHRcdHJldHVybiBcImh0dHA6Ly8je3dpbmRvdy5sb2NhdGlvbi5ob3N0fS9fc2VydmVyL3Byb3h5LyN7dXJsfVwiXG5cdFxuXHRyZXR1cm4gXCJodHRwczovL2NvcnMtYW55d2hlcmUuaGVyb2t1YXBwLmNvbS8je3VybH1cIlxuXG4jIFNldCB0aGUgYXR0cmlidXRlcyBvZiBhIERPTSBlbGVtZW50LlxuI1xuIyBAZXhhbXBsZVxuIyBVdGlscy5zZXRBdHRyaWJ1dGVzIG15SFRNTElucHV0LCB7YXV0b2NvcnJlY3Q6ICdvZmYnfVxuI1xuVXRpbHMuc2V0QXR0cmlidXRlcyA9IChlbGVtZW50LCBhdHRyaWJ1dGVzID0ge30pIC0+XG5cdGZvciBrZXksIHZhbHVlIG9mIGF0dHJpYnV0ZXNcblx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKVxuXG4jIFVzZSBpbmxpbmUgc3R5bGVzIHdpdGggYSBUZXh0TGF5ZXIuXG4jXG4jIEBleGFtcGxlXG4jIG15VGV4dExheWVyLnRleHQgPSBcIlRoaXMgaXMgYSAqKmJvbGQqKiBzdGF0ZW1lbnQuXCJcbiMgVXRpbHMudG9NYXJrZG93bihteVRleHRMYXllcilcbiNcblV0aWxzLnRvTWFya2Rvd24gPSAodGV4dExheWVyKSAtPlxuXHRcblx0aWYgbm90IHRleHRMYXllciBpbnN0YW5jZW9mIFRleHRMYXllclxuXHRcdHRocm93IFwiVXRpbHMudG9NYXJrZG93biBvbmx5IHdvcmtzIHdpdGggVGV4dExheWVycy5cIlxuXG5cdGxvb3BTdHJpbmcgPSAoc3RyaW5nLCByZWcpIC0+XG5cdFx0aWYgbm90IHN0cmluZy5tYXRjaChyZWdbMF0pXG5cdFx0XHRyZXR1cm4gc3RyaW5nIFxuXG5cdFx0bG9vcFN0cmluZyhzdHJpbmcucmVwbGFjZShyZWdbMF0sIHJlZ1sxXSksIHJlZylcblxuXHRyZWdleGVzID0gW1xuXHRcdFsvXFxbKFteXFxbXSspXFxdXFwoKFteXFwpXSspXFwpLywgJzxhIGhyZWY9XFwnJDJcXCc+JDE8L2E+J11cblx0XHRbLyhcXCpcXCp8X18pKC4qPylcXDEvLCAnPGI+JDI8L2I+J11cblx0XHRbLyhcXCp8XykoLio/KVxcMS8sICc8aT4kMjwvaT4nXVxuXHRcdFsvXFx+XFx+KC4qPylcXH5cXH4vLCAnPGRlbD4kMTwvZGVsPiddXG5cdFx0Wy9gKC4qPylgLywgJzxjb2RlPiQxPC9jb2RlPiddXG5cdFx0XVxuXG5cdGZvciBlbCBpbiB0ZXh0TGF5ZXIuX2VsZW1lbnQuY2hpbGRyZW5bMV0uY2hpbGROb2Rlc1xuXHRcdGVsLmNoaWxkTm9kZXNbMF0uaW5uZXJIVE1MID0gXy5yZWR1Y2UocmVnZXhlcywgbG9vcFN0cmluZywgZWwuY2hpbGROb2Rlc1swXS5pbm5lckhUTUwpXG5cdFxuXHRkbyBfLmJpbmQoIC0+XG5cdFx0Zm9yY2VSZW5kZXIgPSBmYWxzZVxuXHRcdEBfdXBkYXRlSFRNTFNjYWxlKClcblx0XHRpZiBub3QgQGF1dG9TaXplXG5cdFx0XHRpZiBAd2lkdGggPCBAX2VsZW1lbnRIVE1MLmNsaWVudFdpZHRoIG9yIEBoZWlnaHQgPCBAX2VsZW1lbnRIVE1MLmNsaWVudEhlaWdodFxuXHRcdFx0XHRAY2xpcCA9IHRydWVcblx0XHRyZXR1cm4gdW5sZXNzIGZvcmNlUmVuZGVyIG9yIEBhdXRvSGVpZ2h0IG9yIEBhdXRvV2lkdGggb3IgQHRleHRPdmVyZmxvdyBpc250IG51bGxcblx0XHRwYXJlbnRXaWR0aCA9IGlmIEBwYXJlbnQ/IHRoZW4gQHBhcmVudC53aWR0aCBlbHNlIFNjcmVlbi53aWR0aFxuXHRcdGNvbnN0cmFpbmVkV2lkdGggPSBpZiBAYXV0b1dpZHRoIHRoZW4gcGFyZW50V2lkdGggZWxzZSBAc2l6ZS53aWR0aFxuXHRcdHBhZGRpbmcgPSBVdGlscy5yZWN0WmVybyhVdGlscy5wYXJzZVJlY3QoQHBhZGRpbmcpKVxuXHRcdGNvbnN0cmFpbmVkV2lkdGggLT0gKHBhZGRpbmcubGVmdCArIHBhZGRpbmcucmlnaHQpXG5cdFx0aWYgQGF1dG9IZWlnaHRcblx0XHRcdGNvbnN0cmFpbmVkSGVpZ2h0ID0gbnVsbFxuXHRcdGVsc2Vcblx0XHRcdGNvbnN0cmFpbmVkSGVpZ2h0ID0gQHNpemUuaGVpZ2h0IC0gKHBhZGRpbmcudG9wICsgcGFkZGluZy5ib3R0b20pXG5cdFx0Y29uc3RyYWludHMgPVxuXHRcdFx0d2lkdGg6IGNvbnN0cmFpbmVkV2lkdGhcblx0XHRcdGhlaWdodDogY29uc3RyYWluZWRIZWlnaHRcblx0XHRcdG11bHRpcGxpZXI6IEBjb250ZXh0LnBpeGVsTXVsdGlwbGllclxuXG5cdFx0Y2FsY3VsYXRlZFNpemUgPSBAX3N0eWxlZFRleHQubWVhc3VyZSBjb25zdHJhaW50c1xuXHRcdEBkaXNhYmxlQXV0b3NpemVVcGRhdGluZyA9IHRydWVcblx0XHRpZiBjYWxjdWxhdGVkU2l6ZS53aWR0aD9cblx0XHRcdEB3aWR0aCA9IGNhbGN1bGF0ZWRTaXplLndpZHRoICsgcGFkZGluZy5sZWZ0ICsgcGFkZGluZy5yaWdodFxuXHRcdGlmIGNhbGN1bGF0ZWRTaXplLmhlaWdodD9cblx0XHRcdEBoZWlnaHQgPSBjYWxjdWxhdGVkU2l6ZS5oZWlnaHQgKyBwYWRkaW5nLnRvcCArIHBhZGRpbmcuYm90dG9tXG5cdFx0QGRpc2FibGVBdXRvc2l6ZVVwZGF0aW5nID0gZmFsc2Vcblx0LCB0ZXh0TGF5ZXIpXG5cdFx0XG5cdHRleHRMYXllci5lbWl0IFwiY2hhbmdlOnRleHRcIiwgdGV4dExheWVyLnRleHQsIHRleHRMYXllclxuXG4jIE1ha2UgYW4gYXN5bmNyb25vdXMgcmVxdWVzdFxuI1xuIyBAZXhhbXBsZSBGZXRjaCBhbmQgcmV0dXJuIGEgUmVzcG9uc2Ugb2JqZWN0LlxuI1x0VXRpbHMuZmV0Y2ggJ2h0dHA6Ly9leGFtcGxlLmNvbS9hbnN3ZXInLCAoZCkgLT4gcHJpbnQgZFxuI1xuIyBAcGFyYW0gW1N0cmluZ10gdXJsIHRoZSB1cmwgdG8gZmV0Y2gsIHJldHVybnMgYSBSZXNwb25zZVxuIyBAcGFyYW0gW0Z1bmN0aW9uXSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgdG8gcnVuIHdpdGggdGhlIHJldHVybmVkIGRhdGFcbiNcblV0aWxzLmZldGNoID0gKHVybCwgY2FsbGJhY2spIC0+XG5cdHVubGVzcyB1cmwuaW5jbHVkZXMgJ2NvcnMtYW55d2hlcmUnXG5cdFx0dXJsID0gVXRpbHMuQ09SU3Byb3h5KHVybClcblx0XG5cdGZldGNoKHVybCwgeydtZXRob2QnOiAnR0VUJywgJ21vZGUnOiAnY29ycyd9KS50aGVuKCBjYWxsYmFjayApXG5cblxuIyBNYWtlIGFuIGFzeW5jcm9ub3VzIHJlcXVlc3QgYW5kIHJldHVybiBKU09OLlxuI1xuIyBAZXhhbXBsZSBGZXRjaCBhbmQgcmV0dXJuIGEgSlNPTiBvYmplY3QuXG4jXHRVdGlscy5mZXRjaEpTT04gJ2h0dHA6Ly9leGFtcGxlLmNvbS9hbnN3ZXInLCAoZCkgLT4gcHJpbnQgZFxuI1xuIyBAcGFyYW0gW1N0cmluZ10gdXJsIHRoZSB1cmwgdG8gZmV0Y2gsIHJldHVybnMgSlNPTiBvYmplY3RcbiMgQHBhcmFtIFtGdW5jdGlvbl0gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIHRvIHJ1biB3aXRoIHRoZSByZXR1cm5lZCBkYXRhXG4jXG5VdGlscy5mZXRjaEpTT04gPSAodXJsLCBjYWxsYmFjaykgLT5cblx0dW5sZXNzIHVybC5pbmNsdWRlcyAnY29ycy1hbnl3aGVyZSdcblx0XHR1cmwgPSBVdGlscy5DT1JTcHJveHkodXJsKVxuXHRcblx0ZmV0Y2godXJsLCB7J21ldGhvZCc6ICdHRVQnLCAnbW9kZSc6ICdjb3JzJ30pLnRoZW4oIFxuXHRcdChyKSAtPiByLmpzb24oKS50aGVuKCBjYWxsYmFjayApXG5cdFx0KVxuXG5cbiMgUmV0dXJuIGEgcmFuZG9tIHRleHQgc3RyaW5nLlxuI1xuIyBAZXhhbXBsZSBHZW5lcmF0ZSBwbGFpbiB0ZXh0LlxuI1x0VXRpbHMucmFuZG9tVGV4dCg0KSBcbiNcdMK7IFwiYXV0IGV4cGVkaXRhIGF1dCBmdWdpdFwiXG4jXG4jIEBleGFtcGxlIEdlbmVyYXRlIHNlbnRlbmNlcy5cbiNcdFV0aWxzLnJhbmRvbVRleHQoNCwgdHJ1ZSlcbiNcdMK7IFwiU29sdXRhIGRvbG9yIHRlbXBvcmUgcGFyaWF0dXIuXCJcbiNcbiMgQCBwYXJhbSBbSW50ZWdlcl0gd29yZHMgVGhlIG51bWJlciBvZiB3b3JkcyB0byByZXR1cm5cbiMgQCBwYXJhbSBbQm9vbGVhbl0gW3NlbnRlbmNlc10gV2hldGhlciB0byBzcGxpdCB0aGUgd29yZHMgaW50byBzZW50ZW5jZXNcbiMgQCBwYXJhbSBbQm9vbGVhbl0gW3BhcmFncmFwaHNdIFdoZXRoZXIgdG8gc3BsaXQgdGhlIHdvcmRzIGludG8gcGFyYWdyYXBoc1xuI1xuVXRpbHMucmFuZG9tVGV4dCA9ICh3b3JkcyA9IDEyLCBzZW50ZW5jZXMgPSBmYWxzZSwgcGFyYWdyYXBocyA9IGZhbHNlKSAtPlxuXHR0ZXh0ID0gQXJyYXkuZnJvbSh7bGVuZ3RoOiB3b3Jkc30sIC0+IF8uc2FtcGxlKGxvcmVtU291cmNlKSlcblxuXHR1bmxlc3Mgc2VudGVuY2VzIFxuXHRcdHJldHVybiB0ZXh0LmpvaW4oJyAnKVxuXG5cdGlmIHdvcmRzIDw9IDNcblx0XHRyZXR1cm4gXy5jYXBpdGFsaXplKCBfLnNhbXBsZVNpemUodGV4dCwgMykuam9pbignICcpICkgKyAnLidcblxuXHQjIG1ha2Ugc2VudGVuY2VzXG5cblx0c2VudGVuY2VzID0gW11cblxuXHR3aGlsZSB0ZXh0Lmxlbmd0aCA+IDBcblx0XHRpZiB0ZXh0Lmxlbmd0aCA8PSAzXG5cdFx0XHRfLnNhbXBsZShzZW50ZW5jZXMpLnB1c2godGV4dC5wb3AoKSlcblx0XHRcdGNvbnRpbnVlIFxuXG5cdFx0bGVuZ3RoID0gXy5jbGFtcChfLnJhbmRvbSgzLCA2KSwgMCwgdGV4dC5sZW5ndGgpXG5cdFx0c2VudGVuY2VzLnB1c2goXy5wdWxsQXQodGV4dCwgWzAuLi5sZW5ndGhdKSlcblxuXHRpZiBzZW50ZW5jZXMubGVuZ3RoIDwgM1xuXHRcdHBhcmFncmFwaHMgPSBmYWxzZVxuXHRcblx0dW5sZXNzIHBhcmFncmFwaHNcblx0XHRyZXR1cm4gc2VudGVuY2VzLm1hcCggKGEpIC0+XG5cdFx0XHRfLmNhcGl0YWxpemUoIGEuam9pbignICcpICkgKyAnLidcblx0XHRcdCkuam9pbignICcpXG5cblx0IyBtYWtlIHBhcmFncmFwaHNcblxuXHRwYXJhZ3JhcGhzID0gW11cblxuXHR3aGlsZSBzZW50ZW5jZXMubGVuZ3RoID4gMFxuXHRcdGlmIHNlbnRlbmNlcy5sZW5ndGggPD0gMyBhbmQgcGFyYWdyYXBocy5sZW5ndGggPiAwXG5cdFx0XHRfLnNhbXBsZShwYXJhZ3JhcGhzKS5wdXNoKHNlbnRlbmNlcy5wb3AoKSlcblx0XHRcdGNvbnRpbnVlIFxuXG5cdFx0bGVuZ3RoID0gXy5jbGFtcChfLnJhbmRvbSgzLCA2KSwgMCwgc2VudGVuY2VzLmxlbmd0aClcblx0XHRwYXJhZ3JhcGhzLnB1c2goXy5wdWxsQXQoc2VudGVuY2VzLCBbMC4uLmxlbmd0aF0pKVxuXG5cdCMgTWFrZSB0ZXh0XG5cblx0dGV4dCA9ICcnXG5cblx0Zm9yIHBhcmFncmFwaCBpbiBwYXJhZ3JhcGhzXG5cdFx0dGV4dCArPSBfLnJlZHVjZShcblx0XHRcdHBhcmFncmFwaCxcblx0XHRcdChzdHJpbmcsIHNlbnRlbmNlKSAtPlxuXHRcdFx0XHRzdHJpbmcgKz0gXy5jYXBpdGFsaXplKCBzZW50ZW5jZS5qb2luKCcgJykgKSArICcuICdcblx0XHRcdCcnKS50cmltKCkgKyAnXFxuXFxuJ1xuXG5cdHJldHVybiB0ZXh0LnRyaW0oKVxuXG4jIENoZWNrIHdoZXRoZXIgYSBzdHJpbmcgaXMgYSB2YWxpZCBlbWFpbC5cbiNcbiMgQHBhcmFtIHtTdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNoZWNrLlxuVXRpbHMuaXNFbWFpbCA9IChzdHJpbmcpIC0+XG4gICAgcmV0dXJuIHN0cmluZy50b0xvd2VyQ2FzZSgpLm1hdGNoKC9eKChbXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKFxcLltePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSspKil8KFwiLitcIikpQCgoXFxbWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfV0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvKVxuXG5cbiMgU291cmNlIHdvcmRzIGZvciBVdGlscy5yYW5kb21UZXh0KClcbiNcbmxvcmVtU291cmNlID0gW1wiYWxpYXNcIiwgXCJjb25zZXF1YXR1clwiLCBcImF1dFwiLCBcInBlcmZlcmVuZGlzXCIsIFwic2l0XCIsXG5cInZvbHVwdGF0ZW1cIiwgXCJhY2N1c2FudGl1bVwiLCBcImRvbG9yZW1xdWVcIiwgXCJhcGVyaWFtXCIsIFwiZWFxdWVcIiwgXCJpcHNhXCIsIFwicXVhZVwiLFxuXCJhYlwiLCBcImlsbG9cIiwgXCJpbnZlbnRvcmVcIiwgXCJ2ZXJpdGF0aXNcIiwgXCJldFwiLCBcInF1YXNpXCIsIFwiYXJjaGl0ZWN0b1wiLCBcImJlYXRhZVwiLFxuXCJ2aXRhZVwiLCBcImRpY3RhXCIsIFwic3VudFwiLCBcImV4cGxpY2Fib1wiLCBcImFzcGVybmF0dXJcIiwgXCJhdXRcIiwgXCJvZGl0XCIsIFwiYXV0XCIsXG5cImZ1Z2l0XCIsIFwic2VkXCIsIFwicXVpYVwiLCBcImNvbnNlcXV1bnR1clwiLCBcIm1hZ25pXCIsIFwiZG9sb3Jlc1wiLCBcImVvc1wiLCBcInF1aVwiLFxuXCJyYXRpb25lXCIsIFwidm9sdXB0YXRlbVwiLCBcInNlcXVpXCIsIFwibmVzY2l1bnRcIiwgXCJuZXF1ZVwiLCBcImRvbG9yZW1cIiwgXCJpcHN1bVwiLFxuXCJxdWlhXCIsIFwiZG9sb3JcIiwgXCJzaXRcIiwgXCJhbWV0XCIsIFwiY29uc2VjdGV0dXJcIiwgXCJhZGlwaXNjaVwiLCBcInZlbGl0XCIsIFwic2VkXCIsXG5cInF1aWFcIiwgXCJub25cIiwgXCJudW1xdWFtXCIsIFwiZWl1c1wiLCBcIm1vZGlcIiwgXCJ0ZW1wb3JhXCIsIFwiaW5jaWR1bnRcIiwgXCJ1dFwiLCBcImxhYm9yZVwiLFxuXCJldFwiLCBcImRvbG9yZVwiLCBcIm1hZ25hbVwiLCBcImFsaXF1YW1cIiwgXCJxdWFlcmF0XCIsIFwidm9sdXB0YXRlbVwiLCBcInV0XCIsIFwiZW5pbVwiLFxuXCJhZFwiLCBcIm1pbmltYVwiLCBcInZlbmlhbVwiLCBcInF1aXNcIiwgXCJub3N0cnVtXCIsIFwiZXhlcmNpdGF0aW9uZW1cIiwgXCJ1bGxhbVwiLFxuXCJjb3Jwb3Jpc1wiLCBcIm5lbW9cIiwgXCJlbmltXCIsIFwiaXBzYW1cIiwgXCJ2b2x1cHRhdGVtXCIsIFwicXVpYVwiLCBcInZvbHVwdGFzXCIsIFwic2l0XCIsXG5cInN1c2NpcGl0XCIsIFwibGFib3Jpb3NhbVwiLCBcIm5pc2lcIiwgXCJ1dFwiLCBcImFsaXF1aWRcIiwgXCJleFwiLCBcImVhXCIsIFwiY29tbW9kaVwiLFxuXCJjb25zZXF1YXR1clwiLCBcInF1aXNcIiwgXCJhdXRlbVwiLCBcInZlbFwiLCBcImV1bVwiLCBcIml1cmVcIiwgXCJyZXByZWhlbmRlcml0XCIsIFwicXVpXCIsXG5cImluXCIsIFwiZWFcIiwgXCJ2b2x1cHRhdGVcIiwgXCJ2ZWxpdFwiLCBcImVzc2VcIiwgXCJxdWFtXCIsIFwibmloaWxcIiwgXCJtb2xlc3RpYWVcIiwgXCJldFwiLFxuXCJpdXN0b1wiLCBcIm9kaW9cIiwgXCJkaWduaXNzaW1vc1wiLCBcImR1Y2ltdXNcIiwgXCJxdWlcIiwgXCJibGFuZGl0aWlzXCIsIFwicHJhZXNlbnRpdW1cIixcblwibGF1ZGFudGl1bVwiLCBcInRvdGFtXCIsIFwicmVtXCIsIFwidm9sdXB0YXR1bVwiLCBcImRlbGVuaXRpXCIsIFwiYXRxdWVcIiwgXCJjb3JydXB0aVwiLFxuXCJxdW9zXCIsIFwiZG9sb3Jlc1wiLCBcImV0XCIsIFwicXVhc1wiLCBcIm1vbGVzdGlhc1wiLCBcImV4Y2VwdHVyaVwiLCBcInNpbnRcIiwgXCJvY2NhZWNhdGlcIixcblwiY3VwaWRpdGF0ZVwiLCBcIm5vblwiLCBcInByb3ZpZGVudFwiLCBcInNlZFwiLCBcInV0XCIsIFwicGVyc3BpY2lhdGlzXCIsIFwidW5kZVwiLCBcIm9tbmlzXCIsXG5cImlzdGVcIiwgXCJuYXR1c1wiLCBcImVycm9yXCIsIFwic2ltaWxpcXVlXCIsIFwic3VudFwiLCBcImluXCIsIFwiY3VscGFcIiwgXCJxdWlcIiwgXCJvZmZpY2lhXCIsXG5cImRlc2VydW50XCIsIFwibW9sbGl0aWFcIiwgXCJhbmltaVwiLCBcImlkXCIsIFwiZXN0XCIsIFwibGFib3J1bVwiLCBcImV0XCIsIFwiZG9sb3J1bVwiLFxuXCJmdWdhXCIsIFwiZXRcIiwgXCJoYXJ1bVwiLCBcInF1aWRlbVwiLCBcInJlcnVtXCIsIFwiZmFjaWxpc1wiLCBcImVzdFwiLCBcImV0XCIsIFwiZXhwZWRpdGFcIixcblwiZGlzdGluY3Rpb1wiLCBcIm5hbVwiLCBcImxpYmVyb1wiLCBcInRlbXBvcmVcIiwgXCJjdW1cIiwgXCJzb2x1dGFcIiwgXCJub2Jpc1wiLCBcImVzdFwiLFxuXCJlbGlnZW5kaVwiLCBcIm9wdGlvXCIsIFwiY3VtcXVlXCIsIFwibmloaWxcIiwgXCJpbXBlZGl0XCIsIFwicXVvXCIsIFwicG9ycm9cIiwgXCJxdWlzcXVhbVwiLFxuXCJlc3RcIiwgXCJxdWlcIiwgXCJtaW51c1wiLCBcImlkXCIsIFwicXVvZFwiLCBcIm1heGltZVwiLCBcInBsYWNlYXRcIiwgXCJmYWNlcmVcIiwgXCJwb3NzaW11c1wiLFxuXCJvbW5pc1wiLCBcInZvbHVwdGFzXCIsIFwiYXNzdW1lbmRhXCIsIFwiZXN0XCIsIFwib21uaXNcIiwgXCJkb2xvclwiLCBcInJlcGVsbGVuZHVzXCIsXG5cInRlbXBvcmlidXNcIiwgXCJhdXRlbVwiLCBcInF1aWJ1c2RhbVwiLCBcImV0XCIsIFwiYXV0XCIsIFwiY29uc2VxdWF0dXJcIiwgXCJ2ZWxcIiwgXCJpbGx1bVwiLFxuXCJxdWlcIiwgXCJkb2xvcmVtXCIsIFwiZXVtXCIsIFwiZnVnaWF0XCIsIFwicXVvXCIsIFwidm9sdXB0YXNcIiwgXCJudWxsYVwiLCBcInBhcmlhdHVyXCIsIFwiYXRcIixcblwidmVyb1wiLCBcImVvc1wiLCBcImV0XCIsIFwiYWNjdXNhbXVzXCIsIFwib2ZmaWNpaXNcIiwgXCJkZWJpdGlzXCIsIFwiYXV0XCIsIFwicmVydW1cIixcblwibmVjZXNzaXRhdGlidXNcIiwgXCJzYWVwZVwiLCBcImV2ZW5pZXRcIiwgXCJ1dFwiLCBcImV0XCIsIFwidm9sdXB0YXRlc1wiLCBcInJlcHVkaWFuZGFlXCIsXG5cInNpbnRcIiwgXCJldFwiLCBcIm1vbGVzdGlhZVwiLCBcIm5vblwiLCBcInJlY3VzYW5kYWVcIiwgXCJpdGFxdWVcIiwgXCJlYXJ1bVwiLCBcInJlcnVtXCIsXG5cImhpY1wiLCBcInRlbmV0dXJcIiwgXCJhXCIsIFwic2FwaWVudGVcIiwgXCJkZWxlY3R1c1wiLCBcInV0XCIsIFwiYXV0XCIsIFwicmVpY2llbmRpc1wiLFxuXCJ2b2x1cHRhdGlidXNcIiwgXCJtYWlvcmVzXCIsIFwiZG9sb3JpYnVzXCIsIFwiYXNwZXJpb3Jlc1wiLCBcInJlcGVsbGF0XCJdIiwiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLlxuIyBUVktpdCA9IHJlcXVpcmUgXCJUVktpdFwiXG5cbnJlcXVpcmUgXCJtb3JldXRpbHNcIlxuXG5GcmFtZXIuRGVmYXVsdHMuQW5pbWF0aW9uID1cbiAgICB0aW1lOiAwLjNcblxuQ2FudmFzLmJhY2tncm91bmRDb2xvciA9ICcjMWYxZjFmJ1xuXG5zdHJVdGlscyA9IHJlcXVpcmUgXCJzdHJVdGlsc1wiXG53aW5kb3cuc3RyVXRpbHMgPSBzdHJVdGlsc1xuXG57IFByb2dyYW1tZVRpbGUgfSA9IHJlcXVpcmUgXCJQcm9ncmFtbWVUaWxlXCJcbnsgTmF2aWdhYmxlcyB9ID0gcmVxdWlyZSBcIk5hdmlnYWJsZXNcIlxueyBNZW51IH0gPSByZXF1aXJlIFwiTWVudVwiXG57IENhcm91c2VsIH0gPSByZXF1aXJlIFwiQ2Fyb3VzZWxcIlxueyBHcmlkIH0gPSByZXF1aXJlIFwiR3JpZFwiXG57IEhpZ2hsaWdodCB9ID0gcmVxdWlyZSBcIkhpZ2hsaWdodFwiXG57IEJ1dHRvbnMgfSA9IHJlcXVpcmUgXCJCdXR0b25zXCJcblxud2luZG93LlByb2dyYW1tZVRpbGUgPSBQcm9ncmFtbWVUaWxlXG53aW5kb3cuTWVudSA9IE1lbnVcbndpbmRvdy5DYXJvdXNlbCA9IENhcm91c2VsXG53aW5kb3cuR3JpZCA9IEdyaWRcbndpbmRvdy5IaWdobGlnaHQgPSBIaWdobGlnaHRcbndpbmRvdy5CdXR0b25zID0gQnV0dG9uc1xud2luZG93Lk5hdmlnYWJsZXMgPSBOYXZpZ2FibGVzIiwic3RyVXRpbHMgPSByZXF1aXJlIFwic3RyVXRpbHNcIlxuY2xhc3MgZXhwb3J0cy5Qcm9ncmFtbWVUaWxlIGV4dGVuZHMgTGF5ZXJcblxuXHRjb25zdHJ1Y3RvcjogKCBvcHRpb25zPXt9ICkgLT5cblxuXHRcdCMgcHJpbnQgXCJjb25zdHJ1Y3Rvci1zdGFydFwiXG5cdFx0QF9fY29uc3RydWN0aW9uID0gdHJ1ZVxuXHRcdEBfX2luc3RhbmNpbmcgPSB0cnVlXG5cblx0XHRfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRuYW1lOiBcIlByb2dyYW1tZSBUaWxlXCJcblx0XHRcdHdpZHRoOiAyODBcblx0XHRcdGhlaWdodDogMTU3XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiXCJcblx0XHRcdHRpdGxlOiBcIk1pZHNvbWVyIE11cmRlcnNcIlxuXHRcdFx0bGFiZWw6IFwiXCJcblx0XHRcdHN5bm9wc2lzOiBcIk9uY2UgdXBvbiBhIHRpbWUgYSBkcmFnb24gZW50ZXJlZCBhIGRhbmNlIGNvbXBldGl0aW9uIGFuZCBoZSB3YXMgcmF0aGVyIGdvb2QgYXQgaXQuIEhlIHdhcyBhIGRhbmNpbmcgZHJhZ29uIG9mIGdyZWF0IGltcG9ydC5cIlxuXHRcdFx0bGFiZWxDb2xvcjogXCIjODM4NThBXCJcblx0XHRcdHRoaXJkTGluZTogXCJTZXJpZXMgMSwgRXBpc29kZSAxXCJcblx0XHRcdGRvZzogXCJcIlxuXHRcdFx0cmVjb3JkZWQ6IGZhbHNlXG5cdFx0XHR3YXRjaGxpc3Q6IGZhbHNlXG5cdFx0XHRnaG9zdDogZmFsc2Vcblx0XHRcdGxpbmVhcjogZmFsc2Vcblx0XHRcdG9uRGVtYW5kOiB0cnVlXG5cdFx0XHRwbGF5YWJsZTogZmFsc2VcblxuXHRcdCMgcHJpbnQgXCJjb25zdHJ1Y3Rvci1lbmRcIlxuXHRcdGxhYmVsVGV4dCA9IG9wdGlvbnMubGFiZWxcblx0XHRvcHRpb25zLmxhYmVsID0gdW5kZWZpbmVkXG5cdFx0c3VwZXIgb3B0aW9uc1xuXG5cblx0XHQjIHByaW50IG9wdGlvbnMuaGVpZ2h0XG5cdFx0Xy5hc3NpZ24gQCxcblx0XHRcdGNsaXA6IHRydWVcblx0XHRcdGhlaWdodDogb3B0aW9ucy5oZWlnaHRcblxuXHRcdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHQjIExheWVyc1xuXHRcdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRcdGlmIEBvbkRlbWFuZCA9PSB0cnVlIG9yIEBsaW5lYXIgPT0gdHJ1ZSB0aGVuIEBwbGF5YWJsZSA9IHRydWVcblx0XHRAZ3JhZGllbnRMYXllciA9IG5ldyBMYXllclxuXHRcdFx0cGFyZW50OiBAXG5cdFx0XHRuYW1lOidncmFkaWVudCdcblx0XHRcdHdpZHRoOiBvcHRpb25zLndpZHRoLCBoZWlnaHQ6IEAuaGVpZ2h0KzI1XG5cdFx0XHR4OiAwLCB5OiAwLCBpbmRleDogMFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIlwiXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0XCJiYWNrZ3JvdW5kLWltYWdlXCI6XCJsaW5lYXItZ3JhZGllbnQoLTE4MGRlZywgcmdiYSgwLDAsMCwwLjMwKSAwJSwgcmdiYSgwLDAsMCwwLjMwKSAzNSUsIHJnYmEoMCwwLDAsMC45MCkgNjAlKVwiXG5cblx0XHRAdGV4dENvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdFx0cGFyZW50OiBALCBuYW1lOiAndGV4dENvbnRhaW5lcidcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50J1xuXHRcdFx0eDogMTAsIHk6IG9wdGlvbnMuaGVpZ2h0LTU0LCBoZWlnaHQ6IDcwLCBpbmRleDogMVxuXG5cdFx0QHRpdGxlTGF5ZXIgPSBuZXcgVGV4dExheWVyXG5cdFx0XHRwYXJlbnQ6IEB0ZXh0Q29udGFpbmVyLCBuYW1lOiAndGl0bGVMYXllcidcblx0XHRcdHRleHQ6IG9wdGlvbnMudGl0bGVcblx0XHRcdGZvbnRGYW1pbHk6ICdBdmVuaXInLCBmb250U2l6ZTogMjIsIGNvbG9yOiAnI0VCRUJFQidcblx0XHRcdHk6IDIxLCBpbmRleDogMVxuXHRcdFx0aGVpZ2h0OiAyNiwgd2lkdGg6IGlmIG9wdGlvbnMucGxheWFibGUgPT0gZmFsc2UgdGhlbiBALndpZHRoLTIwIGVsc2UgQC53aWR0aC00MFxuXHRcdFx0eDogaWYgb3B0aW9ucy5wbGF5YWJsZSA9PSBmYWxzZSB0aGVuIDAgZWxzZSAyNlxuXHRcdFx0dHJ1bmNhdGU6IHRydWVcblxuXHRcdEBsYWJlbExheWVyID0gbmV3IFRleHRMYXllclxuXHRcdFx0cGFyZW50OiBAdGV4dENvbnRhaW5lclxuXHRcdFx0bmFtZTogJ2xhYmVsTGF5ZXInXG5cdFx0XHR0ZXh0OiBsYWJlbFRleHRcblx0XHRcdGZvbnRGYW1pbHk6ICdBdmVuaXItQmxhY2snXG5cdFx0XHRmb250U2l6ZTogMTZcblx0XHRcdHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnXG5cdFx0XHRjb2xvcjogb3B0aW9ucy5sYWJlbENvbG9yXG5cdFx0XHRsZXR0ZXJTcGFjaW5nOiAwLjI0XG5cdFx0XHRoZWlnaHQ6IDE4LCB3aWR0aDogQC53aWR0aC0yMCwgaW5kZXg6IDFcblx0XHRcdHRydW5jYXRlOiB0cnVlXG5cblx0XHRAdGhpcmRMaW5lTGF5ZXIgPSBuZXcgVGV4dExheWVyXG5cdFx0XHRwYXJlbnQ6IEAsIG5hbWU6J3RoaXJkTGluZUxheWVyJ1xuXHRcdFx0Zm9udEZhbWlseTogJ0F2ZW5pci1CbGFjaycsIGZvbnRTaXplOiAxNiwgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsIGNvbG9yOiAnI0I2QjlCRidcblx0XHRcdHk6IEAuaGVpZ2h0LCB4OiAxMCwgaW5kZXg6IDFcblx0XHRcdGhlaWdodDogMTgsIHdpZHRoOiBALndpZHRoLTIwXG5cdFx0XHR0ZXh0OiBvcHRpb25zLnRoaXJkTGluZVxuXHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0dHJ1bmNhdGU6IHRydWVcblxuXHRcdEBkb2dJbWFnZUxheWVyID0gbmV3IExheWVyXG5cdFx0XHRwYXJlbnQ6IEAsIG5hbWU6ICdkb2cnXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcnXG5cdFx0XHR5OiAxMCwgbWF4WDogQC53aWR0aC0xMFxuXHRcdFx0aGVpZ2h0OiAzMCwgd2lkdGg6IDEwMFxuXHRcdFx0aHRtbDogXCJcIlwiPGltZyBzdHlsZSA9IFwiZmxvYXQ6cmlnaHQ7bWF4LXdpZHRoOjEwMCU7bWF4LWhlaWdodDoxMDAlO1wiIHNyYyA9ICcje29wdGlvbnMuZG9nfSc+XCJcIlwiXG5cdFx0XHRvcGFjaXR5OiAwXG5cblx0XHRAYXBwZWFyID0gbmV3IEFuaW1hdGlvbiBALFxuXHRcdFx0b3BhY2l0eTogMVxuXHRcdEBkaXNhcHBlYXIgPSBuZXcgQW5pbWF0aW9uIEAsXG5cdFx0XHRvcGFjaXR5OiAwXG5cblx0XHR0ZXh0TGF5ZXJzID0gW0B0aXRsZUxheWVyLCBAbGFiZWxMYXllciwgQHRoaXJkTGluZUxheWVyXVxuXHRcdHN0clV0aWxzLmJyZWFrTGV0dGVyKHRleHRMYXllcnMpXG5cblx0XHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0IyBIaWdobGlnaHQgQW5pbWF0aW9uc1xuXHRcdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRcdCMgSGlnaGxpZ2h0XG5cdFx0QHVwZGF0ZUhpZ2hsaWdodEFuaW1hdGlvbnMgPSAtPlxuXHRcdFx0QF9jb250YWluZXJIaWdobGlnaHQgPSBuZXcgQW5pbWF0aW9uIEB0ZXh0Q29udGFpbmVyLCAjVGl0bGUgJiBsYWJlbFxuXHRcdFx0XHRcdHk6IEAuaGVpZ2h0LTc0XG5cdFx0XHRcdFx0b3B0aW9uczpcblx0XHRcdFx0XHRcdGRlbGF5OiAxXG5cdFx0XHRcdFx0XHR0aW1lOiAwLjVcblx0XHRcdEBfdGhpcmRMaW5lSGlnaGxpZ2h0ID0gbmV3IEFuaW1hdGlvbiBAdGhpcmRMaW5lTGF5ZXIsICN0aGlyZExpbmVcblx0XHRcdFx0eTogQC5oZWlnaHQtMjRcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRvcHRpb25zOlxuXHRcdFx0XHRcdGRlbGF5OiAxXG5cdFx0XHRcdFx0dGltZTogMC40XG5cdFx0XHRcdFx0Y3VydmU6IFwiZWFzZS1vdXRcIlxuXHRcdFx0QF9ncmFkaWVudEhpZ2hsaWdodCA9IG5ldyBBbmltYXRpb24gQGdyYWRpZW50TGF5ZXIsICNHcmFkaWVudFxuXHRcdFx0XHR5OiBBbGlnbi5ib3R0b20oKVxuXHRcdFx0XHRvcHRpb25zOlxuXHRcdFx0XHRcdGRlbGF5OiAxXG5cdFx0XHRcdFx0dGltZTogMC40XG5cblx0XHRAdXBkYXRlUmVtb3ZlSGlnaGxpZ2h0QW5pbWF0aW9ucyA9IC0+XG5cdFx0XHRAX2NvbnRhaW5lclJlbW92ZUhpZ2hsaWdodCA9IG5ldyBBbmltYXRpb24gQHRleHRDb250YWluZXIsICNUaXRsZSAmIGxhYmVsXG5cdFx0XHRcdHk6IEAuaGVpZ2h0LTU0XG5cdFx0XHRcdG9wdGlvbnM6XG5cdFx0XHRcdFx0dGltZTogMC41XG5cdFx0XHRAX3RoaXJkTGluZVJlbW92ZUhpZ2hsaWdodCA9IG5ldyBBbmltYXRpb24gQHRoaXJkTGluZUxheWVyLCAjdGhpcmRMaW5lXG5cdFx0XHRcdHk6IEAuaGVpZ2h0XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0b3B0aW9uczpcblx0XHRcdFx0XHR0aW1lOiAwLjRcblx0XHRcdFx0XHRjdXJ2ZTogXCJlYXNlLW91dFwiXG5cdFx0XHRAX2dyYWRpZW50UmVtb3ZlSGlnaGxpZ2h0ID0gbmV3IEFuaW1hdGlvbiBAZ3JhZGllbnRMYXllciwgI0dyYWRpZW50XG5cdFx0XHRcdG1heFk6IEAubWF4WSsyNVxuXHRcdFx0XHRvcHRpb25zOlxuXHRcdFx0XHRcdHRpbWU6IDAuNFxuXG5cdFx0QHVwZGF0ZUhpZ2hsaWdodEFuaW1hdGlvbnMoKVxuXHRcdEB1cGRhdGVSZW1vdmVIaWdobGlnaHRBbmltYXRpb25zKClcblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIEV2ZW50c1xuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0ZGVsZXRlIEBfX2NvbnN0cnVjdGlvblxuXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyBQdWJsaWMgTWV0aG9kc1xuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0aGlnaGxpZ2h0OiAoKSAtPlxuXHRcdEBfY29udGFpbmVyUmVtb3ZlSGlnaGxpZ2h0LnN0b3AoKVxuXHRcdEBfdGhpcmRMaW5lUmVtb3ZlSGlnaGxpZ2h0LnN0b3AoKVxuXHRcdEBfZ3JhZGllbnRSZW1vdmVIaWdobGlnaHQuc3RvcCgpXG5cblx0XHRAX2NvbnRhaW5lckhpZ2hsaWdodC5zdGFydCgpXG5cdFx0QF90aGlyZExpbmVIaWdobGlnaHQuc3RhcnQoKVxuXHRcdEBfZ3JhZGllbnRIaWdobGlnaHQuc3RhcnQoKVxuXG5cdHJlbW92ZUhpZ2hsaWdodDogKCkgLT5cblx0XHRAX2NvbnRhaW5lckhpZ2hsaWdodC5zdG9wKClcblx0XHRAX3RoaXJkTGluZUhpZ2hsaWdodC5zdG9wKClcblx0XHRAX2dyYWRpZW50SGlnaGxpZ2h0LnN0b3AoKVxuXG5cdFx0QF9jb250YWluZXJSZW1vdmVIaWdobGlnaHQuc3RhcnQoKVxuXHRcdEBfdGhpcmRMaW5lUmVtb3ZlSGlnaGxpZ2h0LnN0YXJ0KClcblx0XHRAX2dyYWRpZW50UmVtb3ZlSGlnaGxpZ2h0LnN0YXJ0KClcblxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgUHJpdmF0ZSBNZXRob2RzXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRfdXBkYXRlSGVpZ2h0OiAoIHZhbHVlICkgLT5cblx0XHRALmhlaWdodCA9IHZhbHVlXG5cdFx0QGdyYWRpZW50TGF5ZXIubWF4WSA9IHZhbHVlKzI1XG5cdFx0QHRoaXJkTGluZUxheWVyLnkgPSBALmhlaWdodFxuXHRcdEB0ZXh0Q29udGFpbmVyLnkgPSBALmhlaWdodC01NFxuXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyBEZWZpbml0aW9uc1xuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0IyBwcmludCBcInN0YXJ0IGRlZmluaXRpb25zXCJcblx0QGRlZmluZSBcInRpdGxlXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQHRpdGxlTGF5ZXIudGV4dFxuXHRcdHNldDogKCB2YWx1ZSApIC0+IEB0aXRsZUxheWVyLnRleHQgPSB2YWx1ZSBpZiBAdGl0bGVMYXllcj9cblxuXHRAZGVmaW5lIFwibGFiZWxcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAbGFiZWxMYXllci50ZXh0IGlmIEBsYWJlbExheWVyP1xuXHRcdCMgTm90IHN1cmUgd2h5IHRoaXMgaXMgaGFwcGVuaW5nIGJ1dCBJIHRoaW5rIHRoZSBMYXllciBjbGFzcyBpcyBjYXB0dXJpbmdcblx0XHQjIGxhYmVsIGFuZCBjYXVzaW5nIGl0IHRvIGNhbGwgdGhlIGdldHRlciBiZWZvcmUgbGFiZWxMYXllciBleGlzdHMuXG5cdFx0c2V0OiAoIHZhbHVlICkgLT4gQGxhYmVsTGF5ZXIudGV4dCA9IHZhbHVlIGlmIEBsYWJlbExheWVyP1xuXG5cdEBkZWZpbmUgXCJ0aGlyZExpbmVcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAdGhpcmRMaW5lTGF5ZXIudGV4dFxuXHRcdHNldDogKCB2YWx1ZSApIC0+IEB0aGlyZExpbmVMYXllci50ZXh0ID0gdmFsdWUgaWYgQHRoaXJkTGluZUxheWVyP1xuXG5cdEBkZWZpbmUgXCJsYWJlbENvbG9yXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQGxhYmVsTGF5ZXIuY29sb3Jcblx0XHRzZXQ6ICggdmFsdWUgKSAtPiBAbGFiZWxMYXllci5jb2xvciA9IHZhbHVlIGlmIEBsYWJlbExheWVyP1xuXG5cdGRlbGV0ZSBAX19pbnN0YW5jaW5nXG5cdCMgcHJpbnQgXCJlbmQgZGVmaW5pdGlvbnNcIiIsImNsYXNzIGV4cG9ydHMuTmF2aWdhYmxlcyBleHRlbmRzIExheWVyXG4gICAgY29uc3RydWN0b3I6ICggb3B0aW9ucz17fSApIC0+XG4gICAgICAgIEBfX2NvbnN0cnVjdGlvbiA9IHRydWVcbiAgICAgICAgXy5hc3NpZ24gb3B0aW9ucyxcbiAgICAgICAgICAgIGFjdGl2ZTogZmFsc2VcbiAgICAgICAgICAgIGxhc3RIaWdobGlnaHQ6IHVuZGVmaW5lZFxuICAgICAgICAgICAgaGlnaGxpZ2h0TGF5ZXI6IHVuZGVmaW5lZFxuICAgICAgICBzdXBlciBvcHRpb25zXG5cbiAgICAgICAgXy5hc3NpZ24gQCxcbiAgICAgICAgICAgIG91dExlZnQ6IHVuZGVmaW5lZFxuXHRcdFxuICAgICAgICBpZiB3aW5kb3dbXCJuYXZpZ2FibGVzQXJyYXlcIl0/ID09IGZhbHNlXG4gICAgICAgICAgICB3aW5kb3dbXCJuYXZpZ2FibGVzQXJyYXlcIl0gPSBbXVxuICAgICAgICBuYXZpZ2FibGVzQXJyYXkucHVzaChAKVxuXG4gICAgICAgIEB1cE91dEJlaGF2aW91ciA9IFwiXCJcbiAgICAgICAgQGRvd25PdXRCZWhhdmlvdXIgPSBcIlwiXG4gICAgICAgIEBsZWZ0T3V0QmVoYXZpb3VyID0gXCJcIlxuICAgICAgICBAcmlnaHRPdXRCZWhhdmlvdXIgPSBcIlwiXG5cbiAgICAgICAgQG9uIFwidXBPdXRcIiwgKCkgLT5cbiAgICAgICAgICAgIEB1cE91dEJlaGF2aW91cigpIGlmIEB1cE91dEJlaGF2aW91ciAhPSBcIlwiXG4gICAgICAgIEBvbiBcInJpZ2h0T3V0XCIsICgpIC0+XG4gICAgICAgICAgICBAcmlnaHRPdXRCZWhhdmlvdXIoKSBpZiBAcmlnaHRPdXRCZWhhdmlvdXIgIT0gXCJcIlxuICAgICAgICBAb24gXCJkb3duT3V0XCIsICgpIC0+XG4gICAgICAgICAgICBAZG93bk91dEJlaGF2aW91cigpIGlmIEBkb3duT3V0QmVoYXZpb3VyICE9IFwiXCJcbiAgICAgICAgQG9uIFwibGVmdE91dFwiLCAoKSAtPlxuICAgICAgICAgICAgQGxlZnRPdXRCZWhhdmlvdXIoKSBpZiBAbGVmdE91dEJlaGF2aW91ciAhPSBcIlwiXG4gICAgXG4gICAgX2Fzc2lnbkhpZ2hsaWdodDogKCBsYXllciApIC0+XG4gICAgICAgIEBoaWdobGlnaHRMYXllciA9IGxheWVyXG5cbiAgICBvblVwT3V0OiAoIGJlaGF2aW91ciApIC0+XG4gICAgICAgIEB1cE91dEJlaGF2aW91ciA9IGJlaGF2aW91clxuICAgIG9uUmlnaHRPdXQ6ICggYmVoYXZpb3VyICkgLT5cbiAgICAgICAgQHJpZ2h0T3V0QmVoYXZpb3VyID0gYmVoYXZpb3VyXG4gICAgb25Eb3duT3V0OiAoIGJlaGF2aW91ciApIC0+XG4gICAgICAgIEBkb3duT3V0QmVoYXZpb3VyID0gYmVoYXZpb3VyXG4gICAgb25MZWZ0T3V0OiAoIGJlaGF2aW91ciApIC0+XG4gICAgICAgIEBsZWZ0T3V0QmVoYXZpb3VyID0gYmVoYXZpb3VyXG5cblxuICAgIEBkZWZpbmUgXCJoaWdobGlnaHRcIixcbiAgICAgICAgZ2V0OiAtPiByZXR1cm4gQF9oaWdobGlnaHRcbiAgICAgICAgc2V0OiAoIHZhbHVlICkgLT5cbiAgICAgICAgICAgIEBfaGlnaGxpZ2h0ID0gdmFsdWVcbiAgICBcbiAgICBAZGVmaW5lIFwidXBPdXRcIixcbiAgICAgICAgZ2V0OiAtPiByZXR1cm4gQF9vdXRVcFxuICAgICAgICBzZXQ6ICggdmFsdWUgKSAtPlxuICAgICAgICAgICAgcmV0dXJuIGlmIEBfX2NvbnN0cnVjdGlvblxuICAgICAgICAgICAgbmV3QmVoYXZpb3VyID0gdmFsdWVcbiAgICAgICAgICAgIEB1cE91dEJlaGF2aW91ciA9IHZhbHVlXG4gICAgQGRlZmluZSBcInJpZ2h0T3V0XCIsXG4gICAgICAgIGdldDogLT4gcmV0dXJuIEBfb3V0cmlnaHRcbiAgICAgICAgc2V0OiAoIHZhbHVlICkgLT5cbiAgICAgICAgICAgIHJldHVybiBpZiBAX19jb25zdHJ1Y3Rpb25cbiAgICAgICAgICAgIG5ld0JlaGF2aW91ciA9IHZhbHVlXG4gICAgICAgICAgICBAcmlnaHRPdXRCZWhhdmlvdXIgPSB2YWx1ZVxuICAgIEBkZWZpbmUgXCJkb3duT3V0XCIsXG4gICAgICAgIGdldDogLT4gcmV0dXJuIEBfb3V0RG93blxuICAgICAgICBzZXQ6ICggdmFsdWUgKSAtPlxuICAgICAgICAgICAgcmV0dXJuIGlmIEBfX2NvbnN0cnVjdGlvblxuICAgICAgICAgICAgbmV3QmVoYXZpb3VyID0gdmFsdWVcbiAgICAgICAgICAgIEBkb3duT3V0QmVoYXZpb3VyID0gdmFsdWVcbiAgICBAZGVmaW5lIFwibGVmdE91dFwiLFxuICAgICAgICBnZXQ6IC0+IHJldHVybiBAX291dGxlZnRcbiAgICAgICAgc2V0OiAoIHZhbHVlICkgLT5cbiAgICAgICAgICAgIHJldHVybiBpZiBAX19jb25zdHJ1Y3Rpb25cbiAgICAgICAgICAgIG5ld0JlaGF2aW91ciA9IHZhbHVlXG4gICAgICAgICAgICBAbGVmdE91dEJlaGF2aW91ciA9IHZhbHVlIiwic3RyVXRpbHMgPSByZXF1aXJlIFwic3RyVXRpbHNcIlxueyBOYXZpZ2FibGVzIH0gPSByZXF1aXJlIFwiTmF2aWdhYmxlc1wiXG5cbmNsYXNzIGV4cG9ydHMuTWVudSBleHRlbmRzIE5hdmlnYWJsZXNcblxuXHRjb25zdHJ1Y3RvcjogKCBvcHRpb25zPXt9ICkgLT5cblxuXHRcdEBfX2NvbnN0cnVjdGlvbiA9IHRydWVcblx0XHRAX19pbnN0YW5jaW5nID0gdHJ1ZVxuXG5cdFx0Xy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0bWVudUl0ZW1zOiBbJ01lbnUgT25lJywgJ01lbnUgVHdvJywgJ01lbnUgVGhyZWUnXVxuXHRcdFx0Y29udGVudDogW2xheWVyT25lLCBsYXllclR3bywgbGF5ZXJUaHJlZV1cblx0XHRcdGJhY2tncm91bmRDb2xvcjogJydcblx0XHRzdXBlciBvcHRpb25zXG5cblx0XHRkZWxldGUgQF9fY29uc3RydWN0aW9uXG5cblx0XHQjIHByaW50IG9wdGlvbnNcblxuXHRcdG1lbnVOYW1lcyA9IG9wdGlvbnMubWVudUl0ZW1zXG5cdFx0Zm9yIG5hbWVzLCBpIGluIG1lbnVOYW1lc1xuXHRcdFx0aWYgbmFtZXMgaW5zdGFuY2VvZiBMYXllclxuXHRcdFx0XHRtZW51TGF5ZXIgPSBuYW1lc1xuXHRcdFx0XHRtZW51TGF5ZXIueSA9IDZcblx0XHRcdFx0bWVudUxheWVyLnggPSAtMlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRtZW51TGF5ZXIgPSBuZXcgVGV4dExheWVyXG5cdFx0XHRcdEBoaWdobGlnaHRZID0gQC5zY3JlZW5GcmFtZS55ICsgbWVudUxheWVyLmhlaWdodC01XG5cdFx0XHRfLmFzc2lnbiBtZW51TGF5ZXIsXG5cdFx0XHRcdHBhcmVudDogQFxuXHRcdFx0XHR0ZXh0OiBuYW1lc1xuXHRcdFx0XHRjb2xvcjogXCIjZWJlYmViXCJcblx0XHRcdFx0Zm9udEZhbWlseTogXCJBdmVuaXItbGlnaHRcIlxuXHRcdFx0XHRmb250U2l6ZTogMzBcblx0XHRcdFx0bGV0dGVyU3BhY2luZzogMC4zXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRcdFx0XHR4OiBpZiBALmNoaWxkcmVuW2ktMV0/IHRoZW4gQC5jaGlsZHJlbltpLTFdLm1heFggKyAzOSBlbHNlIDBcblx0XHRcdFx0Y3VzdG9tOlxuXHRcdFx0XHRcdG1lbnVDb250ZW50OiBvcHRpb25zLmNvbnRlbnRbaV1cblxuXHRcdFx0IyBtZW51TGF5ZXIuYWRkQ2hpbGQob3B0aW9ucy5jb250ZW50W2ldKSBpZiBvcHRpb25zLmNvbnRlbnRbaV0/XG5cdFx0XHRvcHRpb25zLm1lbnVJdGVtc1tpXSA9IG1lbnVMYXllclxuXHRcdFx0QGhpZ2hsaWdodEluZGV4ID0gMFxuXG5cdCMgcHJpbnQgJzEnXG5cdEBkZWZpbmUgJ21lbnVJdGVtcycsXG5cdFx0Z2V0OiAtPlx0cmV0dXJuIEAuY2hpbGRyZW5cblx0XHRzZXQ6ICggdmFsdWUgKSAtPlxuXHRcdFx0cmV0dXJuIGlmIEBfX2NvbnN0cnVjdGlvblxuXHRcdFx0QG1lbnVJdGVtcyA9IHZhbHVlXG5cblx0QGRlZmluZSAnY29udGVudCcsXG5cdFx0Z2V0OiAtPiBAX2dldENvbnRlbnQoKVxuXHRcdHNldDogKCB2YWx1ZSApIC0+IGlmIEBfX2NvbnN0cnVjdGlvbj8gdGhlbiBAX3NldENvbnRlbnQoIHZhbHVlIClcblxuXHRsYXllck9uZSA9IG5ldyBUZXh0TGF5ZXJcblx0XHRuYW1lOiBcIi5cIiwgeTogMTAwLCB2aXNpYmxlOiBmYWxzZSwgYmFja2dyb3VuZENvbG9yOiBcInJlZFwiLCB0ZXh0OiBcIkRlZmluZSB3aXRoIGFuIGFycmF5IGluIE1lbnUuY3VzdG9tLmNvbnRlbnRcIiwgY29sb3I6IFwid2hpdGVcIlxuXHRsYXllclR3byA9IG5ldyBUZXh0TGF5ZXJcblx0XHRuYW1lOiBcIi5cIiwgeTogMTAwLCB2aXNpYmxlOiBmYWxzZSwgYmFja2dyb3VuZENvbG9yOiBcImJsdWVcIiwgdGV4dDogXCJEZWZpbmUgd2l0aCBhbiBhcnJheSBpbiBNZW51LmN1c3RvbS5jb250ZW50XCIsIGNvbG9yOiBcIndoaXRlXCJcblx0bGF5ZXJUaHJlZSA9IG5ldyBUZXh0TGF5ZXJcblx0XHRuYW1lOiBcIi5cIiwgeTogMTAwLCB2aXNpYmxlOiBmYWxzZSwgYmFja2dyb3VuZENvbG9yOiBcImdyZWVuXCIsIHRleHQ6IFwiRGVmaW5lIHdpdGggYW4gYXJyYXkgaW4gTWVudS5jdXN0b20uY29udGVudFwiLCBjb2xvcjogXCJ3aGl0ZVwiXG5cblx0X2dldENvbnRlbnQ6IC0+XG5cdFx0X2NvbnRlbnQgPSBbXVxuXHRcdGZvciBjaGlsZCBpbiBALmNoaWxkcmVuXG5cdFx0XHRfY29udGVudC5wdXNoKGNoaWxkLmN1c3RvbS5tZW51Q29udGVudClcblx0XHRyZXR1cm4gX2NvbnRlbnRcblxuXHRfc2V0Q29udGVudDogKCB2YWx1ZSApIC0+XG5cdFx0Zm9yIGNoaWxkLCBpIGluIEAuY2hpbGRyZW5cblx0XHRcdGNoaWxkLmN1c3RvbS5tZW51Q29udGVudC5kZXN0cm95KClcblx0XHRcdGNoaWxkLmN1c3RvbS5tZW51Q29udGVudCA9IHZhbHVlW2ldXG5cdFx0XHQjIGNoaWxkLmFkZENoaWxkKGNoaWxkLmN1c3RvbS5tZW51Q29udGVudClcblxuXHRfbW92ZUhpZ2hsaWdodDogKCkgLT5cblx0XHRAaGlnaGxpZ2h0TGF5ZXIuY3VycmVudENvbnRleHQgPSBAXG5cblx0X3NldEluZGV4OiAoIGhpZ2hsaWdodGVkTWVudUluZGV4ICkgLT5cblx0XHRpZiBoaWdobGlnaHRlZE1lbnVJbmRleCA9PSB1bmRlZmluZWRcblx0XHRcdGhpZ2hsaWdodGVkTWVudUluZGV4ID0gMFxuXHRcdHJldHVybiBoaWdobGlnaHRlZE1lbnVJbmRleFxuXG5cdHJlbW92ZUhpZ2hsaWdodDogKCkgLT5cblx0XHRmb3IgY2hpbGQsIGkgaW4gQC5jaGlsZHJlblxuXHRcdFx0aWYgaSA9PSBAaGlnaGxpZ2h0SW5kZXhcblx0XHRcdFx0Y2hpbGQuYW5pbWF0ZVxuXHRcdFx0XHRcdGNvbG9yOiBzdHJVdGlscy53aGl0ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjaGlsZC5hbmltYXRlXG5cdFx0XHRcdFx0Y29sb3I6IHN0clV0aWxzLmRhcmtHcmV5XG5cdFx0QC5oaWdobGlnaHRMYXllci5hbmltYXRlXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IHN0clV0aWxzLndoaXRlXG5cdFx0Zm9yIGNoaWxkIGluIEAuaGlnaGxpZ2h0TGF5ZXIuY2hpbGRyZW5cblx0XHRcdGNoaWxkLnZpc2libGUgPSBmYWxzZVxuXHRcdEAuaGlnaGxpZ2h0TGF5ZXIudmlzaWJsZSA9IHRydWVcblxuXG5cdGhpZ2hsaWdodDogKCBoaWdobGlnaHRlZE1lbnVJbmRleCApIC0+XG5cdFx0aWYgaGlnaGxpZ2h0ZWRNZW51SW5kZXggPT0gdW5kZWZpbmVkIHRoZW4gaGlnaGxpZ2h0ZWRNZW51SW5kZXggPSAwXG5cdFx0aWYgQC5jaGlsZHJlbj9cblx0XHRcdGZvciBjaGlsZCwgaSBpbiBALmNoaWxkcmVuXG5cdFx0XHRcdGlmIGkgPT0gaGlnaGxpZ2h0ZWRNZW51SW5kZXhcblx0XHRcdFx0XHRjaGlsZC5hbmltYXRlXG5cdFx0XHRcdFx0XHRjb2xvcjogc3RyVXRpbHMuYmx1ZVxuXG5cdFx0XHRcdFx0aWYgY2hpbGQuY3VzdG9tLm1lbnVDb250ZW50P1xuXHRcdFx0XHRcdFx0Y2hpbGQuY3VzdG9tLm1lbnVDb250ZW50LnZpc2libGUgPSB0cnVlXG5cblx0XHRcdFx0XHRpZiBAaGlnaGxpZ2h0TGF5ZXI/XG5cdFx0XHRcdFx0XHRfLmFzc2lnbiBAaGlnaGxpZ2h0TGF5ZXIsXG5cdFx0XHRcdFx0XHRcdHdpZHRoOiAwXG5cdFx0XHRcdFx0XHRcdHk6IEBoaWdobGlnaHRZXG5cdFx0XHRcdFx0XHRcdHg6IGNoaWxkLnNjcmVlbkZyYW1lLnggKyBjaGlsZC53aWR0aC8yXG5cdFx0XHRcdFx0XHRAaGlnaGxpZ2h0TGF5ZXIuY2hpbGRyZW5bMF0ud2lkdGggPSAwXG5cdFx0XHRcdFx0XHRAaGlnaGxpZ2h0TGF5ZXIuY2hpbGRyZW5bMF0uYW5pbWF0ZVxuXHRcdFx0XHRcdFx0XHR3aWR0aDogY2hpbGQud2lkdGgrMTBcblx0XHRcdFx0XHRcdEBoaWdobGlnaHRMYXllci5hbmltYXRlXG5cdFx0XHRcdFx0XHRcdHdpZHRoOiBjaGlsZC53aWR0aFxuXHRcdFx0XHRcdFx0XHR4OiBjaGlsZC5zY3JlZW5GcmFtZS54XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRjaGlsZC5hbmltYXRlXG5cdFx0XHRcdFx0XHRjb2xvcjogc3RyVXRpbHMud2hpdGVcblxuXHRcdFx0XHRcdGlmIGNoaWxkLmN1c3RvbS5tZW51Q29udGVudD9cblx0XHRcdFx0XHRcdGNoaWxkLmN1c3RvbS5tZW51Q29udGVudC52aXNpYmxlID0gZmFsc2Vcblx0XHRcdEAuaGlnaGxpZ2h0TGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IHN0clV0aWxzLmJsdWVcblx0XHRcdGZvciBjaGlsZCBpbiBALmhpZ2hsaWdodExheWVyLmNoaWxkcmVuXG5cdFx0XHRcdGNoaWxkLnZpc2libGUgPSB0cnVlXG5cblx0XHRcdEBoaWdobGlnaHRJbmRleCA9IGhpZ2hsaWdodGVkTWVudUluZGV4XG5cdFx0XHRAbGFzdEhpZ2hsaWdodCA9IGhpZ2hsaWdodGVkTWVudUluZGV4XG5cblx0bW92ZVJpZ2h0OiAoKSA9PlxuXHRcdGlmIEBoaWdobGlnaHRJbmRleCsxIDwgQC5tZW51SXRlbXMubGVuZ3RoXG5cdFx0XHRALmhpZ2hsaWdodCggQGhpZ2hsaWdodEluZGV4KzEgKVxuXHRcdGVsc2UgQGVtaXQoXCJyaWdodE91dFwiKVxuXHRcdEBsYXN0SGlnaGxpZ2h0ID0gQGhpZ2hsaWdodEluZGV4XG5cblx0bW92ZUxlZnQ6ICgpID0+XG5cdFx0aWYgQGhpZ2hsaWdodEluZGV4ID4gMFxuXHRcdFx0QC5oaWdobGlnaHQoIEBoaWdobGlnaHRJbmRleC0xIClcblx0XHRlbHNlIEBlbWl0KFwibGVmdE91dFwiKVxuXHRcdEBsYXN0SGlnaGxpZ2h0ID0gQGhpZ2hsaWdodEluZGV4XG5cblx0bW92ZVVwOiAoKSA9PlxuXHRcdEBlbWl0KFwidXBPdXRcIilcblxuXHRtb3ZlRG93bjogKCkgPT5cblx0XHRAZW1pdChcImRvd25PdXRcIilcblx0IyA9PT09PT09PT09PT09PT09PT09PT1cblx0IyBJbml0IiwiIyBLZXlzXG5leHBvcnRzLmJhY2tzcGFjZSA9IDhcbmV4cG9ydHMudGFiID0gOVxuZXhwb3J0cy5lbnRlciA9IDEzXG5leHBvcnRzLnNoaWZ0ID0gMTZcbmV4cG9ydHMuY3RybCA9IDE3XG5leHBvcnRzLmFsdCA9IDE4XG5cbmV4cG9ydHMuY2FwcyA9IDIwXG5leHBvcnRzLmVzY2FwZSA9IDI3XG5leHBvcnRzLnBhZ2VVcCA9IDMzXG5leHBvcnRzLnBhZ2VEb3duID0gMzRcblxuZXhwb3J0cy5sZWZ0ID0gMzdcbmV4cG9ydHMudXAgPSAzOFxuZXhwb3J0cy5yaWdodCA9IDM5XG5leHBvcnRzLmRvd24gPSA0MFxuZXhwb3J0cy5kZWxldGUgPSA0NlxuXG5leHBvcnRzLnplcm8gPSA0OFxuZXhwb3J0cy5vbmUgPSA0OVxuZXhwb3J0cy50d28gPSA1MFxuZXhwb3J0cy50aHJlZSA9IDUxXG5leHBvcnRzLmZvdXIgPSA1MlxuZXhwb3J0cy5maXZlID0gNTNcbmV4cG9ydHMuc2l4ID0gNTRcbmV4cG9ydHMuc2V2ZW4gPSA1NVxuZXhwb3J0cy5laWdodCA9IDU2XG5leHBvcnRzLm5pbmUgPSA1N1xuXG5leHBvcnRzLmEgPSA2NVxuZXhwb3J0cy5iID0gNjZcbmV4cG9ydHMuYyA9IDY3XG5leHBvcnRzLmQgPSA2OFxuZXhwb3J0cy5lID0gNjlcbmV4cG9ydHMuZiA9IDcwXG5leHBvcnRzLmcgPSA3MVxuZXhwb3J0cy5oID0gNzJcbmV4cG9ydHMuaSA9IDczXG5leHBvcnRzLmogPSA3NFxuZXhwb3J0cy5rID0gNzVcbmV4cG9ydHMubCA9IDc2XG5leHBvcnRzLm0gPSA3N1xuZXhwb3J0cy5uID0gNzhcbmV4cG9ydHMubyA9IDc5XG5leHBvcnRzLnAgPSA4MFxuZXhwb3J0cy5xID0gODFcbmV4cG9ydHMuciA9IDgyXG5leHBvcnRzLnMgPSA4M1xuZXhwb3J0cy50ID0gODRcbmV4cG9ydHMudSA9IDg1XG5leHBvcnRzLnYgPSA4NlxuZXhwb3J0cy53ID0gODdcbmV4cG9ydHMueCA9IDg4XG5leHBvcnRzLnkgPSA4OVxuZXhwb3J0cy56ID0gOTBcblxuZXhwb3J0cy5udW1aZXJvID0gOTZcbmV4cG9ydHMubnVtT25lID0gOTdcbmV4cG9ydHMubnVtVHdvID0gOThcbmV4cG9ydHMubnVtVGhyZWUgPSA5OVxuZXhwb3J0cy5udW1Gb3VyID0gMTAwXG5leHBvcnRzLm51bUZpdmUgPSAxMDFcbmV4cG9ydHMubnVtU2l4ID0gMTAyXG5leHBvcnRzLm51bVNldmVuID0gMTAzXG5leHBvcnRzLm51bUVpZ2h0ID0gMTA0XG5leHBvcnRzLm51bU5pbmUgPSAxMDVcblxuZXhwb3J0cy5mT25lID0gMTEyXG5leHBvcnRzLmZUd28gPSAxMTNcbmV4cG9ydHMuZlRocmVlID0gMTE0XG5leHBvcnRzLmZGb3VyID0gMTE1XG5leHBvcnRzLmZGaXZlID0gMTE2XG5leHBvcnRzLmZTaXggPSAxMTdcbmV4cG9ydHMuZlNldmVuID0gMTE4XG5leHBvcnRzLmZFaWdodCA9IDExOVxuZXhwb3J0cy5mTmluZSA9IDEyMFxuZXhwb3J0cy5mVGVuID0gMTIxXG5cbmV4cG9ydHMuc2VtaUNvbG9uID0gMTg2XG5leHBvcnRzLmVxdWFsU2lnbiA9IDE4N1xuZXhwb3J0cy5jb21tYSA9IDE4OFxuZXhwb3J0cy5kYXNoID0gMTg5XG5leHBvcnRzLnBlcmlvZCA9IDE5MFxuZXhwb3J0cy5mb3J3YXJkU2xhc2ggPSAxOTFcbmV4cG9ydHMub3BlbkJyYWNrZXQgPSAyMTlcbmV4cG9ydHMuYmFja1NsYXNoID0gMjIwXG5leHBvcnRzLmNsb3NlQnJhY2tldCA9IDIyMVxuZXhwb3J0cy5zaW5nbGVRdW90ZSA9IDIyMlxuXG5rZXlNYXAgPSB7fVxuXG5leHBvcnRzLm9uS2V5ID0gKGtleSwgaGFuZGxlciwgdGhyb3R0bGVUaW1lKSAtPlxuICAgIGlmIGhhbmRsZXIgIT0gdW5kZWZpbmVkXG4gICAgICAgIGtleU1hcFtrZXldID0gVXRpbHMudGhyb3R0bGUgdGhyb3R0bGVUaW1lLCBoYW5kbGVyXG4gICAgZWxzZVxuICAgICAgICBrZXlNYXBba2V5XSA9IFwiXCJcblxuZXhwb3J0cy5vZmZLZXkgPSAoa2V5KSAtPlxuICAgIGRlbGV0ZSBrZXlNYXBba2V5XVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAna2V5ZG93bicsIChldmVudCkgLT5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlciA9IGtleU1hcFtldmVudC5rZXlDb2RlXVxuICAgIGlmIChoYW5kbGVyKVxuICAgICAgICBoYW5kbGVyKCkiLCJzdHJVdGlscyA9IHJlcXVpcmUgXCJzdHJVdGlsc1wiXG5rID0gcmVxdWlyZSBcIktleWJvYXJkXCJcbmNsYXNzIGV4cG9ydHMuSGlnaGxpZ2h0IGV4dGVuZHMgTGF5ZXJcbiAgICBjb25zdHJ1Y3RvcjogKCBvcHRpb25zPXt9ICkgLT5cblxuICAgICAgICBfLmRlZmF1bHRzIEAsXG4gICAgICAgICAgICBmaXJzdEhpZ2hsaWdodDogXCJcIlxuICAgICAgICBzdXBlciBvcHRpb25zXG5cbiAgICAgICAgXy5hc3NpZ24gQCxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJcIlxuICAgICAgICAgICAgaW5pdDogZmFsc2VcblxuICAgICAgICBAY3VycmVudENvbnRleHQgPSBAZmlyc3RIaWdobGlnaHRcbiAgICAgICAgaWYgbmF2aWdhYmxlc0FycmF5P1xuICAgICAgICAgICAgaWYgQGN1cnJlbnRDb250ZXh0ID09IFwiXCJcbiAgICAgICAgICAgICAgICBuYXZpZ2FibGVzQXJyYXlbMF1cbiAgICAgICAgICAgICAgICBAY3VycmVudENvbnRleHQgPSBuYXZpZ2FibGVzQXJyYXlbMF1cbiAgICAgICAgICAgIGZvciBuYXYgaW4gbmF2aWdhYmxlc0FycmF5XG4gICAgICAgICAgICAgICAgaWYgbmF2IGluc3RhbmNlb2YgTWVudVxuICAgICAgICAgICAgICAgICAgICBuYXYuaGlnaGxpZ2h0TGF5ZXIgPSBuYXYuX2Fzc2lnbkhpZ2hsaWdodCggQC5fY3JlYXRlTWVudUhpZ2hsaWdodCggbmF2ICkgKVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgbmF2IGluc3RhbmNlb2YgQ2Fyb3VzZWwgb3IgbmF2IGluc3RhbmNlb2YgR3JpZFxuICAgICAgICAgICAgICAgICAgICBuYXYuaGlnaGxpZ2h0TGF5ZXIgPSBuYXYuX2Fzc2lnbkhpZ2hsaWdodCggQC5fY3JlYXRlVGlsZUhpZ2hsaWdodCgpIClcbiAgICAgICAgICAgICAgICBlbHNlIGlmIG5hdiBpbnN0YW5jZW9mIE5hdmlnYWJsZXNcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGF0J3MgZmluZSwgdGhpcyBpcyBhIGN1c3RvbSBlbGVtZW50IGFuZCBjYW4gbWFrZSBpdCdzIG93biBoaWdobGlnaHQgc3RhdGUuXCIpXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBuYXYuaGlnaGxpZ2h0P1xuICAgICAgICAgICAgICAgICAgICBuYXYuaGlnaGxpZ2h0KDApXG4gICAgICAgICAgICAgICAgZWxzZSB0aHJvdyBcIkFsbCBOYXZpZ2FibGVzIG11c3QgaGF2ZSBhIC5oaWdobGlnaHQoKSBmdW5jdGlvbiBhbmQgYSAucmVtb3ZlSGlnaGxpZ2h0KCkgZnVuY3Rpb24uXCJcblxuICAgICAgICAjwqBQbGFjZSBpbiByZXNldCBjb250ZXh0IG1ldGhvZFxuICAgICAgICBALnNldENvbnRleHQoIG5hdmlnYWJsZXNBcnJheVswXSApO1xuXG4gICAgX2NyZWF0ZU1lbnVIaWdobGlnaHQ6ICggbmF2ICkgLT5cbiAgICAgICAgQG1lbnVIaWdobGlnaHQgPSBuZXcgTGF5ZXJcbiAgICAgICAgICAgIHBhcmVudDogQFxuICAgICAgICAgICAgeTogbmF2LmhpZ2hsaWdodFlcbiAgICAgICAgICAgIHg6IG5hdi5jaGlsZHJlbltuYXYuaGlnaGxpZ2h0SW5kZXhdLnNjcmVlbkZyYW1lLnhcbiAgICAgICAgICAgIGhlaWdodDogMlxuICAgICAgICAgICAgd2lkdGg6IG5hdi5jaGlsZHJlblswXS53aWR0aCsxMFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBzdHJVdGlscy5ibHVlXG4gICAgICAgIG1lbnVIaWdobGlnaHRHbG93ID0gbmV3IExheWVyXG4gICAgICAgICAgICBwYXJlbnQ6IEBtZW51SGlnaGxpZ2h0XG4gICAgICAgICAgICBoZWlnaHQ6IDRcbiAgICAgICAgICAgIHg6IC01XG4gICAgICAgICAgICB5OiAtMVxuICAgICAgICAgICAgYmx1cjogN1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBzdHJVdGlscy5ibHVlXG4gICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgIG1lbnVIaWdobGlnaHRHbG93LmJyaW5nVG9Gcm9udCgpXG5cbiAgICAgICAgbWVudUhpZ2hsaWdodFB1bHNlID0gbmV3IEFuaW1hdGlvblxuICAgICAgICAgICAgbGF5ZXI6IG1lbnVIaWdobGlnaHRHbG93XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIHRpbWU6IDJcbiAgICAgICAgICAgIGN1cnZlOiBcImVhc2UtaW4tb3V0XCJcblxuICAgICAgICBtZW51SGlnaGxpZ2h0UHVsc2VGYWRlID0gbmV3IEFuaW1hdGlvblxuICAgICAgICAgICAgbGF5ZXI6IG1lbnVIaWdobGlnaHRHbG93XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDBcbiAgICAgICAgICAgIHRpbWU6IDJcbiAgICAgICAgICAgIGN1cnZlOiBcImVhc2UtaW4tb3V0XCJcblxuICAgICAgICBtZW51SGlnaGxpZ2h0UHVsc2Uub24oRXZlbnRzLkFuaW1hdGlvbkVuZCwgbWVudUhpZ2hsaWdodFB1bHNlRmFkZS5zdGFydClcbiAgICAgICAgbWVudUhpZ2hsaWdodFB1bHNlRmFkZS5vbihFdmVudHMuQW5pbWF0aW9uRW5kLCBtZW51SGlnaGxpZ2h0UHVsc2Uuc3RhcnQpXG4gICAgICAgIG1lbnVIaWdobGlnaHRQdWxzZS5zdGFydCgpXG4gICAgICAgIG1lbnVIaWdobGlnaHRHbG93LmJsdXIgPSA3XG5cbiAgICAgICAgcmV0dXJuIEBtZW51SGlnaGxpZ2h0XG5cbiAgICBfY3JlYXRlVGlsZUhpZ2hsaWdodDogKCkgLT5cbiAgICAgICAgQHRpbGVIaWdobGlnaHQgPSBuZXcgTGF5ZXJcbiAgICAgICAgICAgIHBhcmVudDogQFxuICAgICAgICAgICAgd2lkdGg6IDIzMFxuICAgICAgICAgICAgaGVpZ2h0OiAxMjlcbiAgICAgICAgICAgIGJvcmRlcldpZHRoOiAyXG4gICAgICAgICAgICBib3JkZXJDb2xvcjogc3RyVXRpbHMuYmx1ZVxuICAgICAgICBAdGlsZUhpZ2hsaWdodC5zdHlsZS5iYWNrZ3JvdW5kID0gXCJcIlxuXG4gICAgICAgIHRpbGVHbG93ID0gQHRpbGVIaWdobGlnaHQuY29weSgpXG4gICAgICAgIF8uYXNzaWduIHRpbGVHbG93LFxuICAgICAgICAgICAgcGFyZW50OiBAdGlsZUhpZ2hsaWdodFxuICAgICAgICAgICAgc3R5bGU6IFwiYmFja2dyb3VuZFwiOlwiXCJcbiAgICAgICAgICAgIGJvcmRlcldpZHRoOiA1XG4gICAgICAgICAgICBibHVyOiA2XG4gICAgICAgICAgICBvcGFjaXR5OiAwXG5cbiAgICAgICAgQHRpbGVIaWdobGlnaHRQdWxzZSA9IG5ldyBBbmltYXRpb24gdGlsZUdsb3csXG4gICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICBvcHRpb25zOlxuICAgICAgICAgICAgICAgIHRpbWU6IDNcbiAgICAgICAgICAgICAgICBjdXJ2ZTogJ2Vhc2UtaW4tb3V0J1xuXG4gICAgICAgIEB0aWxlSGlnaGxpZ2h0UHVsc2VGYWRlID0gQHRpbGVIaWdobGlnaHRQdWxzZS5yZXZlcnNlKClcbiAgICAgICAgQHRpbGVIaWdobGlnaHRQdWxzZS5vcHRpb25zLmRlbGF5ID0gMVxuXG4gICAgICAgIEB0aWxlSGlnaGxpZ2h0UHVsc2Uub24oRXZlbnRzLkFuaW1hdGlvbkVuZCwgQHRpbGVIaWdobGlnaHRQdWxzZUZhZGUuc3RhcnQpXG4gICAgICAgIEB0aWxlSGlnaGxpZ2h0UHVsc2VGYWRlLm9uKEV2ZW50cy5BbmltYXRpb25FbmQsIEB0aWxlSGlnaGxpZ2h0UHVsc2Uuc3RhcnQpXG4gICAgICAgIEB0aWxlSGlnaGxpZ2h0UHVsc2Uuc3RhcnQoKVxuXG4gICAgICAgIHJldHVybiBAdGlsZUhpZ2hsaWdodFxuXG4gICAgc2V0Q29udGV4dDogKCBuZXdDb250ZXh0ICkgLT5cbiAgICAgICAgZm9yIG5hdiBpbiBuYXZpZ2FibGVzQXJyYXlcbiAgICAgICAgICAgIGlmIG5hdiAhPSBuZXdDb250ZXh0XG4gICAgICAgICAgICAgICAgbmF2LnJlbW92ZUhpZ2hsaWdodCgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbmF2LmhpZ2hsaWdodChuYXYubGFzdEhpZ2hsaWdodClcbiAgICAgICAgICAgICAgICBALmN1cnJlbnRDb250ZXh0ID0gbmF2XG5cbiAgICAgICAgaWYgbmV3Q29udGV4dC5tb3ZlVXA/ID09IGZhbHNlIHRoZW4gbmV3Q29udGV4dC5tb3ZlVXAgPSAtPiBuZXdDb250ZXh0LmVtaXQoXCJ1cE91dFwiKVxuICAgICAgICBpZiBuZXdDb250ZXh0Lm1vdmVSaWdodD8gPT0gZmFsc2UgdGhlbiBuZXdDb250ZXh0Lm1vdmVSaWdodCA9IC0+IG5ld0NvbnRleHQuZW1pdChcInJpZ2h0T3V0XCIpXG4gICAgICAgIGlmIG5ld0NvbnRleHQubW92ZURvd24/ID09IGZhbHNlIHRoZW4gbmV3Q29udGV4dC5tb3ZlRG93biA9IC0+IG5ld0NvbnRleHQuZW1pdChcImRvd25PdXRcIilcbiAgICAgICAgaWYgbmV3Q29udGV4dC5tb3ZlTGVmdD8gPT0gZmFsc2UgdGhlbiBuZXdDb250ZXh0Lm1vdmVMZWZ0ID0gLT4gbmV3Q29udGV4dC5lbWl0KFwibGVmdE91dFwiKVxuXG4gICAgICAgIGsub25LZXkoIGsucmlnaHQsIG5ld0NvbnRleHQubW92ZVJpZ2h0IClcbiAgICAgICAgay5vbktleSggay5sZWZ0LCBuZXdDb250ZXh0Lm1vdmVMZWZ0IClcbiAgICAgICAgay5vbktleSggay51cCwgbmV3Q29udGV4dC5tb3ZlVXAgKVxuICAgICAgICBrLm9uS2V5KCBrLmRvd24sIG5ld0NvbnRleHQubW92ZURvd24gKVxuXG4gICAgcmVtb3ZlSGlnaGxpZ2h0OiAoKSAtPlxuICAgICAgICBmb3IgbmF2IGluIG5hdmlnYWJsZXNBcnJheVxuICAgICAgICAgICAgbmF2LnJlbW92ZUhpZ2hsaWdodCgpXG4gICAgICAgICAgICBuYXYuaGlnaGxpZ2h0TGF5ZXIudmlzaWJsZSA9IGZhbHNlIGlmIG5hdi5oaWdobGlnaHRMYXllcj9cbiAgICAgICAgICAgIGsub25LZXkoIGsucmlnaHQsIHVuZGVmaW5lZCApXG4gICAgICAgICAgICBrLm9uS2V5KCBrLmxlZnQsIHVuZGVmaW5lZCApXG4gICAgICAgICAgICBrLm9uS2V5KCBrLnVwLCB1bmRlZmluZWQgKVxuICAgICAgICAgICAgay5vbktleSggay5kb3duLCB1bmRlZmluZWQgKSIsInsgUHJvZ3JhbW1lVGlsZSB9ID0gcmVxdWlyZSBcIlByb2dyYW1tZVRpbGVcIlxueyBOYXZpZ2FibGVzIH0gPSByZXF1aXJlIFwiTmF2aWdhYmxlc1wiXG5cbmNsYXNzIGV4cG9ydHMuR3JpZCBleHRlbmRzIE5hdmlnYWJsZXNcblx0Y29uc3RydWN0b3I6ICggb3B0aW9ucz17fSApIC0+XG5cdFx0QF9fY29uc3RydWN0aW9uID0gdHJ1ZVxuXHRcdEBfX2luc3RhbmNpbmcgPSB0cnVlXG5cdFx0Xy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0dGlsZVdpZHRoOiAyMzBcblx0XHRcdHRpbGVIZWlnaHQ6IDEyOVxuXHRcdFx0Z2FwczogOFxuXHRcdFx0bnVtYmVyT2ZUaWxlczogMzBcblx0XHRcdHRpbGVMYWJlbDogJ09uIE5vdydcblx0XHRcdGNvbHVtbnM6IDRcblx0XHRcdGRlYnVnOiBmYWxzZVxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRkZWxldGUgQF9fY29uc3RydWN0aW9uXG5cblx0XHRfLmFzc2lnbiBALFxuXHRcdFx0dGlsZVdpZHRoOiBvcHRpb25zLnRpbGVXaWR0aFxuXHRcdFx0dGlsZUhlaWdodDogb3B0aW9ucy50aWxlSGVpZ2h0XG5cdFx0XHRnYXBzOiBvcHRpb25zLmdhcHNcblx0XHRcdGNvbHVtbnM6IG9wdGlvbnMuY29sdW1uc1xuXHRcdFx0bnVtYmVyT2ZUaWxlczogb3B0aW9ucy5udW1iZXJPZlRpbGVzXG5cblx0XHRAZGVidWcgPSBvcHRpb25zLmRlYnVnXG5cdFx0I1NhZmUgem9uZVxuXHRcdEBmaXJzdFBvc2l0aW9uID0gb3B0aW9ucy54XG5cdFx0QGdhcHMgPSBvcHRpb25zLmdhcHNcblx0XHRAeFBvcyA9IDFcblx0XHRAeVBvcyA9IDFcblx0XHRAZXZlbnRzID0gW11cblxuXHRcdCMgZm9yIGkgaW4gWzAuLi5AbnVtYmVyT2ZUaWxlc11cblx0XHQjIFx0Y29uc29sZS5sb2coIFwiYWRkZWRcIiApXG5cdFx0IyBcdEBhZGRUaWxlKClcblx0XHRcblx0XHQjIEBfdXBkYXRlV2lkdGgoKVxuXHRcdCMgQF91cGRhdGVIZWlnaHQoIG9wdGlvbnMudGlsZUhlaWdodCApXG5cblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIFByaXZhdGUgTWV0aG9kc1xuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0IyBfdXBkYXRlSGVpZ2h0OiAoIHZhbHVlICkgLT5cblx0IyBcdEAuaGVpZ2h0ID0gdmFsdWVcblxuXHQjIF91cGRhdGVXaWR0aDogKCkgLT5cblx0IyBcdEAud2lkdGggPSAoQC50aWxlV2lkdGgrQC5nYXBzKSpALm51bWJlck9mVGlsZXMgaWYgQD9cblx0XG5cdCMgX3NldFRpbGVXaWR0aDogKCB2YWx1ZSApIC0+XG5cdCMgXHRmb3IgdGlsZSwgaSBpbiBALmNoaWxkcmVuXG5cdCMgXHRcdHRpbGUueCA9ICh2YWx1ZStAZ2FwcykgKiBpXG5cdCMgXHRcdHRpbGUud2lkdGggPSB2YWx1ZVxuXG5cdCMgX2FwcGx5VG9BbGxUaWxlczogKCB0YXNrLCB2YWx1ZSApIC0+XG5cdCMgXHRmb3IgdGlsZSwgaSBpbiBALmNoaWxkcmVuXG5cdCMgXHRcdGlmIHZhbHVlP1xuXHQjIFx0XHRcdHRhc2soIHRpbGUsIHZhbHVlIClcblx0IyBcdFx0ZWxzZVxuXHQjIFx0XHRcdHRhc2soIHRpbGUgKVxuXHRcblx0X3NldE51bWJlck9mVGlsZXM6ICggdGlsZXNObyApIC0+XG5cdFx0dGlsZURlbHRhID0gLShAbnVtYmVyT2ZUaWxlcyAtIHRpbGVzTm8pXG5cdFx0aWYgdGlsZURlbHRhID4gMFxuXHRcdFx0Zm9yIGkgaW4gWzAuLi50aWxlRGVsdGFdXG5cdFx0XHRcdEBhZGRUaWxlKClcblx0XHRlbHNlIGlmIHRpbGVEZWx0YSA8IDBcblx0XHRcdEByZW1vdmVUaWxlcyggLXRpbGVEZWx0YSApXG5cblx0X2FwcGx5RGF0YTogKCBkYXRhQXJyYXkgKSAtPlxuXHRcdGlmIEBkZWJ1ZyA9PSBmYWxzZVxuXHRcdFx0Zm9yIHRpbGUsIGkgaW4gQC5jaGlsZHJlblxuXHRcdFx0XHRpZiBkYXRhQXJyYXlbaV0/XG5cdFx0XHRcdFx0dGlsZS50aXRsZSA9IHN0clV0aWxzLmh0bWxFbnRpdGllcyggZGF0YUFycmF5W2ldLnRpdGxlIClcblx0XHRcdFx0XHR0aWxlLmltYWdlID0gc3RyVXRpbHMuaHRtbEVudGl0aWVzKCBkYXRhQXJyYXlbaV0uaW1hZ2UgKVxuXHRcdFx0XHRcdHRpbGUubGFiZWwgPSBzdHJVdGlscy5odG1sRW50aXRpZXMoIGRhdGFBcnJheVtpXS5sYWJlbCApXG5cdFx0XHRcdFx0dGlsZS50aGlyZExpbmUgPSBzdHJVdGlscy5odG1sRW50aXRpZXMoIGRhdGFBcnJheVtpXS50aGlyZExpbmUgKVxuXHRcdGVsc2UgcmV0dXJuXG5cdFxuXHRfbG9hZEV2ZW50czogKCBmZWVkICkgLT5cblx0XHRmb3IgZXZlbnQsIGkgaW4gZmVlZC5pdGVtc1xuXHRcdFx0ZXZlbnQgPSB7XG5cdFx0XHRcdHRpdGxlOiBpZiBldmVudC5icmFuZFN1bW1hcnk/IHRoZW4gZXZlbnQuYnJhbmRTdW1tYXJ5LnRpdGxlIGVsc2UgZXZlbnQudGl0bGVcblx0XHRcdFx0aW1hZ2U6IHN0clV0aWxzLmZpbmRJbWFnZUJ5SUQoZXZlbnQuaWQpXG5cdFx0XHRcdHRoaXJkTGluZTogaWYgZXZlbnQuc2VyaWVzU3VtbWFyeT8gdGhlbiBldmVudC5zZXJpZXNTdW1tYXJ5LnRpdGxlICsgXCIsIFwiICsgZXZlbnQudGl0bGUgZWxzZSBldmVudC5zaG9ydFN5bm9wc2lzXG5cdFx0XHRcdGxhYmVsOiBpZiBldmVudC5vbkRlbWFuZFN1bW1hcnk/IHRoZW4gc3RyVXRpbHMuZW50aXRsZW1lbnRGaW5kZXIoZXZlbnQub25EZW1hbmRTdW1tYXJ5KSBlbHNlIFwiXCJcblx0XHRcdH1cblx0XHRcdEBldmVudHNbaV0gPSAoIGV2ZW50IClcblxuXHQjIF9tb3ZlSGlnaGxpZ2h0OiAoIGNoaWxkSW5kZXggKSA9PlxuXHQjIFx0aWYgQGhpZ2hsaWdodExheWVyPyA9PSBmYWxzZVxuXHQjIFx0XHRyZXR1cm5cblx0IyBcdHhQb3MgPSBjaGlsZEluZGV4KiggQGdhcHMrQHRpbGVXaWR0aCApICsgQGZpcnN0UG9zaXRpb25cblx0IyBcdGlmIEBoaWdobGlnaHRMYXllci5zY3JlZW5GcmFtZS55ID09IEAuc2NyZWVuRnJhbWUueVxuXHQjIFx0XHRAaGlnaGxpZ2h0TGF5ZXIuYW5pbWF0ZVxuXHQjIFx0XHRcdHg6IHhQb3MgXG5cdCMgXHRlbHNlXG5cdCMgXHRcdEBoaWdobGlnaHRMYXllci54ID0geFBvcyBcblx0IyBcdFx0QGhpZ2hsaWdodExheWVyLnkgPSBALnNjcmVlbkZyYW1lLnlcblxuXHQjIFx0QGZvY3VzSW5kZXggPSBjaGlsZEluZGV4XG5cdFxuXHQjIF9tb3ZlQ2Fyb3VzZWw6ICggdGlsZUluZGV4ICkgLT5cblx0IyBcdGlmIEBoaWdobGlnaHRMYXllcj8gPT0gZmFsc2Vcblx0IyBcdFx0cmV0dXJuXG5cdCMgXHRjYXJvdXNlbExlZnQuc3RvcCgpIGlmIGNhcm91c2VsTGVmdD9cblx0IyBcdGNhcm91c2VsTGVmdCA9IG5ldyBBbmltYXRpb24gQCxcblx0IyBcdFx0eDogLSgoQHRpbGVXaWR0aCtAZ2FwcykqQGNhcm91c2VsSW5kZXgpICsgQGZpcnN0UG9zaXRpb25cblx0IyBcdGNhcm91c2VsTGVmdC5zdGFydCgpXG5cdCMgXHRALnNlbGVjdCh0aWxlSW5kZXgpLmhpZ2hsaWdodCgpXG5cblx0IyAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgIyBQdWJsaWMgTWV0aG9kc1xuXHQjICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRhZGRUaWxlOiAoIHRpbGUgKSA9PlxuXHRcdGNvbnNvbGUubG9nKCBAIClcblx0XHRsYXN0VGlsZUluZGV4ID0gQC5jaGlsZHJlbi5sZW5ndGhcblx0XHRyb3dObyA9IE1hdGguZmxvb3IobGFzdFRpbGVJbmRleC9AY29sdW1ucykgIyByb3dOdW1iZXJcblx0XHRmdWxsVGlsZVdpZHRoID0gQHRpbGVXaWR0aCtAZ2Fwc1xuXHRcdEB3aWR0aCA9IGZ1bGxUaWxlV2lkdGggKiBAY29sdW1uc1xuXHRcdHhQb3NpdGlvbiA9IGZ1bGxUaWxlV2lkdGgqbGFzdFRpbGVJbmRleCAtIEB3aWR0aCpyb3dOb1xuXHRcdHlQb3NpdGlvbiA9IHJvd05vKihAdGlsZUhlaWdodCtAZ2Fwcylcblx0XHRpZiB0aWxlID09IHVuZGVmaW5lZFxuXHRcdFx0dGlsZSA9IG5ldyBQcm9ncmFtbWVUaWxlXG5cdFx0XHRcdHBhcmVudDogQFxuXHRcdFx0XHR3aWR0aDogQHRpbGVXaWR0aFxuXHRcdFx0XHRoZWlnaHQ6IEB0aWxlSGVpZ2h0XG5cdFx0XHRcdG1ldGE6IEBtZXRhXG5cdFx0XHRcdGltYWdlOiBAaW1hZ2Vcblx0XHRcdFx0dGl0bGU6IEB0aXRsZVxuXHRcdFx0XHR0aGlyZExpbmU6IEB0aGlyZExpbmVcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0dGlsZS54ID0geFBvc2l0aW9uXG5cdFx0XHR0aWxlLnkgPSB5UG9zaXRpb25cblx0XHRcdGZvciB0aWxlcywgaSBpbiBALmNoaWxkcmVuXG5cdFx0XHRcdHRpbGVzLmRpc2FwcGVhci5zdG9wKClcblx0XHRcdFx0dGlsZXMuYXBwZWFyLnN0YXJ0KClcblx0XHRcdHRpbGUudGlsZUFuaW1hdGlvbiA9IHRpbGUuYW5pbWF0ZVxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFxuXHQjIHJlbW92ZVRpbGVzOiAoIG51bWJlck9mVGlsZXMgKSA9PlxuXHQjIFx0Zm9yIGkgaW4gWzAuLi5udW1iZXJPZlRpbGVzXVxuXHQjIFx0XHRsYXN0VGlsZUluZGV4ID0gQC5jaGlsZHJlbi5sZW5ndGgtMVxuXHQjIFx0XHRALmNoaWxkcmVuW2xhc3RUaWxlSW5kZXhdLm9wYWNpdHkgPSAwXG5cdCMgXHRcdEAuY2hpbGRyZW5bbGFzdFRpbGVJbmRleF0uZGVzdHJveSgpXG5cblx0IyBzZWxlY3Q6ICggeFBvcywgeVBvcyApIC0+XG5cdCMgXHRyZXR1cm4gQGNoaWxkcmVuWyh4UG9zKnlQb3MpLTFdXG5cdFxuXHRoaWdobGlnaHQ6ICggeFBvcywgeVBvcyApIC0+XG5cdFx0IyBpZiBAaGlnaGxpZ2h0TGF5ZXI/XG5cdFx0IyBcdEAuc2VsZWN0KCB0aWxlSW5kZXggKS5oaWdobGlnaHQoKVxuXHRcdCMgXHRAaGlnaGxpZ2h0TGF5ZXIuaGVpZ2h0ID0gQC50aWxlSGVpZ2h0XG5cdFx0IyBcdEBoaWdobGlnaHRMYXllci53aWR0aCA9IEAudGlsZVdpZHRoXG5cdFx0IyBcdGZvciBjaGlsZCwgaSBpbiBAaGlnaGxpZ2h0TGF5ZXIuY2hpbGRyZW5cblx0XHQjIFx0XHRjaGlsZC5oZWlnaHQgPSBALnRpbGVIZWlnaHRcblx0XHQjIFx0XHRjaGlsZC53aWR0aCA9IEAudGlsZVdpZHRoXG5cdFx0IyBcdEAuX21vdmVIaWdobGlnaHQoIEBmb2N1c0luZGV4IClcblx0XHQjIFx0QGhpZ2hsaWdodExheWVyLnZpc2libGUgPSB0cnVlXG5cdFx0Y29uc29sZS5sb2coXCJoaWdobGlnaHQgXCIgKyB4UG9zICsgXCIgfCBcIiArIHlQb3MpXG5cdFxuXHRyZW1vdmVIaWdobGlnaHQ6ICgpIC0+XG5cdFx0IyBALnNlbGVjdChAbGFzdEhpZ2hsaWdodCkucmVtb3ZlSGlnaGxpZ2h0KClcblx0XHQjIEBoaWdobGlnaHRMYXllci52aXNpYmxlID0gZmFsc2VcbiAgICAgICAgY29uc29sZS5sb2coXCJyZW1vdmUgaGlnaGxpZ2h0XCIpXG5cblx0IyBtb3ZlUmlnaHQ6ID0+XG5cdCMgXHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXgrQGNhcm91c2VsSW5kZXhcblx0IyBcdGlmIEBmb2N1c0luZGV4IDwgQHJpZ2h0UGFnZUJvdW5kYXJ5IG9yIFxuXHQjIFx0dG90YWxJbmRleCA9PSBAbnVtYmVyT2ZUaWxlcy0yXG5cdCMgXHRcdEAuc2VsZWN0KCB0b3RhbEluZGV4ICkucmVtb3ZlSGlnaGxpZ2h0KClcblx0IyBcdFx0QGZvY3VzSW5kZXgrK1xuXHQjIFx0XHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXggKyBAY2Fyb3VzZWxJbmRleFxuXHQjIFx0XHRALmhpZ2hsaWdodCggdG90YWxJbmRleCApXG5cdCMgXHRlbHNlIGlmIEBmb2N1c0luZGV4ID49IEByaWdodFBhZ2VCb3VuZGFyeSBhbmQgdG90YWxJbmRleCA8IEBudW1iZXJPZlRpbGVzLTJcblx0IyBcdFx0QC5zZWxlY3QodG90YWxJbmRleCkucmVtb3ZlSGlnaGxpZ2h0KClcblx0IyBcdFx0QGNhcm91c2VsSW5kZXgrK1xuXHQjIFx0XHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXgrQGNhcm91c2VsSW5kZXhcblx0IyBcdFx0QC5fbW92ZUNhcm91c2VsKCB0b3RhbEluZGV4IClcblx0IyBcdGVsc2UgQGVtaXQoXCJyaWdodE91dFwiKVxuXHQjIFx0QGxhc3RIaWdobGlnaHQgPSB0b3RhbEluZGV4XG5cdFxuXHQjIG1vdmVMZWZ0OiA9PlxuXHQjIFx0dG90YWxJbmRleCA9IEBmb2N1c0luZGV4K0BjYXJvdXNlbEluZGV4XG5cdCMgXHRpZiBAZm9jdXNJbmRleCA+IEBsZWZ0UGFnZUJvdW5kYXJ5IG9yIFxuXHQjIFx0dG90YWxJbmRleCA9PSAxXG5cdCMgXHRcdEAuc2VsZWN0KCB0b3RhbEluZGV4ICkucmVtb3ZlSGlnaGxpZ2h0KClcblx0IyBcdFx0QGZvY3VzSW5kZXgtLVxuXHQjIFx0XHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXggKyBAY2Fyb3VzZWxJbmRleFxuXHQjIFx0XHRALmhpZ2hsaWdodCggdG90YWxJbmRleCApXG5cdCMgXHRlbHNlIGlmIEBmb2N1c0luZGV4ID49IEBsZWZ0UGFnZUJvdW5kYXJ5IGFuZCB0b3RhbEluZGV4ID4gMVxuXHQjIFx0XHRALnNlbGVjdCggdG90YWxJbmRleCApLnJlbW92ZUhpZ2hsaWdodCgpXG5cdCMgXHRcdEBjYXJvdXNlbEluZGV4LS1cblx0IyBcdFx0dG90YWxJbmRleCA9IEBmb2N1c0luZGV4K0BjYXJvdXNlbEluZGV4XG5cdCMgXHRcdEAuX21vdmVDYXJvdXNlbCggdG90YWxJbmRleCApXG5cdCMgXHRlbHNlIEBlbWl0KFwibGVmdE91dFwiKVxuXHQjIFx0QGxhc3RIaWdobGlnaHQgPSB0b3RhbEluZGV4XG5cdFxuXHQjIG1vdmVVcDogKCkgPT5cblx0IyBcdEBlbWl0KFwidXBPdXRcIilcblxuXHQjIG1vdmVEb3duOiAoKSA9PlxuXHQjIFx0QGVtaXQoXCJkb3duT3V0XCIpXG5cblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIEluaXRcblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcblx0XG5cblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQjIERlZmluaXRpb25zXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHQjIEBkZWZpbmUgJ3RpbGVXaWR0aCcsXG5cdCMgXHRnZXQ6IC0+IEAuc2VsZWN0KDApLndpZHRoIGlmIEAuc2VsZWN0KCk/XG5cdCMgXHRzZXQ6ICggdmFsdWUgKSAtPlxuXHQjIFx0XHRyZXR1cm4gaWYgQF9faW5zdGFuY2luZ1xuXHQjIFx0XHRAX3NldFRpbGVXaWR0aCggdmFsdWUgKSBpZiBAP1xuXHQjIEBkZWZpbmUgJ3RpbGVIZWlnaHQnLFxuXHQjIFx0Z2V0OiAtPiBALnNlbGVjdCgwKS5oZWlnaHQgaWYgQC5zZWxlY3QoMCk/XG5cdCMgXHRzZXQ6ICggdmFsdWUgKSAtPlxuXHQjIFx0XHRyZXR1cm4gaWYgQF9fY29uc3RydWN0aW9uXG5cdCMgXHRcdEAuX3VwZGF0ZUhlaWdodCh2YWx1ZSlcblx0QGRlZmluZSAnbnVtYmVyT2ZUaWxlcycsXG5cdFx0Z2V0OiAtPiBALmNoaWxkcmVuLmxlbmd0aFxuXHRcdHNldDogKCB2YWx1ZSApIC0+XG5cdFx0XHRyZXR1cm4gaWYgQF9fY29uc3RydWN0aW9uXG5cdFx0XHRAX3NldE51bWJlck9mVGlsZXMoIHZhbHVlIClcblx0XG5cdCMgQGRlZmluZSAnd2lkdGgnLFxuXHQjIFx0Z2V0OiAtPiBAX3dpZHRoXG5cdCMgXHRzZXQ6ICggdmFsdWUgKSAtPiBAX3VwZGF0ZVdpZHRoIGlmIEA/XG5cblx0ZGVsZXRlIEBfX2luc3RhbmNpbmciLCJ7IFByb2dyYW1tZVRpbGUgfSA9IHJlcXVpcmUgXCJQcm9ncmFtbWVUaWxlXCJcbnsgTmF2aWdhYmxlcyB9ID0gcmVxdWlyZSBcIk5hdmlnYWJsZXNcIlxuXG5jbGFzcyBleHBvcnRzLkNhcm91c2VsIGV4dGVuZHMgTmF2aWdhYmxlc1xuXHRjb25zdHJ1Y3RvcjogKCBvcHRpb25zPXt9ICkgLT5cblx0XHRAX19jb25zdHJ1Y3Rpb24gPSB0cnVlXG5cdFx0QF9faW5zdGFuY2luZyA9IHRydWVcblx0XHRfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHR0aWxlV2lkdGg6IDI4MFxuXHRcdFx0dGlsZUhlaWdodDogMTU3XG5cdFx0XHRoZWlnaHQ6IG9wdGlvbnMudGlsZUhlaWdodFxuXHRcdFx0Z2FwczogOFxuXHRcdFx0bnVtYmVyT2ZUaWxlczogNVxuXHRcdFx0dGlsZUxhYmVsOiAnT24gTm93J1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXG5cdFx0XHRkZWJ1ZzogZmFsc2Vcblx0XHRzdXBlciBvcHRpb25zXG5cdFx0ZGVsZXRlIEBfX2NvbnN0cnVjdGlvblxuXG5cdFx0Xy5hc3NpZ24gQCxcblx0XHRcdGhlaWdodDogb3B0aW9ucy50aWxlSGVpZ2h0XG5cdFx0XHR0aWxlV2lkdGg6IG9wdGlvbnMudGlsZVdpZHRoXG5cdFx0XHR0aWxlSGVpZ2h0OiBvcHRpb25zLnRpbGVIZWlnaHRcblx0XHRcdGdhcHM6IG9wdGlvbnMuZ2Fwc1xuXHRcdFx0Zm9jdXNJbmRleDogMFxuXHRcdFx0Y2Fyb3VzZWxJbmRleDogMFxuXHRcdFxuXHRcdEBkZWJ1ZyA9IG9wdGlvbnMuZGVidWdcblx0XHQjU2FmZSB6b25lXG5cdFx0QGZpcnN0UG9zaXRpb24gPSBvcHRpb25zLnhcblx0XHRAZnVsbFRpbGVzVmlzaWJsZSA9IF8uZmxvb3IoIFNjcmVlbi53aWR0aCAvIChvcHRpb25zLnRpbGVXaWR0aCtvcHRpb25zLmdhcHMpIClcblx0XHRAcmlnaHRQYWdlQm91bmRhcnkgPSBAZnVsbFRpbGVzVmlzaWJsZSAtIDEgLSAxICNBY2NvdW50aW5nIGZvciAwXG5cdFx0QGxlZnRQYWdlQm91bmRhcnkgPSAxXG5cdFx0QGdhcHMgPSBvcHRpb25zLmdhcHNcblx0XHRAbGFzdEhpZ2hsaWdodCA9IDBcblx0XHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdCMgTGF5ZXJzXG5cdFx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRcblx0XHRAZXZlbnRzID0gW11cblx0XHRmb3IgaSBpbiBbMC4uLm9wdGlvbnMubnVtYmVyT2ZUaWxlc11cblx0XHRcdEBhZGRUaWxlKClcblx0XHRcblx0XHRAX3VwZGF0ZVdpZHRoKClcblx0XHRAX3VwZGF0ZUhlaWdodCggb3B0aW9ucy50aWxlSGVpZ2h0IClcblxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgRXZlbnRzXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRcdEBvbiBcImNoYW5nZTp3aWR0aFwiLCBAX3VwZGF0ZVdpZHRoXG5cdFx0QG9uIFwiY2hhbmdlOmhlaWdodFwiLCBAX3VwZGF0ZUhlaWdodFxuXG5cdCM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyBQcml2YXRlIE1ldGhvZHNcblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdF91cGRhdGVIZWlnaHQ6ICggdmFsdWUgKSAtPlxuXHRcdEAuaGVpZ2h0ID0gdmFsdWVcblx0XHRmb3IgY2hpbGQgaW4gQC5jaGlsZHJlblxuXHRcdFx0Y2hpbGQuaGVpZ2h0ID0gdmFsdWVcblxuXHRfdXBkYXRlV2lkdGg6ICgpIC0+XG5cdFx0QC53aWR0aCA9IChALnRpbGVXaWR0aCtALmdhcHMpKkAubnVtYmVyT2ZUaWxlcyBpZiBAP1xuXHRcblx0X3NldFRpbGVXaWR0aDogKCB2YWx1ZSApIC0+XG5cdFx0Zm9yIHRpbGUsIGkgaW4gQC5jaGlsZHJlblxuXHRcdFx0dGlsZS54ID0gKHZhbHVlK0BnYXBzKSAqIGlcblx0XHRcdHRpbGUud2lkdGggPSB2YWx1ZVxuXG5cdF9hcHBseVRvQWxsVGlsZXM6ICggdGFzaywgdmFsdWUgKSAtPlxuXHRcdGZvciB0aWxlLCBpIGluIEAuY2hpbGRyZW5cblx0XHRcdGlmIHZhbHVlP1xuXHRcdFx0XHR0YXNrKCB0aWxlLCB2YWx1ZSApXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRhc2soIHRpbGUgKVxuXHRcblx0X3NldE51bWJlck9mVGlsZXM6ICggdGlsZXNObyApIC0+XG5cdFx0dGlsZURlbHRhID0gLShAbnVtYmVyT2ZUaWxlcyAtIHRpbGVzTm8pXG5cdFx0aWYgdGlsZURlbHRhID4gMFxuXHRcdFx0Zm9yIGkgaW4gWzAuLi50aWxlRGVsdGFdXG5cdFx0XHRcdEBhZGRUaWxlKClcblx0XHRlbHNlIGlmIHRpbGVEZWx0YSA8IDBcblx0XHRcdEByZW1vdmVUaWxlcyggLXRpbGVEZWx0YSApXG5cblx0X2FwcGx5RGF0YTogKCBkYXRhQXJyYXkgKSAtPlxuXHRcdGlmIEBkZWJ1ZyA9PSBmYWxzZVxuXHRcdFx0Zm9yIHRpbGUsIGkgaW4gQC5jaGlsZHJlblxuXHRcdFx0XHRpZiBkYXRhQXJyYXlbaV0/XG5cdFx0XHRcdFx0dGlsZS50aXRsZSA9IHN0clV0aWxzLmh0bWxFbnRpdGllcyggZGF0YUFycmF5W2ldLnRpdGxlIClcblx0XHRcdFx0XHR0aWxlLmltYWdlID0gc3RyVXRpbHMuaHRtbEVudGl0aWVzKCBkYXRhQXJyYXlbaV0uaW1hZ2UgKVxuXHRcdFx0XHRcdHRpbGUubGFiZWwgPSBzdHJVdGlscy5odG1sRW50aXRpZXMoIGRhdGFBcnJheVtpXS5sYWJlbCApXG5cdFx0XHRcdFx0dGlsZS50aGlyZExpbmUgPSBzdHJVdGlscy5odG1sRW50aXRpZXMoIGRhdGFBcnJheVtpXS50aGlyZExpbmUgKVxuXHRcdGVsc2UgcmV0dXJuXG5cdFxuXHRfbG9hZEV2ZW50czogKCBmZWVkICkgLT5cblx0XHRmb3IgZXZlbnQsIGkgaW4gZmVlZC5pdGVtc1xuXHRcdFx0ZXZlbnQgPSB7XG5cdFx0XHRcdHRpdGxlOiBpZiBldmVudC5icmFuZFN1bW1hcnk/IHRoZW4gZXZlbnQuYnJhbmRTdW1tYXJ5LnRpdGxlIGVsc2UgZXZlbnQudGl0bGVcblx0XHRcdFx0aW1hZ2U6IHN0clV0aWxzLmZpbmRJbWFnZUJ5SUQoZXZlbnQuaWQpXG5cdFx0XHRcdHRoaXJkTGluZTogaWYgZXZlbnQuc2VyaWVzU3VtbWFyeT8gdGhlbiBldmVudC5zZXJpZXNTdW1tYXJ5LnRpdGxlICsgXCIsIFwiICsgZXZlbnQudGl0bGUgZWxzZSBldmVudC5zaG9ydFN5bm9wc2lzXG5cdFx0XHRcdGxhYmVsOiBpZiBldmVudC5vbkRlbWFuZFN1bW1hcnk/IHRoZW4gc3RyVXRpbHMuZW50aXRsZW1lbnRGaW5kZXIoZXZlbnQub25EZW1hbmRTdW1tYXJ5KSBlbHNlIFwiXCJcblx0XHRcdH1cblx0XHRcdEBldmVudHNbaV0gPSAoIGV2ZW50IClcblxuXHRfbW92ZUhpZ2hsaWdodDogKCBjaGlsZEluZGV4ICkgPT5cblx0XHRpZiBAaGlnaGxpZ2h0TGF5ZXI/ID09IGZhbHNlXG5cdFx0XHRyZXR1cm5cblx0XHRpZiBAZmlyc3RQb3NpdGlvbj8gdGhlbiBleHRyYSA9IEBmaXJzdFBvc2l0aW9uIGVsc2UgZXh0cmEgPSAwXG5cdFx0eFBvcyA9IGNoaWxkSW5kZXgqKCBAZ2FwcytAdGlsZVdpZHRoICkgKyBleHRyYVxuXHRcdGlmIEBoaWdobGlnaHRMYXllci5zY3JlZW5GcmFtZS55ID09IEAuc2NyZWVuRnJhbWUueVxuXHRcdFx0QGhpZ2hsaWdodExheWVyLmFuaW1hdGVcblx0XHRcdFx0eDogeFBvcyBcblx0XHRlbHNlXG5cdFx0XHRAaGlnaGxpZ2h0TGF5ZXIueCA9IHhQb3MgXG5cdFx0XHRAaGlnaGxpZ2h0TGF5ZXIueSA9IEAuc2NyZWVuRnJhbWUueVxuXG5cdFx0QGZvY3VzSW5kZXggPSBjaGlsZEluZGV4XG5cdFxuXHRfbW92ZUNhcm91c2VsOiAoIHRpbGVJbmRleCApIC0+XG5cdFx0aWYgQGhpZ2hsaWdodExheWVyPyA9PSBmYWxzZVxuXHRcdFx0cmV0dXJuXG5cdFx0Y2Fyb3VzZWxMZWZ0LnN0b3AoKSBpZiBjYXJvdXNlbExlZnQ/XG5cdFx0Y2Fyb3VzZWxMZWZ0ID0gbmV3IEFuaW1hdGlvbiBALFxuXHRcdFx0eDogLSgoQHRpbGVXaWR0aCtAZ2FwcykqQGNhcm91c2VsSW5kZXgpICsgQGZpcnN0UG9zaXRpb25cblx0XHRjYXJvdXNlbExlZnQuc3RhcnQoKVxuXHRcdEAuc2VsZWN0KHRpbGVJbmRleCkuaGlnaGxpZ2h0KClcblxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgUHVibGljIE1ldGhvZHNcblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdGFkZFRpbGU6ICggdGlsZSApID0+XG5cdFx0bGFzdFRpbGVJbmRleCA9IEAuY2hpbGRyZW4ubGVuZ3RoXG5cdFx0eFBvc2l0aW9uID0gKCBAdGlsZVdpZHRoICsgQGdhcHMgKSAqIGxhc3RUaWxlSW5kZXhcblx0XHRpZiB0aWxlID09IHVuZGVmaW5lZFxuXHRcdFx0dGlsZSA9IG5ldyBQcm9ncmFtbWVUaWxlXG5cdFx0XHRcdHBhcmVudDogQFxuXHRcdFx0XHQjIG5hbWU6IFwiLlwiXG5cdFx0XHRcdHg6IGlmIHhQb3NpdGlvbiA9PSB1bmRlZmluZWQgdGhlbiAwIGVsc2UgeFBvc2l0aW9uXG5cdFx0XHRcdHdpZHRoOiBAdGlsZVdpZHRoXG5cdFx0XHRcdGhlaWdodDogQHRpbGVIZWlnaHRcblx0XHRcdFx0bWV0YTogQG1ldGFcblx0XHRcdFx0aW1hZ2U6IEBpbWFnZVxuXHRcdFx0XHR0aXRsZTogQHRpdGxlXG5cdFx0XHRcdHRoaXJkTGluZTogQHRoaXJkTGluZVxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cblx0XHRcdGZvciB0aWxlcywgaSBpbiBALmNoaWxkcmVuXG5cdFx0XHRcdHRpbGVzLmRpc2FwcGVhci5zdG9wKClcblx0XHRcdFx0dGlsZXMuYXBwZWFyLnN0YXJ0KClcblxuXHRcdFx0dGlsZS50aWxlQW5pbWF0aW9uID0gdGlsZS5hbmltYXRlXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XG5cdHJlbW92ZVRpbGVzOiAoIG51bWJlck9mVGlsZXMgKSA9PlxuXHRcdGZvciBpIGluIFswLi4ubnVtYmVyT2ZUaWxlc11cblx0XHRcdGxhc3RUaWxlSW5kZXggPSBALmNoaWxkcmVuLmxlbmd0aC0xXG5cdFx0XHRALmNoaWxkcmVuW2xhc3RUaWxlSW5kZXhdLm9wYWNpdHkgPSAwXG5cdFx0XHRALmNoaWxkcmVuW2xhc3RUaWxlSW5kZXhdLmRlc3Ryb3koKVxuXG5cdHNlbGVjdDogKCBpbmRleCApIC0+XG5cdFx0cmV0dXJuIEBjaGlsZHJlbltpbmRleF1cblx0XG5cdGhpZ2hsaWdodDogKCB0aWxlSW5kZXggKSAtPlxuXHRcdGlmIEBoaWdobGlnaHRMYXllcj9cblx0XHRcdEAuc2VsZWN0KCB0aWxlSW5kZXggKS5oaWdobGlnaHQoKVxuXHRcdFx0QGhpZ2hsaWdodExheWVyLmhlaWdodCA9IEAudGlsZUhlaWdodFxuXHRcdFx0QGhpZ2hsaWdodExheWVyLndpZHRoID0gQC50aWxlV2lkdGhcblx0XHRcdGZvciBjaGlsZCwgaSBpbiBAaGlnaGxpZ2h0TGF5ZXIuY2hpbGRyZW5cblx0XHRcdFx0Y2hpbGQuaGVpZ2h0ID0gQC50aWxlSGVpZ2h0XG5cdFx0XHRcdGNoaWxkLndpZHRoID0gQC50aWxlV2lkdGhcblx0XHRcdEAuX21vdmVIaWdobGlnaHQoIEBmb2N1c0luZGV4IClcblx0XHRcdEBoaWdobGlnaHRMYXllci52aXNpYmxlID0gdHJ1ZVxuXHRcblx0cmVtb3ZlSGlnaGxpZ2h0OiAoKSAtPlxuXHRcdEAuc2VsZWN0KEBsYXN0SGlnaGxpZ2h0KS5yZW1vdmVIaWdobGlnaHQoKVxuXHRcdEBoaWdobGlnaHRMYXllci52aXNpYmxlID0gZmFsc2VcblxuXHRtb3ZlUmlnaHQ6ID0+XG5cdFx0dG90YWxJbmRleCA9IEBmb2N1c0luZGV4K0BjYXJvdXNlbEluZGV4XG5cdFx0aWYgQGZvY3VzSW5kZXggPCBAcmlnaHRQYWdlQm91bmRhcnkgb3IgXG5cdFx0dG90YWxJbmRleCA9PSBAbnVtYmVyT2ZUaWxlcy0yXG5cdFx0XHRALnNlbGVjdCggdG90YWxJbmRleCApLnJlbW92ZUhpZ2hsaWdodCgpXG5cdFx0XHRAZm9jdXNJbmRleCsrXG5cdFx0XHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXggKyBAY2Fyb3VzZWxJbmRleFxuXHRcdFx0QC5oaWdobGlnaHQoIHRvdGFsSW5kZXggKVxuXHRcdGVsc2UgaWYgQGZvY3VzSW5kZXggPj0gQHJpZ2h0UGFnZUJvdW5kYXJ5IGFuZCB0b3RhbEluZGV4IDwgQG51bWJlck9mVGlsZXMtMlxuXHRcdFx0QC5zZWxlY3QodG90YWxJbmRleCkucmVtb3ZlSGlnaGxpZ2h0KClcblx0XHRcdEBjYXJvdXNlbEluZGV4Kytcblx0XHRcdHRvdGFsSW5kZXggPSBAZm9jdXNJbmRleCtAY2Fyb3VzZWxJbmRleFxuXHRcdFx0QC5fbW92ZUNhcm91c2VsKCB0b3RhbEluZGV4IClcblx0XHRlbHNlIEBlbWl0KFwicmlnaHRPdXRcIilcblx0XHRAbGFzdEhpZ2hsaWdodCA9IHRvdGFsSW5kZXhcblx0XG5cdG1vdmVMZWZ0OiA9PlxuXHRcdHRvdGFsSW5kZXggPSBAZm9jdXNJbmRleCtAY2Fyb3VzZWxJbmRleFxuXHRcdGlmIEBmb2N1c0luZGV4ID4gQGxlZnRQYWdlQm91bmRhcnkgb3IgXG5cdFx0dG90YWxJbmRleCA9PSAxXG5cdFx0XHRALnNlbGVjdCggdG90YWxJbmRleCApLnJlbW92ZUhpZ2hsaWdodCgpXG5cdFx0XHRAZm9jdXNJbmRleC0tXG5cdFx0XHR0b3RhbEluZGV4ID0gQGZvY3VzSW5kZXggKyBAY2Fyb3VzZWxJbmRleFxuXHRcdFx0QC5oaWdobGlnaHQoIHRvdGFsSW5kZXggKVxuXHRcdGVsc2UgaWYgQGZvY3VzSW5kZXggPj0gQGxlZnRQYWdlQm91bmRhcnkgYW5kIHRvdGFsSW5kZXggPiAxXG5cdFx0XHRALnNlbGVjdCh0b3RhbEluZGV4KS5yZW1vdmVIaWdobGlnaHQoKVxuXHRcdFx0QGNhcm91c2VsSW5kZXgtLVxuXHRcdFx0dG90YWxJbmRleCA9IEBmb2N1c0luZGV4K0BjYXJvdXNlbEluZGV4XG5cdFx0XHRALl9tb3ZlQ2Fyb3VzZWwoIHRvdGFsSW5kZXggKVxuXHRcdGVsc2Vcblx0XHRcdEBlbWl0KFwibGVmdE91dFwiKVxuXHRcdEBsYXN0SGlnaGxpZ2h0ID0gdG90YWxJbmRleFxuXHRcblx0bW92ZVVwOiAoKSA9PlxuXHRcdEBlbWl0KFwidXBPdXRcIilcblxuXHRtb3ZlRG93bjogKCkgPT5cblx0XHRAZW1pdChcImRvd25PdXRcIilcblxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgSW5pdFxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFxuXHRcblxuXHQjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdCMgRGVmaW5pdGlvbnNcblx0Iz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdCMgQGRlZmluZSAndGlsZVdpZHRoJyxcblx0IyBcdGdldDogLT4gQC5zZWxlY3QoMCkud2lkdGggaWYgQC5zZWxlY3QoKT9cblx0IyBcdHNldDogKCB2YWx1ZSApIC0+XG5cdCMgXHRcdHJldHVybiBpZiBAX19pbnN0YW5jaW5nXG5cdCMgXHRcdEBfc2V0VGlsZVdpZHRoKCB2YWx1ZSApIGlmIEA/XG5cdCMgQGRlZmluZSAndGlsZUhlaWdodCcsXG5cdCMgXHRnZXQ6IC0+IEAuc2VsZWN0KDApLmhlaWdodCBpZiBALnNlbGVjdCgwKT9cblx0IyBcdHNldDogKCB2YWx1ZSApIC0+XG5cdCMgXHRcdHJldHVybiBpZiBAX19jb25zdHJ1Y3Rpb25cblx0IyBcdFx0QC5fdXBkYXRlSGVpZ2h0KHZhbHVlKVxuXHRAZGVmaW5lICdudW1iZXJPZlRpbGVzJyxcblx0XHRnZXQ6IC0+IEAuY2hpbGRyZW4ubGVuZ3RoXG5cdFx0c2V0OiAoIHZhbHVlICkgLT5cblx0XHRcdHJldHVybiBpZiBAX19jb25zdHJ1Y3Rpb25cblx0XHRcdEBfc2V0TnVtYmVyT2ZUaWxlcyggdmFsdWUgKVxuXHRcblx0IyBAZGVmaW5lICd3aWR0aCcsXG5cdCMgXHRnZXQ6IC0+IEBfd2lkdGhcblx0IyBcdHNldDogKCB2YWx1ZSApIC0+IEBfdXBkYXRlV2lkdGggaWYgQD9cblxuXHRkZWxldGUgQF9faW5zdGFuY2luZyIsInsgTmF2aWdhYmxlcyB9ID0gcmVxdWlyZSBcIk5hdmlnYWJsZXNcIlxuc3RyVXRpbHMgPSByZXF1aXJlIFwic3RyVXRpbHNcIlxuXG5jbGFzcyBleHBvcnRzLkJ1dHRvbnMgZXh0ZW5kcyBOYXZpZ2FibGVzXG5cdGNvbnN0cnVjdG9yOiAoIG9wdGlvbnMgPXt9ICkgLT5cblx0XHRfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRoZWlnaHQ6IDQ2XG5cdFx0XHRib3JkZXJSYWRpdXM6IDNcblx0XHRcdGJ1dHRvbldpZHRoOiAyMDBcblx0XHRcdGdhcHM6IDE0XG5cdFx0XHRpdGVtczogW1wiQnV0dG9uIDFcIiwgXCJCdXR0b24gMlwiLCBcIkJ1dHRvbiAzXCJdXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdFxuXHRcdF8uYXNzaWduIEAsXG5cdFx0XHRidXR0b25XaWR0aDogb3B0aW9ucy5idXR0b25XaWR0aFxuXHRcdFx0Z2Fwczogb3B0aW9ucy5nYXBzXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiXCJcblxuXHRcdGZvciBidXR0b25UZXh0LCBpIGluIG9wdGlvbnMuaXRlbXNcblx0XHRcdEBidXR0b25Cb3JkZXIgPSBuZXcgTGF5ZXJcblx0XHRcdFx0Ym9yZGVyQ29sb3I6IFwiIzlDQUFCQ1wiXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRcdFx0XHRoZWlnaHQ6IDQ2XG5cdFx0XHRcdGJvcmRlclJhZGl1czogM1xuXHRcdFx0XHRib3JkZXJXaWR0aDogMVxuXHRcdFx0XHR3aWR0aDogQGJ1dHRvbldpZHRoXG5cdFx0XHRcdHg6IChAYnV0dG9uV2lkdGgrQGdhcHMpKmlcblx0XHRcdFx0cGFyZW50OiBAXG5cblx0XHRcdGJ1dHRvblRleHQgPSBuZXcgVGV4dExheWVyXG5cdFx0XHRcdHBhcmVudDogQGJ1dHRvbkJvcmRlclxuXHRcdFx0XHR0ZXh0OiBidXR0b25UZXh0XG5cdFx0XHRcdGNvbG9yOiBzdHJVdGlscy53aGl0ZVxuXHRcdFx0XHRmb250RmFtaWx5OiBcIkF2ZW5pci1saWdodFwiXG5cdFx0XHRcdGZvbnRTaXplOiAyMFxuXHRcdFx0XHRsZXR0ZXJTcGFjaW5nOiAwLjNcblx0XHRcdFx0eTogQWxpZ24uY2VudGVyKDIpXG5cdFx0XHRcdHg6IEFsaWduLmNlbnRlcigpXG5cblx0XHRAaGlnaGxpZ2h0TGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRcdEBsYXN0SGlnaGxpZ2h0ID0gMFxuXHRcblx0aGlnaGxpZ2h0OiAoIG5ld0luZGV4ICkgLT5cblx0XHRAY2hpbGRyZW5bIG5ld0luZGV4IF0uYmFja2dyb3VuZENvbG9yID0gc3RyVXRpbHMuZGFya0JsdWVcblx0XHRAbGFzdEhpZ2hsaWdodCA9IG5ld0luZGV4XG5cdHJlbW92ZUhpZ2hsaWdodDogKCkgLT5cblx0XHRAY2hpbGRyZW5bIEBsYXN0SGlnaGxpZ2h0IF0uYmFja2dyb3VuZENvbG9yID0gXCJcIlxuXHRtb3ZlUmlnaHQ6ICgpID0+XG5cdFx0aWYgQGxhc3RIaWdobGlnaHQgPCBAY2hpbGRyZW4ubGVuZ3RoLTFcblx0XHRcdEAucmVtb3ZlSGlnaGxpZ2h0KClcblx0XHRcdEAuaGlnaGxpZ2h0KEBsYXN0SGlnaGxpZ2h0KzEpXG5cdFx0ZWxzZSBAZW1pdChcInJpZ2h0T3V0XCIpXG5cdG1vdmVMZWZ0OiAoKSA9PlxuXHRcdGlmIEBsYXN0SGlnaGxpZ2h0ID4gMFxuXHRcdFx0QC5yZW1vdmVIaWdobGlnaHQoKVxuXHRcdFx0QC5oaWdobGlnaHQoQGxhc3RIaWdobGlnaHQtMSlcblx0XHRlbHNlIEBlbWl0KFwibGVmdE91dFwiKSIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBV0FBO0FEQUEsSUFBQSxvQkFBQTtFQUFBOzs7O0FBQUUsYUFBZSxPQUFBLENBQVEsWUFBUjs7QUFDakIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSOztBQUVMLE9BQU8sQ0FBQzs7O0VBQ0EsaUJBQUUsT0FBRjtBQUNaLFFBQUE7O01BRGMsVUFBUzs7OztJQUN2QixDQUFDLENBQUMsUUFBRixDQUFXLE9BQVgsRUFDQztNQUFBLE1BQUEsRUFBUSxFQUFSO01BQ0EsWUFBQSxFQUFjLENBRGQ7TUFFQSxXQUFBLEVBQWEsR0FGYjtNQUdBLElBQUEsRUFBTSxFQUhOO01BSUEsS0FBQSxFQUFPLENBQUMsVUFBRCxFQUFhLFVBQWIsRUFBeUIsVUFBekIsQ0FKUDtLQUREO0lBTUEseUNBQU0sT0FBTjtJQUVBLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUNDO01BQUEsV0FBQSxFQUFhLE9BQU8sQ0FBQyxXQUFyQjtNQUNBLElBQUEsRUFBTSxPQUFPLENBQUMsSUFEZDtNQUVBLGVBQUEsRUFBaUIsRUFGakI7S0FERDtBQUtBO0FBQUEsU0FBQSw2Q0FBQTs7TUFDQyxJQUFDLENBQUEsWUFBRCxHQUFvQixJQUFBLEtBQUEsQ0FDbkI7UUFBQSxXQUFBLEVBQWEsU0FBYjtRQUNBLGVBQUEsRUFBaUIsRUFEakI7UUFFQSxN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
