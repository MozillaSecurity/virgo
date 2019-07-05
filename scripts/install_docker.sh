#!/usr/bin/env bash

set -e
set -x

sudo apt-get -qq update
sudo apt-get -qq install -y -qq apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /dev/null 2>&1
sudo apt-get -qq update
sudo apt-get -qq install -y -qq docker-ce
sudo usermod -aG docker $USER

echo $'{\n    "experimental": true\n}' | sudo tee -a /etc/docker/daemon.json
mkdir -p ~/.docker && echo $'{\n    "experimental": enabled\n}' | sudo tee -a ~/.docker/daemon.json

sudo systemctl daemon-reload
sudo systemctl restart docker
