/* Blue Path: turn photos into a PDF in the browser. bpImgPdf([{blob, label}], title) -> Promise<base64 PDF or ''> */
(function(){
  function load(blob){ return new Promise(function(res){ var u=URL.createObjectURL(blob), i=new Image(); i.onload=function(){ var c=document.createElement('canvas'); c.width=i.naturalWidth; c.height=i.naturalHeight; c.getContext('2d').drawImage(i,0,0); URL.revokeObjectURL(u); res({url:c.toDataURL('image/jpeg',0.85), w:c.width, h:c.height}); }; i.onerror=function(){ res(null); }; i.src=u; }); }
  window.bpImgPdf = function(items, title){
    if(!window.jspdf || !window.jspdf.jsPDF) return Promise.resolve('');
    return Promise.all(items.map(function(it){ return load(it.blob); })).then(function(imgs){
      if(imgs.some(function(x){ return !x; })) return '';
      var d=new window.jspdf.jsPDF({unit:'pt',format:'letter'}), L=54, W=504, top=60, y=top;
      d.setFont('helvetica','bold'); d.setFontSize(14); d.setTextColor(22,50,92); d.text(title||'Blue Path ABA', L, y); y+=22;
      imgs.forEach(function(im, n){
        var maxH = items.length>1 ? 300 : 640, k=Math.min(W/im.w, maxH/im.h), w=im.w*k, h=im.h*k;
        if(y+h+24>760){ d.addPage(); y=top; }
        if(items[n].label){ d.setFont('helvetica','bold'); d.setFontSize(11); d.setTextColor(28,123,227); d.text(items[n].label, L, y); y+=12; }
        d.addImage(im.url,'JPEG',L,y,w,h); y+=h+22;
      });
      return String(d.output('datauristring')).split(',')[1]||'';
    }).catch(function(){ return ''; });
  };
})();
