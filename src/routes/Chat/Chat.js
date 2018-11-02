import React, { Component } from 'react'
import List from './List/List'
import MainLayout from '../../layouts/MainLayout'
import axios from 'axios'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import config from '../../../config.json'

import openSocket from 'socket.io-client'

import s from  './Chat.scss'

export const ChatContext = React.createContext();

class Chat extends Component {
  constructor(props) {
    super(props);

    const state = {
      message: '',
      rowHeights:[],
      loading: false,
      chats:[],
      entities:{},
      target: null,
      messages: [],
      total: 0
    };
    this.socket = openSocket(`http://localhost:${config.serverPort}`);
    this.state = state;
    this.loadChats = this.loadChats.bind(this);
    this.updateRowHeight = this.updateRowHeight.bind(this);
    this.handleChangeMessage = this.handleChangeMessage.bind(this);
    this.setTargetMesage = this.setTargetMesage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount(){
    this.loadChats();
    if(!!this.props.match.params.chat) this.loadChat(this.props.match.params.chat)
    if(!!this.props.match.params.chat && !!this.props.match.params.messageId){
      this.setState({target:this.props.match.params.messageId});
    }
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
    setInterval(() => {
      this.loadChat(this.props.match.params.chat, Object.keys(this.state.entities).length)
    }, 1000)
  }
  loadChats(){
    return axios.get(`http://localhost:${config.serverPort}/chats`)
      .then(({data}) => {
        this.setState({chats:data})
        if(!this.props.match.params.chat) this.props.history.push(data[0]);
      })
  }
  loadChat(chat, offset=0, limit=3){
    if(!!this.state.loading) return;
    this.setState({loading:true})
      axios.post(`http://localhost:${config.serverPort}/get_messages`, {chat, limit, offset})
      .then(({data}) => {
        const { messages, total } = data;
        let entities = {}, array = [ ...this.state.messages ]
        for (var i = 1; i < messages.length; i++) {
          array.unshift(messages[i].id);
          entities[messages[i].id] = messages[i]
        }
        const stateEntities = this.state.entities
        this.setState({messages: array, entities: {...stateEntities, ...entities}, total});
        setTimeout(() =>
          this.setState({loading:false}), 100)
      })
      .catch(err => this.props.history.push(''))
  }
  updateRowHeight({index, height}){
    let { rowHeights } = this.state;
    if(!!rowHeights[index] && rowHeights[index] === height) return;
    if(!!rowHeights[index] && rowHeights[index] != height){
      rowHeights[index] = height;
    }else{
      rowHeights.push(height);
    }
    this.setState({rowHeights});
  }
  handleChangeMessage({target}){
    this.setState({message: target.value})
  }
  setTargetMesage(target){
    let res;
    Object.keys(this.state.entities).forEach((element, i) => {
      if (target == i){
        res = this.state.entities[element].id;
      }
    });
    const {chat} = this.props.match.params;
    this.props.history.push(`/${chat}/${res}`);
    this.setState({target:res})
  }
  handleSubmit(e){
    e.preventDefault()
    let { entities, messages } = this.state;
    const { message } = this.state;
    if(!message) return;
    const messageObj = {
      id: messages[0]+1,
      autor: "alk",
      time: moment().unix(),
      text: message
    }
    entities[messages[0]+1] = messageObj;
    messages.unshift(messages[0]+1);
    this.socket && this.socket.emit && this.socket.emit('message', {
      chatName: this.props.match.params.chat,
      messageObj
    });

    this.setState({entities, messages, message: ''})
  }
  render() {
    const { match } = this.props;
    const { chats, messages, entities, total, loading, rowHeights, target, message } = this.state;
    return(
      <ChatContext.Provider value={{ chats,
                                     entities,
                                     total,
                                     target,
                                     rowHeights,
                                     updateRowHeight:this.updateRowHeight,
                                     loadMore: () => this.loadChat(match.params.chat, Object.keys(entities).length),
                                     setTarget: target => this.setTargetMesage(target)
                                   }}
                                     >
        <MainLayout>
          <List chatName={match.params.chat}
                total={total}
                rowHeights={rowHeights}
                entities={entities}
                target={target}
                messages={messages}
                loading={loading}
                loadMore={() => this.loadChat(match.params.chat, Object.keys(entities).length)}/>
          <form className="form" onSubmit={this.handleSubmit}>
            <button>Smileys</button>
            <input value={message}
                   className={s.formInput}
                   onChange={this.handleChangeMessage}/>
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
