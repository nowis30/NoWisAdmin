import { existsSync } from 'node:fs';
import { assertDemoSeedAllowed } from '../lib/admin-config';

if (existsSync('.env')) process.loadEnvFile('.env');
assertDemoSeedAllowed();
