#!/usr/bin/env bash
docker login
docker build . --tag georgewfraser/vscode-javac-circleci
docker push georgewfraser/vscode-javac-circleci