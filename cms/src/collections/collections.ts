import {CmsCollection} from 'netlify-cms-core';
import EXERCISE_FIELDS from '../fields/exercise';
import CONTRIBUTORS_FIELDS from '../fields/contributors';
import * as content from '../../../content/content.json';
import {generateFilesCollectionFromi18nFiles} from '../lib/i18n';
import EXERCISE_DEFAULTS_FIELDS from '../fields/defaults';

export const exercises: CmsCollection = {
  name: 'exercises',
  label: '📝 Exercises',
  label_singular: 'exercise',
  folder: '/content/src/exercises',
  identifier_field: 'id',
  extension: 'json',
  format: 'json',
  create: true,
  delete: true,
  publish: true,
  summary: '{{fields.name}}',
  slug: '{{id}}',
  editor: {
    preview: false,
  },
  fields: EXERCISE_FIELDS,
  i18n: true,
};

export const settings: CmsCollection = {
  name: 'settings',
  label: '⚙️ Settings',
  files: [
    {
      label: '📝 Exercise defaults',
      name: 'exercise-defaults',
      file: '/cms/src/defaults/exercise.json',
      fields: EXERCISE_DEFAULTS_FIELDS,
    },
  ],
  i18n: false,
  extension: 'json',
  format: 'json',
  create: false,
  delete: false,
  publish: true,
  identifier_field: 'label',
  editor: {
    preview: false,
  },
};

export const other: CmsCollection = {
  name: 'other',
  label: '🪴 Other',
  files: [
    {
      label: '👥 All Contributors',
      name: 'all-contributorsrc',
      file: '/.all-contributorsrc',
      fields: CONTRIBUTORS_FIELDS,
    },
  ],
  i18n: false,
  extension: 'json',
  format: 'json',
  create: false,
  delete: false,
  publish: true,
  identifier_field: 'label',
  editor: {
    preview: false,
  },
};

export const ui: CmsCollection = generateFilesCollectionFromi18nFiles(
  'ui',
  '📱 UI',
  content.i18n,
  [exercises.name],
);
