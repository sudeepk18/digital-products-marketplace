#!/usr/bin/env node

/**
 * Script to create an admin user
 * Usage: node scripts/create-admin.js
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createAdmin() {
  console.log('\n🔐 Create Admin User\n');
  console.log('This script will generate the SQL to create an admin user.\n');

  try {
    const email = await question('Admin email: ');
    const name = await question('Admin name: ');
    const password = await question('Password (min 8 characters): ');

    if (password.length < 8) {
      console.error('\n❌ Password must be at least 8 characters long');
      rl.close();
      return;
    }

    console.log('\n⏳ Generating password hash...');
    const hash = await bcrypt.hash(password, 10);

    console.log('\n✅ Success! Run this SQL in your database:\n');
    console.log('```sql');
    console.log(`INSERT INTO admin_users (email, password_hash, name)`);
    console.log(`VALUES ('${email}', '${hash}', '${name}');`);
    console.log('```\n');

    console.log('💡 Keep your credentials safe!\n');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }

  rl.close();
}

createAdmin();