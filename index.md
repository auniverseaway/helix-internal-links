<!--
  ~ Licensed to the Apache Software Foundation (ASF) under one or more
  ~ contributor license agreements.  See the NOTICE file distributed with
  ~ this work for additional information regarding copyright ownership.
  ~ The ASF licenses this file to You under the Apache License, Version 2.0
  ~ (the "License"); you may not use this file except in compliance with
  ~ the License.  You may obtain a copy of the License at
  ~
  ~      http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  -->
![helix-logo](./helix_logo.png)

# Helix - Admin Console

This site highlights several concepts working together on Helix.

## [TRY IT OUT](/admin.html)

## User Features
* Use the admin console to easily traverse complex content trees.
* Use the admin console to edit the content (no save support).
* Use the admin console to view the content.

## Nerd Features
* A server-side proxy pattern to:
  * Eliminate local CORs issues
  * Sanitize un-wanted code or content (src, .gitignore, etc.)
  * Aleviate redundant direct GitHub API calls
  * Cache query paramed responses (probably?)
  * Inteligently build full URLs of content.
  * Leverage Helix's new `git-server` feature for [GitHub's Tree API](https://developer.github.com/v3/git/trees/).
* A Single page application (SPA) built with:
  * React
  * Spectrum
  * Parcel
  * Babel
* Leverage query params for passing data from client to server.
  * Query Param Support - New Helix Simulator December 2018 feature
  * Query Param whitelist - `helix-config.yaml`