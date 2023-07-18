import fallbackimg from '/404.webp';

const NotFound = () => {
  return (
    <div
      style={{
        flex: '1',
      }}
    >
      <img
        style={{
          width: '50%',
          position: 'fixed',
          top: '50%',
          left: '50%',
          translate: '-50% -50%',
        }}
        src={fallbackimg}
        alt='404 page not found'
      />
    </div>
  );
};

export default NotFound;
