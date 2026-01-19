export async function uploadAndDownloadFile(endpoint: string, file: File) {
    const form = new FormData();
    form.append('file', file);

    const res = await fetch(endpoint, {
        method: 'POST',
        body: form,
    });

    if (!res.ok) {
        // Try to extract JSON error message; fallback to status text
        try {
            const err = await res.json();
            throw new Error(err?.message || err?.error?.message || res.statusText);
        } catch {
            throw new Error(res.statusText || 'Conversion failed');
        }
    }

    // Successful -> receive binary file
    const blob = await res.blob();
    const contentDisposition = res.headers.get('content-disposition') || '';
    // derive filename if backend sets header, else fallback
    const filenameMatch = /filename="?(.*)"?/.exec(contentDisposition);
    const filename = filenameMatch ? filenameMatch[1] : `${file.name.split('.')[0]}.out`;

    // trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}