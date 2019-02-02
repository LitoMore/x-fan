import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Page, Messages, Message, Messagebar, Link, MessagebarAttachments, MessagebarAttachment, PhotoBrowser} from 'framework7-react';

class FanfouMessages extends React.Component {
	static propTypes = {
		loading: PropTypes.object,
		sending: PropTypes.object,
		settings: PropTypes.object,
		messages: PropTypes.array,
		fetch: PropTypes.func,
		post: PropTypes.func
	}

	static defaultProps = {
		loading: null,
		sending: null,
		settings: {},
		messages: [],
		fetch: () => {},
		post: () => {}
	}

	constructor(props) {
		super(props);
		this.state = {
			photo: null,
			photos: []
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
		const {photo} = this.state;
		const status = this.messagebar.getValue();
		const params = {status};
		if (photo) {
			params.photo = photo.file;
		}

		try {
			const result = await this.props.post(params);
			if (result.error) {
				this.$f7.dialog.alert(result.error, 'Error');
			} else {
				const fileDOM = document.querySelector('#file');
				fileDOM.value = '';
				this.messagebar.clear();
				this.setState({photo: null});
			}
		} catch (error) {
			if (photo) {
				this.$f7.dialog.alert('图片文件过大');
			} else {
				this.$f7.dialog.alert('发送失败');
			}
		}
	}

	render() {
		const {loading, sending, messages} = this.props;
		const {photo, photos} = this.state;
		const messageStyle = window.innerWidth > 400 ? {
			maxWidth: 300
		} : null;

		return (
			<Page name="messages">
				<input
					id="file"
					type="file"
					accept="image/gif, image/jpeg, image/png, image/jpg"
					style={{display: 'none'}}
					onChange={() => {
						const fileDOM = document.querySelector('#file');
						const [file] = fileDOM.files;
						if (file) {
							const reader = new FileReader();
							reader.addEventListener('load', e => {
								const {result: url} = e.target;
								this.setState({
									photo: {file, url}
								});
							});
							reader.readAsDataURL(file);
						}
					}}
				/>

				{photos.length > 0 ? (
					<PhotoBrowser
						ref={el => {
							this.photoBrowser = el;
						}}
						theme={this.props.settings.nightMode ? 'dark' : 'light'}
						navbar={false}
						toolbar={false}
						photos={photos}
						onPhotoBrowserClose={() => {
							this.setState({photos: []});
						}}
					/>
				) : null}

				<Messagebar
					ref={el => {
						this.messagebarComponent = el;
					}}
					attachmentsVisible={Boolean(photo)}
					sheetVisible={this.state.sheetVisible}
				>
					<Link
						iconIos="f7:camera_fill"
						iconMd="material:camera_alt"
						slot="inner-start"
						onClick={() => {
							if (sending) {
								return;
							}

							const fileDOM = document.querySelector('#file');
							fileDOM.click();
						}}
					/>
					<Link
						iconIos="f7:more_round_fill"
						iconMd="material:more_vert"
						slot="inner-start"
						onClick={() => {
							if (sending) {
								return;
							}

							this.$f7router.navigate('/settings/');
						}}
					/>
					<Link
						iconIos="f7:arrow_up_round_fill"
						iconMd="material:send"
						slot="inner-end"
						onClick={() => {
							if (sending) {
								return;
							}

							this.sendMessage();
						}}
					/>
					<MessagebarAttachments>
						{photo ? (
							<MessagebarAttachment
								image={photo.url}
								onAttachmentDelete={() => {
									const fileDOM = document.querySelector('#file');
									fileDOM.value = '';
									this.setState({photo: null});
								}}
							/>
						) : null}
					</MessagebarAttachments>
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
							style={message.image ? messageStyle : null}
							image={message.image}
							name={message.name}
							avatar={message.avatar}
							first={this.isFirstMessage(message, index)}
							last={this.isLastMessage(message, index)}
							tail={this.isTailMessage(message, index)}
							onClickBubble={() => {
								if (message.image) {
									this.setState({photos: [message.image]}, () => {
										this.photoBrowser.open();
									});
								}
							}}
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
							header={loading.header}
							avatar={loading.avatar}
						/>
					)}
				</Messages>
			</Page>
		);
	}
}

const mapState = state => {
	return {
		sending: state.homeTimeline.sending,
		loading: state.homeTimeline.loading,
		messages: state.homeTimeline.timeline,
		settings: state.settings
	};
};

const mapDispatch = dispatch => {
	return {
		fetch: opt => dispatch.homeTimeline.fetch(opt),
		post: opt => dispatch.homeTimeline.post(opt)
	};
};

export default connect(mapState, mapDispatch)(FanfouMessages);
