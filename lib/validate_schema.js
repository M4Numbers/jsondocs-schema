/*
 * MIT License
 *
 * Copyright (c) 2019 M4Numbers <m4numbers@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const Ajv = require('ajv');
const SCHEMA = require('./schema_versions');

const generateValidator = () => {
  if (ValidateSchema.schemaHandler === undefined) {
    ValidateSchema.schemaHandler = new ValidateSchema();
  }
  return ValidateSchema.schemaHandler;
};

class ValidateSchema {
  constructor() {
    this.ajv = new Ajv();
    Object.values(SCHEMA).forEach(schemaVersion => {
      console.log(this.ajv.getSchema(schemaVersion));
      if (this.ajv.getSchema(schemaVersion) === undefined) {
        this.ajv.addSchema(require(`../schema/jsondocs.schema.${schemaVersion}.json`), schemaVersion);
      }
    });
  }

  getSchema(schemaVersion=SCHEMA.LATEST) {
    return this.ajv.getSchema(schemaVersion);
  }

  validateSchema(jsonToValidate, schemaVersion=SCHEMA.LATEST) {
    return this.ajv.validate(schemaVersion, jsonToValidate)
      ? {
        success: true
      }
      : {
        success: false,
        errors: this.ajv.errors
      };
  }
}

ValidateSchema.schemaHandler = undefined;

module.exports = generateValidator;
