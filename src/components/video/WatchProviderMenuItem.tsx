import { StreamingOption } from "streaming-availability";

export function WatchProviderMenuItem({
  link,
  service,
  videoLink,
}: StreamingOption) {
  const logo = service.imageSet.lightThemeImage;
  const linkTo = videoLink ?? link;

  if (!logo) {
    return null;
  }

  return (
    <button
      style={{
        border: "2px solid white",
        borderRadius: "8px",
      }}
    >
      <a
        href={linkTo}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img alt={service.name} src={logo} />
      </a>
    </button>
  );
}
