export function buildMailtoHref(to: string, subject: string, body: string): string {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${encodeURIComponent(to)}?subject=${encodedSubject}&body=${encodedBody}`;
}
