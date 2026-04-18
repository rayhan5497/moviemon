export default function AdminPanel({ as: Tag = 'section', className = '', children }) {
  return (
    <Tag
      className={`bg-primary border border-accent-secondary rounded-2xl shadow-md shadow-accent ${className}`}
    >
      {children}
    </Tag>
  );
}
