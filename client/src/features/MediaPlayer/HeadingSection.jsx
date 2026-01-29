import HeadingDetailsSection from '../../components/sections/HeadingDetails';

const HeadingSection = ({ media, className }) => {
  console.log('media', media)
  const name = media?.name || media?.title;

  return (
    <div className={`heading-container gap-1 flex flex-col ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold">{name ? name : 'N/A'}</h2>
      <HeadingDetailsSection media={media} className={className ? 'text-accent' : ''} />
    </div>
  );
};

export default HeadingSection;
