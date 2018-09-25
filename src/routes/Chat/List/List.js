import React from 'react'
import Row from '../Row/Row'
import GhostRow from '../Row/GhostRow'
import commonList from './../../../hocs/List/List'

import './List.scss'

export default commonList(Row, GhostRow);
