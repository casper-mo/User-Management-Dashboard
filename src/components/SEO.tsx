interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SEO({
  title,
  description = "User management dashboard for managing users, roles, and permissions",
  image = "/images/og-image.jpg",
  url = window.location.href,
}: SEOProps) {
  const fullTitle = `${title} | User Management System`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </>
  );
}
