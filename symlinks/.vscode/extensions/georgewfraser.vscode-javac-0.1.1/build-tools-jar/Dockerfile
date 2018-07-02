# (C) Copyright IBM Corporation 2017.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM ubuntu:14.04

# Install required OS tools
RUN apt-get update \
  && apt-get install -qq -y --no-install-recommends \
    cpio \
    make \
    gcc \
    g++ \
    libx11-dev \
    libxext-dev \
    libxrender-dev \
    libxtst-dev \
    libxt-dev \
    libcups2-dev \
    libfreetype6-dev \
    libasound2-dev \
    openjdk-7-jdk \
    ant \
    ccache \
    zip \
    wget \
    git \
    unzip \
    mercurial \
&& rm -rf /var/lib/apt/lists/*

# Clone JDK8
RUN mkdir -p /langtools
RUN hg clone http://hg.netbeans.org/main/nb-javac /langtools

WORKDIR /langtools

# Get build script
RUN hg checkout release801
COPY build.properties /langtools/make/
RUN ant -f make/build.xml

# Default actions
ENTRYPOINT sleep 1000