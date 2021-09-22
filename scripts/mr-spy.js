Hooks.on('updateActor', async (actor, data, options, userId) => {
  if(options.diff == true) {
    var users = Array.from(game.collections.get("User").entries());

    var name = actor.data.name;

    var result = checkAbilities(data.data.abilities);
    var name = actor.data.name;
    var userName = "";
    users.forEach(function(user) {
      if(user[0] === userId) {
        userName = user[1].data.name;
      }
    });
    var content = "Character " + name + " has been updated! " + result + " by " + userName;
    var whisper = game.users.entities.filter(u => u.isGm).map(u => u.id);
    var speaker = {"alias": "Speaker"};
    sendMessage(content, actor);
  }
})

Hook.on('renderChatMessage', (app, html, data) => {
debugger;
});

function checkAbilities(data) {
  var cha = data.cha;
  var con = data.con;
  var dex = data.dex;
  var int = data.int;
  var str = data.str;
  var wis = data.wis;
  var result = "";
  if( (typeof cha !== 'undefined') && (typeof cha.total !== 'undefined')) {
    result+= "Charisma changed from " + cha.tempvalue[1] + " to " + cha.tempvalue[0];
  }
  if( (typeof con !== 'undefined') && (typeof con.total !== 'undefined')) {
    result+= "Constitution changed from " + con.tempvalue[1] + " to " + con.tempvalue[0];
  }
  if( (typeof dex !== 'undefined') && (typeof dex.total !== 'undefined')) {
    result+= "Dexterety changed from " + dex.tempvalue[1] + " to " + dex.tempvalue[0];
  }
  if( (typeof int !== 'undefined') && (typeof int.total !== 'undefined')) {
    result+= "Intelligence changed from " + int.tempvalue[1] + " to " + int.tempvalue[0];
  }
  if( (typeof str !== 'undefined') && (typeof str.total !== 'undefined')) {
    result+= "Strenght changed from " + str.tempvalue[1] + " to " + str.tempvalue[0];
  }
  if( (typeof wis !== 'undefined') && (typeof wis.total !== 'undefined')) {
    result+= "Wisdom changed from " + wis.tempvalue[1] + " to " + wis.tempvalue[0];
  }
  return result;
}

function sendMessage(contentOut) {
  ChatMessage.create({
    content: contentOut,
    whisper: game.users.contents.filter(u => u.isGM).map(u => u.id),
    speaker: {"alias" : "Mr. Spy"},
    blind : true,
  }).then()
}