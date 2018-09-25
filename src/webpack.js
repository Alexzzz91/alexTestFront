import SassPlugin from "@pawjs/sass/webpack";


export default class ProjectWebpack {
  constructor({addPlugin}) {
    console.log('ProjectWebpack');
    addPlugin(new SassPlugin);

  }
}
