import React from 'react';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {Page, BlockTitle, List, ListButton, Navbar, NavLeft, NavTitle} from 'framework7-react';

class FanfouSettings extends React.Component {
	static propTypes = {
		logout: PropTypes.func,
		clearTimeline: PropTypes.func
	}

	static defaultProps = {
		logout: () => {},
		clearTimeline: () => {}
	}

	componentDidMount() {
		this.$f7ready(() => {
			this.$f7.statusbar.show();
		});
	}

	render() {
		return (
			<Page>
				<Navbar>
					<NavLeft backLink="back"/>
					<NavTitle>Settings</NavTitle>
				</Navbar>
				<BlockTitle>ACCOUNT</BlockTitle>
				<List>
					<ListButton
						title="Logout"
						color="red"
						onClick={() => {
							this.$f7router.back('/login/', {
								force: true
							});
							localStorage.clear();
							this.props.logout();
							this.props.clearTimeline();
						}}
					/>
				</List>
			</Page>
		);
	}
}

const mapDispatch = dispatch => {
	return {
		logout: () => dispatch.user.logout(),
		clearTimeline: () => dispatch.homeTimeline.clearTimeline()
	};
};

export default connect(null, mapDispatch)(FanfouSettings);
