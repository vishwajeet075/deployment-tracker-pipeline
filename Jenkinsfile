pipeline {
  agent any

  environment {
    GIT_REPO = 'https://github.com/vishwajeet075/Deployment-Impact-Tracker.git'
    GIT_BRANCH = 'main'
    GIT_CREDENTIALS = 'github-credentials' // Add your GitHub credentials in Jenkins
  }

  stages {
    // Stage 1: Checkout code from GitHub
    stage('Checkout') {
      steps {
        git branch: "${GIT_BRANCH}", url: "${GIT_REPO}", credentialsId: "${GIT_CREDENTIALS}"
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

    // Stage 3: Commit and push changes back to GitHub
    stage('Commit and Push') {
      steps {
        script {
          // Configure Git
          sh 'git config --global user.name "Jenkins"'
          sh 'git config --global user.email "jenkins@example.com"'

          // Add all changes
          sh 'git add .'

          // Commit the changes
          sh 'git commit -m "Added feedback widget to index.html"'

          // Push the changes back to GitHub
          withCredentials([usernamePassword(credentialsId: "${GIT_CREDENTIALS}", usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
            sh 'git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/vishwajeet075/Deployment-Impact-Tracker.git ${GIT_BRANCH}'
          }
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline succeeded! Feedback widget added and changes pushed to GitHub.'
    }
    failure {
      echo 'Pipeline failed! Check the logs for errors.'
    }
  }
}