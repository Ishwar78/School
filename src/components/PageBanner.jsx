import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, GraduationCap, MapPin } from "lucide-react";

import LocalImage from "./LocalImage";
import "./PageBanner.css";

export function PageBannerTags({ label, caption, breadcrumb }) {
  return (
    <>
      <div className="page-banner-tag page-banner-tag-school">
        <GraduationCap size={17} aria-hidden="true" />
        <strong>VEDA INTERNATIONAL SCHOOL</strong>
      </div>

      <div className="page-banner-tag page-banner-tag-location">
        <MapPin size={15} aria-hidden="true" />
        <span>THURANA (HANSI)</span>
      </div>

      {/* <div className="page-banner-tag page-banner-tag-caption">
        <small>{label}</small>
        <strong>{caption}</strong>
      </div> */}

      {breadcrumb?.length > 0 && (
        <nav className="page-banner-tag page-banner-breadcrumb" aria-label="Breadcrumb">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={`${item.label}-${index}`}>
              {index > 0 && (
                <ChevronRight size={13} aria-hidden="true" />
              )}
              {item.to ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span aria-current={index === breadcrumb.length - 1 ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
    </>
  );
}

export default function PageBanner({
  image,
  alt,
  label,
  caption,
  breadcrumb
}) {
  return (
    <section className="page-banner" aria-label={caption || label || alt}>
      <LocalImage
        src={image}
        alt={alt}
        className="page-banner-photo"
        loading="eager"
      />
      <PageBannerTags
        label={label}
        caption={caption}
        breadcrumb={breadcrumb}
      />
    </section>
  );
}
