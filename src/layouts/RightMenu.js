import React from 'react'

import cn from 'classnames'

import s from './MainLayout.scss'

import { ChatContext } from '../routes/Chat/Chat'

const RightMenu = ({ component: Component, ...rest }) => (
  <ChatContext.Consumer>
    {({chats, selectChat}) => {
    return (
      <div className={s.RightMenu}>
        RightMenu
        <ul className={s.Menu} >
          {chats.map(item => <li key="item" className={s.MenuItem} onClick={() => selectChat(item)}>{ item }</li> )}
        </ul>
      </div>
    )
  }}
  </ChatContext.Consumer>
);

export default RightMenu
