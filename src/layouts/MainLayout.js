import React from 'react'

import cn from 'classnames'

import RightMenu from './RightMenu'

import s from './MainLayout.scss'

const MainLayout = ({children}) => {
  return(
    <div className={s.body}>
      <RightMenu />
      <div className={s.bodyContent}>
        { children }
      </div>
    </div>
  );
}

export default MainLayout
