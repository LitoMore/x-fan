import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Page, Messages, Message, Messagebar, Link} from 'framework7-react';

class FanfouMessages extends React.Component {
	static propTypes = {
		loading: PropTypes.string,
		messages: PropTypes.array,
		fetch: PropTypes.func,
		post: PropTypes.func
	}

	static defaultProps = {
		loading: false,
		messages: [],
		fetch: () => {},
		post: () => {}
	}

	constructor(props) {
		super(props);
		this.state = {
			sheetVisible: false
		};
	}

	componentDidMount() {
		this.props.fetch();
		this.timer = setInterval(() => {
			this.props.fetch();
		}, 10000);
		const self = this;
		self.$f7ready(() => {
			self.messagebar = self.messagebarComponent.f7Messagebar;
			self.messages = self.messagesComponent.f7Messages;
		});
	}

	componentWillUnmount() {
		clearInterval(this.timer);
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

	sendMessage = async () => {
		const status = this.messagebar.getValue();
		const result = await this.props.post({status});
		if (result.error) {
			this.$f7.dialog.alert(result.error, 'Error');
		} else {
			this.messagebar.clear();
		}
	}

	render() {
		const {loading, messages} = this.props;

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

				<Messages
					ref={el => {
						this.messagesComponent = el;
					}}
					scrollMessagesOnEdge
				>
					{messages.map((message, index) => (
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
								<span slot="text">{message.text}</span>
							)}
						</Message>
					))}
					{loading && (
						<Message
							typing
							first
							last
							tail
							type="received"
							header={loading}
						/>
					)}
				</Messages>
			</Page>
		);
	}
}

const mapState = state => {
	return {
		loading: state.homeTimeline.loading,
		messages: state.homeTimeline.timeline
	};
};

const mapDispatch = dispatch => {
	return {
		fetch: opt => dispatch.homeTimeline.fetch(opt),
		post: opt => dispatch.homeTimeline.post(opt)
	};
};

export default connect(mapState, mapDispatch)(FanfouMessages);
