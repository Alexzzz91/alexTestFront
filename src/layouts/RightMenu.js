import React from 'react'

import cn from 'classnames'
import { Link } from 'react-router-dom'

import s from './MainLayout.scss'

import { ChatContext } from '../routes/Chat/Chat'

const RightMenu = ({ component: Component, ...rest }) => (
  <ChatContext.Consumer>
    {({chats, selectChat, loadMore, entities, setTarget, target}) => {
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
        <button onClick={loadMore}>
          loadMore
        </button>
          <input type="range"
                 name="mesage"
                 min="0"
                 max={Object.keys(entities).length-1}
                 value={target || Object.keys(entities).length-1}
                 onChange={(e) => setTarget(e.target.value)}/>

      </div>
    )
  }}
  </ChatContext.Consumer>
);

export default RightMenu
