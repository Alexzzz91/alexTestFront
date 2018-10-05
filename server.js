const express = require('express');
const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');
const cors = require('cors')
const bodyParser = require('body-parser')

let app = express();

app.use(cors())

const http = require('http').Server(app);

const config = require('./config.json');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}) );

app.get('/', function (req, res) {
  console.log('req.query', req.query);
  res.send('Hello World!');
});

app.get('/chats', function (req, res) {
  fs.readFile('fakeData.json', (err, content) => {
    if (err) return console.log('load file:', err);
    content = JSON.parse(content);
    let chats = [];
    content.chats.map(item => {
      chats.push(item.name);
    })
    res.send(chats);
  });
});

app.post('/get_messages', function (req, res) {
  const { chat, offset=0, limit=40 } = req.body;
  // Load client secrets from a local file.
  fs.readFile('fakeData.json', (err, content) => {
    if (err) return console.log('load file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    content = JSON.parse(content);
    let r = _.find(content.chats, { name: chat });
    if(!r) {
      console.log('cannot find chat!');
      return res.send(404);
    }
    const messages = r.messages.slice(offset, offset+limit-1);
    res.send({messages, total: r.messages.length});
  });


});

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

async function createMessages(){
  console.log('start generate fake messages');
  const worldsText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula odio odio, eu finibus est iaculis vel. Quisque consequat molestie odio non viverra. Duis egestas arcu vel mauris aliquam faucibus id ut nibh. Cras nec nisl ut turpis feugiat dapibus. In sagittis scelerisque ullamcorper. Fusce vel elit enim. Vestibulum mollis ipsum nisi, id auctor augue mattis et. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec pellentesque felis ut elit lobortis rhoncus. Sed augue ante, iaculis sit amet tristique at, auctor eget mauris. Suspendisse venenatis nisl et risus porta lacinia. Mauris nibh urna, sollicitudin a hendrerit vitae, gravida eu quam. Donec commodo mattis tincidunt. Curabitur sit amet gravida sapien. Duis efficitur quam vel libero porttitor, quis hendrerit quam venenatis. Donec malesuada velit eu nisi ullamcorper, quis facilisis orci sodales. Quisque mollis pretium nulla at aliquet. In hac habitasse platea dictumst. Aenean varius dui purus, sit amet pellentesque ipsum posuere nec. Cras diam elit, tincidunt nec libero eget, interdum aliquet tortor. Vivamus id leo sed ligula pretium finibus varius nec metus. Duis tortor turpis, varius sit amet convallis et, molestie sed ligula. Suspendisse consectetur consectetur metus, vitae maximus mauris varius ut. Proin congue urna id malesuada egestas. In vitae ante vitae erat finibus sollicitudin id auctor tortor. Aliquam iaculis dignissim nulla eget condimentum. Ut ut urna eget risus luctus maximus. Pellentesque nunc mi, tempus sed tempus vitae, auctor tincidunt urna. Nunc ornare, lorem at porttitor tincidunt, dolor risus lobortis mi, ac congue ante nisl sed odio. Quisque eleifend sollicitudin blandit. Aenean consectetur orci velit, quis porttitor ligula fermentum in. Nullam imperdiet semper ipsum nec varius. Nulla eget ex sit amet ligula tincidunt auctor. Etiam lectus ex, sollicitudin vel bibendum et, pharetra sed purus. Suspendisse leo neque, consequat id gravida dignissim, congue vel neque. Sed vel elementum nisl. Vestibulum tempus efficitur turpis a sollicitudin. Integer vitae magna fermentum, suscipit risus sed, pretium mauris. Mauris eget nisl ullamcorper, tempor dui ac, fermentum augue. Praesent aliquam commodo blandit. Pellentesque pharetra sapien vel blandit iaculis. Pellentesque id odio a dui tempus scelerisque. Fusce vel cursus justo, et luctus dolor. In dapibus sodales turpis lobortis blandit. Sed hendrerit ut nibh vel lacinia. Mauris dapibus tortor non orci posuere, nec ultrices nisi gravida. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam ac urna aliquet, iaculis tellus ac, accumsan libero. Integer sapien ipsum, sollicitudin id lorem vitae, accumsan commodo turpis. Aliquam et bibendum turpis. Integer cursus pharetra ullamcorper. Integer dictum diam ut commodo fermentum. Pellentesque tincidunt neque non risus tempor, nec elementum mi condimentum. Vivamus a nisl iaculis, rutrum est quis, imperdiet leo.'
  let worldsArray = worldsText.split(/\s|\,|\./);
  worldsArray = worldsArray.filter(item => !!item);

  let obj = {}
  obj.chats = [];

  for (let i = 0; i < getRandomInt(4, 8); i++) {
    let el = {
      name: worldsArray[getRandomInt(1, worldsArray.length-1)],
      messages: []
    }
    let seconds = 0;
    for (let j = 0; j < getRandomInt(worldsArray.length*50, (worldsArray.length-1)*500); j++) {
      let msg = {
        id: j,
        autor: getRandomInt(0, 4) > 2 ? 'alk' : 'no alk',
        time: moment().subtract(seconds, 'seconds').unix(),
        //time: moment().add(seconds, 'seconds').unix(),
        text: ''
      };


      if(getRandomInt(0, 5) > 3) seconds = seconds+15;
      if(getRandomInt(0, 8) >= 6) seconds = seconds+10;
      seconds++;
      msg.text += worldsArray[getRandomInt(1, worldsArray.length-1)];
      for (let m = 0; m < getRandomInt(1, worldsArray.length/4); m++) {
        msg.text += ' '+worldsArray[getRandomInt(1, worldsArray.length-1)];
      }

      el.messages.push(msg);
    }
    el.messages = el.messages.reverse();
    obj.chats.push(el)
  }

  var json = JSON.stringify(obj);
  fs.writeFile('fakeData.json', json, 'utf8', (err, content) => {
    if (err) return console.log('load file:', err);
    //console.log('content', content);
  });
  fs.readFile('fakeData.json', (err, content) => {
    if (err) return console.log('load file:', err);
    //console.log('content', content);
  });
  console.log('complete generate fake messages');
};

createMessages();

const server = app.listen(config.serverPort, function () {
  console.log(`Example app listening on port ${config.serverPort}`);
});

//socket piece
const io = require('socket.io').listen(server);
io.on('connection', (client) => {
  client.on('message', (params) => {
    fs.readFile('fakeData.json', (err, content) => {
      if (err) return console.log('load file:', err);
      // Authorize a client with credentials, then call the Google Sheets API.
      content = JSON.parse(content);
      let r = _.find(content.chats, { name: params.chatName });
      if(!r) {
        console.log('cannot find chat!');
        return res.send(404);
      }
      r.messages.unshift(params.messageObj);

      var json = JSON.stringify(content);

      fs.writeFile('fakeData.json', json, 'utf8', (err, content) => {
        if (err) return console.log('load file:', err);
        //console.log('content', content);
      });
    });
    //client.emit('timer', new Date());
    client.on('disconnect', function(){
      console.log('user disconnected');
    });
  });
});
