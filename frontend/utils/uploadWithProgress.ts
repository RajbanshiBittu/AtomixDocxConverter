export function uploadWithProgress(endpoint: string, file: File, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          const contentType = xhr.getResponseHeader('Content-Type') || 'application/octet-stream';
          const blob = new Blob([xhr.response], { type: contentType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const cd = xhr.getResponseHeader('Content-Disposition') || '';
          const match = /filename="?(.*)"?/.exec(cd);
          a.download = match ? match[1] : `${file.name.split('.')[0]}.out`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          resolve();
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            reject(new Error(err.message || xhr.statusText));
          } catch {
            reject(new Error(xhr.statusText || 'Upload failed'));
          }
        }
      }
    };

    xhr.responseType = 'arraybuffer';
    const fd = new FormData();
    fd.append('file', file);
    xhr.send(fd);
  });
}
