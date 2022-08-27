const { Client, GatewayIntentBits } = require('discord.js')
const { STATUS, YT_LINK, CHANNEL_ID } = require("./config.json");

const keepAlive = require("./keep_alive");
const ytdl = require("ytdl-core");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");

const client = new Client({ 
  intents: [ 
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates 
  ]
})

client.login(process.env.TOKEN); //ADD TOKEN IN REPLIT IN SECRETS TAB = KEY: TOKEN, VALUE: YOUR BOT TOKEN FIND IT AT https://discord.com/developers/applications IN THE BOT TAB, THEN RESET TOKEN FOR IT TO APPEAR
const Channels = [CHANNEL_ID];
client.on("ready", async() => {
  
  for(const channelId of Channels){
    joinChannel(channelId);
    await new Promise(res => setTimeout(()=>res(2),500))
  
}
  
  function joinChannel(channelId){
    client.channels.fetch(channelId).then(channel => {
     const VoiceConnection = joinVoiceChannel({
       channelId: channel.id,
       guildId: channel.guild.id,
       adapterCreator: channel.guild.voiceAdapterCreator
       
    });
      
client.user.setActivity((STATUS),{ type: 'LISTENING'
});
      
    const resource = createAudioResource(ytdl(YT_LINK),{
      inlineVolume:true,
      bitrate: 128000
    });
      
    resource.volume.setVolume(0.2); //REMOVE THIS CODE IF YOU WANT TO LEAVE THE BOT WITH THE HIGHEST VOLUME ALWAYS
    const player = createAudioPlayer()
    VoiceConnection.subscribe(player);
    player.play(resource);
    player.on("idle",() => {
     try{
       player.stop()
     }catch(e) {}
     joinChannel(channel.id)
    })
   }).catch(console.error)
  }
  keepAlive()
})

//THE FOLLOWING CODE IS FOR DISABLED AUDIO RECEPTION BY THE BOT AND AVOID LAGS
client.on("voiceStateUpdate", (oldState, newState) => {
  if(newState.channelId && newState.channel.type === "GUILD_STAGE_VOICE" && newState.guild.me.voice.supress) {
    try{
        newState.guild.me.voice.setSuppressed(false)
    }catch (e) {
     }
   }
})
//TO KEEP THE BOT ALWAYS ON, USE THE UPTIME ROBOT WEBSITE IF YOU USE THE REPLIT OR HOST ON A SERVER OF YOUR CHOICE