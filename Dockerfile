# Use the official Jenkins LTS image as the base
FROM jenkins/jenkins:lts

# Switch to root to install required system tools and modify configurations
USER root

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y \
    git \
    curl \
    docker.io && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Disable CSRF protection by modifying the Jenkins configuration file
RUN echo "Disabling CSRF protection in Jenkins..." && \
    sed -i '/<useCrumbs>true<\/useCrumbs>/c\<useCrumbs>false<\/useCrumbs>' /var/jenkins_home/config.xml

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



# Start Jenkins
CMD ["jenkins.sh"]