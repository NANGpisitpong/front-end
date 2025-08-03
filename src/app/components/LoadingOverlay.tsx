export default function LoadingOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9999,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
      }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">กำลังโหลด...</span>
      </div>
    </div>
  );
}
