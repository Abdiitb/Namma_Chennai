import bcrypt from 'bcrypt';

async function generateHashes() {
  const passwords = ['admin123', 'super123', 'staff123', 'citizen123'];
  
  for (const password of passwords) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`${password}: ${hash}`);
  }
}

generateHashes();