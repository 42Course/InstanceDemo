import React, { Component } from 'react'

import { List, message, Avatar, Spin } from 'antd';
import 'antd/dist/antd.css';
import '../index.css';
import reqwest from 'reqwest';

import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';

const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

class ContentList extends React.Component {
  state = {
    data: [],
    loading: false,
  }
  loadedRowsMap = {}
  getData = (callback) => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: (res) => {
        callback(res);
      },
    });
  }
  componentDidMount() {
    // this.getData((res) => {
    //   this.setState({
    //     data: res.results,
    //   });
    // });
    const { here, account, web3 } = this.props;
    here.checkInfo.call({
      from: account
    }).then((result) => {
      const count = result[1].toNumber();

      if (count === 0) {
        this.setState({loading: false});
        return;
      }

      this.loadPlaces(count);
    });
  }
  loadPlaces(count) {
    const { account, here, web3 } = this.props;
    const request = [];

    for (var i = 0; i < count; i++) {
      request.push(here.checkPlace.call(i, {from: account, gas: 310000}));
    }

    Promise.all(request)
    .then((values) =>{
      const places = values.map(value => ({
        content: value[0],
        photo: value[1],
        location: value[2],
        createTime: new Date(value[3].toNumber() * 1000).toString()
      }));

      this.setState({
         data: places,
         loading: false
      });
    });


  }

  handleInfiniteOnLoad = ({ startIndex, stopIndex }) => {
    let data = this.state.data;
    this.setState({
      loading: true,
    });
    for (let i = startIndex; i <= stopIndex; i++) {
      // 1 means loading
      this.loadedRowsMap[i] = 1;
    }
    if (data.length > 19) {
      message.warning('Virtualized List loaded all');
      this.setState({
        loading: false,
      });
      return;
    }
    this.getData((res) => {
      data = data.concat(res.results);
      this.setState({
        data,
        loading: false,
      });
    });
  }
  isRowLoaded = ({ index }) => {
    return !!this.loadedRowsMap[index];
  }
  renderItem = ({ index, key, style }) => {
    const { data } = this.state;
    const item = data[index];
    return (
      <List.Item key={key} style={style}>
        <List.Item.Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={item.content}
          description={item.location}
          time={item.createTime}
        />
        <div>Content</div>
      </List.Item>
    );
  }
  render() {
    const { data } = this.state;
    const vlist = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width }) => (
      <VList
        autoHeight
        height={height}
        isScrolling={isScrolling}
        onScroll={onChildScroll}
        overscanRowCount={2}
        rowCount={data.length}
        rowHeight={73}
        rowRenderer={this.renderItem}
        onRowsRendered={onRowsRendered}
        scrollTop={scrollTop}
        width={width}
      />
    );
    const autoSize = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered }) => (
      <AutoSizer disableHeight>
        {({ width }) => vlist({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width })}
      </AutoSizer>
    );
    const infiniteLoader = ({ height, isScrolling, onChildScroll, scrollTop }) => (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.handleInfiniteOnLoad}
        rowCount={data.length}
      >
        {({ onRowsRendered }) => autoSize({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered })}
      </InfiniteLoader>
    );
    return (
      <List>
        {
          data.length > 0 && (
            <WindowScroller>
              {infiniteLoader}
            </WindowScroller>
          )
        }
        {this.state.loading && <Spin className="demo-loading" />}
      </List>
    );
  }
}

export default ContentList