#!/bin/bash

# Variabel
USERNAME=hidawaa
REPO_NAME=karsajobs
REGISTRY=ghcr.io
IMAGE_NAME=$REGISTRY/$USERNAME/$REPO_NAME:latest

# Build image di lokal
echo "Build image..."
docker build -t $IMAGE_NAME .

# Login GitHub Packages
echo "Login..."
echo $TOKEN | docker login ghcr.io -u $USERNAME --password-stdin

# Upload Image
echo "Upload image..."
docker push $IMAGE_NAME

echo "Berhasil upload image $IMAGE_NAME"
