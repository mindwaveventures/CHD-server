### BASE
FROM node:20-alpine as builder

# Project information as Label
LABEL name="Congenital Heart Disease (CHD)"

# Workflow directory
WORKDIR /app

COPY . .

# Install dependencies and build the project
RUN npm install
RUN npm run prod

# Expose port
EXPOSE 80

ENTRYPOINT ["npm", "start"]
