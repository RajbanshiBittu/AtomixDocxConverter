import { spawn } from 'child_process';
import { libreOfficeConfig } from '../config/libreOffice.config.js';

const checkLibreOffice = async() => {
  return new Promise((resolve) => {
    const process = spawn(libreOfficeConfig.binary, ['--version']);
    
    let output = '';
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.on('close', (code) => {
      if (code === 0 && output.includes('LibreOffice')) {
        resolve({ available: true, version: output.trim() });
      } else {
        resolve({ available: false, error: 'LibreOffice not found' });
      }
    });
    
    process.on('error', () => {
      resolve({ available: false, error: 'LibreOffice not installed' });
    });
  });
}

export default checkLibreOffice;