(function () {
  var status = document.getElementById('status');
  var message = document.getElementById('message');

  function setStatus(text, state) {
    status.textContent = '';
    var dot = document.createElement('span');
    dot.className = 'status-dot status-dot--' + state;
    dot.setAttribute('aria-hidden', 'true');
    status.appendChild(dot);
    status.appendChild(document.createTextNode(text));
  }

  if (!navigator.gpu) {
    setStatus('WebGPU unavailable', 'error');
    message.textContent = 'Open this demo in a current browser with WebGPU enabled.';
    return;
  }

  setStatus('Loading viewer…', 'loading');
  var script = document.createElement('script');
  script.src = 'bundle-b9a59e8149b7.js';
  script.onload = function () {
    setStatus('Viewer ready', 'ready');
    message.remove();
  };
  script.onerror = function () {
    setStatus('Viewer failed to load', 'error');
    message.textContent = 'The viewer could not be loaded. Check the browser console for details.';
  };
  document.body.appendChild(script);
}());
