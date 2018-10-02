import React, { Component } from 'react'
import List from './List/List'
import MainLayout from '../../layouts/MainLayout'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

export const ChatContext = React.createContext();

class Chat extends Component {
  constructor(props) {
    super(props);

    const state = {
      rowHeights:[],
      loading: false,
      chats:[],
      entities:{},
      messages: [],
      total: null
    };
    this.state = state;
    this.loadChats = this.loadChats.bind(this);
    this.updateRowHeight = this.updateRowHeight.bind(this);
  }
  componentDidMount(){
    this.loadChats();
    if(!!this.props.match.params.chat) this.loadChat(this.props.match.params.chat)
  }
  componentDidUpdate(prevProps){
    if(prevProps.match.params.chat != this.props.match.params.chat){
      this.setState({
        entities:{},
        messages: [],
        rowHeights:[],
        total:null
      })
      this.loadChat(this.props.match.params.chat);
    }
  }
  loadChats(){
    return axios.get('//localhost:3000/chats')
      .then(({data}) => {
        this.setState({chats:data})
        if(!this.props.match.params.chat) this.props.history.push(data[0]);
      })
  }
  loadChat(chat, offset=0, limit=44){
    if(!!this.state.loading) return;
    this.setState({loading:true})
      axios.post('//localhost:3000/get_messages', {chat, limit, offset})
      .then(({data}) => {

        const { messages, total } = data;
        let entities = {}, array = this.state.messages;
        for (var i = 1; i < messages.length; i++) {
          array.push(messages[i].id);
          entities[messages[i].id] = messages[i]
        }
        const stateEntities = this.state.entities
        this.setState({messages: array, entities: {...stateEntities, ...entities}, total});
        setTimeout(() =>
          this.setState({loading:false}), 10)
      })
  }
  updateRowHeight({index, height}){
    let { rowHeights } = this.state;
    if(!!rowHeights[index] && rowHeights[index] === height) return;
    if(!!rowHeights[index] && rowHeights[index] != height) rowHeights[index] = height;
    rowHeights.push(height);
    this.setState({rowHeights});
  }
  render() {
    const { match } = this.props;
    const { chats, messages, entities, total, loading, rowHeights } = this.state;
    return(
      <ChatContext.Provider value={{ chats, entities, total, rowHeights, updateRowHeight:this.updateRowHeight}}>
        <MainLayout>
          <List chatName={match.params.chat}
                total={total}
                rowHeights={rowHeights}
                entities={entities}
                messages={messages}
                loading={loading}
                loadMore={() => this.loadChat(match.params.chat, Object.keys(entities).length)}/>
          <form className="form">
            <button>Smileys</button>
            <input defaultValue="msg"/>
            <button role='submit'>Send</button>
          </form>
          {!!loading &&
            <div className='Pleloader'>Load history...</div>
          }
        </MainLayout>
      </ChatContext.Provider>
    )
  }
}

Chat.propTypes = {

};

export default withRouter(Chat);
