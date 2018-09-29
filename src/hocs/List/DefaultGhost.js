import React from 'react'
import PropTypes from 'prop-types'

const GhostRow = ({ style }) => (
  <div className="st-panel-row _flat _ghost _no-gap _bordered">
    <div className="st-panel-row__inner">
      <div className='st-prospect__left'>
      </div>
      <div className="st-prospect__col">
        <div className="ghost ghost_row"></div>
      </div>
      <div className="st-prospect__col">
        <div className="ghost ghost_row"></div>
      </div>
      <div className="st-prospect__col">
        <div className="ghost ghost_row"></div>
      </div>
      <div className="st-prospect__col">
        <div className="ghost ghost_row"></div>
      </div>
    </div>
  </div>
)

GhostRow.propTypes = {
};

export default GhostRow;
