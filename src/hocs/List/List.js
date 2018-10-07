import React, { PureComponent } from 'react'
import cn from 'classnames'
import _ from 'lodash'
import HyperList from '../../common/hyperlist'
import DefaultGhostRow from './DefaultGhost'
import { Scrollbars } from 'react-custom-scrollbars'

const ROW_HEIGH = 74;

import s from  './List.scss'

import { ChatContext } from '../../routes/Chat/Chat';

class CommonList extends PureComponent {
  constructor(props) {
    super(props);
    const state = {
      isLoaded: false,
      containerWidth: 0,
      containerHeight: 0,
      scrollTop: 0,
      scrollBottom: 0,
      entitiesLenght: 0,
      scrollHeight: 0,
      listHeight: 0,
      savedPosition: null,
      sevedHeight: 0,
      stickyBottom: false
    };

    this.state = state;
    this.loadMoreRows = this.loadMoreRows.bind(this);
    this.isRowLoaded = this.isRowLoaded.bind(this);
    this.setContainerParams = this.setContainerParams.bind(this);
    this.setScroll = this.setScroll.bind(this);
    this.listRefresh = this.listRefresh.bind(this);
    this.container = React.createRef();
    this.scrollbar = React.createRef();
    this.list = React.createRef();
  };
  componentDidMount(){
    this.setContainerParams();
    window.addEventListener("resize", () => this.setContainerParams());
  }
  componentDidUpdate(prevProps, prevState){
    const { listHeight } = this.state;
    let newHeight = this.props.rowHeights.reduce((a, b) => a + b, 0);

    if(!!prevState.entitiesLenght && this.state.entitiesLenght < this.props.messages.length){
      this.setState({entitiesLenght:this.props.messages.length});
      this.listRefresh((newHeight - this.state.sevedHeight) + this.state.scrollTop);
    }

    if(prevProps.target != this.props.target){
      const rowHeightIndex = this.props.messages.findIndex(e => e==this.props.target);
      if(rowHeightIndex != -1 && rowHeightIndex-1 != -1 ){
        const { rowHeights } = this.props;
        let newRowHeights = [...rowHeights];
        const scrollTopArray = newRowHeights.splice(rowHeightIndex+1,this.props.rowHeights.length-1)

        const scrollTop = scrollTopArray.reduce((a, b) => a + b, 0);
        this.listRefresh(scrollTop);
      };
    }

    if(listHeight !== newHeight){
      this.setState({listHeight: newHeight});
      this.listRefresh()
    };
    if(prevProps.chatName != this.props.chatName && !!this.list.current){
      const { scrollTop } = this.list.current.state.element
      this.setState({
        entitiesLenght: 0,
        listHeight: 0
      })
      this.scrollbar.current.scrollToBottom();
    }
    if(!this.state.entitiesLenght && !!this.props.messages.length){
      this.setState({entitiesLenght:this.props.messages.length});
      //cчитаю что тут надо подождать чутка чтобы опуститься вниз
      setTimeout( () => {
        this.setState({isLoaded:true});
        this.scrollbar.current.scrollToBottom();
      }, 100);
    }
    if(this.props.messages.length !== this.state.entitiesLenght && !!this.props.messages.length && !!prevState.scrollTop){
      this.setState({scrollTop:prevState.scrollTop, entitiesLenght: this.props.messages.length})
    }
    this.setContainerParams();
  }
  componentWillUnmount(){
    window.removeEventListener("resize", () => this.setContainerParams());
  }

  listRefresh(scrollTop){
    if(!!scrollTop){
      this.scrollbar.current.scrollTop(scrollTop);
      this.list.current.wrapperNode.scrollTop = scrollTop;
      this.setState({scrollTop}, () => this.list.current.list.refresh(scrollTop));
      return;
    }
    !!this.list.current.list && this.list.current.list.refresh();
  }

  setContainerParams(){
    if(this.state.containerHeight == 0 && !!this.container.current && this.state.containerHeight !== this.container.current.offsetHeight){
      this.setState({
        containerHeight:this.container.current.offsetHeight,
        containerWidth:this.container.current.offsetWidth
      });
      this.scrollbar.current.scrollToBottom();
      this.listRefresh()
    }
  }
  isRowLoaded (index) {
    const { entities } = this.props;
    if(entities[index] === undefined && this.state.isLoaded) {
      this.loadMoreRows();
    }
    return entities[index] !== undefined;
  }

  loadMoreRows () {
    const { entities, loading, total, loadMore } = this.props;
    if (loading || entities.length == total && !entities.length) return false
    this.setState({ savedPosition: this.state.scrollTop, sevedHeight: this.state.scrollHeight })
    return loadMore();
  }

  rowRenderer (index, {entities, updateRowHeight, rowHeights}) {
    const { Row, GhostRow, messages } = this.props;
    const msg = entities[messages[index]];
    let element = <GhostRow index={messages[index]} key={'ghost_'+index}/>;
    let height = ROW_HEIGH;
    this.isRowLoaded(messages[index]);

    if(!!msg){
      element = <Row key={messages[index].id}
                     index={index}
                     prevousMsg={entities[messages[index+1]]}
                     msg={msg}
                     nextMsg={entities[messages[index-1]]}
                     updateHeight={updateRowHeight}
                     rowHeights={rowHeights}/>
      height = !!rowHeights[index] ? parseInt(rowHeights[index]+'') : ROW_HEIGH;
    }
    return { element, height };
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
  setScroll({scrollTop, scrollHeight} ){
    if(!scrollTop || this.state.scrollTop == scrollTop) return;
    this.setState({scrollHeight}, () => this.listRefresh(scrollTop));
  }
  render() {
    const { className = s.list, total, entities, messages, rowHeights} = this.props;
    return(
      <ChatContext.Consumer>
        {context => (
          <div className={className} ref={this.container}>
            <Scrollbars autoHide
                        ref={this.scrollbar}
                        onScrollFrame={(e) => this.setScroll(e)}
                        autoHideTimeout={1000}
                        autoHideDuration={200}
                        autoHeight
                        thumbMinSize={10}
                        universal={true}
                        autoHeightMin={this.state.containerHeight}
                        autoHeightMax={this.state.containerHeight}
                        style={{ height: '100%' }}>
              <HyperList ref={this.list}
                         height={this.state.containerHeight || '100%'}
                         width={'100%'}
                         itemHeight={rowHeights}
                         targetRow={this.state.targetRow}
                         total={messages.length+1}
                         reverse={true}
                         overrideScrollPosition={() => this.state.scrollTop}
                         generate={(e) => this.rowRenderer(e, context)}
                         />
            </Scrollbars>
          </div>
        )}
      </ChatContext.Consumer>
    )
  }
}

export default function commonList(RowComponent, GhostRowComponent=DefaultGhostRow) {
  return props => <CommonList {...props} Row={RowComponent} GhostRow={GhostRowComponent}/>;
}
