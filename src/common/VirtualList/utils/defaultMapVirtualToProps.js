const defaultMapToVirtualProps = ({
  items,
  itemsHeight,
  containerHeight,
  scrollTop
}, {
  firstItemIndex,
  lastItemIndex,
}) => {
  const visibleItems = lastItemIndex > -1 ? items.slice(firstItemIndex, lastItemIndex + 1) : [];
  console.log('itemsHeight', itemsHeight);
  const arHeights= Object.keys(itemsHeight);
  let height = 0;
  let paddingTop = 0
  for (var i = 1; i <= height.length; i++) {
    if(firstItemIndex < i) paddingTop = paddingTop+itemsHeight[i];
    height = height+itemsHeight[i];
  }
  // style
  height = height > 0 ? height : containerHeight;
  paddingTop = paddingTop > 0 ? paddingTop : 0;

  return {
    virtual: {
      items: visibleItems,
      style: {
        height,
        paddingTop,
        boxSizing: 'border-box',
      },
    }
  };
}

export default defaultMapToVirtualProps;
