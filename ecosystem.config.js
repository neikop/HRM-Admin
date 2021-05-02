module.exports = {
  apps: [{
    name: 'hrm-admin',
    script: 'npm',
    args: 'start',
    interpreter: 'none',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      "PORT": 3002,
      "NODE_ENV": "development"
    },
    env_production: {
      "PORT": 3002,
      "NODE_ENV": "production",
    }
  }]
};
