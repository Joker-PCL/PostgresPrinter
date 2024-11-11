module.exports = {
    apps: [
      {
        name: 'Scale',
        script: './server.js',
        instances: 4,
        autorestart: true,
        watch: false,
        // watch: ['api, server.js'], // Auto reload
        max_restart: 10,
        restart_delay: 5000,
        max_memory_restart: '1000M',
        error_file: './log/error.log',
        out_file: './log/out.log',
        log_date_format: 'DD/MM/YYYY, HH:mm:ss',
      },
    ],
  };
  