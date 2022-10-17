import * as fs from 'fs';
import * as process from 'child_process';
import {createNetlifyTypes} from 'netlify-ts';
import {Collection} from 'netlify-ts/lib/types';
import {exercises, contributors, files} from './src/collections/collections';

const OUTPUT_PATH = '../shared/src/types/generated';

const clean = (input: string) => input.replaceAll(/_|-|\./g, '');

const createTypeFile = (collection: Collection) => {
  const fileName = collection.label_singular
    ? collection.label_singular.replace(/^[a-z]/g, v => v.toUpperCase())
    : collection.label;
  const path = `${OUTPUT_PATH}/${fileName}.ts`;
  const types = createNetlifyTypes(
    {
      collections: [collection] as unknown as Array<Collection>,
    },
    {label: true, capitalize: true, delimiter: ''},
  );

  fs.writeFileSync(path, clean(types));
  process.exec(`yarn prettier --write ${path}`);
};

const main = () => {
  ([exercises, contributors, files] as unknown as Array<Collection>).forEach(
    createTypeFile,
  );
};

main();
