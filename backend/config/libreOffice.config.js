export const libreOfficeConfig = {
  binary: process.env.LIBREOFFICE_BINARY || "soffice",
  baseArgs: [
    "--headless",
    "--nologo",
    "--nofirststartwizard",
    "--nodefault",
    "--norestore"
  ],
  timeoutMs: parseInt(process.env.LIBREOFFICE_TIMEOUT) || 30000
};
