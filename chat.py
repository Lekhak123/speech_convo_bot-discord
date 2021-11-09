import discord
import speech_recognition as sr
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from gtts import gTTS
import random
import json
f = open('config.json',)
with open('config.json') as f:
    data = json.load(f)
    token = data["token"]
    bot_channel = data["text_channel"]

mname = './models/blenderbot_small-90M'
tokenizer = AutoTokenizer.from_pretrained(mname)
model = AutoModelForSeq2SeqLM.from_pretrained(mname)
client = discord.Client()

@client.event
async def on_ready():
    print(f'{client.user} python bot has connected to Discord!')

@client.event
async def on_message(message):
    cmdChannel = client.get_channel(bot_channel)
    if (message.author == client.user)and("Saved wav recording at " in message.content) and (message.channel.id == cmdChannel.id):
        file_path = message.content.replace("Saved wav recording at ","")
        print(file_path)
        user_audio = await speech2txt(file_path)
        print(user_audio)
        response = chat(user_audio)
        response_path =  text2speech(response)
        await message.channel.send("Saved response at "+response_path)


def chat(query):
    UTTERANCE = str(query);
    inputs = tokenizer(UTTERANCE, return_tensors='pt')
    reply_ids = model.generate(**inputs)
    response = [tokenizer.decode(g, skip_special_tokens=True, clean_up_tokenization_spaces=False) for g in reply_ids]
    respoonse = response[0].replace(" . ",".")
    final_response = respoonse.replace(" ' ","'")
    print(final_response)
    return final_response



async def speech2txt(audio_path):
    sound = audio_path
    r = sr.Recognizer()
    with sr.AudioFile(sound) as source:
        r.adjust_for_ambient_noise(source)
        audio = r.listen(source)
        try:
            result=  r.recognize_google(audio)
            return str(result)
        except Exception as e:
            print(e)


def text2speech(text):    
    language = 'en'
    myobj = gTTS(text, lang=language, slow=False)
    perma_path = "./components/speaking_audio/"
    hash = random.getrandbits(128)
    response_audio_path = perma_path +str(hash)+".mp3"
    myobj.save(response_audio_path)
    return response_audio_path

client.run(token)





