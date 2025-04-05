#!/bin/bash

# Variabel
IMAGE_NAME=item-app
TAG=v1
USERNAME=hidawaa
REPO_NAME=a433-microservices
PACKAGE_NAME=item-app

# Build image di lokal
echo "Build image..."
docker build -t $IMAGE_NAME:$TAG .

# Daftar image
docker images ls

# Tag Nama
REGISTRY=ghcr.io
FULL_IMAGE_NAME=$REGISTRY/$USERNAME/$PACKAGE_NAME:$TAG
docker tag $IMAGE_NAME:$TAG $FULL_IMAGE_NAME

# Login GitHub Packages
echo "Login..."
echo $TOKEN | docker login ghcr.io -u $USERNAME --password-stdin

# Upload Image
echo "Upload image..."
docker push $FULL_IMAGE_NAME

echo "Berhasil upload image $FULL_IMAGE_NAME"
