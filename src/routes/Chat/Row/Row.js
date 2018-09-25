import React from 'react'
import PropTypes from 'prop-types'

import './Row.scss'

import { ChatContext } from '../Chat'

const Row = (props) => {

  const { style, index } = props;
  console.log('props', props);
  return (
    <ChatContext.Consumer>
        {({messages}) => {
          const msg = messages[index];
          return(
            <div className="st-panel-row _flat _no-gap _bordered" style={style}>
              <div className="st-panel-row__inner">
                <div className='st-prospect__left'>
                  <label className="st-checkbox">

                    <i className="st-checkbox__button"></i>
                  </label>
                </div>
                <div className="st-prospect__col _index">
                  {msg.autor}
                </div>
                <div className="st-prospect__col">
                  {msg.text}
                </div>
                <div className="st-prospect__col">
                  <div className="st-text _xl _overflow" role="button"> {msg.time}</div>
                </div>
              </div>
            </div>
          )
        }}
      </ChatContext.Consumer>
  )
}

Row.propTypes = {
};

export default Row
