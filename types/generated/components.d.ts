import type { Schema, Struct } from '@strapi/strapi';

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
    email: Schema.Attribute.Email;
    phone: Schema.Attribute.String;
    website: Schema.Attribute.String;
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
      'blocks.col': BlocksCol;
      'blocks.container': BlocksContainer;
      'blocks.cta': BlocksCta;
      'blocks.embed': BlocksEmbed;
      'blocks.gallery': BlocksGallery;
      'blocks.image': BlocksImage;
      'blocks.quote': BlocksQuote;
      'blocks.rich_text': BlocksRichText;
      'shared.contact_info': SharedContactInfo;
      'shared.gallery': SharedGallery;
      'shared.map_location': SharedMapLocation;
      'shared.seo': SharedSeo;
    }
  }
}
