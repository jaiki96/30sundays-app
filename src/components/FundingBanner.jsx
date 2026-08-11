const PAD = 18;

// The funding announcement, above the hero. One artwork, so the copy lives in
// the image itself.
export default function FundingBanner() {
  return (
    <div style={{ padding: `4px ${PAD}px 14px` }}>
      <img
        src="/funding-banner.jpg"
        alt="Big news. We've raised $6.7M."
        style={{
          display: "block",
          width: "100%",
          aspectRatio: "1020 / 360",
          objectFit: "cover",
          borderRadius: 16,
          boxShadow: "0 6px 18px rgba(24,29,39,0.14)",
        }}
      />
    </div>
  );
}
