import {CmsField} from 'netlify-cms-core';
import {applyDefaults} from '../lib/fields';
import defaults from '../defaults/exercise.json';

import {COLORS} from '../../../shared/src/constants/colors';
import {
  CARD_FIELD,
  ID_FIELD,
  VIDEO_FIELD_WITH_AUDIO,
  NAME_FIELD,
  PUBLISHED_FIELD,
  VIDEO_FIELD,
  DURATION_FIELD,
  HIDDEN_FIELD,
  IMAGE_FIELD,
  DESCRIPTION_FIELD,
} from './common';
import {
  CONTENT_SLIDE,
  HOST_NOTES,
  HOST_SLIDE,
  REFLECTION_SLIDE,
  SHARING_SLIDE,
} from './slides';
import {CLOUDINARY_IMAGE_CONFIG} from './constants';

export const SOCIAL_MEDIA: CmsField = {
  label: '🔗 Social Media Meta Tags',
  name: 'socialMeta',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {
      label: '🪧 Title',
      name: 'title',
      hint: `Defaults to ${NAME_FIELD.label}`,
      widget: 'string',
      i18n: true,
      required: false,
    },
    {
      label: '📃 Description',
      name: 'description',
      widget: 'string',
      i18n: true,
      required: false,
    },
    {
      label: '🌅 Image',
      name: 'image',
      hint: `Defaults to ${CARD_FIELD.label} → ${IMAGE_FIELD.label}`,
      widget: 'image',
      required: false,
      i18n: true,
      allow_multiple: false,
      media_library: CLOUDINARY_IMAGE_CONFIG,
    },
  ],
};

export const INTRO_PORTAL: CmsField = {
  label: '🌇 Intro Portal',
  name: 'introPortal',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {...VIDEO_FIELD_WITH_AUDIO, label: '🎥 Video Loop', name: 'videoLoop'},
    {...VIDEO_FIELD, label: '🎥 Video End', name: 'videoEnd'},
    HOST_NOTES,
  ],
};

export const OUTRO_PORTAL: CmsField = {
  label: '🌃 Outro Portal',
  name: 'outroPortal',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [VIDEO_FIELD_WITH_AUDIO],
};

const THEME: CmsField = {
  label: '🎨 Theme',
  name: 'theme',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {
      label: '㊗️ Text Color',
      name: 'textColor',
      widget: 'select',
      multiple: false,
      i18n: true,
      default: COLORS.ACTION,
      options: [
        {label: 'Light', value: COLORS.WHITE},
        {label: 'Dark', value: COLORS.BLACK},
      ],
      required: false,
    },
    {
      label: '🔴 Background Color',
      name: 'backgroundColor',
      widget: 'color',
      i18n: true,
      required: false,
    },
  ],
};

export const SLIDES: CmsField = {
  label: '🖼️ Slides',
  label_singular: '🖼️ Slide',
  name: 'slides',
  widget: 'list',
  i18n: true,
  summary: '{{fields.content.heading}}',
  types: [CONTENT_SLIDE, REFLECTION_SLIDE, SHARING_SLIDE, HOST_SLIDE],
};

const EXERCISE_FIELDS: Array<CmsField> = applyDefaults(
  [
    ID_FIELD,
    NAME_FIELD,
    DESCRIPTION_FIELD,
    DURATION_FIELD,
    PUBLISHED_FIELD,
    HIDDEN_FIELD,
    SOCIAL_MEDIA,
    CARD_FIELD,
    THEME,
    INTRO_PORTAL,
    OUTRO_PORTAL,
    SLIDES,
  ],
  defaults,
);

export default EXERCISE_FIELDS;
