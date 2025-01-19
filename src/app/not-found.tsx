const NotFound = () => (
  <div
    style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
    }}
  >
    <h1
      style={{
        fontSize: '120px',
        fontWeight: 700,
        color: '#ea5f20',
        margin: 0,
      }}
    >
      404
    </h1>
    <p
      style={{
        fontSize: '24px',
        color: '#111',
        margin: 0,
      }}
    >
      페이지를 찾을 수 없습니다.
    </p>
  </div>
);

export default NotFound;
