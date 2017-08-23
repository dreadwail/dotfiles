#!/usr/bin/env bash
docker build . --tag openjdk-tools
docker run -d openjdk-tools
CONTAINER_ID=$(docker ps -a | awk '{ print $1,$2 }' | grep openjdk-tools | awk '{print $1 }'| head -1)
docker cp $CONTAINER_ID:/langtools/dist/lib/classes.jar tools-1.8.jar
docker cp $CONTAINER_ID:/langtools/dist/lib/src.zip tools-1.8-sources.jar
docker stop $CONTAINER_ID