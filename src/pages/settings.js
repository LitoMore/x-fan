import React from 'react';
import {connect} from 'react-redux';
import {Page, BlockTitle, List, ListButton} from 'framework7-react';

class FanfouSettings extends React.Component {
	render() {
		return (
			<Page>
				<BlockTitle>ACCOUNT</BlockTitle>
				<List>
					<ListButton
						title="Logout"
						color="red"
						onClick={() => {
							this.$f7router.navigate('/login/', {
								clearPreviousHistory: true
							});
							localStorage.clear();
						}}
					/>
				</List>
			</Page>
		);
	}
}

export default connect()(FanfouSettings);
