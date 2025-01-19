pipeline {
  agent any

  stages {
    // Stage 1: Checkout code from GitHub
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/vishwajeet075/Deployment-Impact-Tracker.git'
      }
    }

    // Stage 2: Add feedback widget to index.html
    stage('Add Feedback Widget') {
      steps {
        script {
          // Read the index.html file
          def indexHtml = readFile('index.html')

          // Add the feedback widget (glowing button)
          def feedbackWidget = """
            <style>
              .feedback-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #4CAF50;
                color: white;
                padding: 15px;
                border-radius: 50%;
                box-shadow: 0 0 20px #4CAF50;
                animation: glow 1.5s infinite alternate;
              }
              @keyframes glow {
                from {
                  box-shadow: 0 0 10px #4CAF50;
                }
                to {
                  box-shadow: 0 0 20px #4CAF50;
                }
              }
            </style>
            <div class="feedback-widget" onclick="window.location.href='https://your-feedback-app.com'">
              Give Feedback
            </div>
          """

          // Append the widget to the body of index.html
          indexHtml = indexHtml.replace('</body>', feedbackWidget + '</body>')

          // Write the updated content back to index.html
          writeFile file: 'index.html', text: indexHtml
        }
      }
    }

    // Stage 3: Deploy the updated website
    stage('Deploy') {
      steps {
        script {
          // Use scp or rsync to deploy the updated files to your server
          sh 'scp -r . user@your-server:/var/www/html'
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline succeeded! Feedback widget added and deployed.'
    }
    failure {
      echo 'Pipeline failed! Check the logs for errors.'
    }
  }
}