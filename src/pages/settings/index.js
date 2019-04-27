import React from 'react';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {Page, BlockTitle, List, ListButton, Navbar, NavLeft, NavTitle, Block, Link} from 'framework7-react';
import githubBadge from '../assets/github.svg';

class FanfouSettings extends React.Component {
	static propTypes = {
		logout: PropTypes.func,
		clearTimeline: PropTypes.func
		// SwitchNightMode: PropTypes.func,
		// settings: PropTypes.object
	}

	static defaultProps = {
		logout: () => {},
		clearTimeline: () => {}
		// SwitchNightMode: () => {},
		// settings: {}
	}

	render() {
		return (
			<Page main>
				<Navbar>
					<NavLeft backLink="back"/>
					<NavTitle>Settings</NavTitle>
				</Navbar>

				{/* <BlockTitle>DISPLAY</BlockTitle>
				<List>
					<ListItem title="Night mode">
						<Toggle
							slot="after"
							checked={settings.nightMode}
							onToggleChange={activated => {
								this.props.switchNightMode(activated);
							}}
						/>
					</ListItem>
				</List> */}

				<BlockTitle>ACCOUNT</BlockTitle>
				<List>
					<ListButton
						title="Logout"
						color="red"
						onClick={() => {
							this.$f7router.back('/login/', {
								force: true
							});
							localStorage.removeItem('accounts');
							this.props.logout();
							this.props.clearTimeline();
						}}
					/>
				</List>
				<Block style={{textAlign: 'center'}}>
					<Link external href="https://github.com/LitoMore/x-fan" target="_blank">
						<img alt="github-badge" src={githubBadge}/>
					</Link>
				</Block>
			</Page>
		);
	}
}

const mapState = state => {
	return {
		settings: state.settings
	};
};

const mapDispatch = dispatch => {
	return {
		logout: () => dispatch.user.logout(),
		clearTimeline: () => dispatch.homeTimeline.clearTimeline(),
		switchNightMode: activated => dispatch.settings.switchNightMode(activated)
	};
};

export default connect(mapState, mapDispatch)(FanfouSettings);
