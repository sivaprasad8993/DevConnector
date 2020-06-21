import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfiles } from '../../actions/profile';
import ProfileItem from './ProfileItem';
import Spinner from "../layout/Spinner";


const Profiles = ({ profile: { profiles, loading }, getProfiles }) => {
    useEffect(() => {
        getProfiles();
    }, [])
    return (
        <Fragment>
            {loading ? <Spinner /> : <Fragment>
                <h1 className="large text-primary">Devolopers</h1>
                <p className='lead'><i className='fa fa-connectdevelop' /> Browse and connect with devolopers</p>
                <div className="profiles">
                    {profiles.length > 0 ? (
                        profiles.map(profile => (
                            <ProfileItem id={profile._id} profile={profile} />
                        ))
                    ) : <h4>No profiles Found</h4>}
                </div>
            </Fragment>}
        </Fragment>
    )
}

Profiles.propTypes = {
    profile: PropTypes.object.isRequired,
    getProfiles: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(Profiles);
