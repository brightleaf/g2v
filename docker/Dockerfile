FROM node:12-alpine

MAINTAINER Kevin Isom<kevin.isom@gmail.com>

RUN npm install -g @brightleaf/g2v

RUN mkdir /test

RUN mkdir /g2v

COPY ./ /g2v

RUN cd g2v \
  && npm install \
  && npm link

COPY ./test/one-giphy.GIF /test/one-giphy.gif

WORKDIR /test

RUN g2v one-giphy.gif
RUN test -f one-giphy.mp4 \
  && echo $?

