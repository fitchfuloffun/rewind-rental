import { StreamingOption } from "streaming-availability";
import { WatchProviderMenuItem } from "@/components/video/WatchProviderMenuItem.tsx";

export function WatchProvidersMenu({
  watchProviders,
}: {
  watchProviders: StreamingOption[];
}) {
  const hasStreamingType = (type: string) =>
    watchProviders.filter((provider) => provider.type === type).length > 0;

  return (
    <div style={{ marginBottom: "10px" }}>
      {hasStreamingType("subscription") && (
        <h2 style={{ margin: "0px" }}>Subscribe</h2>
      )}
      {watchProviders
        .filter((provider) => provider.type === "subscription")
        ?.map((provider) => (
          <WatchProviderMenuItem key={provider.service.id} {...provider} />
        ))}
      {hasStreamingType("buy") && <h2>Buy</h2>}
      {watchProviders
        .filter((provider) => provider.type === "buy")
        ?.map((provider) => (
          <WatchProviderMenuItem key={provider.service.id} {...provider} />
        ))}
    </div>
  );
}
