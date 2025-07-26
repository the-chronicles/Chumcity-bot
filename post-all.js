const { exec } = require('child_process');

const scripts = [
  'post-tmz.js',
  'post-buzzfeed.js',
  'post-vice.js',
  'post-xxl.js',
  'post-hotnewhiphop.js'
];

(async () => {
  for (const script of scripts) {
    console.log(`\n==============================`);
    console.log(`🔄 Starting ${script}...`);
    console.log(`==============================`);
    
    await new Promise((resolve) => {
      exec(`node ${script}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ ${script} failed:\n${stderr}`);
        } else {
          console.log(`✅ ${script} output:\n${stdout}`);
        }
        resolve();
      });
    });
  }

  console.log("\n✅ All scripts executed.");
})();
