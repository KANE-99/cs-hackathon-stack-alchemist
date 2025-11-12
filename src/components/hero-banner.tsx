import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { BannerProps } from "../typescript/banner";
import { getImageStyles, getImageURL } from "../utils/ImageTransformations";
import { decodeMetadataFromString } from "../utils/metadataEncoder";

export default function HeroBanner(props: BannerProps) {
  console.log(props, 'props')
  const banner = props.hero_banner;

  
  let bannerImageCustom = null;
  if (banner.banner_image_custom) {
    const bannerImgOptions =
      banner.banner_image_custom?.metadata?.preset?.options;
    bannerImageCustom = {
      cslp: banner.$.banner_image_custom as {},
      src: getImageURL(banner.banner_image_custom.asset.url, bannerImgOptions),
      alt: banner.banner_image_custom.asset.filename,
      styles: getImageStyles(bannerImgOptions),
    };
  }
  
  

  return (
    <div
      className="hero-banner"
      style={{
        background: banner.bg_color ? decodeMetadataFromString(banner.bg_color).cleanValue : "",
      }}
      data-testid="hero-banner"
    >
      <div
        className="home-content"
        style={{ color: banner.text_color ? banner.text_color : "#222" }}
        {...(banner?.$?.text_color as {})}
        data-testid="home-content"
      >
        <h1
          {...(banner?.$?.banner_title as {})}
          className="hero-title"
          data-testid="banner-title"
        >
          {banner.banner_title || <Skeleton />}
        </h1>

        {banner.banner_description ? (
          Array.isArray(banner.banner_description) ? (
            <div
              {...((banner.$ as any)?.banner_description as {})}
              data-testid="banner-description-container"
            >
              {banner.banner_description.map((description, index) => (
                <p
                  key={`banner-description-${index}`}
                  {...((banner.$ as any)?.[
                    `banner_description__${index}`
                  ] as {})}
                  className="hero-description multiline-field"
                  style={{
                    color: banner.text_color || "#737b7d",
                  }}
                  data-testid={`banner-description-${index}`}
                >
                  {description}
                </p>
              ))}
            </div>
          ) : (
            <p
              {...((banner.$ as any)?.banner_description as {})}
              className="hero-description multiline-field"
              style={{
                color: banner.text_color || "#737b7d",
              }}
              data-testid="banner-description"
            >
              {banner.banner_description}
            </p>
          )
        ) : (
          ""
        )}
        {banner.call_to_action.title && banner.call_to_action.href ? (
          <Link
            {...banner.call_to_action?.$?.title}
            to={banner.call_to_action.href}
            className="btn tertiary-btn"
            data-testid="call-to-action"
          >
            {banner.call_to_action.title}
          </Link>
        ) : (
          ""
        )}
      </div>

      {bannerImageCustom ? (
        <img
          {...(bannerImageCustom.cslp as {})}
          alt={bannerImageCustom.alt}
          src={bannerImageCustom.src}
          style={bannerImageCustom.styles}
          data-testid="banner-image-custom"
        />
      ) : null}
      {banner.banner_image && !bannerImageCustom ? (
        Array.isArray(banner.banner_image) ? (
          <div
            {...((banner.$ as any)?.banner_image as {})}
            data-testid="banner-image-container"
          >
            {banner.banner_image.map((image, index) => (
              <img
                key={`banner-image-${index}`}
                // {...((banner.$ as any)?.[`banner_image__${index}`] as {})}
                data-cslp={decodeMetadataFromString(image.url).metadata?.cslp}
                alt={image.filename}
                src={image.url}
                data-testid={`banner-image-${index}`}
              />
            ))}
          </div>
        ) : (
          <img
            {...(banner.banner_image?.$?.url as {})}
            alt={banner.banner_image.filename}
            src={banner.banner_image.url}
            data-cslp={decodeMetadataFromString(banner.banner_image.url).metadata?.cslp}
            data-testid="banner-image"
          />
        )
      ) : (
        ""
      )}
    </div>
  );
}
