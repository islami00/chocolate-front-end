#!/usr/bin/bash

set -eu
# Pre command to setup a chocolate node in workspace and build it.

cd /workspace
if [ ! -d "/workspace/chocolate-node" ]; then
    git clone https://github.com/chocolatenetwork/chocolate-node.git
fi
cd chocolate-node
git checkout development

# Rustup issue with current setup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain none -y

# Try-Refresh
. ~/.bashrc
. $HOME/.cargo/env

# Substrate init
rustup toolchain install nightly --allow-downgrade --profile minimal --component cargo
rustup target add wasm32-unknown-unknown --toolchain nightly

# Cargo
cargo build --release

# Cleanup and start
find ./target ! -name "chocolate" -type f -exec rm {} +