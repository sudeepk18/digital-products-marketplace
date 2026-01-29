const bcrypt = require('bcryptjs');

async function run() {
  const hash = await bcrypt.hash('your-secure-password', 10);
  console.log(hash);
}

run();
