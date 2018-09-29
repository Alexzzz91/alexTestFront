import React, { PureComponent } from 'react'
import Row from '../Row/Row'
import GhostRow from '../Row/GhostRow'
import commonList from './../../../hocs/List/List'

import './List.scss'
import { ChatContext } from '../Chat'

export default commonList(Row, GhostRow);
