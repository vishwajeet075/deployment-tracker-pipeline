# Use the official Jenkins LTS image as the base
FROM jenkins/jenkins:lts

# Switch to root to install required system tools
USER root

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y \
    git \
    curl \
    docker.io && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the startup script to disable CSRF protection
COPY disable-csrf.sh /usr/local/bin/disable-csrf.sh
RUN chmod +x /usr/local/bin/disable-csrf.sh

# Switch back to the Jenkins user
USER jenkins

# Install plugins with specific versions
RUN jenkins-plugin-cli --plugins \
    git:latest \
    workflow-aggregator:latest \
    blueocean:latest \
    email-ext:latest

# Expose Jenkins web interface port
EXPOSE 8080

# Start Jenkins and run the script to disable CSRF protection
CMD ["/usr/local/bin/disable-csrf.sh"]