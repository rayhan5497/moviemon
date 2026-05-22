export function setMeta(name, content, type = 'name', tagName = 'meta') {
  if (!content) return;

  const selector = `${tagName}[${type}='${name}']`;
  let tag = document.querySelector(selector);

  if (!tag) {
    tag = document.createElement(tagName);
    tag.setAttribute(type, name);
    document.head.appendChild(tag);
  }

  const attribute = tagName === 'link' ? 'href' : 'content';
  tag.setAttribute(attribute, content);
}
