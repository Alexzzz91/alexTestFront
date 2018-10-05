import React from 'react'
import PropTypes from 'prop-types'

const GhostRow = ({ style }) => (
  <div className="panel-row _flat _ghost _no-gap _bordered">
    <div className="panel-row__inner">
      <div className='prospect__left'>
      </div>
      <div className="prospect__col">
        <div className="ghost ghost_row"></div>
      </div>
      <div className="prospect__col">
        <div className="ghost ghost_row"></div>
      </div>
      <div className="prospect__col">
        <div className="ghost ghost_row"></div>
      </div>
      <div className="prospect__col">
        <div className="ghost ghost_row"></div>
      </div>
    </div>
  </div>
)

GhostRow.propTypes = {
};

export default GhostRow;
