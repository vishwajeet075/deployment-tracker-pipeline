#!/bin/bash

# Wait for Jenkins to start and create the config.xml file
echo "Waiting for Jenkins to start..."
while [ ! -f /var/jenkins_home/config.xml ]; do
  sleep 2
done

# Disable CSRF protection by modifying the Jenkins configuration file
echo "Disabling CSRF protection in Jenkins..."
sed -i '/<useCrumbs>true<\/useCrumbs>/c\<useCrumbs>false<\/useCrumbs>' /var/jenkins_home/config.xml

# Start Jenkins
echo "Starting Jenkins..."
exec /usr/local/bin/jenkins.sh "$@"