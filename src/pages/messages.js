import React from 'react';
import {connect} from 'react-redux';
import {Page, Messages, Message, MessagesTitle, Messagebar, Link} from 'framework7-react';

class FanfouMessages extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sheetVisible: false
		};
	}

	componentDidMount() {
		this.props.fetch();
	}

	isFirstMessage(message, index) {
		const self = this;
		const previousMessage = self.props.messages[index - 1];
		if (message.isTitle) {
			return false;
		}
		if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) {
			return true;
		}
		return false;
	}

	isLastMessage(message, index) {
		const self = this;
		const nextMessage = self.props.messages[index + 1];
		if (message.isTitle) {
			return false;
		}
		if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) {
			return true;
		}
		return false;
	}

	isTailMessage(message, index) {
		const self = this;
		const nextMessage = self.props.messages[index + 1];
		if (message.isTitle) {
			return false;
		}
		if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) {
			return true;
		}
		return false;
	}

	render() {
		return (
			<Page name="messages">
				<Messagebar
					ref={el => {
						this.messagebarComponent = el;
					}}
					attachmentsVisible={this.attachmentsVisible}
					placeholder={this.placeholder}
					sheetVisible={this.state.sheetVisible}
				>
					<Link
						iconIos="f7:arrow_up_fill"
						iconMd="material:send"
						slot="inner-end"
						onClick={this.sendMessage}
					/>
				</Messagebar>

				<Messages ref={el => {
					this.messagesComponent = el;
				}}
				>
					<MessagesTitle><b>Wednesday, Nov 7,</b> 22:31</MessagesTitle>

					{this.props.messages.map((message, index) => (
						<Message
							key={message.id}
							type={message.type}
							image={message.image}
							name={message.name}
							avatar={message.avatar}
							first={this.isFirstMessage(message, index)}
							last={this.isLastMessage(message, index)}
							tail={this.isTailMessage(message, index)}
						>
							{message.text && (
								<span slot="text" dangerouslySetInnerHTML={{__html: message.text}}/>
							)}
						</Message>
					))}
					{this.state.typingMessage && (
						<Message
							type="received"
							typing
							first
							last
							tail
							header={`${this.state.typingMessage.name} is typing`}
							avatar={this.state.typingMessage.avatar}
						/>
					)}
				</Messages>
			</Page>
		);
	}
}

const mapState = state => {
	const [current] = state.user.accounts;
	return {
		current,
		messages: state.homeTimeline.timeline
	};
};

const mapDispatch = dispatch => {
	return {
		fetch: opt => dispatch.homeTimeline.fetch(opt)
	};
};

export default connect(mapState, mapDispatch)(FanfouMessages);
