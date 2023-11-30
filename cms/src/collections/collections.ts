import {CmsCollection} from 'netlify-cms-core';
import EXERCISE_FIELDS from '../fields/exercise';
import CONTRIBUTORS_FIELDS from '../fields/contributors';
import * as content from '../../../content/content.json';
import {generateFilesCollectionFromi18nFiles} from '../lib/i18n';
import EXERCISE_DEFAULTS_FIELDS from '../fields/defaults';
import {TAG_FIELDS} from '../fields/tag';
import {COLLECTION_FIELDS} from '../fields/collection';
import {DEFAULT_LANGUAGE_TAG} from '../../../shared/src/constants/i18n';
import EDITOR_TEXT_TEMPLATES_FIELDS from '../fields/templates';
import {CATEGORY_FIELD} from '../fields/category';

export const exercises: CmsCollection = {
  name: 'exercises',
  label: '📝 Exercises',
  label_singular: 'Exercise',
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
    {
      label: '🔖 Editor text templates',
      name: 'text-templates',
      file: '/cms/src/templates/editorTexts.json',
      fields: EDITOR_TEXT_TEMPLATES_FIELDS,
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

export const tags: CmsCollection = {
  name: 'tags',
  label: '🏷 Tags',
  label_singular: 'Tag',
  folder: '/content/src/tags',
  identifier_field: 'id',
  fields: TAG_FIELDS,
  slug: '{{id}}',
  summary: '{{fields.tag}}',
  extension: 'json',
  create: true,
  format: 'json',
  delete: true,
  publish: true,
  i18n: true,
  editor: {
    preview: false,
  },
};

export const categories: CmsCollection = {
  name: 'categories',
  label: '🗃️ Categories',
  label_singular: 'Category',
  folder: '/content/src/categories',
  identifier_field: 'id',
  fields: CATEGORY_FIELD,
  slug: '{{id}}',
  summary: '{{fields.name}}',
  extension: 'json',
  create: true,
  format: 'json',
  delete: true,
  publish: true,
  i18n: true,
  editor: {
    preview: false,
  },
};

export const collections: CmsCollection = {
  name: 'collections',
  label: '📦 Collections',
  label_singular: 'Collection',
  folder: '/content/src/collections',
  identifier_field: 'id',
  fields: COLLECTION_FIELDS,
  slug: '{{id}}',
  summary: '{{fields.name}}',
  extension: 'json',
  create: true,
  format: 'json',
  delete: true,
  publish: true,
  i18n: true,
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

export const email: CmsCollection = generateFilesCollectionFromi18nFiles(
  'email',
  '💌 Email',
  content.i18n[DEFAULT_LANGUAGE_TAG].email,
  [],
);

export const ui: CmsCollection = generateFilesCollectionFromi18nFiles(
  'ui',
  '📱 UI',
  content.i18n[DEFAULT_LANGUAGE_TAG],
  [exercises.name, tags.name, collections.name, email.name],
);
