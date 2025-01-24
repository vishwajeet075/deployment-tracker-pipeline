#!/bin/bash

# Start Jenkins in the background
echo "Starting Jenkins..."
/usr/local/bin/jenkins.sh &

# Wait for Jenkins to fully initialize and create config.xml
echo "Waiting for Jenkins to initialize..."
while [ ! -f /var/jenkins_home/config.xml ]; do
  sleep 5
done

# Wait for Jenkins to start listening on port 8080
echo "Waiting for Jenkins to start on port 8080..."
while ! nc -z localhost 8080; do
  sleep 5
done

# Disable CSRF protection by modifying the Jenkins configuration file
echo "Disabling CSRF protection in Jenkins..."
sed -i '/<useCrumbs>true<\/useCrumbs>/c\<useCrumbs>false<\/useCrumbs>' /var/jenkins_home/config.xml

# Restart Jenkins to apply the changes
echo "Restarting Jenkins to apply CSRF changes..."
curl -X POST http://localhost:8080/safeRestart

# Keep the container running
tail -f /dev/null