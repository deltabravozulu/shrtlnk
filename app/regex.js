var regex_list = [];
// We need a separate one for PageStateMatcher filtering because it doesn't
// support fragment identifiers (params after '#')
var filter_regex_list = [];
var short_list = [];
var filter_function_list = [];

function add(short, regex) {
  regex_list.push(regex);
  filter_regex_list.push(regex);
  short_list.push(short);
  filter_function_list.push(null);
}

function add_with_separate_filter_regex(short, regex, filter_regex) {
  regex_list.push(regex);
  filter_regex_list.push(filter_regex);
  short_list.push(short);
  filter_function_list.push(null);
}

function add_with_regex_function(short, regex, regex_function) {
  regex_list.push(regex);
  filter_regex_list.push(regex);
  short_list.push(short);
  filter_function_list.push(regex_function);
}

// amazon: https://amzn.com/B01A6G35IQ
add('https://amzn.com/$1',
    /^https?:\/\/(?:(?:www\.)|(?:smile\.))?amazon\.[\w\.]+\/[\w\/-]*(B\w{9}).*$/);

// http://www.theonion.com/r/53187
add('http://www.theonion.com/r/$1',
    /^https?:\/\/(?:www\.)?theonion\.com\/.*?(\d+)$/);

// YouTube with video id then time
// https://www.youtube.com/watch?v=1cX4t5-YpHQ&t=1m9s
// NOTE: This needs to be added before the non-time based one below
//            otherwise that one will match first.
add('https://youtu.be/$1?t=$2',
    /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v\=([^\&\n]+).*?&t\=(\w+).*$/);

// Simple YouTube with no time
// https://youtu.be/1cX4t5-YpHQ
add('https://youtu.be/$1',
    /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v\=([^\&]+).*$/);

// YouTube with time then video id later
// https://www.youtube.com/watch?t=1m9s&v=1cX4t5-YpHQ
add('https://youtu.be/$2?t=$1',
    /^https?:\/\/(?:www\.)?youtube\.com\/watch\?t\=(\w+).*?v\=([^\&]+).*$/);

// YouTube with non-time arguments before v=
// https://www.youtube.com/watch?foo=bar&v=1cX4t5-YpHQ
// NOTE: This needs to be last after normal and times
add('https://youtu.be/$1',
    /^https?:\/\/(?:www\.)?youtube\.com\/watch\?.*v\=([^\&]+).*$/);

// StackOverflow (answer)
// http://stackoverflow.com/a/5718765
// NOTE: (answer) needs to be added before (question) otherwise that one will
//       match first.
// NOTE: Ignores the final tag which is the user (who is logged in) tag
//       that is used by SO, but we don't care about
add('http://stackoverflow.com/a/$1',
    /^https?:\/\/(?:www\.)?stackoverflow\.com\/.*?(?:\d+)\/.*?(?:\d+)\#(\d+).*$/);

// StackOverflow (question)
// http://stackoverflow.com/q/5718624
add('http://stackoverflow.com/q/$1',
    /^https?:\/\/(?:www\.)?stackoverflow\.com\/.*?(\d+).*$/);

// StackExchange (answer)
// http://stackoverflow.com/a/164197
// NOTE: (answer) needs to be added before (question) otherwise that one will
//       match first.
// NOTE: Ignores the final tag which is the user (who is logged in) tag
//       that is used by SO, but we don't care about
add('http://$1.com/a/$2',
    /^https?:\/\/(?:www\.)?(.*?stackexchange)\.com\/.*?(?:\d+)\/.*?(?:\d+)\#(\d+).*$/);

// StackOverflow (question)
// http://stackoverflow.com/q/164194
add('http://$1.com/q/$2',
    /^https?:\/\/(?:www\.)?(.*?stackexchange)\.com\/.*?(\d+).*$/);

// Google Web Search with type
// https://google.com/search?q=bettersettlers&tbm=isch
// NOTE: Search type (eg image, news, video, etc) need to come first, otherwise
//       generic would match first
add_with_separate_filter_regex('https://www.google.com/#q=$1&tbm=$2',
    /^https?:\/\/(?:www\.)?google\.com\/(?:(?:search)|(?:webhp))?.*q\=([^&]+).*\&tbm\=([^&]+).*$/,
    /^https?:\/\/(?:www\.)?google\.com\/(?:(?:search)|(?:webhp))?.*/);

// Google Web Search with type first
// https://google.com/search?q=bettersettlers&tbm=isch
// NOTE: Search type (eg image, news, video, etc) need to come first, otherwise
//       generic would match first
add_with_separate_filter_regex('https://www.google.com/#q=$2&tbm=$1',
    /^https?:\/\/(?:www\.)?google\.com\/(?:(?:search)|(?:webhp))?.*tbm\=([^&]+).*\&q\=([^&]+).*$/,
    /^https?:\/\/(?:www\.)?google\.com\/(?:(?:search)|(?:webhp))?.*/);

// Google Web Search query only
// https://google.com/#q=bettersettlers
add_with_separate_filter_regex('https://www.google.com/#q=$1',
    /^https?:\/\/(?:www\.)?google\.com\/(?:(?:search)|(?:webhp))?.*q\=([^&]+).*$/,
    /^https?:\/\/(?:www\.)?google\.com\/(?:(?:search)|(?:webhp))?.*/);

// shrtlnk
// http://bit.ly/shrt_lnk
add('http://bit.ly/shrt_lnk',
    /^https?:\/\/(?:www\.)?chrome\.google\.com\/webstore\/detail\/shrtlnk\/nccahogoimgbhghcjmghidnnngigcagi.*$/);

// Instagram
// http://instagr.am/
add('http://instagr.am/$1',
    /^https?:\/\/(?:www\.)?instagram\.com\/([^\?]+).*$/);

// Reddit
// https://redd.it/
add('https://redd.it/$1',
    /^https?:\/\/(?:www\.)?reddit\.com\/r\/\w+\/comments\/(\w+)\/.*$/);


// Craigslist
// https://*.craigslist.org
////https://losangeles.craigslist.org/
add('https://la.craigslist.org/$1$2$3$6$7',
    /^https?:\/\/losangeles\.craigslist\.org\/(search\/)?(\w+\/)(\w+\/?)(d\/(\w|-)+\/)?(\d+)?(\.html)?.*$/);
//add('https://la.craigslist.org/$1/$2/$5.html',
//    /^https?:\/\/losangeles\.craigslist\.org\/(\w+)\/(\w+)\/(d\/(\w|-)+\/)?(\d+).html#?.*$/);
// lol these are the same somehow:
//    https://losangeles.craigslist.org/d/for-sale/search/wst/sss/wst/sss/wst/sss
//    https://losangeles.craigslist.org/d/for-sale/search/wst/sss
//    https://losangeles.craigslist.org/search/wst/sss
    


// Flickr
// https://flic.kr/p/[id]
function flickr_function(num) {
  if (typeof num !== 'number') {
    num = parseInt(num);
  }
  var enc = '';
  var alpha = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
  var div = num;
  while (num >= 58) {
    div = num / 58;
    var mod = (num - (58 * Math.floor(div)));
    enc = '' + alpha.substr(mod, 1) + enc;
    num = Math.floor(div);
  }
  return (div) ? '' + alpha.substr(div, 1) + enc : enc;
}

add_with_regex_function('https://flic.kr/p/$1',
    /^https?:\/\/[^/]*\bflickr\.com\/(?:photos\/[^/]+\/(\d+)).*$/,
    flickr_function);

function shrtn(str) {
  for (var i = 0; i < regex_list.length; i++) {
    var regex = regex_list[i];
    var short = short_list[i];
    var filter = filter_function_list[i];
    if (regex.test(str)) {
      // See if we have a filter function to run first
      if (filter != null) {
        var match = str.match(regex)[1];
        var filtered = filter(match);
        return short.replace("$1", filtered);
      }
      return str.replace(regex, short);
    }
  }

  // Default return the full URL
  return str;
}

var custom_regex_list = [];
var custom_short_list = [];

// Custom custom ones
custom_regex_list.push(/^https?:\/\/(?:www\.)?nytimes\.com.*$/);
custom_short_list.push('nytimes.js');
custom_regex_list.push(/^https?:\/\/(?:www\.)?giphy\.com.*$/);
custom_short_list.push('giphy.js');
custom_regex_list.push(/^https?:\/\/(?:www\.)cnn\.com.*$/);
custom_short_list.push('cnn.js');
custom_regex_list.push(/^https?:\/\/(?:www\.)zillow\.com.*$/);
custom_short_list.push('zillow.js');

// Standard custom ones using <link rel='shortlink' href='<url>' />
custom_regex_list.push(/^https?:\/\/(?:\w)*?\.?fivethirtyeight\.com.*$/);
custom_short_list.push('shortlink.js');
custom_regex_list.push(/^https?:\/\/(?:\w)*?\.?newyorker\.com.*$/);
custom_short_list.push('shortlink.js');
custom_regex_list.push(/^https?:\/\/(?:\w)*?\.?fortune\.com.*$/);
custom_short_list.push('shortlink.js');
custom_regex_list.push(/^https?:\/\/(?:\w)*?\.?time\.com.*$/);
custom_short_list.push('shortlink.js');
