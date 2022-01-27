const debouncedReload = foundry.utils.debounce(() => window.location.reload(), 100);
var cDice;
Hooks.once("init", async function () {

    cDice = 600;
    game.settings.register('MrSpy', 'DC', {
      name: 'Dice',
      scope: 'world',     // "world" = sync to db, "client" = local storage
      config: true,       // false if you dont want it to show in module config
      type: Number,       // Number, Boolean, String, Object
      default: 0,
      onChange: debouncedReload
    })
})

Hooks.on('updateActor', async (actor, data, options, userId) => {
  var users = Array.from(game.collections.get("User").entries());
  var isGM = false;
  users.forEach(function(user) {
    if(user[0] === userId) {
      isGM = user[1].isGM;
    }
  });
  if(options.diff == true && (!isGM || isGMEnable)) {
    var name = actor.data.name;
    var result = "";
    result = checkAbilities(data.data.abilities);
    if(result == "") 
    {
      result = checkAttributes(data.data.attibutes);
    }
    var name = actor.data.name;
    var userName = "";
    users.forEach(function(user) {
      if(user[0] === userId) {
        userName = user[1].data.name;
      }
    });
    var content = "Character " + name + " has been updated! " + result + " by " + userName;
    sendMessage(content);
    Hooks.off('updateActor', this.onUpdateActor);
  } 
})
Hooks.once('renderChatLog', async (message, html, data) => {
  cDice= 3;
})
  Hooks.on('renderChatMessage', async (message, html, data) => {
    let messageAuthor = data.alias;
    let messageUserReader = data.user;

    var on = game.settings.get('MrSpy', 'DC');
    if(on != 0 && message.roll != null && cDice > 0) {
      if(message._roll._formula =="1d9") {
        cDice--;
        html[0].innerHTML = '<div class="dice-roll">    <div class="dice-result">        <div class="dice-formula">1d9</div>        <div class="dice-tooltip">    <section class="tooltip-part">        <div class="dice">            <header class="part-header flexrow">                <span class="part-formula">1d9</span>                                <span class="part-total">4</span>            </header>            <ol class="dice-rolls">                <li class="roll die d9">4</li>            </ol>        </div>    </section></div>        <h4 class="dice-total">4</h4>    </div></div>'
  
      }
  
  
    }
  
    if(messageAuthor == "Mr. Spy1" ) {
      ChatMessage.delete([data.message._id]);
    
      if(data.message.user == messageUserReader.id && messageUserReader.isGM ) {
    
        let whisperIDs = game.users.contents.filter(u => u.isGM).map(u => u.id);
    
        let chatData = {
          user: game.user.id,
          content: data.message.content,  
          whisper: whisperIDs,
          speaker: {"alias" : "Mr. Spy"},
          blind: true
        };
    
        await ChatMessage.create(chatData,{})
    
      }
    }
    
    })
    


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
 
function checkAttributes(data) {
  for (var property in data) {
    if((typeof data[property] !== 'undefined'))  {
      result+= "Attribute: " + property + " has changed from " + "" + " to " + wis.tempvalue[0];

    }
}}
async function sendMessage(contentOut) {

  let whisperIDs = game.users.contents.filter(u => u.isGM).map(u => u.id);

	let chatData = {
		  user: game.user.id,
      content: contentOut,  
      whisper: whisperIDs,
      speaker: {"alias" : "Mr. Spy1"},
      blind: true
  	};
  chatData = ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
	await ChatMessage.create(chatData,{});
}

var isGMEnable = false;
