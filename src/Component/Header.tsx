import { Link } from "react-router-dom";
import GlitchText from "./reactbits/GlitchText";

function Header() {
  const items = [
    { label: "Calc", to: "/", color: "#3b82f6" },
    { label: "Game", to: "/game", color: "#8b5cf6" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        padding: "1.5rem 2rem",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div>
        <GlitchText
          speed={2}
          enableShadows
          enableOnHover={false}
          className="custom-class"
        >
          광주컴퓨터 정보보안
        </GlitchText>
      </div>
      <nav style={{ display: "flex", gap: "1rem" }}>
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            style={{
              padding: "0.5rem 1.5rem",
              backgroundColor: item.color,
              color: "white",
              borderRadius: "9999px",
              textDecoration: "none",
              fontWeight: "500",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Header;
