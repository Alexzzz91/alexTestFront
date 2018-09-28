import SassPlugin from "@pawjs/sass/webpack";


export default class ProjectWebpack {
  constructor(props) {
    const { addPlugin } = props;
    console.log('props', props);
    console.log('ProjectWebpack');
    addPlugin(new SassPlugin);

  }
}
