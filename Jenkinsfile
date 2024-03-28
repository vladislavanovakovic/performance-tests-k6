pipeline {
  agent any
  stages {
    stage('verify k6') {
      steps {
        bat 'k6 version'
      }
    }
    stage('run k6 test') {
      steps {
        bat 'k6 run 2-script.js'
      }
    }
  }
}