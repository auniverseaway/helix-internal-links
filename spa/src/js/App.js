import React, { Component } from 'react';
import Provider from '@react/react-spectrum/Provider';
import Button from '@react/react-spectrum/Button';
import Edit from '@react/react-spectrum/Icon/Edit';
import ButtonGroup from '@react/react-spectrum/ButtonGroup';
import {ColumnView, ColumnViewDataSource} from '@react/react-spectrum/ColumnView';
import unescapeJs from 'unescape-js';

class HelixDS extends ColumnViewDataSource {
  async getChildren(item) {
    if (!item) {
      return this.getTree('master');
    }
    if (item.children) {
      return this.getTree(item.sha);
    }
    return item.children;
  }

  hasChildren(item) {
    return !!item.children;
  }

  isItemEqual(a, b) {
    return a.label === b.label;
  }

  async getTree(sha) {
    const data = await (await (
        fetch('http://localhost:3000/index.tree.json', {
          headers: {
            'x-helix-git-tree': sha
          }
        }).then(res => {
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
      const sha = this.state.selectedItems[0].sha;
      const content = await this.getLeafContent(sha);
      
      this.setState({ editorValue: sanitizeMarkdown(content) });
    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  async getLeafContent(sha) {
    const fetchUrl = new URL('http://localhost:3000/index.leaf.json');
    fetchUrl.searchParams.append('sha', sha);
    const data = await (await (
        fetch(fetchUrl).then(res => {
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
          </ButtonGroup>
        </Provider>
        <Provider theme="light">
          <ColumnView
            dataSource={this.state.dataSource}
            renderItem={renderItem}
            onSelectionChange={this.selectionChange}
            allowsSelection />
        </Provider>
        <textarea className="helix-Editor" value={this.state.editorValue} />
      </React.Fragment>
    );
  }
}

export default App;