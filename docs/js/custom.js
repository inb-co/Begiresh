function twlv(t) {
  if (t > 12) t = t - 12;
  return t
}

function updateTime() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes()

  document.getElementById('mobileTime').innerHTML = twlv(hour) + ':' + minute;
}

docReady(function() {
  updateTime();
  setInterval(function(){ updateTime() }, 10000);

});
