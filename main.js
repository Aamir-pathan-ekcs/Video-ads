const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
// global.document = ready;
var $ = jQuery = require('jquery')(window);

ffmpeg.setFfmpegPath(ffmpegStatic);
const videoFilePath = 'input/video.mp4';
const jsonFilePath = 'textOverlays.json';

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  $(document).ready(function () {
    var OPEN_WEATHER_MAP_API_KEY = 'af3c961904c183693e66ef3a9159f37d';
    var OPEN_WEATHER_MAP_API = 'https://api.openweathermap.org/data/2.5/weather';
    var Ip = 'https://api.ipregistry.co/?key=mbwyly5nacbley45';
    $.getJSON(Ip, function (data) {
      var lat = data.location.latitude;
      var long = data.location.longitude;
      var default_unit = 'imperial'; // 'metric' for Celsius, 'imperial' for Fahrenheit here
  
      var OPEN_WEATHER_MAP_URL = OPEN_WEATHER_MAP_API + '?lat=' + lat + '&lon=' + long + '&units=' + default_unit + '&appid=' + OPEN_WEATHER_MAP_API_KEY;
  
      $.getJSON(OPEN_WEATHER_MAP_URL, function (data) {
        var temperature = data.main.temp;
        var sky = data.weather[0].description;
        var windSpeed  = data.wind.speed;
        var humidity = data.main.humidity;
        let commands = ffmpeg(videoFilePath);
        commands.videoFilters({
          filter: 'drawtext',
          options: {
            text:  "Weather - " + data.name,
            // enable: "Weather - " + data.name ,
            enable: "between(t,2,20)" ,
            x: 125,
            y: 233,
            fontsize: 35,
            fontcolor: '#000000',
          }
        }); 
        commands.videoFilters({
          filter: 'drawtext',
          options: {
            text:  "Temp - " + temperature + "° F",
            enable: "between(t,2,20)" ,
            x: 125,
            y: 344,
            fontsize: 35,
            fontcolor: '#000000',
          }
        }); 
        commands.videoFilters({
          filter: 'drawtext',
          options: {
            text:  "Sky - " + sky,
            // enable: "between(t,2,20)" ,
            enable: "between(t,2,20)" ,
            x: 425,
            y: 344,
            fontsize: 35,
            fontcolor: '#000000',
          }
        }); 
        commands.videoFilters({
          filter: 'drawtext',
          options: {
            text:  "Humidity - " + humidity,
            enable: "between(t,2,20)" ,
            // enable: "between(t,2,20)" ,
            x: 125,
            y: 455,
            fontsize: 35,
            fontcolor: '#000000',
          }
        }); 
        commands.videoFilters({
          filter: 'drawtext',
          options: {
            text:  "Wind - " + windSpeed + "mph",
            enable: "between(t,2,20)" ,
            x: 125,
            y: 570,
            fontsize: 35,
            fontcolor: '#000000',
          }
        }); 
        commands.save('output/video.mp4').on('end', () => {
          console.log('Video has been done succesfully.');
        }).on('error', (err) => {
          console.error('Error creating video:', err);
        });
         var d = new Date();
        var minutes = d.getMinutes();
        var formattedMinutes = (minutes < 10) ? "0" + minutes : minutes;
  
        var hours = d.getHours();
        var formattedHours = (hours % 12 || 12); // Convert to 12-hour format
        var ampm = hours >= 12 ? 'PM' : 'AM';
  
        $('#currentTime').text(" at " + formattedHours + ":" + formattedMinutes + " " + ampm);
      
      });
    });
  });
  const dataGet = JSON.parse(data);
  let command = ffmpeg(videoFilePath);
  dataGet.overlay.forEach(overlay => {
    overlay.scenes.forEach(scene => {
      scene.elements.forEach(element => {
        if (element.props) {
            const x = element.props.x;
            const y = element.props.y;
          // console.log('X coordinate:',);
          // console.log('Y coordinate:',);
        command.videoFilters({
          filter: 'drawtext',
          options: {
            text: data.name,
            enable: "between(t,2,20)" ,
            x: x,
            y: y,
            fontsize: 35,
            fontcolor: '#000000',
          }
        }); 
      }
      });
    });
  });
  // ffmpeg('/video.mp4').output('big.avi')
  // .audioCodec('copy')
  // .size('640x480')
  // .on('error', function(err) {
  //   console.log('An error occurred: ' + err.message);
  // })
  // .on('end', function() {
  //   console.log('Processing finished !');
  // })
  // .run();


  // commands.save('output/video.mp4').on('end', () => {
  //     console.log('Video has been done succesfully.');
  //   }).on('error', (err) => {
  //     console.error('Error creating video:', err);
  //   });
});