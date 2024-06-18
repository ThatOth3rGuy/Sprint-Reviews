FROM node:latest

WORKDIR /tests

# Install Playwright
RUN npm install -g playwright

RUN npx playwright install-deps

# Copy test scripts
COPY ./test /tests/

# Run tests (adjust command as needed)
CMD ["playwright", "test"]
