import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Aayush Ki Mehnat - Ultimate RTU Notes & Books for B.Tech Students",
  description = "Aayush Ki Mehnat: Download free RTU (Rajasthan Technical University) B.Tech notes, books, previous year question papers, and assignments. The ultimate study hub for RTU students.",
  keywords = "Aayush Ki Mehnat, RTU notes, RTU books, RTU previous year papers, RTU B.Tech study material, Rajasthan Technical University notes, B.Tech notes, engineering notes, RTU assignments, RTU syllabus, RTU results, RTU toppers notes",
  image = "https://aayushkimehnat.vercel.app/preview.png",
  url = "https://aayushkimehnat.vercel.app/",
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://aayushkimehnat.vercel.app/#website",
        "url": "https://aayushkimehnat.vercel.app/",
        "name": "Aayush Ki Mehnat",
        "description": "Ultimate RTU Notes & Books for B.Tech Students",
        "publisher": {
          "@id": "https://aayushkimehnat.vercel.app/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://aayushkimehnat.vercel.app/resources?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "en-US"
      },
      {
        "@type": "EducationalOrganization",
        "@id": "https://aayushkimehnat.vercel.app/#organization",
        "name": "Aayush Ki Mehnat",
        "url": "https://aayushkimehnat.vercel.app/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://aayushkimehnat.vercel.app/preview.png",
          "width": 1200,
          "height": 630
        },
        "description": description,
        "founder": {
          "@type": "Person",
          "name": "Aayush Sharma"
        },
        "sameAs": [
          "https://www.linkedin.com/in/aayush-sharma-a44062299"
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://aayushkimehnat.vercel.app/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://aayushkimehnat.vercel.app/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": title
          }
        ]
      }
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Aayush Sharma" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
