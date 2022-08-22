# mmCEsim Web App Dockerfile
# Author: Wuqiong Zhao

FROM node:18

RUN apt-get update && apt-get install -y cmake && apt-get install -y libboost-all-dev && apt-get install -y p7zip-full
RUN git clone --recurse-submodules https://github.com/mmcesim/mmcesim.git
RUN cd mmcesim && cmake . && make && cd ..
RUN ls ./mmcesim/bin

WORKDIR /app
COPY package*.json ./
COPY index.html ./
COPY *.js ./
RUN npm install
CMD ["npm", "start"]
