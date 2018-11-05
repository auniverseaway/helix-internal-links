/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const fs = require('fs');
const path = require('path');

const CONTENT_NAME = 'content';
const CONTENT_PATH = `../../${CONTENT_NAME}`;
const MARKDOWN_EXTENSION = '.md';
const HTML_EXTENSION = '.html';

const isMarkdown = (fileName) => {
  const lastThree = fileName.substr(fileName.length - 3);
  return lastThree === MARKDOWN_EXTENSION;
};

const getNavItem = (item) => {
  return {
    name: item.replace(MARKDOWN_EXTENSION, ''),
    path: `/${CONTENT_NAME}/${item.replace(MARKDOWN_EXTENSION, HTML_EXTENSION)}` };
}

const getNav = () => {
  const contentPath = path.join(__dirname, CONTENT_PATH);
  return fs.readdirSync(contentPath).reduce((filtered, item) => {
    if (isMarkdown(item)) {
      filtered.push(getNavItem(item));
    }
    return filtered;
  }, []);
}

/**
 * The 'pre' function that is executed before the HTML is rendered
 * @param payload The current payload of processing pipeline
 * @param payload.content The content
 */
function pre(payload) {
  payload.content.nav = getNav();
  payload.content.time = `${new Date()}`;
}

module.exports.pre = pre;
