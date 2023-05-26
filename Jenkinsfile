pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        nodejs(cacheLocationStrategy: workspace(), nodeJSInstallationName: 'Nodejs16') {
        sh '''ls
pwd
rm -rf build/
rm -rf devbuild.tar.gz
npm install --force
CI= npm run build:dev
tar cvf devbuild.tar.gz build
ls'''
      }
    }
  }
    stage('Upload Build') {
          steps {
            sshPublisher(publishers: [sshPublisherDesc(configName: 'scrooge-nft', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '''rm -rf /home/ubuntu/dev-marketplace/frontend/build
tar -xf /home/ubuntu/devbuild.tar.gz -C /home/ubuntu/dev-marketplace/frontend
rm -rf /home/ubuntu/devbuild.tar.gz''', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '/', remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'devbuild.tar.gz')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true)])
         }
        }
  }
}
