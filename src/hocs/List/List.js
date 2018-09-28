import React, { PureComponent } from 'react'
import cn from 'classnames'
import _ from 'lodash'
import VirtualList from '../../common/VirtualList'
import DefaultGhostRow from './DefaultGhost'

import s from  './List.scss'

const ROW_HEIGH = 106;

const CommonList = (List) => {
  let CommonVirtualList = VirtualList()(List);

  return class MyConfigurableList extends PureComponent {
    constructor(props) {
      super(props);

      const state = {
        itemHeight: ROW_HEIGH,
        contained: false,
        containerHeight: 0,
        itemBuffer: 0,
      };

      this.state = state;
      this.container = React.createRef();
      this.list = React.createRef();

    };
    componentDidMount(){
      CommonVirtualList = VirtualList({container: this.list.current})(List);
      this.setState({
        containerHeight:this.container.current.offsetHeight,
        itemBuffer:(Math.ceil(this.container.current.offsetHeight/ROW_HEIGH))+2,
      });

    }
    componentDidUpdate(){
      if(this.container.current.offsetHeight != this.state.containerHeight){
        this.setState({containerHeight:this.container.current.offsetHeight});
      }
      console.log('componentDidUpdate');
    }

    render() {
      console.log('this.props', this.props);
      const { entities, rowHeights } = this.props;
      return (
        <div className={s.listContainer} ref={this.container} >
          <div className={s.list} ref={this.list} style={{ overflow: 'scroll', height: this.state.containerHeight }}>
            <CommonVirtualList
              scrollTop={3180}
              items={entities}
              itemHeight={this.state.itemHeight}
              containerHeight={this.state.containerHeight}
              itemBuffer={this.state.itemBuffer}
              itemsHeight={rowHeights}
            />
          </div>
        </div>
      );
    };
  };
};

export default CommonList;
