const Discord = require('discord.js');
const client = new Discord.Client();
import * as path from 'path';
import * as wavConverter from 'wav-converter';
var onCooldown = false;
import * as fs from 'fs';
import { Readable } from 'stream';
const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);
const {prefix,token,text_channel}= require("./config.json");
const tf = require('@tensorflow/tfjs-node')
const nsfw = require('nsfwjs')
const axios = require('axios') 
const WaveFile = require('wavefile').WaveFile;
class Silence extends Readable {
  _read() {
    this.push(SILENCE_FRAME);
    this.destroy();
  }
}


client.on('ready', () => {
    console.log('Js bot is Ready!');
});

client.on('message', async message => {

    if(message.author.bot &&message.channel.id == text_channel ){
      if(message.content.includes("Saved response at ")){
       let bot_response_path = message.content.replace("Saved response at ","");
       console.log(bot_response_path)
       var voiceChannel = message.member.voice.channel;
       voiceChannel.join().then(connection =>{
        const dispatcher = connection.play(bot_response_path);
        dispatcher.on("finish", finish => {
          
          console.log("ended playing response")
          fs.unlink(bot_response_path, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            message.channel.send('Response audio deleted!');
        });
        });
       }).catch(err => console.log(err));

      }
    }
    async function wav_complete(wav_filepath:string){
      let wav = new WaveFile(fs.readFileSync(wav_filepath));
      wav.toSampleRate(16000, {method: "sinc"});
      wav.toBitDepth("16")
      fs.writeFileSync(wav_filepath, wav.toBuffer());
      await message.channel.send(`Saved wav recording at ${wav_filepath}`)
    }
    if (message.content === `${prefix}speak` && message.member.voice.channel) {
    const connection = await message.member.voice.channel.join();
    connection.on('speaking', async (user: any, speaking: any) => {
      if (onCooldown) {
        return
      }
      else {
        if (speaking) {
          onCooldown = true;
          setTimeout(function () {
            onCooldown = false;
          }, 8000);
          await message.channel.send(`"<@" + user + "> You can start speaking"`);
          const voicechannel = message.member.voice.channel;
          if (!voicechannel) {
            await message.channel.send("Please join a voice channel first!"); return;
          }

          const audioStream = connection.receiver.createStream(message.member, {
            mode: "pcm",
            end: "silence"
          });
          let filepath = `./components/recordings/${message.author.id}.pcm`
          const writer = audioStream.pipe(fs.createWriteStream(filepath));
          writer.on("finish", async () => {
            async function makewav() {
              var pcmData = fs.readFileSync(path.resolve(__dirname, filepath));
              var wavData = wavConverter.encodeWav(pcmData, {
                numChannels: 2,
                sampleRate: 48000,
                byteRate: 2
              })
              let wav_filepath:string = `./components/speaking_audio/${message.author.id}.wav`;
              fs.writeFileSync(path.resolve(__dirname, wav_filepath), wavData);
              await wav_complete(wav_filepath);
            };
            await makewav()
            
          });
          connection.play(new Silence(), { type: 'opus' });

        }

      }

    });

  }






});

client.login(token); 













