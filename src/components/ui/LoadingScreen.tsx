export function LoadingScreen() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        userSelect: "none",
      }}
    >
      {/* Loading Spinner */}
      <div
        style={{
          width: "60px",
          height: "60px",
          border: "3px solid #333",
          borderTop: "3px solid #fff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "20px",
        }}
      />

      {/* Loading Text */}
      <h2
        style={{
          margin: 0,
          fontSize: "24px",
          fontWeight: "normal",
          marginBottom: "10px",
        }}
      >
        Loading Rewind Rental...
      </h2>

      {/* CSS Animation */}
      <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
    </div>
  );
}
