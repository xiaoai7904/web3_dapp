function t() {
  var e = this
  ;(this.plotSizeMultiplier = 0.5),
    (this.plotSizeSpacingMultiplier = 0.57142),
    (this.pixelSize = 0.03125),
    (this.zoom = 1),
    (this._isLeftMouseDown = !1),
    (this._isRightMouseDown = !1),
    (this._landPlots = []),
    (this._landParcels = []),
    (this._up = new s.vec2(0, t.plotSpacing)),
    (this._right = new s.vec2(-t.plotSpacing, 0)),
    (this._down = new s.vec2(0, -t.plotSpacing)),
    (this._left = new s.vec2(t.plotSpacing, 0)),
    (this.draggingTouch = !1),
    (this.mapGenerated = !1),
    (this.mapGeneratedCallback = null),
    (this._plotSprites = []),
    (this._keys = {}),
    (t.mapParent = document.getElementById("map")),
    (t.app = new a.Application({
      backgroundColor: 987674,
      width: t.mapParent.clientWidth,
      height: t.mapParent.clientHeight,
      autoDensity: !0,
      resolution: window.devicePixelRatio || 1,
    })),
    (this.ratio = t.mapParent.clientWidth / t.mapParent.clientHeight),
    t.mapParent.appendChild(t.app.view),
    (t.rootContainer = new a.Container()),
    t.app.stage.addChild(t.rootContainer),
    (this.mapTooltip = document.getElementById("map-tooltip")),
    t.app.loader
      .add(["images/mapTile_plotBlank.png"])
      .add(["images/mapTile_plotSettlement.png"])
      .add(["images/mapTile_plotTown.png"])
      .add(["images/mapTile_plotCity.png"])
      .add(["images/mapTile_plotCapital.png"])
      .add(["images/mapTile_parcel.png"])
      .add("map/solarwood.json")
      .load(function (t, n) {
        var r = n["map/solarwood.json"].data
        e.generateMap(n, r)
      }),
    (t.rootContainer.position.x = t.plotSpacing),
    this.registerInputEvents(t.mapParent),
    (window.onresize = this.resize)
  var n = a.Ticker.shared
  n.add(function (e) {
    var n = function (e) {
      for (var r in e) {
        var i = e[r],
          o = i.toGlobal(new a.Point(0, 0))
        ;(i.renderable =
          o.x > -15 * t.plotSpacing &&
          o.y > -15 * t.plotSpacing &&
          o.x < t.mapParent.clientWidth + 15 * t.plotSpacing &&
          o.y < t.mapParent.clientHeight + 15 * t.plotSpacing),
          i.children.length > 0 && n(i.children)
      }
    }
    n(t.rootContainer.children)
  }),
    n.start(),
    this.moveMap(new s.vec2(-90 * t.plotSpacing, -100 * t.plotSpacing))
}
return (
  (t.prototype.resize = function () {
    t.app.renderer.resize(t.mapParent.clientWidth, t.mapParent.clientHeight)
  }),
  (t.prototype.generateMap = function (e, n) {
    for (var r = 0, i = n; r < i.length; r++)
      for (var o = i[r], h = 0, l = o.children; h < l.length; h++) {
        var c = l[h],
          f = new s.vec2(
            o.coordinates.x + c.coordinates.x,
            o.coordinates.y + c.coordinates.y
          ),
          d = new u.LandPlotMapDataHolder(c.type, f, c.price, o.isForSale)
        this._landPlots.push(d)
        var p = this.getImageForPlot(e, c.type),
          m = new a.Sprite(p)
        m.anchor.set(1),
          (m.x = f.x * t.plotSpacing),
          (m.y = 200 * t.plotSpacing - f.y * t.plotSpacing),
          (m.zIndex = 10),
          (m.alpha = o.isForSale ? 0.5 : 0.2),
          (m.scale.x = this.plotSizeMultiplier),
          (m.scale.y = this.plotSizeMultiplier),
          t.rootContainer.addChild(m),
          (this._plotSprites[200 * f.y + f.x] = m)
      }
    ;(this.mapGenerated = !0),
      null !== this.mapGeneratedCallback && this.mapGeneratedCallback()
  }),
  (t.prototype.setPlotAvailability = function (t, e, n) {
    var r = this._plotSprites[200 * e + t]
    0.2 !== r.alpha && (r.alpha = 0.5)
  }),
  (t.prototype.registerInputEvents = function (e) {
    var n = this
    this.mapTooltip.addEventListener("mouseenter", function (e) {
      t.hoverTooltip = !0
    }),
      this.mapTooltip.addEventListener("mouseleave", function (e) {
        t.hoverTooltip = !1
      }),
      e.addEventListener("mousedown", function (t) {
        n.mouseDown(t)
      }),
      e.addEventListener("mousemove", function (t) {
        n.mouseMove(t)
      }),
      e.addEventListener("mouseup", function (t) {
        n.mouseUp(t)
      }),
      e.addEventListener("contextmenu", function (t) {
        t.preventDefault()
      }),
      e.addEventListener("wheel", function (t) {
        n.mouseScroll(t)
      }),
      e.addEventListener("mouseout", function (t) {
        n.mouseOut(t)
      }),
      window.addEventListener(
        "keydown",
        function (t) {
          n.keyDown(t)
        },
        !1
      ),
      window.addEventListener(
        "keyup",
        function (t) {
          n.keyUp(t)
        },
        !1
      ),
      e.addEventListener("touchmove", function (t) {
        n.touchMove(t)
      }),
      e.addEventListener("touchend", function (t) {
        n.touchEnd(t)
      })
  }),
  (t.prototype.moveMap = function (e) {
    "block" == this.mapTooltip.style.display &&
      (this.mapTooltip.style.display = "none"),
      (t.rootContainer.position.x += e.x),
      (t.rootContainer.position.y += e.y)
  }),
  (t.prototype.zoomMap = function (t) {}),
  (t.prototype.mouseDown = function (e) {
    if (!t.hoverTooltip) {
      0 == e.button
        ? (this._isLeftMouseDown = !0)
        : e.button >= 1 && (this._isRightMouseDown = !0)
      var n = t.mapParent.getBoundingClientRect().left,
        r = t.mapParent.getBoundingClientRect().top,
        i = e.x - n,
        o = e.y - r
      ;(this._lastMouseDownPos = new s.vec2(i, o)), e.preventDefault()
    }
  }),
  (t.prototype.mouseMove = function (e) {
    if (!t.hoverTooltip && this._isLeftMouseDown) {
      var n = new s.vec2(e.movementX, e.movementY)
      this.moveMap(n)
    }
  }),
  (t.prototype.touchMove = function (t) {
    this.draggingTouch = !0
    var e = t.touches[0].clientX,
      n = t.touches[0].clientY,
      r = new s.vec2(0, 0)
    e > this.startXTouch ? (r.x = 18) : e < this.startXTouch && (r.x = -18),
      n > this.startYTouch ? (r.y = 18) : n < this.startYTouch && (r.y = -18),
      this.moveMap(r),
      (this.startXTouch = e),
      (this.startYTouch = n)
  }),
  (t.prototype.touchEnd = function (e) {
    if (this.draggingTouch) this.draggingTouch = !1
    else {
      var n = t.mapParent.getBoundingClientRect().left,
        r = t.mapParent.getBoundingClientRect().top,
        i = e.changedTouches[0].clientX - n,
        o = e.changedTouches[0].clientY - r,
        a = Math.floor((i - t.rootContainer.position.x) / t.plotSpacing) + 1,
        u = 199 - Math.floor((o - t.rootContainer.position.y) / t.plotSpacing),
        h = new s.vec2(a, u)
      try {
        this.createTooltip(h)
      } catch (t) {}
    }
  }),
  (t.prototype.mouseOut = function (t) {
    this._isLeftMouseDown && (this._isLeftMouseDown = !1)
  }),
  (t.prototype.mouseUp = function (e) {
    if (!t.hoverTooltip) {
      var n = t.mapParent.getBoundingClientRect().left,
        r = t.mapParent.getBoundingClientRect().top,
        i = e.x - n,
        o = e.y - r,
        a = Math.floor((i - t.rootContainer.position.x) / t.plotSpacing) + 1,
        u = 199 - Math.floor((o - t.rootContainer.position.y) / t.plotSpacing),
        h = new s.vec2(a, u)
      try {
        this._isLeftMouseDown &&
          Math.abs(i - this._lastMouseDownPos.x) < 2 &&
          Math.abs(o - this._lastMouseDownPos.y) < 2 &&
          this.createTooltip(h)
      } catch (t) {
        console.log(t)
      }
      ;(this._isRightMouseDown = !1), (this._isLeftMouseDown = !1)
    }
  }),
  (t.prototype.createTooltip = function (t) {
    var e = this._landParcels.filter(function (e) {
        return (
          t.x >= e.coordinates.x &&
          t.x <= e.coordinates.x + e.size.x - 1 &&
          t.y >= e.coordinates.y &&
          t.y <= e.coordinates.y + e.size.y - 1
        )
      }),
      n = this.worldCoordinatesToPixelLocation(t),
      r = this._plotSprites[200 * t.y + t.x]
    if ((console.log(r.alpha), e[0])) {
      if (0 == e[0].isForSale || 0.5 == r.alpha) return
      for (var i = 0, o = 0; o < e[0].children.length; o++)
        i += e[0].children[o].price
      ;(this.isParcelGroupSelected = !0),
        (this.parcelGroupChildren = e[0].children),
        (this.selectedPlotType = "Assortment"),
        (this.selectedPlotImage = "assortment"),
        (this.selectedX = parseInt(JSON.stringify(e[0].coordinates.x))),
        (this.selectedY = parseInt(JSON.stringify(e[0].coordinates.y))),
        (this.selectedPrice = i)
    } else if (!e[0]) {
      var a = this._landPlots.filter(function (e) {
        return e.coordinates.x == t.x && e.coordinates.y == t.y
      })
      if (0 == a[0].isForSale || 0.5 == r.alpha) return
      ;(this.isParcelGroupSelected = !1),
        (this.selectedPlotType = this.getNameForPlot(
          parseInt(JSON.stringify(a[0].type))
        )),
        (this.selectedPlotImage = this.getNameForPlotImage(
          parseInt(JSON.stringify(a[0].type))
        )),
        (this.selectedX = parseInt(JSON.stringify(a[0].coordinates.x))),
        (this.selectedY = parseInt(JSON.stringify(a[0].coordinates.y))),
        (this.selectedPrice = parseFloat(JSON.stringify(a[0].price)))
    }
    ;(this.mapTooltip.querySelector(".tooltip-image").className =
      "tooltip-image"),
      this.mapTooltip
        .querySelector(".tooltip-image")
        .classList.add(this.selectedPlotImage),
      (this.mapTooltip.querySelector(".plot-type").innerHTML =
        this.selectedPlotType),
      (this.mapTooltip.querySelector(".location").innerHTML =
        this.selectedX + ", " + this.selectedY),
      (this.mapTooltip.querySelector(".price").innerHTML =
        this.selectedPrice.toFixed(3) + " ETH"),
      (this.mapTooltip.style.left = n.x - 171 - 14 + "px"),
      (this.mapTooltip.style.top = n.y - 128 + "px"),
      (this.mapTooltip.style.display = "block")
  }),
  (t.prototype.mouseScroll = function (t) {
    this.zoomMap(-t.deltaY / 2e3)
  }),
  (t.prototype.keyDown = function (t) {
    for (var e in ((this._keys[t.key] = !0), this._keys))
      "ArrowUp" == e
        ? this.moveMap(this._up)
        : "ArrowDown" == e && this.moveMap(this._down),
        "ArrowRight" == e
          ? this.moveMap(this._right)
          : "ArrowLeft" == e && this.moveMap(this._left)
  }),
  (t.prototype.keyUp = function (t) {
    delete this._keys[t.key]
  }),
  (t.prototype.worldCoordinatesToPixelLocation = function (e) {
    var n = 199 - e.y,
      r =
        (t.mapParent.getBoundingClientRect().left +
          (e.x * t.plotSpacing + t.rootContainer.position.x)) *
        this.zoom,
      i = (n * t.plotSpacing + t.rootContainer.position.y) * this.zoom
    return new s.vec2(r, i)
  }),
  (t.prototype.getImageForPlot = function (t, e) {
    var n = t["images/mapTile_plotBlank.png"].texture
    return e == h.PlotType.Plot
      ? n
      : e == h.PlotType.Settlement
      ? t["images/mapTile_plotSettlement.png"].texture
      : e == h.PlotType.Town
      ? t["images/mapTile_plotTown.png"].texture
      : e == h.PlotType.City
      ? t["images/mapTile_plotCity.png"].texture
      : e == h.PlotType.Capital
      ? t["images/mapTile_plotCapital.png"].texture
      : (console.warn("Couldn't find image for plot type " + e), n)
  }),
  (t.prototype.getNameForPlot = function (t) {
    switch (t) {
      case h.PlotType.Plot:
        return "Regular Plot"
      case h.PlotType.Settlement:
        return "Settlement"
      case h.PlotType.Town:
        return "Town"
      case h.PlotType.City:
        return "City"
      case h.PlotType.Capital:
        return "Capital"
      default:
        return "Undefined"
    }
  }),
  (t.prototype.getPlotTypeForName = function (t) {
    switch (t) {
      case "Regular Plot":
        return h.PlotType.Plot
      case "Settlement":
        return h.PlotType.Settlement
      case "Town":
        return h.PlotType.Town
      case "City":
        return h.PlotType.City
      case "Capital":
        return h.PlotType.Capital
      default:
        return h.PlotType.Plot
    }
  }),
  (t.prototype.getNameForPlotImage = function (t) {
    switch (t) {
      case h.PlotType.Plot:
        return "plot"
      case h.PlotType.Settlement:
        return "settlement"
      case h.PlotType.Town:
        return "town"
      case h.PlotType.City:
        return "city"
      case h.PlotType.Capital:
        return "capital"
      default:
        return "Undefined"
    }
  }),
  (t.plotSpacing = 32),
  (t.hoverTooltip = !1),
  t
)
