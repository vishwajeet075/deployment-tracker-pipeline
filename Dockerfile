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

# Copy the plugins list to the container
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt

# Install Jenkins plugins
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

# Expose Jenkins port
EXPOSE 8080