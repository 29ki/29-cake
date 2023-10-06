/* eslint-disable */
/* tslint:disable */

export interface CollectionImage {
  description?: string;
  source?: string;
}

export interface CollectionCardColor {
  color: string;
}

export interface CollectionCard {
  description?: string;
  backgroundColorGradient?: CollectionCardColor[];
  textColor?: string;
}

export interface Collection {
  id: any;
  name: string;
  description?: string;
  link?: string;
  image?: CollectionImage;
  tags?: any[];
  sortOrder?: string;
  published: boolean;
  hidden?: boolean;
  exercises: any[];
  card?: CollectionCard;
}
