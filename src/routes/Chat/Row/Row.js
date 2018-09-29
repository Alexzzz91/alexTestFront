import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import cn from 'classnames'
import s from './Row.scss'

import { ChatContext } from '../Chat'


class Row extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      height:0,
      isOpen: false
    }
    this.row = React.createRef();
    this.inner = React.createRef();
    this.updateHeight = this.updateHeight.bind(this);
  }
  componentDidMount(){
    this.updateHeight()
  }
  componentDidUpdate(){
    const { height } = this.state;
    if(this.inner.current.offsetHeight != this.row.current.offsetHeight ||
       height != this.inner.current.offsetHeight || height == 0) this.updateHeight()
  }

  updateHeight(){
    const { index, msg, updateHeight } = this.props;
    const height = this.inner.current.offsetHeight
    this.setState({height}, () => updateHeight({index, height}) );
  }
  render(){
    const { isOpen } = this.state;
    const { style, msg, rowHeights, index } = this.props;
    return (
      <div className={cn(s.row,{[s.rowOpen]:isOpen })} style={style} ref={this.row} onClick={() => this.setState({isOpen: !isOpen}, () => this.updateHeight())}>
        <div className={s.rowInner} ref={this.inner}>
          <div className='st-prospect__left'>
           msg.id:{msg.id} - index:{index}
          </div>
          <div className="st-prospect__col _index">
            {msg.autor}
          </div>
          <div className="st-prospect__col">
            {msg.text}
          </div>
          <div className="st-prospect__col">
            <div className="st-text _xl _overflow" role="button"> {moment.unix(msg.time).format("MM/DD/YYYY, h:mm:ss ")} </div>
          </div>
        </div>
      </div>
    )
  }
}

Row.propTypes = {
};

export default Row
