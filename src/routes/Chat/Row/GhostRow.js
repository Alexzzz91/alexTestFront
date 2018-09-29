import React  from 'react'
import PropTypes from 'prop-types'

const GhostRow = ({ index, style }) => (
  <div className="st-panel-row _flat _ghost _no-gap _bordered" style={style}>
    <div className="st-panel-row__inner">
      <div className="st-prospect__col">
        GhostRow
      </div>
    </div>
  </div>
)

GhostRow.propTypes = {
};

export default GhostRow
