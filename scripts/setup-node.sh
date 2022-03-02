# Pre command to setup a chocolate node in workspace and build it.

cd /workspace
git clone https://github.com/chocolatenetwork/chocolate-node.git
cd chocolate-node

# Rustup issue with current setup
rustup self uninstall -y
source ~/.bash_profile
rustup self uninstall -y
source ~/.bash_profile

# Substrate init
curl https://getsubstrate.io -o a.o
chmod +x a.o 
./a.o --fast
# Try-Refresh
source /workspace/.cargo/env

# Rustup issues
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly

# Cargo

cargo run --dev --ws-external && rm a.o # Cleanup and start
