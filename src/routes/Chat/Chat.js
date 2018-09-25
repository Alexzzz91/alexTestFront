import React, { PureComponent } from 'react'
import List from './List/List'
import MainLayout from '../../layouts/MainLayout'
import axios from 'axios'
import PropTypes from 'prop-types'

const entities = [1,2,3,4,5,6,7,8,9,0,10,11,12,13,14,15,16,17,18,19,20,31,32,33,34,35,36,37,38,39,30,40,41,42,43,44,45,46,47,48,49,50];

export const ChatContext = React.createContext({entities});

class Chat extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      chats:[],
      messages: [],
      total: null
    };
    this.loadChat = this.loadChat.bind(this);
    this.loadChat();
  }
  componentDidMount(){
    //console.log(this);
  }
  loadChat(){
    return axios.get('//localhost:3000/chats')
      .then(({data}) => {
        this.setState({chats:data})
        this.selectChat(data[0])
      })
  }
  selectChat(chat){
    axios.post('//localhost:3000/get_messages', {chat})
      .then(({data}) => {
        const { messages, total } = data;
        this.setState({messages, total})
      })
  }
  render() {
    const { match } = this.props;
    const { chats, messages, total  } = this.state;
    return(
      <ChatContext.Provider value={{ chats, messages, total, selectChat:e => this.selectChat(e) }}>
        <MainLayout>
          <List chatName={match.params.chat} entities={messages} total={messages.length}/>
        </MainLayout>
      </ChatContext.Provider>
    )
  }
}

Chat.propTypes = {
};

export default Chat
