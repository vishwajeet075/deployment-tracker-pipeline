pipeline {
  agent any

  environment {
    GIT_REPO = 'https://github.com/vishwajeet075/Deployment-Impact-Tracker.git'
    GIT_BRANCH = 'master'
    GIT_USERNAME = credentials('GIT_USERNAME') // Fetch from environment variables
    GIT_PASSWORD = credentials('GIT_PASSWORD') // Fetch from environment variables
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: "${GIT_BRANCH}", url: "${GIT_REPO}", credentialsId: "${GIT_CREDENTIALS}"
      }
    }

    stage('Add Interactive Elements') {
      steps {
        script {
          def indexHtml = readFile('index.html')
          
          def interactiveElements = """
            <style>
              /* Animated Arrow Styles */
              .nav-pointer {
                position: fixed;
                top: 20px;
                right: 100px;
                animation: pulseAndBounce 2s infinite;
                z-index: 1000;
                pointer-events: none;
              }
              
              .arrow-container {
                position: relative;
                width: 60px;
                height: 60px;
              }
              
              .arrow {
                width: 50px;
                height: 50px;
                background: #FF4081;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                box-shadow: 0 4px 15px rgba(255, 64, 129, 0.4);
              }
              
              .arrow svg {
                width: 30px;
                height: 30px;
                fill: white;
              }
              
              .arrow::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                background: #FF4081;
                border-radius: 50%;
                opacity: 0.5;
                animation: ripple 1.5s infinite;
              }
              
              @keyframes pulseAndBounce {
                0%, 100% { 
                  transform: translateY(0) scale(1);
                }
                50% { 
                  transform: translateY(-10px) scale(1.1);
                }
              }
              
              @keyframes ripple {
                0% {
                  transform: scale(1);
                  opacity: 0.5;
                }
                100% {
                  transform: scale(1.5);
                  opacity: 0;
                }
              }
              
              /* Feedback Button Styles */
              .feedback-button {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: linear-gradient(135deg, #6366F1, #4F46E5);
                color: white;
                padding: 15px 25px;
                border-radius: 50px;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
                transition: all 0.3s ease;
                z-index: 1000;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              
              .feedback-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
              }
              
              /* Popup Styles */
              .feedback-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                z-index: 1001;
                max-width: 400px;
                text-align: center;
                display: none;
                animation: popIn 0.5s ease-out;
              }
              
              @keyframes popIn {
                from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
              }
              
              .popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                display: none;
                backdrop-filter: blur(4px);
              }
              
              .popup-title {
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 15px;
                color: #1F2937;
              }
              
              .popup-description {
                color: #6B7280;
                margin-bottom: 25px;
                line-height: 1.6;
              }
              
              .popup-button {
                background: #4F46E5;
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 8px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
              }
              
              .popup-button:hover {
                background: #4338CA;
              }

              .features-highlight {
                animation: highlightPulse 2s infinite;
              }

              @keyframes highlightPulse {
                0%, 100% { 
                  text-shadow: 0 0 8px rgba(255, 64, 129, 0.4);
                }
                50% { 
                  text-shadow: 0 0 15px rgba(255, 64, 129, 0.7);
                }
              }
            </style>

            <!-- Animated Arrow -->
            <div class="nav-pointer">
              <div class="arrow-container">
                <div class="arrow">
                  <svg viewBox="0 0 24 24">
                    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Feedback Button -->
            <div class="feedback-button" onclick="showFeedbackPopup()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              Give Feedback
            </div>

            <!-- Popup -->
            <div class="popup-overlay"></div>
            <div class="feedback-popup">
              <div class="popup-title">Enjoying the new features? 🎉</div>
              <div class="popup-description">
                We've just added some exciting new features! We'd love to hear your thoughts on them.
              </div>
              <button class="popup-button" onclick="goToFeedback()">Share Your Feedback</button>
              <button 
                style="position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer;"
                onclick="hideFeedbackPopup()"
              >
                ✕
              </button>
            </div>

            <script>
              let hasGivenFeedback = false;
              let popupInterval;

              document.addEventListener('DOMContentLoaded', () => {
                // Find the Features link in navbar
                const featuresLink = Array.from(document.querySelectorAll('a')).find(el => 
                  el.textContent.toLowerCase().includes('feature')
                );

                if (featuresLink) {
                  // Add highlight effect to Features text
                  featuresLink.classList.add('features-highlight');
                  
                  // Position arrow near Features link
                  const rect = featuresLink.getBoundingClientRect();
                  const arrow = document.querySelector('.nav-pointer');
                  arrow.style.top = (rect.top - 10) + 'px';
                  arrow.style.left = (rect.right + 20) + 'px';

                  // Start popup sequence when Features is clicked
                  featuresLink.addEventListener('click', () => {
                    arrow.style.display = 'none';
                    featuresLink.classList.remove('features-highlight');
                    startFeedbackSequence();
                  });
                }

                // Check if user has already given feedback
                if (localStorage.getItem('hasGivenFeedback') === 'true') {
                  hasGivenFeedback = true;
                }
              });

              function startFeedbackSequence() {
                // First popup after 20 seconds
                setTimeout(() => {
                  if (!hasGivenFeedback) {
                    showFeedbackPopup();
                    
                    // Show popup every 2 minutes until feedback is given
                    popupInterval = setInterval(() => {
                      if (!hasGivenFeedback) {
                        showFeedbackPopup();
                      } else {
                        clearInterval(popupInterval);
                      }
                    }, 120000);
                  }
                }, 20000);
              }

              function showFeedbackPopup() {
                if (!hasGivenFeedback) {
                  document.querySelector('.popup-overlay').style.display = 'block';
                  document.querySelector('.feedback-popup').style.display = 'block';
                }
              }

              function hideFeedbackPopup() {
                document.querySelector('.popup-overlay').style.display = 'none';
                document.querySelector('.feedback-popup').style.display = 'none';
              }

              function goToFeedback() {
                hasGivenFeedback = true;
                clearInterval(popupInterval);
                hideFeedbackPopup();
                localStorage.setItem('hasGivenFeedback', 'true');
                window.location.href = 'https://your-dashboard-url.com/feedback';
              }

              // Close popup when clicking overlay
              document.querySelector('.popup-overlay').addEventListener('click', hideFeedbackPopup);
            </script>
          """

          // Insert the interactive elements before closing body tag
          indexHtml = indexHtml.replace('</body>', interactiveElements + '</body>')
          writeFile file: 'index.html', text: indexHtml
        }
      }
    }

    stage('Commit and Push') {
      steps {
        script {
          sh 'git config --global user.name "Jenkins"'
          sh 'git config --global user.email "jenkins@example.com"'
          sh 'git add .'
          sh 'git commit -m "Added interactive feedback elements"'
          
          // Use environment variables for GitHub credentials
          sh "git push https://${env.GIT_USERNAME}:${env.GIT_PASSWORD}@github.com/vishwajeet075/Deployment-Impact-Tracker.git ${GIT_BRANCH}"
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline succeeded! Interactive elements added and changes pushed to GitHub.'
    }
    failure {
      echo 'Pipeline failed! Check the logs for errors.'
    }
  }
}