FROM alpine:edge
MAINTAINER dvittor@gmail.com
# https://www.baeldung.com/dockerizing-spring-boot-application
# http://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html

# Add alias
RUN echo "alias ll='ls -la'" > /etc/profile.d/00-aliases.sh
# Setup Timezone
RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/Australia/Sydney /etc/localtime
RUN echo "Australia/Sydney" >  /etc/timezone
RUN apk del tzdata

# Install Node JS
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g gulp
RUN node -v
RUN npm -v

WORKDIR /opt/app

# Install App
COPY package*.json /opt/app
RUN npm install
RUN echo 'alias dbst="./node_modules/.bin/sequelize db:migrate:status"' >> /etc/profile.d/00-aliases.sh
RUN echo 'alias dbdo="./node_modules/.bin/sequelize db:migrate"' >> /etc/profile.d/00-aliases.sh
RUN echo 'alias dbundo="./node_modules/.bin/sequelize db:migrate:undo"' >> /etc/profile.d/00-aliases.sh
COPY . /opt/app
EXPOSE 3000
CMD [ "npm", "run", "start" ]
