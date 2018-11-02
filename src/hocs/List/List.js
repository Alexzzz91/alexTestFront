import React, { PureComponent, Fragment } from 'react'
import cn from 'classnames'
import _ from 'lodash'
import DefaultGhostRow from './DefaultGhost'
import { InfiniteLoader, List, AutoSizer, Table } from './react-virtualized'
import { Scrollbars } from 'react-custom-scrollbars'

const ROW_HEIGH = 74;

import s from  './List.scss'

import { ChatContext } from '../../routes/Chat/Chat';

class CommonList extends PureComponent {
  constructor(props) {
    super(props);

    const state = {};

    this.state = state;
    this.isRowLoaded = this.isRowLoaded.bind(this);
    this.loadMoreRows = this.loadMoreRows.bind(this);
    this.getRowCount = this.getRowCount.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.noRowsRenderer = this.noRowsRenderer.bind(this);
  }
  isRowLoaded (index) {
    const { messages } = this.props;

    return messages[index] !== undefined;
  }

  loadMoreRows ({startIndex, stopIndex}) {
    const { messages, loading, total, loadMore } = this.props;

    if (loading || messages.length == total) return

    return loadMore();
  }

  getRowCount(){
    const { entities, total, loading, limit=20 } = this.props

    let count = Math.min(entities.length + 1, total || 0);

    if(!!entities.length && loading){
      let addCount = total - entities.length;

      if (addCount > limit) addCount = limit;

      count = count + (addCount-1);
    }
    return count;
  }

  onScroll({clientHeight, scrollHeight, scrollTop}) {
    this.scrollTop = scrollTop;
  }

  rowRenderer ({ key, index, style}, { updateRowHeight }) {
    const { Row, GhostRow, entities, messages } = this.props;
    return (
      this.isRowLoaded(index)
        ?
          <Row key={index}
               index={index}
               msg={entities[messages[index]]}
               prevousMsg={entities[messages[index-1]]}
               nextMsg={entities[messages[index+1]]}
               style={style}
               updateHeight={updateRowHeight}/>
        :
          <GhostRow index={index} key={'ghost_'+index} style={style}/>
    )
  }
  noRowsRenderer(){
    if(this.props.loading) return

    return (
      <div className="panel-row _flat _no-gap _prospect_row">
        <div className="panel-row__inner">
          <div className="prospect__col _cols _align-center">
            <span className="text _light _dim">No results</span>
          </div>
        </div>
      </div>
    )
  }
  render() {
    const { className = s.list, total, entities, messages, rowHeights} = this.props;
    return(
      <ChatContext.Consumer>
        {context => (
          <div className={className} ref={this.container}>
            <InfiniteLoader isRowLoaded={({index}) => this.isRowLoaded(index)}
                            loadMoreRows={(e) => this.loadMoreRows(e)}
                            rowCount={messages.length}
            >
              {({onRowsRendered, registerChild}) => (
                <AutoSizer>
                  {({ height, width }) => (
                    <Fragment>
                      <List height={height}
                            width={width}
                            onRowsRendered={onRowsRendered}
                            ref={registerChild}
                            overscanRowCount={10}
                            rowCount={messages.length}
                            //onScroll={this.onScroll}
                            rowHeight={({index}) => {
                              console.log('rowHeights[index]', rowHeights[index]);
                              console.log('rowHeights', rowHeights)
                              return  rowHeights[index] || 35}
                            }
                            //scrollTop={scrollTop}
                            rowRenderer={(e) => this.rowRenderer(e, context)}
                            noRowsRenderer={this.noRowsRenderer}
                      />
                    </Fragment>
                  )}
                </AutoSizer>
              )}
            </InfiniteLoader>
          </div>
        )}
      </ChatContext.Consumer>
    )
  }
}

export default function commonList(RowComponent, GhostRowComponent=DefaultGhostRow) {
  return props => <CommonList {...props} Row={RowComponent} GhostRow={GhostRowComponent}/>;
}
