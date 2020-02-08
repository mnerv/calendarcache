module.exports = {
  apps: [
    {
      name: 'calsub',
      script: 'server.js',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 1,
      autorestart: true,
      watch: ['server.js', 'backend'],
      ignore_watch: ['data', 'node_modules'],
      max_memory_restart: '1G',
      env: {
        PORT: 3475,
        NODE_ENV: 'dev'
      },
      env_production: {
        NODE_ENV: 'prod'
      }
    }
  ],

  deploy: {
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
}
