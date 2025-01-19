# Use the official Jenkins image
FROM jenkins/jenkins:lts

# Switch to root to install dependencies
USER root

# Install necessary tools (e.g., Git, Docker CLI)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    docker.io

# Switch back to Jenkins user
USER jenkins

# Install Jenkins plugins
RUN jenkins-plugin-cli --plugins \
    github \
    pipeline \
    blueocean \
    email-ext

# Expose Jenkins port
EXPOSE 8080