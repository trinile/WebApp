import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import GuideStore from "../../stores/GuideStore";
import GuideActions from "../../actions/GuideActions";
import VoterStore from "../../stores/VoterStore";

export default class FollowToggle extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: {
        we_vote_id: ""
      }
    };
  }

  componentDidMount (){
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    this._onGuideStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    this._onVoterStoreChange();
  }

  componentWillUnmount (){
    this.guideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onGuideStoreChange (){
    this.setState({ is_following: GuideStore.isFollowing(this.props.we_vote_id)});
  }

  _onVoterStoreChange (){
    this.setState({ voter: VoterStore.voter()});
  }

  render () {
    if (!this.state) { return <div></div>; }
    let we_vote_id = this.props.we_vote_id;
    let is_following = this.state.is_following;
    let is_looking_at_self = this.state.voter.linked_organization_we_vote_id === we_vote_id;
    if (is_looking_at_self) { return <div></div>; }

    const followFunc = GuideActions.follow.bind(this, we_vote_id);
    const stopFollowingFunc = GuideActions.stopFollowing.bind(this, we_vote_id);
    const floatRight = { float: "right"};

    return <span style={floatRight}>
      {is_following ?
        <Button bsClass="bs-btn"
                bsStyle="info"
                bsSize="small"
                className="bs-btn-action utils-margin_bottom5"
                onClick={stopFollowingFunc}
                data-hover="Unfollow">
                <span>Following</span>
        </Button> :
        <Button bsClass="bs-btn" bsStyle="info" bsSize="small" onClick={followFunc}><span>Follow</span></Button>
      }
      </span>;
  }
}
