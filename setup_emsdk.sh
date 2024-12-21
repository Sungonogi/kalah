#!/bin/bash

# Clone the Emscripten SDK repository if it doesn't already exist
if [ ! -d "emsdk" ]; then
    echo "Cloning Emscripten SDK..."
    git clone https://github.com/emscripten-core/emsdk.git
fi

cd emsdk || exit

# Pull the latest changes
echo "Updating Emscripten SDK..."
git pull

# Install and activate the latest SDK
echo "Installing the latest Emscripten tools..."
./emsdk install latest
./emsdk activate latest

# Activate the environment for the current terminal session
echo "Activating Emscripten environment..."
source ./emsdk_env.sh

echo "Emscripten SDK setup is complete!"