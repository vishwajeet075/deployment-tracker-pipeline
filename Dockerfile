FROM jenkins/jenkins:lts

USER root
RUN apt-get update && \
    apt-get install -y \
    git \
    curl \
    docker.io && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

USER jenkins

# Install specific plugin versions that are known to work together
RUN jenkins-plugin-cli --plugins \
    git:latest \
    workflow-aggregator:latest \
    blueocean:latest \
    email-ext:latest \
    configuration-as-code:latest

EXPOSE 8080