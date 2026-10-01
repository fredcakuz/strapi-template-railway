import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksArticleMap extends Struct.ComponentSchema {
  collectionName: 'components_blocks_article_maps';
  info: {
    description: 'Mappa con i pin degli articoli geolocalizzati, filtrabile per categoria. Senza regione/citt\u00E0 mostra tutto.';
    displayName: 'Article Map';
  };
  attributes: {
    city: Schema.Attribute.Relation<'oneToOne', 'api::city.city'>;
    region: Schema.Attribute.Relation<'oneToOne', 'api::region.region'>;
  };
}

export interface BlocksCol extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cols';
  info: {
    displayName: 'col';
    icon: 'collapse';
  };
  attributes: {
    ctaLabel: Schema.Attribute.String;
    ctaLink: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksContainer extends Struct.ComponentSchema {
  collectionName: 'components_blocks_containers';
  info: {
    displayName: 'container';
  };
  attributes: {
    col: Schema.Attribute.Component<'blocks.col', true>;
    NumCols: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<2>;
  };
}

export interface BlocksCta extends Struct.ComponentSchema {
  collectionName: 'components_blocks_ctas';
  info: {
    displayName: 'cta';
  };
  attributes: {
    button_label: Schema.Attribute.String;
    button_url: Schema.Attribute.String;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface BlocksEmbed extends Struct.ComponentSchema {
  collectionName: 'components_blocks_embeds';
  info: {
    displayName: 'embed';
    icon: 'code';
  };
  attributes: {
    code: Schema.Attribute.Text;
  };
}

export interface BlocksGallery extends Struct.ComponentSchema {
  collectionName: 'components_blocks_galleries';
  info: {
    displayName: 'gallery';
    icon: 'apps';
  };
  attributes: {
    media: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
  };
}

export interface BlocksImage extends Struct.ComponentSchema {
  collectionName: 'components_blocks_images';
  info: {
    displayName: 'image';
    icon: 'picture';
  };
  attributes: {
    media: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface BlocksQuote extends Struct.ComponentSchema {
  collectionName: 'components_blocks_quotes';
  info: {
    displayName: 'quote';
  };
  attributes: {
    quote_author: Schema.Attribute.String;
    quote_text: Schema.Attribute.Text;
  };
}

export interface BlocksRichText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rich_texts';
  info: {
    displayName: 'rich_text';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
  };
}

export interface SharedContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_infos';
  info: {
    displayName: 'Contact Info';
  };
  attributes: {
    Address: Schema.Attribute.String;
    Description: Schema.Attribute.Blocks;
    email: Schema.Attribute.Email;
    lat: Schema.Attribute.String;
    lng: Schema.Attribute.String;
    Name: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    PriceRange1: Schema.Attribute.Integer;
    PriceRange2: Schema.Attribute.Integer;
    website: Schema.Attribute.String;
  };
}

export interface SharedFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_columns';
  info: {
    displayName: 'Footer Column';
  };
  attributes: {
    links: Schema.Attribute.Component<'shared.link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedGallery extends Struct.ComponentSchema {
  collectionName: 'components_shared_galleries';
  info: {
    displayName: 'gallery';
    icon: 'apps';
  };
  attributes: {};
}

export interface SharedIconLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_icon_links';
  info: {
    displayName: 'Icon Link';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<
      ['map', 'star', 'info', 'phone', 'tag', 'pin']
    > &
      Schema.Attribute.DefaultTo<'map'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMapLocation extends Struct.ComponentSchema {
  collectionName: 'components_shared_map_locations';
  info: {
    displayName: 'Map Location';
  };
  attributes: {
    address: Schema.Attribute.String;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String;
    shareImage: Schema.Attribute.Media;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.article-map': BlocksArticleMap;
      'blocks.col': BlocksCol;
      'blocks.container': BlocksContainer;
      'blocks.cta': BlocksCta;
      'blocks.embed': BlocksEmbed;
      'blocks.gallery': BlocksGallery;
      'blocks.image': BlocksImage;
      'blocks.quote': BlocksQuote;
      'blocks.rich_text': BlocksRichText;
      'shared.contact_info': SharedContactInfo;
      'shared.footer-column': SharedFooterColumn;
      'shared.gallery': SharedGallery;
      'shared.icon-link': SharedIconLink;
      'shared.link': SharedLink;
      'shared.map_location': SharedMapLocation;
      'shared.seo': SharedSeo;
    }
  }
}
