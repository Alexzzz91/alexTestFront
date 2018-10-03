import React from 'react'

import cn from 'classnames'
import { Link } from 'react-router-dom'

import s from './MainLayout.scss'

import { ChatContext } from '../routes/Chat/Chat'

const RightMenu = ({ component: Component, ...rest }) => (
  <ChatContext.Consumer>
    {({chats, selectChat, loadMore}) => {
    return (
      <div className={s.RightMenu}>
        RightMenu
        <ul className={s.Menu} >
          {chats.map((item, i) => (
            <Link to={`/${item}`}
                  key={i}
                  className={s.MenuItem}>
              { item }
            </Link>
          ) )}
        </ul>
        <buttom onClick={() => loadMore()}>
          loadMore
        </buttom>
      </div>
    )
  }}
  </ChatContext.Consumer>
);

export default RightMenu
