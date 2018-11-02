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
      isOpen: false,
      someAutor: false,
      showTime: true,
      showDateTitle: false,
    }
    this.row = React.createRef();
    this.inner = React.createRef();
    this.dateLine = React.createRef();
    this.updateHeight = this.updateHeight.bind(this);
  }
  componentDidMount(){
    this.updateHeight()
  }
  componentDidUpdate(){
    const { height } = this.state;
    const { prevousMsg, nextMsg, msg, index } = this.props;
    const someAutor = !!prevousMsg && prevousMsg.autor === msg.autor;
    const showDateTitle = !!prevousMsg && moment.unix(prevousMsg.time).format("MM/DD/YYYY") !== moment.unix(msg.time).format("MM/DD/YYYY");
    const showTime = !!prevousMsg && (msg.time - prevousMsg.time) > 15 || index == 0;

    this.setState({someAutor, showDateTitle, showTime});
    let offsetHeight = this.inner.current.offsetHeight;
    if(showDateTitle) offsetHeight = offsetHeight+36;
    if(height != offsetHeight || height == 0) this.updateHeight()
  }

  updateHeight(){
    const { index, msg, updateHeight } = this.props;
    const { showDateTitle } = this.state;
    let height = this.inner.current.offsetHeight
    let dateLineHeight = 0;
    if(showDateTitle && !!this.dateLine && !!this.dateLine.current){
      dateLineHeight = this.dateLine.current.offsetHeight;
    }
    this.setState({height: height+dateLineHeight}, () => updateHeight({index, height: height+dateLineHeight}) );
  }
  render(){
    const { isOpen, showDateTitle, someAutor, showTime } = this.state;
    const { style, msg, index, prevousMsg, nextMsg } = this.props;
    return (
        <div className={cn(s.row,{[s.rowOpen]:isOpen, [s.rowHideTime]: !showTime && someAutor})}
             style={style}
             ref={this.row}
             onClick={() => this.setState({isOpen: !isOpen}, () => this.updateHeight())}>
          { showDateTitle &&
            <div className={s.rowDate} ref={this.dateLine}>
              { moment.unix(msg.time).format("MMMM DD YYYY")}
            </div>
          }
          <div className={s.rowInner} ref={this.inner}>
            <div className={cn(s.rowRow, {[s._left]: msg.autor === "no alk", [s._right]: msg.autor === "alk"})}>
              <div>
               <div className={`${s.text} ${s.time}`}>index:{index}</div>
              </div>
              <div className={`${s.rowRowCol} ${s._index}`}>
                <div className={`${s.text} ${s.time}`}>{ (!someAutor || showTime) && msg.autor }</div>
              </div>
              <div>
                <div className={`${s.text} ${s.time}`} role="button"> {moment.unix(msg.time).format("h:mm:ss a")} </div>
              </div>
            </div>
            <div className={s.rowRow}>
              <div className={`${s.rowRowCol}`}>
                {msg.text}
              </div>
            </div>
          </div>
        </div>
    )
  }
}

Row.propTypes = {
};

export default Row
