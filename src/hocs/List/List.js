import React, { PureComponent } from 'react'
import cn from 'classnames'
import { InfiniteLoader, List, AutoSizer, Table } from 'react-virtualized'
import DefaultGhostRow from './DefaultGhost'

const ROW_HEIGH = 56;

import './List.scss'

class CommonList extends PureComponent {
  isRowLoaded (index) {
    const { entities } = this.props;

    return entities[index] !== undefined;
  }

  loadMoreRows ({startIndex, stopIndex}) {
    const { entities, loading, total, loadMore } = this.props;

    if (loading || entities.length == total) return

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

  componentWillUnmount(){
    const { setScrollTop } = this.props;
    try {
      setScrollTop(this.scrollTop);
    } catch (e) {
      console.log('tab closed');
    }
  }

  rowRenderer ({ key, index, style}) {
    const { Row, GhostRow, rowProps, entities } = this.props;
    const entityId = entities[index];

    key =_.isObject(entityId) ? key : entityId;

    return (
      this.isRowLoaded(index)
        ?
          <Row key={key} index={index} id={entityId} style={style} rowProps={rowProps}/>
        :
          <GhostRow index={index} key={'ghost_'+index} style={style}/>
    )
  }
  noRowsRenderer(){
    if(this.props.loading) return

    return (
      <div className="st-panel-row _flat _no-gap _prospect_row">
        <div className="st-panel-row__inner">
          <div className="st-prospect__col _cols _align-center">
            <span className="st-text _light _dim">No results</span>
          </div>
        </div>
      </div>
    )
  }
  getFullHeigt(rowCount) {
    const { entities, rowHeight = ROW_HEIGH } = this.props;

    if (_.isFunction(rowHeight)) {
      return entities.reduce( (height, item) => {
        return height + rowHeight(item);
      }, 0)
    } else {
      return rowCount * rowHeight;
    }
  }

  render() {
    const { entities, scrollTop, className = 'st-new-layout-tabs-list', rowHeight = ROW_HEIGH} = this.props;
    const rowCount = this.getRowCount();

    const getHeight = _.isFunction(rowHeight) ? rowHeight : () => rowHeight

    return(
      <div className={className}>
        <InfiniteLoader isRowLoaded={({index}) => this.isRowLoaded(index)}
                        loadMoreRows={(e) => this.loadMoreRows(e)}
                        rowCount={rowCount}
        >
          {({onRowsRendered, registerChild}) => (
            <AutoSizer>
              {({ height, width }) => (
                <List height={height}
                      className={ cn('', { "full-height-scroll": height > this.getFullHeigt(rowCount) }) }
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                      overscanRowCount={10}
                      rowCount={rowCount}
                      onScroll={(e)=> this.onScroll(e)}
                      rowHeight={({index}) => getHeight(entities[index])}
                      scrollTop={scrollTop}
                      rowRenderer={(e) => this.rowRenderer(e)}
                      noRowsRenderer={() => this.noRowsRenderer()}
                      width={width}
                />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </div>
    )
  }
}

export default function commonList(RowComponent, GhostRowComponent=DefaultGhostRow) {
  return props => <CommonList {...props} Row={RowComponent} GhostRow={GhostRowComponent}/>;
}
