function twlv(t) {
  if (t > 12) t = t - 12;
  return t
}

function dbl(t) {
  if ( t < 10 ) t = '0' + t;
  return t
}

function updateTime() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes()

  document.getElementById('mobileTime').innerHTML = twlv(hour) + ':' + dbl(minute);
}

docReady(function() {
  updateTime();
  setInterval(function(){ updateTime() }, 10000);

});

function fars(value) {
  const english_digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const parsi_digits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  value = value.replace('v.', '');

  for(let i = 0; i < value.length; i++){
    if( english_digits.indexOf(value[i]) >= 0 ){
      value = value.split(value[i]).join(parsi_digits[english_digits.indexOf(value[i])]);
    }
  }

  return value;
}

axios.get('https://api.github.com/repos/inb-co/begiresh/releases/latest')
  .then(function(response){

    const button = document.getElementById('download_button');

    button.getElementsByTagName('small')[0].innerHTML = '(ن.' + fars(response.data.tag_name) + ')';
    button.href = response.data.zipball_url;
    button.title = 'دانلود نسخه‌ی ' + fars(response.data.tag_name) + ' بگیرش از گیتهاب';

  });
