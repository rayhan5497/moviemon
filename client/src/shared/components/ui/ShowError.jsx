const TYPE_LABELS = {
  movie: 'Movie',
  tv: 'TV Show',
  person: 'Person',
};

const ShowError = ({ message, code, type }) => {
  console.warn('type', type, 'code', code, 'message', message)
  const getTypeLabel = (type) => TYPE_LABELS[type] ?? 'Item';

  const label = getTypeLabel(type);

  return (
    <div className="flex items-center justify-center self-center gap-2 m-auto p-2 text-primary bg-accent-secondary rounded relative w-full h-auto">
      {code === 34 ? (
        <>
          <>
            No data is available associated with this <strong>{label} !</strong>
          </>
        </>
      ) : (
        message
      )}
    </div>
  );
};

export default ShowError;
