import React from 'react';
import {Page, Messagebar, Link} from 'framework7-react';

export default class extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
      attachments: [],
      sheetVisible: false,
      typingMessage: null,
      messagesData: [
        {
          type: 'sent',
          text: 'Hi, Kate',
        },
        {
          type: 'sent',
          text: 'How are you?',
        },
        {
          name: 'Kate',
          type: 'received',
          text: 'Hi, I am good!',
          avatar: 'http://lorempixel.com/100/100/people/9',
        },
        {
          name: 'Blue Ninja',
          type: 'received',
          text: 'Hi there, I am also fine, thanks! And how are you?',
          avatar: 'http://lorempixel.com/100/100/people/7',
        },
        {
          type: 'sent',
          text: 'Hey, Blue Ninja! Glad to see you ;)',
        },
        {
          type: 'sent',
          text: 'Hey, look, cutest kitten ever!',
        },
        {
          type: 'sent',
          image: 'http://lorempixel.com/200/260/cats/4/',

        },
        {
          name: 'Kate',
          type: 'received',
          text: 'Nice!',
          avatar: 'http://lorempixel.com/100/100/people/9',
        },
        {
          name: 'Kate',
          type: 'received',
          text: 'Like it very much!',
          avatar: 'http://lorempixel.com/100/100/people/9',
        },
        {
          name: 'Blue Ninja',
          type: 'received',
          text: 'Awesome!',
          avatar: 'http://lorempixel.com/100/100/people/7',
        },
      ],
      people: [
        {
          name: 'Kate Johnson',
          avatar: 'http://lorempixel.com/100/100/people/9',
        },
        {
          name: 'Blue Ninja',
          avatar: 'http://lorempixel.com/100/100/people/7',
        },
      ],
      answers: [
        'Yes!',
        'No',
        'Hm...',
        'I am not sure',
        'And what about you?',
        'May be ;)',
        'Lorem ipsum dolor sit amet, consectetur',
        'What?',
        'Are you sure?',
        'Of course',
        'Need to think about it',
        'Amazing!!!',
      ],
      responseInProgress: false,
    }
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
						iconIos="f7:camera_fill"
						iconMd="material:camera_alt"
						slot="inner-start"
						onClick={() => {
							this.setState(prevState => {
								return {sheetVisible: !prevState.sheetVisible};
							});
						}}
					/>
					<Link
						iconIos="f7:arrow_up_fill"
						iconMd="material:send"
						slot="inner-end"
						onClick={this.sendMessage}
					/>
				</Messagebar>
			</Page>
		);
	}
}
