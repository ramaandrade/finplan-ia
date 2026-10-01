import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function localDiskSavePlugin() {
  return {
    name: 'local-disk-save-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-budget', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const targetPath = path.resolve(__dirname, 'src/data/savedUserBudget.json');
              fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, savedAt: new Date().toISOString() }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 404;
          res.end();
        }
      });
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), localDiskSavePlugin()],
  server: {
    port: 5173,
    open: false,
    host: true,
    watch: {
      ignored: ['**/savedUserBudget.json', '**/src/data/savedUserBudget.json']
    }
  }
});
