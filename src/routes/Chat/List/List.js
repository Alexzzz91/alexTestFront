import React, { PureComponent } from 'react'
import Row from '../Row/Row'
import GhostRow from '../Row/GhostRow'
import commonList from './../../../hocs/List/List'

import './List.scss'
import { ChatContext } from '../Chat'

const List = (props) => {
  //console.log(props)
  const { virtual, itemHeight } = props;
  console.log(virtual)
  return(
    <ChatContext.Consumer>
      {(context) => (
        <ul className="media-list list-group" style={virtual.style}>
          {virtual.items.map((item) => {
            console.log(item);
            return(<Row key={item.id} {...context} index={item} id={item} style={{height: itemHeight }}/>)
          })}
        </ul>
      )}
    </ChatContext.Consumer>
  );
}

export default commonList(List);
