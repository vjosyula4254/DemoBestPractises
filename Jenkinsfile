#!groovy

pipeline {
    agent any
    tools {
        maven 'Maven'
        nodejs 'NodeJS'
    }
    stages {
            stage('Clean') {
                steps {
                dir('edge') {
                    bat "mvn clean"
                }
            }
        }
            

            stage('Build proxy bundle') {
                steps {
                    dir('edge') {
                    bat "mvn package -Papigee -Denv=${params.apigee_env} -Dorg=${params.apigee_org}"

                }
            }
        }

            stage('Deploy proxy bundle') {
                steps {
                    dir('edge') {
                    bat "mvn apigee-enterprise:deploy -Papigee -Denv=${params.apigee_env} -Dorg=${params.apigee_org} -Dusername=${params.apigee_user} -Dpassword=${params.apigee_pwd}"
                }
            }
        }
            stage('Post-Deployment Configurations for API ') {
                steps {
                    dir('edge') {
                    println "Post-Deployment Configurations for API Products Configurations, App Developer and App Configuration "
                    bat "mvn -Papigee -Denv=${params.apigee_env} -Dorg=${params.apigee_org} " +
                            "    -Dapigee.config.options=create " +
                            "    -Dusername=${params.apigee_user} -Dpassword=${params.apigee_pwd} " +
                            "    apigee-config:apiproducts " +
                            "    apigee-config:developers apigee-config:apps apigee-config:exportAppKeys"
                }
            }
        }

            stage('Functional Test') {
                steps {
                    dir('edge') {
                    bat "node ./node_modules/cucumber/bin/cucumber-js target/test/integration/features --format json:target/reports.json"
                }
            }
        }

            stage('Coverage Test Report') {
                steps {
                    dir('edge') {
                    publishHTML(target: [
                            allowMissing         : false,
                            alwaysLinkToLastBuild: false,
                            keepAll              : false,
                            reportDir            : "target/coverage/lcov-report",
                            reportFiles          : 'index.html',
                            reportName           : 'HTML Report'
                    ]
                    )
                }
            }
        }

            stage('Functional Test Report') {
                steps {
                    dir('edge') {
                    step([
                            $class             : 'CucumberReportPublisher',
                            fileExcludePattern : '',
                            fileIncludePattern : "**/reports.json",
                            ignoreFailedTests  : false,
                            jenkinsBasePath    : '',
                            jsonReportDirectory: "target",
                            missingFails       : false,
                            parallelTesting    : false,
                            pendingFails       : false,
                            skippedFails       : false,
                            undefinedFails     : false
                    ])
                }
            }
        }
        
    }
}

