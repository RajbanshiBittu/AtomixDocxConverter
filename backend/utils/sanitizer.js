export function sanitizeFilename(filename) {
  // Remove path components
  const basename = filename.replace(/^.*[\\/]/, '');
  
  // Remove special characters
  const sanitized = basename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
  
  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.split('.').pop();
    const name = sanitized.substring(0, 255 - ext.length - 1);
    return `${name}.${ext}`;
  }
  
  return sanitized;
}

export function validateFileExtension(filename, allowedExtensions) {
  const ext = filename.split('.').pop()?.toLowerCase();
  return allowedExtensions.includes(ext);
}