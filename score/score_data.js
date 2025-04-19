document.addEventListener('DOMContentLoaded', function () {
  const tunes = {
    "DD": "Drop D (DADGBE)",
    "SD": "Standard (EADGBE)",
    "OD": "Open D (DADF#AD)",
    "OC": "Open C (CGDGAD)"
  }

  const genres = {
    "C": "Classical",
    "F": "Finger",
    "A": "ACG"
  }

  const levels = {
    "e": "Easy",
    "m": "Medium",
    "h": "Hard"
  }

  const varMap = new Map();
  varMap.set("level", levels);
  varMap.set("tune", tunes);
  varMap.set("genre", genres);

  class Sheet {
    static props = ["tune", "genre", "level"]

    constructor(name, tune, genre, level) {
      this.name = name;
      this.tune = tune;
      this.genre = genre;
      this.level = level;
    }
  }

  class DataHandler {
    constructor() {
      this._filter_ts = []
      this._filter_vs = []
      this._allSheets = [
        new Sheet("BWV 1004", "DD", "C", "h"),
        new Sheet("BWV 1006", "SD", "C", "h"),
        new Sheet("BWV 846", "SD", "C", "e"),
        new Sheet("Canon In D", "DD", "C", "e"),
        new Sheet("Nocturne In E", "SD", "C", "m"),
        new Sheet("BWV 1007", "DD", "C", "e"),
        new Sheet("雨降る窓辺で", "OD", "F", "e"),
        new Sheet("Adieu", "SD", "F", "e"),
        new Sheet("Misty Eyes", "SD", "F", "e"),
        new Sheet("暁の車", "SD", "A", "e"),
        new Sheet("La Catedral", "SD", "C", "h"),
        new Sheet("洋娃娃的梦", "SD", "C", "m"),
        new Sheet("estudio de concierto", "SD", "C", "h"),
        new Sheet("estudio de concierto No.2", "SD", "C", "h"),
        new Sheet("Memories of the Eternal Oasis", "SD", "A", "m"),
        new Sheet("Grande Ouverture", "SD", "C", "h"),
        new Sheet("Asturias", "SD", "C", "h"),
        new Sheet("Granada", "SD", "C", "h"),
        new Sheet("HWV 432", "SD", "C", "h"),
        new Sheet("Lobos Prelude No.1", "SD", "C", "m"),
        new Sheet("鲸", "OD", "F", "e"),
        new Sheet("恋人たちの神話", "SD", "F", "e"),
        new Sheet("木もれ阳", "SD", "F", "e"),
        new Sheet("流行の云", "OC", "F", "e")
      ].sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    }

    get length() {
      return this._allSheets.length;
    }

    get allSheets() {
      return this._allSheets;
    }

    addFilter(type, value) {
      this._filter_ts.push(type)
      this._filter_vs.push(value)
    }

    delFilter(type, value) {
      for (let i = 0; i < this._filter_ts.length; ++i) {
        if (this._filter_ts[i] == type && this._filter_vs[i] == value) {
          this._filter_ts.splice(i, 1);
          this._filter_vs.splice(i, 1);
          break;
        }
      }
    }

    runFilter() {
      var results = this._allSheets;
      for (let i = 0; i < this._filter_ts.length; ++i) {
        results = results.filter((s) => {
          return s[this._filter_ts[i]] != this._filter_vs[i];
        });
      }
      return results;
    }
  }

  String.prototype.hashCode = function () {
    var hash = 0;
    if (this.length === 0) return hash;
    for (let i = 0; i < this.length; i++) {
      let chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  dh = new DataHandler();
  
  function init() {
    var selection = document.getElementById("selection");
    for (p of Sheet.props) {
      var d = document.createElement("div");
      var s = document.createElement("span");
      s.innerHTML = "<b>" + p.charAt(0).toUpperCase() + p.slice(1) + ":</b>";
      s.style.display = "inline-block";
      s.style.width = "4em";
      d.id = p;
      d.appendChild(s);
      selection.appendChild(d);
      var tmp = varMap.get(p);
      for (let t of Object.keys(tmp)) {
        regButton(tmp[t], p, t, d);
      }
    }
    addAllSheets();
  }

  function regButton(text, type, key, parent) {
    var a = document.createElement("a");
    a.onclick = () => {
      var playlist = document.getElementById("playlist");
      for (i of playlist.childNodes) {
        i.style.display = "none";
      }
      if (a.style.boxShadow == "black 1px 1px") {
        // del filter
        window.dh.delFilter(type, key);
        for (s of window.dh.runFilter()) {
          var e = document.getElementById(s.name.hashCode());
          e.style.display = "inline";
        }
        a.style.boxShadow = "#32CD32 1px 1px";
      } else {
        // add filter
        window.dh.addFilter(type, key);
        for (s of window.dh.runFilter()) {
          var e = document.getElementById(s.name.hashCode());
          e.style.display = "inline";
        }
        a.style.boxShadow = "black 1px 1px";
      }
    };
    var span = document.createElement("span");
    span.innerText = text;
    span.className = type;
    a.className = "sa";
    a.appendChild(span);
    parent.appendChild(a);
  }

  function addAllSheets() {
    var playlist = document.getElementById("playlist");
    window.dh.allSheets.forEach((f) => {
      var a = document.createElement("a");
      a.id = f.name.hashCode();
      var span = document.createElement("span")
      var name = f.name;
      a.style.margin = "0 4px"
      a.style.textDecoration = "none"
      a.onclick = () => {
        window.open("viewer?n=" + encodeURIComponent(name), "_blank");
      };
      a.onmouseenter = () => {
        a.style.backgroundColor = "var(--menu-item-bg-color)";
      };
      a.onmouseleave = () => {
        a.style.backgroundColor = "";
      };
      span.innerText = name;
      a.appendChild(span);
      playlist.appendChild(a);
    });
  }

  window.onload = () => {
    init();
  };
});
