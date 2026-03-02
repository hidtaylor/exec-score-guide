import { useEffect, useState } from "react";
import QRCodeLib from "qrcode";

interface QRCodeProps {
  url: string;
  size?: number;
  className?: string;
}

export default function QRCode({ url, size = 140, className = "" }: QRCodeProps) {
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    QRCodeLib.toString(url, {
      type: "svg",
      width: size,
      margin: 1,
      color: { dark: "#1c2432", light: "#ffffff" },
    }).then(setSvg).catch(console.error);
  }, [url, size]);

  if (!svg) return null;

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
