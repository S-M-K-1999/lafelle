# Use a Node.js base image
FROM public.ecr.aws/lambda/nodejs:18

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Set the default command to run your Express app
CMD [ "src/app.js" ]