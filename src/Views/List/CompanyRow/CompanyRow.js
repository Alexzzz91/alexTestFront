import React from 'react'
import PropTypes from 'prop-types'

import './CompanyRow.scss'

const CompanyRow = ({company, location, isSelected, toggleCompany, style, index}) => {
  return (
    <div className="st-panel-row _flat _no-gap _bordered" style={style}>
      <div className="st-panel-row__inner">
        <div className='st-prospect__left'>
          <label className="st-checkbox">

            <i className="st-checkbox__button"></i>
          </label>
        </div>
        <div className="st-prospect__col _index">
          
        </div>
        <div className="st-prospect__col">
          
        </div>
        <div className="st-prospect__col">
          <div className="st-text _xl _overflow" role="button"> zxCasdasd </div>
        </div>
      </div>
    </div>
  )
}

CompanyRow.propTypes = {
};

export default CompanyRow
