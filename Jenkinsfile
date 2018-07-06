#!/usr/bin/env groovy

pipeline {
agent none

    stages {
        stage('Test') {
            agent {
                docker {
                    image 'node'
                    args '-u root'
                }
            }
            steps {
                echo 'Beginning testing phase...'
                echo 'installing dependencies'
                sh 'yarn install --ignore-scripts --check-files --non-interactive'
                echo 'running tests'
                sh 'yarn clean'
                sh 'yarn test:lint'
                sh 'yarn test:flow'
                sh 'yarn test:jest'
                echo 'tests complete, sending coverage'
                sh 'cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js'
                echo 'Testing phase complete'
            }
        }
        stage('Build') {
            agent {
                docker {
                    image 'node'
                    args '-u root'
                }
            }
            options { skipDefaultCheckout() }
            steps {
                echo 'Beginning building phase...'
                sh 'yarn build'
                echo 'Building phase complete'
            }
        }
        stage('Publish') {
            agent {
                node {
                    label 'master'
                }
            }

            options { skipDefaultCheckout() }
            steps {
                echo 'publishing branch '  + env.BRANCH_NAME
                sh 'chmod +x ./publish.sh'
                sh './publish.sh ' + env.BRANCH_NAME
                echo 'Publishing complete'
            }
        }
    }
}
