// Reads the one file in a multipart/form-data upload (the recording sent by
// the app). `body` is the raw request as a Buffer.
// Returns { buffer, filename, type } or null.
export function fileFromMultipart(body, contentType, field = 'file') {
  const boundary = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType ?? '');
  if (!boundary || !Buffer.isBuffer(body)) return null;
  const marker = Buffer.from(`--${boundary[1] ?? boundary[2]}`);
  let start = body.indexOf(marker);
  while (start !== -1) {
    const next = body.indexOf(marker, start + marker.length);
    if (next === -1) break;
    const part = body.subarray(start + marker.length, next);
    const split = part.indexOf('\r\n\r\n');
    if (split !== -1) {
      const head = part.subarray(0, split).toString('utf8');
      if (new RegExp(`name="${field}"`, 'i').test(head)) {
        const filename = /filename="([^"]*)"/i.exec(head)?.[1] || 'speech.m4a';
        const type = /content-type:\s*([^\r\n]+)/i.exec(head)?.[1]?.trim() || 'audio/m4a';
        let content = part.subarray(split + 4);
        if (content.subarray(-2).toString() === '\r\n') content = content.subarray(0, -2);
        return { buffer: content, filename, type };
      }
    }
    start = next;
  }
  return null;
}
