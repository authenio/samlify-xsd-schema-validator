import * as validator from '@authenio/xsd-schema-validator';
import * as fs from 'fs';
import * as path from 'path';

const xsd = 'saml-schema-protocol-2.0.xsd';

const setSchemaDir = (v: any) => {
  let schemaDir;
  try {
    schemaDir = path.resolve(__dirname, './schemas');
    fs.accessSync(schemaDir, fs.constants.F_OK);
  } catch (err) {
    // for built-from git folder layout
    try {
      schemaDir = path.resolve(__dirname, '../schemas');
      fs.accessSync(schemaDir, fs.constants.F_OK);
    } catch (err) {
      //console.warn('Unable to specify schema directory', err);
      // QUESTION should this be swallowed?
      console.error(err);
      throw new Error('ERR_FAILED_FETCH_SCHEMA_FILE');
    }
  }
  v.cwd = schemaDir;
  v.debug = process.env.NODE_ENV === 'test';
  return v;
};

const mod = setSchemaDir(new validator());

export const validate = (xml: string) => {
  return new Promise((resolve, reject) => {
    mod.validateXML(xml, xsd, (err, result) => {
      if (err) {
        console.error('[ERROR] validateXML', err);
        return reject('ERR_EXCEPTION_VALIDATE_XML');
      }
      if (result.valid) {
        return resolve('SUCCESS_VALIDATE_XML');
      }
      return reject('ERR_INVALID_XML');
    });
  });
};