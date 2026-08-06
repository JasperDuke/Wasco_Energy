module.exports = {
  apps: [
    {
      name: 'wasco-be',
      cwd: './backend',
      script: 'dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4014,
      },
    },
    {
      name: 'wasco-fe',
      cwd: './frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3018',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3018,
      },
    },
  ],
};
