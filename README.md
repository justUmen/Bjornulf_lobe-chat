# Fork of lobe-chat v1.12.14

## Description

- Quick and dirty fork to enable lobe-chat to send ComfyUI api request + receive image link.

- Secondary : Allow to have custom background image based on session id, just use a .png with session id name, from your url. (public/Bjornulf_backgrounds/16a174d5-928f-42e0-b1a7-3bb329a1bfa2.png) -Require restart to take effect-

- Optional but recommended : Use PostgreSQL for storage of chat history and minio for storage of files. (My comfyui images are NOT stored with minio, just in public folder for now...)  

## Installation (for example with bun, but can use npm or whatever...)

Tested with Node v21.7.0, bun 1.0.30. (So you can `nvm install v21.7.0` for example, and `curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.30"`)

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

And the server will be running on `http://localhost:3210`, use the browser of your choice.

## Examples

### ComfyUI

![Comfyui](screenshot.png)

### Background

![Background](screenshot2.png)

## Details

- Need to use my Comfyui custom nodes : <https://github.com/justUmen/ComfyUI-BjornulfNodes>
- Can use my JSON workflows in the `public/Bjornulf_API/` folder to send to the ComfyUI, like for example `sd15.json` (Warning : You need to launch it manually at least one time before using it in lobe-chat.
- It is using a link `output/BJORNULF_API_LAST_IMAGE.png` created by my custom node comfyui, that need to be used in the workflow. The generated image is then copied using this link to the `public/generated/` folder inside lobe-chat.

## Todo

- If used with LLM, it also sends the local image link as useless tokens. (Not a huge waste, but a waste nevertheless.)

## Optional : (Example with Ubuntu)

Lobechat is using by default storage in browser, but you can use a database to store the chat history. Here is a quick guide to use PostgreSQL : - You can also use the docker but I don't.-

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

Use minio to store files with S3 format, you can use the docker image, or download the binary from the official website. (My wget here.)

#### Download where you want:

```
wget https://dl.min.io/server/minio/release/linux-amd64/minio
```

#### Run minio in the folder you want, for me it's in the public folder of the project:

```
./minio server /home/umen/SyNc/Forks/Bjornulf_lobe-chat/public/S3_minio/ --console-address ":9001"
```

# Example of configuration .env file in the root of your project for local database : (Of course replace by your own secret/id, these are fakes.)

- Generate KEY_VAULTS_SECRET and NEXT_AUTH_SECRET with `openssl rand -base64 32`.

- GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are obtained by creating a new OAuth App on GitHub.\
  You can use <http://localhost:3210> as the homepage URL and the Authorization callback URL.\
  Link Tutorial : [ssoproviders/github](https://lobehub.com/docs/self-hosting/advanced/auth/next-auth/github)

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