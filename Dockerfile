#Esto se ejecutará en una imagen de Linux, por lo que se estructura será la de un archivo de Linux.

FROM node:carbon

#La imagen utilizará el código que se incluya en la carpeta dentro de la imagen de Linux

WORKDIR /usr/src/app

#A continuación, copiará de nuevo todo lo que hay en la carpeta actual (ese será el código de JS).

COPY package*.json ./
#ADD . .

#COPY . .

#Entonces, se ejecutará "npm install" para obtener todos los módulos del nodo e incluirlos en la imagen (cargada previamente)

RUN npm install

#cambio
COPY . .

#Para poder interactiar con la web deberá exponer un puerto, en este caso 8080

EXPOSE 3000

#Finalmente para ejecutar la imagen deberá ejecutar también el servidor web. Para ello, tendrá que indicarle que ejecute el comando "npm start".

CMD ["npm", "start"]