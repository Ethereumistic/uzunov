import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_IMAGE,
  DEFAULT_LOCALE,
} from "./site";

export function createMetaTags(opts: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  type?: string;
  locale?: string;
  noindex?: boolean;
  keywords?: string;
}) {
  const title = opts.title.includes(SITE_NAME)
    ? opts.title
    : `${opts.title} | ${SITE_NAME}`;
  const description = opts.description ?? "";
  const image = opts.image || DEFAULT_IMAGE;
  const type = opts.type || "website";
  const locale = opts.locale || DEFAULT_LOCALE;
  const canonical = SITE_URL ? `${SITE_URL}${opts.path}` : opts.path;

  const meta = [
    { title },
    { name: "description", content: description },
    ...(opts.keywords ? [{ name: "keywords", content: opts.keywords }] : []),
    ...(SITE_URL ? [{ property: "og:url", content: canonical }] : []),
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:locale", content: locale },
    ...(image
      ? [
          {
            property: "og:image",
            content: image.startsWith("http") ? image : `${SITE_URL}${image}`,
          },
        ]
      : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    ...(image
      ? [
          {
            name: "twitter:image",
            content: image.startsWith("http") ? image : `${SITE_URL}${image}`,
          },
        ]
      : []),
    ...(opts.noindex
      ? [{ name: "robots", content: "noindex, nofollow" }]
      : []),
  ];

  const links = [
    ...(SITE_URL ? [{ rel: "canonical", href: canonical }] : []),
  ];

  return { meta, links };
}
