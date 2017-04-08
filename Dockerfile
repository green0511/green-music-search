FROM node:6.10
WORKDIR /home/project
EXPOSE 3000
CMD ["npm", "run", "deploy"]