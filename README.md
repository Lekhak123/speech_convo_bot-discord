# speech_convo_bot-discord
A discord bot that uses chatbots, speech recognition etc etc to talk to the user in a voice chat
* install the python packages listed in requirement.txt
>install node_modules
* create a folder named "models" and [download and paste this model into this folder](https://huggingface.co/facebook/blenderbot_small-90M)
* configure the token, prefix, vc_channel and text_channel in config.json
# Run both the js file (node main.js) and python file (python chat.py) at the same time.
* after all is done, join the voice channel and use the command ${prefix}speak
* the bot needs a few seconds to get ready after it joins your voice channel
* When you start speaking(just make any random noises), the bot will ping you in the text_channel and tell you that you can start speaking (you can start talking now).
* Your voice will start to get recorded after you get pinged.
* Still not fully done, i want to add more stuff.
