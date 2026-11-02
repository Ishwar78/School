import React, { useState } from "react";
import { GraduationCap } from "lucide-react";

import "./LocalImage.css";

export default function LocalImage({
  src,
  alt,
  className = "",
  loading = "lazy",
  ...imageProps
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`local-image ${className}`.trim()}>
      {failed ? (
        <div className="local-image-fallback" role="img" aria-label={alt}>
          <GraduationCap size={31} strokeWidth={1.4} aria-hidden="true" />
          <span>VEDA INTERNATIONAL SCHOOL</span>
          <small>School photograph unavailable</small>
        </div>
      ) : (
        <img
          {...imageProps}
          src={src}
          alt={alt}
          loading={loading}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
