import { MovieResult } from "moviedb-promise";
import { getImageUrl } from "@/utils/image.ts";

type VideoMenuProps = {
  movie: MovieResult;
  onClose: () => void;
};

// Full-screen video menu component
export function VideoMenu({ movie, onClose }: VideoMenuProps) {
  if (!movie) return null;
  const cover = getImageUrl(movie.poster_path, "poster", "medium");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent dark overlay
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        pointerEvents: "auto", // Allow mouse interaction with menu
      }}
    >
      {/* Menu card */}
      <div
        style={{
          backgroundColor: "rgba(26, 76, 150, 0.95)", // Blockbuster blue with transparency
          border: "3px solid #ffcd3c",
          borderRadius: "15px",
          padding: "30px",
          maxWidth: "400px",
          textAlign: "center",
          color: "white",
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Movie cover placeholder */}
        <div
          style={{
            width: "150px",
            height: "225px",
            backgroundColor: "#333",
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
          }}
        >
          {cover ? <img src={cover} width="150px" /> : "Poster not found"}
        </div>

        {/* Movie title */}
        <h2
          style={{
            margin: "0 0 15px 0",
            fontSize: "1.8rem",
            color: "#ffcd3c",
          }}
        >
          {movie.title}
        </h2>

        {/* Movie details */}
        {/*<p style={{ margin: "0 0 25px 0", fontSize: "1.1rem" }}>*/}
        {/*  Rental Price: ${movie.price}*/}
        {/*</p>*/}
        <p style={{ margin: "0 0 25px 0", fontSize: "0.9rem", opacity: 0.8 }}>
          {movie.overview}
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button
            style={{
              padding: "12px 25px",
              fontSize: "1rem",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => {
              console.log("Rented:", movie.title);
              onClose();
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#45a049")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#4CAF50")
            }
          >
            Rent Now
          </button>

          <button
            style={{
              padding: "12px 25px",
              fontSize: "1rem",
              backgroundColor: "transparent",
              color: "white",
              border: "2px solid white",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={onClose}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Click outside to close */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
        onClick={onClose}
      />
    </div>
  );
}
