export function setMeta(name, content, type = 'name') {
  if (!content) return;

  let tag = document.querySelector(`meta[${type}='${name}']`);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(type, name);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}