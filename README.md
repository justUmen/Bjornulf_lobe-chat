# 💬 Bjornulf chat v0.3, Based on lobe-chat v1.19.23 💬

Talk to several types of Ai on your local computer. (local and remote, ollama, openai, etc...)

Original project : <https://github.com/lobehub/lobe-chat>

# Coffee : ☕☕☕☕☕ 5/5

❤️❤️❤️ <https://ko-fi.com/bjornulf> ❤️❤️❤️

# ☘ This project is a component of my integrated AI trio. ☘

<u>**1 - 📝 Text/Chat AI generation : [Bjornulf Lobe Chat Fork](https://github.com/justUmen/Bjornulf_lobe-chat) (you are here)</u>\
2 - 🔊 Speech AI generation** : [Bjornulf Text To Speech](https://github.com/justUmen/Bjornulf_XTTS)\
3 - 🎨 Image AI generation : [Bjornulf Comfyui custom nodes](https://github.com/justUmen/ComfyUI-BjornulfNodes)

## Changelogs :

**_v0.2_** : much better interface to select Comfyui worklows + add tts voices/language selection.\
**_v0.3_** : update to lobe-chat v1.19.23 + add Ollama VRAM cleanup button.

## Introduction :

- lobe-chat + comfyui + xttsv2 + custom backgrounds + (postgresql + minio)
- Recommended : Use `PostgreSQL` for storage of chat history and `minio` for storage of files.
- Github (app/oauth) for user authentication.

## 🚀 My fork features :

.1 - 🎨 Generate Images with ComfyUI\
.2 - 🗣️ Local Text-to-Speech with the voice you want (2 included)\
.3 - 🌈 Custom Backgrounds\
.4 - 🦙 Button to Clean-up Ollama VRAM usage

### 1 - 🎨 Generate Images with ComfyUI

🏠 Quick and dirty fork to enable lobe-chat to send ComfyUI api request + receive image link.\
You need to use Comfyui of course, but also my Comfyui custom nodes : <https://github.com/justUmen/ComfyUI-BjornulgitfNodes>\
⚠ For now my comfyui images are NOT stored with minio, just in public folder... ⚠\
If you want to use Comfyui remotely (like a phone on local network), you need to launch ComfyUI with `python main.py --listen 0.0.0.0`.\
![Comfyui](screenshots/screenshot.png)

### 2 - 🗣️ Local Text-to-Speech with the voice you want (2 included)

🏠 Runs entirely on your device\
Use `xttsv2` for local text-to-speech. (You need to install it and run the server separately)\
You need to use my fork = <https://github.com/justUmen/Bjornulf_XTTS>\
⚠ lobe-chat and xtts should share the same folder, create a link `Bjornulf_XTTS/xtts_api_server/speakers/` to or from `Bjornulf_lobe-chat/public/bjornulf_voices/` ⚠\
For multilanguage support, you can use folders with language code like `en`, `fr`, `de`, etc...\
You can use any `.wav` custom voice sample, just replace manually the `default.wav` in the `speakers` folder.\
Available languages :\
`ar: 'Arabic', cs: 'Czech', de: 'German', en: 'English', es: 'Spanish', fr: 'French', hi: 'Hindi', hu: 'Hungarian', it: 'Italian', ja: 'Japanese', ko: 'Korean', nl: 'Dutch', pl: 'Polish', pt: 'Portuguese', ru: 'Russian', tr: 'Turkish', 'zh-cn': 'Chinese'`\
Here you can download a sample with `Attenborough` voice (English so put in a folder `en`) : <https://drive.google.com/file/d/1JOSpavgN0GS2OswXbQCpqL5kYV0nSr6n/view?usp=sharing>\
![Background](screenshots/screenshot3.png)
![bjornulf xtts](screenshots/screenshot4.png)\
![bjornulf voices](screenshots/screenshot6.png)

### 3 - 🌈 Custom Backgrounds

🎨 Use your own images as background.\
The custom background image based on session id, just use a .png with session id name, from your url.\
Just check the URL of the lobe-chat, and use the session id as the name of the image.\
Example for `http://localhost:3210/chat?agent=&session=ssn_W6hB1fM2y4fK`, image should be `public/Bjornulf_backgrounds/ssn_W6hB1fM2y4fK.png`\
⚠ Require restart to take effect ⚠\
![Background](screenshots/screenshot2.png)

### 4 - 🦙 Button to Clean-up Ollama VRAM usage

Add a button to free VRAM usage of the current model from the local Ollama server.\
Very useful, especially if you want to generate an image with ComfyUI : Just free up your VRAM first !\\

![Background](screenshots/free_vram.png)

## 📝 To do :

- \[xtts] Include auto detection of language.
- \[comfyui] If used with LLM, Comfyui also sends the local image link as useless tokens. (Not a huge waste, but a waste nevertheless.)
- \[comfyui] Use minio for storage of comfyui images.
- \[comfyui] Optimize loading time of comfyui images.

## 0 - Lobe-chat installation (for example with bun, but can use npm or whatever...)

Tested with Node v21.7.0, bun 1.0.30. (So you can `nvm install v21.7.0` for example, and `curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.30"`)\
Choose where to download the project, and then install it there :

```
git clone https://github.com/justUmen/Bjornulf_lobe-chat
cd Bjornulf_lobe-chat
bun install
bun run build
```

## Start lobe-chat (for example with bun, but can use npm or whatever)

```
bun run start
```

And the server should be running on `http://localhost:3210`, use the browser of your choice !!!

## Details :

- Can use my JSON workflows in the `public/Bjornulf_API/` folder to send to the ComfyUI, like for example `sd15.json` (Warning : You need to launch it manually at least one time before using it in lobe-chat.
- It is using a link `output/BJORNULF_API_LAST_IMAGE.png` created by my custom node comfyui, that need to be used in the workflow. The generated image is then copied using this link to the `public/generated/` folder inside lobe-chat.

## Configuration :

### 2 - 🗣️ Local Text-to-Speech with XTTS v2

Create a virtual environment and install the requirements, here is an example :

```
python -m venv /home/your_user/venv/xtts/
source /home/your_user/venv/xtts/bin/activate
mkdir -p /home/your_user/XTTS_SERVER
cd /home/your_user/XTTS_SERVER
pip install xtts_api_server
python -m xtts_api_server
```

You also need a voice sample : `/home/your_user/XTTS_SERVER/speakers/default.wav`

## Recommended : Use `PostgreSQL` for storage of chat history and `minio` for storage of files. (Example with Ubuntu)

Lobechat is using by defaulta a client-side database (IndexedDB), but you can use a "real" database to store the chat history.\
Here is a quick guide to use PostgreSQL anc configure it for lobe-chat. :\
⚠ You can also use the docker but I don't like and never tried that. ⚠

### 1 - Install PostgreSQL and extension pgvector:

```
sudo apt install postgresql postgresql-16-pgvector
```

### 2 - Connect to PostgreSQL as a superuser 'postgres':

```
psql -U postgres
```

OR

```
sudo -i -u postgres
psql
```

OR

```
sudo -u postgres psql
```

### 3 - Inside the PostgreSQL shell, create a new database, user, and grant privileges:

```
CREATE DATABASE lobe_chat_db;
```

### 4 - Create a new user:

```
CREATE USER youruser WITH PASSWORD 'yourpassword';
```

### 5 - Grant all privileges on the 'lobe_chat_db' database to the youruser' user:

```
GRANT ALL PRIVILEGES ON DATABASE lobe_chat_db TO youruser;
```

### 6 - Connect to the 'lobe_chat_db' database, and create vector extension:

```
\c lobe_chat_db
CREATE EXTENSION IF NOT EXISTS vector;
```

### 7 - Grant usage and create privileges on the public schema to the 'youruser' user:

```
GRANT USAGE, CREATE ON SCHEMA public TO youruser;
```

### 8 - Grant all privileges on all tables in the public schema to the 'youruser' user:

```
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO youruser;
```

### 9 - Grant all privileges on all sequences in the public schema to the 'youruser' user:

```
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO youruser;
```

### 10 - Set the default privileges for the 'youruser' user to create tables and sequences:

```
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO youruser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO youruser;
```

### 11 - Leave psql:

```
\q
```

### 12 - Use minio for local storage of files :

Use minio to store files with S3 format, you can use the docker image, or download the binary from the official website. (My wget here.)\
I also set minio

#### Download where you want:

```
wget https://dl.min.io/server/minio/release/linux-amd64/minio
```

#### Run minio in the folder you want, for me it's in the public folder of the project:

You might also want to put minio bucket PUBLIC, so you can access the files without authentication.

```
./minio server /home/umen/SyNc/Forks/Bjornulf_lobe-chat/public/S3_minio/ --console-address ":9001"
```

# Example of configuration .env file in the root of your project for local database : (Of course replace by your own secret/id, these are fakes.)

- Generate KEY_VAULTS_SECRET and NEXT_AUTH_SECRET with `openssl rand -base64 32`.

- Below `umen` is the user, `yourpassword` is the password, `lobe_chat_db` is the database name on postgresql and `lobechat` is the bucket name on minio !!!

```
#.env file :
########################################
########## Server Database #############
########################################

NEXT_PUBLIC_SERVICE_MODE=server
DATABASE_DRIVER=node
DATABASE_URL=postgres://umen:yourpassword@localhost:5432/lobe_chat_db
KEY_VAULTS_SECRET=MgMzt2U+lKwSCN9enMYmyvVRTFzsb60db8127035

NEXT_AUTH_SECRET=RDD/HFZTSufylb61eb1117095t3KuO1FrHnviMATqAa=

NEXT_AUTH_SSO_PROVIDERS=github
AUTH_GITHUB_ID=Iw22lx1kdsIoieHxufr
AUTH_GITHUB_SECRET=25b7fff7a0ads6c63e2e5d19c7adqzcbdb1217075

APP_URL=http://localhost:3210

########################################
############### Minio ##################
########################################

S3_ENABLE_PATH_STYLE=1

S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin

S3_BUCKET=lobechat
S3_ENDPOINT=http://localhost:9000
S3_PUBLIC_DOMAIN=http://localhost:9000
```

# How to Prepare to login using github

- GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are obtained by creating a new OAuth App on GitHub.\
  (You can use <http://localhost:3210> as the homepage URL and the Authorization callback URL.)\
  Start on this link <https://github.com/settings/apps/new>, and follow the screenshots below to get GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET :

![gitthub](screenshots/github/1.png)\
![gitthub](screenshots/github/2.png)\
![gitthub](screenshots/github/3.png)\
![gitthub](screenshots/github/4.png)\
![gitthub](screenshots/github/5.png)

# How do I use all of this ???

- I use kitty terminal <https://github.com/kovidgoyal/kitty> and .desktop files, I just use it as 2 icons in my taskbar.\
  ![Background](screenshots/screenshot5.png)

I use lobe-chat + minio together on an icon with a .desktop file : `lobe-chat-minio.desktop`

```
[Desktop Entry]
Name=lobe-chat-minio
Comment=lobe-chat-minio
Exec=kitty --class "kitty_lobechat" --title "kitty - lobe-chat" zsh -i -c '/home/umen/Downloads/minio server /home/umen/SyNc/Forks/Bjornulf_lobe-chat/public/S3_minio/ --console-address ":9001" & cd /home/umen/SyNc/Forks/Bjornulf_lobe-chat && bun run start || read'
Icon=/home/umen/Pictures/icons/lobe-chat.webp
Terminal=false
Type=Application
Categories=Utility;
StartupWMClass=kitty_lobechat
```

I keep XTTS separate, because I don't want to use VRAM if i don't plan on using TTS. I launch it when needed with another icon .desktop file : `xtts.desktop`

```
[Desktop Entry]
Name=xtts_server
Comment=xtts_server
Exec=kitty --class "kitty_xtts" --title "kitty - xtts" zsh -i -c 'source /home/umen/venv/xtts/bin/activate && cd /home/umen/SyNc/Forks/xtts-api-server/xtts_api_server/ && python bjornulf_xtts_server.py || read'
Icon=/home/umen/Pictures/icons/speaker.svg
Terminal=false
Type=Application
Categories=Utility;
StartupWMClass=kitty_xtts
```

- Notice the ` || read` to keep the terminal open in case of error, so you can read the error...

- How do I close them ? I go on the kitty terminal and close them with `Ctrl + C` when i don't need them anymore.

- I also have all my terminals running in a separate workspace, so they don't clutter my environment.

- On my computer CUDA has issues after hibernation, so I just restart my computer. So i just disable hibernation for `bjornulf_xtts_server.py` with something like that : `systemd-inhibit --what=sleep --who="bjornulf app" --why="Preventing sleep" --mode=block python bjornulf_xtts_server.py`

- What about PostgreSQL ?\
  For me PostgreSQL is running all the time, just run once `sudo systemctl enable postgresql` and `sudo systemctl start postgresql`.\
  The server will be available on `localhost:5432` and the database `lobe_chat_db` will be used by lobe-chat.

# FAQ : Frequently Asked Questions

## 1 - How to connect from another device on my local network ? (wifi)

### Example here using your phone to connect to your computer lobe-chat server :

Well... for that you will have to know the IP of your computer (that is running lobe-chat) on the local network. (You can run `ip addr` in console, you should see something like `inet 192.168.1.xx/24`.)\
Let's say it's `192.168.1.55`, you can go on this URL from your phone : `http://192.168.1.55:3210`.\
When you try to connect/login with github, the app will give you an authentification link to `http://localhost:3210`. (Which won't work on phone.)\
BUT !!! After the request to login failed, you can keep the same link (with code and stuff) but manually change `localhost` in the URL into `192.168.1.55` and send the request again.\
It will look like it failed again, but just go back to `http://192.168.1.55:3210`, try to connect again and you should be connected.\
You won't have to login again, the token should be stored in the browser.

But... ollama won't work, because it is sending request to localhost...\
You will have to configure ollama to not send requests to localhost, but to this IP instead. (It will still work localy of course because `192.168.1.55` can access `192.168.1.55`, duh.)\
In the lobe-chat Settings, in "Language Model", you will find the default URL for ollama, it should be : `http://localhost:11434`\
You can change that to `http://192.168.1.55:11434`. (You can test by clicking the button below "Check")\\

On linux, to access that properly you need to edit the ollama config file `/etc/systemd/system/ollama.service`, here is mine :

```
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=umen
Group=umen
Restart=always
RestartSec=3
Environment="PATH=/home/umen/.bun/bin:/home/umen/bin:/usr/local/cuda-12.3/bin:/home/umen/.symfony5/bin:/home/umen/.nvm/versions/node/v21.7.0/bin:/home/umen/.nvm/versions/node/v21.7.0/bin:/home/umen/anaconda3/bin:/home/umen/.gem/ruby/2.4.0/bin:/home/umen/bin:/usr/local/bin:/usr/bin:/home/umen/.local/share/zinit/plugins/starship---starship:/home/umen/.local/share/zinit/polaris/bin:/home/umen/.bun/bin:/home/umen/bin:/usr/local/cuda-12.3/bin:/home/umen/.symfony5/bin:/home/umen/miniconda3/bin:/home/umen/miniconda3/condabin:/home/umen/.nvm/versions/node/v21.7.0/bin:/home/umen/anaconda3/bin:/home/umen/.gem/ruby/2.4.0/bin:/home/umen/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/home/umen/.cargo/bin:/opt/wine-stable/bin:/home/umen/.local/bin:/home/umen/.fzf/bin:/home/umen/.cargo/bin:/opt/wine-stable/bin:/home/umen/.local/bin"
Environment="OLLAMA_MODELS=/mnt/1To_linux/1To/for_ollama"
Environment="OLLAMA_ORIGINS=*"
Environment="OLLAMA_HOST=192.168.1.55"

[Install]
WantedBy=default.target
```

You don't need all my things, notice that i run ollama with `umen` user... Also don't use my `PATH` lol.\
But you can inspire yourself from this file. (You probably just need `OLLAMA_HOST` and `OLLAMA_ORIGINS`)\
After changing this file, you need to do `sudo systemctl daemon-reload` and restart the service with `sudo systemctl restart ollama`.\
You might need to add to your .bashrc or .zshc... : `export OLLAMA_HOST=http://192.168.1.37:11434`
