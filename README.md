# Kalah Game

Kalah is a traditional two-player strategy board game, also known as "Mancala." This project is a digital version of the game, created for fun, with both a computer opponent and a human player mode. Check it out [here](https://ingosternberg.github.io/kalah/start).

## Project Overview

- **Frontend**: Angular
- **Backend**: Java Spring (implements game logic and computer moves using Alpha-Beta Pruning)
- **Inspiration**: This project was inspired by a Kalah Tournament at my university (FAU), where we were tasked with programming an AI to compete in the game.

## Features

- Interactive user interface built with Angular.
- Backend game logic handled by a Java Spring application.
- Computer opponent that calculates optimal moves using the Alpha-Beta Pruning algorithm.
- Play against a computer or another player locally.

## Rules of Kalah

The objective of Kalah is to capture as many seeds as possible. Players take turns picking seeds from one of their pits, distributing them counterclockwise, and aiming to capture the opponent’s seeds. If you're new to Kalah, don’t worry—jump right in and start playing to get the hang of it!

For more details on the rules, you can refer to the ["How to Play"](https://ingosternberg.github.io/kalah/tutorial) section on the website or read more on [Wikipedia](https://en.wikipedia.org/wiki/Kalah).

## Attribution

I was allowed to use JM Gustafsons Sound Effects for the Game
- **World Tree Software** by JM Gustafson
  Source: [Website](https://www.worldtreesoftware.com/)

It also uses this cpp libary for json parsing
- **C++ JSON parsing library** by Niels Lohmann  
  Source: [Github Repository](https://github.com/nlohmann/json/tree/develop)  
  License: MIT

For the favicon
- **favicon.io** made by John Sorrentino
  Source: [favicon.io](https://favicon.io/favicon-generator/)
  License: unlicensed (I found nothing in the terms of use)
  Settings: (Rounded, Macondo, Regular 400 Normal, 50, #DAF, #84B)

To compile Cpp to Wasm
- **Emscripten** 
  Source: [emscripten.org](https://emscripten.org)
  License: MIT

## Setup Wasm

Only necessary if you want to make changes to the cpp code, because the compiled files are already in the public/cpp folder.

First you have to clone the emscripten repo
```
git clone https://github.com/emscripten-core/emsdk.git
```

Now you have to paste this into your (linux) shell:
```
cd emsdk

git pull

# Download and install the latest SDK tools.
./emsdk install latest

# Make the "latest" SDK "active" for the current user. (writes .emscripten file)
./emsdk activate latest

# Activate PATH and other environment variables in the current terminal
source ./emsdk_env.sh

cd ..
```

Now you will be able to use emcc to build the webassembly stuff. The command to do that is in the package.json so you can simply do
```
npm run wasm:build
```

## License

The source code for this project is released under the MIT License. See the [LICENSE](LICENSE) file for more details.
