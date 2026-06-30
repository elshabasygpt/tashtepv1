module.exports = {
  apps: [
    {
      name: "tashtep",
      script: "node_modules/.bin/next",
      args: "start --hostname 0.0.0.0 --port " + (process.env.PORT || 3000),
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
