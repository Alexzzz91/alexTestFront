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
      loading: false,
      chats:[],
      messages: {},
      total: null
    };
    this.loadChats = this.loadChats.bind(this);
    this.loadChats();
    if(!!props.match.params.chat) this.loadChat(props.match.params.chat)
  }
  componentDidMount(){
    //console.log(this);
  }
  componentDidUpdate(prevProps){
    if(prevProps.match.params.chat != this.props.match.params.chat) this.loadChat(this.props.match.params.chat);
  }
  loadChats(){
    return axios.get('//localhost:3000/chats')
      .then(({data}) => {
        this.setState({chats:data})
        if(!this.props.match.params.chat){
          this.loadChat(data[0])
        }
      })
  }
  loadChat(chat, offset=0, limit=400){
    console.log('chat', chat)
    if(this.state.loading) return;
    this.setState({loading:true});
    axios.post('//localhost:3000/get_messages', {chat, limit, offset})
      .then(({data}) => {
        const { messages, total } = data;
        let msgs = {};
        for (var i = messages.length - 1; i >= 0; i--) {
          msgs[messages[i].id] = messages[i]
        }
        const stateMsgs = this.state.messages
        this.setState({messages: {...stateMsgs, ...msgs}, total, loading:false})
      })
  }
  render() {
    const { match } = this.props;
    const { chats, messages, total, loading } = this.state;
    console.log('messages', messages);
    return(
      <ChatContext.Provider value={{ chats, messages, total }}>
        <MainLayout>
          <List chatName={match.params.chat}
                entities={Object.keys(messages)}
                total={total}
                loadMore={() => this.loadChat(match.params.chat, Object.keys(messages).length)}/>
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

export default Chat
