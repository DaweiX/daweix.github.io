class PageViewer {
  // for web dpi
  static CSS_UNITS = 96.0 / 72.0;

  constructor(options) {
    this.id = options.id;
    this.viewport = options.viewport;
    this.container = options.container;
    this.canvas = null;
  }

  feedPage(page) {
    var c = document.createElement('canvas');
    c.id = 'c' + this.id;
    c.className = 'page';
    c.style.width = "100%";
    c.style.height = this.viewport.height;
    c.height = this.viewport.height * PageViewer.CSS_UNITS;
    c.width = this.viewport.width * PageViewer.CSS_UNITS;
    this.canvas = c;
    this.container.appendChild(c);
    var renderContext = {
      transform: [PageViewer.CSS_UNITS, 0, 0, 
        PageViewer.CSS_UNITS, 0, 0],
      canvasContext: c.getContext('2d'),
      viewport: this.viewport
    };
    var renderTask = page.render(renderContext);
    return renderTask.promise;
  }

  get width() {
    return this.viewport.width;
  }
}

class PDFViewer {
  constructor(container) {
    this.container = container;
    this._pages = [];
    this._currentScale = 1;
    this.doc = null
    this.pagesCount = -1;
    this.pagesReady = false;
  }

  get pagesNum() {
    return this._pages.length;
  }

  get currentScale() {
    return this._currentScale;
  }

  feedDoc(doc) {
    this.doc = doc;
    this.pagesCount = doc.numPages;
    var firstPagePromise = doc.getPage(1);
    return firstPagePromise.then((p) => {
      var viewport = p.getViewport({ 
        scale: this.currentScale 
      });
      for (let n = 1; n <= this.pagesCount; ++n) {
        var pageViewer = new PageViewer({
          id: n,
          viewport: viewport.clone(),
          container: this.container
        });
        this._pages.push(pageViewer);
      }
      var getPagePromises = []
      for (let n = 1; n <= this.pagesCount; n++) {
        getPagePromises.push(this.doc.getPage(n));
      }
      var renderPagePromises = []
      Promise.all(getPagePromises).then((pages) => {
        pages.forEach(p => {
          var pageViewer = this._pages[p._pageIndex];
          var pagePromise = pageViewer.feedPage(p);
          renderPagePromises.push(pagePromise);
        });
      });
      Promise.all(renderPagePromises).then(() => {
        this.pagesReady = true;
      })
    });
  }
}

window.onload = () => {
  // remove the paddings to make sheet larger
  var b1 = document.querySelector(".main-inner");
  var b2 = document.querySelector(".post-block");
  b1.style.padding = "0px";
  b2.style.padding = "0px";
  // load and show sheet pdf
  var { pdfjsLib } = globalThis;
  pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';
  var addr = decodeURIComponent(location.search);
  var f = addr.substring(addr.indexOf("n=") + 2, addr.length);
  document.title = f + " " + document.title;
  document.getElementsByClassName("post-title")[0].innerHTML = f;
  var url = "./pdf/" + f + ".pdf";
  var loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(function (pdf) {
    var div = document.getElementById("d");
    var pdfViewer = new PDFViewer(div);
    pdfViewer.feedDoc(pdf);
  }, function (err) {
    console.error(err);
  });
};