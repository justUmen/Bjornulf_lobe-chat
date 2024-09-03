# Based on lobe-chat v1.12.19

lobe-chat + comfyui + xttsv2 + custom backgrounds + (postgresql + minio)\
Recommended : Use `PostgreSQL` for storage of chat history and `minio` for storage of files.\
As awell as github for authentication.

## 🚀 My fork features :

### 1 - 🎨 Generate Images with ComfyUI

🏠 Quick and dirty fork to enable lobe-chat to send ComfyUI api request + receive image link.\
You need to use Comfyui of course, but also my Comfyui custom nodes : <https://github.com/justUmen/ComfyUI-BjornulfNodes>\
⚠ For now my comfyui images are NOT stored with minio, just in public folder... ⚠\
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

## 📝 To do :

- \[xtts] Include auto detection of language.
- \[comfyui] If used with LLM, Comfyui also sends the local image link as useless tokens. (Not a huge waste, but a waste nevertheless.)
- \[comfyui] Use minio for storage of comfyui images.
- \[comfyui] Optimize loading time of comfyui images.
- \[comfyui] Store and save options, like current json...

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
GITHUB_CLIENT_ID=Iw22lx1kdsIoieHxufr
GITHUB_CLIENT_SECRET=25b7fff7a0ads6c63e2e5d19c7adqzcbdb1217075

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
