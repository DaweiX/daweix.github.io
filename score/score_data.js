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

    constructor(name, tune, genre, level, type, filename) {
      this.name = name;
      this.tune = tune;
      this.genre = genre;
      this.level = level;
      this.type = type;
      this.filename = filename;
    }
  }

  class DataHandler {
    constructor() {
      this._selections = new Map();
      // 初始化：所有类别都选中
      for (let type of Sheet.props) {
        this._selections.set(type, new Set(Object.keys(varMap.get(type))));
      }

      this._allSheets = [
        new Sheet("BWV 1004", "DD", "C", "h", "pdf", "BWV 1004"),
        new Sheet("BWV 1006", "SD", "C", "h", "pdf", "BWV 1006"),
        new Sheet("BWV 846", "SD", "C", "e", "pdf", "BWV 846"),
        new Sheet("Canon In D", "DD", "C", "e", "pdf", "Canon In D"),
        new Sheet("Nocturne In E", "SD", "C", "m", "pdf", "Nocturne In E"),
        new Sheet("BWV 1007", "DD", "C", "e", "pdf", "BWV 1007"),
        new Sheet("雨降る窓辺で", "OD", "F", "e", "pdf", "雨降る窓辺で"),
        new Sheet("Adieu", "SD", "F", "e", "pdf", "Adieu"),
        new Sheet("Misty Eyes", "SD", "F", "e", "pdf", "Misty Eyes"),
        new Sheet("暁の車", "SD", "A", "e", "pdf", "暁の車"),
        new Sheet("La Catedral", "SD", "C", "h", "pdf", "La Catedral"),
        new Sheet("洋娃娃的梦", "SD", "C", "m", "pdf", "洋娃娃的梦"),
        new Sheet("estudio de concierto", "SD", "C", "h", "pdf", "estudio de concierto"),
        new Sheet("estudio de concierto No.2", "SD", "C", "h", "pdf", "estudio de concierto No.2"),
        new Sheet("Memories of the Eternal Oasis", "SD", "A", "m", "pdf", "Memories of the Eternal Oasis"),
        new Sheet("Grande Ouverture", "SD", "C", "h", "pdf", "Grande Ouverture"),
        new Sheet("Asturias", "SD", "C", "h", "pdf", "Asturias"),
        new Sheet("Granada", "SD", "C", "h", "pdf", "Granada"),
        new Sheet("HWV 432", "SD", "C", "h", "pdf", "HWV 432"),
        new Sheet("Lobos Prelude No.1", "SD", "C", "m", "pdf", "Lobos Prelude No.1"),
        new Sheet("鲸", "OD", "F", "e", "pdf", "鲸"),
        new Sheet("恋人たちの神話", "SD", "F", "e", "pdf", "恋人たちの神話"),
        new Sheet("木もれ阳", "SD", "F", "e", "pdf", "木もれ阳"),
        new Sheet("流行の云", "OC", "F", "e", "pdf", "流行の云"),
        new Sheet("BWV 999", "SD", "C", "e", "pdf", "BWV 999"),
        new Sheet("BWV 788", "SD", "C", "m", "pdf", "BWV 788"),
        new Sheet("阿拉伯风格绮想曲", "DD", "C", "m", "xml", "阿拉伯风格绮想曲.gp"),
        new Sheet("美しきもの", "SD", "A", "m", "xml", "美しきもの.gp"),
        new Sheet("雪の華", "SD", "A", "e", "xml", "雪の華.gp"),
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

    isAllSelected(type) {
      return this._selections.get(type).size === Object.keys(varMap.get(type)).length;
    }

    toggleSelectAll(type) {
      const allKeys = Object.keys(varMap.get(type));
      if (this.isAllSelected(type)) {
        this._selections.set(type, new Set());
      } else {
        this._selections.set(type, new Set(allKeys));
      }
    }

    toggleCategory(type, key) {
      const selected = this._selections.get(type);
      if (selected.has(key)) {
        selected.delete(key);
      } else {
        selected.add(key);
      }
    }

    isSelected(type, key) {
      return this._selections.get(type).has(key);
    }

    runFilter() {
      var results = this._allSheets;
      for (let type of Sheet.props) {
        const selected = this._selections.get(type);
        if (selected.size < Object.keys(varMap.get(type)).length) {
          results = results.filter(s => selected.has(s[type]));
        }
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
  const buttonRefs = new Map(); // type -> {selectAll: element, categories: Map(key->element)}

  function updateDisplay() {
    const filtered = window.dh.runFilter();
    for (let s of window.dh.allSheets) {
      var e = document.getElementById(s.name.hashCode());
      if (e) e.style.display = "none";
    }
    for (let s of filtered) {
      var e = document.getElementById(s.name.hashCode());
      if (e) e.style.display = "inline";
    }
  }

  function updateButtonStyles(type) {
    const refs = buttonRefs.get(type);
    if (!refs) return;

    // 更新全选按钮样式
    const isAll = window.dh.isAllSelected(type);
    refs.selectAll.style.boxShadow = isAll ? "#32CD32 1px 1px" : "black 1px 1px";

    // 更新类别按钮样式
    for (let [key, btn] of refs.categories) {
      btn.style.boxShadow = window.dh.isSelected(type, key) ? "#32CD32 1px 1px" : "black 1px 1px";
    }
  }

  function init() {
    var selection = document.getElementById("selection");
    for (let p of Sheet.props) {
      var d = document.createElement("div");
      d.style.marginBottom = "8px";
      var s = document.createElement("span");
      s.innerHTML = "<b>" + p.charAt(0).toUpperCase() + p.slice(1) + ":</b>";
      s.style.display = "inline-block";
      s.style.width = "4em";
      d.id = p;
      d.appendChild(s);
      selection.appendChild(d);

      buttonRefs.set(p, {selectAll: null, categories: new Map()});

      regSelectAllButton(p, d);

      var tmp = varMap.get(p);
      for (let t of Object.keys(tmp)) {
        regButton(tmp[t], p, t, d);
      }
    }
    addAllSheets();
  }

  function regSelectAllButton(type, parent) {
    var a = document.createElement("a");
    a.onclick = () => {
      window.dh.toggleSelectAll(type);
      updateButtonStyles(type);
      updateDisplay();
    };
    var span = document.createElement("span");
    span.innerText = "All";
    span.className = type + "-all";
    a.className = "sa";
    a.style.boxShadow = "#32CD32 1px 1px";
    a.appendChild(span);
    parent.appendChild(a);
    buttonRefs.get(type).selectAll = a;
  }

  function regButton(text, type, key, parent) {
    var a = document.createElement("a");
    a.onclick = () => {
      window.dh.toggleCategory(type, key);
      updateButtonStyles(type);
      updateDisplay();
    };
    var span = document.createElement("span");
    span.innerText = text;
    span.className = type;
    a.className = "sa";
    a.style.boxShadow = "#32CD32 1px 1px";
    a.appendChild(span);
    parent.appendChild(a);
    buttonRefs.get(type).categories.set(key, a);
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
        var url = f.type === "pdf" ? "viewer?n=" : "osmd?n=";
        window.open(url + encodeURIComponent(f.filename), "_blank");
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
