import React, { Component } from 'react';
import Provider from '@react/react-spectrum/Provider';
import Button from '@react/react-spectrum/Button';
import Edit from '@react/react-spectrum/Icon/Edit';
import Preview from '@react/react-spectrum/Icon/Preview';
import ButtonGroup from '@react/react-spectrum/ButtonGroup';
import { ColumnView, ColumnViewDataSource } from '@react/react-spectrum/ColumnView';
import unescapeJs from 'unescape-js';

const MARKDOWN_EXTENSION = '.md';
const HTML_EXTENSION = '.html';

function getHostName() {
  const admin = document.getElementById('admin');
  if (admin) {
    return admin.dataset.hostName;
  }
  return null;
}

const isMarkdown = (fileName) => {
  return fileName.endsWith(MARKDOWN_EXTENSION);
};

function getFetchUrl(type, item) {
  const hostName = getHostName();
  const fetchUrl = new URL(`${hostName}/index.${type}.json`);
  if (type === 'tree') {
    fetchUrl.searchParams.append('targetUrl', item.targetUrl);
  }
  if (item.sha) {
    fetchUrl.searchParams.append('sha', item.sha);
  }
  return fetchUrl;
}

class HelixDS extends ColumnViewDataSource {
  async getChildren(item) {
    if (!item) {
      console.log('no item');
      return this.getTree({ sha: '', targetUrl: '/' });
    }
    if (item.children) {
      console.log(item);
      return this.getTree(item);
    }
    return item.children;
  }

  hasChildren(item) {
    return !!item.children;
  }

  isItemEqual(a, b) {
    return a.label === b.label;
  }

  async getTree(item) {
    const data = await (await (
        fetch(getFetchUrl('tree', item)).then(res => {
          return res.json();
        }).catch(err => {
          console.log('Error: ', err);
        })
    ));
    return data;
  }
}

function renderItem(item) {
  return item.label;
}

function sanitizeMarkdown(str) {
  let content = str.substring(1);
  content = content.substring(0, content.length - 1);
  return unescapeJs(content);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { dataSource: new HelixDS() };
    this.change  = this.change.bind(this);
    this.selectionChange  = this.selectionChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  selectionChange(items) {
    this.setState({selectedItems: items});
  }

  async change(buttonValue) {
    if (buttonValue === 'edit') {
      const item = this.state.selectedItems[0];
      const content = await this.getLeafContent(item);
      this.setState({ editorValue: sanitizeMarkdown(content) });
    }
    if (buttonValue === 'view') {
      const hostName = getHostName();
      const { targetUrl } = this.state.selectedItems[0];
      const fileName = isMarkdown(targetUrl) ? targetUrl.replace(MARKDOWN_EXTENSION, HTML_EXTENSION) : targetUrl;
      window.open(`${hostName}${fileName}`);
    }
  }

  handleChange(event) {
    this.setState({ editorValue: event.target.value});
  }

  async getLeafContent(item) {
    console.log(item);
    const data = await (await (
        fetch(getFetchUrl('leaf', item)).then(res => {
          return res.text();
        }).catch(err => {
          console.log('Error: ', err);
        })
    ));
    return data;
  }

  render() {
    return (
      <React.Fragment>
        <Provider theme="dark" className="spectrum-Padding">
          <svg xmlns="http://www.w3.org/2000/svg" className="helix-Icon helix-Icon--action" width="32" height="32" viewBox="0 0 32 32"><title>Helix-White</title><circle cx="4.13" cy="16" r="3.12" fill="#fff"/><circle cx="27.88" cy="16" r="3.12" fill="#fff"/><circle cx="9.76" cy="4.75" r="3.75" fill="#fff"/><circle cx="23.5" cy="4.75" r="2.5" fill="#fff"/><circle cx="23.5" cy="27.25" r="3.75" fill="#fff"/><circle cx="9.76" cy="27.25" r="2.5" fill="#fff"/><rect width="32" height="32" fill="none"/></svg>
          <ButtonGroup style={{textAlign: 'left'}} aria-label="ButtonGroup" onChange={this.change}>
            <Button label="Edit" value="edit" icon={<Edit />} />
            <Button label="View" value="view" icon={<Preview />} />
          </ButtonGroup>
        </Provider>
        <Provider theme="light">
          <ColumnView
            dataSource={this.state.dataSource}
            renderItem={renderItem}
            onSelectionChange={this.selectionChange}
            allowsSelection />
        </Provider>
        <textarea className="helix-Editor" value={this.state.editorValue} onChange={this.handleChange} />
      </React.Fragment>
    );
  }
}

export default App;