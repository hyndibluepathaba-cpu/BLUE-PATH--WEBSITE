/* Blue Path: builds a standards-correct email body (CRLF lines, base64 wrapped at 76)
   so every mail app, including iPhone Mail, can open it. Make adds the headers. */
(function(){
  var B = 'BP_MIX_9d2f6a';
  function wrap(s){ return String(s || '').replace(/\s+/g, '').replace(/.{1,76}/g, '$&\r\n'); }
  function utf8b64(t){ return btoa(unescape(encodeURIComponent(String(t || '')))); }
  function clean(n){ return String(n || 'file').replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '').slice(0, 120); }
  window.bpMime = function(html, files){
    var o = '--' + B + '\r\nContent-Type: text/html; charset="UTF-8"\r\nContent-Transfer-Encoding: base64\r\n\r\n' + wrap(utf8b64(html));
    (files || []).forEach(function(f){
      if(!f || !f.b64) return;
      var n = clean(f.name), t = /^[\w.+-]+\/[\w.+-]+$/.test(f.type || '') ? f.type : 'application/octet-stream';
      o += '--' + B + '\r\nContent-Type: ' + t + '; name="' + n + '"\r\nContent-Disposition: attachment; filename="' + n + '"\r\nContent-Transfer-Encoding: base64\r\n\r\n' + wrap(f.b64);
    });
    return o + '--' + B + '--\r\n';
  };
  window.bpEsc = function(x){ return String(x == null ? '' : x).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
})();
