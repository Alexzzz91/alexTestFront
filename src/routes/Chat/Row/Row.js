import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import s from './Row.scss'

import { ChatContext } from '../Chat'

class Row extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      height: 0,
      top: 0,
    };
    this.row = React.createRef();
    this.inner = React.createRef();
    this.makeStyles = this.makeStyles.bind(this);
  }
  componentDidMount(){
    if(!!this.inner.current.offsetHeight){
      this.setState({height: this.inner.current.offsetHeight});
    }
    this.makeStyles();
  }
  componentDidUpdate(){
    if(!!this.inner.current.offsetHeight){
      this.setState({height: this.inner.current.offsetHeight});
    }
    if(this.row.current.offsetHeight != this.state.height){
      this.makeStyles();
    }
  }
  makeStyles(){
    const { id, rowHeights, entities, updateRowHeight, style } = this.props;
    let arHeights = Object.keys(rowHeights).reverse();
    const clearInner = arHeights.splice(id, (Object.keys(entities).length)-id);
    let top = 0;
    for (var i = 1; i <= arHeights.length; i++) {
      top = i != 1 ? top + rowHeights[arHeights[i]] : 0;
    }
    let finStyles = {...style}
    finStyles.top = top;
    if(!!style.height && !top){
      finStyles.top = style.height*id;
    }
    if(!!this.state.height && this.inner.current.offsetHeight == this.state.height){
      finStyles.height = this.state.height;
    }else{
      finStyles.height = this.inner.current.offsetHeight;
    }
    this.setState({...finStyles});
    updateRowHeight({id, height: finStyles.height});
  }
  render(){
    const { style, index, rowHeights, entities, updateRowHeight } = this.props;
    const { height, top } = this.state;
    console.log(index);
    const msg = entities[index];
    return (
      <div className={s.row} ref={this.row} style={{height, top}}>
        <div className={s.rowInner} ref={this.inner}>
          <div className='st-prospect__left'>
            <label className="st-checkbox">
              <i className="st-checkbox__button"></i>
            </label>
          </div>
          <div className="st-prospect__col _index">
            {msg.auto} '
          </div>
          <div className="st-prospect__col">
            {msg.text}
          </div>
          <div className="st-prospect__col">
            <div className="st-text _xl _overflow" role="button"> {msg.time} </div>
          </div>
        </div>
      </div>
    )
  }
}

Row.propTypes = {
};

export default Row
