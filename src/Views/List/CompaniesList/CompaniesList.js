import React from 'react'
import CompanyRow from '../CompanyRow/CompanyRow'
import commonList from './../../../hocs/List/List'

import './CompaniesList.scss'

export default commonList(CompanyRow, GhostRow);
